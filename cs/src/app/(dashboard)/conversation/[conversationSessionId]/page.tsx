import ConversationPlay from "@/components/conversation/ConversationPlay";
import {
	ConversationSession,
	ConversationSessionWithChildren,
	conversationToTree,
	Message,
	MessageWithChildren,
} from "@/types/conversation";
import { createClerkSupabaseClient } from "@/utils/supabase/client";
import { auth } from "@clerk/nextjs/server";
import { ItemType } from "@openai/realtime-api-beta/dist/lib/client";

const ConversationPage = async ({
	params,
	searchParams
}: { params: { conversationSessionId: string }, searchParams: { first_item_id: string } }) => {
	const { getToken } = await auth();
	const { conversationSessionId } = params;
	const firstItemId = searchParams.first_item_id;
	const token = await getToken({ template: "supabase" });
	if (!token) {
		console.error("Unauthorized");
		return <div>Unauthorized</div>;
	}
	const supabase = createClerkSupabaseClient(token);
	const { data, error } = await supabase
		.from("conversation_session")
		.select(`
			*,
			message(*)
		`)
		.eq("id", conversationSessionId)
		.single();

	if (error) {
		console.error("[supabase error]");
		console.error(error);
		return <div>Error</div>;
	}

	const conversationsSession: ConversationSession = {
		id: data.id,
		createdAt: data.created_at,
		name: data.name,
		messages: data.message.map((messageItem: any) => ({
			id: messageItem.id,
			role: messageItem.role,
			itemId: messageItem.item_id,
			parentItemId: messageItem.parent_item_id,
			content: messageItem.content,
			createdAt: messageItem.created_at,
		}) as Message),
	};

	const conversationSessionWithChildren: ConversationSessionWithChildren = {
		id: conversationsSession.id,
		createdAt: conversationsSession.createdAt,
		name: conversationsSession.name,
		children: conversationToTree(conversationsSession.messages),
	};
	if (firstItemId && conversationSessionWithChildren.children.length) {
		console.log("=========================")
		const findItem = (message: MessageWithChildren) => {
			if (message.itemId === firstItemId && message.role === "assistant") {
				return message;
			}
			for (const child of message.children) {
				const found = findItem(child) as MessageWithChildren
				if (found) {
					return found;
				}
			}
			return null;
		};
		const firstItem = findItem(conversationSessionWithChildren.children[0]);

		if (!firstItem) {
			console.error("Not found first item");
			return <div className="py-[63px]">Not found first item</div>;
		}

		// firstItemで打ち切る(firstItemId以降のメッセージを削除)
		// childrenが複数ある場合は[0]を使用する
		const getPrevMessages = (itemId: string) => {
			const prevMessages: MessageWithChildren[] = [];
			const findItem = (message: MessageWithChildren) => {
				prevMessages.push(message);
				if (message.itemId === itemId) {
					return;
				}
				if (message.children.length) {
					findItem(message.children[0]);
				}
			};
			findItem(conversationSessionWithChildren.children[0]);
			return prevMessages;
		}

		const prevMessages = getPrevMessages(firstItemId);

		const prevConversationSessionWithChildren: ConversationSessionWithChildren = {
			id: conversationsSession.id,
			createdAt: conversationsSession.createdAt,
			name: conversationsSession.name,
			children: conversationToTree(prevMessages),
		};

		return (
			<ConversationPlay prevConversationSessionWithChildren={prevConversationSessionWithChildren} conversationSessionId={conversationSessionId} />
		);
	} else {
		// 新規に始める場合
		// 指定せずに最後のメッセ時で始める
		return (
			<ConversationPlay prevConversationSessionWithChildren={conversationSessionWithChildren} conversationSessionId={conversationSessionId} />
		);
	}
};

export default ConversationPage;
