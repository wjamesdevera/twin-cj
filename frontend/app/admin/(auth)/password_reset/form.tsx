"use client";
import styles from "./password_reset.module.scss";
import { useState } from "react";
import Image from "next/image";
import twinCJLogo from "@/public/assets/twin-cj-logo.png";

export function PasswordResetForm() {
  const [email, setEmail] = useState("");

  return (
    <>
      <div className={styles["login-form-container"]}>
        <div className={styles["login-form-wrapper"]}>
          <div className={styles["form-title"]}>
            <Image
              src={twinCJLogo}
              alt="Twin CJ Logo"
              className={styles["login-logo"]}
              objectFit="contain"
            />
            <p className={styles["welcome-text"]}>
              Enter the email, phone number, or username associated with your
              account to change your password.
            </p>
          </div>
          <div className={styles["form-control"]}>
            <input
              type="text"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div>
              <button className={styles["login-button"]} type="submit">
                Send Verification
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
