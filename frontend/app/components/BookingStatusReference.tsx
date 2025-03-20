import styles from "./BookingStatusReference.module.scss";

const BookingStatusReference = () => {
  return (
    <>
      {/* Booking Status Intro / Title */}
      <section className={`${styles["booking-status-intro-section"]}`}>
        <h2>VIEW YOUR BOOKING STATUS HERE</h2>
        <hr />
        <p>
          We are delighted to host you for a memorable stay experience at Twin
          CJ Riverside Glamping Resort.
        </p>
        <p>We look forward to creating an unforgettable experience for you.</p>
      </section>

      {/* Booking Status Reference Input */}
      <section className={`${styles["booking-status-reference-section"]}`}>
        <div className={`${styles["booking-status-input-container"]}`}>
          <p>Please Enter Your Reference Number</p>
          <input type="text" placeholder="Enter Your Reference Number" />
          <button>CHECK STATUS</button>
        </div>
      </section>
    </>
  );
};

export default BookingStatusReference;
