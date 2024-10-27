"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Tips = () => {
  return (
    <div className="py-[62px] px-4">
        <h1 className="text-2xl font-bold mb-4">会話のポイント</h1>
        {/* 雑談全般 */}
        <AccordionItem title="雑談全般">
            <AccordionItem title="注意点">
                <p className="p-2">「話の終着点をどこに持っていくか」をプランニングする</p>
            </AccordionItem>
            <AccordionItem title="鉄板の話は3回練習しよう">
                <p className="p-2">その際以下の内容を意識<br />
                                    • オノマトペで言葉のニュアンスを出す<br />
                                    • 一文を短くする<br />
                                    • リズミカルに話す</p>
            </AccordionItem>
            <AccordionItem title="笑える話をする必要はない">
                <p className="p-2">笑い話（Funny）ではなく興味深い話（interesting）をしよう</p>
            </AccordionItem>
            <AccordionItem title="雑談のネタをストックしておこう">
                <p className="p-2">違うジャンルで常時5〜6個，ある程度古くなったエピソードは入れ替えていく
                自分の本業に関わる面白い話・健康の話・スポーツ・最近気になる商品・面白かった映画，本などについて</p>
            </AccordionItem>
            <AccordionItem title="ちょっと盛ると話は一気に面白くなる">
                <p className="p-2">あった出来事を一から十まで正確に伝えようとすると，話はダラッとなる</p>
            </AccordionItem>
        </AccordionItem>

        {/* 雑談のスタートダッシュ */}
        <AccordionItem title="雑談のスタートダッシュ">
            <AccordionItem title="基本テクニック">
                    <p className="p-2">1. 最近の出来事について聞く<br />
                                        2. どのような感情になったか聞く</p>
            </AccordionItem>
            <AccordionItem title="基本ルール">
                <p className="p-2">1. 聞く：話す = 8 : 2（慣れる前の体感） = 6 : 4（実際）<br />
                                    2. 30秒以内で話をまとめ，質問で次の話題へ（長く話しすぎない）<br />
                                    3. 相手が話し終わった後，一秒間を置く</p>
            </AccordionItem>
            <AccordionItem title="出会い頭の挨拶は重要">
                <p className="p-2">爽やかな挨拶は良い空気を作る</p>
            </AccordionItem>
            <AccordionItem title="【話を盛り上げる】おすすめ話題例1">
                <p className="p-2">最近盛り上がっていること</p>
            </AccordionItem>
            <AccordionItem title="【話を盛り上げる】おすすめ話題例2">
                <p className="p-2">力を入れていること</p>
            </AccordionItem>
            <AccordionItem title="【話を盛り上げる】おすすめ話題例3">
                <p className="p-2">（共通の知り合いなどと）知り合ったきっかけ・第一印象</p>
            </AccordionItem>
            <AccordionItem title="【話を盛り上げる】おすすめ話題例4">
                <p className="p-2">今日（今週）あったいいこと</p>
            </AccordionItem>
            <AccordionItem title="【話を盛り上げる】おすすめ話題例5">
                <p className="p-2">今週末の予定</p>
            </AccordionItem>
            <AccordionItem title="【話を盛り上げる】おすすめ話題例6">
                <p className="p-2">この場所の印象</p>
            </AccordionItem>
            <AccordionItem title="【話を盛り上げる】おすすめ話題例7">
                <p className="p-2">最近のニュース（時事）</p>
            </AccordionItem>
            <AccordionItem title="【話を盛り上げる】おすすめ話題例8">
                <p className="p-2">ワクワクする出来事</p>
            </AccordionItem>
            <AccordionItem title="NG話題例">
                <p className="p-2">政治，宗教</p>
            </AccordionItem>
        </AccordionItem>

        {/* 関係を深める */}
        <AccordionItem title="関係を深める">
            <AccordionItem title="関係を深めるためのポイント">
                <p className="p-2">お互いに自己開示をする（パーソナルな話題）</p>
            </AccordionItem>
            <AccordionItem title="自己開示のポイント">
                <p className="p-2">1. 先に自分のエピソードを話す<br />
                                    2. 相手の何を知りたいかに合わせて自己開示する（自分が話したいことではない）<br />
                                    3. 自分が話す割合は2割〜3割</p>
            </AccordionItem>
            <AccordionItem title="【自己開示に繋げる】おすすめ話題例1">
                <p className="p-2">似ているキャラクター</p>
            </AccordionItem>
            <AccordionItem title="【自己開示に繋げる】おすすめ話題例2">
                <p className="p-2">子供の頃の夢</p>
            </AccordionItem>
            <AccordionItem title="【自己開示に繋げる】おすすめ話題例3">
                <p className="p-2">一番恐れていること</p>
            </AccordionItem>
            <AccordionItem title="【自己開示に繋げる】おすすめ話題例4">
                <p className="p-2">一番後悔していること</p>
            </AccordionItem>
            <AccordionItem title="【自己開示に繋げる】おすすめ話題例5">
                <p className="p-2">原動力</p>
            </AccordionItem>
            <AccordionItem title="【自己開示に繋げる】おすすめ話題例6">
                <p className="p-2">影響を受けた本など</p>
            </AccordionItem>
            <AccordionItem title="【自己開示に繋げる】おすすめ話題例7">
                <p className="p-2">(相手について)知っておくべき重要なこと</p>
            </AccordionItem>
            <AccordionItem title="相手をメンターにしよう">
                <p className="p-2">1. 相手が言ったことで，何に感動したのかを具体的に伝える<br />
                                    2. そのことについて，また教えてほしいという意志を伝える<br />
                                    3. 「〇〇さんのファンになっていいですか？」「私のメンターになっていただけませんか？」（ハートを撃ち抜く一言）</p>
            </AccordionItem>
            <AccordionItem title="「前回教えてもらったこと」に触れよう">
                <p className="p-2">• 二度目にあった時は，一度目にあった時話したことに必ず触れる<br />
                                    • 「この前教えていただいた〇〇，早速試させていただいたのですが．．．」<br />
                                    • 「また教えていただいてもよろしいですか？」</p>
            </AccordionItem>
            <AccordionItem title="褒める時は「つぶやき褒め」">
                <p className="p-2">1. あえて相手から視線を外して，天井や宙を見る<br />
                                    2. 頷いたり，首を横に傾げたりしながら<br />
                                    3. 「いや〜さすがだなぁ，その視点はなかったなぁ」</p>
            </AccordionItem>
        </AccordionItem>

        {/* 聞き方のコツ */}
        <AccordionItem title="聞き方のコツ">
            <AccordionItem title="相槌の「さしすせそ」（良いリアクション例）">
                <p className="p-2">• さ：さすがですね<br />
                                    • し：知らなかったです<br />
                                    • す：素敵ですね<br />
                                    • せ：センスがいいですね<br />
                                    • そ：それはすごいですね</p>
            </AccordionItem>
            <AccordionItem title="聞いているのか聞いていないのかわからないような受け答えはNG">
                <p className="p-2">• なるほどですね<br />
                                    • そうですね</p>
            </AccordionItem>
            <AccordionItem title="基本的に相手の目をずっと見る">
                <p className="p-2">• 目を見るのが苦手なら，ネクタイのあたりや眉間の辺りを見る<br />
                                    • 目に力を入れない，目尻を柔らかくしたソフトな表情．おばあちゃんが孫の話を聞いている時のようなスタンス</p>
            </AccordionItem>
            <AccordionItem title="頷き方にバリエーションを持つ">
                <p className="p-2">1. 「ああ〜」（小刻みに頷きながら，腹に落ちていること，深い共感を示す）<br />
                                    2. 「へぇ〜」（眉を少し上に動かし，驚きを表す）<br />
                                    3. 「はいはい」（抑揚をつけて，理解している，納得している，という表情をしながら）<br />
                                    4. 「ええ」（冷静なトーンで，理解している，聞いているという表情をしながら）<br />
                                    5. 「お〜．．．それはさすがですね」（相手の話のオチや大事なところで）<br />
                                    6. 「う〜ん，それはすごい！」</p>
            </AccordionItem>
            <AccordionItem title="頷く際のコツ">
                <p className="p-2">• 言葉数が多い人→小刻みに頷く，間が多めの人→一つの頷きを深くする<br />
                                    • 力を込めて語っているところ→より強い頷き，どうでもいい場所→頷かない<br />
                                    • 面白いと思いながら聞けば，本当に面白くなってくる</p>
            </AccordionItem>
            <AccordionItem title="「そうですね」で会話を止めず，一言足して返す">
                <p className="p-2">• 連想：話題を変えたり，深めたりする<br />
                                    • オウム返し：話が広がりそうな言葉を付け加える（質問形式で返すなど）</p>
            </AccordionItem>
            <AccordionItem title="相手の密かな自慢や他とは違うことに気づき，それを言葉にする">
                <p className="p-2">• 「何か特別なことをされているんですか？」という質問がおすすめ<br />
                • 生活の中で頑張っていること，こだわっていることを褒められれば，誰だって嬉しい</p>
            </AccordionItem>
            <AccordionItem title="意図のある質問（空気を良くする質問）">
                <p className="p-2">• モノについての場合，「モノそのもの」ではなく，「モノを持っている人」に話題をフォーカスする<br />
                                    • 相手のバックグラウンドや思いを深掘りできる質問をする</p>
            </AccordionItem>
            <AccordionItem title="意図の無い質問（空気を悪くする質問）">
                <p className="p-2">• 話題についてあまり詳しく無い人，興味のない人が，間を埋めるための質問をする<br />
                                    • 質問攻めが続くと，相手は尋問されているような印象を受ける</p>
            </AccordionItem>
            <AccordionItem title="「なぜですか？」は愚問">
                <p className="p-2">• 「なぜか？」を考えるのは人間にとって大きな負担<br />
                                    • 「なぜ」という言葉には圧迫感がある（ニュアンス的に）</p>
            </AccordionItem>
        </AccordionItem>
    </div>
  );
};

type AccordionItemProps = {
  title: string;
  children: React.ReactNode;
};

const AccordionItem = ({ title, children }: AccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="my-2">
      <div
        className="flex justify-between items-center cursor-pointer bg-gray-100 p-3 rounded-md"
        onClick={toggleAccordion}
      >
        <span className="font-medium">{title}</span>
        <span>{isOpen ? "▼" : "▶"}</span>
      </div>
      {isOpen && (
        <div className="ml-4 mt-2 border-l-2 border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
};

export default Tips;
