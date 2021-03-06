import dayjs from "dayjs";
import fs from "fs";
import path from "path";
import remark from "remark";
import html from "remark-html";
import { parse } from "./frontmatter";
import highlight from "remark-highlight.js";

const articlesDirectory = path.join(process.cwd(), "articles");

export interface Article {
  id: string;
  date: string | null;
  title: string;
  content: string;
  ogp: {
    title: string;
    description: string;
    image?: string;
  } | null;
}
export function getArticles(): Article[] {
  const fileNames = fs
    .readdirSync(articlesDirectory, {
      withFileTypes: true,
    })
    .filter((dirent) => dirent.isFile() && path.extname(dirent.name) === ".md")
    .map((d) => d.name);

  return fileNames
    .slice()
    .sort((nameA, nameB) => {
      const dateA = getDate(nameA);
      const dateB = getDate(nameB);
      if (dateA === null || dateB === null) {
        return 1;
      }
      if (dayjs(dateA).isBefore(dateB)) {
        return 1;
      }
      if (dayjs(dateA).isAfter(dateB)) {
        return -1;
      }
      return 0;
    })
    .map<Article | null>((fileName) => {
      const id = getId(fileName);
      const date = getDate(fileName);
      const markdown = fs.readFileSync(
        path.join(articlesDirectory, fileName),
        "utf-8"
      );
      const parsedMarkdown = parse(markdown);
      if (parsedMarkdown === null) {
        return null;
      }
      return {
        id,
        date: date && dayjs(date).toISOString(),
        title: parsedMarkdown.matter.title,
        content: parsedMarkdown.markdown,
        ogp: parsedMarkdown.ogp,
      };
    })
    .filter((v) => v !== null) as Article[];
}

export function getArticleIds(): string[] {
  const fileNames = fs.readdirSync(articlesDirectory);
  return fileNames.map((fileName) => {
    return getId(fileName);
  });
}

export async function getArticle(id: string): Promise<Article | null> {
  const filePath = path.join(articlesDirectory, `${id}.md`);
  const date = getDate(`${id}.md`);
  const markdown = fs.readFileSync(filePath, "utf-8");
  const parsedMarkdown = parse(markdown);
  if (parsedMarkdown === null) {
    return null;
  }
  const processedContent = await remark()
    .use(highlight)
    .use(html)
    .process(parsedMarkdown.markdown);
  return {
    id,
    date: date && dayjs(date).format("YYYY年MM月DD日"),
    title: parsedMarkdown.matter.title,
    content: processedContent.toString(),
    ogp: parsedMarkdown.ogp,
  };
}

function getId(fileName: string): string {
  return fileName.replace(/\.md$/, "");
}

export function getDate(fileName: string): Date | null {
  const matched = /(\d{1,4}-\d{1,2}-\d{1,2})-.*\.md$/.exec(fileName);
  if (matched == null) {
    return null;
  }
  return dayjs(matched[1]).toDate();
}
