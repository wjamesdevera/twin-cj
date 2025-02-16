import React from "react";
import styles from "./title.module.scss";

interface TitleProps {
  text: string;
}

const Title: React.FC<TitleProps> = ({ text }) => {
  return (
    <div className={styles["title-container"]}>
      <h2 className={styles.title}>{text}</h2>
      <div className={styles.line}></div>
    </div>
  );
};

export default Title;
