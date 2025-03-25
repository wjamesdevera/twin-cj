"use client";

import confirmModalStyles from "./confirm_modal.module.scss";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  confirmText = "Yes",
  cancelText = "No",
}) => {
  if (!isOpen) return null;

  return (
    <div className={confirmModalStyles.overlay}>
      <div className={confirmModalStyles.modal}>
        <h2>{title}</h2>
        <div className={confirmModalStyles.button_container}>
          <button
            className={`${confirmModalStyles.button} ${confirmModalStyles.confirm_btn}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
          <button
            className={`${confirmModalStyles.button} ${confirmModalStyles.cancel_btn}`}
            onClick={onClose}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
