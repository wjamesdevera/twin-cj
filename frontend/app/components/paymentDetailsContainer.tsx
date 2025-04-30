import React, { ReactNode } from "react";
import styles from "./paymentDetailsContainer.module.scss";

interface PaymentDetailsContainerProps {
  className?: string;
  heading: string;
  subheading: string | ReactNode;
  style?: React.CSSProperties;
  status?: string;
  downPayment?: number;
  totalAmount?: string;
  paymentMethod?: string;
  email?: string;
  contactNumber?: string;
  fullName?: string;
}

const PaymentDetailsContainer: React.FC<PaymentDetailsContainerProps> = ({
  heading,
  subheading,
  style,
  className,
  status,
  downPayment,
  totalAmount,
  paymentMethod,
  email,
  contactNumber,
  fullName,
}) => {
  return (
    <div className={`${styles.container} ${className}`} style={style}>
      <h2 className={styles.heading}>{heading}</h2>
      <h3 className={styles.subheading}>{subheading}</h3>

      {fullName && (
        <p className={styles.detail}>
          <strong>Full Name:</strong> {fullName}
        </p>
      )}

      {email && (
        <p className={styles.detail}>
          <strong>Email:</strong> {email}
        </p>
      )}

      {contactNumber && (
        <p className={styles.detail}>
          <strong>Contact Number:</strong> {contactNumber}
        </p>
      )}
      {totalAmount !== undefined && (
        <p className={styles.detail}>
          <strong>Total Amount:</strong> ₱{totalAmount.toLocaleString()}
        </p>
      )}

      {downPayment !== undefined && (
        <p className={styles.detail}>
          <strong>Down Payment:</strong> ₱{downPayment.toLocaleString()}
        </p>
      )}

      {paymentMethod && (
        <p className={styles.detail}>
          <strong>Payment Method:</strong> {paymentMethod}
        </p>
      )}

      {status && (
        <p className={styles.detail}>
          <strong>Status:</strong> {status}
        </p>
      )}
    </div>
  );
};

export default PaymentDetailsContainer;
