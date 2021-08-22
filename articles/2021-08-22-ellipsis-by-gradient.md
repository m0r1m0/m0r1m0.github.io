---
title: `mask-image` と `linear-graident()` を使った省略表現
---

<iframe height="300" style="width: 100%;" scrolling="no" title="ellipsis" src="https://codepen.io/yuki-wd/embed/ExXYbZE?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/yuki-wd/pen/ExXYbZE">
  ellipsis</a> by pywd (<a href="https://codepen.io/yuki-wd">@yuki-wd</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

こんな感じに、はみ出した部分を薄くする表現。省略表現と書いたが、省略ではない気がしてきた...

## 考え方

> mask-image は CSS のプロパティで、要素のマスクレイヤーとして使用される画像を設定します。
> https://developer.mozilla.org/ja/docs/Web/CSS/mask-image

`mask-image` に `linear-gradient()` を設定することで、指定位置以降(はみ出した場所)の要素の透明度を上げてやろうというアプローチ。

## 実装

はみ出したかどうかを判定したい要素(今回は `.box`)を`width: 100%`の要素(`.row`)で囲う。この`.row`に`mask-image`を設定する。

`linear-gradient()` で右向きに `rgb(0,0,0)` から `rgba(0,0,0,0.4)`に変化するように設定する。それぞれ、はみ出し部分(まで|から)変化するように設定することで、グラデーションなしにはみ出し部分から透明度が上がることになる。

具体的には以下のようになる

```css
.row {
  width: 100%;
  -webkit-mask-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 1) 100px,
    rgba(0, 0, 0, 0.4) 100px
  );
}
```
