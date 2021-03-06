---
title: ブランチ間の変更行数を出す
---

ってググればでる。

```bash
git log --numstat --pretty="%H" branch1..branch2  | awk 'NF==3 {plus+=$1; minus+=$2} END {printf("+%d, -%d\n", plus, minus)}'
```

参考：[How can I calculate the number of lines changed between two commits in Git?](https://stackoverflow.com/questions/2528111/how-can-i-calculate-the-number-of-lines-changed-between-two-commits-in-git/2528129#2528129)

ただ内容が理解できないし、理解できていないのはキモいので紐解く。

## `--numstat`

> Similar to `--stat`, but shows number of added and deleted lines in decimal notation and pathname without abbreviation, to make it more machine friendly. For binary files, outputs two `-` instead of saying `0 0`.

https://git-scm.com/docs/git-log#Documentation/git-log.txt---numstat

`--stat`？

> Generate a diffstat.

https://git-scm.com/docs/git-log#Documentation/git-log.txt---statltwidthgtltname-widthgtltcountgt

diffstatはdiff結果から各ファイルの追加・削除行数をまとめて出してくれるやつぽい。

つまり、`—numstat`はそのdiffstatを`追加行数 削除行数 ファイルパス`形式で出力してくれる。

## `--pretty`

コミットログをprettyで指定した形式で表示する。例えば、`%H` はコミットハッシュ。

つまり、`git log —numstat —pretty="%H"` は以下のような出力になる

```bash
f7cc64ff097f165df3ac457acac183f377acdc0c

16      0       package-lock.json
2       1       package.json
34      21      src/index.ts
e6490bc5ec9da0da9419acfc28186638e9ad6255

1       1       README.md
```

で、次はパイプ以降何をしているのか見ていく。

## `awk`

空白もしくは`-F`オプションで指定した正規表現にマッチする文字で区切られた文字列を処理するコマンド。
https://www.atmarkit.co.jp/ait/articles/1706/02/news017.html

`パターン{アクション}`の形式で指定した処理をしていく。

例えば、`NF==3 {plus+=$1; minus+=$2}`のパターン`NF==3`は、空白で区切られた文字列の数が3つの行を指す。`—-numstat` は追加行数、削除行数、ファイルパスが空白で区切られてるので、一致する。つまり、追加行数、削除行数、ファイルパスの行で、plus、minusという変数に追加・削除行数を足し込む、という処理になる。

また、ENDは最終行のあと、というパターン。つまり、`END {printf("+%d, -%d\n", plus, minus)}`は最終行まで処理したあと、`"+%d, -%d\n"`形式でそれぞれ追加行数、削除行数を出力するという処理になる。

なるほど、たしかに`git log --numstat --pretty="%H" branch1..branch2  | awk 'NF==3 {plus+=$1; minus+=$2} END {printf("+%d, -%d\n", plus, minus)}'`がブランチ間の変更行数を出すことがわかった。

ただ、`--pretty`でわざわざ`%H`とする必要性はないように思う。コミットハッシュは最終的な出力に関係ないので。コミットに関する情報は消して、各ファイルの変更行数情報だけが出力されればおｋである。つまり、完成形としては、以下のようになる。

```bash
git log --numstat --pretty="" branch1..branch2  | awk 'NF==3 {plus+=$1; minus+=$2} END {printf("+%d, -%d\n", plus, minus)}'
```