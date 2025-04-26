import React from "react";
import styles from "./pricingContainer.module.scss";
import Image from "next/image";

interface PricingContainerProps {
  className?: string;
  style?: React.CSSProperties;
  numberOfGuests: string;
  type: string;
  bookingType: string;
  imageSrc?: string;
  packageType: string;
  totalAmount: number;
  packagePrice: number;
}

const PricingContainer: React.FC<PricingContainerProps> = ({
  className,
  style,
  numberOfGuests,
  type,
  packageType,
  bookingType,
  imageSrc,
  totalAmount,
  packagePrice,
}) => {
  return (
    <div className={`${styles.pricingContainer} ${className}`} style={style}>
      <div className={styles.banner}>
        <div className={styles.pricingImg}>
          <Image
            src={imageSrc ? imageSrc : ""}
            alt="image"
            width={500}
            height={500}
          />
        </div>

        <div className={styles.pricingHeader}>
          <h3 className={styles.text}>{numberOfGuests}</h3>
          <h3 className={styles.text}>{type}</h3>
          <h2 className={styles.title}>{packageType}</h2>
        </div>
      </div>
      <div className={styles.detailsContainer}>
        <div className={styles.leftContainer}>
          <h2 className={styles.pricingTitle}>Pricing Details</h2>
          <h3 className={styles.pricingText}>{bookingType}</h3>
        </div>
        <div className={styles.rightContainer}>
          <h3 className={styles.prices}> ₱ {packagePrice.toLocaleString()}</h3>
        </div>
      </div>

      <div className={styles.totalAmountContainer}>
        <div className={styles.leftContainer}>
          <h2 className={styles.pricingTitle}>Down Payment: </h2>
        </div>

        <div className={styles.rightContainer}>
          <h3 className={styles.totalAmount}>
            ₱ {totalAmount ? totalAmount.toLocaleString() : "0.00"}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default PricingContainer;
