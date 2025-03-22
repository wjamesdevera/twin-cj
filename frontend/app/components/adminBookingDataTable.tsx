import React, { useState } from "react";
import styles from "./adminBookingDataTable.module.scss";

interface Booking {
  referenceNo: string;
  service: string;
  checkIn: string;
  checkOut: string;
  total: number;
  customerName: string;
  email: string;
  status: string;
}

interface BookingTableProps {
  bookings: Booking[];
}

const BookingTable: React.FC<BookingTableProps> = ({ bookings }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    searchTerm: "",
    statusFilter: "all",
    serviceFilter: "all",
    startDateFilter: "",
    endDateFilter: "",
  });

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Filter the bookings based on the filters
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearchTerm =
      booking.referenceNo
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase()) ||
      booking.customerName
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(filters.searchTerm.toLowerCase());

    const matchesStatus =
      filters.statusFilter === "all" ||
      booking.status.toLowerCase() === filters.statusFilter.toLowerCase();

    const matchesService =
      filters.serviceFilter === "all" ||
      booking.service.toLowerCase() === filters.serviceFilter.toLowerCase();

    return matchesSearchTerm && matchesStatus && matchesService;
  });

  return (
    <div className={styles.tableContainer}>
      <h2 className={styles.tableTitle}>Bookings & Transactions</h2>

      <div className={styles.topContainer}>
        {/* Search Bar */}
        <div className={styles.searchContainer}>
          <div className={styles.leftGroup}>
            <input
              type="text"
              name="searchTerm"
              placeholder="Search by Reference No., Customer Name, or Email"
              className={styles.searchInput}
              value={filters.searchTerm}
              onChange={handleFilterChange}
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className={styles.rightGroup}>
          <div className={styles.filterForm}>
            <label htmlFor="statusFilter" className={styles.filterLabel}>
              Filter by Status:
            </label>
            <select
              id="statusFilter"
              value={filters.statusFilter}
              onChange={handleFilterChange}
              className={styles.filterSelect}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Service Filter */}
          <div className={styles.filterForm}>
            <label htmlFor="serviceFilter" className={styles.filterLabel}>
              Filter by Service:
            </label>
            <select
              id="serviceFilter"
              name="serviceFilter"
              value={filters.serviceFilter}
              onChange={handleFilterChange}
              className={styles.filterSelect}
            >
              <option value="all">All</option>
              <option value="day tour">Day Tour</option>
              <option value="cabin">Cabin</option>
            </select>
          </div>
        </div>
      </div>

      <table className={styles.table}>
        <thead className={styles.tableHead}>
          <tr>
            <th>Reference No.</th>
            <th>Service</th>
            <th>Check-In</th>
            <th>Check-Out</th>
            <th>Total</th>
            <th>Customer Name</th>
            <th>Email</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings.map((booking: Booking, index: number) => (
            <tr key={index} className={styles.tableRow}>
              <td className={styles.tableCell}>
                <a
                  href={`/booking/${booking.referenceNo}`}
                  className={styles.referenceLink}
                >
                  {booking.referenceNo}
                </a>
              </td>
              <td className={styles.tableCell}>{booking.service}</td>
              <td className={styles.tableCell}>{booking.checkIn}</td>
              <td className={styles.tableCell}>{booking.checkOut}</td>
              <td className={styles.tableCell}>
                ₱
                {booking.total.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td className={styles.tableCell}>{booking.customerName}</td>
              <td className={styles.tableCell}>{booking.email}</td>
              <td
                className={`${styles.tableCell} ${
                  booking.status === "pending"
                    ? styles.statusPending
                    : booking.status === "active"
                    ? styles.statusActive
                    : styles.statusCompleted
                }`}
              >
                {booking.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;
