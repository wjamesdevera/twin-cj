"use client";

import React, { useState, useEffect } from "react";
import styles from "./inquiryform.module.scss";
import Button from "../components/button";
import useSWRMutation from "swr/mutation";
import { sendFeedback } from "../lib/api";
import { Loading } from "../components/loading";
import { z } from "zod";

const options = [
  "Feedback",
  "General Inquiry",
  "Reservations",
  "Activities",
  "Others",
];

// Simplified validations using Zod
const feedbackSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .max(255)
    .regex(
      /^[A-Za-z\s]+$/,
      "Full name should not contain numbers or special characters"
    ),
  email: z.string().email("Invalid email address"),
  contactNumber: z
    .string()
    .min(11, "Contact number must be exactly 11 digits")
    .max(11, "Contact number must be exactly 11 digits")
    .regex(/^\d+$/, "Contact number should only contain numbers"),
  inquiryType: z.string().min(1, "Inquiry type is required"),
  message: z.string().min(1, "Message is required"),
});

type SendFeedbackData = z.infer<typeof feedbackSchema>;

const InquiryForm: React.FC = () => {
  const [isMessageSent, setIsMessageSent] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    inquiryType: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isTouched, setIsTouched] = useState<Record<string, boolean>>({
    fullName: false,
    email: false,
    contactNumber: false,
    inquiryType: false,
    message: false,
  });

  // Validate the form data whenever it changes
  useEffect(() => {
    const result = feedbackSchema.safeParse(formData);
    if (result.success) {
      setErrors({});
      setIsFormValid(true);
    } else {
      const errorMap: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (isTouched[err.path[0]]) {
          errorMap[err.path[0]] = err.message;
        }
      });
      setErrors(errorMap);
      setIsFormValid(false);
    }
  }, [formData, isTouched]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    setIsTouched((prevTouched) => ({ ...prevTouched, [name]: true }));
  };

  const { trigger, isMutating } = useSWRMutation(
    "sendFeedback",
    (key, { arg }: { arg: SendFeedbackData }) => sendFeedback(arg),
    {
      onSuccess: () => {
        setIsMessageSent(true);
        clearFormData();
      },
      onError: (error) => {
        console.error("Full error object:", error);

        let status = 500;
        let message = "An unknown error occurred";

        if (error.response) {
          status = error.response.status || 500;
          message = error.response.data || "An unknown error occurred";
        } else if (error.request) {
          message = "No response received from the server";
        } else {
          message = error.message || "An unexpected error occurred";
        }

        alert(`Error: ${message} (Status: ${status})`);
      },
    }
  );

  const clearFormData = () => {
    setFormData({
      fullName: "",
      email: "",
      contactNumber: "",
      inquiryType: "",
      message: "",
    });
    setErrors({});
    setIsFormValid(false);
    setIsTouched({
      fullName: false,
      email: false,
      contactNumber: false,
      inquiryType: false,
      message: false,
    });
  };

  const handleCancel = () => {
    clearFormData();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched to show errors on submit
    setIsTouched({
      fullName: true,
      email: true,
      contactNumber: true,
      inquiryType: true,
      message: true,
    });

    if (isFormValid) {
      trigger(formData);
    }
  };

  return (
    <div className={styles["form-container"]}>
      {isMessageSent ? (
        <div className={styles["success-banner"]}>
          <p>Thank you! Your inquiry has been sent</p>
        </div>
      ) : (
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
                className={errors.fullName ? styles["error-input"] : ""}
              />
              {errors.fullName && (
                <p className={styles["error-text"]}>{errors.fullName}</p>
              )}
            </div>
            <div className={styles["form-field"]}>
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? styles["error-input"] : ""}
              />
              {errors.email && (
                <p className={styles["error-text"]}>{errors.email}</p>
              )}
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
                className={errors.contactNumber ? styles["error-input"] : ""}
              />
              {errors.contactNumber && (
                <p className={styles["error-text"]}>{errors.contactNumber}</p>
              )}
            </div>
            <div className={styles["form-field"]}>
              <label htmlFor="inquiryType">Inquiry Type</label>
              <div className={styles["select-wrapper"]}>
                <select
                  id="inquiryType"
                  name="inquiryType"
                  value={formData.inquiryType}
                  className={`${styles["select-field"]} ${
                    errors.inquiryType ? styles["error-input"] : ""
                  }`}
                  onChange={handleChange}
                >
                  <option value="">Select an option</option>
                  {options.map((option, index) => (
                    <option value={option} key={index}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              {errors.inquiryType && (
                <p className={styles["error-text"]}>{errors.inquiryType}</p>
              )}
            </div>
          </div>
          <div className={styles["form-field"]}>
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className={errors.message ? styles["error-input"] : ""}
            />
            {errors.message && (
              <p className={styles["error-text"]}>{errors.message}</p>
            )}
          </div>
          <div className={styles["button-group"]}>
            <div className={styles.buttons}>
              <button
                onClick={handleCancel}
                type="button"
                className={styles["cancel-btn"]}
              >
                CANCEL
              </button>
              <Button
                type="submit"
                className={styles["submit-btn"]}
                disabled={!isFormValid || isMutating}
              >
                {isMutating ? <Loading /> : "SUBMIT"}
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default InquiryForm;
