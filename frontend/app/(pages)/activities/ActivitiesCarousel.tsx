"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import styles from "./activitiesCarousel.module.scss";

interface CarouselProps {
  images: string[];
}

const ActivitiesCarousel: React.FC<CarouselProps> = ({ images }) => {
  const [progress, setProgress] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className={styles.carousel}>
      <Swiper
        key={images.join(",")}
        modules={[Autoplay, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        navigation={{
          nextEl: `.${styles.next}`,
          prevEl: `.${styles.prev}`,
        }}
        loop
        onSlideChange={(swiper) => {
          setProgress(((swiper.realIndex + 1) / images.length) * 100);
        }}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className={styles.imageWrapper}>
              <Image
                src={image}
                alt={`Carousel Image ${index + 1}`}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <button className={styles.prev}>&#10094;</button>
      <button className={styles.next}>&#10095;</button>

      <div className={styles.progressBar}>
        <div className={styles.progress} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};

export default ActivitiesCarousel;
