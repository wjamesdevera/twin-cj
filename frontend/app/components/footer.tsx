"use client";

import React, { useState } from "react";
import styles from "./footer.module.scss";
import twinCJLogo from "../../public/assets/twincjLogo.png";
import Image from "next/image";
import Link from "next/link";
import PrivacyPolicy from "@/app/components/PrivacyPolicy";

const Footer: React.FC = () => {
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <>
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
                <Link href="/" className={styles.link}>
                  Booking
                </Link>
              </li>
              <li>
                <Link href="/amenities" className={styles.link}>
                  Amenities
                </Link>
              </li>
              <li>
                <Link href="/activities" className={styles.link}>
                  Activities
                </Link>
              </li>
              <li>
                <Link href="/gallery" className={styles.link}>
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className={styles.link}>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faqs" className={styles.link}>
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className={styles.column}>
            <ul className={styles.links}>
              <li className={`${styles.link} ${styles["contact-item"]}`}>
                <i className={`${styles.icon} fas fa-map-marker-alt`}></i>
                Norzagaray, Bulacan
              </li>
              <li className={`${styles.link} ${styles["contact-item"]}`}>
                <i className={`${styles.icon} fas fa-phone-alt`}></i>0917 559
                9237
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
            <div>
              © 2024 Twin CJ Riverside Glamping Resort. All Rights Reserved.
            </div>
            <div>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowPrivacy(true);
                }}
              >
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </footer>

      {showPrivacy && <PrivacyPolicy onClose={() => setShowPrivacy(false)} />}
    </>
  );
};

export default Footer;
