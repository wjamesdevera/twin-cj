import React from "react";
import styles from "./featureicons.module.scss";
import {
  FaSnowflake,
  FaUtensils,
  FaParking,
  FaSwimmingPool,
  FaToilet,
} from "react-icons/fa";

const icons = [
  { icon: <FaSnowflake />, label: "Fully air-conditioned" },
  { icon: <FaUtensils />, label: "Common kitchen" },
  { icon: <FaParking />, label: "Free Parking" },
  {
    icon: <FaSwimmingPool />,
    label: "Unlimited access to pool<br />and river",
  },
  { icon: <FaToilet />, label: "Own Restroom" },
];

const FeatureIcons: React.FC = () => {
  return (
    <div className={styles.featureIcons}>
      {icons.map((item, index) => (
        <div key={index} className={styles.iconBox}>
          {item.icon}
          <span dangerouslySetInnerHTML={{ __html: item.label }} />{" "}
        </div>
      ))}
    </div>
  );
};

export default FeatureIcons;
