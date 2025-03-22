import React from "react";
import Image from "next/image";
import styles from "./page.module.scss";
import SectionHeader from "../../components/SectionHeader";
import TabLayout from "./TabLayout";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <Image
        src={"/assets/activities-header.png"}
        alt="Resort View"
        fill
        className={styles.image}
      />
    </header>
  );
};

export default function page() {
  return (
    <>
      <Header />
      <SectionHeader title="ACTIVITIES" />
      <TabLayout />
    </>
  );
}
