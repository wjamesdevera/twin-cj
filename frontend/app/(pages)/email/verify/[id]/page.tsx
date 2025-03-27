"use client";
import { Loading } from "@/app/components/loading";
import { verifyEmail } from "@/app/lib/api";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import twinCJLogo from "@/public/assets/twin-cj-logo.png";
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
      {isSuccess
        ? "Your email has been verified"
        : "Either verification link has been used or verification link has expired"}
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
          <div className={styles.verificationTitle}>
            <Image
              src={twinCJLogo}
              alt="Twin CJ Logo"
              className={styles["login-logo"]}
              objectFit="contain"
            />
            {isSuccess ? (
              <p className={styles.messageText}>
                Please use the link below to be able to login to your account.
              </p>
            ) : (
              <p className={styles.messageText}>
                Please check the verification link or try again. <br />
                It may have been used or the verification link has expired.
              </p>
            )}
          </div>
          <ResultBanner isSuccess={isSuccess} />
          <div className={styles.messageWrapper}>
            <Button
              className={styles.messageButton}
              onClick={() => router.replace("/admin/login")}
            >
              Proceed to Login
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
