"use client";

import React, { useState } from "react";
import styles from "./../components/inquiryform.module.scss";

const InquiryForm: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    inquiryType: "General Inquiry",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setFormData({
      fullName: "",
      email: "",
      contactNumber: "",
      inquiryType: "General Inquiry",
      message: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };

  return (
    <div className={styles["form-container"]}>
      <form className={styles["inquiry-form"]} onSubmit={handleSubmit}>
        <div className={styles["form-row"]}>
          <div className={styles["form-field"]}>
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>
          <div className={styles["form-field"]}>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className={styles["form-row"]}>
          <div className={styles["form-field"]}>
            <label htmlFor="contactNumber">Contact Number</label>
            <input
              type="tel"
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
            />
          </div>
          <div className={styles["form-field"]}>
            <label htmlFor="inquiryType">Inquiry Type</label>
            <div className={styles["select-wrapper"]}>
              <select
                id="inquiryType"
                name="inquiryType"
                value={formData.inquiryType}
                onChange={handleChange}
              >
                <option value="Feedback">Feedback</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Reservations">Reservations</option>
                <option value="Activities">Activities</option>
                <option value="Others">Others</option>
              </select>
              <span className={styles["chevron-down"]}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 33 33"
                  fill="none"
                >
                  <g opacity="0.5">
                    <path
                      d="M8.03643 11.6458C8.43916 11.2431 9.0921 11.2431 9.49483 11.6458L15.9844 18.1353L22.4738 11.6458C22.8766 11.2431 23.5296 11.2431 23.9324 11.6458C24.335 12.0485 24.335 12.7015 23.9324 13.1042L16.7136 20.3229C16.3109 20.7257 15.6579 20.7257 15.2552 20.3229L8.03643 13.1042C7.63369 12.7015 7.63369 12.0485 8.03643 11.6458Z"
                      fill="#333333"
                    />
                  </g>
                </svg>
              </span>
            </div>
          </div>
        </div>
        <div className={styles["form-field"]}>
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
          />
        </div>
        <div className={styles["button-group"]}>
          <div className={styles.buttons}>
            <button type="button" className={styles["cancel-btn"]}>
              CANCEL
            </button>
            <button type="submit" className={styles["submit-btn"]}>
              SUBMIT
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InquiryForm;
