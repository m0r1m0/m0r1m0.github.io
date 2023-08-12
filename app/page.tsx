import Link from "next/link";
import { getArticles } from "../lib/articles";
import dayjs from "dayjs";
import styles from "./home.module.css";

export default function Home() {
  const articles = getArticles();

  return (
    <section className={styles.articles}>
      <ul>
        {articles.map(({ id, title, date }) => {
          return (
            <li key={id}>
              <Link href={`/articles/${id}`}>
                {title}
                {date !== null && `（${dayjs(date).format("YYYY年MM月DD日")}）`}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
