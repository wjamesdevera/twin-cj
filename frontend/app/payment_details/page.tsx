"use client";

import React, { useEffect, useState } from "react";
import PaymentDetailsHeader from "../components/paymentDetailsHeader";
import styles from "./paymentDetails.module.scss";
import BackBtn from "../components/backButton";
import PaymentContainer from "../components/paymentDetailsContainer";
import SelectPayment from "../components/selectPayment";
import PricingContainer from "../components/pricingContainer";
import BookingButton from "../components/BookingButton";
import { options } from "@/app/api";

interface BookingCardData {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export default function PaymentDetails() {
  const [isMediumScreen, setIsMediumScreen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const [isTabletScreen, setIsTabletScreen] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [proofOfPayment, setProofOfPayment] = useState<File | null>(null);
  const [error, setError] = useState<string>("");

  const storedBookingData = sessionStorage.getItem("bookingData");
  const bookingData = storedBookingData ? JSON.parse(storedBookingData) : null;

  // Responsiveness for the cancellation policy container
  useEffect(() => {
    const handleResize = () => {
      setIsMediumScreen(window.innerWidth <= 1550);
      setIsSmallScreen(window.innerWidth <= 1280);
      setIsTabletScreen(window.innerWidth <= 1024);
      setIsMobileScreen(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const selectedCard = (bookingData.bookingCards as BookingCardData[]).find(
    (card: BookingCardData) => card.name === bookingData.selectedOption
  );

  const handleConfirmBooking = async () => {
    if (!paymentMethod) {
      setError("Please select a payment method.");
      return;
    }

    if (!proofOfPayment) {
      setError("Please upload your proof of payment.");
      return;
    }

    // Number of Guest calculation
    const totalPax =
      bookingData.guestCounts.adults + bookingData.guestCounts.children;
    bookingData.totalPax = totalPax;

    const amount = selectedCard?.price || 0;
    bookingData.amount = amount;

    if (!bookingData || !bookingData.bookingType) {
      console.error("Booking data is missing or incomplete:", bookingData);
      alert("Please select a booking type before proceeding.");
      return null;
    }

    const requiredFields = ["totalPax", "amount"];
    for (const field of requiredFields) {
      if (!bookingData[field]) {
        console.error(`Missing required field: ${field}`);
        alert(`Missing required field: ${field}`);
        return;
      }
    }

    try {
      const formData = new FormData();
      formData.append("bookingData", JSON.stringify(bookingData));
      formData.append("paymentMethodId", paymentMethod);
      if (proofOfPayment) {
        formData.append("proofOfPayment", proofOfPayment);
      }

      const response = await fetch(`${options.baseURL}/api/bookings`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to confirm booking:", response.status, errorText);
        throw new Error(
          `Failed to confirm booking: ${response.status} ${errorText}`
        );
      }

      const result = await response.json();
      alert("Booking confirmed!");
    } catch (error) {
      console.error("Failed to confirm booking:", error);
    }
  };

  return (
    <div className={styles.paymentContainer}>
      <PaymentDetailsHeader />
      <BackBtn className={styles.backBtn} />
      <div className={styles.paymentDetails}>
        <h2 className={styles.paymentDetailsTitle}>Payment Details</h2>
        <div className={styles.paymentContainers}>
          <PricingContainer
            className={`${styles.rightContainer} ${styles.container1}`}
            imageSrc={
              (bookingData.bookingCards as BookingCardData[]).find(
                (card: BookingCardData) =>
                  card.name === bookingData.selectedOption
              )?.imageUrl || undefined
            }
            numberOfGuests={`${
              bookingData.guestCounts.adults + bookingData.guestCounts.children
            } guest(s)`}
            type={
              bookingData.bookingType === "day-tour" ? "Day Tour" : "Overnight"
            }
            packageType={bookingData.selectedOption}
            packagePrice={selectedCard?.price || 0}
            totalAmount={selectedCard?.price || 0}
            bookingType={
              bookingData.bookingType === "day-tour" ? "Day Tour" : "Overnight"
            }
          />
          <PaymentContainer
            className={`${styles.leftContainer} ${styles.container2}`}
            heading="Payment Information"
            subheading="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi at neque egestas turpis varius pellentesque vitae sed est. Duis cursus nisi vitae enim pellentesque fringilla. Nam eget dolor et enim fringilla semper non eu purus. Nullam lectus lorem, facilisis quis aliquam sollicitudin, facilisis eu ipsum. Sed eget viverra purus."
          />
          <PaymentContainer
            className={`${styles.leftContainer} ${styles.container3}`}
            heading="Transfer Details"
            subheading="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi at neque egestas turpis varius pellentesque vitae sed est. Duis cursus nisi vitae enim pellentesque fringilla."
          />
          <SelectPayment
            className={`${styles.leftContainer} ${styles.container4}`}
            paymentMethod={paymentMethod}
            proofOfPayment={proofOfPayment}
            setPaymentMethod={setPaymentMethod}
            setProofOfPayment={setProofOfPayment}
            error={error}
            setError={setError}
          />
          <PaymentContainer
            className={`${styles.rightContainer} ${styles.container5}`}
            style={
              isMobileScreen
                ? { width: "100%", maxWidth: "600px" } // Width for 768px
                : isTabletScreen
                ? { width: "100%", maxWidth: "300px", minWidth: "300px" } // Width for 1024px
                : isSmallScreen
                ? { width: "100%", maxWidth: "380px", minWidth: "350px" } // Width for 1280px
                : isMediumScreen
                ? { width: "100%", maxWidth: "450px", minWidth: "350px" } // Width for 1550px
                : undefined
            }
            heading="Cancellation Policy"
            subheading={
              <>
                Cancellations made at least{" "}
                <span className={styles.bold}>3 business days</span> prior to
                the scheduled booking will be eligible for a refund or
                reschedule. In cases of typhoon, natural calamities, or other
                unforeseen circumstances affecting the reservation, refunds may
                be accommodated upon review.
              </>
            }
          />
        </div>
        <BookingButton text="CONFIRM BOOKING" onClick={handleConfirmBooking} />
      </div>
    </div>
  );
}
