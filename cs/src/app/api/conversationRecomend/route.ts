import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from '@langchain/openai';
import { conversationPrompt } from './prompt';

const schema = z.object({
	messages: z.array(
		z.object({
			text: z.string().nullable(),
			role: z.string().max(20).nullable(),
		}),
	),
});

// realtimeAPIを使わずにテストをするためのGETメソッド
export const GET = async (req: NextRequest, res: NextResponse) => {
	// サンプルの会話メッセージを作成
	const messages = [
        { text: "こんにちは。", role: "assistant" },
        { text: "こんにちは。今日はどこか出かけましたか？", role: "user" },
		{ text: "今日は友達とカフェに行きました．", role: "assistant" },
	];

	// OpenAI LLMを初期化（APIキーは環境変数から取得）
	const llm = new OpenAI({
		modelName: "gpt-4o-mini",
		openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, // 環境変数でAPIキーを指定
	});
	// メッセージを一つのテキストに連結
	const conversationText = messages.map(msg => `${msg.role}: ${msg.text}`).join('\n');

	const prompt = conversationText + "\n\n" + conversationPrompt
	const data = await llm.invoke(prompt);
	console.log(prompt)
	return Response.json({
		message: data
	});
};

export const POST = async (req: NextRequest, res: NextResponse) => {
	const body = await req.json();
	const { messages } = schema.parse(body);
	const { getToken } = await auth();
	const token = await getToken();
	// OpenAI LLMを初期化（APIキーは環境変数から取得）
	const llm = new OpenAI({
		modelName: "gpt-4o-mini",
		openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, // 環境変数でAPIキーを指定
	});
	// メッセージを一つのテキストに連結
	const conversationText = messages.map(msg => `${msg.role}: ${msg.text}`).join('\n');

	const prompt = conversationText + "\n\n" + conversationPrompt
	const data = await llm.invoke(prompt);
	console.log(prompt)
	if (!token) {
		return Response.json({ message: "Unauthorized" }, { status: 401 });
	}
	return Response.json({
		message: data
	});
};
