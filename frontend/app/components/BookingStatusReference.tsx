"use client";

import { useState } from "react";
import styles from "./BookingStatusReference.module.scss";

interface Props {
  onBookingFetched: (data: any) => void;
}

const BookingStatusReference: React.FC<Props> = ({ onBookingFetched }) => {
  const [referenceCode, setReferenceCode] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReferenceCode(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:8080/api/bookings/status/${referenceCode}`);
      
      const data = await response.json();

      onBookingFetched(data);
    } catch (error) {
      onBookingFetched({ bookingStatus: { name: "Invalid" } });
    } finally {
      
    }
  };
  
  return (
    <>
      {/* Booking Status Intro */}
      <section className={styles["booking-status-intro-section"]}>
        <h2>VIEW YOUR BOOKING STATUS HERE</h2>
        <hr />
        <p>
          We are delighted to host you for a memorable stay experience at Twin
          CJ Riverside Glamping Resort.
        </p>
        <p>We look forward to creating an unforgettable experience for you.</p>
      </section>

      {/* Booking Status Reference Input */}
      <section className={styles["booking-status-reference-section"]}>
        <div className={styles["booking-status-input-container"]}>
          <p>Please Enter Your Reference Number</p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter Your Reference Number"
              id="referenceCode"
              name="referenceCode"
              onChange={handleChange}
              value={referenceCode}
            />
            <button type="submit">CHECK STATUS</button>
          </form>
        </div>
      </section>
    </>
  );
};

export default BookingStatusReference;
