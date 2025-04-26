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

  const { data: bookingData, isLoading } = useSWR("key", getBooking);

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
    </div>
  );
}
