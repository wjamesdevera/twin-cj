import React from "react";
import styles from "./bookingTable.module.scss";

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
  return (
    <div className={styles.tableContainer}>
      <h2 className={styles.tableTitle}>Latest Bookings</h2>
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
          {bookings.map((booking: Booking, index: number) => (
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
                ₱{booking.total.toLocaleString()}
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
