---
title: TypeScript で Google Cloud Functions の関数を書く
---

[functions-framework-nodejs](https://github.com/GoogleCloudPlatform/functions-framework-nodejs) を使う。

## 開発環境を準備する
[ドキュメント](https://github.com/GoogleCloudPlatform/functions-framework-nodejs/blob/master/docs/typescript.md)に従い、セットアップする。

## 書く

```ts:src/index.ts
import {HttpFunction} from '@google-cloud/functions-framework';

export const helloWorld: HttpFunction = (req, res) => {
  res.send('Hello, World');
};
```

## ローカルで実行する

```bash
npm run watch
```


## デプロイ

セットアップで gts init したときに、npm scripts に `prepare` が追加されている。compile済みのものをデプロイする&typescriptはdevDependenciesなので、不要。削除する。

```diff:package.json
- "prepare": "npm run compile",
```

```bash:デプロイ
gcloud functions deploy helloWorld \
--runtime nodejs16 \
--trigger-http \
--allow-unauthenticated
```

