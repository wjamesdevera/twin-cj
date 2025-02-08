"use client";
import useSWRMutation from "swr/mutation";
import styles from "./login.module.scss";
import { login } from "@/app/lib/api";
import { redirect } from "next/navigation";
import { useState } from "react";
import { Loading } from "@/app/components/loading";
import Image from "next/image";
import twinCJLogo from "@/public/assets/twin-cj-logo.png";
import Link from "next/link";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { trigger, error, isMutating } = useSWRMutation(
    "login",
    (key, { arg }) => login(arg),
    {
      onSuccess: () => {
        redirect("/admin");
      },
    }
  );

  const handleLogin = async () => {
    await trigger({ email, password });
  };

  return (
    <>
      {isMutating ? (
        <Loading />
      ) : (
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
                Welcome! Please log-in with your admin account.
              </p>
            </div>
            <div className={styles["form-control"]}>
              <input
                type="text"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && (
                <small className={styles["error-message"]}>
                  Invalid Email or Password
                </small>
              )}
              <div>
                <Link
                  className={styles["forgot-password"]}
                  href="/admin/password_reset"
                >
                  Forgot Password?
                </Link>
                <button
                  className={styles["login-button"]}
                  type="submit"
                  onClick={handleLogin}
                  disabled={isMutating}
                >
                  {isMutating ? "Logging in..." : "Login"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
