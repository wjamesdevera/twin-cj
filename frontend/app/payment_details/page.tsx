import React from "react";
import PaymentDetailsHeader from "../components/paymentDetailsHeader";
import styles from "../components/paymentDetails.module.scss";
import BackBtn from "../components/backButton";

export default function () {
  return (
    <div className={styles.container}>
      <PaymentDetailsHeader />
      <BackBtn />
      <h2>Payment Details</h2>
    </div>
  );
}
