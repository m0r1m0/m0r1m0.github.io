import { GetStaticProps } from "next";
import Head from "next/head";
import { Article, getArticles } from "../lib/articles";
import styles from "../styles/home.module.css";

interface StaticProps {
  articles: Article[];
}
export const getStaticProps: GetStaticProps<StaticProps> = async () => {
  const articles = getArticles();
  return {
    props: {
      articles,
    },
  };
};

type Props = StaticProps;
export default function Home({ articles }: Props): JSX.Element {
  return (
    <div className={styles.container}>
      <Head>
        <title>morimo</title>
      </Head>
      <main>
        <h1 className={styles.title}>🌳MORIMO🌳</h1>
        <div className={styles.border} />
        <section className={styles.articles}>
          <ul>
            {articles.map((article) => {
              return <li key={article.id}>{article.title}</li>;
            })}
          </ul>
        </section>
      </main>
    </div>
  );
}
