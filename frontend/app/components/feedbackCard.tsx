import React from "react";
import styles from "./feedback-card.module.scss";

type FeedbackCardProps = {
  text: string;
  author: string;
};

const FeedbackCard: React.FC<FeedbackCardProps> = ({ text, author }) => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <p className={styles.feedback}>&quot;{text}&quot;</p>
        <p className={styles.author}>{author}</p>
      </div>
    </div>
  );
};

export default FeedbackCard;
