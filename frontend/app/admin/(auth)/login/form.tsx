"use client";
import useSWRMutation from "swr/mutation";
import styles from "./login.module.scss";
import { login } from "@/app/lib/api";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Loading } from "@/app/components/loading";
import Image from "next/image";
import twinCJLogo from "@/public/assets/twin-cj-logo.png";
import Link from "next/link";
import { emailSchema } from "@/app/lib/zodSchemas";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const Timer = ({
  updateIsDisabled,
}: {
  updateIsDisabled: (isDisabled: boolean) => void;
}) => {
  const Ref = useRef<NodeJS.Timeout | null>(null);
  const [time, setTime] = useState<string>("01:00");

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

  const startTimer = useCallback(
    (endTime: Date) => {
      const { total, minutes, seconds } = getTimeRemaining(endTime);
      if (total >= 0) {
        setTime(
          `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`
        );
      } else {
        updateIsDisabled(false); // 🔹 Set to false when the timer ends
        if (Ref.current) clearInterval(Ref.current);
      }
    },
    [updateIsDisabled]
  );

  const clearTimer = useCallback(
    (endTime: Date) => {
      setTime("01:00");
      if (Ref.current) clearInterval(Ref.current);
      const id = setInterval(() => startTimer(endTime), 1000);
      Ref.current = id;
    },
    [startTimer]
  );

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
  }, [clearTimer]);

  return (
    <div className={styles.timer}>
      <p>
        Try again in <span>{time}</span>
      </p>
    </div>
  );
};

const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string(),
});

type FormData = z.infer<typeof loginFormSchema>;

export function LoginForm() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(loginFormSchema),
  });
  const [attempts, setAttempts] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (attempts > 3) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [attempts, isDisabled]);

  const updateIsDisabled = (isDisabled: boolean) => {
    setIsDisabled(isDisabled);
    setAttempts(0);
  };

  const { trigger, error, isMutating } = useSWRMutation(
    "login",
    (key, { arg }: { arg: { email: string; password: string } }) => login(arg),
    {
      onSuccess: () => {
        router.replace("/admin");
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );

  const onLogin = async (data: FormData) => {
    try {
      await trigger(data);
      console.log("Login successful");
    } catch (error) {
      console.log(error);
      setAttempts(() => attempts + 1);
    }
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
              {isDisabled && <Timer updateIsDisabled={updateIsDisabled} />}
            </div>
            <form
              className={styles["form-control"]}
              onSubmit={handleSubmit(onLogin)}
            >
              {!isDisabled && (
                <>
                  <input
                    type="text"
                    placeholder="Email Address"
                    {...register("email")}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    {...register("password")}
                  />
                  {error && (
                    <small className={styles["error-message"]}>
                      Invalid Email or Password
                    </small>
                  )}
                </>
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
                  disabled={isMutating || isDisabled}
                >
                  {isMutating ? "Logging in..." : "Login"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
