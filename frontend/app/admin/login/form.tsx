"use client";
import { use, useState } from "react";
import axios from "axios";
import styles from "./login.module.scss";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const login = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        }
      );
      if (response.status === 401) {
        console.log("INVALID");
      }
      console.log(response);
      router.push("/admin");
    } catch (error) {
      console.error(error);
    }
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <>
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
        <div>
          <a href="#">Forgot Password?</a>
          <button type="submit" onClick={login}>
            Login
          </button>
        </div>
      </div>
    </>
  );
}
