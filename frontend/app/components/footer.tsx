import React from "react";
import styles from "./footer.module.scss";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Image from "next/image";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <div className={styles.pageWrapper}>
      {/* Footer */}
      <div className={styles.footerWrapper}>
        <footer className={styles.footer}>
          <div className={styles.container}>
            {/* Logo and Tagline */}
            <div className={styles.column}>
              <Image
                src="/assets/twincjLogo.png"
                alt="Twin CJ Riverside Resort Logo"
                width={232.07}
                height={65.58}
                className={styles.logo}
              />
              <p className={styles.tagline}>
                Enjoy the scenic view by the river
              </p>
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
                <li>
                  <Link href="/facilities" className={styles.link}>
                    Facilities
                  </Link>
                </li>
                <li>
                  <Link href="/about" className={styles.link}>
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/location" className={styles.link}>
                    Location
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className={styles.link}>
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div className={styles.column}>
              <div className={styles.contactItem}>
                <i className={`${styles.icon} fas fa-map-marker-alt`}></i>
                <span>Norzagaray, Bulacan</span>
              </div>
              <div className={styles.contactItem}>
                <i className={`${styles.icon} fas fa-phone-alt`}></i>
                <span>0917 559 9237</span>
              </div>
              <div className={styles.contactItem}>
                <i className={`${styles.icon} fas fa-envelope`}></i>
                <span>twincj.riversideresort@gmail.com</span>
              </div>
              <div className={styles.contactItem}>
                <i className={`${styles.icon} fab fa-facebook`}></i>
                <span>Twin CJ Riverside Glamping Resort</span>
              </div>
            </div>
          </div>
        </footer>

        {/* Lower Footer */}
        <footer className={styles.lowerFooter}>
          <div className={styles.container}>
            <div className={styles.left}>
              © 2024 Twin CJ Riverside Glamping Resort. All Rights Reserved.
            </div>
            <div className={styles.right}>
              <a href="/privacy-policy" className={styles.privacyLink}>
                Privacy Policy
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Footer;
