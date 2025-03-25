import React from "react";
import styles from "./bookNowButton.module.scss";

interface BookNowButtonProps {
  label: string;
  link: string;
}

const BookNowButton: React.FC<BookNowButtonProps> = ({ label, link }) => {
  return (
    <a href={link} className={styles.button}>
      {label}
    </a>
  );
};

export default BookNowButton;
