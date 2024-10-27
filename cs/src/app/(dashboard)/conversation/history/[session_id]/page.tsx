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
	const text_analy = content.content //
	console.log(text_analy)

	const score_prompt = `与えられる会話について、userの会話内容を採点して欲しいです。以下の評価項目に対して各項目を10点で採点してください。

1 相手の出来事と、それに対する感情や考えをセットで質問する
2 自分の話す量と相手の話す量が4:6になっている
3 話題を振る際は先に自己開示をする
4 話が盛り上がる話題に触れている（最近盛り上がっていること、力を入れていること、共通の知り合い、最近あったいいこと、ワクワクする出来事）
5 関係を深める話題に触れている（自分に似ているキャラクターや有名人、子供の頃の夢、一番恐れていること、一番後悔していること、原動力、影響を受けたコンテンツ、自分についての取り扱い説明）
6 相槌の「さしすせそ」を活用している（「さすがです」「知らなかったです」「素敵です」
7 相手に敬意を持っていることを伝える
8 相槌のバリエーションがある
9 一言の相槌で会話を止めず、一言足して返す
10 相手が頑張っていること、こだわっていることを引き出して褒める

それぞれの項目に関して採点した結果を以下のJSON形式で返してください。
{
	"result": number[10] (10個の配列でそれぞれ1~10の値を入れてください)
	"error": string (エラーがあればエラーメッセージを入れてください)
}
`;

	const score_input = `${score_prompt}\n\n${sortedMessages.map((msg) => `${msg.role}:${msg.content.replaceAll("\n", "")}`).join('\n\n')}`
	const score_content = await llm.invoke(score_input);
	console.log(score_content.content)
	const jsonString = score_content.content as string
	const trimed = jsonString.replace("```json", "").replace("```", "").trim()
	console.log(trimed)
	const scoreResult = JSON.parse(trimed)
	console.log(scoreResult)
	const totalScore = scoreResult.result.reduce((acc: number, cur: number) => acc + cur, 0)
	console.log(totalScore)


	// const analysisMessage = "総評サンプル文。きっと";
	const analysisMessage = text_analy;
	const analysisScore = String(totalScore);
	const analysis = [analysisMessage, analysisScore];
	const messageNodes = [] as any[];
	const messageEdgs = [] as any[];
	const addNode = (message: MessageWithChildren) => {
		messageNodes.push({
			id: message.id,
			data: { label: message.content, popupContent: "サンプルサンプル" + String(message.id) + "::::" + 90 },
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
