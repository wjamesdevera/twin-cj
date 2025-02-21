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

const Form = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verificationCode = searchParams.get("code");
  const { trigger, isMutating } = useSWRMutation(
    "resetpassword",
    (key, { arg }: { arg: { verificationCode: string; password: string } }) =>
      resetPassword(arg),
    {
      onSuccess: () => {
        router.push("/admin/login");
      },
    }
  );

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
  });
  const [passwordVisible, setPasswordVisible] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const isFieldsEmpty = () => {
    return (
      (newPassword === null && confirmPassword === null) ||
      (newPassword === "" && confirmPassword === "")
    );
  };

  const validatePassword = (password: string) => {
    setPasswordValidations({
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password),
    });
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    validatePassword(e.target.value);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsPasswordMatch(newPassword === confirmPassword || !isFieldsEmpty);
    setConfirmPassword(e.target.value);
  };

  const handleResetPassword = async () => {
    const password = confirmPassword;
    return verificationCode
      ? await trigger({ verificationCode, password })
      : null;
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
        <div className={styles["form-control"]}>
          {/* New Password */}
          <label className={styles["password-input-container"]}>
            <input
              type={passwordVisible.new ? "text" : "password"}
              name="new-password"
              placeholder="New Password"
              value={newPassword}
              onChange={handleNewPasswordChange}
            />
            {newPassword === "" ? null : (
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

          {/* Password Requirements */}
          <div className={styles["password-requirements"]}>
            <p>Your password must contain:</p>
            <ul>
              <li
                className={
                  passwordValidations.length ? styles.valid : styles.invalid
                }
              >
                {passwordValidations.length ? "✔" : "✖"} At least 8 characters
              </li>
              <li
                className={
                  passwordValidations.lowercase ? styles.valid : styles.invalid
                }
              >
                {passwordValidations.lowercase ? "✔" : "✖"} Lower case letters
                (a-z)
              </li>
              <li
                className={
                  passwordValidations.uppercase ? styles.valid : styles.invalid
                }
              >
                {passwordValidations.uppercase ? "✔" : "✖"} Upper case letters
                (A-Z)
              </li>
              <li
                className={
                  passwordValidations.number ? styles.valid : styles.invalid
                }
              >
                {passwordValidations.number ? "✔" : "✖"} Numbers (0-9)
              </li>
              <li
                className={
                  passwordValidations.special ? styles.valid : styles.invalid
                }
              >
                {passwordValidations.special ? "✔" : "✖"} Special characters
                (ex. !@#$%^&*)
              </li>
            </ul>
          </div>

          {/* Confirm Password */}
          <label className={styles["password-input-container"]}>
            <input
              type={passwordVisible.confirm ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            {confirmPassword === "" ? null : (
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
          {!isPasswordMatch && confirmPassword.length > 0 && (
            <small className={styles["error-message"]}>
              Passwords do not match
            </small>
          )}

          <div>
            <Button onClick={handleResetPassword}>Change Password</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
