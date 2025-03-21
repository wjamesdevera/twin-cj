"use client";

import { useState } from "react";
import BookingStatusDetails from "../../components/BookingStatusDetails";
import BookingStatusPrintButton from "../../components/BookingStatusPrintButton";
import BookingStatusReference from "../../components/BookingStatusReference";
import BookingStatusDetailsReupload from "../../components/BookingStatusReupload";
import Hero from "../../components/Hero";
import styles from "../../page.module.scss";

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

  const fetchBookingData = async (referenceCode: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/bookings/status/${referenceCode}`);

      if (!response.ok) throw new Error("Failed to fetch booking data.");
      
      const data = await response.json();
      setBookingData(data);
    } catch (error) {
      console.error("Error occurred during fetch:", error);
    }
  };
  
  return (
    <div className={styles.page} style={{ marginBottom: "65px" }}>
      <Hero imageURL="/assets/view-booking-status-hero.png" height="335px" marginBottom="65px" />
      <BookingStatusReference onBookingFetched={setBookingData} />

      {bookingData && bookingData.services && bookingData.services.length > 0 ? (
        <BookingStatusDetails
          status={bookingData.bookingStatus?.name}
          referenceCode={bookingData.referenceCode}
          service={bookingData.services[0]?.name || 'Unavailable'}
          category={bookingData.services[0]?.serviceCategory?.category.name || 'Unavailable'}
          totalPax={bookingData.totalPax}
          checkIn={bookingData.checkIn}
          checkOut={bookingData.checkOut}
        />
      ) : (
        null
      )}

      {bookingData?.bookingStatus?.name == "Approved" ? (
        <BookingStatusPrintButton />
      ) : (
        null
      )}

      {bookingData?.bookingStatus?.name == "Reupload" ? (
        <BookingStatusDetailsReupload
          referenceCode={bookingData.referenceCode}
          onReuploadSuccess={() => fetchBookingData(bookingData.referenceCode)}
        />
      ) : (
        null
      )}
    </div>
  );
}
