import React from "react";
import styles from "./confirmBooking.module.scss";

export default function confirmBooking() {
  return (
    <div className={styles.btnContainer}>
      <button className={styles.confirmBooking}>CONFIRM BOOKING</button>
    </div>
  );
}
