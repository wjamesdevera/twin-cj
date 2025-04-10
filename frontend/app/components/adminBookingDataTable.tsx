import React, { useState, useRef } from "react";
import { DownloadTableExcel } from "react-export-table-to-excel";
import styles from "./adminBookingDataTable.module.scss";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Link from "next/link";
import { options } from "../api";
import { mutate } from "swr";
import ConfirmModal from "@/app/components/confirm_modal";
import NotificationModal from "@/app/components/notification_modal";

type ServiceCategory = {
  id: number;
  categoryId: number;
};

type Service = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  serviceCategoryId: number;
  serviceCategory: ServiceCategory;
};

type BookingService = {
  service: Service;
};

type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
};

type Transaction = {
  id: string;
  proofOfPaymentImageUrl: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
};

type BookingResponse = {
  id: number;
  referenceCode: string;
  checkIn: string;
  checkOut: string;
  totalPax: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  services: BookingService[];
  customer: Customer;
  bookingStatus: string;
  transaction: Transaction;
};

interface BookingTableProps {
  bookings: BookingResponse[] | undefined;
}

const BookingTable: React.FC<BookingTableProps> = ({ bookings }) => {
  const tableRef = useRef<HTMLTableElement | null>(null);
  const [filters, setFilters] = useState({
    searchTerm: "",
    statusFilter: "all",
    serviceFilter: "all",
    startDateFilter: "",
    endDateFilter: "",
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<BookingResponse | null>(
    null
  );
  const [newStatus, setNewStatus] = useState<string>("");

  // Message state for cancellation/rescheduled booking
  const [userMessage, setUserMessage] = useState<string>("");

  // Notification State
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState<"success" | "error">(
    "success"
  );

  // Handle
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserMessage(e.target.value);
  };

  // Open Modal
  const openModalForStatusUpdate = (
    booking: BookingResponse,
    status: string
  ) => {
    setCurrentBooking(booking);
    setNewStatus(status);
    setIsModalOpen(true);
  };

  const getModalMessage = (status: string) => {
    if (status === "Cancelled" || status === "Rescheduled") {
      return (
        <>
          <label className={styles.messageLabel}>
            Are you sure you want to update the status of this booking to "
            {status}"? <br />
          </label>
          <textarea
            id="userMessage"
            name="userMessage"
            value={userMessage}
            onChange={handleMessageChange}
            className={styles.messageTextarea}
            placeholder="State your reason for cancellation/rescheduling here"
          />
        </>
      );
    }
    return `Are you sure you want to update the status of this booking to "${status}"?`;
  };

  const handleEditStatus = async (userMessage: string) => {
    if (!currentBooking) return;

    try {
      const response = await fetch(
        `${options.baseURL}/api/bookings/status/${currentBooking.referenceCode}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookingStatus: newStatus,
            message: userMessage.trim() ? userMessage : null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update booking status");
      }

      mutate(
        `${options.baseURL}/api/bookings/status/${currentBooking.referenceCode}`
      );

      // Show success notification
      setNotificationMessage("Booking status updated successfully.");
      setNotificationType("success");
      setIsNotificationOpen(true);

      setIsModalOpen(false);
      setUserMessage("");
    } catch (error) {
      console.error("Error updating booking status:", error);

      // Show error notification
      setNotificationMessage(
        "Failed to update booking status. Please try again."
      );
      setNotificationType("error");
      setIsNotificationOpen(true);
    }
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
    setUserMessage("");
  };

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
  const filteredBookings = bookings?.filter((booking) => {
    const searchLower = filters.searchTerm.toLowerCase();

    const matchesSearchTerm =
      booking.referenceCode.toLowerCase().includes(searchLower) ||
      booking.customer.firstName.toLowerCase().includes(searchLower) ||
      booking.customer.email.toLowerCase().includes(searchLower);

    const matchesStatus =
      filters.statusFilter === "all" ||
      booking.bookingStatus.toLowerCase() ===
        filters.statusFilter.toLowerCase();

    const matchesService =
      filters.serviceFilter === "all" ||
      booking.bookingStatus.toLowerCase() ===
        filters.serviceFilter.toLowerCase();

    return matchesSearchTerm && matchesStatus && matchesService;
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
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="rescheduled">Rescheduled</option>
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
              <th>Down Payment</th>
              <th>Customer Name</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings?.map(
              (booking: BookingResponse, index: number) => (
                <tr key={index} className={styles.tableRow}>
                  <td className={styles.tableCell}>
                    <Link
                      href={`/admin/bookings/edit/${booking.referenceCode}`}
                      className={styles.referenceLink}
                    >
                      {booking.referenceCode}
                    </Link>
                  </td>
                  <td className={styles.tableCell}>
                    {booking.services.map((service) => service.service.name)[0]}
                  </td>
                  <td className={styles.tableCell}>
                    {formatDate(booking.checkIn)}
                  </td>
                  <td className={styles.tableCell}>
                    {formatDate(booking.checkOut)}
                  </td>
                  <td className={styles.tableCell}>
                    ₱
                    {booking.transaction.amount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td
                    className={styles.tableCell}
                  >{`${booking.customer.firstName} ${booking.customer.lastName}`}</td>
                  <td className={styles.tableCell}>{booking.customer.email}</td>
                  <td
                    className={`${styles.tableCell} ${
                      booking.bookingStatus === "Pending"
                        ? styles.statusPending
                        : booking.bookingStatus === "Cancelled"
                        ? styles.statusCancel
                        : booking.bookingStatus === "Approved"
                        ? styles.statusApproved
                        : ""
                    }`}
                  >
                    {/* NOTE: This is needed for the conversion of booking status to excel */}
                    <span className={styles.hiddenStatus}>
                      {booking.bookingStatus}
                    </span>
                    <select
                      defaultValue={booking.bookingStatus}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        const selectedStatus = e.target.value;
                        openModalForStatusUpdate(booking, selectedStatus);
                      }}
                    >
                      <option value={booking.bookingStatus} disabled>
                        {booking.bookingStatus}
                      </option>
                      <option value="Approved">Approved</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Rescheduled">Rescheduled</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <ConfirmModal
          isOpen={isModalOpen}
          onClose={handleCancelModal}
          onConfirm={() => handleEditStatus(userMessage || "")}
          title="Confirm Status Update"
          confirmText="Update"
          cancelText="Cancel"
        >
          {getModalMessage(newStatus)}
        </ConfirmModal>
      )}

      {/* Notification Modal */}
      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        message={notificationMessage}
        type={notificationType}
      />
    </div>
  );
};

export default BookingTable;
