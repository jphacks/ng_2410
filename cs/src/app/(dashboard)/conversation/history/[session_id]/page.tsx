import ConversationHistory from "@/components/conversation/history/ConversationHistoryFlow";
import {
	Message,
	MessageWithChildren,
	conversationToTree,
} from "@/types/conversation";
import { createClerkSupabaseClient } from "@/utils/supabase/client";
import { auth } from "@clerk/nextjs/server";
import { ChatOpenAI } from '@langchain/openai';
import React from "react";
import { string } from "zod";

const ConversationHistoryDetail = async ({
	params,
}: { params: { session_id: string } }) => {
	const { session_id } = params;
	// console.log(params);
	const { getToken, userId } = await auth();
	const token = await getToken({ template: "supabase" });
	if (!token) {
		console.log("no token");
		return <div>error</div>;
	}
	const client = createClerkSupabaseClient(token);
	const { data, error } = await client
		.from("message")
		.select("*")
		.eq("conversation_session_id", session_id)
		.eq("user_id", userId);

	if (error) {
		console.error(error);
		return <div>error</div>;
	}

	const messages: Message[] = data.map((message: any) => ({
		id: message.id,
		itemId: message.item_id,
		conversationSessionId: message.conversation_session_id,
		parentItemId: message.parent_item_id,
		role: message.role,
		content: message.content,
		createdAt: message.created_at,
	}));

	const analysisMessage = "総評サンプル文。きっと";
	const analysisScore = String(70);
	const analysis = [analysisMessage, analysisScore];
	const messagesWithChildren = conversationToTree(messages);

	// 順番にした配列を作成（childrenがある場合は0番目の要素
	const sortedMessages = [] as MessageWithChildren[];
	const addMessage = (message: MessageWithChildren) => {
		sortedMessages.push(message);
		if (message.children.length) {
			addMessage(message.children[0]);
		}
	};
	addMessage(messagesWithChildren[0]);

	// LLMに投げる
	const llm = new ChatOpenAI({
		modelName: "gpt-4o-mini",
		openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, // 環境変数でAPIキーを指定
	});

	const prompt = `以下の会話を分析してください`
	const input = `${prompt}\n\n${sortedMessages.map((msg) => `${msg.role}:${msg.content.replaceAll("\n", "")}`).join('\n\n')}`
	console.log(input)
	const content = await llm.invoke(input);
	const text = content.content //
	console.log(text)


	const messageNodes = [] as any[];
	const messageEdgs = [] as any[];
	const addNode = (message: MessageWithChildren) => {
		messageNodes.push({
			id: message.id,
			data: { label: message.content, popupContent: "サンプルサンプル" + String(message.id) + "::::" + 90},
			position: { x: 0, y: 0 },
		});
		message.children.map(addNode);
	};
	const addEdge = (message: MessageWithChildren) => {
		message.children.map((child) => {
			messageEdgs.push({
				id: `${message.id}-${child.id}`,
				source: message.id,
				target: child.id,
				animated: true,
				style: { strokeWidth: 4 },
			});
			addEdge(child);
		});
	};
	messagesWithChildren.map(addNode);
	messagesWithChildren.map(addEdge);
	return (
		<div className="w-screen h-screen">
			<ConversationHistory
				messageNodes={messageNodes}
				messageEdges={messageEdgs}
				analysisArray={analysis}
			/>
		</div>
	);
};

export default ConversationHistoryDetail;
