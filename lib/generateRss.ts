import { Article } from "./articles";

export function generateRss(articles: Article[]): string {
  return `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>morimo</title>
    <link>https://yuki-wd.github.io</link>
    <description>morimo のブログ</description>
    <language>ja</language>
    ${
      articles[0].date !== null
        ? `<lastBuildDate>${new Date(
            articles[0].date
          ).toUTCString()}</lastBuildDate>`
        : ""
    }
    ${articles.map(generateRssItem).join("")}
  </channel>
</rss>`;
}

function generateRssItem(article: Article): string {
  return `<item>
  <guid>https://yuki-wd7.com/articles/${article.id}</guid>
  <title>${article.title}</title>
  <link>https://yuki-wd7.com/articles/${article.id}</link>
  ${
    article.ogp != null
      ? `<description><![CDATA[${article.ogp.description}]]></description>`
      : ""
  }
  ${
    article.date !== null
      ? `<pubDate>${new Date(article.date).toUTCString()}</pubDate>`
      : ""
  }
</item>`;
}
