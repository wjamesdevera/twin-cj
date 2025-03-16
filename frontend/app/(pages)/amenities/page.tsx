import React from "react";
import SectionHeader from "@/app/components/SectionHeader";
import Image from "next/image";
import styles from "./page.module.scss";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <Image src={""} alt="Resort View" fill className={styles.image} />
    </header>
  );
};

export default function Amenities() {
  return (
    <>
      <Header />

      <section className={styles[""]}>
        <div className={`${styles[""]} container`}>
          <SectionHeader title="AMENITIES" />
        </div>
      </section>
    </>
  );
}
