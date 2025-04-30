"use client";
import styles from "./password_reset.module.scss";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import twinCJLogo from "@/public/assets/twin-cj-logo.png";
import useSWRMutation from "swr/mutation";
import { forgotPasword } from "@/app/lib/api";
import { Loading } from "@/app/components/loading";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { z } from "zod";
import { emailSchema } from "@/app/lib/zodSchemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const Timer = () => {
  const Ref = useRef<NodeJS.Timeout | null>(null);
  const [time, setTime] = useState<string>("05:00");
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
    deadline.setMinutes(deadline.getMinutes() + 5);
    return deadline;
  };

  useEffect(() => {
    clearTimer(getDeadTime());
    return () => {
      if (Ref.current) clearInterval(Ref.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClickReset = () => {
    clearTimer(getDeadTime());
  };

  return (
    <div className={styles.timer}>
      <p>
        Resend in <span>{time}</span>
      </p>
      <input
        type="submit"
        disabled={!isResendAvailable}
        value={"Resend"}
        onClick={onClickReset}
      />
    </div>
  );
};

const resetPasswordSchema = z.object({
  email: emailSchema,
});

type FormData = z.infer<typeof resetPasswordSchema>;

export function PasswordResetForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, getValues } = useForm<FormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { trigger, isMutating, error } = useSWRMutation(
    "forgot-password",
    (key, { arg }: { arg: { email: string } }) => forgotPasword(arg),
    {
      onSuccess: () => {
        setIsSuccess(true);
      },
    }
  );

  const onPasswordReset = async (data: FormData) => {
    await trigger(data);
  };

  return (
    <>
      {isMutating ? (
        <Loading />
      ) : (
        <div className={styles["right-container"]}>
          <ArrowLeft
            className={styles["back-arrow"]}
            onClick={() => router.push("/admin/login")}
          />
          <form
            className={styles["login-form-container"]}
            onSubmit={handleSubmit(onPasswordReset)}
          >
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
                    Enter the email associated with your account to change your
                    password.
                  </p>
                ) : (
                  <div className={styles["success-container"]}>
                    <p className={styles["success-message"]}>
                      {`A password reset email has been sent to ${getValues(
                        "email"
                      )}`}
                    </p>
                    <Timer />
                  </div>
                )}
              </div>
              {!isSuccess && (
                <div className={styles["form-control"]}>
                  <input
                    type="text"
                    placeholder="Email Address"
                    {...register("email")}
                  />
                  {error && (
                    <small className={styles["error-message"]}>
                      We couldn&apos;t find an account with that email address.
                      Please check the email you entered
                    </small>
                  )}
                  <div>
                    <button
                      disabled={isMutating}
                      className={styles["login-button"]}
                      type="submit"
                    >
                      Send Verification
                    </button>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      )}
    </>
  );
}
