import { GetStaticProps } from "next";
import Head from "next/head";
import { Article, getArticles } from "../lib/articles";
import styles from "../styles/home.module.css";
import Link from "next/link";
import Layout from "../components/Layout";
import dayjs from "dayjs";

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
    <Layout>
      <Head>
        <title>morimo</title>
      </Head>
      <section className={styles.articles}>
        <ul>
          {articles.map(({ id, title, date }) => {
            return (
              <li key={id}>
                <Link href={`/articles/${id}`}>
                  {title}
                  {date !== null &&
                    `（${dayjs(date).format("YYYY年MM月DD日")}）`}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </Layout>
  );
}
