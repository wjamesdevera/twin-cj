import React from "react";
import styles from "./guestinformation.module.scss";
import BookingButton from "./BookingButton";

const GuestInformation: React.FC = () => {
  return (
    <div className={styles.guestInfoContainer}>
      <h2 className={styles.sectionTitle}>Guest Information</h2>
      <form className={styles.form}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label>First Name</label>
            <input type="text" placeholder="First Name" />
          </div>
          <div className={styles.field}>
            <label>Last Name</label>
            <input type="text" placeholder="Last Name" />
          </div>
          <div className={styles.field}>
            <label>Contact Number</label>
            <input type="text" placeholder="09123456789" />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <label>Email</label>
            <input type="email" placeholder="Type your Email" />
          </div>
          <div className={styles.field}>
            <label>Re-type Email</label>
            <input type="email" placeholder="Re-type your Email" />
          </div>
        </div>
        <div className={styles.checkboxRow}>
          <label>
            <input type="checkbox" /> I have read and agree to the{" "}
            <a href="#">Terms and Conditions</a>.
          </label>
          <label>
            <input type="checkbox" /> I consent to the processing of my personal
            data as explained in the <a href="#">Privacy Policy</a>.
          </label>
        </div>
      </form>

      <BookingButton />
    </div>
  );
};

export default GuestInformation;
