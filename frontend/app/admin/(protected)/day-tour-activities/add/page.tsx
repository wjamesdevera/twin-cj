"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
import DayTourForm from "./form";
import styles from "./page.module.scss";
import NotificationModal from "@/app/components/notification_modal";
export default function CreateDayTour() {
  const router = useRouter();

  const [notification, setNotification] = React.useState<{
    isOpen: boolean;
    message: string;
    type: "success" | "error";
  }>({
    isOpen: false,
    message: "",
    type: "success",
  });

  return (
    <div className={styles.page_container}>
      <div className={styles.page_header}>
        <div className={styles.back_arrow} onClick={() => router.back()}>
          <IoArrowBack />
        </div>
        <h1 className={styles.title}>Add New Day Tour</h1>
      </div>

      <div className={styles.form_container}>
        <DayTourForm />
      </div>

      {notification.isOpen && (
        <NotificationModal
          isOpen={notification.isOpen}
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ ...notification, isOpen: false })}
        />
      )}
    </div>
  );
}
