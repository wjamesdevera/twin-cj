"use client";

import { useState, useEffect } from "react";
import AdminAccountsTable from "./admin_accounts_table";
import NotificationModal from "../../../components/notification_modal"; 
import styles from "./page.module.scss";
import Link from "next/link";

const AdminAccountsPage = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState<"success" | "error">("success");

  const showNotification = (message: string, type: "success" | "error") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setIsNotificationOpen(true);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const adminUpdated = localStorage.getItem("adminUpdated");
      
      if (adminUpdated) {
        showNotification("Admin account updated successfully!", "success"); // 
        localStorage.removeItem("adminUpdated"); 
      }
      
      const adminAdded = localStorage.getItem("adminAdded");
      if (adminAdded) {
        showNotification("Admin account added successfully!", "success");
        localStorage.removeItem("adminAdded");
      }
    }
  }, []);
  

  return (
    <div className={styles.page_container}>
      <div className={styles.page_header}>
        <h1 className={styles.title}>Admin Accounts</h1>
      </div>
      <div className={styles.add_user_container}>
        <Link className={styles.primaryLink} href="/admin/accounts/add">
          Add User
        </Link>
      </div>
      
      <AdminAccountsTable showNotification={showNotification} />

      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        message={notificationMessage}
        type={notificationType}
      />
    </div>
  );
};

export default AdminAccountsPage;
