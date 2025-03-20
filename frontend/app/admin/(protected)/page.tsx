"use client";

import React from "react";
import DashboardContainer from "../../components/DashboardContainer";
import Chart from "../../components/Chart";
import BookingTable from "../../components/BookingTable";
import styles from "./../(protected)/page.module.scss";

const Page = () => {
  const dashboardData = {
    pendingReservations: 5,
    activeReservations: 10,
  };

  const bookings = [
    {
      referenceNo: "20241121-030",
      service: "Maxi Cabin",
      checkIn: "11/21/2024",
      checkOut: "11/23/2024",
      total: 18000,
      customerName: "Ralph Kyle Labaguis",
      email: "test@gmail.com",
      status: "pending",
    },
    {
      referenceNo: "20241121-029",
      service: "Venti Cabin",
      checkIn: "11/21/2024",
      checkOut: "11/22/2024",
      total: 12000,
      customerName: "Winfrey De Vera",
      email: "test@gmail.com",
      status: "active",
    },
    {
      referenceNo: "20241121-028",
      service: "Maxi Cabin",
      checkIn: "11/21/2024",
      checkOut: "11/22/2024",
      total: 6000,
      customerName: "Paul Trinidad",
      email: "test@gmail.com",
      status: "active",
    },
    {
      referenceNo: "20241121-027",
      service: "River Day Tour",
      checkIn: "11/21/2024",
      checkOut: "11/22/2024",
      total: 500,
      customerName: "Kurt Duterte",
      email: "test@gmail.com",
      status: "completed",
    },
    {
      referenceNo: "20241121-026",
      service: "Swimming Pool",
      checkIn: "11/21/2024",
      checkOut: "11/22/2024",
      total: 1000,
      customerName: "Patricia Arellano",
      email: "test@gmail.com",
      status: "active",
    },
    {
      referenceNo: "20241121-025",
      service: "Mini Cabin",
      checkIn: "11/21/2024",
      checkOut: "11/22/2024",
      total: 3500,
      customerName: "Chrizelle Feliciano",
      email: "test@gmail.com",
      status: "active",
    },
    {
      referenceNo: "20241121-024",
      service: "Maxi Cabin",
      checkIn: "11/21/2024",
      checkOut: "11/22/2024",
      total: 7500,
      customerName: "Dawn Andal",
      email: "test@gmail.com",
      status: "completed",
    },
    {
      referenceNo: "20241121-023",
      service: "Mini Cabin",
      checkIn: "11/21/2024",
      checkOut: "11/22/2024",
      total: 3000,
      customerName: "Matthew Abraham Tomaneng",
      email: "test@gmail.com",
      status: "completed",
    },
    {
      referenceNo: "20241121-023",
      service: "Mini Cabin",
      checkIn: "11/21/2024",
      checkOut: "11/22/2024",
      total: 3000,
      customerName: "Matthew Abraham Tomaneng",
      email: "test@gmail.com",
      status: "completed",
    },
  ];

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
