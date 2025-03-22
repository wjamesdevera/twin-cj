"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import BookingStatusDetails from "../../components/BookingStatusDetails";
import BookingStatusPrintButton from "../../components/BookingStatusPrintButton";
import BookingStatusReference from "../../components/BookingStatusReference";
import BookingStatusDetailsReupload from "../../components/BookingStatusReupload";
import Hero from "../../components/Hero";
import styles from "../../page.module.scss";

// Temporary Schema (remove upon integrating the centralized zod file)
const bookingSchema = z.object({
  referenceCode: z.string().min(1, "Reference Code is required"),
});

interface BookingStatus {
  name: string;
}

interface BookingData {
  bookingStatus?: BookingStatus;
  referenceCode: string;
  services: Array<{
    name: string;
    serviceCategory: {
      category: {
        name: string;
      };
    };
  }>;
  totalPax: number;
  checkIn: string;
  checkOut: string;
}

export default function Home() {
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookingSchema), // Replace with the centralized zod schema/file
  });

  const fetchBookingData = async ({ referenceCode }: { referenceCode: string }) => {
    try {
      const response = await fetch(`http://localhost:8080/api/bookings/status/${referenceCode}`);
      if (!response.ok) throw new Error("Failed to fetch booking data.");
      
      const text = await response.text();
      if (!text) {
        setBookingData({ bookingStatus: { name: "Invalid" }, referenceCode, services: [], totalPax: 0, checkIn: "", checkOut: "" });
        return;
      }
      
      const data: BookingData = JSON.parse(text);
      setBookingData(data);
    } catch (error) {
      console.error("Error occurred during fetch:", error);
      setBookingData({ bookingStatus: { name: "Invalid" }, referenceCode, services: [], totalPax: 0, checkIn: "", checkOut: "" });
    }
  };
  
  return (
    <div className={styles.page} style={{ marginBottom: "65px" }}>
      <Hero imageURL="/assets/view-booking-status-hero.png" height="335px" marginBottom="65px" />
      <BookingStatusReference
        onBookingFetched={setBookingData}
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        fetchBookingData={fetchBookingData}
      />

      {bookingData && bookingData.services?.length > 0 && (
        <BookingStatusDetails
          status={bookingData?.bookingStatus?.name}
          referenceCode={bookingData?.referenceCode}
          service={bookingData?.services[0]?.name}
          category={bookingData?.services[0]?.serviceCategory?.category.name}
          totalPax={bookingData?.totalPax}
          checkIn={bookingData?.checkIn}
          checkOut={bookingData?.checkOut}
        />
      )}

      {bookingData?.bookingStatus?.name === "Invalid" && <BookingStatusDetails status="Invalid" />}
      {bookingData?.bookingStatus?.name === "Approved" && <BookingStatusPrintButton />}
      {bookingData?.bookingStatus?.name === "Reupload" && (
        <BookingStatusDetailsReupload
          referenceCode={bookingData?.referenceCode}
          onReuploadSuccess={() => fetchBookingData({ referenceCode: bookingData?.referenceCode })}
        />
      )}
    </div>
  );
}
