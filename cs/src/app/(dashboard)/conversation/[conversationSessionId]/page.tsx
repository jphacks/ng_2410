import ConversationPlay from "@/components/conversation/ConversationPlay";
import {
	ConversationSession,
	ConversationSessionWithChildren,
	conversationToTree,
} from "@/types/conversation";
import { createClerkSupabaseClient } from "@/utils/supabase/client";
import { auth } from "@clerk/nextjs/server";

const ConversationPage = async ({
	params,
}: { params: { conversationSessionId: string } }) => {
	const { getToken } = await auth();
	const { conversationSessionId } = params;
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
		})),
	};

	const conversationSessionWithChildren: ConversationSessionWithChildren = {
		id: conversationsSession.id,
		createdAt: conversationsSession.createdAt,
		name: conversationsSession.name,
		children: conversationToTree(conversationsSession.messages),
	};

	return (
		<ConversationPlay conversationSessionId={conversationSessionId} />
	);
};

export default ConversationPage;
