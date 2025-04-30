"use client";

import { useParams, useRouter } from "next/navigation";
import Form from "./form";
import styles from "./page.module.scss";
import useSWR from "swr";
import { getUserById } from "@/app/lib/api";
import { Loading } from "@/app/components/loading";

const EditAdminAccountPage = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data: userData, isLoading } = useSWR(id, getUserById);

  return isLoading ? (
    <Loading />
  ) : (
    <div className={styles.page_container}>
      <div className={`${styles.main_content}`}>
        <div className={styles.page_header}>
          <span className={styles.back_arrow} onClick={() => router.back()}>
            ←
          </span>
          <h1 className={styles.title}>Edit Admin Details</h1>
        </div>
        <Form
          id={id}
          firstName={userData ? userData.data.user.firstName : ""}
          lastName={userData ? userData.data.user.lastName : ""}
          phoneNumber={userData ? userData.data.user.phoneNumber : ""}
          email={userData ? userData.data.user.email : ""}
        />
      </div>
    </div>
  );
};

export default EditAdminAccountPage;
