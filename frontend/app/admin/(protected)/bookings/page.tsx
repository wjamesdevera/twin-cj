"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./bookings.module.scss";
import BookingTable from "@/app/components/adminBookingDataTable";
import { Loading } from "@/app/components/loading";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { getBooking } from "@/app/lib/api";

interface Booking {
  referenceNo: string;
  checkIn: string;
  checkOut: string;
  service: string;
  total: number;
  customerName: string;
  email: string;
  status: string;
}

interface BookingResponse {
  data: Booking[];
  pendingReservations: number;
  activeReservations: number;
}

export default function Page() {
  const [responseData, setResponseData] = useState<BookingResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { data: bookingData, isLoading } = useSWR("key", getBooking, {
    onSuccess: () => {
      console.table(bookingData);
    },
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/bookings/view-bookings"
        );
        setResponseData(response.data);
      } catch (error) {
        setError("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatAmount = (amount: number) => {
    return amount.toFixed(2);
  };

  if (loading) {
    return <Loading />;
  }

  return isLoading ? (
    <Loading />
  ) : (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardContent}>
        <div className={styles.bookingTable}>
          <BookingTable bookings={bookingData} />
        </div>
      </div>
      <div
        className={styles.floatingIcon}
        onClick={() => router.push("/admin/bookings/add")}
        style={{ cursor: "pointer" }}
      >
        <svg
          width="61"
          height="57"
          viewBox="0 0 61 57"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.floatingIcon}
        >
          <path
            d="M30.5 56.0625C47.1721 56.0625 60.6875 43.7223 60.6875 28.5C60.6875 13.2777 47.1721 0.9375 30.5 0.9375C13.8279 0.9375 0.3125 13.2777 0.3125 28.5C0.3125 43.7223 13.8279 56.0625 30.5 56.0625Z"
            fill="#A45F14"
          />
          <path
            d="M26.1875 15.375H34.8125V41.625H26.1875V15.375Z"
            fill="white"
          />
          <path
            d="M16.125 24.5625H44.875V32.4375H16.125V24.5625Z"
            fill="white"
          />
        </svg>
      </div>
    </div>
  );
}
