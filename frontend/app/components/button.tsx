import React, { ButtonHTMLAttributes } from "react";
import styles from "./button.module.scss";
import { Loading } from "./loading";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "danger"
    | "outline-white"
    | "outline-black";
  fullWidth?: boolean;
  isLoading?: boolean;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  fullWidth,
  isLoading,
  className,
  onClick,
  children,
  ...rest
}) => {
  return (
    <button
      className={clsx(
        styles.btn,
        styles[variant],
        fullWidth && styles["full-width"],
        className
      )}
      onClick={onClick}
      disabled={isLoading || rest.disabled}
      {...rest}
    >
      {isLoading ? <Loading /> : children}
    </button>
  );
};

export default Button;
