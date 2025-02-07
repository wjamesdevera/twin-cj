import React from "react";
import styles from "./backButton.module.scss";

interface BackButtonProps {
  className?: string;
}

export default function BackButton({ className }: BackButtonProps) {
  return (
    <div className={`${styles.backBtnContainer} ${className}`}>
      <button className={styles.backBtn}>
        <span className={styles.lessThan}>&lt;</span> Booking Details
      </button>
    </div>
  );
}
