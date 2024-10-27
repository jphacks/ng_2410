# モットーク！

[![IMAGE ALT TEXT HERE](images/conv3.png)](https://youtu.be/QIW8d9J9BSU)

> [デモ動画はこちら](https://youtu.be/QIW8d9J9BSU)

## 製品概要
### 背景(製品開発のきっかけ、課題等）
新型コロナウイルスによる行動の制限は解除され、かつてのように人とコミュニケーションを取れるようになりました。しかし、その爪痕はいまだに残っています。コロナウイルスの行動制限により、人とのコミュニケーションが減少したことで、人とのコミュニケーション能力が低下しているという報告があります。

会話を盛り上げるためには、適切な質問が重要です。質問力の上達には会話の経験を積むことが必要です。しかし、会話に苦手意識を持つ人にとって、経験を積むことは容易ではありません。

### 製品説明（具体的な製品の説明）
私たちが開発した「モットーク！」は、AIとの会話を通してあなたの質問力を点数化し、アドバイスを送ります。

#### 基本機能・利用方法の説明
1. ログイン後、ホーム画面の「スタート」ボタンを押して、トーク画面に移動します。
2. トーク画面の「push to talk」ボタンを押しながら発言する。これに対し、システム側から返答とその発言に対する分析結果が返ってきます。
![](images/conv_mainF.png)
3. 会話を終えたら（任意のタイミング）で「評価ページへ」ボタンを押して、結果ページに移動します
4. 結果ページでは、会話全体の総評と点数、会話のフローを見ることができます
   - （それぞれの発言の分析結果、発言の点数とグラフは仮置き状態）
![](images/conv_re.png)
5. 会話履歴リストより、それぞれの会話全体の内容や総評などを見返すことも可能です。

### 特長
モットーク！は会話の練習に最適な相手を用意し、正確なアドバイスを送ることができます。

#### 1. 特長1
モットーク！の会話相手は驚くほどに自然です。通常、LLMと会話を行うと、実際の人間との会話に比べて、会話の流れが不自然になります。しかし、モットーク！はそのようなことはありません。口調、量、内容、その他の会話の流れが自然です。

#### 2. 特長2
モットーク！の会話相手には人生があります。好きなもの、過去の思い出、将来の夢、日々の過ごし方。それらを持った会話相手は、どのような質問でも豊かな回答が返ってきます。しかも、人物の属性の組み合わせは100万通り以上あり、それに基づいて生成AIが背景を生成するため、無限の会話相手が存在します。

#### 3. 特長3
モットーク！のアドバイスには根拠があります。会話についての複数のベストベラー書籍を基に、アドバイスを行っています。AIがその場で思いついて適当なアドバイスではありません。安心してアドバイスに従ってください。必ず質問力が上達します。

### 解決出来ること
* 会話不足によるコミュニケーション能力の低下
  - 一人でも会話の経験を積むことができ、質問力を上達させ、コミュニケーション能力の向上に繋げられます。
* コミュニケーション能力不足による自信の喪失と交流の場に対する苦手意識
  - 失言等の失敗しても人間関係の軋轢などのリスクを背負うことがないため、気軽に利用し経験を積むことが可能です。
  - 練習して自信をつけることで、交流の場など初対面の人と会話をする必要がある場でもよりリラックスして望むことができるようになるでしょう。

### 今後の展望
* 好きな場所から会話を再開し、思考錯誤ができるリプレイ機能
* それをGitHubのブランチのような木構造で管理する機能
* 会話についての文献の調査を進め、より正確なアドバイス、点数化を行う。
* 会社の上司や営業など、TPOを設定し、その場に合わせて実践的なアドバイスを送る。
* 会話によってAI側から引き出した情報をリスト化・プロファイルすることで、現状の質問力と成果の確認ができるようにする。
  - これにより、毎回どんな相手と話せるのかを楽しみにする要素を加わえることができるのではないかと考えています。
  - また、プロファイルを見返せるようにすることで、コレクションを楽しむかのように振り返ることも可能したいです。
    
### 注力したこと（こだわり等）
* プロンプトのチューニングにこだわり続けました。対話の自然さ、アドバイスの正確性を追求しました。
* 会話の評価基準となる情報の信頼性を追求しました。
  - 会話内容全体についてを、参考書を参照して項目化した「話を盛り上げる」「自己開示に繋げる」など会話テクニックである「会話のポイント」に基づき分析し総評を作成
  - 同じく参考書を参照して作成した10の評価項目についてそれぞれ0~10点をつけて総計を取ることで点数化
  - なお、与えた「会話のポイント」や「評価項目」以外の情報に基づいて分析や評価をすることを禁止することにより、ハルシネーションを防止しています。([実装内容](cs/src/app/(dashboard)/conversation/history/[session_id]/page.tsx))
    - 個々の会話に対するアドバイスも同様、参考書に基づいて作成したアドバイス項目のみを参照し、最もふさわしいアドバイスを選択し提示するようにしています。
* 会話相手の背景を生成し、豊かな会話を行えるようにしました。
  - 職業・趣味・性格から、将来の夢・好きな歌・最近あった嫌なことなどに至るまでの様々な項目に対し、それぞれ可能な限りの候補を用意。([実装内容](cs/src/utils/get_background.ts))
  - 会話の開始時に、候補の中からランダムに選択することによって個性を作成。
  - 作成した個性に基づいて生成AIが背景を生成することで様々な相手と会話可能にすることを実現しました。
    -「最近いいことあった？」などより現実味のある対話も実現
* 1つ1つの発言をノード化し会話の流れをフローチャートで表現したり、評価点数を折れ線グラフで表現するなどの可視化により、見返しやすいUIとなるようこだわりました。([実装内容](cs/src/components/conversation/history/ConversationHistoryFlow.tsx))

<img src="images/graph2.png" alt="graph2">
<p align="center">
  <img src="images/graph1.png" alt="graph1" height=150>
  <img src="images/graph3.png" alt="graph3" height=150>
</p>


## 開発技術
### 活用した技術
#### API・データ
* OpenAI API

#### フレームワーク・ライブラリ・モジュール
* Next.js
* React
* Supabase
* React Flow
* Recharts

#### デバイス
* ブラウザ（PC）

### 独自技術
#### ハッカソンで開発した独自機能・技術
* 会話をブランチで管理しています。時間の都合で間に合いませんでしたが、リプレイ機能の実装が完了すれば、会話のツリーが作成されます。([実装内容](cs/src/components/conversation/history/ConversationHistoryFlow.tsx))
* より自然かつこちらの質問力が鍛えられるような対話を実現するためのプロンプト設計・開発。([実装内容](cs/src/utils/conversation_config.ts))
  - 必要最低限の返答を徹底させることで、テンポの良い会話が可能に([デモ動画](https://youtu.be/QIW8d9J9BSU)を是非見てみてください)
