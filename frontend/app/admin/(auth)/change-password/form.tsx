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

export function ChangePasswordForm() {
  const router = useRouter();

  const { trigger, isMutating, error } = useSWRMutation(
    "change-password",
    (
      key,
      {
        arg,
      }: {
        arg: {
          oldPassword: string;
          newPassword: string;
          confirmPassword: string;
        };
      }
    ) => changePassword(arg),
    {
      onSuccess: () => {
        router.push("/admin");
      },
    }
  );

  const [oldPassword, setOldPassword] = useState("");
  const [isOldPasswordCorrect, setIsOldPasswordCorrect] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
  });

  const [passwordMatch, setPasswordMatch] = useState(true);

  // Simulated check for old password (Replace with actual authentication logic)
  const handleOldPasswordBlur = () => {
    const correctOldPassword = "admin123"; // Replace
    setIsOldPasswordCorrect(oldPassword === correctOldPassword);
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
    const password = e.target.value;
    setNewPassword(password);
    validatePassword(password);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
    setPasswordMatch(e.target.value === newPassword);
  };

  const isAllValidationsPassed =
    Object.values(passwordValidations).every(Boolean);

  const handleChangePassword = async () => {
    try {
      await trigger({ oldPassword, newPassword, confirmPassword });
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
        <div className={styles["form-control"]}>
          {/* Current Password */}
          <div className={styles["password-input-container"]}>
            <input
              type={passwordVisible.old ? "text" : "password"}
              placeholder="Current Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              onBlur={handleOldPasswordBlur}
            />
            {!oldPassword ? null : (
              <button
                type="button"
                className={styles["eye-icon"]}
                onClick={() =>
                  setPasswordVisible({
                    ...passwordVisible,
                    old: !passwordVisible.old,
                  })
                }
                disabled={!oldPassword}
              >
                {passwordVisible.old ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            )}
          </div>

          {/* TODO: update to validate with backend */}
          {error ? (
            <small className={styles["error-message"]}>
              Incorrect password.
            </small>
          ) : null}

          {/* New Password */}
          <div className={styles["password-input-container"]}>
            <input
              type={passwordVisible.new ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={handleNewPasswordChange}
            />
            {!isOldPasswordCorrect ? null : (
              <button
                type="button"
                className={styles["eye-icon"]}
                onClick={() =>
                  setPasswordVisible({
                    ...passwordVisible,
                    new: !passwordVisible.new,
                  })
                }
                disabled={!isOldPasswordCorrect}
              >
                {passwordVisible.new ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            )}
          </div>

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
          <div className={styles["password-input-container"]}>
            <input
              type={passwordVisible.confirm ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            {!confirmPassword ? null : (
              <button
                type="button"
                className={styles["eye-icon"]}
                onClick={() =>
                  setPasswordVisible({
                    ...passwordVisible,
                    confirm: !passwordVisible.confirm,
                  })
                }
                disabled={!isAllValidationsPassed}
              >
                {passwordVisible.confirm ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            )}
          </div>
          {!passwordMatch && confirmPassword.length > 0 && (
            <small className={styles["error-message"]}>
              Passwords do not match
            </small>
          )}

          <div>
            <Button fullWidth={true} onClick={handleChangePassword}>
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
        </div>
      </div>
    </div>
  );
}
