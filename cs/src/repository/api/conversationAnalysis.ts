import { ConversationAnalysis } from "@/types/conversationAnalysis";

type ConversationAnalysisError = {
	message: string;
};

type ConversationAnalysisProps = {
	text: string | null;
	role: "user" | "assistant" | "system" | null;
}[];

type AnalyzeConversationResult =
	| {
		conversationAnalysis: ConversationAnalysis;
		error?: undefined;
	}
	| {
		conversationAnalysis?: undefined;
		error: ConversationAnalysisError;
	};

export const getConversationAnalysis = async (
	messages: ConversationAnalysisProps,
): Promise<AnalyzeConversationResult> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/api/conversationAnalysis`,
		{
			method: "POST",
			body: JSON.stringify({ messages }),
			cache: "no-cache",
		},
	);
	if (!response.ok) {
		const error: ConversationAnalysisError = {
			message: "Failed to analyze conversation",
		};
		return { error };
	}
	const data = await response.json();
	const conversationAnalysis: ConversationAnalysis = {
		message: data.message,
		score: data.score,
	} as ConversationAnalysis;
	return { conversationAnalysis };
};
