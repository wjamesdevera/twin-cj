"use client"; 

import React, { useState } from "react";
import styles from "./navbar.module.scss";

export default function Navbar() {
  const [isNavActive, setIsNavActive] = useState(false);

  const toggleNav = () => {
    setIsNavActive(!isNavActive);
  };

  return (
    <nav id="navbar" className={styles.navbar}>

      <div className={styles.logo}>
      <img src="/assets/twincj-logo.png" alt="Twin CJ Logo" />
      </div>

      {/* Navigation Links */}
      <div className={`${styles.navLink} ${isNavActive ? styles.active : ""}`}>
        <ul>
          <li><a href="/#home" className={styles.active}>Home</a></li>
          <li><a href="/#amenities">Amenities</a></li>
          <li><a href="/#activities">Activities</a></li>
          <li><a href="/#gallery">Gallery</a></li>
          <li><a href="/#contact">Contact Us</a></li>
        </ul>
      </div>

      {/* Reservation Button */}
      <div className={styles.reservation}>
        <button className={styles.reserveBtn}>Book Now</button>
      </div>

      {/* Hamburger Menu for mobile screens */}
      <div
        className={`${styles.hamburger} ${
          isNavActive ? styles.hamburgerActive : ""
        }`}
        onClick={toggleNav}
      >
        <span className={styles.line}></span>
        <span className={styles.line}></span>
        <span className={styles.line}></span>
      </div>
    </nav>
  );
}
