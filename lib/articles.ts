import fs from "fs";
import path from "path";
import { parse } from "./frontmatter";

export interface Article {
  id: string;
  title: string;
  content: string;
}

export function getArticles(): Article[] {
  const articlesDirectory = path.join(process.cwd(), "articles");
  const fileNames = fs.readdirSync(articlesDirectory);

  return fileNames.map<Article>((fileName) => {
    const id = fileName.replace(/\.md$/, "");
    const markdown = fs.readFileSync(
      path.join(articlesDirectory, fileName),
      "utf-8"
    );
    const parsedMarkdown = parse(markdown);
    return {
      id,
      title: parsedMarkdown.data.title,
      content: parsedMarkdown.content,
    };
  });
}
