"use client";

import { useEffect } from "react";
import styles from "./notification_modal.module.scss";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  type: "success" | "error";
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  message,
  type,
}) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={`${styles.modal} ${type === "success" ? styles.success : styles.error}`}>
      <p>{message}</p>
    </div>
  );
};

export default NotificationModal;
