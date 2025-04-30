import React from "react";
import styles from "./section-header.module.scss";

type SectionHeaderProps = {
  title: string;
  subtext?: string;
};

const SectionHeader = ({ title, subtext }: SectionHeaderProps) => {
  return (
    <div className={styles["section-header"]}>
      {subtext && <p className={styles["subtext"]}>{subtext}</p>}
      <h2 className={styles["title"]}>{title}</h2>
    </div>
  );
};

export default SectionHeader;
