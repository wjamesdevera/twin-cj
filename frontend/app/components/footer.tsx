import React from "react";
import styles from "./footer.module.scss";
//import "@fortawesome/fontawesome-free/css/all.min.css";
import twinCJLogo from "../../public/assets/twincjLogo.png";
import Image from "next/image";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className={`${styles["footer-container"]}`}>
      {/* Footer */}
      <div className={`${styles["footer-wrapper"]} container`}>
        {/* Logo and Tagline */}
        <div className={styles.column}>
          <Image
            src={twinCJLogo}
            alt="Twin CJ Riverside Resort Logo"
            width={232.07}
            height={65.58}
            className={styles.logo}
          />
          <p className={styles.tagline}>Enjoy the scenic view by the river</p>
        </div>

        {/* Navigation Links */}
        <div className={styles.column}>
          <ul className={styles.links}>
            <li>
              <Link href="/" className={styles.link}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/booking" className={styles.link}>
                Booking
              </Link>
            </li>
            {/* <li>
              <Link href="/facilities" className={styles.link}>
                Facilities
              </Link>
            </li> */}
            {/* <li>
              <Link href="/about" className={styles.link}>
                About
              </Link>
            </li> */}
            {/* <li>
              <Link href="/location" className={styles.link}>
                Location
              </Link>
            </li> */}
            <li>
              <Link href="/contact" className={styles.link}>
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className={styles.column}>
          <ul className={styles.links}>
            <li className={`${styles.link} ${styles["contact-item"]}`}>
              <i className={`${styles.icon} fas fa-map-marker-alt`}></i>
              <a>Norzagaray, Bulacan</a>
            </li>
            <li className={`${styles.link} ${styles["contact-item"]}`}>
              <i className={`${styles.icon} fas fa-phone-alt`}></i>
              <a>0917 559 9237</a>
            </li>
            <li className={`${styles.link} ${styles["contact-item"]}`}>
              <i className={`${styles.icon} fas fa-envelope`}></i>
              <a href="mailto:twincj.riversideresort@gmail.com">
                twincj.riversideresort@gmail.com
              </a>
            </li>
            <li className={`${styles.link} ${styles["contact-item"]}`}>
              <i className={`${styles.icon} fab fa-facebook`}></i>
              <a
                href="https://www.facebook.com/twincjriversideresort"
                target="_blank"
              >
                Twin CJ Riverside Glamping Resort
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Lower Footer */}
      <div className={`${styles["lower-footer-container"]}`}>
        <div className={`container ${styles["lower-footer-wrapper"]}`}>
          <div className="">
            © 2024 Twin CJ Riverside Glamping Resort. All Rights Reserved.
          </div>
          <div className="">
            <a href="/privacy-policy" className="">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
