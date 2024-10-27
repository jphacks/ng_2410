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

	const prompt = `
	これは，「user」と「assistant」の会話内容です．以下に記載する【会話のポイント】をもとにこの会話内容全てを分析して，「user」の会話力について，200〜300字程度で総評を作成してください．
【会話のポイント】
[「そうですね」で会話を止めず，一言足して返す] 1. 連想：話題を変えたり，深めたりする 2. オウム返し：話が広がりそうな言葉を付け加える（質問形式で返すなど）
[相手の密かな自慢や他とは違うことに気づき，それを言葉にする] 1. 「何か特別なことをされているんですか？」という質問がおすすめ 2. 生活の中で頑張っていること，こだわっていることを褒められれば，誰だって嬉しい
[意図のある質問（空気を良くする質問）]    1. モノについての場合，「モノそのもの」ではなく，「モノを持っている人」に話題をフォーカスする． 2. 相手のバックグラウンドや思いを深掘りできる質問をする
[意図の無い質問（空気を悪くする質問）]    1. 話題についてあまり詳しく無い人，興味のない人が，間を埋めるための質問をする 2. 質問攻めが続くと，相手は尋問されているような印象を受ける
[「なぜですか？」は愚問]1. 「なぜか？」を考えるのは人間にとって大きな負担 2. 「なぜ」という言葉には圧迫感がある（ニュアンス的に）
[笑える話をする必要はない] 笑い話（Funny）ではなく興味深い話（interesting）をしよう
[雑談のネタをストックしておこう] 違うジャンルで常時5〜6個，ある程度古くなったエピソードは入れ替えていく 自分の本業に関わる面白い話・健康の話・スポーツ・最近気になる商品・面白かった映画，本　などについて
[ちょっと盛ると話は一気に面白くなる] あった出来事を一から十まで正確に伝えようとすると，話はダラッとなる
[雑談初期の基本テクニック] 1. 最近の出来事について聞く2. どのような感情になったか聞く
[基本ルール]1. 聞く：話す = 8 : 2（慣れる前の体感） = 6 : 4（実際） 2. 30秒以内で話をまとめ，質問で次の話題へ（長く話しすぎない） 3. 相手が話し終わった後，一秒間を置く
[出会い頭の挨拶は重要]爽やかな挨拶は良い空気を作る
[【話を盛り上げる】おすすめ話題例1    ] 最近盛り上がっていること
[【話を盛り上げる】おすすめ話題例2] 力を入れていること
[【話を盛り上げる】おすすめ話題例3] （共通の知り合いなどと）知り合ったきっかけ・第一印象
[【話を盛り上げる】おすすめ話題例4] 今日（今週）あったいいこと
[【話を盛り上げる】おすすめ話題例5] 今週末の予定
[【話を盛り上げる】おすすめ話題例6] この場所の印象
[【話を盛り上げる】おすすめ話題例7] 最近のニュース（時事）
[【話を盛り上げる】おすすめ話題例8] ワクワクする出来事
[NG話題例] 政治，宗教
[関係を深めるためのポイント] お互いに自己開示をする．（パーソナルな話題）
[自己開示のポイント]1. 先に自分のエピソードを話す 2. 相手の何を知りたいかに合わせて自己開示する（自分が話したいことではない） 3. 自分が話す割合は2割〜3割
[【自己開示に繋げる】おすすめ話題例1] 似ているキャラクター
[【自己開示に繋げる】おすすめ話題例2] 子供の頃の夢
[【自己開示に繋げる】おすすめ話題例3] 一番恐れていること
[【自己開示に繋げる】おすすめ話題例4] 一番後悔していること
[【自己開示に繋げる】おすすめ話題例5] 原動力
[【自己開示に繋げる】おすすめ話題例6] 影響を受けた本など
[【自己開示に繋げる】おすすめ話題例7] (相手について)知っておくべき重要なこと
[相手をメンターにしよう]1. 相手が言ったことで，何に感動したのかを具体的に伝える 2. そのことについて，また教えてほしいという意志を伝える 3. 「〇〇さんのファンになっていいですか？」「私のメンターになっていただけませんか？」（ハートを撃ち抜く一言）
[「前回教えてもらったこと」に触れよう] 1. 二度目にあった時は，一度目にあった時話したことに必ず触れる 2.  「この前教えていただいた〇〇，早速試させていただいたのですが．．．」 3.  「また教えていただいてもよろしいですか？」
[褒める時は「つぶやき褒め」]1. あえて相手から視線を外して，天井や宙を見る 2. 頷いたり，首を横に傾げたりしながら 3. 「いや〜さすがだなぁ，その視点はなかったなぁ」
[相槌の「さしすせそ」（良いリアクション例）] 1.  さ：さすがですね 2. し：知らなかったです 3. す：素敵ですね 4. せ：センスがいいですね 5. そ：それはすごいですね
[聞いているのか聞いていないのかわからないような受け答えはNG] 1.  なるほどですね2. そうですね
[頷き方にバリエーションを持つ]1. 「ああ〜」（小刻みに頷きながら，腹に落ちていること，深い共感を示す） 2. 「へぇ〜」（眉を少し上に動かし，驚きを表す） 3. 「はいはい」（抑揚をつけて，理解している，納得している，という表情をしながら） 4. 「ええ」（冷静なトーンで，理解している，聞いているという表情をしながら） 5. 「お〜．．．それはさすがですね」（相手の話のオチや大事なところで） 6. 「う〜ん，それはすごい！」`
	const input = `${sortedMessages.map((msg) => `${msg.role}:${msg.content.replaceAll("\n", "")}`).join('\n\n')}\n\n${prompt}`
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
	"result": number[10] (10個の配列でそれぞれ0~10の値を入れてください)
	"error": string (エラーがあればエラーメッセージを入れてください)
}
会話が短い場合でも、できる限りの範囲で会話をしてください。
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
			data: { label: message.content, popupContent: "次の「何のバイトをしてるんですか？」という質問は、もう少し踏み込んだ内容に変えることで深い会話に繋がった可能性があります。例えば、「書店でのバイトはどんなことが楽しいですか？」というような、相手の経験を深掘りする質問が効果的だったでしょう。 " + "::::" + 90 },
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
