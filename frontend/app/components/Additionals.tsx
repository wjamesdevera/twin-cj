import React from "react";
import styles from "./additionals.module.scss";

interface AdditionalsProps {
  title: string;
  price: string;
  imageSrc: string;
  isSelected: boolean;
  onSelect: () => void;
}

const Additionals: React.FC<AdditionalsProps> = ({
  title,
  price,
  imageSrc,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      className={`${styles.additionals} ${isSelected ? styles.selected : ""}`}
      onClick={onSelect}
    >
      <div className={`${styles.checkbox} ${isSelected ? styles.checked : ""}`}>
        {isSelected && <span className={styles.checkmark}>✔</span>}
      </div>
      <div className={styles.cardContent}>
        <div className={styles.textContent}>
          <div className={styles.title}>{title}</div>
          <span className={styles.price}>{price}</span>
        </div>
        <div className={styles.imageContainer}>
          <img className={styles.image} src={imageSrc} alt={title} />
        </div>
      </div>
    </div>
  );
};

export default Additionals;
