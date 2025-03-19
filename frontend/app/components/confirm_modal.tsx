"use client";

import styles from "./confirm_modal.module.scss";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  confirmText: string;
  confirmColor: string;
  cancelText: string;
  cancelColor: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  confirmText,
  confirmColor,
  cancelText,
  cancelColor,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{title}</h2>
        <div className={styles.button_container}>
          <button className={styles.confirm_btn} style={{ backgroundColor: confirmColor }} onClick={onConfirm}>
            {confirmText}
          </button>
          <button className={styles.cancel_btn} style={{ backgroundColor: cancelColor }} onClick={onClose}>
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal; 