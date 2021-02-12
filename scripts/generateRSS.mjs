import fs from "fs";
import dayjs from "dayjs";
import path from "path";
import remark from "remark";
import html from "remark-html";

const articlesDirectory = path.join(process.cwd(), "articles");

async function main() {
  const fileNames = getArticleFileNames();
  // 最新20件を対象にする
  const articles = await Promise.all(fileNames.map((f) => getArticle(f)));
  const sorted = articles
    .filter((a) => a !== null)
    .sort((article1, article2) => {
      const date1 = article1.date;
      const date2 = article2.date;
      if (dayjs(date1).isBefore(date2)) {
        return 1;
      }
      if (dayjs(date1).isAfter(date2)) {
        return -1;
      }
      return 0;
    })
    .slice(0, 20);

  if (sorted.length < 1) {
    return;
  }
  fs.writeFileSync(
    "./out/rss.xml",
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>morimo</title>
    <link>https://m0r1m0.github.io</link>
    <description>morimo のブログ</description>
    <language>ja</language>
    ${
      sorted[0].date !== null
        ? `<lastBuildDate>${new Date(
            sorted[0].date
          ).toUTCString()}</lastBuildDate>`
        : ""
    }
    ${sorted.map(generateRssItem).join("")}
  </channel>
</rss>`
  );
}

function generateRssItem(article) {
  return `<item>
  <guid>https://m0r1m0.github.io/articles/${article.id}</guid>
  <title>${article.title}</title>
  <link>https://m0r1m0.github.io/articles/${article.id}</link>
  <description><![CDATA[${article.ogp.description}]]></description>
  <content:encoded><![CDATA[${article.content}]]></content:encoded>
  ${
    article.date !== null
      ? `<pubDate>${new Date(article.date).toUTCString()}</pubDate>`
      : ""
  }
</item>`;
}

function getArticleFileNames() {
  const fileNames = fs
    .readdirSync(articlesDirectory, {
      withFileTypes: true,
    })
    .filter((dirent) => dirent.isFile && path.extname(dirent.name) === ".md")
    .map((d) => d.name);
  return fileNames;
}

async function getArticle(fileName) {
  const id = getIdFromFileName(fileName);
  const date = getDateFromFileName(fileName);
  const markdown = fs.readFileSync(
    path.join(articlesDirectory, fileName),
    "utf-8"
  );
  const parsedMarkdown = parse(markdown);
  if (parsedMarkdown === null) {
    return null;
  }
  const processedContent = await remark()
    .use(html)
    .process(parsedMarkdown.markdown);
  return {
    id: id,
    date: date && dayjs(date).toISOString(),
    title: parsedMarkdown.matter.title,
    content: processedContent.toString(),
    ogp: parsedMarkdown.ogp,
  };
}

function getIdFromFileName(fileName) {
  return fileName.replace(/\.md$/, "");
}

/**
 * ファイル名から日付を返す
 * @param fileName ファイル名
 * @returns `Date | null` 日付が含まれない場合はnull
 */
function getDateFromFileName(fileName) {
  const matched = /(\d{1,4}-\d{1,2}-\d{1,2})-.*\.md$/.exec(fileName);
  if (matched == null) {
    return null;
  }
  return dayjs(matched[1]).toDate();
}

function parse(markdown) {
  const lines = markdown.split("\n");
  let isMatter = false;
  const result = lines.reduce(
    (acc, line, i) => {
      // matter start or end
      if (line === "---") {
        isMatter = !isMatter;
        return acc;
      }

      // matter
      if (isMatter) {
        const dataRegExp = /(.+): {0,1}(.+)/;
        const matched = dataRegExp.exec(line);
        if (matched === null) return acc;
        const key = matched[1].trim();
        const value = matched[2];
        if (key === "title" && acc.ogp.title.length === 0) {
          acc.ogp.title = value;
        }
        return {
          ...acc,
          matter: {
            ...acc.matter,
            [key]: value,
          },
        };
      }

      if (acc.ogp.description.length === 0) {
        acc.ogp.description = line;
      }

      const imgMatched = /!\[.+\]\((.+)\)/.exec(line);
      if (acc.ogp.image == null && imgMatched !== null) {
        acc.ogp.image = imgMatched[1];
      }

      // content
      return {
        ...acc,
        markdown: `${acc.markdown}${line}${i !== lines.length - 1 ? "\n" : ""}`,
      };
    },
    {
      matter: {},
      markdown: "",
      ogp: {
        title: "",
        description: "",
      },
    }
  );
  if (isFormatValid(result)) {
    return result;
  }
  return null;
}

function isFormatValid(parsedMarkdown) {
  if (parsedMarkdown.matter.title == null) {
    return false;
  }
  return true;
}

main();
