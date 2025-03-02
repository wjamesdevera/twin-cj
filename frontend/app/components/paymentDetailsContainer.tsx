import React, { ReactNode } from 'react';
import styles from './paymentDetailsContainer.module.scss';

interface PaymentDetailsContainerProps {
  className?: string;
  heading: string;
  subheading: string | ReactNode;
  style?: React.CSSProperties;
}

const PaymentDetailsContainer: React.FC<PaymentDetailsContainerProps> = ({
  heading,
  subheading,
  style,
  className,
}) => {
  return (
    <div className={`${styles.container} ${className}`} style={style}>
      <h2 className={styles.heading}>{heading}</h2>
      <h3 className={styles.subheading}>{subheading}</h3>
    </div>
  );
};

export default PaymentDetailsContainer;
