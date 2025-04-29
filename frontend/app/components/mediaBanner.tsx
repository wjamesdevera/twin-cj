import React from "react";
import styles from "./mediaBanner.module.scss";
import Image from "next/image";

interface MediaBannerProps {
  mediaSrc: string;
  mediaType: "image" | "video";
  altText?: string;
}

const MediaBanner: React.FC<MediaBannerProps> = ({
  mediaSrc,
  mediaType,
  altText,
}) => {
  return (
    <div className={styles.mediaBanner}>
      {mediaType === "video" ? (
        <video className={styles.media} autoPlay loop muted>
          <source src={mediaSrc} type="video/mp4" />
          {altText}
        </video>
      ) : (
        <Image
          src={mediaSrc}
          alt={altText || "Media"}
          className={styles.media}
          fill
        />
      )}
    </div>
  );
};

export default MediaBanner;
