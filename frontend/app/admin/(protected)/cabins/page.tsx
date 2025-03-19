"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import { deleteCabin, getCabins, multiDeleteCabin } from "@/app/lib/api";
import { Loading } from "@/app/components/loading";
import useSWRMutation from "swr/mutation";
import CabinTable from "./CabinTable"; 
import CustomButton from "@/app/components/custom_button"; 
import styles from "./page.module.scss"; 

const CabinDashboard = () => {
  const router = useRouter();
  const [selectedCabins, setSelectedCabins] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const { data, isLoading } = useSWR("getCabins", getCabins);
  const cabins = data?.data?.cabins || [];

  const toggleSelection = (id: number) => {
    setSelectedCabins((prev) =>
      prev.includes(id) ? prev.filter((cabinId) => cabinId !== id) : [...prev, id]
    );
  };

  const { trigger, isMutating } = useSWRMutation("deleteCabin", (key, { arg }: { arg: number }) => deleteCabin(arg));

  const handleDeleteCabin = async (id: number) => {
    const confirmed = window.confirm("Are you sure you want to delete the selected cabin/s?");
    if (!confirmed) return;
    await trigger(id);
    mutate("getCabins", true);
    alert("Cabin deleted successfully!");
  };

  const deleteSelectedCabins = async () => {
    if (selectedCabins.length === 0) {
      alert("No cabins selected.");
      return;
    }

    const confirmed = window.confirm("Are you sure you want to delete the selected cabin/s?");
    if (!confirmed) return;

    await multiDeleteCabin(selectedCabins.join(","));
    setSelectedCabins([]);
    setSelectAll(false);
    mutate("getCabins", true);
    alert("Selected cabin/s deleted successfully!");
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedCabins([]);
    } else {
      setSelectedCabins(cabins.map((cabin: { id: number }) => cabin.id));
    }
    setSelectAll(!selectAll);
  };

  return isLoading ? (
    <Loading />
  ) : (
    <div className={styles.page_container}>
      {/* Header Section */}
      <div className={styles.page_header}>
        <h1 className={styles.title}>Cabins</h1>
        <div className={styles.view_page_container}>
          <span className={styles.view_page_link} onClick={() => router.push("/admin/cabins/view")}>
            View Page
          </span>
        </div>
      </div>

     {/* Subheader Section */}
      <div className={styles.subheader_container}>
        <h2 className={styles.subheader}>Select a Cabin to modify in the Booking Page</h2>
        <div className={styles.button_container}>
          <CustomButton 
            label="Add Cabin"
            onClick={() => router.push("/admin/cabins/create")}
            variant="primary"
          />
          <CustomButton 
            label="Delete Selected"
            onClick={deleteSelectedCabins}
            variant="danger"
            disabled={selectedCabins.length === 0}
          />
        </div>
      </div>

      {/* Cabin Table */}
      <CabinTable
        cabins={cabins}
        selectedCabins={selectedCabins}
        toggleSelection={toggleSelection}
        toggleSelectAll={toggleSelectAll}
        selectAll={selectAll}
        handleDeleteCabin={handleDeleteCabin}
      />
    </div>
  );
};

export default CabinDashboard;
