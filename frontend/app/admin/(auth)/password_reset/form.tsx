"use client";
import styles from "./password_reset.module.scss";
import { useState } from "react";
import Image from "next/image";
import twinCJLogo from "@/public/assets/twin-cj-logo.png";
import useSWRMutation from "swr/mutation";
import { forgotPasword } from "@/app/lib/api";
import { redirect } from "next/navigation";
import { Loading } from "@/app/components/loading";

export function PasswordResetForm() {
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const { trigger, isMutating, error } = useSWRMutation(
    "forgot-password",
    (key, { arg }) => forgotPasword(arg),
    {
      onSuccess: () => {
        setIsSuccess(true);
      },
    }
  );

  const handleForgotPassword = async () => {
    await trigger({ email });
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
              {!isSuccess ? (
                <p className={styles["welcome-text"]}>
                  Enter the email, phone number, or username associated with
                  your account to change your password.
                </p>
              ) : (
                <div className={styles["success-container"]}>
                  <p className={styles["success-message"]}>
                    We&apos;ve sent a reset link to your email. Please check
                    your inbox to proceed.
                  </p>
                </div>
              )}
            </div>
            {!isSuccess && (
              <div className={styles["form-control"]}>
                <input
                  type="text"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {error && (
                  <small className={styles["error-message"]}>
                    We couldn&apos;t find an account with that email address.
                    Please check the email you entered or sign up for a new
                    account.
                  </small>
                )}
                <div>
                  <button
                    disabled={isMutating}
                    className={styles["login-button"]}
                    type="submit"
                    onClick={handleForgotPassword}
                  >
                    Send Verification
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
