import styles from "./BookingStatusDetails.module.scss";

const BookingStatusDetails = (props: any) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  if (props.status === "Approved") {
    return (
      <section className={`${styles["booking-status-details-section"]}`}>
        <div className={`${styles["booking-status-details-container"]}`}>
          <div
            className={`${styles["booking-status-details-container-heading"]}`}
          >
            <h3>You’re Officially Booked!</h3>
            <h4>
              Thank you for choosing us for your stay! Below are your booking
              details:
            </h4>
          </div>
          <hr />
          <div className={`${styles["booking-status-details-container-sub"]}`}>
            <div className={`${styles["booking-status-details-left"]}`}>
              <p>
                <b>Status:&nbsp;</b>
                <span style={{ color: "green", fontStyle: "italic" }}>
                  Approved Downpayment
                </span>
              </p>
              <p>
                <b>Reference Number:&nbsp;</b>
                <span>000000000</span>
              </p>
              <p>
                <b>Package:&nbsp;</b>
                <span>Overnight</span>
              </p>
              <p>
                <b>Cabin:&nbsp;</b>
                <span>Maxi Cabin</span>
              </p>
              <p>
                <b>No. of Guests:&nbsp;</b>
                <span>6</span>
              </p>
              <p>
                <b>Check-In:&nbsp;</b>
                <span>2:00 PM</span>
              </p>
              <p>
                <b>Check-Out:&nbsp;</b>
                <span>10:00 AM</span>
              </p>
            </div>
            <div
              className={`${styles["booking-status-details-container-divider"]}`}
            ></div>
            <div className={`${styles["booking-status-details-right"]}`}>
              <p>
                <b>Important Reminders</b>
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
                at neque egestas turpis varius pellentesque vitae sed est.
              </p>
              <ol>
                <li>Duis cursus nisi vitae enim pellentesque fringilla.</li>
                <li>Nam eget dolor et enim fringilla semper.</li>
                <li>
                  Nullam lectus lorem, facilisis quis aliquam sollicitudin,
                  facilisis eu ipsum. Sed eget viverra purus.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>
    );
  } else if (props.status === "Pending") {
    return (
      <section className={`${styles["booking-status-details-section"]}`}>
        <div className={`${styles["booking-status-details-container"]}`}>
          <div
            className={`${styles["booking-status-details-container-heading"]}`}
          >
            <h3>Hang Tight, Your Booking is Being Processed!</h3>
            <h4>
              Thank you for your booking! Your reservation is currently being
              processed. Please check back later for updates or take the steps
              below if needed.
            </h4>
          </div>
          <hr />
          <div className={`${styles["booking-status-details-container-sub"]}`}>
            <div className={`${styles["booking-status-details-left"]}`}>
              <p>
                <b>Status:&nbsp;</b>
                <span style={{ color: "orange", fontStyle: "italic" }}>
                  {props.status}
                </span>
              </p>
              <p>
                <b>Reference Number:&nbsp;</b>
                <span>
                  {props.referenceCode}
                </span>
              </p>
              <p>
                <b>Package:&nbsp;</b>
                <span>
                  {props.package}
                </span>
              </p>
              <p>
                <b>Cabin:&nbsp;</b>
                <span>
                  {props.cabin}
                </span>
              </p>
              <p>
                <b>No. of Guests:&nbsp;</b>
                <span>
                  {props.totalPax}
                </span>
              </p>
              <p>
                <b>Check-In:&nbsp;</b>
                <span>
                  {formatDate(props.checkIn)}
                </span>
              </p>
              <p>
                <b>Check-Out:&nbsp;</b>
                <span>
                  {formatDate(props.checkOut)}
                </span>
              </p>
            </div>
            <div
              className={`${styles["booking-status-details-container-divider"]}`}
            ></div>
            <div className={`${styles["booking-status-details-right"]}`}>
              <p>
                <b>Important Reminders</b>
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
                at neque egestas turpis varius pellentesque vitae sed est.
              </p>
              <ol>
                <li>Duis cursus nisi vitae enim pellentesque fringilla.</li>
                <li>Nam eget dolor et enim fringilla semper.</li>
                <li>
                  Nullam lectus lorem, facilisis quis aliquam sollicitudin,
                  facilisis eu ipsum. Sed eget viverra purus.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>
    );
  } else if (props.status === "Reupload") {
    return (
      <section className={`${styles["booking-status-details-section"]}`}>
        <div className={`${styles["booking-status-details-container"]}`}>
          <div
            className={`${styles["booking-status-details-container-heading"]}`}
          >
            <h3>Oops! There Was an Issue With Your Booking :&#40;</h3>
            <h4>
              Unfortunately, your booking request has been rejected due to an
              issue with the payment verification process.
            </h4>
          </div>
          <hr />
          <div className={`${styles["booking-status-details-container-sub"]}`}>
            <div className={`${styles["booking-status-details-left"]}`}>
              <p>
                <b>Status:&nbsp;</b>
                <span style={{ color: "red", fontStyle: "italic" }}>
                  Re-upload Payment Screenshot
                </span>
              </p>
              <p>
                <b>Reason for Rejection:&nbsp;</b>
              </p>
              <p>
                The payment screenshot provided is unclear, incomplete, or
                incorrect.
              </p>
            </div>
            <div
              className={`${styles["booking-status-details-container-divider"]}`}
            ></div>
            <div className={`${styles["booking-status-details-right"]}`}>
              <p>
                <b>What You Can Do Next:</b>
              </p>
              <p>
                <b>Double-check Your Payment Details</b>
              </p>
              <ol>
                <li>
                  Ensure that the screenshot clearly shows the transaction ID,
                  amount paid, and the payment date.
                </li>
              </ol>
              <p>
                <b>Re-upload the Correct Screenshot</b>
              </p>
              <ol>
                <li>
                  Use the button below to upload a new payment proof for
                  verification.
                </li>
              </ol>
              <p>
                <b>Contact Us</b>
              </p>
              <ol>
                <li>
                  If you believe this was a mistake, reach out to us for
                  assistance.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>
    );
  } else if (props.status === "Invalid") {
    return (
      <section className={`${styles["booking-status-details-section"]}`}>
        <div className={`${styles["booking-status-details-container"]}`}>
          <div
            className={`${styles["booking-status-details-container-heading"]}`}
            style={{ paddingBottom: 5 }}
          >
            <h3>Booking Not Found :&#40;</h3>
            <h4>
              We're sorry, but we couldn't find a booking with the reference
              number you provided. Please double-check your input and try again.
            </h4>
          </div>
        </div>
      </section>
    );
  }
};

export default BookingStatusDetails;
