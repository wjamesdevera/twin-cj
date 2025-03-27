import React from "react";
import styles from "./confirm_modal.module.scss";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  confirmText?: string;
  cancelText?: string;
  children?: React.ReactNode;
  className?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  confirmText,
  cancelText,
  children,
  className,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={`${styles.modal} ${className || ""}`}>
        <h2>{title}</h2>
        {children && <div className={styles.content}>{children}</div>}

        {(confirmText || cancelText) && (
          <div className={styles.button_container}>
            {confirmText && (
              <button className={styles.confirm_btn} onClick={onConfirm}>
                {confirmText}
              </button>
            )}
            {cancelText && (
              <button className={styles.cancel_btn} onClick={onClose}>
                {cancelText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmModal;
