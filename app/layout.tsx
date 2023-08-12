import "./global.css";
import Link from "next/link";
import styles from "./layout.module.css";
import Analytics from "./Analytics";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.URL ?? "http://localhost:3000"),
  title: "morimo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <Analytics />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="RSS feed"
          href="/rss.xml"
        />
      </head>
      <body>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>
              <Link href={"/"}>🌳MORIMO🌳</Link>
            </h1>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
