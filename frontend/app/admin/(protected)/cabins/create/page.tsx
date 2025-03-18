"use client";

import { useRouter } from "next/navigation";
import useSWRMutation from "swr/mutation";
import { createCabin } from "@/app/lib/api";
import CabinForm from "./form";
import { IoArrowBack } from "react-icons/io5"; 
import styles from "./page.module.scss";

export default function CreateCabin() {
  const router = useRouter();

  const { trigger, isMutating } = useSWRMutation(
    "create cabin",
    (key, { arg }: { arg: FormData }) => createCabin(arg),
    {
      onSuccess: () => {
        router.push("/admin/cabins");
      },
    }
  );

  return (
    <div className={styles.page_container}>
      <div className={styles.page_header}>
        <div className={styles.back_arrow} onClick={() => router.back()}>
          <IoArrowBack /> 
        </div>
        <h1 className={styles.title}>Add New Cabin</h1>
      </div>
      <CabinForm trigger={trigger} isMutating={isMutating} />
    </div>
  );
}
