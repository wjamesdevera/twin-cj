"use client";

import React, { useEffect, useState } from "react";
import PaymentDetailsHeader from "../../components/paymentDetailsHeader";
import styles from "./paymentDetails.module.scss";
import BackBtn from "../../components/backButton";
import PaymentContainer from "../../components/paymentDetailsContainer";
import SelectPayment from "../../components/selectPayment";
import PricingContainer from "../../components/pricingContainer";
import BookingButton from "../../components/BookingButton";
import { options } from "@/app/api";
import { useForm } from "react-hook-form";
import { paymentSchema } from "../../lib/zodSchemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import ConfirmModal from "@/app/components/confirm_modal";

type PaymentFormData = z.infer<typeof paymentSchema>;

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

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState<() => void>(
    () => () => {}
  );

  const storedBookingData = sessionStorage.getItem("bookingData");
  const bookingData = storedBookingData ? JSON.parse(storedBookingData) : {};

  if (!storedBookingData) {
    console.error("No booking data found in session storage.");
  }

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: bookingData?.paymentMethod || "",
      proofOfPayment: undefined,
    },
  });

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
    (card: BookingCardData) => card.id === bookingData.selectedOption
  );

  const onSubmit = async (data: PaymentFormData) => {
    setConfirmMessage(
      "Are you sure you want to confirm your booking? Please ensure that all details are correct before proceeding."
    );
    setConfirmAction(() => async () => {
      try {
        if (!bookingData) {
          Swal.fire({
            title: "No Booking Data",
            text: "No booking data found. Please try again.",
            icon: "error",
            confirmButtonText: "OK",
          });
          return;
        }

        if (!data.proofOfPayment) {
          Swal.fire({
            title: "Missing Proof of Payment",
            text: "Please upload your proof of payment to proceed.",
            icon: "warning",
            confirmButtonText: "OK",
          });
          return;
        }

        const formData = new FormData();
        formData.append("bookingData", JSON.stringify(bookingData));
        formData.append("paymentMethod", data.paymentMethod);
        formData.append("contactNumber", bookingData.contactNumber || "");
        formData.append("file", data.proofOfPayment);

        const response = await fetch(`${options.baseURL}/api/bookings`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Failed to confirm booking");

        const responseData = await response.json();
        const referenceCode = responseData.result.referenceCode;

        //NOTE: subject to change
        Swal.fire({
          title: "Booking Successful!",
          icon: "success",
          draggable: true,
        }).then(() => {
          sessionStorage.removeItem("bookingData");
          window.location.href = `http://localhost:3000/booking-status?referenceCode=${referenceCode}`;
        });
      } catch (error) {
        console.error("Error confirming booking:", error);
        alert("Failed to confirm booking. Please try again.");
      }
    });

    setIsConfirmModalOpen(true);
  };

  return (
    <div className={styles.paymentContainer}>
      <PaymentDetailsHeader />
      <BackBtn className={styles.backBtn} />
      <form className={styles.paymentDetails}>
        <h2 className={styles.paymentDetailsTitle}>Payment Details</h2>
        <div className={styles.paymentContainers}>
          <PricingContainer
            className={`${styles.rightContainer} ${styles.container1}`}
            imageSrc={
              (bookingData.bookingCards as BookingCardData[]).find(
                (card: BookingCardData) =>
                  card.id === bookingData.selectedOption
              )?.imageUrl || undefined
            }
            numberOfGuests={`${
              bookingData.guestCounts.adults + bookingData.guestCounts.children
            } guest(s)`}
            type={
              bookingData.bookingType === "day-tour" ? "Day Tour" : "Overnight"
            }
            packageType={
              (bookingData.bookingCards as BookingCardData[]).find(
                (card: BookingCardData) =>
                  card.id === bookingData.selectedOption
              )?.name || "Unknown"
            }
            packagePrice={selectedCard?.price || 0}
            totalAmount={selectedCard?.price ? selectedCard.price * 0.5 : 0}
            bookingType={
              bookingData.bookingType === "day-tour" ? "Day Tour" : "Overnight"
            }
          />
          <PaymentContainer
            className={`${styles.leftContainer} ${styles.container2}`}
            heading="Payment Information"
            subheading="Please take note of the following details for your payment."
            fullName={`${bookingData.firstName} ${bookingData.lastName}`}
            email={bookingData.email}
            contactNumber={bookingData.contactNumber}
            downPayment={selectedCard?.price ? selectedCard.price * 0.5 : 0}
          />
          <PaymentContainer
            className={`${styles.leftContainer} ${styles.container3}`}
            heading="Transfer Details"
            subheading={
              <div className={styles.transferDetails}>
                <p>Please send your payment to any of the following:</p>
                <ul>
                  <li>
                    <div className={styles.paymentMethod}>
                      <strong>G-Cash:</strong>
                      <span>09175599237</span>
                    </div>
                  </li>
                  <li>
                    <div className={styles.paymentMethod}>
                      <strong>Bank Transfer:</strong>
                      <span>XXXX-XXXX-XXXX-XXXX</span>
                    </div>
                  </li>
                </ul>
                <p className={styles.note}></p>
              </div>
            }
          />
          <SelectPayment
            className={`${styles.leftContainer} ${styles.container4}`}
            register={register}
            errors={errors}
            setValue={setValue}
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
      </form>
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={() => {
          confirmAction();
          setIsConfirmModalOpen(false);
        }}
        title={confirmMessage}
        confirmText="Yes"
        cancelText="No"
      />
    </div>
  );
}
