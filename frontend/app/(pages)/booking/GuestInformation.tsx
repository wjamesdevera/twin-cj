import React, { useEffect, useState } from "react";
import styles from "./guestinformation.module.scss";
import BookingButton from "../../components/BookingButton";
import TermsAndConditions from "../../components/TermsandConditions";
import { z } from "zod";
import {
  emailSchema,
  nameSchema,
  phoneNumberSchema,
} from "@/app/lib/zodSchemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import { options } from "@/app/api";
import NotificationModal from "@/app/components/notification_modal";

const guestInformationSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  contactNumber: phoneNumberSchema,
  email: emailSchema,

  specialRequest: z
    .string()
    .regex(/^[a-zA-Z0-9 ]*$/)
    .optional(),
  isTermsChecked: z.boolean().refine((value) => value === true, {
    message:
      "You must accept the Terms and Conditions and Privacy Policy to proceed.",
  }),
  isPrivacyChecked: z.boolean().refine((value) => value === true, {
    message:
      "You must accept the Terms and Conditions and Privacy Policy to proceed.",
  }),
});

type GuestInformationFormData = z.infer<typeof guestInformationSchema>;

interface GuestInformationProps {
  onConfirmBooking: (bookingDetails: {
    firstName: string;
    lastName: string;
    contactNumber: string;
    email: string;
  }) => void;
}

const GuestInformation: React.FC<GuestInformationProps> = ({
  onConfirmBooking,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<GuestInformationFormData>({
    resolver: zodResolver(guestInformationSchema),
    defaultValues: {
      isTermsChecked: false,
      isPrivacyChecked: false,
    },
  });

  const isEmailValid = emailSchema.safeParse(watch("email")).success;

  const [otpSent, setOtpSent] = useState(false);

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState<"success" | "error">(
    "success"
  );

  const handleSendOTP = async (email: string) => {
    try {
      const response = await fetch(`${options.baseURL}/api/bookings/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Failed to send OTP");

      setOtpSent(true);
      setNotificationMessage("Please check your email for the OTP.");
      setNotificationType("success");
      setIsNotificationOpen(true);

      setTimeout(() => {
        const otpVerificationUrl = `/booking/verify_otp?page=1&email=${email}`;
        window.open(otpVerificationUrl, "_blank");
      }, 2000);
    } catch (error) {
      console.error("Error sending OTP:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to send OTP. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.action === "enablePaymentButton") {
        setIsEmailVerified(true);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleConfirmBookingClick = (data: GuestInformationFormData) => {
    const bookingDetails = {
      firstName: data.firstName,
      lastName: data.lastName,
      contactNumber: data.contactNumber,
      email: data.email,
      specialRequest: data.specialRequest,
    };
    onConfirmBooking(bookingDetails);
  };

  return (
    <div className={styles.guestInfoContainer}>
      <h2 className={styles.sectionTitle}>Guest Information</h2>
      <form
        className={styles.form}
        onSubmit={handleSubmit(handleConfirmBookingClick)}
      >
        <div className={styles.row}>
          <div className={styles.field}>
            <label>First Name</label>
            <input
              type="text"
              placeholder="First Name"
              {...register("firstName")}
              className={errors.firstName ? styles.errorInput : ""}
            />
            {errors.firstName && (
              <p className={styles.errorText}>{errors.firstName.message}</p>
            )}
          </div>
          <div className={styles.field}>
            <label>Last Name</label>
            <input
              type="text"
              placeholder="Last Name"
              {...register("lastName")}
              className={errors.lastName ? styles.errorInput : ""}
            />
            {errors.lastName && (
              <p className={styles.errorText}>{errors.lastName.message}</p>
            )}
          </div>
          <div className={styles.field}>
            <label>Contact Number</label>
            <input
              type="text"
              placeholder="09123456789"
              {...register("contactNumber")}
              maxLength={11}
              className={errors.contactNumber ? styles.errorInput : ""}
            />
            {errors.contactNumber && (
              <p className={styles.errorText}>{errors.contactNumber.message}</p>
            )}
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <label>Email</label>
            <div className={styles.emailContainer}>
              <input
                type="email"
                placeholder="Type your Email"
                {...register("email")}
                className={errors.email ? styles.errorInput : ""}
              />

              <button
                type="button"
                className={styles.sendOtpButton}
                onClick={() => handleSendOTP(watch("email"))}
                disabled={!isEmailValid}
              >
                Verify Email
              </button>
            </div>
            {errors.email && (
              <p className={styles.errorText}>{errors.email.message}</p>
            )}
          </div>
          {/* <div className={styles.field}>
           
          </div> */}
        </div>
        <div className={styles.field}>
          <label>Special Request</label>
          <input
            type="text"
            placeholder="Type your Special Request"
            {...register("specialRequest")}
            className={errors.specialRequest ? styles.errorInput : ""}
          />
        </div>
        <div className={styles.checkboxRow}>
          <label>
            <input
              type="checkbox"
              checked={watch("isTermsChecked")}
              disabled={true}
              {...register("isTermsChecked")}
              className={styles.checkbox}
              readOnly
            />{" "}
            I have read and agree to the{" "}
            <TermsAndConditions
              type="terms"
              onAgree={() => setValue("isTermsChecked", true)}
            />
            .
          </label>
          <label>
            <input
              type="checkbox"
              checked={watch("isPrivacyChecked")}
              disabled={true}
              readOnly
            />{" "}
            I consent to the processing of my personal data as explained in the{" "}
            <TermsAndConditions
              type="privacy"
              onAgree={() => setValue("isPrivacyChecked", true)}
            />
            .
          </label>
        </div>
        {/* Disable the button unless all fields are filled and both checkboxes are checked */}
        <BookingButton
          text="Proceed to Payment"
          disabled={
            !isEmailVerified ||
            Object.keys(errors).length > 0 ||
            !watch("isTermsChecked") ||
            !watch("isPrivacyChecked")
          }
        />
      </form>
      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        message={notificationMessage}
        type={notificationType}
      />
    </div>
  );
};

export default GuestInformation;
