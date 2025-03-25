"use client";

import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { options } from "@/app/api";
import styles from "@/app/table.module.scss";
import { FaEdit, FaTrash } from "react-icons/fa";

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

interface DayTourTableProps {
  dayTours: DayTour[];
  selectedIds: number[];
  handleSelectAll: () => void;
  handleCheckboxChange: (id: number) => void;
  handleEdit: (id: number) => void;
  handleDelete: (id?: number) => void;
  selectAll: boolean;
}

const ITEMS_PER_PAGE = 5;

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

const DayTourTable: React.FC<DayTourTableProps> = ({
  dayTours,
  selectedIds,
  handleSelectAll,
  handleCheckboxChange,
  handleEdit,
  handleDelete,
  selectAll,
}) => {
  // const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(dayTours.length / ITEMS_PER_PAGE);

  const sortedDayTours = [...dayTours].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const paginatedDayTours = sortedDayTours.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [dayTours.length, totalPages, currentPage]);

  return (
    <div className={styles.table_container}>
      <div className={styles.table_wrapper}>
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
              <th>Date Created</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {paginatedDayTours.length > 0 ? (
              paginatedDayTours.map((dayTour) => (
                <tr key={dayTour.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(dayTour.id)}
                      onChange={() => handleCheckboxChange(dayTour.id)}
                    />
                  </td>
                  <td className={styles.actions}>
                    <button
                      className={styles.edit_button}
                      onClick={() => handleEdit(dayTour.id)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className={styles.delete_button}
                      onClick={() => handleDelete(dayTour.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                  <td>{dayTour.id}</td>
                  <td>{dayTour.name}</td>
                  <td>
                    {dayTour.imageUrl ? (
                      <Image
                        className={styles.image}
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
                  <td>
                    ₱
                    {Number(
                      parseFloat(dayTour.rate).toFixed(2)
                    ).toLocaleString()}
                  </td>
                  <td>{dayTour.additionalFeeType}</td>
                  <td>{dayTour.additionalFeeDescription}</td>
                  <td>
                    ₱
                    {Number(
                      parseFloat(dayTour.additionalFeeAmount).toFixed(2)
                    ).toLocaleString()}
                  </td>
                  <td>{formatDate(dayTour.createdAt)}</td>
                  <td>{formatDate(dayTour.updatedAt)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={14} className={styles.no_data}>
                  No day tour activities available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {dayTours.length > 0 && (
        <div className={styles.pagination}>
          <button
            className={styles.page_button}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          <span className={styles.page_info}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className={styles.page_button}
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DayTourTable;
