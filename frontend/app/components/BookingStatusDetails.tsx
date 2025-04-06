import { useState } from "react";
import styles from "./BookingStatusDetails.module.scss";
import { options } from "../api";

interface BookingStatusDetailsProps {
  status: string;
  referenceCode?: string;
  serviceId?: number;
  service?: string;
  category?: string;
  totalPax?: number;
  checkIn?: string;
  checkOut?: string;
  notes?: string | null;
  message?: string;
  bookingData?: {
    services?: {
      id: string;
    }[];
  };
}

const BookingStatusDetails = ({
  status,
  referenceCode,
  service,
  category,
  totalPax,
  checkIn,
  checkOut,
  message,
  bookingData,
}: BookingStatusDetailsProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
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

  const BookingDetails = () => (
    <>
      <div className={`${styles["booking-status-details-container-sub"]}`}>
        <div className={`${styles["booking-status-details-left"]}`}>
          <p>
            <b>Status: </b>
            <span
              style={{
                color: status === "Approved" ? "green" : "orange",
                fontStyle: "italic",
              }}
            >
              {status}
            </span>
          </p>
          <p>
            <b>Reference Number: </b>
            <span>{referenceCode || "N/A"}</span>
          </p>
          {category === "day-tour" ? (
            <p>
              <b>Package: </b>
              <span>{service || "N/A"}</span>
            </p>
          ) : (
            <p>
              <b>Cabin: </b>
              <span>{service || "N/A"}</span>
            </p>
          )}
          <p>
            <b>No. of Guests: </b>
            <span>{totalPax || 0}</span>
          </p>
          <p>
            <b>Check-In: </b>
            <span>{formatDate(checkIn)}</span>
          </p>
          <p>
            <b>Check-Out: </b>
            <span>{formatDate(checkOut)}</span>
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
            Please take note of the following reminders ahead of your reserved
            schedule:
          </p>
          <ol>
            <li>
              Please bring a valid ID and booking confirmation for verification.
            </li>
            <li>
              Do arrive at least ten minutes before the actual booked schedule.
            </li>
            <li>No smoking inside the premises and observe quiet hours.</li>
          </ol>
        </div>
      </div>
    </>
  );

  switch (status?.toLowerCase()) {
    case "approved":
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
            <BookingDetails />
          </div>
        </section>
      );

    case "pending":
      return (
        <section className={`${styles["booking-status-details-section"]}`}>
          <div className={`${styles["booking-status-details-container"]}`}>
            <div
              className={`${styles["booking-status-details-container-heading"]}`}
            >
              <h3>Hang Tight, Your Booking is Being Processed!</h3>
              <h4>
                Thank you for your booking! Your reservation is currently being
                processed. Please check back later for updates.
              </h4>
            </div>
            <hr />
            <div
              className={`${styles["booking-status-details-container-sub"]}`}
            >
              <div className={`${styles["booking-status-details-left"]}`}>
                <p>
                  <b>Status: </b>
                  <span style={{ color: "orange", fontStyle: "italic" }}>
                    {status}
                  </span>
                </p>
                <p>
                  <b>Reference Number: </b>
                  <span>{referenceCode || "N/A"}</span>
                </p>
                {category === "day-tour" ? (
                  <p>
                    <b>Package: </b>
                    <span>{service || "N/A"}</span>
                  </p>
                ) : (
                  <p>
                    <b>Cabin: </b>
                    <span>{service || "N/A"}</span>
                  </p>
                )}
                <p>
                  <b>No. of Guests: </b>
                  <span>{totalPax || 0}</span>
                </p>
                <p>
                  <b>Check-In: </b>
                  <span>{formatDate(checkIn)}</span>
                </p>
                <p>
                  <b>Check-Out: </b>
                  <span>{formatDate(checkOut)}</span>
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
                    Ensure that your payment is valid, processed, and confirmed.
                  </li>
                  <li>
                    You will receive an email for any updates to your booking.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </section>
      );

    case "cancelled":
      return (
        <section className={`${styles["booking-status-details-section"]}`}>
          <div className={`${styles["booking-status-details-container"]}`}>
            <div
              className={`${styles["booking-status-details-container-heading"]}`}
            >
              <h3>Your Booking Has Been Cancelled</h3>
              <h4>
                We’re sorry to inform you that your booking has been cancelled.
              </h4>
            </div>
            <hr />
            <div
              className={`${styles["booking-status-details-container-sub"]}`}
            >
              <div className={`${styles["booking-status-details-left"]}`}>
                <p>
                  <b>Status: </b>
                  <span style={{ color: "red", fontStyle: "italic" }}>
                    Cancelled
                  </span>
                </p>
                <p>
                  <b>Reference Number: </b>
                  <span>{referenceCode || "N/A"}</span>
                </p>
                <p>
                  <b>Reason for Cancellation: </b>
                </p>
                <p>{message}</p>
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
                    More details regarding the cancellation may have been sent
                    to your registered email.
                  </li>
                </ol>
                <p>
                  <b>Review Booking Policies</b>
                </p>
                <ol>
                  <li>
                    Ensure your booking meets all requirements to avoid future
                    cancellations.
                  </li>
                </ol>
                <p>
                  <b>Contact Support</b>
                </p>
                <ol>
                  <li>
                    If you believe this was an error or need clarification,
                    please reach out to us.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </section>
      );

    case "rescheduled":
      const [newCheckIn, setNewCheckIn] = useState(checkIn || "");
      const [newCheckOut, setNewCheckOut] = useState(checkOut || "");
      const [isDateChanged, setIsDateChanged] = useState(false);
      const [unavailableServices, setUnavailableServices] = useState<
        { id: string; name: string }[]
      >([]);

      const serviceId = bookingData?.services?.[0]?.id || null;

      const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        setNewCheckIn(newDate);
        setIsDateChanged(newDate !== checkIn || newCheckOut !== checkOut);
      };

      const handleCheckOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        setNewCheckOut(newDate);
        setIsDateChanged(newCheckIn !== checkIn || newDate !== checkOut);
      };

      const handleSubmit = async () => {
        if (!newCheckIn || !newCheckOut) {
          alert("Please select both check-in and check-out dates.");
          return;
        }

        if (new Date(newCheckIn) >= new Date(newCheckOut)) {
          alert("Check-out date must be later than check-in date.");
          return;
        }

        try {
          const response = await fetch(
            `${options.baseURL}/api/bookings/dates/${referenceCode}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                referenceCode,
                newCheckIn,
                newCheckOut,
              }),
            }
          );

          const result = await response.json();

          if (response.ok) {
            setUnavailableServices([]);
            alert("New dates submitted successfully!");
          } else {
            if (result.unavailableServices) {
              setUnavailableServices(result.unavailableServices);
              alert(
                `The following services are unavailable for the selected dates: ${result.unavailableServices
                  .map((s: { name: string }) => s.name)
                  .join(", ")}`
              );
            } else {
              alert(
                result.message ||
                  "Failed to submit new dates. Please try again."
              );
            }
          }
        } catch (error) {
          console.error("Error submitting new dates:", error);
          alert("An error occurred. Please try again.");
        }
      };

      return (
        <section className={`${styles["booking-status-details-section"]}`}>
          <div className={`${styles["booking-status-details-container"]}`}>
            <div
              className={`${styles["booking-status-details-container-heading"]}`}
            >
              <h3>Your Booking Has Been Rescheduled</h3>
              <h4>
                Your booking has been updated with new dates. Please review the
                details below.
              </h4>
            </div>
            <hr />
            <div
              className={`${styles["booking-status-details-container-sub"]}`}
            >
              <div className={`${styles["booking-status-details-left"]}`}>
                <p>
                  <b>Status: </b>
                  <span style={{ color: "blue", fontStyle: "italic" }}>
                    Rescheduled
                  </span>
                </p>
                <p>
                  <b>Reference Number: </b>
                  <span>{referenceCode || "N/A"}</span>
                </p>
                {category === "day-tour" ? (
                  <p>
                    <b>Package: </b>
                    <span>{service || "N/A"}</span>
                  </p>
                ) : (
                  <p>
                    <b>Cabin: </b>
                    <span>{service || "N/A"}</span>
                  </p>
                )}
                <p>
                  <b>No. of Guests: </b>
                  <span>{totalPax || 0}</span>
                </p>
                <div>
                  <label htmlFor="newCheckIn">
                    <b>Select New Check-In Date:</b>
                  </label>
                  <input
                    type="date"
                    id="newCheckIn"
                    name="newCheckIn"
                    className={styles["date-picker"]}
                    value={newCheckIn}
                    onChange={handleCheckInChange}
                  />
                </div>
                <div>
                  <label htmlFor="newCheckOut">
                    <b>Select New Check-Out Date:</b>
                  </label>
                  <input
                    type="date"
                    id="newCheckOut"
                    name="newCheckOut"
                    className={styles["date-picker"]}
                    value={newCheckOut}
                    onChange={handleCheckOutChange}
                  />
                </div>
                <button onClick={handleSubmit}>Reschedule</button>
              </div>
              <div
                className={`${styles["booking-status-details-container-divider"]}`}
              ></div>
              <div className={`${styles["booking-status-details-right"]}`}>
                <p>
                  <b>Important Reminders</b>
                </p>
                <p>
                  Please note the following regarding your rescheduled booking:
                </p>
                <ol>
                  <li>
                    Verify the new dates work for you and contact us if there’s
                    an issue.
                  </li>
                  <li>
                    Bring a valid ID and updated booking confirmation for
                    verification.
                  </li>
                  <li>
                    Arrive at least ten minutes before your new scheduled time.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </section>
      );

    case "invalid":
      return (
        <section className={`${styles["booking-status-details-section"]}`}>
          <div className={`${styles["booking-status-details-container"]}`}>
            <div
              className={`${styles["booking-status-details-container-heading"]}`}
              style={{ paddingBottom: 5 }}
            >
              <h3>Booking Not Found</h3>
              <h4>
                We couldn’t find a booking with the reference number you
                provided. Please double-check and try again.
              </h4>
            </div>
          </div>
        </section>
      );

    default:
      return null;
  }
};

export default BookingStatusDetails;
