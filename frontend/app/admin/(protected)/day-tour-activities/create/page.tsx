"use client";

import React from "react";
import { useRouter } from "next/navigation";
import useSWRMutation from "swr/mutation";
import { IoArrowBack } from "react-icons/io5";
import DayTourForm from "./form";
import { options } from "@/app/api";
import { Loading } from "@/app/components/loading";
import styles from "./page.module.scss";
import NotificationModal from "@/app/components/notification_modal";
export default function createDayTour() {
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

  const { trigger, isMutating } = useSWRMutation(
    `${options.baseURL}/api/services/day-tours/`,
    async (key, { arg }: { arg: FormData }) => {
      const response = await fetch(key, {
        method: "POST",
        body: arg,
      });

      if (response.ok) {
        setNotification({
          isOpen: true,
          message: "Day tour created successfully!",
          type: "success",
        });

        router.push("/admin/day-tour-activities");
      } else {
        setNotification({
          isOpen: true,
          message: "Error creating day tour.",
          type: "error",
        });
        throw new Error("Error creating day tour");
      }
    }
  );

  return (
    <div className={styles.page_container}>
      <div className={styles.page_header}>
        <div className={styles.back_arrow} onClick={() => router.back()}>
          <IoArrowBack />
        </div>
        <h1 className={styles.title}>Add New Day Tour</h1>
      </div>

      <div className={styles.form_container}>
        {isMutating ? (
          <Loading />
        ) : (
          <DayTourForm trigger={trigger} isMutating={isMutating} />
        )}
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
