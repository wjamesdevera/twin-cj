"use client";

import React from "react";
import styles from "./scheduleselector.module.scss";

interface ScheduleSelectorProps {
  selectedOption: string | null;
  handleOptionSelect: (option: string) => void;
}

const ScheduleSelector: React.FC<ScheduleSelectorProps> = ({
  selectedOption,
  handleOptionSelect,
}) => {
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
          onClick={() => handleOptionSelect("cabins")}
        >
          <input
            type="radio"
            name="schedule"
            id="overnight"
            checked={selectedOption === "cabins"}
            onChange={() => handleOptionSelect("cabins")}
          />
          <label htmlFor="cabins">
            Overnight <span>(4:00 PM - 12:00 NN)</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ScheduleSelector;
