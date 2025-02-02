import React from "react";
import Image from "next/image";
import styles from "./login.module.scss";
import loginBackgroundImage from "@/public/assets/login-left-bg.png";
import { LoginForm } from "./form";

export default function Page() {
  return (
    <>
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
            <div className={styles.form}>
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
