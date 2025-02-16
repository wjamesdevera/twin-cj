import React from "react";
import styles from "./header.module.scss";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <img
        src="/assets/contact-us-header.png"
        alt="Resort View"
        className={styles.image}
      />
    </header>
  );
};

export default Header;
