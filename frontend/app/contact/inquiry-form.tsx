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
    .regex(/^\d+$/, "Contact number should only contain numbers"),
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
              <p className={styles["success-text"]}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="20"
                  viewBox="0 0 76 76"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M38 75.5C58.7112 75.5 75.5 58.7112 75.5 38C75.5 17.2888 58.7112 0.5 38 0.5C17.2888 0.5 0.5 17.2888 0.5 38C0.5 58.7112 17.2888 75.5 38 75.5ZM51.26 24.74C51.9642 24.0368 52.9188 23.6422 53.9139 23.6429C54.909 23.6436 55.8631 24.0396 56.5663 24.7438C57.2694 25.4479 57.664 26.4025 57.6633 27.3977C57.6626 28.3928 57.2667 29.3468 56.5625 30.05L35.3637 51.2487L35.3488 51.2637C35.0013 51.6132 34.5882 51.8905 34.1332 52.0797C33.6782 52.269 33.1903 52.3664 32.6975 52.3664C32.2047 52.3664 31.7168 52.269 31.2618 52.0797C30.8068 51.8905 30.3937 51.6132 30.0462 51.2637L30.0312 51.2487L19.4375 40.655C19.0793 40.3091 18.7937 39.8953 18.5971 39.4378C18.4006 38.9803 18.2971 38.4882 18.2928 37.9903C18.2885 37.4923 18.3834 36.9985 18.5719 36.5377C18.7605 36.0768 19.0389 35.6581 19.391 35.306C19.7431 34.9539 20.1618 34.6755 20.6227 34.4869C21.0835 34.2984 21.5773 34.2035 22.0753 34.2078C22.5732 34.2121 23.0653 34.3156 23.5228 34.5121C23.9803 34.7087 24.3941 34.9943 24.74 35.3525L32.6975 43.3062L51.26 24.7438V24.74Z"
                    fill="#34A853"
                  />
                </svg>
              </p>
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
              <p className={styles["success-text"]}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="20"
                  viewBox="0 0 76 76"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M38 75.5C58.7112 75.5 75.5 58.7112 75.5 38C75.5 17.2888 58.7112 0.5 38 0.5C17.2888 0.5 0.5 17.2888 0.5 38C0.5 58.7112 17.2888 75.5 38 75.5ZM51.26 24.74C51.9642 24.0368 52.9188 23.6422 53.9139 23.6429C54.909 23.6436 55.8631 24.0396 56.5663 24.7438C57.2694 25.4479 57.664 26.4025 57.6633 27.3977C57.6626 28.3928 57.2667 29.3468 56.5625 30.05L35.3637 51.2487L35.3488 51.2637C35.0013 51.6132 34.5882 51.8905 34.1332 52.0797C33.6782 52.269 33.1903 52.3664 32.6975 52.3664C32.2047 52.3664 31.7168 52.269 31.2618 52.0797C30.8068 51.8905 30.3937 51.6132 30.0462 51.2637L30.0312 51.2487L19.4375 40.655C19.0793 40.3091 18.7937 39.8953 18.5971 39.4378C18.4006 38.9803 18.2971 38.4882 18.2928 37.9903C18.2885 37.4923 18.3834 36.9985 18.5719 36.5377C18.7605 36.0768 19.0389 35.6581 19.391 35.306C19.7431 34.9539 20.1618 34.6755 20.6227 34.4869C21.0835 34.2984 21.5773 34.2035 22.0753 34.2078C22.5732 34.2121 23.0653 34.3156 23.5228 34.5121C23.9803 34.7087 24.3941 34.9943 24.74 35.3525L32.6975 43.3062L51.26 24.7438V24.74Z"
                    fill="#34A853"
                  />
                </svg>
              </p>
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
              <p className={styles["success-text"]}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="20"
                  viewBox="0 0 76 76"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M38 75.5C58.7112 75.5 75.5 58.7112 75.5 38C75.5 17.2888 58.7112 0.5 38 0.5C17.2888 0.5 0.5 17.2888 0.5 38C0.5 58.7112 17.2888 75.5 38 75.5ZM51.26 24.74C51.9642 24.0368 52.9188 23.6422 53.9139 23.6429C54.909 23.6436 55.8631 24.0396 56.5663 24.7438C57.2694 25.4479 57.664 26.4025 57.6633 27.3977C57.6626 28.3928 57.2667 29.3468 56.5625 30.05L35.3637 51.2487L35.3488 51.2637C35.0013 51.6132 34.5882 51.8905 34.1332 52.0797C33.6782 52.269 33.1903 52.3664 32.6975 52.3664C32.2047 52.3664 31.7168 52.269 31.2618 52.0797C30.8068 51.8905 30.3937 51.6132 30.0462 51.2637L30.0312 51.2487L19.4375 40.655C19.0793 40.3091 18.7937 39.8953 18.5971 39.4378C18.4006 38.9803 18.2971 38.4882 18.2928 37.9903C18.2885 37.4923 18.3834 36.9985 18.5719 36.5377C18.7605 36.0768 19.0389 35.6581 19.391 35.306C19.7431 34.9539 20.1618 34.6755 20.6227 34.4869C21.0835 34.2984 21.5773 34.2035 22.0753 34.2078C22.5732 34.2121 23.0653 34.3156 23.5228 34.5121C23.9803 34.7087 24.3941 34.9943 24.74 35.3525L32.6975 43.3062L51.26 24.7438V24.74Z"
                    fill="#34A853"
                  />
                </svg>
              </p>
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
              <p className={styles["success-text"]}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="20"
                  viewBox="0 0 76 76"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M38 75.5C58.7112 75.5 75.5 58.7112 75.5 38C75.5 17.2888 58.7112 0.5 38 0.5C17.2888 0.5 0.5 17.2888 0.5 38C0.5 58.7112 17.2888 75.5 38 75.5ZM51.26 24.74C51.9642 24.0368 52.9188 23.6422 53.9139 23.6429C54.909 23.6436 55.8631 24.0396 56.5663 24.7438C57.2694 25.4479 57.664 26.4025 57.6633 27.3977C57.6626 28.3928 57.2667 29.3468 56.5625 30.05L35.3637 51.2487L35.3488 51.2637C35.0013 51.6132 34.5882 51.8905 34.1332 52.0797C33.6782 52.269 33.1903 52.3664 32.6975 52.3664C32.2047 52.3664 31.7168 52.269 31.2618 52.0797C30.8068 51.8905 30.3937 51.6132 30.0462 51.2637L30.0312 51.2487L19.4375 40.655C19.0793 40.3091 18.7937 39.8953 18.5971 39.4378C18.4006 38.9803 18.2971 38.4882 18.2928 37.9903C18.2885 37.4923 18.3834 36.9985 18.5719 36.5377C18.7605 36.0768 19.0389 35.6581 19.391 35.306C19.7431 34.9539 20.1618 34.6755 20.6227 34.4869C21.0835 34.2984 21.5773 34.2035 22.0753 34.2078C22.5732 34.2121 23.0653 34.3156 23.5228 34.5121C23.9803 34.7087 24.3941 34.9943 24.74 35.3525L32.6975 43.3062L51.26 24.7438V24.74Z"
                    fill="#34A853"
                  />
                </svg>
              </p>
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
            <p className={styles["success-text"]}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="20"
                viewBox="0 0 76 76"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M38 75.5C58.7112 75.5 75.5 58.7112 75.5 38C75.5 17.2888 58.7112 0.5 38 0.5C17.2888 0.5 0.5 17.2888 0.5 38C0.5 58.7112 17.2888 75.5 38 75.5ZM51.26 24.74C51.9642 24.0368 52.9188 23.6422 53.9139 23.6429C54.909 23.6436 55.8631 24.0396 56.5663 24.7438C57.2694 25.4479 57.664 26.4025 57.6633 27.3977C57.6626 28.3928 57.2667 29.3468 56.5625 30.05L35.3637 51.2487L35.3488 51.2637C35.0013 51.6132 34.5882 51.8905 34.1332 52.0797C33.6782 52.269 33.1903 52.3664 32.6975 52.3664C32.2047 52.3664 31.7168 52.269 31.2618 52.0797C30.8068 51.8905 30.3937 51.6132 30.0462 51.2637L30.0312 51.2487L19.4375 40.655C19.0793 40.3091 18.7937 39.8953 18.5971 39.4378C18.4006 38.9803 18.2971 38.4882 18.2928 37.9903C18.2885 37.4923 18.3834 36.9985 18.5719 36.5377C18.7605 36.0768 19.0389 35.6581 19.391 35.306C19.7431 34.9539 20.1618 34.6755 20.6227 34.4869C21.0835 34.2984 21.5773 34.2035 22.0753 34.2078C22.5732 34.2121 23.0653 34.3156 23.5228 34.5121C23.9803 34.7087 24.3941 34.9943 24.74 35.3525L32.6975 43.3062L51.26 24.7438V24.74Z"
                  fill="#34A853"
                />
              </svg>
            </p>
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
