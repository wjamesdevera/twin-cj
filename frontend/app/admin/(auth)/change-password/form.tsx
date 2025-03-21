"use client";
import { useState } from "react";
import styles from "./change_password.module.scss";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import twinCJLogo from "@/public/assets/twin-cj-logo.png";
import Button from "@/app/components/button";
import useSWRMutation from "swr/mutation";
import { changePassword } from "@/app/lib/api";
import { Loading } from "@/app/components/loading";
import { z } from "zod";
import { passwordSchema } from "@/app/lib/zodSchemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z
  .object({
    oldPassword: z.string(),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password do not mathc",
  });

type FormData = z.infer<typeof formSchema>;

export function ChangePasswordForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { trigger, isMutating, error } = useSWRMutation(
    "change-password",
    (
      key,
      {
        arg,
      }: {
        arg: FormData;
      }
    ) => changePassword(arg),
    {
      onSuccess: () => {
        router.push("/admin");
      },
    }
  );

  const [isPasswordVisible, setIsPasswordVisible] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const onPasswordChange = async (data: FormData) => {
    try {
      await trigger(data);
    } catch (error) {
      console.log(error);
    }
  };

  return isMutating ? (
    <Loading />
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
          {/* Current Password */}
          <div className={styles["password-input-container"]}>
            <input
              type={isPasswordVisible.oldPassword ? "text" : "password"}
              placeholder="Current Password"
              {...register("oldPassword")}
            />
            {dirtyFields["oldPassword"] && (
              <button
                type="button"
                className={styles["eye-icon"]}
                onClick={() =>
                  setIsPasswordVisible({
                    ...isPasswordVisible,
                    oldPassword: !isPasswordVisible.oldPassword,
                  })
                }
              >
                {isPasswordVisible.oldPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            )}
          </div>

          {/* TODO: update to validate with backend */}
          {error && (
            <small className={styles["error-message"]}>
              Incorrect password.
            </small>
          )}

          {/* New Password */}
          <div className={styles["password-input-container"]}>
            <input
              type={isPasswordVisible.newPassword ? "text" : "password"}
              placeholder="New Password"
              {...register("newPassword")}
            />
            {dirtyFields["newPassword"] && (
              <button
                type="button"
                className={styles["eye-icon"]}
                onClick={() =>
                  setIsPasswordVisible({
                    ...isPasswordVisible,
                    newPassword: !isPasswordVisible.newPassword,
                  })
                }
              >
                {isPasswordVisible.newPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            )}
          </div>
          {errors.newPassword && (
            <small className={styles["error-message"]}>
              {errors.confirmPassword?.message}
            </small>
          )}

          {/* Confirm Password */}
          <div className={styles["password-input-container"]}>
            <input
              type={isPasswordVisible.confirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              {...register("confirmPassword")}
            />
            {dirtyFields["confirmPassword"] && (
              <button
                type="button"
                className={styles["eye-icon"]}
                onClick={() =>
                  setIsPasswordVisible({
                    ...isPasswordVisible,
                    confirmPassword: !isPasswordVisible.confirmPassword,
                  })
                }
              >
                {isPasswordVisible.confirmPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            )}
          </div>
          {errors.confirmPassword && (
            <small className={styles["error-message"]}>
              {errors.confirmPassword.message}
            </small>
          )}

          <div>
            <Button fullWidth={true} type="submit">
              Change Password
            </Button>
            <Button
              variant="outline-black"
              className={styles["cancel-button"]}
              onClick={() => router.push("/admin")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
