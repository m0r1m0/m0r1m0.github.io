import Head from "next/head";
import styles from "../styles/home.module.css";

export default function Home(): JSX.Element {
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
            <li>記事タイトル</li>
            <li>記事タイトル</li>
            <li>記事タイトル</li>
            <li>記事タイトル</li>
            <li>記事タイトル</li>
            <li>記事タイトル</li>
            <li>記事タイトル</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
