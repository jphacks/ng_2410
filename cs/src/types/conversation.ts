export type ConversationSession = {
	id: string;
	name: string | null;
	createdAt: string;
	messages: Message[];
};

export type ConversationSessionWithChildren = {
	id: string;
	name: string | null;
	createdAt: string;
	children: MessageWithChildren[];
};

export type Message = {
	id: string;
	itemId: string;
	conversationSessionId: string;
	parentItemId: string | null;
	role: "user" | "assistant";
	content: string;
	createdAt: string;
};

export type MessageWithChildren = {
	id: string;
	conversationSessionId: string;
	role: "user" | "assistant";
	content: string;
	itemId: string;
	parentItemId: string | null;
	children: MessageWithChildren[];
	createdAt: string;
};

export const conversationToTree = (
	messages: Message[],
): MessageWithChildren[] => {
	const conversationMap = messages.reduce(
		(acc, item) => {
			acc[item.id] = item;
			return acc;
		},
		{} as Record<string, Message>,
	);

	const roots = messages.filter((message) => !message.parentItemId);

	const buildTree = (message: Message): MessageWithChildren => {
		const children = messages
			.filter((child) => child.parentItemId === message.itemId)
			.map(buildTree);

		return {
			...message,
			children,
		};
	};

	return roots.map(buildTree);
};
