import React from "react";
import styles from "./pricingContainer.module.scss";

interface PricingContainerProps {
  className?: string;
  style?: React.CSSProperties;
  numberOfGuests: string;
  type: string;
  cabinType: string;
}

const PricingContainer: React.FC<PricingContainerProps> = ({
  className,
  style,
  numberOfGuests,
  type,
  cabinType,
}) => {
  return (
    <div className={`${styles.pricingContainer} ${className}`} style={style}>
      <div className={styles.banner}>
        <div className={styles.pricingImg}>
          <img src="/assets/MaxiCabin.png" alt="cabin" />
        </div>
        <div className={styles.pricingHeader}>
          <h3 className={styles.text}>{numberOfGuests}</h3>
          <h3 className={styles.text}>{type}</h3>
          <h2 className={styles.title}>{cabinType}</h2>
        </div>
      </div>
      <div className={styles.detailsContainer}>
        <div className={styles.leftContainer}>
          <h2 className={styles.title}>Pricing Details</h2>
          <h3 className={styles.text}>Package per night x1</h3>
        </div>
        <div className={styles.rightContainer}>
          <h3 className={styles.text}>₱ 5,000</h3>
        </div>
      </div>
      <div className={styles.totalAmountContainer}>
        <div className={styles.leftContainer}>
          <h2 className={styles.title}>Total Amount</h2>
        </div>

        <div className={styles.rightContainer}>
          <h3 className={styles.title}>₱ 5,000</h3>
        </div>
      </div>
    </div>
  );
};

export default PricingContainer;
