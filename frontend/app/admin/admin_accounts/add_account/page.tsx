"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../../components/admin-sidebar";
import Form from "./form";
import styles from "./page.module.scss";

const AddAdminAccountPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className={styles.page_container}>
      <Sidebar isSideBarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`${styles.main_content} ${isSidebarOpen ? "" : styles.sidebar_collapsed}`}>
        <div className={styles.page_header}>
          <span className={styles.back_arrow} onClick={() => router.back()}>←</span>
          <h1 className={styles.title}>Add New Admin</h1>
        </div>
        <Form />
      </div>
    </div>
  );
};

export default AddAdminAccountPage;
