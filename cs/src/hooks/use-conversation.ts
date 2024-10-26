import { useCallback, useEffect, useRef, useState } from "react";

import { WavRecorder, WavStreamPlayer } from "@/lib/wavtools/index.js";
import { getConversationAnalysis } from "@/repository/api/conversationAnalysis";
import { ConversationAnalysis } from "@/types/conversationAnalysis";
import { instructions } from "@/utils/conversation_config";
import { RealtimeClient } from "@openai/realtime-api-beta";
import { AssistantItemType, BaseItemType, FormattedItemType, FormattedPropertyType, FunctionCallItemType, FunctionCallOutputItemType, ItemType, SystemItemType, UserItemType } from "@openai/realtime-api-beta/dist/lib/client.js";
import { toast } from "sonner";
import { useSupabaseClient } from "./use-supabaseClient";
import { ConversationSessionWithChildren, Message, MessageWithChildren } from "@/types/conversation";

interface RealtimeEvent {
	time: string;
	source: "client" | "server";
	count?: number;
	event: { [key: string]: any };
}

type MessageType = {
	id: string;
	role: "assistant" | "user" | "system" | undefined
	content: string | null;
	formatted: FormattedPropertyType;
};

const useConversation = ({
	conversationSessionId,
	prevConversationSessionWithChildren,
}: { conversationSessionId: string, prevConversationSessionWithChildren?: ConversationSessionWithChildren }) => {
	const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
	const { client: supabaseClient, session } = useSupabaseClient()
	/**
	 * Instantiate:
	 * - WavRecorder (speech input)
	 * - WavStreamPlayer (speech output)
	 * - RealtimeClient (API client)
	 */
	const wavRecorderRef = useRef<WavRecorder>(
		new WavRecorder({ sampleRate: 24000 }),
	);
	const wavStreamPlayerRef = useRef<WavStreamPlayer>(
		new WavStreamPlayer({ sampleRate: 24000 }),
	);
	const clientRef = useRef<RealtimeClient>(
		new RealtimeClient({
			apiKey: apiKey,
			dangerouslyAllowAPIKeyInBrowser: true,
		}),
	);

	const scrollRef = useRef<HTMLDivElement | null>(null);
	const itemIdHistories = useRef<string[]>([])

	/**
	 * All of our variables for displaying application state
	 * - items are all conversation items (dialog)
	 * - realtimeEvents are event logs, which can be expanded
	 * - memoryKv is for set_memory() function
	 * - coords, marker are for get_weather() function
	 */
	const [items, setItems] = useState<ItemType[]>([]);
	const [messages, setMessages] = useState<MessageType[]>([]);
	const [realtimeEvents, setRealtimeEvents] = useState<RealtimeEvent[]>([]);
	const [isConnected, setIsConnected] = useState(false);
	const [canPushToTalk, setCanPushToTalk] = useState(true);
	const [isRecording, setIsRecording] = useState(false);
	const [conversationAnalysis, setConversationAnalysis] = useState<
		{ conversationAnalysis: ConversationAnalysis; item_id: string }[]
	>([]);
	/**
	 * Connect to conversation:
	 * WavRecorder taks speech input, WavStreamPlayer output, client is API client
	 */
	const connectConversation = useCallback(async () => {
		const client = clientRef.current;
		const wavRecorder = wavRecorderRef.current;
		const wavStreamPlayer = wavStreamPlayerRef.current;

		// Set state variables
		setIsConnected(true);
		setRealtimeEvents([]);
		setItems(client.conversation.getItems());
		setMessages(client.conversation.getItems().map((item) => ({
			id: item.id,
			role: item.role,
			content: item.formatted.transcript || null,
			formatted: item.formatted,
		})))
		// Connect to microphone
		await wavRecorder.begin();

		// Connect to audio output
		await wavStreamPlayer.connect();

		// Connect to realtime API
		await client.connect();

		// client.sendUserMessageContent([
		// 	{
		// 		type: `input_text`,
		// 		text: `Hello!`,
		// 	},
		// ]);

		if (client.getTurnDetectionType() === "server_vad") {
			await wavRecorder.record((data) => client.appendInputAudio(data.mono));
		}
	}, []);

	/**
	 * Disconnect and reset conversation state
	 */
	const disconnectConversation = useCallback(async () => {
		setIsConnected(false);
		setRealtimeEvents([]);

		const client = clientRef.current;
		client.disconnect();

		const wavRecorder = wavRecorderRef.current;
		await wavRecorder.end();

		const wavStreamPlayer = wavStreamPlayerRef.current;
		await wavStreamPlayer.interrupt();
	}, []);

	const deleteConversationItem = useCallback(async (id: string) => {
		const client = clientRef.current;
		client.deleteItem(id);
	}, []);

	/**
	 * In push-to-talk mode, start recording
	 * .appendInputAudio() for each sample
	 */
	const startRecording = async () => {
		setIsRecording(true);
		const client = clientRef.current;
		const wavRecorder = wavRecorderRef.current;
		const wavStreamPlayer = wavStreamPlayerRef.current;
		const trackSampleOffset = await wavStreamPlayer.interrupt();
		if (trackSampleOffset?.trackId) {
			const { trackId, offset } = trackSampleOffset;
			await client.cancelResponse(trackId, offset);
		}
		await wavRecorder.record((data) => client.appendInputAudio(data.mono));
	};

	/**
	 * In push-to-talk mode, stop recording
	 */
	const stopRecording = async () => {
		setIsRecording(false);
		const client = clientRef.current;
		const wavRecorder = wavRecorderRef.current;
		await wavRecorder.pause();
		client.createResponse();
	};

	/**
	 * Switch between Manual <> VAD mode for communication
	 */
	const changeTurnEndType = async (value: string) => {
		const client = clientRef.current;
		const wavRecorder = wavRecorderRef.current;
		if (value === "none" && wavRecorder.getStatus() === "recording") {
			await wavRecorder.pause();
		}
		client.updateSession({
			turn_detection: value === "none" ? null : { type: "server_vad" },
		});
		if (value === "server_vad" && client.isConnected()) {
			await wavRecorder.record((data) => client.appendInputAudio(data.mono));
		}
		setCanPushToTalk(value === "none");
	};

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [items]);

	/**
	 * Core RealtimeClient and audio capture setup
	 * Set all of our instructions, tools, events and more
	 */
	useEffect(() => {
		if (!supabaseClient) return
		// Get refs
		const wavStreamPlayer = wavStreamPlayerRef.current;
		const client = clientRef.current;

		// Set instructions
		client.updateSession({ instructions: instructions });
		// Set transcription, otherwise we don't get user transcriptions back
		client.updateSession({ input_audio_transcription: { model: "whisper-1" } });

		// handle realtime events from client + server for event logging
		client.on("realtime.event", (realtimeEvent: RealtimeEvent) => {
			setRealtimeEvents((realtimeEvents) => {
				const lastEvent = realtimeEvents[realtimeEvents.length - 1];
				if (lastEvent?.event.type === realtimeEvent.event.type) {
					// if we receive multiple events in a row, aggregate them for display purposes
					lastEvent.count = (lastEvent.count || 0) + 1;
					return realtimeEvents.slice(0, -1).concat(lastEvent);
				} else {
					return realtimeEvents.concat(realtimeEvent);
				}
			});
		});
		client.on("error", (event: any) => console.error(event));
		client.on("conversation.interrupted", async () => {
			const trackSampleOffset = await wavStreamPlayer.interrupt();
			if (trackSampleOffset?.trackId) {
				const { trackId, offset } = trackSampleOffset;
				await client.cancelResponse(trackId, offset);
			}
		});
		client.on("conversation.updated", async ({ item, delta }: any) => {
			const items = client.conversation.getItems();

			// 新しいアイテムが追加されたら、itemIdHistoriesに追加する
			if (!itemIdHistories.current.includes(item.id)) {
				itemIdHistories.current.push(item.id);
			}
			if (delta?.audio) {
				wavStreamPlayer.add16BitPCM(delta.audio, item.id);
			}
			if (item.status === "completed" && item.formatted.audio?.length) {
				const wavFile = await WavRecorder.decode(
					item.formatted.audio,
					24000,
					24000,
				);
				item.formatted.file = wavFile;
			}


			// ユーザの発言の文字起こしが終わったら会話分析を行い、結果を保存する
			if (
				item.status === "completed" && // TODO 会話が完全に終わったらstatusがcompletedになるのであれば、それを使う（要検討）
				item.role === "user" &&
				item.formatted.transcript
			) {
				// 会話分析を取得する
				const messages = items.map((item) => ({
					text: item.formatted.transcript || null,
					role: item.role || null,
				}));
				const { conversationAnalysis, error } =
					await getConversationAnalysis(messages);
				if (error) {
					console.error(error);
					toast.error("通信エラーが発生しました");
				} else {
					setConversationAnalysis((prev) => [
						...prev,
						{ conversationAnalysis, item_id: item.id },
					]);
				}

				// ユーザの発言を保存する
				if (!supabaseClient) {
					console.error("クライアントが取得できませんでした");
					toast.error("通信エラーが発生しました");
				} else {
					// parentItemIdはidのインデックスを取得して、その一つ前のidを取得する
					// 最初の発言の場合はparentItemIdはnullになる
					const isFirst = itemIdHistories.current.indexOf(item.id) === 0;
					const parentItemId = isFirst ? null : itemIdHistories.current[itemIdHistories.current.indexOf(item.id) - 1];
					const { data, error: supabaseError } = await supabaseClient
						.from("message")
						.insert([
							{
								conversation_session_id: conversationSessionId,
								item_id: item.id,
								parent_item_id: parentItemId,
								role: item.role,
								content: item.formatted.transcript,
								user_id: session.user.id,
							},
						]).select().single();
					if (supabaseError) {
						console.error(supabaseError);
						toast.error("通信エラーが発生しました。");
					}
				}
			}

			// AIの発言が完全に終わったら保存する
			if (
				item.status === "completed" &&
				item.role === "assistant" &&
				item.formatted.transcript // もしかしたらtranscriptかも？
			) {
				console.log("AIの発言が完全に終わったので保存します");
				console.log("保存内容", item);
				if (!supabaseClient) { //TODO 削除する（もう一個ある）
					console.error("クライアントが取得できませんでした");
					toast.error("通信エラーが発生しました");
				} else {
					const isFirst = itemIdHistories.current.indexOf(item.id) === 0;
					const parentItemId = isFirst ? null : itemIdHistories.current[itemIdHistories.current.indexOf(item.id) - 1];
					const { data, error: supabaseError } = await supabaseClient
						.from("message")
						.insert([
							{
								conversation_session_id: conversationSessionId,
								item_id: item.id,
								parent_item_id: parentItemId,
								role: item.role,
								content: item.formatted.transcript,
								user_id: session.user.id,
							},
						]).select().single();
					if (supabaseError) {
						console.error(supabaseError);
						toast.error("通信エラーが発生しました。");
					}
				}
			}

			setItems(items);
			setMessages(prev => [...prev, {
				id: item.id,
				role: item.role,
				content: item.formatted.transcript || null,
				formatted: item.formatted,
			}])
		});

		setItems(client.conversation.getItems());
		setMessages([{
			id: "test",
			role: "user",
			content: "test",
			formatted: {
				transcript: "test",
			}
		}, {
			id: "test",
			role: "user",
			content: "test",
			formatted: {
				transcript: "test",
			}
		}])

		return () => {
			// cleanup; resets to defaults
			client.reset();
		};
	}, [supabaseClient]);

	return {
		items,
		messages,
		isConnected,
		disconnectConversation,
		connectConversation,
		startRecording,
		stopRecording,
		canPushToTalk,
		isRecording,
		changeTurnEndType,
		conversationAnalysis,
		scrollRef,
	};
};

export default useConversation;
