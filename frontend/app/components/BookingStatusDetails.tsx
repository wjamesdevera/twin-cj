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
      hour12: true,
    });
  };

  if (props.status) {
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
                <span style={{ color: "orange", fontStyle: "italic" }}>
                  {props.status}
                </span>
              </p>
              <p>
                <b>Reference Number:&nbsp;</b>
                <span>{props.referenceCode}</span>
              </p>
              {props.category == "day-tour" ? (
                <p>
                  <b>Package:&nbsp;</b>
                  <span>{props.service}</span>
                </p>
              ) : (
                <p>
                  <b>Cabin:&nbsp;</b>
                  <span>{props.service}</span>
                </p>
              )}
              <p>
                <b>No. of Guests:&nbsp;</b>
                <span>{props.totalPax}</span>
              </p>
              <p>
                <b>Check-In:&nbsp;</b>
                <span>{formatDate(props.checkIn)}</span>
              </p>
              <p>
                <b>Check-Out:&nbsp;</b>
                <span>{formatDate(props.checkOut)}</span>
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
                Please take note of the following reminders ahead of your
                reserved schedule:
              </p>
              <ol>
                <li>
                  Please bring a valid ID and booking confirmation for
                  verification.
                </li>
                <li>
                  Do arrive at least ten minutes before the actual booked
                  schedule.
                </li>
                <li>No smoking inside the premises and observe quiet hours.</li>
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
                <span>{props.referenceCode}</span>
              </p>
              {props.category == "day-tour" ? (
                <p>
                  <b>Package:&nbsp;</b>
                  <span>{props.service}</span>
                </p>
              ) : (
                <p>
                  <b>Cabin:&nbsp;</b>
                  <span>{props.service}</span>
                </p>
              )}
              <p>
                <b>No. of Guests:&nbsp;</b>
                <span>{props.totalPax}</span>
              </p>
              <p>
                <b>Check-In:&nbsp;</b>
                <span>{formatDate(props.checkIn)}</span>
              </p>
              <p>
                <b>Check-Out:&nbsp;</b>
                <span>{formatDate(props.checkOut)}</span>
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
                Please take note of the following reminders for your pending
                reservation:
              </p>
              <ol>
                <li>Booking approvals usually take 24-48 hours.</li>
                <li>
                  Ensure that your payment is valid, processed, and is
                  confirmed.
                </li>
                <li>
                  You will receive an email for any updates that are to be made
                  with your booking.
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
                The payment screenshot that was provided is unclear, incomplete,
                or incorrect.
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
  } else if (props.status === "Cancelled") {
    return (
      <section className={`${styles["booking-status-details-section"]}`}>
        <div className={`${styles["booking-status-details-container"]}`}>
          <div
            className={`${styles["booking-status-details-container-heading"]}`}
          >
            <h3>Your Booking Has Been Cancelled</h3>
            <h4>Your booking was cancelled due to unforeseen circumstances.</h4>
          </div>
          <hr />
          <div className={`${styles["booking-status-details-container-sub"]}`}>
            <div className={`${styles["booking-status-details-left"]}`}>
              <p>
                <b>Status:&nbsp;</b>
                <span style={{ color: "red", fontStyle: "italic" }}>
                  Cancelled
                </span>
              </p>
              <p>
                <b>Reason for Rejection:&nbsp;</b>
              </p>
              <p>
                Your booking was cancelled at your request or by an
                administrator.
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
                <b>Check Your Email</b>
              </p>
              <ol>
                <li>
                  More details regarding the cancellation may have been sent to
                  your registered email.
                </li>
              </ol>
              <p>
                <b>Review Booking Policies</b>
              </p>
              <ol>
                <li>
                  Ensure your booking met all requirements to avoid future
                  cancellations.
                </li>
              </ol>
              <p>
                <b>Contact Support</b>
              </p>
              <ol>
                <li>
                  If you believe this was an error or need further
                  clarification, please reach out to us.
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
