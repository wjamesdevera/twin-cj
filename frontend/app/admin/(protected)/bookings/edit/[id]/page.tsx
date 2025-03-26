"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
import Form from "./Form";
import styles from "./page.module.scss";
import { Loading } from "@/app/components/loading";

interface Booking {
  referenceNo: string;
}

export default function Page() {
  const router = useRouter();
  const { id } = useParams();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        console.log("Fetching booking ID:", id);
        const response = await fetch(
          `http://localhost:8080/api/bookings/${id}`
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setBooking(data);
      } catch (err) {
        console.error("Error fetching booking:", err);
        setError("Failed to load booking details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBooking();
  }, [id]);

  if (loading) return <Loading />;

  return (
    <div className={styles.page_container}>
      <div className={styles.page_header}>
        <div className={styles.back_arrow} onClick={() => router.back()}>
          <IoArrowBack />
        </div>
        <h1 className={styles.title}>Edit Booking</h1>
      </div>

      <Form referenceNo={booking?.referenceNo ?? ""} />
    </div>
  );
}
