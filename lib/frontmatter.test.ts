import { parse } from "./frontmatter";

test("parse", () => {
  const markdown = `---
title: 今日はいい天気
date: 2020-11-23
---

## 2020年11月23日

今日はいい天気ですね。明日もいい天気だと嬉しいです。

`;
  const result = parse(markdown);
  expect(result).toEqual({
    data: {
      title: "今日はいい天気",
      date: "2020-11-23",
    },
    content: `
## 2020年11月23日

今日はいい天気ですね。明日もいい天気だと嬉しいです。

`,
  });
});
