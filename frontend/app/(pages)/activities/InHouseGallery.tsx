import React from "react";
import Image from "next/image";
import styles from "./inHouseGallery.module.scss";

const InHouseGallery: React.FC = () => {
  const images = [
    { src: "/assets/activities-kayak.png", text: "Crystal Kayak" },
    { src: "/assets/activities-atv.png", text: "ATV/UTV Ride" },
    { src: "/assets/activities-karaoke.png", text: "Karaoke Rent" },
    { src: "/assets/activities-bonfire.png", text: "Bonfire" },
    { src: "/assets/activities-fishing.png", text: "Fishing" },
  ];

  return (
    <div className={styles.gallery}>
      {images.map((image, index) => (
        <div
          key={index}
          className={`${styles.galleryItem} ${
            index === 4 ? styles.fullWidth : ""
          }`}
        >
          <div className={styles.imageContainer}>
            <Image
              src={image.src}
              alt={`In-House Activity ${index + 1}`}
              width={index === 4 ? 1200 : 600}
              height={index === 4 ? 200 : 200}
              className={styles.image}
            />

            <div className={styles.gradientOverlay}></div>
            <div className={styles.imageText}>{image.text}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InHouseGallery;
