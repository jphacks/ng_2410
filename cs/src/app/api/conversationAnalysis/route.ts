import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from '@langchain/openai';
import { ConversationChain } from 'langchain/chains';
import { PromptTemplate } from '@langchain/core/prompts';
import fs from 'fs';
import path from 'path';

const schema = z.object({
	messages: z.array(
		z.object({
			text: z.string().nullable(),
			role: z.string().max(20).nullable(),
		}),
	),
});

export const GET = async (req: NextRequest, res: NextResponse) => {
	// サンプルの会話メッセージを作成
	const messages = [
		{ text: "最近、読書にはまっているんですよ。", role: "assistant" },
		{ text: "そうなんですね。", role: "user" },
	];

	// メッセージを一つのテキストに連結
	const conversationText = messages.map(msg => `${msg.role}: ${msg.text}`).join('\n');

	// 追加の文章（プロンプトに付加するメッセージ）
	const additionalPrompt = fs.readFileSync(path.resolve('src/app/api/conversationAnalysis/prompt.txt'), 'utf8');

	const prompt = conversationText + "\n\n" + additionalPrompt

	try {
		// OpenAI LLMを初期化（APIキーは環境変数から取得）
		const llm = new OpenAI({
			modelName: "gpt-4o-mini",
			openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, // 環境変数でAPIキーを指定
		});

		// プロンプトテンプレートを設定
		// 	const promptTemplate = new PromptTemplate({
		// 		template: `{conversation}\n\n{additionalPrompt}\nassistant:`,
		// 		inputVariables: ["conversation", "additionalPrompt"],
		// 	});

		// 	// 会話チェーンを作成
		// 	const conversationChain = new ConversationChain({
		// 		llm: llm,
		// 		prompt: promptTemplate,
		// 	});

		// 	// AIモデルにプロンプトを送信し、応答を取得
		// 	const response = await conversationChain.call({
		// 		conversation: conversationText,
		// 		additionalPrompt: additionalPrompt, // 追加の文章を渡す
		// 	});

		// 	const message = response?.text || "エラーが発生しました。";

		// 	// 応答メッセージを返す
		// 	return NextResponse.json({ message });
		// } catch (error) {
		// 	// エラー処理
		// 	console.error("LangChainを通してAIから応答を取得する際にエラーが発生しました:", error);
		// 	return NextResponse.json({ message: "AIリクエストに失敗しました。" });
		// }
		const data = await llm.invoke(prompt);
		console.log(prompt)
		return NextResponse.json({ message: data });
	} catch (error) {
	}

};

export const POST = async (req: NextRequest, res: NextResponse) => {
	const body = await req.json();
	const { messages } = schema.parse(body);
	const { getToken } = await auth();
	const token = await getToken();
	if (!token) {
		return Response.json({ message: "Unauthorized" }, { status: 401 });
	}
	return Response.json({
		message:
			"とてもいいですね！話を広げる質問をしています．とてもいいですね！話を広げる質問をしています．とてもいいですね！話を広げる質問をしています．とてもいいですね！話を広げる質問をしています．",
	});
};
