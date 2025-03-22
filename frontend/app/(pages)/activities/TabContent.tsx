import React, { useState } from "react";
import styles from "./tabContent.module.scss";

interface TabContentProps {
  title: string;
  paragraph?: string;
  showButton?: boolean;
}

const TabContent: React.FC<TabContentProps> = ({
  title,
  paragraph,
  showButton,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <hr />
        <h2>{title}</h2>
        {paragraph ? <p>{paragraph}</p> : null}
        {showButton && (
          <button className={styles.viewOffers} onClick={openModal}>
            View Offers
          </button>
        )}
        <hr />
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeButton} onClick={closeModal}>
              &times;
            </button>
            <img
              src="/assets/pricelist.png"
              alt="Offers"
              className={styles.modalImage}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TabContent;
