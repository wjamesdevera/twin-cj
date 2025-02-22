import "../../globals.scss";
import styles from "./auth-layout.module.scss";
import loginBackgroundImage from "@/public/assets/login-left-bg.png";
import Image from "next/image";
export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className={styles.body}>
      <div className={styles["two-column"]}>
        <div className={styles["left-container"]}>
          <Image
            src={loginBackgroundImage}
            alt="Twin CJ Login Background Image"
            fill
            objectFit="cover"
            className={styles["login-background-img"]}
          />
        </div>
        <div className={`${styles["right-container"]} container`}>
          <div className={styles["right-wrapper"]}>
            <div className={styles.form}>{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
