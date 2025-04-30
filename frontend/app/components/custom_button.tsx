"use client";

import React, { ButtonHTMLAttributes } from "react";
import styles from "./custom_button.module.scss";

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  href?: string;
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "default";
  disabled?: boolean;
  children?: React.ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  variant = "primary",
  size = "default",
  disabled = false,
  ...rest
}) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${
        size === "small" ? styles.small : ""
      } ${disabled ? styles.disabled : ""}`}
      disabled={disabled}
      {...rest}
    >
      {label}
    </button>
  );
};

export default CustomButton;
