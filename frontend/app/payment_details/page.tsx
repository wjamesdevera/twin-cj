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
import { useForm } from "react-hook-form";
import { paymentSchema } from "../lib/zodSchemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type PaymentFormData = z.infer<typeof paymentSchema> & {
  proofOfPayment: File | null;
};

interface BookingCardData {
  id: number;
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

  const storedBookingData = sessionStorage.getItem("bookingData");
  const bookingData = storedBookingData ? JSON.parse(storedBookingData) : {};

  if (!storedBookingData) {
    console.error("No booking data found in session storage.");
  } else {
    const parsedData = JSON.parse(storedBookingData);
    console.log("Parsed Booking Data:", parsedData);
    console.log("Contact Number:", parsedData.contactNumber); // Debugging
  }

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PaymentFormData>({
    defaultValues: {
      paymentMethod: bookingData?.paymentMethod || "",
      proofOfPayment: null,
    },
  });

  const paymentMethod = watch("paymentMethod");
  const proofOfPayment = watch("proofOfPayment");

  useEffect(() => {
    const handleResize = () => {
      setIsMediumScreen(window.innerWidth <= 1550);
      setIsSmallScreen(window.innerWidth <= 1280);
      setIsTabletScreen(window.innerWidth <= 1024);
      setIsMobileScreen(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const selectedCard = (bookingData.bookingCards as BookingCardData[]).find(
    (card: BookingCardData) => card.name === bookingData.selectedOption
  );

  const onSubmit = async (data: PaymentFormData) => {
    try {
      if (!bookingData) {
        alert("No booking data found. Please try again.");
        return;
      }

      const formData = new FormData();
      formData.append("bookingData", JSON.stringify(bookingData));
      formData.append("paymentMethod", data.paymentMethod);
      formData.append("contactNumber", bookingData.contactNumber || "");
      if (data.proofOfPayment) {
        formData.append("file", data.proofOfPayment);
      }

      const response = await fetch(`${options.baseURL}/api/bookings`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to confirm booking");

      alert("Booking successful!");
      sessionStorage.removeItem("bookingData");
    } catch (error) {
      console.error("Error confirming booking:", error);
      alert("Failed to confirm booking. Please try again.");
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
            proofOfPayment={proofOfPayment ?? null}
            handleSubmit={handleSubmit(onSubmit)}
            setPaymentMethod={(method: string) =>
              setValue("paymentMethod", method)
            }
            setProofOfPayment={(file: File | null) => {
              if (file) setValue("proofOfPayment", file);
            }}
            error={errors.proofOfPayment?.message ?? ""}
            setError={() => {}}
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
        <BookingButton
          text="CONFIRM BOOKING"
          onClick={handleSubmit(onSubmit)}
        />
      </div>
    </div>
  );
}
