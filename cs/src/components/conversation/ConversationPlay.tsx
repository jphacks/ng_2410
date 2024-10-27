"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import useConversation from "@/hooks/use-conversation";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useUser } from "@clerk/nextjs";

const ConversationPage = ({ conversationSessionId }: { conversationSessionId: string }) => {
	const {
		items,
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
	} = useConversation({ conversationSessionId });
	const { user } = useUser()

	return (
		<div>
			<div className="absolute z-20 max-w-[1000px] mx-auto">
				<ScrollArea className="h-[calc(100vh-62px)] w-[440px] mt-[62px]">
					<div className="mt-5">
						{items.length > 0 &&
							items.map((conversationItem) => (
								<div
									key={conversationItem.id}
									className="mx-5 [data-conversation-content]"
								>
									<div className="bg-[#FBEFE3] w-[400px] rounded-xl shadow-xl p-3">
										<div className="flex items-center gap-3">
											<Avatar className="rounded-full shadow">
												<AvatarImage
													src={
														conversationItem.role === "user"
															? user?.imageUrl
															: "https://github.com/shadcn.png"
													}
													className="w-8 rounded-full"
												/>
												<AvatarFallback>CN</AvatarFallback>
											</Avatar>
											<div className="font-bold">
												{(
													conversationItem.role || conversationItem.type
												).replaceAll("_", " ") === "user"
													? `${user?.lastName} ${user?.firstName}`
													: "Oz"
												}
											</div>
										</div>
										<div className="text-gray-500">
											{conversationItem.role === "user" && (
												<div>
													{conversationItem.formatted.transcript ||
														(conversationItem.formatted.audio?.length
															? "(awaiting transcript)"
															: conversationItem.formatted.text ||
															"(item sent)")}
												</div>
											)}
											{conversationItem.role === "assistant" && (
												<div>
													{conversationItem.formatted.transcript ||
														conversationItem.formatted.text ||
														"(truncated)"}
												</div>
											)}
										</div>
									</div>
									<div className="border-l-4 ml-7 border-gray-500 min-h-10 border-opacity-50 pl-10 py-5">
										{conversationAnalysis.filter(
											(v) => v.item_id === conversationItem.id,
										).length > 0 ? (
											<div>
												{conversationAnalysis
													.filter((v) => v.item_id === conversationItem.id)
													.map((v) => (
														<div
															key={v.item_id}
															className="bg-blue-100 rounded-xl shadow-xl p-3"
														>
															<div className="font-extrabold">AI分析</div>
															<div className="text-gray-500">
																{v.conversationAnalysis.message}
															</div>
														</div>
													))}
											</div>
										) : (
											conversationItem.role === "user" && (
												<div className="bg-blue-100 rounded-xl shadow-xl p-3">
													<div className="font-extrabold">AI分析</div>
													<Skeleton className="h-[16px] rounded-full mt-3" />
													<Skeleton className="h-[20px] rounded-full mt-3" />
												</div>
											)
										)}
									</div>
								</div>
							))}
					</div>
					<div className="mx-5 mb-5">
						<div className="bg-[#FBEFE3] w-[400px] rounded-xl shadow-xl p-3">
							<div className="flex items-center gap-3">
								<Skeleton className="w-8 h-8 rounded-full" />
								<Skeleton className="w-[150px] h-[16px] rounded-full" />
							</div>
							<Skeleton className="h-[24px] rounded-full mt-3" />
						</div>
					</div>
					<div ref={scrollRef} />
				</ScrollArea>
			</div>
			{/* 俺俺実装 */}
			<div className="bg-[#FDF4E2] h-screen flex">
				<div>
					<div className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-2xl rounded-full">
						<Avatar className="rounded-full shadow">
							<AvatarImage
								src="https://github.com/shadcn.png"
								className="w-36 rounded-full"
							/>
							<AvatarFallback>CN</AvatarFallback>
						</Avatar>
					</div>
				</div>

				<div className="absolute bottom-5 left-1/2 -translate-x-1/2">
					{isConnected ? (
						<Button onClick={disconnectConversation}>終了する</Button>
					) : (
						<Button onClick={connectConversation}>開始する</Button>
					)}
					{isConnected && canPushToTalk && (
						<Button
							onMouseDown={startRecording}
							onMouseUp={stopRecording}
							disabled={!isConnected || !canPushToTalk}
						>
							{isRecording ? "release to send" : "push to talk"}
						</Button>
					)}
					<Button onClick={() => changeTurnEndType("none")}>Manual</Button>
					<Button onClick={() => changeTurnEndType("server_vad")}>VAD</Button>
				</div>
				<div className="absolute bottom-20 left-1/2 -translate-x-1/2">
					<button
						onClick={() =>
							toast("質問には5W1Hを意識しよう！", {
								description:
									"Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis aliquam quisquam, aut at, distinctio inventore, quas nulla aperiam accusantium culpa tempore magni. Illo quod similique sequi quisquam voluptatibus libero excepturi?",
								className: "text-lg shadow-xl",
								duration: 2000,
							})
						}
					>
						ボタン
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConversationPage;
