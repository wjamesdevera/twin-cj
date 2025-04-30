"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./page.module.scss";
import SectionHeader from "../../components/SectionHeader";
import TabLayout from "./TabLayout";
import ActivityCard from "./ActivityCard";
import InHouseGallery from "./InHouseGallery";
import ActivitiesCarousel from "./ActivitiesCarousel";
import TabContent from "./TabContent";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <Image
        src={"/assets/activities-header.png"}
        alt="Resort View"
        fill
        className={styles.image}
        priority
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </header>
  );
};

const tabs = [
  "Day Tour",
  "Camping",
  "In-House Activities",
  "Photoshoot",
] as const;

const tabImages: { [key in (typeof tabs)[number]]: string[] } = {
  "Day Tour": [
    "/assets/daytour-carousel-1.png",
    "/assets/daytour-carousel-2.jpg",
    "/assets/daytour-carousel-3.jpg",
    "/assets/daytour-carousel-4.jpg",
  ],
  Camping: [
    "/assets/camping-carousel-1.png",
    "/assets/camping-carousel-2.jpg",
    "/assets/camping-carousel-3.jpg",
  ],
  "In-House Activities": [
    "/assets/inhouse-carousel-1.png",
    "/assets/inhouse-carousel-2.jpg",
    "/assets/inhouse-carousel-3.png",
  ],
  Photoshoot: [
    "/assets/photoshoot-carousel-1.png",
    "/assets/photoshoot-carousel-2.jpg",
    "/assets/photoshoot-carousel-3.jpg",
  ],
};

export default function Page() {
  const [activeTab, setActiveTab] = useState(0);

  const renderActivities = () => {
    switch (tabs[activeTab]) {
      case "In-House Activities":
        return <InHouseGallery />;

      case "Day Tour":
        return (
          <>
            <ActivityCard
              imageSrc="/assets/activities-river.png"
              imageAlt="River Day Tour"
              title="RIVER DAY TOUR"
              description="Enjoy a relaxing escape with our River Day Tour, offering serene views of the Norzagaray and Angat Rivers. Spend the day in a cozy riverside cottage, perfect for small gatherings or quiet retreats. A minimal entrance fee grants you access to the peaceful surroundings, making it an affordable and refreshing getaway."
              rates={[
                { label: "Cottage (10 pax)", price: "₱300" },
                { label: "Entrance fee", price: "₱20 per head" },
              ]}
              buttonLabel="Book Now"
              buttonLink="/booking"
            />
            <ActivityCard
              imageSrc="/assets/activities-swimming.png"
              imageAlt="Swimming Pool Day Tour"
              title="SWIMMING POOL DAY TOUR"
              description="Enjoy a fun-filled day at our swimming pool, perfect for families and groups looking for relaxation and recreation."
              guidelines={[
                "Fee includes both entrance and pool access.",
                "Wear appropriate swimming attire.",
                "No colored shirts or jersey shorts.",
              ]}
              rates={[
                { label: "Entrance Fee (Day Swim)", price: "₱200 per head" },
                { label: "Children's Discount:", price: "₱20 less for kids" },
                { label: "Cabana Rental (10 pax)", price: "₱500" },
                { label: "Kitchen Use:", price: "₱200" },
              ]}
              buttonLabel="Book Now"
              buttonLink="/booking"
              reverse
            />
            <ActivityCard
              imageSrc="/assets/activities-gazebo.png"
              imageAlt="Gazebo Day Tour Rent"
              title="GAZEBO DAY TOUR"
              description="Host the perfect event in our scenic Gazebo. Ideal for birthday celebrations, receptions, and team-building activities. For inquiries, message us on our Facebook page!"
              rates={[{ label: "Gazebo Rental:", price: "₱3,000" }]}
              buttonLabel="Book Now"
              buttonLink="/booking"
            />
          </>
        );

      case "Camping":
        return (
          <>
            <ActivityCard
              imageSrc="/assets/activities-camping.png"
              imageAlt="Camping"
              title="CAMPING INCLUSIONS"
              description="Immerse yourself in nature with our Camping Experience. Whether you prefer Tent Pitching or Car Camping, our tranquil setting offers the perfect escape for both day tours and overnight stays at 4:00 PM to 12:00 NN)."
              guidelines={[
                "2 pillows",
                "2 blankets",
                "Access to the bonfire",
                "Peaceful camping experience in a scenic riverside location",
              ]}
            />
          </>
        );

      case "Photoshoot":
        return (
          <>
            <ActivityCard
              imageSrc="/assets/photoshoot-1.png"
              imageAlt="Photoshoot"
              title="PACKAGE A"
              description="Perfect for simple and straightforward shoots, this package includes access to our Cabana and the entire resort for your pictorial. Enjoy the serene ambiance and stunning backdrops to create timeless memories."
            />
            <ActivityCard
              imageSrc="/assets/photoshoot-2.png"
              imageAlt="Photoshoot"
              title="PACKAGE B"
              description="Ideal for more intimate shoots, this package includes the use of our cozy Mini Cabin for preparation and photo-ops. Capture beautiful moments with picturesque resort views while enjoying the comfort of a private space for your shoot."
              reverse
            />
            <ActivityCard
              imageSrc="/assets/photoshoot-3.png"
              imageAlt="Photoshoot"
              title="PACKAGE C"
              description="Designed for larger or more elaborate shoots, this package offers the spacious Maxi Cabin for your preparation and exclusive photo-ops. Take advantage of the cabin's features and the resort’s breathtaking scenery for stunning photos."
            />
            <ActivityCard
              imageSrc="/assets/photoshoot-2.png"
              imageAlt="Photoshoot"
              title="PACKAGE D"
              description="For grand and sophisticated shoots, our Venti Cabin provides the ultimate preparation space and photo-op location. This premium package includes full access to the resort's most scenic spots, ensuring an unforgettable photoshoot experience."
              reverse
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <SectionHeader title="ACTIVITIES" />
        <TabLayout activeTab={activeTab} onTabChange={setActiveTab} />

        <ActivitiesCarousel images={tabImages[tabs[activeTab]]} />

        <TabContent
          title={tabs[activeTab]}
          paragraph={
            activeTab === 0
              ? "Enjoy a full day of fun and relaxation with access to the pool, rivers, and create lasting memories with family and friends."
              : undefined
          }
          showButton={activeTab !== 0}
        />

        <div className={styles.activities}>{renderActivities()}</div>
      </div>
    </>
  );
}
