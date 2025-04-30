import React from "react";
import SectionHeader from "@/app/components/SectionHeader";
import Image from "next/image";
import MediaBanner from "@/app/components/mediaBanner";
import FeatureIcons from "./featureIcons";
import CardContainer from "./cardContainer";
import styles from "./page.module.scss";
import ventiCabinImage from "@/public/assets/amenities_venti.jpg";
import maxiCabinImage from "@/public/assets/amenities_maxi.jpg";
import miniCabinImage from "@/public/assets/amenities_mini.jpg";
import poolImage from "@/public/assets/amenities_pool.jpg";
import riverImage from "@/public/assets/amenities_river.jpg";
import kitchenImage from "@/public/assets/amenities_kitchen.png";
import campingImage from "@/public/assets/amenities_camping.png";
import gazeboImage from "@/public/assets/amenities_gazebo.jpg";
import galleryVentiImage from "@/public/assets/amenities-venti-1.png";
import galleryVentiImage2 from "@/public/assets/amenities-venti-2.png";
import galleryVentiImage3 from "@/public/assets/amenities-venti-3.png";
import galleryVentiImage4 from "@/public/assets/amenities-venti-4.png";
import galleryMaxiImage from "@/public/assets/amenities-maxi-1.png";
import galleryMaxiImage2 from "@/public/assets/amenities-maxi-2.png";
import galleryMaxiImage3 from "@/public/assets/amenities-maxi-3.png";
import galleryMaxiImage4 from "@/public/assets/amenities-maxi-4.png";
import galleryMiniImage from "@/public/assets/amenities-mini-1.png";
import galleryMiniImage2 from "@/public/assets/amenities-mini-2.png";
import galleryMiniImage3 from "@/public/assets/amenities-mini-3.png";
import galleryPoolImage from "@/public/assets/amenities-pool-1.png";
import galleryPoolImage2 from "@/public/assets/amenities-pool-2.png";
import galleryPoolImage3 from "@/public/assets/amenities-pool-3.png";
import galleryRiverImage from "@/public/assets/amenities-river-1.png";
import galleryRiverImage2 from "@/public/assets/amenities-river-2.png";
import galleryRiverImage3 from "@/public/assets/amenities-river-3.png";
import galleryKitchenImage from "@/public/assets/amenities-kitchen-1.png";
import galleryCampingImage from "@/public/assets/amenities-camping-1.png";
import galleryCampingImage2 from "@/public/assets/amenities-camping-2.png";
import galleryCampingImage3 from "@/public/assets/amenities-camping-3.png";
import galleryGazeboImage from "@/public/assets/amenities-gazebo-1.png";
import galleryGazeboImage2 from "@/public/assets/amenities-gazebo-2.png";
import galleryGazeboImage3 from "@/public/assets/amenities-gazebo-3.png";

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
      image: ventiCabinImage,
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
        galleryVentiImage,
        galleryVentiImage2,
        galleryVentiImage3,
        galleryVentiImage4,
      ],
    },
    {
      title: "Maxi Cabin",
      image: maxiCabinImage,
      description: "For 6-8 guests",
      rates: [
        "Day tour (8AM - 5PM) - ₱5,000",
        "Overnight (4PM - 12NN) - ₱6,000",
        "Additional guests - ₱350 each",
      ],
      additionalInfo: ["1 queen-sized bed and 2 foam beds"],
      galleryImages: [
        galleryMaxiImage,
        galleryMaxiImage2,
        galleryMaxiImage3,
        galleryMaxiImage4,
      ],
    },
    {
      title: "Mini Cabin",
      image: miniCabinImage,
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
        galleryMiniImage,
        galleryMiniImage2,
        galleryMiniImage3,
      ],
    },
    {
      title: "Swimming Pool",
      image: poolImage,
      description:
        "Dive into fun with our Swimming Pool Access, available for both day and night tours! Book a cabana or enjoy easy access to our kitchen facilities.",
      rates: [],
      additionalInfo: [],
      galleryImages: [
        galleryPoolImage,
        galleryPoolImage2,
        galleryPoolImage3,
      ],
    },
    {
      title: "River",
      image: riverImage,
      description:
        "Unwind with nature where relaxation meets the scenic beauty of the Norzagaray and Angat Rivers flowing peacefully by.",
      rates: [],
      additionalInfo: [],
      galleryImages: [
        galleryRiverImage,
        galleryRiverImage2,
        galleryRiverImage3,
      ],
    },
    {
      title: "Common Kitchen",
      image: kitchenImage,
      description:
        "Fully equipped with essential appliances and cooking tools, it’s perfect for crafting your favorite dishes, whether sharing a meal with friends or creating a family feast.",
      rates: [],
      additionalInfo: [],
      galleryImages: [galleryKitchenImage],
    },
    {
      title: "Camping Ground",
      image: campingImage,
      description:
        "Experience the great outdoors with Tent Pitching or Car Camping options. Rent a tent, enjoy a bonfire, and explore many other exciting activities in our peaceful, nature-filled camping ground.",
      rates: [],
      additionalInfo: [],
      galleryImages: [
        galleryCampingImage,
        galleryCampingImage2,
        galleryCampingImage3,
      ],
    },
    {
      title: "Gazebo",
      image: gazeboImage,
      description:
        "Our Gazebo offers a beautiful space for events, providing a peaceful and scenic setting for gatherings, celebrations, or simply relaxing while enjoying nature.",
      rates: [],
      additionalInfo: [],
      galleryImages: [
        galleryGazeboImage,
        galleryGazeboImage2,
        galleryGazeboImage3,
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
