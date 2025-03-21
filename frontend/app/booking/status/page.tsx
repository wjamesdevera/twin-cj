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
  totalPax: number;
  checkIn: string;
  checkOut: string;
}

// missing: package
// missing: cabin

export default function Home() {
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  const fetchBookingData = async (referenceCode: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/bookings/status/${referenceCode}`);
      
      const data = await response.json();
      setBookingData(data);
    } catch (error) {

    }
  };

  console.log(bookingData)

  return (
    <div className={styles.page} style={{ marginBottom: "65px" }}>
      <Hero imageURL="/assets/view-booking-status-hero.png" height="335px" marginBottom="65px" />
      <BookingStatusReference onBookingFetched={setBookingData} />

      {bookingData && (
        <BookingStatusDetails
          status={bookingData.bookingStatus?.name}
          referenceCode={bookingData.referenceCode}
          package="TO BE WORKED ON"
          cabin="TO BE WORKED ON"
          totalPax={bookingData.totalPax}
          checkIn={bookingData.checkIn}
          checkOut={bookingData.checkOut}
        />
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
