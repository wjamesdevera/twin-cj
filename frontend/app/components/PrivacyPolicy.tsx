"use client";

import React from "react";
import styles from "./PrivacyPolicy.module.scss";

interface PrivacyPolicyProps {
  onClose: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onClose }) => {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <h2 className={styles.title}>PRIVACY POLICY</h2>
        <hr className={styles.divider} />
        <div className={styles.content}>
          <p>
            Twin CJ Riverside Glamping Resort is committed to protecting the
            privacy of our guests. This policy outlines how we collect, use, and
            safeguard personal information.
          </p>
          <h3>Information We Collect</h3>
          <ul>
            <li>
              Personal details such as name, email address, phone number, and
              payment information during booking.
            </li>
            <li>
              Additional information voluntarily provided during guest inquiries
              or feedback.
            </li>
          </ul>
          <h3>Use of Information</h3>
          <ul>
            <li>To confirm reservations and facilitate services.</li>
            <li>
              For internal analysis to improve guest experiences and operations.
            </li>
            <li>
              To communicate updates, promotions, or relevant information (with
              prior consent).
            </li>
          </ul>
          <h3>Data Security</h3>
          <ul>
            <li>
              We implement industry-standard security measures to protect
              personal data from unauthorized access, alteration, or disclosure.
            </li>
            <li>
              Access to personal data is restricted to authorized personnel
              only.
            </li>
          </ul>
          <h3>Third-Party Sharing</h3>
          <ul>
            <li>
              We do not sell, trade, or share guest information with third
              parties, except as required by law or for payment processing.
            </li>
          </ul>
          <h3>Data Retention</h3>
          <ul>
            <li>
              Personal data is retained only for as long as necessary to fulfill
              its purpose or comply with legal obligations.
            </li>
          </ul>
          <h3>Your Rights</h3>
          <ul>
            <li>
              Guests may request to access, correct, or delete their personal
              information by contacting the resort.
            </li>
            <li>Opt-out options are available for marketing communications.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
