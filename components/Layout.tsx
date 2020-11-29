import styles from "./layout.module.css";
import Link from "next/link";

interface LayoutProps {
  children?: React.ReactNode;
}
export default function Layout({ children }: LayoutProps): JSX.Element {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          <Link href={"/"}>
            <a>🌳MORIMO🌳</a>
          </Link>
        </h1>
      </header>
      <main>{children}</main>
    </div>
  );
}
