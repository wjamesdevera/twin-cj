"use client";

import React, { useState } from "react";
import styles from "./tabLayout.module.scss";
import TabContent from "./TabContent";
import ActivitiesCarousel from "./ActivitiesCarousel";

const tabImages: { [key in (typeof tabs)[number]]: string[] } = {
  "Day Tour": [
    "/assets/daytour-carousel-1.png",
    "/assets/daytour-carousel-2.jpg",
    "/assets/daytour-carousel-3.jpg",
    "/assets/daytour-carousel-4.jpg",
  ],
  Camping: [
    "/assets/camping-carousel-1.png",
    "/assets/camping-carousel-2.jpg",
    "/assets/camping-carousel-3.jpg",
  ],
  "In-House Activities": [
    "/assets/inhouse-carousel-1.png",
    "/assets/inhouse-carousel-2.jpg",
    "/assets/inhouse-carousel-3.png",
  ],
  Photoshoot: [
    "/assets/photoshoot-carousel-1.png",
    "/assets/photoshoot-carousel-2.jpg",
    "/assets/photoshoot-carousel-3.jpg",
  ],
};

const tabs = [
  "Day Tour",
  "Camping",
  "In-House Activities",
  "Photoshoot",
] as const;

const TabLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [openedFile, setOpenedFile] = useState<string | null>(null);

  const handleViewOffers = () => {
    const offerFiles = {
      Camping: "/assets/camping-offer.pdf",
      "In-House Activities": "/assets/inhouse-offer.pdf",
      Photoshoot: "/assets/photoshoot-offer.pdf",
    };

    const tabKey = tabs[activeTab];
    if (tabKey in offerFiles) {
      const fileUrl = offerFiles[tabKey as keyof typeof offerFiles];
      if (fileUrl) {
        setOpenedFile(fileUrl);
      }
    }
  };

  const closeFile = () => {
    setOpenedFile(null);
  };

  return (
    <div className={styles.tabLayout}>
      <div className={styles.tabs}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={activeTab === index ? styles.active : ""}
            onClick={() => setActiveTab(index)}
          >
            {tab}
          </button>
        ))}
      </div>

      <ActivitiesCarousel images={tabImages[tabs[activeTab]]} />

      <TabContent
        title={tabs[activeTab]}
        paragraph={
          activeTab === 0
            ? "Enjoy a full day of fun and relaxation with access to the pool, rivers, and create lasting memories with family and friends."
            : undefined
        }
        showButton={activeTab !== 0}
        onViewOffers={activeTab !== 0 ? handleViewOffers : undefined}
      />

      {openedFile && (
        <div className={styles.fileModal} onClick={closeFile}>
          <div className={styles.fileContent}>
            <button className={styles.closeButton}>&times;</button>
            {openedFile.endsWith(".pdf") ? (
              <iframe src={openedFile} width="100%" height="600px" />
            ) : (
              <img src={openedFile} alt="Offer" className={styles.fileImage} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TabLayout;
