import { Message } from "@/types/conversation";
import { supabase } from "../../utils/supabase/client";

export const getConversation = async () => {
	const { data, error } = await supabase.from("conversation").select();
	if (error) {
		console.log("[getConversation] error");
		console.log(error);
		return data;
	}
	const conversation = data.map((item) => {
		return {
			id: item.id,
			itemId: item.item_id,
			conversationSessionId: item.session_id,
			parentItemId: item.parent_item_id,
			role: item.role,
			content: item.content,
			createdAt: item.created_at,
		} as Message;
	});
	return conversation;
};
