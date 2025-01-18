import React from 'react';
import styles from './footer.module.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer: React.FC = () => {
  return (
    <div className={styles.pageWrapper}>
      {/* Footer */}
      <div className={styles.footerWrapper}>
        <footer className={styles.footer}>
          <div className={styles.container}>
            {/* Logo and Tagline */}
            <div className={styles.column}>
              <img
                src="/assets/twincjLogo.png"
                alt="Twin CJ Riverside Resort Logo"
                className={styles.logo}
              />
              <p className={styles.tagline}>Enjoy the scenic view by the river</p>
            </div>

            {/* Navigation Links */}
            <div className={styles.column}>
              <ul className={styles.links}>
                <li>
                  <a href="/" className={styles.link}>Home</a>
                </li>
                <li>
                  <a href="/booking" className={styles.link}>Booking</a>
                </li>
                <li>
                  <a href="/facilities" className={styles.link}>Facilities</a>
                </li>
                <li>
                  <a href="/about" className={styles.link}>About</a>
                </li>
                <li>
                  <a href="/location" className={styles.link}>Location</a>
                </li>
                <li>
                  <a href="/contact" className={styles.link}>Contact Us</a>
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
              <a href="/privacy-policy" className={styles.privacyLink}>Privacy Policy</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Footer;
