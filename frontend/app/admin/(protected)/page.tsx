"use client";

import React, { useEffect, useState } from "react";
import DashboardContainer from "../../components/DashboardContainer";
import Chart from "../../components/Chart";
import BookingTable from "../../components/BookingTable";
import styles from "./../(protected)/page.module.scss";
import { Loading } from "@/app/components/loading";

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
        const response = await fetch(
          "http://localhost:8080/api/bookings/latest-bookings"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }
        const data = await response.json();

        // Format dates
        const formattedBookings = data.bookings.map((booking: BookingData) => ({
          ...booking,
          checkIn: formatDate(booking.checkIn),
          checkOut: formatDate(booking.checkOut),
        }));

        setBookings(formattedBookings);
        setDashboardData({
          pendingReservations: data.pendingReservations,
          activeReservations: data.activeReservations,
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
