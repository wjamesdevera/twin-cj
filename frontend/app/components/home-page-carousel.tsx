"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import styles from "./home-page-carousel.module.scss";
import {
  EffectCoverflow,
  Pagination,
  Navigation,
  Autoplay,
} from "swiper/modules";

import "swiper/scss";
import "swiper/scss/effect-coverflow";
import "swiper/scss/pagination";
import "swiper/scss/navigation";
import { useState } from "react";
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
    title: "MINI CABIN",
    price: "120 PHP per activity",
  },
  {
    src: "/assets/home_sample2.jpg",
    title: "CABIN",
    price: "180 PHP per activity",
  },
];
const HomePageCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div className={styles.carouselSection}>
      <Swiper
        modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
        centeredSlides={true}
        slidesPerView={"auto"}
        initialSlide={1}
        loop={true}
        effect="coverflow"
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true, dynamicBullets: true }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className={styles["carousel-container"]}
        breakpoints={{
          320: { slidesPerView: 1, navigation: false, effect: "slide" },
          480: { slidesPerView: 1, navigation: false, effect: "slide" },
          776: {
            slidesPerView: 1,
            navigation: true,
            effect: "slide",
          },
          1024: {
            slidesPerView: 2,
            navigation: true,
            effect: "coverflow",
            coverflowEffect: {
              rotate: 0,
              stretch: -50,
              depth: 100,
              modifier: 2.5,
              slideShadows: false,
            },
          },
          1400: {
            slidesPerView: 2.75,
            navigation: true,
            effect: "coverflow",
            coverflowEffect: {
              rotate: 0,
              stretch: -100,
              depth: 100,
              modifier: 2.5,
              slideShadows: false,
            },
          },
        }}
      >
        {carouselData.map((item, index) => (
          <SwiperSlide key={index} className={styles.carouselItem}>
            <div className={styles.imageContainer}>
              <Image
                src={item.src}
                alt={item.title}
                fill
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
  );
};

export default HomePageCarousel;
