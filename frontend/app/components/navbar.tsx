"use client";

import React, { useState } from "react";
import styles from "./navbar.module.scss";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [isNavActive, setIsNavActive] = useState(false);

  const toggleNav = () => {
    setIsNavActive(!isNavActive);
  };

  return (
    <nav id="navbar" className={`${styles["navbar-container"]}`}>
      <div className={`${styles["navbar-wrapper"]} container`}>
        <div className={styles.logo}>
          <Image src="/assets/twincj-logo.png" alt="Twin CJ Logo" fill={true} />
        </div>
        {/* Hamburger Menu */}
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
        {/* Menubar for Mobile */}
        <div
          className={`${styles.menubar} ${isNavActive ? styles.active : ""}`}
        >
          <ul>
            <li>
              <Link href="/#home">Home</Link>
            </li>
            <li>
              <Link href="/#amenities">Amenities</Link>
            </li>
            <li>
              <Link href="/#activities">Activities</Link>
            </li>
            <li>
              <Link href="/#gallery">Gallery</Link>
            </li>
            <li>
              <Link href="/#contact">Contact Us</Link>
            </li>
          </ul>
        </div>
        {/* Navigation Links */}
        <div
          className={`${styles.navLink} ${isNavActive ? styles.hidden : ""}`}
        >
          <ul>
            <li>
              <Link href="/#home" className={styles.active}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/#amenities">Amenities</Link>
            </li>
            <li>
              <Link href="/#activities">Activities</Link>
            </li>
            <li>
              <Link href="/#gallery">Gallery</Link>
            </li>
            <li>
              <Link href="/#contact">Contact Us</Link>
            </li>
          </ul>
        </div>
        {/* Reservation Button */}
        <div
          className={`${styles.reservation} ${
            isNavActive ? styles.hidden : ""
          }`}
        >
          <button className={styles.reserveBtn}>Book Now</button>
        </div>{" "}
      </div>
    </nav>
  );
}
