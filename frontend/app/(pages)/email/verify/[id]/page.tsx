"use client";
import { Loading } from "@/app/components/loading";
import { verifyEmail } from "@/app/lib/api";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import useSWR from "swr";
import styles from "./page.module.scss";
import Button from "@/app/components/button";

interface ResultBannerProps {
  isSuccess: boolean;
}

const ResultBanner: React.FC<ResultBannerProps> = ({ isSuccess }) => {
  return (
    <div className={isSuccess ? styles.successBanner : styles.failedBanner}>
      {isSuccess ? "Your email has been verified" : "Email verification failed"}
    </div>
  );
};

const Page = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [isSuccess, setIsSuccess] = useState(false);
  const { isLoading } = useSWR(id, verifyEmail, {
    onSuccess: () => {
      setIsSuccess(true);
    },
  });
  return (
    <div className={styles.main}>
      {isLoading ? (
        <Loading />
      ) : (
        <div className={styles.messageContainer}>
          <div className={styles.messageWrapper}>
            <ResultBanner isSuccess={isSuccess} />
            <Button onClick={() => router.replace("/admin/login")}>
              Proceed to Login
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
