"use client";

import { useRouter } from "next/navigation";
import Form from "./form";
import styles from "./page.module.scss";

const EditAdminAccountPage = () => {
  const router = useRouter();

  return (
    <div className={styles.page_container}>
      <div className={`${styles.main_content}`}>
        <div className={styles.page_header}>
          <span className={styles.back_arrow} onClick={() => router.back()}>
            ←
          </span>
          <h1 className={styles.title}>Edit Admin Details</h1>
        </div>
        <Form />
      </div>
    </div>
  );
};

export default EditAdminAccountPage;
