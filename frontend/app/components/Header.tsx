import React from "react";
import Image from "next/image";
import styles from "./header.module.scss";
import headerImage from "../../public/assets/header.png";

const Header: React.FC = () => {
  return (
    <header className={styles["header-container"]}>
      {/* Fullscreen Header Image */}
      <Image
        src={headerImage}
        alt="Header Image"
        fill
        priority
        className={styles["header-image"]}
      />
      <div className={styles["header-overlay"]}>
        <h1 className={styles["header-title"]}>BOOK YOUR STAY</h1>
        <p className={styles["header-subtitle"]}>
          We are delighted to host you a memorable stay experience at Twin CJ
          Riverside Glamping Resort. We look forward to creating an
          unforgettable experience for you.
        </p>

        {/* Booking Form */}
        <div className={styles["booking-form"]}>
          <div className={styles["form-field"]}>
            <label htmlFor="checkin">Check in</label>
            <input
              type="date"
              id="checkin"
              className={`${styles["date-input"]}`}
            />
          </div>
          <div className={styles["form-field"]}>
            <label htmlFor="checkout">Check out</label>
            <input
              type="date"
              id="checkout"
              className={`${styles["date-input"]}`}
            />
          </div>
          <div className={styles["form-field"]}>
            <label htmlFor="guests">No. of Guests</label>
            <select id="guests" className={`${styles["guests-select"]}`}>
              <option>1 Adult, 0 Children</option>
              <option>2 Adults, 0 Children</option>
              <option>2 Adults, 1 Child</option>
            </select>
          </div>
          <button className={styles["check-availability-btn"]}>
            CHECK AVAILABILITY
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
