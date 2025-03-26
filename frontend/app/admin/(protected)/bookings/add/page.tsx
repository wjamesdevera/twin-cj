"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
import Form from "./Form";
import styles from "./page.module.scss";
import ConfirmModal from "@/app/components/confirm_modal";

export default function Page() {
  const router = useRouter();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleBackClick = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmBack = () => {
    setIsConfirmModalOpen(false);
    router.back();
  };

  return (
    <div className={styles.page_container}>
      <div className={styles.page_header}>
        <div className={styles.back_arrow} onClick={handleBackClick}>
          <IoArrowBack />
        </div>
        <h1 className={styles.title}>Add Booking</h1>
      </div>

      <Form />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmBack}
        title="Are you sure you want to go back?"
        confirmText="Yes"
        cancelText="No"
      />
    </div>
  );
}
