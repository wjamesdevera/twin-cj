"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCoverflow,
  Pagination,
  Navigation,
  Autoplay,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

import styles from "./page.module.scss";

const carouselData = [
  {
    src: "/assets/home_kayak.jpg",
    title: "CRYSTAL KAYAK",
    price: "100 PHP per ride",
  },
  {
    src: "/assets/home_bonfire.jpg",
    title: "BONFIRE NIGHT",
    price: "150 PHP per night",
  },
  {
    src: "/assets/home_4x4.jpg",
    title: "4X4 RIDE",
    price: "200 PHP per ride",
  },
  {
    src: "/assets/home_sample1.jpg",
    title: "SAMPLE 1",
    price: "120 PHP per activity",
  },
  {
    src: "/assets/home_sample2.jpg",
    title: "SAMPLE 2",
    price: "180 PHP per activity",
  },
];

export default function Page() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="w-full h-screen overflow-y-auto snap-y snap-mandatory">
      <Navbar />
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.backgroundImage}>
          <Image
            src="/assets/home_cover.jpg"
            alt="Home Cover"
            layout="fill"
            objectFit="cover"
            priority
          />
        </div>
        <div className={styles.content}>
          <h1>twin cj</h1>
          <h2>RIVERSIDE GLAMPING RESORT</h2>
          <p>Enjoy the scenic view by the river</p>
          <button className={styles.bookNow}>Book Now</button>
          <p className={styles.bookingStatus}>
            Check your booking status <Link href="/booking-status">here</Link>!
          </p>
        </div>
      </section>

      {/* Welcome and Location Section */}
      <section className={styles.welcomeSection}>
        <p className={styles.welcomeText}>WELCOME TO</p>
        <h2 className={styles.resortName}>TWIN CJ GLAMPING RESORT</h2>
        <div className={styles.divider}></div>
        <p className={styles.descriptionText}>
          Location is everything when it comes to finding the perfect getaway,
          and we’re thrilled to have found ours at Twin CJ Glamping Resort. The
          river is within your reach, which is a great way to spend time with
          your loved ones with different fun activities.
        </p>
      </section>

      {/* Footsteps Section */}
      <section className={styles.footstepsSection}>
        <div className={styles.footstepsContent}>
          <h2>FOOTSTEPS TO THE RIVER</h2>
        </div>
        <div className={styles.footstepsImage}>
          <Image
            src="/assets/home_river.jpg"
            alt="River Footsteps"
            layout="fill"
            objectFit="cover"
            priority
          />
        </div>
      </section>

      {/* Our Cabins Section */}
      <section className={styles.ourCabinsSection}>
        <h2 className={styles.cabinsTitle}>OUR CABINS</h2>
        <div className={styles.divider}></div>

        <div className={styles.cabinsContainer}>
          {/* Mini Cabin */}
          <div className={styles.cabinCard}>
            <div className={styles.cabinImage}>
              <Image
                src="/assets/home_mini.jpg"
                alt="Mini Cabin"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className={styles.cabinTitle}>MINI</div>
            <div className={styles.cabinDescription}>
              For 3 to 4 guests
              <br />3 mini cabins available
            </div>
          </div>

          {/* Maxi Cabin */}
          <div className={styles.cabinCard}>
            <div className={styles.cabinImage}>
              <Image
                src="/assets/home_maxi.png"
                alt="Maxi Cabin"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className={styles.cabinTitle}>MAXI</div>
            <div className={styles.cabinDescription}>
              For 6 to 8 guests
              <br />3 maxi cabins available
            </div>
          </div>

          {/* Venti Cabin */}
          <div className={styles.cabinCard}>
            <div className={styles.cabinImage}>
              <Image
                src="/assets/home_venti.png"
                alt="Venti Cabin"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className={styles.cabinTitle}>VENTI</div>
            <div className={styles.cabinDescription}>
              For 15 to 20 guests
              <br />1 venti cabin available
            </div>
          </div>
        </div>
      </section>

      {/* All-Round Experience Section */}
      <section className={styles.allRoundExperienceSection}>
        <div className={styles.allRoundContent}>
          <h2>AN ALL-ROUND EXPERIENCE</h2>
          <div className={styles.divider}></div>
          <p className={styles.experienceDescription}>
            At Twin CJ Glamping Resort, we offer a diverse range of activities,
            ensuring there is something for everyone. Book in advance for all
            activities and enjoy swimming, camping, kayaking, fishing, riding an
            ATV, renting a karaoke, and enjoying the night with a bonfire.
          </p>
        </div>

        {/* Swiper Carousel */}
        <div className={styles.carouselSection}>
          <Swiper
            modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={1}
            initialSlide={1}
            loop={true}
            navigation={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2.5,
              slideShadows: false,
            }}
            pagination={{ clickable: true }}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className={styles.carouselContainer}
            breakpoints={{
              1400: { slidesPerView: 2.5 },
              1024: { slidesPerView: 2 },
              776: { slidesPerView: 1.5 },
              480: { slidesPerView: 1 },
              320: { slidesPerView: 1 },
            }}
          >
            {carouselData.map((item, index) => (
              <SwiperSlide key={index} className={styles.carouselItem}>
                <div className={styles.imageContainer}>
                  <Image
                    src={item.src}
                    alt={item.title}
                    layout="fill"
                    objectFit="cover"
                    className={`${styles.carouselImage} ${
                      index !== activeIndex ? styles.inactiveImage : ""
                    }`}
                  />
                  {index !== activeIndex && (
                    <div className={styles.whiteOverlay}></div>
                  )}
                </div>
                {index === activeIndex && (
                  <div className={styles.textOverlay}>
                    <h3 className={styles.carouselTitle}>{item.title}</h3>
                    <p className={styles.carouselPrice}>{item.price}</p>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* WHY CHOOSE US Section */}
      <section className={styles.whyChooseUsSection}>
        <h2 className={styles.sectionHeader}>WHY CHOOSE US?</h2>
        <div className={styles.divider}></div>

        <p className={styles.descriptionText}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi at
          neque egestas turpis varius pellentesque vitae sed est. Duis cursus
          nisi vitae enim pellentesque fringilla.
        </p>

        <div className={styles.cardsContainer}>
          {/* First Card - Image on Right, Text on Left */}
          <div className={styles.card}>
            <div className={styles.imageContent}>
              <Image
                src="/assets/home_gazebo.jpg"
                alt="Gazebo"
                width={500}
                height={300}
                objectFit="cover"
                priority
              />
            </div>
            <div className={styles.textContent}>
              <div className={styles.title}>GAZEBO</div>
              <div className={styles.line}></div>
              <p className={styles.description}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
                at neque egestas turpis varius pellentesque vitae sed est. Duis
                cursus nisi vitae enim pellentesque fringilla.
              </p>
              <button className={styles.bookNow}>Book Now</button>
            </div>
          </div>

          {/* Second Card - Image on Left, Text on Right */}
          <div className={styles.cardReversed}>
            <div className={styles.imageContent}>
              <Image
                src="/assets/home_photoshoot.jpg"
                alt="Photoshoot"
                width={500}
                height={300}
                objectFit="cover"
                priority
              />
            </div>
            <div className={styles.textContent1}>
              <div className={styles.title}>PHOTOSHOOT</div>
              <div className={styles.line1}></div>
              <p className={styles.description}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
                at neque egestas turpis varius pellentesque vitae sed est. Duis
                cursus nisi vitae enim pellentesque fringilla.
              </p>
              <button className={styles.bookNow1}>Book Now</button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
