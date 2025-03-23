"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash } from "react-icons/fa";
import styles from "./cabins_table.module.scss";

interface Service {
  id: number;
}
interface Cabin {
  id: number;
  minCapacity: number;
  maxCapacity: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  service: Service;
  createdAt?: string;
  updatedAt?: string;
}

interface Props {
  cabins: Cabin[];
  selectedCabins: number[];
  toggleSelection: (id: number) => void;
  toggleSelectAll: () => void;
  selectAll: boolean;
  handleDeleteCabin: (id: number) => void;
}

const ITEMS_PER_PAGE = 5;

const formatPrice = (price: number) => {
  return price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatDate = (isoString?: string) => {
  if (!isoString) return "N/A";
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

const CabinTable = ({
  cabins,
  selectedCabins,
  toggleSelection,
  toggleSelectAll,
  selectAll,
  handleDeleteCabin,
}: Props) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(cabins.length / ITEMS_PER_PAGE);

  const paginatedCabins = cabins.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
                  onChange={toggleSelectAll}
                />
              </th>
              <th>Action</th>
              <th>ID</th>
              <th>Name</th>
              <th>Image</th>
              <th>Description</th>
              <th>Rate</th>
              <th>Min Capacity</th>
              <th>Max Capacity</th>
              <th>Date Created</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCabins.length > 0 ? (
              paginatedCabins.map((cabin: Cabin) => (
                <tr key={cabin.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedCabins.includes(cabin.id)}
                      onChange={() => toggleSelection(cabin.id)}
                    />
                  </td>
                  <td className={styles.actions}>
                    <button
                      className={styles.edit_button}
                      onClick={() =>
                        router.push(`/admin/cabins/edit/${cabin.id}`)
                      }
                    >
                      <FaEdit />
                    </button>
                    <button
                      className={styles.delete_button}
                      onClick={() => handleDeleteCabin(cabin.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                  <td>{cabin.id}</td>
                  <td>{cabin.name}</td>
                  <td>
                    <img
                      src={cabin.imageUrl}
                      alt={cabin.name}
                      width={135}
                      height={90}
                      className={styles.image}
                    />
                  </td>
                  <td>{cabin.description}</td>
                  <td>₱{formatPrice(cabin.price)}</td>
                  <td>{cabin.minCapacity}</td>
                  <td>{cabin.maxCapacity}</td>
                  <td>{formatDate(cabin.createdAt)}</td>
                  <td>{formatDate(cabin.updatedAt)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={14} className={styles.no_data}>
                  No cabins available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
    </div>
  );
};

export default CabinTable;
