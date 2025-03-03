"use client";

import React, { useState, useEffect } from "react";
import styles from "./inquiryform.module.scss";
import Button from "../components/button";
import useSWRMutation from "swr/mutation";
import { sendFeedback } from "../lib/api";
import { Loading } from "../components/loading";
import { z } from "zod";
import Swal from "sweetalert2";

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
      /^[A-Za-z]+(?: [A-Za-z]+)*$/,
      "Full name should not contain numbers, special characters, or multiple spaces"
    )
    .refine((val) => val.trim().length > 0, "Full name cannot be just spaces"),
  email: z.string().email("Invalid email address").trim(),
  contactNumber: z
    .string()
    .min(11, "Contact number must be exactly 11 digits")
    .max(11, "Contact number must be exactly 11 digits")
    .regex(/^\d+$/, "Contact number should only contain numbers")
    .refine((val) => val.startsWith("09"), "Contact number must start with 09"),
  inquiryType: z.string().min(1, "Inquiry type is required"),
  message: z
    .string()
    .min(1, "Message is required")
    .max(500, "Message should not exceed 500 characters")
    .refine((val) => val.trim().length > 0, "Message cannot be just spaces"),
});

type SendFeedbackData = z.infer<typeof feedbackSchema>;

const InquiryForm: React.FC = () => {
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
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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

  const handleContactNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    if (value.length <= 11 && /^\d*$/.test(value)) {
      setFormData({ ...formData, contactNumber: value });
      setIsTouched((prevTouched) => ({ ...prevTouched, contactNumber: true }));
    }
  };

  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " ") {
      e.preventDefault();
    }
  };

  const { trigger, isMutating } = useSWRMutation(
    "sendFeedback",
    (key, { arg }: { arg: SendFeedbackData }) => sendFeedback(arg),
    {
      onSuccess: () => {
        setShowSuccessMessage(true);
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
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to submit this inquiry?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, submit it!",
        customClass: {
          confirmButton: styles["sweetalert-confirm-button"],
        },
      }).then((result) => {
        if (result.isConfirmed) {
          trigger(formData);
        }
      });
    }
  };

  return (
    <div className={styles["form-container"]}>
      <form className={styles["inquiry-form"]} onSubmit={handleSubmit}>
        <p className={styles["form-description"]}>
          Welcome to Twin CJ Riverside Glamping Resort! Please fill out the form
          below if you have any concerns, questions, or feedback. We’re here to
          assist you and ensure your stay is memorable.
        </p>
        {showSuccessMessage && (
          <div className={styles["success-message-banner"]}>
            <p>
              <span className={styles["bold-text"]}>
                Thanks for submitting your inquiry!
              </span>
              <br />
              We've received your message and will process it shortly. Please{" "}
              <span className={styles["emphasized-text"]}>
                check your email for a confirmation
              </span>{" "}
              and updates regarding your request.
            </p>
          </div>
        )}

        <div className={styles["form-row"]}>
          <div className={styles["form-field"]}>
            <label htmlFor="fullName">Full Name *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`${errors.fullName ? styles["error-input"] : ""} ${
                !errors.fullName && isTouched.fullName
                  ? styles["success-input"]
                  : ""
              }`}
            />
            {errors.fullName && (
              <p className={styles["error-text"]}>{errors.fullName}</p>
            )}
            {!errors.fullName && isTouched.fullName && (
              <p className={styles["success-text"]}>Full name is valid</p>
            )}
          </div>
          <div className={styles["form-field"]}>
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onKeyDown={handleEmailKeyDown}
              className={`${errors.email ? styles["error-input"] : ""} ${
                !errors.email && isTouched.email ? styles["success-input"] : ""
              }`}
            />
            {errors.email && (
              <p className={styles["error-text"]}>{errors.email}</p>
            )}
            {!errors.email && isTouched.email && (
              <p className={styles["success-text"]}>Email is valid</p>
            )}
          </div>
        </div>
        <div className={styles["form-row"]}>
          <div className={styles["form-field"]}>
            <label htmlFor="contactNumber">Contact Number *</label>
            <input
              type="tel"
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleContactNumberChange}
              className={`${
                errors.contactNumber ? styles["error-input"] : ""
              } ${
                !errors.contactNumber && isTouched.contactNumber
                  ? styles["success-input"]
                  : ""
              }`}
              maxLength={11}
            />
            {errors.contactNumber && (
              <p className={styles["error-text"]}>{errors.contactNumber}</p>
            )}
            {!errors.contactNumber && isTouched.contactNumber && (
              <p className={styles["success-text"]}>Contact Number is valid</p>
            )}
          </div>
          <div className={styles["form-field"]}>
            <label htmlFor="inquiryType">Inquiry Type *</label>
            <div className={styles["select-wrapper"]}>
              <select
                id="inquiryType"
                name="inquiryType"
                value={formData.inquiryType}
                className={`${styles["select-field"]} ${
                  errors.inquiryType ? styles["error-input"] : ""
                } ${
                  !errors.inquiryType && isTouched.inquiryType
                    ? styles["success-input"]
                    : ""
                }`}
                onChange={handleChange}
              >
                <option value="" disabled style={{ color: "#ADADAD" }}>
                  Select an option
                </option>
                {options.map((option, index) => (
                  <option value={option} key={index} style={{ color: "black" }}>
                    {option}
                  </option>
                ))}
              </select>
              <span className={styles["chevron-down"]}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="33"
                  height="33"
                  viewBox="0 0 33 33"
                  fill="none"
                >
                  <g opacity="0.5">
                    <path
                      d="M8.03643 11.6458C8.43916 11.2431 9.0921 11.2431 9.49483 11.6458L15.9844 18.1353L22.4738 11.6458C22.8766 11.2431 23.5296 11.2431 23.9324 11.6458C24.335 12.0485 24.335 12.7015 23.9324 13.1042L16.7136 20.3229C16.3109 20.7257 15.6579 20.7257 15.2552 20.3229L8.03643 13.1042C7.63369 12.7015 7.63369 12.0485 8.03643 11.6458Z"
                      fill="#ADADAD"
                    />
                  </g>
                </svg>
              </span>
            </div>
            {errors.inquiryType && (
              <p className={styles["error-text"]}>{errors.inquiryType}</p>
            )}
            {!errors.inquiryType && isTouched.inquiryType && (
              <p className={styles["success-text"]}>Inquiry type is valid</p>
            )}
          </div>
        </div>
        <div className={styles["form-field"]}>
          <label htmlFor="message">Message *</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className={`${errors.message ? styles["error-input"] : ""} ${
              !errors.message && isTouched.message
                ? styles["success-input"]
                : ""
            }`}
            maxLength={500}
          />
          {errors.message && (
            <p className={styles["error-text"]}>{errors.message}</p>
          )}
          {!errors.message && isTouched.message && (
            <p className={styles["success-text"]}>Message is valid</p>
          )}
          <p className={styles["char-count"]}>
            {formData.message.length}/500 characters
          </p>
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
    </div>
  );
};

export default InquiryForm;
