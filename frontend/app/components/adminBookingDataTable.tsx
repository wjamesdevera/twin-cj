import React, { useState, useRef } from "react";
import { DownloadTableExcel } from "react-export-table-to-excel";
import styles from "./adminBookingDataTable.module.scss";
import "@fortawesome/fontawesome-free/css/all.min.css";

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
  const tableRef = useRef<HTMLTableElement | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    searchTerm: "",
    statusFilter: "all",
    // serviceFilter: "all",
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 10);
  };

  // Filter the bookings based on the filters
  const filteredBookings = bookings.filter((booking) => {
    const searchLower = filters.searchTerm.toLowerCase();

    const matchesSearchTerm =
      booking.referenceNo.toLowerCase().includes(searchLower) ||
      booking.customerName.toLowerCase().includes(searchLower) ||
      booking.email.toLowerCase().includes(searchLower) ||
      booking.service.toLowerCase().includes(searchLower);

    const matchesStatus =
      filters.statusFilter === "all" ||
      booking.status.toLowerCase() === filters.statusFilter.toLowerCase();

    // const matchesService =
    //   filters.serviceFilter === "all" ||
    //   booking.service.toLowerCase() === filters.serviceFilter.toLowerCase();

    const bookingDate = new Date(booking.checkIn).toISOString().split("T")[0];

    const matchesDate =
      (!filters.startDateFilter || bookingDate >= filters.startDateFilter) &&
      (!filters.endDateFilter || bookingDate <= filters.endDateFilter);

    return matchesSearchTerm && matchesStatus && matchesDate;
  });

  return (
    <div className={styles.tableContainer}>
      <div className={styles.table_wrapper}>
        <div className={styles.headerContainer}>
          <h2 className={styles.tableTitle}>Bookings & Transactions</h2>
          <DownloadTableExcel
            filename="Twin CJ Booking Details"
            sheet="bookings"
            currentTableRef={tableRef.current}
          >
            <button className={styles.exportButton}>
              <i className="fas fa-download"></i> Export
            </button>
          </DownloadTableExcel>
        </div>

        <div className={styles.topContainer}>
          {/* Search Bar */}
          <div className={styles.searchContainer}>
            <div className={styles.leftGroup}>
              <label className={styles.searchLabel}>Search</label>
              <input
                type="text"
                name="searchTerm"
                placeholder="Search by Reference No., Name, Email, or Service"
                className={styles.searchInput}
                value={filters.searchTerm}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          <div className={styles.rightGroup}>
            {/* Date Filter */}
            <div className={styles.filterForm}>
              <label htmlFor="startDateFilter" className={styles.filterLabel}>
                Start Date:
              </label>
              <input
                type="date"
                id="startDateFilter"
                name="startDateFilter"
                value={filters.startDateFilter}
                onChange={handleFilterChange}
                className={styles.filterSelect}
              />
            </div>

            <div className={styles.filterForm}>
              <label htmlFor="endDateFilter" className={styles.filterLabel}>
                End Date:
              </label>
              <input
                type="date"
                id="endDateFilter"
                name="endDateFilter"
                value={filters.endDateFilter}
                onChange={handleFilterChange}
                className={styles.filterSelect}
              />
            </div>

            <div className={styles.filterForm}>
              <label htmlFor="statusFilter" className={styles.filterLabel}>
                Filter by Status:
              </label>
              <select
                id="statusFilter"
                name="statusFilter"
                value={filters.statusFilter}
                onChange={handleFilterChange}
                className={styles.filterSelect}
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="approved">Approved</option>
                <option value="reupload">Reupload</option>
                <option value="cancel">Cancel</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Service Filter
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
            </div> */}
          </div>
        </div>

        <table ref={tableRef} className={styles.table}>
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
                      : booking.status === "approved"
                      ? styles.statusApproved
                      : booking.status === "reupload"
                      ? styles.statusReupload
                      : booking.status === "cancel"
                      ? styles.statusCancel
                      : booking.status === "completed"
                      ? styles.statusCompleted
                      : ""
                  }`}
                >
                  {booking.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingTable;
