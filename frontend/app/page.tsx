import styles from "./page.module.scss";
import Navbar from "./components/navbar";

export default function Home() {
  return (
    <div className={styles.page}>
      <Navbar />
      <h1>Test Page</h1>
    </div>
  );
}
