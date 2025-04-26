"use client";

import React, { useEffect, useState } from "react";
import DashboardContainer from "../../components/DashboardContainer";
import Chart from "../../components/Chart";
import BookingTable from "../../components/BookingTable";
import styles from "./../(protected)/page.module.scss";
import { Loading } from "@/app/components/loading";
import { options } from "@/app/api";

interface BookingData {
  referenceNo: string;
  service: string;
  checkIn: string;
  checkOut: string;
  total: number;
  customerName: string;
  email: string;
  status: string;
}

const Page = () => {
  const [dashboardData, setDashboardData] = useState({
    pendingReservations: 0,
    activeReservations: 0,
  });
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (date: string): string => {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
  };

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const latestBookingResponse = await fetch(
          `${options.baseURL}/api/bookings/latest-bookings`
        );

        const contentType = latestBookingResponse.headers.get("Content-Type");
        if (!contentType || !contentType.includes("application/json")) {
          const errorText = await latestBookingResponse.text();
          throw new Error(`Expected JSON but received HTML: ${errorText}`);
        }

        if (!latestBookingResponse.ok) {
          throw new Error("Failed to fetch bookings");
        }
        const latestBookingData = await latestBookingResponse.json();

        const formattedBookings = latestBookingData.bookings.map(
          (booking: BookingData) => ({
            ...booking,
            checkIn: formatDate(booking.checkIn),
            checkOut: formatDate(booking.checkOut),
            total: booking.total.toFixed(2),
          })
        );

        setBookings(formattedBookings);
        setDashboardData({
          pendingReservations: latestBookingData.pendingReservations,
          activeReservations: latestBookingData.activeReservations,
        });
        setLoading(false);
      } catch (error) {
        setError("An error occurred while fetching bookings");
        setLoading(false);
      }
    };

    fetchBookingData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardContent}>
        <h1 className={styles.dashboardTitle}>Dashboard</h1>
        <div className={styles.statsAndChart}>
          <DashboardContainer {...dashboardData} />
          <Chart />
        </div>
        <div className={styles.bookingTable}>
          <BookingTable bookings={bookings} />
        </div>
      </div>
    </div>
  );
};

export default Page;
