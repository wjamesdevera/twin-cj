import Link from "next/link";
import styles from "./notfound.module.scss";
import twinCjLogo from "@/public/assets/twin-cj-logo.png";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className={styles.main}>
      <div className={styles.content}>
        <Image src={twinCjLogo} alt="Twin CJ Logo" />

        <h1 className={styles.title}>Page Not Found</h1>

        <p className={styles.message}>
          We're sorry, we couldn't find the page you requested.
        </p>

        <Link href="/">Return Home</Link>
      </div>
    </div>
  );
}
