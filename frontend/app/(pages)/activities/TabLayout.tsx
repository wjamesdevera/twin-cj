import React from "react";
import styles from "./tabLayout.module.scss";

interface TabLayoutProps {
  activeTab: number;
  onTabChange: (index: number) => void;
}

const tabs = [
  "Day Tour",
  "Camping",
  "In-House Activities",
  "Photoshoot",
] as const;

const TabLayout: React.FC<TabLayoutProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className={styles.tabLayout}>
      <div className={styles.tabs}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={activeTab === index ? styles.active : ""}
            onClick={() => onTabChange(index)}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabLayout;
