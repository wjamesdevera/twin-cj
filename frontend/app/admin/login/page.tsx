import React from "react";
import Image from "next/image";
import styles from "./login.module.scss";
import twinCJLogo from "../../../public/assets/twin-cj-logo.png";

export default function Page() {
  return (
    <>
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
        <div className={styles["right-wrapper"]}>
          <Image
            src={twinCJLogo}
            alt="Twin CJ Logo"
            className={styles["login-img"]}
          />
          <p className={styles["text"]}>
            Welcome! Please log-in with your admin account.
          </p>
          <div className={styles.form}>
            <form className={styles["login-form"]}>
              <input type="text" placeholder="Email Address" />
              <input type="password" placeholder="Password" />
              <div>
                <a href="#">Forgot Password?</a>
                <button type="submit">Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
