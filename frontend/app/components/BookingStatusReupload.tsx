"use client";

import { useState } from "react";
import styles from "./BookingStatusReupload.module.scss";

interface Props {
  referenceCode: string;
  onReuploadSuccess: () => void;
}

const BookingStatusReupload: React.FC<Props> = ({ referenceCode, onReuploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target;
    const file = event.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      fileInput.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!window.confirm("Are you sure you want to upload this new payment proof?")) {
      return;
    }

    if (!selectedFile) return;

    const formData = new FormData();

    formData.append("file", selectedFile);

    try {
      const response = await fetch(`http://localhost:8080/api/bookings/status/${referenceCode}`, {
        method: "PUT",
        body: formData,
      });
      
      alert("Payment proof reuploaded successfully!");
      setSelectedFile(null);

      onReuploadSuccess();
    } catch (error) {

    } finally {
      
    }
  };

  return (
    <section className={`${styles["booking-status-reupload-section"]}`}>
      <div className={`${styles["booking-status-reupload-container"]}`}>
        <div className={`${styles["booking-status-reupload-container-heading"]}`}>
          <h3>Re-Upload Payment Screenshot</h3>
          <h4>Please note that your reservation is not secured until the payment is verified.</h4>
        </div>
        <div className={`${styles["booking-status-reupload-container-sub"]}`}>
          <label className={`${styles["booking-status-reupload-label"]}`} htmlFor="reupload-input">
            <i className="fas fa-arrow-up-from-bracket"></i>&nbsp;&nbsp;Upload
          </label>
          <input
            className={styles["booking-status-reupload-input"]}
            id="reupload-input"
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleFileChange}
          />
          <p>Max file size accepted is 1 MB.</p>
          <button onClick={handleUpload}>UPLOAD PAYMENT</button>
        </div>
      </div>
    </section>
  );
};

export default BookingStatusReupload;
