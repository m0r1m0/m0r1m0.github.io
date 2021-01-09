import { GetStaticProps } from "next";
import Head from "next/head";
import { Article, getArticles } from "../lib/articles";
import styles from "../styles/home.module.css";
import Link from "next/link";
import Layout from "../components/Layout";
import { generateRss } from "../lib/generateRss";
import fs from "fs";
import dayjs from "dayjs";

interface StaticProps {
  articles: Article[];
}
export const getStaticProps: GetStaticProps<StaticProps> = async () => {
  const articles = getArticles();
  const rss = generateRss(articles);
  fs.writeFileSync("./out/rss.xml", rss);

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
                  <a>
                    {title}
                    {date !== null &&
                      `（${dayjs(date).format("YYYY年MM月DD日")}）`}
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </Layout>
  );
}
