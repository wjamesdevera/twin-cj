import React from "react";
import styles from "./backButton.module.scss";

export default function backButton() {
  return (
    <div>
      <button className={styles.backBtn}>
        {" "}
        <span className={styles.lessThan}>&lt;</span> Booking Details{" "}
      </button>
    </div>
  );
}
