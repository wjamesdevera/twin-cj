import React from "react";
import ContactInfo from "./contactinfo";
import InquiryForm from "./inquiry-form";
import styles from "./page.module.scss";
import SectionHeader from "../../components/SectionHeader";
import Image from "next/image";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <Image
        src={"/assets/contact-us-header.png"}
        alt="Resort View"
        fill
        className={styles.image}
      />
    </header>
  );
};

export default function ContactUs() {
  return (
    <>
      <Header />
      <ContactInfo />
      <section className={styles["inquiry-form"]}>
        <div className={`${styles[""]} container`}>
          <SectionHeader title="GOT ANY CONCERNS? WE'RE HERE!" />
          <InquiryForm />
        </div>
      </section>
    </>
  );
}
