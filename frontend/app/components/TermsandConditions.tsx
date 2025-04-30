import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./termsandconditions.module.scss";
import BookingButton from "./BookingButton";

interface TermsAndConditionsProps {
  type: "terms" | "privacy";
  onAgree: () => void; // Callback when the user agrees
}

const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({
  type,
  onAgree,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const openModal = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default link behavior
    setIsOpen(true);
    setIsButtonEnabled(false); // Reset button state when reopening modal
  };

  const closeModal = () => setIsOpen(false);

  const handleScroll = useCallback(() => {
    if (contentRef.current && !isButtonEnabled) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      // Check if scrolled to the bottom + a small buffer for rounding errors
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      if (isAtBottom) {
        setIsButtonEnabled(true); // Enable the button only once
      }
    }
  }, [isButtonEnabled]);

  const handleAgree = () => {
    onAgree();
    closeModal();
  };

  useEffect(() => {
    const contentEl = contentRef.current;
    if (contentEl) {
      // Attach scroll event listener
      contentEl.addEventListener("scroll", handleScroll);
      // Check scroll position on mount (in case content is already scrolled)
      handleScroll();
      // Cleanup event listener on unmount
      return () => contentEl.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll, isOpen]); // run effect again when modal opens/closes

  return (
    <>
      <a href="#" onClick={openModal} className={styles.link}>
        {type === "terms" ? "Terms and Conditions" : "Privacy Policy"}
      </a>
      {isOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeButton} onClick={closeModal}>
              ×
            </button>
            <h2 className={styles.title}>
              {type === "terms" ? "TERMS AND CONDITIONS" : "PRIVACY POLICY"}
            </h2>
            <hr className={styles.divider} />
            <div className={styles.content} ref={contentRef}>
              {type === "terms" ? (
                <>
                  <h3>Reservation Policy</h3>
                  <ul>
                    <li>
                      All bookings are subject to availability and confirmed
                      only upon receipt of payment.
                    </li>
                    <li>
                      Guests must provide accurate contact details during
                      reservation.
                    </li>
                  </ul>
                  <h3>Check-In and Check-Out</h3>
                  <ul>
                    <li>
                      Early check-in or late check-out requests may incur
                      additional charges and are subject to availability.
                    </li>
                  </ul>
                  <h3>Guest Conduct</h3>
                  <ul>
                    <li>
                      Guests are expected to respect resort property, staff, and
                      other guests.
                    </li>
                    <li>
                      Loud noise, disruptive behavior, or damage to property may
                      result in immediate eviction without refund.
                    </li>
                  </ul>
                  <h3>Rescheduling and Cancellation Policy</h3>
                  <ul>
                    <li>
                      Rescheduling is allowed at least 3 business days prior to
                      the booking date, subject to availability.
                    </li>
                    <li>
                      Refunds are available for cancellations made at least 3
                      business days in advance. In cases of typhoons, natural
                      calamities, or similar unforeseen events, refunds may be
                      granted upon review.
                    </li>
                  </ul>
                  <h3>Pets</h3>
                  <ul>
                    <li>
                      Pets are welcome but must be supervised at all times and
                      kept on a leash in public areas. Owners are responsible
                      for cleaning up after their pets.
                    </li>
                  </ul>
                </>
              ) : (
                <>
                  <p>
                    Twin CJ Riverside Glamping Resort is committed to protecting
                    the privacy of our guests. This policy outlines how we
                    collect, use, and safeguard personal information.
                  </p>
                  <h3>Information We Collect</h3>
                  <ul>
                    <li>
                      Personal details such as name, email address, phone
                      number, and payment information during booking.
                    </li>
                    <li>
                      Additional information voluntarily provided during guest
                      inquiries or feedback.
                    </li>
                  </ul>
                  <h3>Use of Information</h3>
                  <ul>
                    <li>To confirm reservations and facilitate services.</li>
                    <li>
                      For internal analysis to improve guest experiences and
                      operations.
                    </li>
                    <li>
                      To communicate updates, promotions, or relevant
                      information (with prior consent).
                    </li>
                  </ul>
                  <h3>Data Security</h3>
                  <ul>
                    <li>
                      We implement industry-standard security measures to
                      protect personal data from unauthorized access,
                      alteration, or disclosure.
                    </li>
                    <li>
                      Access to personal data is restricted to authorized
                      personnel only.
                    </li>
                  </ul>
                  <h3>Third-Party Sharing</h3>
                  <ul>
                    <li>
                      We do not sell, trade, or share guest information with
                      third parties, except as required by law or for payment
                      processing.
                    </li>
                  </ul>
                  <h3>Data Retention</h3>
                  <ul>
                    <li>
                      Personal data is retained only for as long as necessary to
                      fulfill its purpose or comply with legal obligations.
                    </li>
                  </ul>
                  <h3>Your Rights</h3>
                  <ul>
                    <li>
                      Guests may request to access, correct, or delete their
                      personal information by contacting the resort.
                    </li>
                    <li>
                      Opt-out options are available for marketing
                      communications.
                    </li>
                  </ul>
                </>
              )}
            </div>
            <BookingButton
              text="I AGREE"
              onClick={handleAgree}
              disabled={!isButtonEnabled}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TermsAndConditions;
