"use client";

import React from "react";
import styles from "./bookings.module.scss";
import BookingTable from "@/app/components/adminBookingDataTable";
import { Loading } from "@/app/components/loading";
import useSWR from "swr";
import { getBooking } from "@/app/lib/api";

export default function Page() {
  const { data: bookingData, isLoading } = useSWR("key", getBooking);

  return isLoading ? (
    <Loading />
  ) : (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardContent}>
        <div className={styles.bookingTable}>
          <BookingTable bookings={bookingData} />
        </div>
      </div>
    </div>
  );
}
