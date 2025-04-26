import React from "react";
import styles from "./paymentDetails.module.scss";
import Image from "next/image";

export default function paymentDetailsHeader() {
  return (
    <div className={styles.containerHeader}>
      <Image
        src="/assets/payment-details-header.png"
        alt="Payment Details Header"
        className={styles.header}
      />
    </div>
  );
}
