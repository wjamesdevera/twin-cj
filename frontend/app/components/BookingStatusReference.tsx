"use client";

import { FieldErrors, UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
import styles from "./BookingStatusReference.module.scss";

interface FormData {
  referenceCode: string;
}

interface Props {
  register: UseFormRegister<FormData>;
  handleSubmit: UseFormHandleSubmit<FormData>;
  errors: FieldErrors<FormData>;
  fetchBookingData: (data: FormData) => Promise<void>;
}

const BookingStatusReference: React.FC<Props> = ({ register, handleSubmit, errors, fetchBookingData }) => {
  return (
    <>
      <section className={styles["booking-status-intro-section"]}>
        <h2>VIEW YOUR BOOKING STATUS HERE</h2>
        <hr />
        <p>
          We are delighted to host you for a memorable stay experience at Twin CJ Riverside Glamping Resort.
        </p>
        <p>We look forward to creating an unforgettable experience for you.</p>
      </section>
      
      <section className={styles["booking-status-reference-section"]}>
        <div className={styles["booking-status-input-container"]}>
          <p>Please Enter Your Reference Number</p>
          <form onSubmit={handleSubmit(fetchBookingData)}>
            <input
              type="text"
              placeholder="Enter Your Reference Number"
              id="referenceCode"
              {...register("referenceCode")}
            />
            {errors.referenceCode && <p className={styles.error}>{errors.referenceCode.message}</p>}
            <button type="submit">CHECK STATUS</button>
          </form>
        </div>
      </section>
    </>
  );
};

export default BookingStatusReference;
