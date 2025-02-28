"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../../components/admin-sidebar";
import CustomButton from "../../../components/custom_button";
import ConfirmModal from "../../../components/confirm_modal";
import NotificationModal from "../../../components/notification_modal";
import AdminAccountsTable from "../../../components/admin_accounts_table";
import styles from "./page.module.scss";
import { useRouter } from "next/navigation";

const AdminAccountsPage = () => {
  const [isClient, setIsClient] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  // const [notificationMessage, setNotificationMessage] = useState("");
  // const [notificationType, setNotificationType] = useState<"success" | "error">(
    // "success"
  // );
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const router = useRouter();

  // useEffect(() => {
  //   setIsClient(true);
  // }, []);

  // const toggleSidebar = () => {
  //   setIsSidebarOpen((prev) => !prev);
  // };

  const handleDeleteClick = (id: number) => {
    setSelectedId(id);
    // setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    // if (selectedId !== null) {
    //   setAdminAccounts((prev) =>
    //     prev.filter((account) => account.id !== selectedId)
    //   );
    //   setIsModalOpen(false);
    //   setTimeout(() => {
    //     setNotificationMessage("Admin deleted successfully.");
    //     setNotificationType("success");
    //     setIsNotificationOpen(true);
    //   }, 200);
    // }
  };

  const handleEditClick = (id: number) => {
    router.push(`/admin/admin_accounts/edit_account?id=${id}`);
  };

  // if (!isClient) return null;

  return (
    <div className={styles.page_container}>
      <Sidebar isSideBarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`${styles.main_content} ${
          // isSidebarOpen ? "" : styles.sidebar_collapsed
        }`}
      >
        <div className={styles.page_header}>
          <h1 className={styles.title}>Admin Accounts</h1>
        </div>
        <div className={styles.add_user_container}>
          <CustomButton
            label="Add User"
            href="/admin/admin_accounts/add_account"
            variant="primary"
          />
        </div>

        <AdminAccountsTable
          onDeleteClick={handleDeleteClick}
          onEditClick={handleEditClick}
        />
      </div>

      {/* Confirm Modal */}
      {/* {isClient && (
        <ConfirmModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Are you sure you want to delete account?"
          confirmText="Delete"
          confirmColor="#A80000"
          cancelText="Cancel"
          cancelColor="#CCCCCC"
        />
      )} */}

      {/* Notification Modal */}
      {/* {isClient && (
        <NotificationModal
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
          message={notificationMessage}
          type={notificationType}
        />
      )} */}
    </div>
  );
};

export default AdminAccountsPage;
