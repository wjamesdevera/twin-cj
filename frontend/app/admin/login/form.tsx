"use client";
import useSWRMutation from "swr/mutation";
import styles from "./login.module.scss";
import { login } from "@/app/lib/api";
import { redirect } from "next/navigation";
import { useState } from "react";
import { Loading } from "@/app/components/loading";

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
        <div className={styles["login-form"]}>
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
          {error && <small>Invalid Email or Password</small>}
          <div>
            <a href="#">Forgot Password?</a>
            <button type="submit" onClick={handleLogin} disabled={isMutating}>
              {isMutating ? "Logging in..." : "Login"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
