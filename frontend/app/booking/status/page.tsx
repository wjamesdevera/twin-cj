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
  referenceCode: string;
  totalPax: number;
  checkIn: string;
  checkOut: string;
  bookingStatus?: BookingStatus;
}

// missing: package
// missing: cabin

export default function Home() {
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  return (
    <div className={styles.page}>
      <Hero imageURL="/assets/view-booking-status-hero.png" height="335px" marginBottom="65px" />
      <BookingStatusReference onBookingFetched={setBookingData} />

      <BookingStatusDetails status="Approved" />
      <BookingStatusPrintButton />
      <BookingStatusDetailsReupload />
    </div>
  );
}
