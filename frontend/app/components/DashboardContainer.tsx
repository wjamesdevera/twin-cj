import React from "react";
import styles from "./dashboardContainer.module.scss";
import { FaClock, FaCheckCircle } from "react-icons/fa";

interface DashboardContainerProps {
  pendingReservations: number;
  activeReservations: number;
}

const DashboardContainer: React.FC<DashboardContainerProps> = ({
  pendingReservations,
  activeReservations,
}) => {
  return (
    <div className={styles.dashboardContainer}>
      <div className={`${styles.card} ${styles.pendingCard}`}>
        <p className={styles.text}>Pending Reservations</p>
        <h1 className={styles.number}>{pendingReservations}</h1>
        <FaClock className={styles.icon} />
      </div>

      <div className={`${styles.card} ${styles.activeCard}`}>
        <p className={styles.text}>Completed Reservations</p>
        <h1 className={styles.number}>{activeReservations}</h1>
        <FaCheckCircle className={styles.icon} />
      </div>
    </div>
  );
};

export default DashboardContainer;
