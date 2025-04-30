import React from "react";
import Link from "next/link";
import styles from "./bookNowButton.module.scss";

interface BookNowButtonProps {
  label: string;
  link: string;
}

const BookNowButton: React.FC<BookNowButtonProps> = ({ label, link }) => {
  return (
    <Link href={link} passHref>
      <div className={styles.button}>{label}</div>
    </Link>
  );
};

export default BookNowButton;
