import Link from "next/link";
import styles from "./notfound.module.scss";
import twinCjLogo from "@/public/assets/twin-cj-logo.png";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className={styles.main}>
      <div>
        <Image src={twinCjLogo} alt="Twin CJ Logo" />
        <Link href="/">Return Home</Link>
      </div>
    </div>
  );
}
