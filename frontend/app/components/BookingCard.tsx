import React from "react";
import styles from "./bookingcard.module.scss";

interface BookingCardProps {
  title: string;
  description: string;
  price: string;
  additionalPrice: string;
  imageSrc: string;
  isSelected: boolean;
  onSelect: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({
  title,
  description,
  price,
  additionalPrice,
  imageSrc,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      className={`${styles.bookingCard} ${isSelected ? styles.selected : ""}`}
      onClick={onSelect}
    >
      <input
        type="radio"
        className={styles.radio}
        checked={isSelected}
        readOnly
      />
      <div className={styles.cardContent}>
        <div className={styles.textContent}>
          <div className={styles.title}>{title}</div>
          <div className={styles.description}>{description}</div>
          <div className={styles.priceDetails}>
            <span className={styles.price}>{price}</span>
            <span className={styles.additionalPrice}>{additionalPrice}</span>
          </div>
        </div>
        <div className={styles.imageContainer}>
          <img className={styles.image} src={imageSrc} alt={title} />
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
