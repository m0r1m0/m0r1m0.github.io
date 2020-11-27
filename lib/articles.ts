import fs from "fs";
import path from "path";
import remark from "remark";
import html from "remark-html";
import { parse } from "./frontmatter";

const articlesDirectory = path.join(process.cwd(), "articles");

export interface Article {
  id: string;
  title: string;
  content: string;
}
export function getArticles(): Article[] {
  const fileNames = fs.readdirSync(articlesDirectory);

  return fileNames.map<Article>((fileName) => {
    const id = getId(fileName);
    const markdown = fs.readFileSync(
      path.join(articlesDirectory, fileName),
      "utf-8"
    );
    const parsedMarkdown = parse(markdown);
    return {
      id,
      title: parsedMarkdown.matter.title,
      content: parsedMarkdown.markdown,
    };
  });
}

export function getArticleIds(): string[] {
  const fileNames = fs.readdirSync(articlesDirectory);
  return fileNames.map((fileName) => {
    return getId(fileName);
  });
}

export async function getArticle(id: string): Promise<Article> {
  const filePath = path.join(articlesDirectory, `${id}.md`);
  const markdown = fs.readFileSync(filePath, "utf-8");
  const parsedMarkdown = parse(markdown);
  const processedContent = await remark()
    .use(html)
    .process(parsedMarkdown.markdown);
  return {
    id,
    title: parsedMarkdown.matter.title,
    content: processedContent.toString(),
  };
}

function getId(fileName: string): string {
  return fileName.replace(/\.md$/, "");
}
