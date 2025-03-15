import React from 'react';
import styles from './paymentDetails.module.scss';

export default function paymentDetailsHeader() {
  return (
    <div className={styles.containerHeader}>
      <img
        src="/assets/payment-details-header.png"
        alt="Payment Details Header"
        className={styles.header}
      />
    </div>
  );
}
