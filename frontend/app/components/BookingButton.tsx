import React from "react";
import styles from "./bookingbutton.module.scss";

interface BookingButtonProps {
  text?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const BookingButton: React.FC<BookingButtonProps> = ({
  text = "Proceed to Payment",
  onClick,
  disabled = false,
}) => {
  return (
    <div className={styles.buttonContainer}>
      <button
        className={styles.bookingButton}
        onClick={onClick}
        disabled={disabled}
      >
        {text}
      </button>
    </div>
  );
};

export default BookingButton;
