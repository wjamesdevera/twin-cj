"use client";

import { useRouter, useParams } from "next/navigation";
import useSWR from "swr";
import { getCabin } from "@/app/lib/api";
import CabinForm from "./form";
import { Loading } from "@/app/components/loading";
import { IoArrowBack } from "react-icons/io5";
import styles from "./page.module.scss";

export default function UpdateCabin() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useSWR(id, getCabin, {
    onSuccess: () => {
      console.log(data);
    },
  });

  return isLoading ? (
    <Loading />
  ) : (
    <div className={styles.page_container}>
      <div className={styles.page_header}>
        <div className={styles.back_arrow} onClick={() => router.back()}>
          <IoArrowBack />
        </div>
        <h1 className={styles.title}>Edit Cabin</h1>
      </div>
      <CabinForm defaultValues={data ? data.data.cabin : null} id={id} />
    </div>
  );
}
