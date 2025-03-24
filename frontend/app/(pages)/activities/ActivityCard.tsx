import React from "react";
import Image from "next/image";
import styles from "./activityCard.module.scss";
import BookNowButton from "./BookNowButton";

interface ActivityCardProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  guidelines?: string[];
  rates?: { label: string; price: string }[];
  buttonLabel?: string;
  buttonLink?: string;
  reverse?: boolean;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  imageSrc,
  imageAlt,
  title,
  description,
  guidelines,
  rates,
  buttonLabel,
  buttonLink,
  reverse = false,
}) => {
  return (
    <div className={`${styles.card} ${reverse ? styles.reverse : ""}`}>
      <div className={styles.imageContainer}>
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={400}
          height={250}
          className={styles.image}
        />
      </div>

      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        <hr className={styles.titleLine} />
        <p className={styles.description}>{description}</p>

        {guidelines && guidelines.length > 0 && (
          <div className={styles.guidelines}>
            <ul>
              {guidelines.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {rates && rates.length > 0 && (
          <div className={styles.rates}>
            <h4>Rates:</h4>
            <ul>
              {rates.map((rate, index) => (
                <li key={index}>
                  {rate.label} - <strong>{rate.price}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}

        {buttonLabel && buttonLink && (
          <div className={styles.buttonContainer}>
            <BookNowButton label={buttonLabel} link={buttonLink} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityCard;
