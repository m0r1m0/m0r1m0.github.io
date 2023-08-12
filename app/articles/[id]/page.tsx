import styles from "./detail.module.css";
import "highlight.js/styles/github.css";
import { getArticle, getArticles } from "../../../lib/articles";
import { Metadata } from "next";

type Props = {
  params: {
    id: string;
  };
};

export async function generateStaticParams() {
  const articles = getArticles();
  return articles.map((article) => ({
    id: article.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;

  const article = await getArticle(id);

  if (article === null) {
    return {};
  }

  return {
    title: `${article.title} | morimo`,
    openGraph: article.ogp,
    twitter: {
      card: article.ogp?.image != null ? "summary_large_image" : "summary",
    },
  };
}

export default async function Article({ params }: Props) {
  const article = await getArticle(params.id);
  if (article == null) {
    return null;
  }
  const { date, content, title } = article;
  return (
    <article className={styles.article}>
      <div>
        {date && <span>{date}</span>}
        <h1>{title}</h1>
      </div>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  );
}
