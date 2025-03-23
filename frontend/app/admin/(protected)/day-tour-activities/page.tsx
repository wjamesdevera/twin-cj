"use client";
import React, { useEffect, useState } from "react";
import styles from "./dashboard.module.scss";
import { useRouter } from "next/navigation";
import { Loading } from "@/app/components/loading";
import { options } from "@/app/api";
import DayTourTable from "./daytourtable";
import CustomButton from "@/app/components/custom_button";
import ConfirmModal from "@/app/components/confirm_modal";
import NotificationModal from "@/app/components/notification_modal";

interface DayTour {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  rate: string;
  additionalFeeType: string;
  additionalFeeDescription: string;
  additionalFeeAmount: string;
  createdAt: string;
  updatedAt: string;
}

const formatDate = (isoString?: string) => {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  return isNaN(date.getTime())
    ? "N/A"
    : date.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        minute: "2-digit",
        hour: "2-digit",
        second: "2-digit",
      });
};

const DayTourView = () => {
  const [dayTours, setDayTours] = useState<DayTour[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | number[] | null>(
    null
  );
  const [notification, setNotification] = useState({
    isOpen: false,
    message: "",
    type: "success",
  });
  const router = useRouter();

  useEffect(() => {
    const fetchDayTours = async () => {
      try {
        const response = await fetch(
          `${options.baseURL}/api/services/day-tours`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
            },
          }
        );

        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();

        if (Array.isArray(data?.data?.dayTours)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mappedDayTours = data.data.dayTours.map((tour: any) => {
            return {
              id: tour.id,
              name: tour.name || "Unnamed Tour",
              description: tour.description || "No description available",
              imageUrl: tour.imageUrl || "",
              rate: parseFloat(tour.price || 0).toFixed(2),
              additionalFeeType: tour.additionalFee?.type || "N/A",
              additionalFeeDescription:
                tour.additionalFee?.description || "N/A",
              additionalFeeAmount: parseFloat(
                tour.additionalFee?.amount || 0
              ).toFixed(2),
              createdAt: formatDate(tour.createdAt),
              updatedAt: formatDate(tour.updatedAt),
            };
          });

          setDayTours((prevTours) => {
            const isSameData =
              JSON.stringify(prevTours) === JSON.stringify(mappedDayTours);
            return isSameData ? prevTours : mappedDayTours;
          });
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDayTours();
  }, []);

  const handleAdd = () => {
    router.push("/admin/day-tour-activities/add");
  };

  const handleEdit = (id: number) => {
    router.push(`/admin/day-tour-activities/edit/${id}`);
  };

  const confirmDelete = async () => {
    try {
      if (Array.isArray(deleteTarget)) {
        await Promise.all(deleteTarget.map((id) => deleteDayTour(id)));
        setSelectedIds([]);
        setSelectAll(false);
      } else if (deleteTarget !== null) {
        await deleteDayTour(deleteTarget);
      }

      setNotification({
        isOpen: true,
        message: Array.isArray(deleteTarget)
          ? "Selected day tours deleted successfully!"
          : "Day tour deleted successfully!",
        type: "success",
      });
      setDayTours((prev) =>
        prev.filter((tour) =>
          Array.isArray(deleteTarget)
            ? !deleteTarget.includes(tour.id)
            : tour.id !== deleteTarget
        )
      );
    } catch (error) {
      console.log(error);
      setNotification({
        isOpen: true,
        message: "An error occurred while deleting the day tour.",
        type: "error",
      });
    } finally {
      setIsModalOpen(false);
    }
  };

  const deleteDayTour = async (id: number) => {
    const response = await fetch(
      `${options.baseURL}/api/services/day-tours/${id}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok)
      throw new Error(`Failed to delete day tour with id: ${id}`);
  };

  const handleDelete = (id?: number) => {
    setDeleteTarget(id ? id : selectedIds);
    setIsModalOpen(true);
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedIds(selectAll ? [] : dayTours.map((tour) => tour.id));
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  if (loading) return <Loading />;

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.page_container}>
      <div className={styles.page_header}>
        <h1 className={styles.title}>Day Tour Activities</h1>
      </div>
      <div className={styles.subheader_container}>
        <h2 className={styles.subheader}>
          Select a Day Tour Activity to modify in the Booking Page
        </h2>
        <div className={styles.button_container}>
          <CustomButton
            label="Add Day Tour"
            onClick={handleAdd}
            variant="primary"
          />

          <CustomButton
            label="Delete Selected"
            onClick={() => handleDelete()}
            variant="danger"
            disabled={selectedIds.length === 0}
          />
        </div>
      </div>

      <DayTourTable
        dayTours={dayTours}
        selectedIds={selectedIds}
        handleSelectAll={handleSelectAll}
        handleCheckboxChange={handleCheckboxChange}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        selectAll={selectAll}
      />

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Are you sure you want to delete the selected day tour(s)?"
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

export default DayTourView;
