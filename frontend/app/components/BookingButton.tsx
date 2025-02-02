import React from "react";
import styles from "./bookingbutton.module.scss";

const BookingButton: React.FC = () => {
  return (
    <div className={styles.buttonContainer}>
      <button className={styles.bookingButton}>Proceed to Payment</button>
    </div>
  );
};

export default BookingButton;
