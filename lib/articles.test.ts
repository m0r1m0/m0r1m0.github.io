import "jest";
import { getArticles } from "./articles";

test("getArticles", () => {
  const result = getArticles();
  expect(result).toEqual([
    {
      id: "sample-article1",
      title: "今日はいい天気",
      content: `
## 2020-11-23

今日はいい天気だった
`,
    },
    {
      id: "sample-article2",
      title: "今日はさむい",
      content: `
## 2020-11-24

今日はくそさむいなあ
`,
    },
  ]);
});
