"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styles from "./custom_button.module.scss";

interface CustomButtonProps {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  size?: "small" | "default";
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  href,
  onClick,
  variant = "primary",
  size = "default",
  disabled = false,
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (disabled) return; 

    if (href) {
      router.push(href);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <button
      className={`${styles.button} ${styles[variant]} ${size === "small" ? styles.small : ""} ${
        disabled ? styles.disabled : ""
      }`}
      onClick={handleClick}
      disabled={disabled} 
    >
      {label}
    </button>
  );
};

export default CustomButton;
