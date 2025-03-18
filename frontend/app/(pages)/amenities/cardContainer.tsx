import React from "react";
import Image from "next/image";
import styles from "./cardcontainer.module.scss";

interface CardProps {
  title: string;
  image: string;
  description: string;
  rates: string[];
  additionalInfo: string[];
}

const CardContainer: React.FC<{ cards: CardProps[] }> = ({ cards }) => {
  return (
    <div className={styles.cardContainer}>
      {cards.map((card, index) => (
        <div key={index} className={styles.card}>
          {card.image && (
            <div className={styles.cardImage}>
              <Image
                src={card.image}
                alt={card.title}
                layout="fill"
                objectFit="cover"
              />
              <h3>{card.title}</h3>
            </div>
          )}

          <div className={styles.cardContent}>
            <p>{card.description}</p>

            {card.rates.length > 0 && (
              <>
                <strong>Rates:</strong>
                <ul>
                  {card.rates.map((rate, idx) => (
                    <li key={idx}>{rate}</li>
                  ))}
                </ul>
              </>
            )}

            {card.additionalInfo.length > 0 && (
              <>
                <strong>Additional Inclusions:</strong>
                <ul>
                  {card.additionalInfo.map((info, idx) => (
                    <li key={idx}>{info}</li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <div className={styles.buttons}>
            <button className={styles.morePhotos}>More Photos</button>
            {index < 3 && <button className={styles.bookNow}>Book Now</button>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardContainer;
