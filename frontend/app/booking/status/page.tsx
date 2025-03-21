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

  console.log(bookingData)

  return (
    <div className={styles.page}>
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
      
      {/*
      <BookingStatusPrintButton />
      <BookingStatusDetailsReupload />
      */}
    </div>
  );
}
