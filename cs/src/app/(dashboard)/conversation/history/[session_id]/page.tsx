import ConversationHistory from "@/components/conversation/history/ConversationHistoryFlow";
import {
	Message,
	MessageWithChildren,
	conversationToTree,
} from "@/types/conversation";
import { createClerkSupabaseClient } from "@/utils/supabase/client";
import { auth } from "@clerk/nextjs/server";
import React from "react";

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
	const messagesWithChildren = conversationToTree(messages);

	const messageNodes = [] as any[];
	const messageEdgs = [] as any[];
	const addNode = (message: MessageWithChildren) => {
		messageNodes.push({
			id: message.id,
			data: { label: message.content },
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
			/>
		</div>
	);
};

export default ConversationHistoryDetail;
