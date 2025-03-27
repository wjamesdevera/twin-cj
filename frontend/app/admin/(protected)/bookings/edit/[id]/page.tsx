"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
import Form from "./Form";
import styles from "./page.module.scss";
import { Loading } from "@/app/components/loading";
import useSWR from "swr";
import { getBookingById, getBookingStatus } from "@/app/lib/api";

export default function Page() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const { data: bookingData, isLoading: bookingDataLoading } = useSWR(
    id,
    getBookingById
  );

  const { data: bookingStatus, isLoading: bookingStatusLoading } = useSWR(
    "getBookingStatus",
    getBookingStatus
  );

  console.log(bookingStatus);

  return bookingStatusLoading || bookingDataLoading ? (
    <Loading />
  ) : (
    <div className={styles.page_container}>
      <div className={styles.page_header}>
        <div className={styles.back_arrow} onClick={() => router.back()}>
          <IoArrowBack />
        </div>
        <h1 className={styles.title}>Edit Booking</h1>
      </div>

      <Form
        referenceNo={id}
        bookingStatus={bookingStatus || []}
        defaultValues={bookingData}
      />
    </div>
  );
}
