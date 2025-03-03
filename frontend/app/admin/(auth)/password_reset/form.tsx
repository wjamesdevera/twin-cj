"use client";
import styles from "./password_reset.module.scss";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import twinCJLogo from "@/public/assets/twin-cj-logo.png";
import useSWRMutation from "swr/mutation";
import { forgotPasword } from "@/app/lib/api";
import { Loading } from "@/app/components/loading";

const Timer = ({ trigger }: { trigger: () => void }) => {
  const Ref = useRef<NodeJS.Timeout | null>(null);
  const [time, setTime] = useState<string>("5:00");
  const [isResendAvailable, setIsResetAvailable] = useState(false);

  const getTimeRemaining = (endTime: Date) => {
    const total =
      Date.parse(endTime.toString()) - Date.parse(new Date().toString());

    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    return {
      total,
      minutes,
      seconds,
    };
  };

  const startTimer = (endTime: Date) => {
    const { total, minutes, seconds } = getTimeRemaining(endTime);
    if (total >= 0) {
      setTime(
        `${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`
      );
    } else {
      setIsResetAvailable(true);
    }
  };

  const clearTimer = (endTime: Date) => {
    setTime("05:00");
    setIsResetAvailable(false);
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => startTimer(endTime), 1000);
    Ref.current = id;
  };

  const getDeadTime = (): Date => {
    const deadline = new Date();
    deadline.setMinutes(deadline.getMinutes() + 1);
    return deadline;
  };

  useEffect(() => {
    clearTimer(getDeadTime());
    return () => {
      if (Ref.current) clearInterval(Ref.current);
    };
  });

  const onClickReset = () => {
    clearTimer(getDeadTime());
    trigger();
  };

  return (
    <div>
      <p>
        Resend in <span>{time}</span>
      </p>
      <input
        type="button"
        disabled={!isResendAvailable}
        value={"Resend"}
        onClick={onClickReset}
      />
    </div>
  );
};

export function PasswordResetForm() {
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const { trigger, isMutating, error } = useSWRMutation(
    "forgot-password",
    (key, { arg }: { arg: { email: string } }) => forgotPasword(arg),
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
                    {`A password reset email has been sent to ${email}`}
                  </p>
                  <Timer trigger={handleForgotPassword} />
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
