import React, { useState } from "react";
import styles from "./tabContent.module.scss";
import Image from "next/image";
import priceListImage from "@/public/assets/pricelist.png";

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
            <Image
              src={priceListImage}
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
