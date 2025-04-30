import React from "react";
import styles from "./paymentDetails.module.scss";
import paymentDetailHeader from "../../public/assets/payment-details-header.png";
import Image from "next/image";

export default function paymentDetailsHeader() {
  return (
    <div className={styles.containerHeader}>
      <Image
        src={paymentDetailHeader}
        alt="Payment Details Header"
        className={styles.header}
      />
    </div>
  );
}
