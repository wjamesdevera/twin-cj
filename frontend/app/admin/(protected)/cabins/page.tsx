"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import { deleteCabin, getCabins, multiDeleteCabin } from "@/app/lib/api";
import { Loading } from "@/app/components/loading";
import useSWRMutation from "swr/mutation";
import CabinTable from "./CabinTable"; 
import CustomButton from "@/app/components/custom_button"; 
import ConfirmModal from "@/app/components/confirm_modal";
import NotificationModal from "@/app/components/notification_modal";
import styles from "./page.module.scss"; 

const CabinDashboard = () => {
  const router = useRouter();
  const [selectedCabins, setSelectedCabins] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | number[] | null>(null);
  const [notification, setNotification] = useState({ isOpen: false, message: "", type: "success" });

  const { data, isLoading } = useSWR("getCabins", getCabins);
  const cabins = data?.data?.cabins || [];

  const toggleSelection = (id: number) => {
    setSelectedCabins((prev) =>
      prev.includes(id) ? prev.filter((cabinId) => cabinId !== id) : [...prev, id]
    );
  };

  const { trigger, isMutating } = useSWRMutation("deleteCabin", (key, { arg }: { arg: number }) => deleteCabin(arg));

  const handleDeleteCabin = (id: number) => {
    setDeleteTarget(id);
    setIsModalOpen(true);
  };

  const deleteSelectedCabins = () => {
    if (selectedCabins.length === 0) {
      setNotification({ isOpen: true, message: "No cabins selected.", type: "error" });
      return;
    }
    setDeleteTarget(selectedCabins);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (Array.isArray(deleteTarget)) {
        await multiDeleteCabin(deleteTarget.join(","));
        setSelectedCabins([]);
        setSelectAll(false);
      } else if (deleteTarget !== null) {
        await trigger(deleteTarget);
      }

      mutate("getCabins", true);
      setIsModalOpen(false);
      setNotification({
        isOpen: true,
        message: Array.isArray(deleteTarget)
          ? "Selected cabins deleted successfully!"
          : "Cabin deleted successfully!",
        type: "success",
      });
    } catch (error) {
      setNotification({
        isOpen: true,
        message: "An error occurred while deleting the cabin.",
        type: "error",
      });
    }
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
      <div className={styles.page_header}>
        <h1 className={styles.title}>Cabins</h1>
      </div>

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

      <CabinTable
        cabins={cabins}
        selectedCabins={selectedCabins}
        toggleSelection={toggleSelection}
        toggleSelectAll={toggleSelectAll}
        selectAll={selectAll}
        handleDeleteCabin={handleDeleteCabin}
      />

    <ConfirmModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onConfirm={confirmDelete}
      title="Are you sure you want to delete the selected cabin(s)?"
      confirmText="Yes, Delete"
      cancelText="Cancel"
    />

       <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification({ ...notification, isOpen: false })}
        message={notification.message}
        type={notification.type as "success" | "error"}
      />
    </div>
  );
};

export default CabinDashboard;
