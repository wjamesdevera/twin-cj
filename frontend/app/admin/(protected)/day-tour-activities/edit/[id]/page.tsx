"use client";

import React from "react";

import { useRouter, useParams } from "next/navigation";
import { Loading } from "@/app/components/loading";
import styles from "./page.module.scss";
import EditDayTour from "./form";
import { IoArrowBack } from "react-icons/io5";
import useSWR from "swr";
import { getDayTour } from "@/app/lib/api";

export default function EditDayTourPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const { data: dayTourData, isLoading } = useSWR(id, getDayTour);

  return isLoading ? (
    <Loading />
  ) : (
    <div className={styles.page_container}>
      <div className={styles.page_header}>
        <div className={styles.back_arrow} onClick={() => router.back()}>
          <IoArrowBack />
        </div>
        <h1 className={styles.title}>Edit Day Tour Activity</h1>
      </div>
      <EditDayTour
        id={id}
        defaultValues={dayTourData ? dayTourData.data.dayTour : null}
      />
    </div>
  );
}
