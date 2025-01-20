import React from "react";
import Image from "next/image";
import styles from "./login.module.scss";

export default function Page() {
  return (
    <div className={styles["container"]}>
      <div className={styles["left-container"]}>
        <Image
          src="/assets/login-left-bg.png"
          alt="logo"
          layout="fill"
          objectFit="cover"
          className="left-bg"
        />
      </div>
      <div className={styles["right-container"]}>
        <div>
        <Image
          src="/assets/twin-cj-login-logo.png"
          alt="twin cj"
          width={600}
          height={150}
          className="login-logo"
          />
        </div>
        <div>
          <p className={styles["text"]}>
            Welcome! Please log-in with your admin account.
          </p>
        </div>
        <div className={styles.form}>
          <form className={styles["login-form"]}>
            <input type="text" placeholder="Email Address" />
            <input type="password" placeholder="Password" />
            <a href="#">Forgot Password?</a>
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}
