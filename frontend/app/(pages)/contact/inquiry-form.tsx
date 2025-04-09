"use client";

import React, { useState, useEffect } from "react";
import styles from "./inquiryform.module.scss";
import Button from "../../components/button";
import useSWRMutation from "swr/mutation";
import { sendFeedback } from "../../lib/api";
import { Loading } from "../../components/loading";
import { z } from "zod";
import Swal from "sweetalert2";
import {
  emailSchema,
  messageSchema,
  phoneNumberSchema,
} from "@/app/lib/zodSchemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const options = [
  "Feedback",
  "General Inquiry",
  "Reservations",
  "Activities",
  "Others",
] as const;

// Simplified validations using Zod
const feedbackSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must be at most 50 characters long")
    .regex(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces")
    .transform((val) => val.replace(/\s+/g, " ").trim()),
  email: emailSchema,
  contactNumber: phoneNumberSchema,
  inquiryType: z.enum(options),
  message: messageSchema,
});

type SendFeedbackData = z.infer<typeof feedbackSchema>;

const InquiryForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger: verifyForm,
    formState: { errors, touchedFields },
  } = useForm<SendFeedbackData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      fullName: "",
      email: "",
      contactNumber: "",
      message: "",
    },
  });

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showSuccessMessage) {
      timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 10000);
    }
    return () => clearTimeout(timer);
  }, [showSuccessMessage]);

  const { trigger, isMutating } = useSWRMutation(
    "sendFeedback",
    (key, { arg }: { arg: SendFeedbackData }) => sendFeedback(arg),
    {
      onSuccess: () => {
        setShowSuccessMessage(true);
        reset();
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

  const handleCancel = () => {
    reset();
  };

  const onSubmit = (data: SendFeedbackData) => {
    // Mark all fields as touched to show errors on submit
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
        trigger(data);
      }
    });
  };

  return (
    <div className={styles["form-container"]}>
      <form
        className={styles["inquiry-form"]}
        onSubmit={handleSubmit(onSubmit)}
      >
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
              We&apos;ve received your message and will process it shortly.
              Please{" "}
              <span className={styles["emphasized-text"]}>
                check your email for a confirmation
              </span>{" "}
              and updates regarding your request.
            </p>
          </div>
        )}

        <div className={styles["form-row"]}>
          <div className={styles["form-field"]}>
            <label htmlFor="fullName">
              Full Name <span className={styles["asterisk"]}>*</span>{" "}
            </label>
            <input
              type="text"
              id="fullName"
              placeholder="Enter your full name"
              {...register("fullName")}
              onKeyDown={() => verifyForm("fullName")}
              onKeyUp={() => verifyForm("fullName")}
              className={`${errors.fullName ? styles["error-input"] : ""} ${
                !errors.fullName && touchedFields.fullName
                  ? styles["success-input"]
                  : ""
              }`}
            />
            {errors.fullName && (
              <p className={styles["error-text"]}>{errors.fullName.message}</p>
            )}
          </div>
          <div className={styles["form-field"]}>
            <label htmlFor="email">
              Email Address <span className={styles["asterisk"]}>*</span>
            </label>
            <input
              type="email"
              id="email"
              placeholder="email@email.com"
              {...register("email")}
              onKeyDown={() => verifyForm("email")}
              onKeyUp={() => verifyForm("email")}
              className={`${errors.email ? styles["error-input"] : ""} ${
                !errors.email && touchedFields.email
                  ? styles["success-input"]
                  : ""
              }`}
            />
            {errors.email && (
              <p className={styles["error-text"]}>{errors.email.message}</p>
            )}
          </div>
        </div>
        <div className={styles["form-row"]}>
          <div className={styles["form-field"]}>
            <label htmlFor="contactNumber">
              Contact Number <span className={styles["asterisk"]}>*</span>
            </label>
            <input
              type="tel"
              id="contactNumber"
              placeholder="09XXXXXXXXX"
              {...register("contactNumber")}
              onKeyDown={() => verifyForm("contactNumber")}
              onKeyUp={() => verifyForm("contactNumber")}
              className={`${
                errors.contactNumber ? styles["error-input"] : ""
              } ${
                !errors.contactNumber && touchedFields.contactNumber
                  ? styles["success-input"]
                  : ""
              }`}
              maxLength={11}
            />
            {errors.contactNumber && (
              <p className={styles["error-text"]}>
                {errors.contactNumber.message}
              </p>
            )}
          </div>
          <div className={styles["form-field"]}>
            <label htmlFor="inquiryType">
              Inquiry Type <span className={styles["asterisk"]}>* </span>
            </label>
            <div className={styles["select-wrapper"]}>
              <select
                id="inquiryType"
                {...register("inquiryType")}
                className={`${styles["select-field"]} ${
                  errors.inquiryType ? styles["error-input"] : ""
                } ${
                  !errors.inquiryType && touchedFields.inquiryType
                    ? styles["success-input"]
                    : ""
                }`}
              >
                <option value="" disabled>
                  Select an option
                </option>
                {options.map((option, index) => (
                  <option value={option} key={index}>
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
              <p className={styles["error-text"]}>
                {errors.inquiryType.message}
              </p>
            )}
          </div>
        </div>
        <div className={styles["form-field"]}>
          <label htmlFor="message">
            Message <span className={styles["asterisk"]}>*</span>
          </label>
          <textarea
            id="message"
            placeholder="Enter your message here"
            {...register("message")}
            onKeyDown={() => verifyForm("message")}
            onKeyUp={() => verifyForm("message")}
            className={`${errors.message ? styles["error-input"] : ""} ${
              !errors.message && touchedFields.message
                ? styles["success-input"]
                : ""
            }`}
            maxLength={400}
          />
          {errors.message && (
            <p className={styles["error-text"]}>{errors.message.message}</p>
          )}
          <p className={styles["char-count"]}>
            {watch("message").length}/400 characters
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
              disabled={isMutating}
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
