"use client";

import React, { useState } from "react";
import styles from "./scheduleselector.module.scss";

const ScheduleSelector: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <div className={styles.scheduleSelector}>
      <div className={styles.options}>
        <div
          className={`${styles.option} ${
            selectedOption === "day-tour" ? styles.active : ""
          }`}
          onClick={() => handleOptionSelect("day-tour")}
        >
          <input
            type="radio"
            name="schedule"
            id="day-tour"
            checked={selectedOption === "day-tour"}
            onChange={() => handleOptionSelect("day-tour")}
          />
          <label htmlFor="day-tour">
            Day Tour <span>(8:00 AM - 5:00 PM)</span>
          </label>
        </div>
        <div
          className={`${styles.option} ${
            selectedOption === "overnight" ? styles.active : ""
          }`}
          onClick={() => handleOptionSelect("overnight")}
        >
          <input
            type="radio"
            name="schedule"
            id="overnight"
            checked={selectedOption === "overnight"}
            onChange={() => handleOptionSelect("overnight")}
          />
          <label htmlFor="overnight">
            Overnight <span>(4:00 PM - 12:00 NN)</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ScheduleSelector;
