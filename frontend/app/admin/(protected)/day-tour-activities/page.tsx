"use client";
import React, { useEffect, useState } from "react";
import styles from "./dashboard.module.scss";
import { useRouter } from "next/navigation";
import { Loading } from "@/app/components/loading";
import { options } from "@/app/api";
import Image from "next/image";

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
      });
};

const DayTourView = () => {
  const [dayTours, setDayTours] = useState<DayTour[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectAll, setSelectAll] = useState<boolean>(false);
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
    router.push("/admin/day-tour-activities/create");
  };

  const handleEdit = (id: number) => {
    router.push(`/admin/day-tour-activities/edit/${id}`);
  };

  const handleDelete = async (id?: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete the selected day tour/s?"
    );
    if (!confirmed) {
      return;
    }

    try {
      if (id) {
        // Single delete
        const response = await fetch(
          `${options.baseURL}/api/services/day-tours/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Failed to delete day tour with id: ${id}`);
        }
        setDayTours((prevTours) => prevTours.filter((tour) => tour.id !== id));
      } else {
        // Multiple delete
        await Promise.all(
          selectedIds.map(async (id) => {
            const response = await fetch(
              `${options.baseURL}/api/services/day-tours/${id}`,
              {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            if (!response.ok) {
              throw new Error(`Failed to delete day tour with id: ${id}`);
            }
          })
        );

        setDayTours((prevTours) =>
          prevTours.filter((tour) => !selectedIds.includes(tour.id))
        );
        setSelectedIds([]);
        alert("Selected day tours deleted successfully!");
      }
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(dayTours.map((tour) => tour.id));
    }
    setSelectAll(!selectAll);
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedIds((prevSelectedIds) =>
      prevSelectedIds.includes(id)
        ? prevSelectedIds.filter((selectedId) => selectedId !== id)
        : [...prevSelectedIds, id]
    );
  };

  if (loading) return <Loading />;

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Day Tours</h1>
      <button className="add" onClick={handleAdd}>
        Add Day Tour
      </button>
      <button
        className="delete"
        onClick={() => handleDelete()}
        disabled={!selectedIds.length}
      >
        Delete Selected
      </button>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </th>
            <th>Actions</th>
            <th>ID</th>
            <th>Name</th>
            <th>Image</th>
            <th>Description</th>
            <th>Rate</th>
            <th>Type (Additional)</th>
            <th>Description (Additional)</th>
            <th>Amount (Additional)</th>
            <th>Date Created</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {dayTours.map((dayTour) => (
            <tr key={dayTour.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(dayTour.id)}
                  onChange={() => handleCheckboxChange(dayTour.id)}
                />
              </td>
              <td className={styles.actions}>
                <button className="edit" onClick={() => handleEdit(dayTour.id)}>
                  Edit
                </button>
                <button
                  className="delete"
                  onClick={() => handleDelete(dayTour.id)}
                >
                  Delete
                </button>
              </td>
              <td>{dayTour.id}</td>
              <td>{dayTour.name}</td>
              <td>
                {dayTour.imageUrl ? (
                  <Image
                    src={
                      dayTour.imageUrl.startsWith("http")
                        ? dayTour.imageUrl
                        : `${options.baseURL}/uploads/${dayTour.imageUrl}`
                    }
                    alt={dayTour.name}
                    width="100"
                    height="100"
                  />
                ) : (
                  "No image available"
                )}
              </td>
              <td>{dayTour.description}</td>
              <td>₱{dayTour.rate}</td>
              <td>{dayTour.additionalFeeType}</td>
              <td>{dayTour.additionalFeeDescription}</td>
              <td>₱{dayTour.additionalFeeAmount}</td>
              <td>{formatDate(dayTour.createdAt)}</td>
              <td>{formatDate(dayTour.updatedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DayTourView;
