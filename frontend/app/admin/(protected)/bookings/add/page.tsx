"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
import Form from "./form";
import styles from "./page.module.scss";

export default function Page() {
  const router = useRouter();

  return (
    <div className={styles.page_container}>
      <div className={styles.page_header}>
        <div className={styles.back_arrow} onClick={() => router.back()}>
          <IoArrowBack />
        </div>
        <h1 className={styles.title}>Add Booking</h1>
      </div>

      <Form />
    </div>
  );
}
