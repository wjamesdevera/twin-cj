import React from "react";
import SectionHeader from "@/app/components/SectionHeader";
import Image from "next/image";
import MediaBanner from "@/app/components/mediaBanner";
import FeatureIcons from "./featureIcons";
import CardContainer from "./cardContainer";
import styles from "./page.module.scss";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <Image
        src={"/assets/amenities-header.png"}
        alt="Resort View"
        fill
        className={styles.image}
      />
    </header>
  );
};

export default function Amenities() {
  const cabinCards = [
    {
      title: "Venti Cabin",
      image: "/assets/amenities_venti.jpg",
      description: "For groups of 15-20",
      rates: [
        "Day tour (8AM - 5PM) - ₱10,000",
        "Overnight (4PM - 12NN) - ₱12,000",
        "Additional guests - ₱350 each",
      ],
      additionalInfo: [
        "2 queen-sized beds and 5 foam beds",
        "Spacious kitchen inside",
      ],
      galleryImages: [
        "/assets/amenities-venti-1.png",
        "/assets/amenities-venti-2.png",
        "/assets/amenities-venti-3.png",
        "/assets/amenities-venti-4.png",
      ],
    },
    {
      title: "Maxi Cabin",
      image: "/assets/amenities_maxi.jpg",
      description: "For 6-8 guests",
      rates: [
        "Day tour (8AM - 5PM) - ₱5,000",
        "Overnight (4PM - 12NN) - ₱6,000",
        "Additional guests - ₱350 each",
      ],
      additionalInfo: ["1 queen-sized bed and 2 foam beds"],
      galleryImages: [
        "/assets/amenities-maxi-1.png",
        "/assets/amenities-maxi-2.png",
        "/assets/amenities-maxi-3.png",
        "/assets/amenities-maxi-4.png",
      ],
    },
    {
      title: "Mini Cabin",
      image: "/assets/amenities_mini.jpg",
      description: "For 2-4 guests",
      rates: [
        "Day tour (8AM - 5PM) - ₱2,000 for 2 guests",
        "₱2,500 for 3-4 guests",
        "Overnight (4PM - 12NN) - ₱3,000 for 2 guests",
        "₱3,500 for 3-4 guests",
        "Additional guests - ₱350 each",
      ],
      additionalInfo: ["1 queen-sized bed and 1 foam bed"],
      galleryImages: [
        "/assets/amenities-mini-1.png",
        "/assets/amenities-mini-2.png",
        "/assets/amenities-mini-3.png",
      ],
    },
    {
      title: "Swimming Pool",
      image: "/assets/amenities_pool.jpg",
      description:
        "Dive into fun with our Swimming Pool Access, available for both day and night tours! Book a cabana or enjoy easy access to our kitchen facilities.",
      rates: [],
      additionalInfo: [],
      galleryImages: [
        "/assets/amenities-pool-1.png",
        "/assets/amenities-pool-2.png",
        "/assets/amenities-pool-3.png",
      ],
    },
    {
      title: "River",
      image: "/assets/amenities_river.jpg",
      description:
        "Unwind with nature where relaxation meets the scenic beauty of the Norzagaray and Angat Rivers flowing peacefully by.",
      rates: [],
      additionalInfo: [],
      galleryImages: [
        "/assets/amenities-river-1.png",
        "/assets/amenities-river-2.png",
        "/assets/amenities-river-3.png",
      ],
    },
    {
      title: "Common Kitchen",
      image: "/assets/amenities_kitchen.png",
      description:
        "Fully equipped with essential appliances and cooking tools, it’s perfect for crafting your favorite dishes, whether sharing a meal with friends or creating a family feast.",
      rates: [],
      additionalInfo: [],
      galleryImages: ["/assets/amenities-kitchen-1.png"],
    },
    {
      title: "Camping Ground",
      image: "/assets/amenities_camping.png",
      description:
        "Experience the great outdoors with Tent Pitching or Car Camping options. Rent a tent, enjoy a bonfire, and explore many other exciting activities in our peaceful, nature-filled camping ground.",
      rates: [],
      additionalInfo: [],
      galleryImages: [
        "/assets/amenities-camping-1.png",
        "/assets/amenities-camping-2.png",
        "/assets/amenities-camping-3.png",
      ],
    },
    {
      title: "Gazebo",
      image: "/assets/amenities_gazebo.jpg",
      description:
        "Our Gazebo offers a beautiful space for events, providing a peaceful and scenic setting for gatherings, celebrations, or simply relaxing while enjoying nature.",
      rates: [],
      additionalInfo: [],
      galleryImages: [
        "/assets/amenities-gazebo-1.png",
        "/assets/amenities-gazebo-2.png",
        "/assets/amenities-gazebo-3.png",
      ],
    },
  ];

  return (
    <>
      <Header />
      <div className={styles.mainContainer}>
        <SectionHeader title="AMENITIES" />
        <MediaBanner
          mediaSrc="/assets/amenities-image.png"
          mediaType="image"
          altText="Amenities Banner"
        />
        <section className={styles.amenitiesSection}>
          <div className="container">
            <SectionHeader title="CABIN INCLUSIONS" />
            <FeatureIcons />
            <CardContainer cards={cabinCards} />
          </div>
        </section>
      </div>
    </>
  );
}
