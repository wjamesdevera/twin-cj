"use client";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import styles from "./change-password.module.scss";
import twinCJLogo from "@/public/assets/twin-cj-logo.png";
import { Eye, EyeOff } from "lucide-react";
import Button from "@/app/components/button";
import useSWRMutation from "swr/mutation";
import { resetPassword } from "@/app/lib/api";
import { Loading } from "@/app/components/loading";
import { z } from "zod";
import { passwordSchema } from "@/app/lib/zodSchemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const changePasswordFormSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password do not match",
  });

type FormData = z.infer<typeof changePasswordFormSchema>;
const Form = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verificationCode = searchParams.get("code");

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm<FormData>({
    resolver: zodResolver(changePasswordFormSchema),
  });
  const { trigger, isMutating } = useSWRMutation(
    "resetpassword",
    (
      key,
      {
        arg,
      }: {
        arg: {
          verificationCode: string;
          password: string;
          confirmPassword: string;
        };
      }
    ) => resetPassword(arg),
    {
      onSuccess: () => {
        router.push("/admin/login");
      },
    }
  );

  const [passwordVisible, setPasswordVisible] = useState({
    oldPassword: false,
    new: false,
    confirm: false,
  });

  const onPasswordChange = async (data: FormData) => {
    try {
      if (verificationCode) {
        await trigger({
          verificationCode,
          password: data.newPassword,
          confirmPassword: data.confirmPassword,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return isMutating ? (
    <>
      <Loading />
    </>
  ) : (
    <div className={styles["change-password-container"]}>
      <div className={styles["change-password-wrapper"]}>
        <div className={styles["form-title"]}>
          <Image
            src={twinCJLogo}
            alt="Twin CJ Logo"
            className={styles["change-password-logo"]}
            objectFit="contain"
          />
          <p className={styles["welcome-text"]}>
            Enter a new password below to change your password.
          </p>
        </div>
        <form
          className={styles["form-control"]}
          onSubmit={handleSubmit(onPasswordChange)}
        >
          {/* New Password */}
          <label className={styles["password-input-container"]}>
            <input
              type={passwordVisible.new ? "text" : "password"}
              placeholder="New Password"
              {...register("newPassword")}
            />
            {dirtyFields["newPassword"] && (
              <button
                type="button"
                className={styles["eye-icon"]}
                onClick={() =>
                  setPasswordVisible({
                    ...passwordVisible,
                    new: !passwordVisible.new,
                  })
                }
              >
                {passwordVisible.new ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            )}
          </label>
          {errors.newPassword && (
            <small className={styles["error-message"]}>
              {errors.newPassword.message}
            </small>
          )}

          {/* Confirm Password */}
          <label className={styles["password-input-container"]}>
            <input
              type={passwordVisible.confirm ? "text" : "password"}
              placeholder="Confirm Password"
              {...register("confirmPassword")}
            />
            {dirtyFields["confirmPassword"] && (
              <button
                type="button"
                className={styles["eye-icon"]}
                onClick={() =>
                  setPasswordVisible({
                    ...passwordVisible,
                    confirm: !passwordVisible.confirm,
                  })
                }
              >
                {passwordVisible.confirm ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            )}
          </label>
          {errors.confirmPassword && (
            <small className={styles["error-message"]}>
              {errors.confirmPassword.message}
            </small>
          )}

          <div>
            <Button type="submit">Change Password</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
