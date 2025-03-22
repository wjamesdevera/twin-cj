import React from "react";
import styles from "./tabContent.module.scss";

interface TabContentProps {
  title: string;
  paragraph?: string;
  showButton?: boolean;
  onViewOffers?: () => void;
}

const TabContent: React.FC<TabContentProps> = ({
  title,
  paragraph,
  showButton,
  onViewOffers,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <hr />
        <h2>{title}</h2>
        {paragraph ? <p>{paragraph}</p> : null}
        {showButton ? (
          <button className={styles.viewOffers} onClick={onViewOffers}>
            View Offers
          </button>
        ) : null}
        <hr />
      </div>
    </div>
  );
};

export default TabContent;
