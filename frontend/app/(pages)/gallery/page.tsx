import React from "react";
import SectionHeader from "../../components/SectionHeader";
import Gallery from "./Gallery";
import Image from "next/image";
import styles from "./page.module.scss";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <Image
        src={"/assets/gallery-header.png"}
        alt="Resort View"
        fill
        className={styles.image}
      />
    </header>
  );
};

const galleryImages: {
  src: string;
  type: "square" | "landscape" | "portrait";
}[] = [
  { src: "/assets/gallery1.png", type: "square" },
  { src: "/assets/gallery2.png", type: "square" },
  { src: "/assets/gallery3.png", type: "square" },
  { src: "/assets/gallery4.png", type: "portrait" },
  { src: "/assets/gallery5.png", type: "portrait" },
  { src: "/assets/gallery6.png", type: "square" },
  { src: "/assets/gallery7.png", type: "square" },
  { src: "/assets/gallery8.png", type: "landscape" },
  { src: "/assets/gallery9.png", type: "square" },
  { src: "/assets/gallery10.png", type: "landscape" },
  { src: "/assets/gallery11.png", type: "square" },
  { src: "/assets/gallery12.png", type: "square" },
];

export default function page() {
  return (
    <>
      <Header />
      <SectionHeader title="GALLERY" />
      <Gallery images={galleryImages} />
    </>
  );
}
