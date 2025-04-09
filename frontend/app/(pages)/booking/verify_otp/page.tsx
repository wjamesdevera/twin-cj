"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { options } from "@/app/api";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";

const otpSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be exactly 6 characters" }),
});

type OtpFormData = z.infer<typeof otpSchema>;

const VerifyOtp: React.FC = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [otpValid, setOtpValid] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });

  if (!email) {
    return <p>Missing Email</p>;
  }

  const handleVerifyOtp = async (data: OtpFormData) => {
    const { otp } = data;

    try {
      const response = await fetch(
        `${options.baseURL}/api/bookings/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }),
        }
      );

      if (!response.ok) throw new Error("Failed to verify OTP");

      const result = await response.json();
      if (result.success) {
        setOtpValid(true);
        Swal.fire({
          title: "OTP Verified!",
          text: "Your email has been successfully verified.",
          icon: "success",
          confirmButtonText: "Email Verified",
        }).then(() => {
          if (window.opener) {
            window.opener.postMessage({ action: "enablePaymentButton" }, "*");
          }

          window.close();
        });
      } else {
        Swal.fire({
          title: "Verification Failed",
          text: "Incorrect OTP. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to verify OTP. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className={styles.container}>
      <h2>Verify OTP</h2>
      <p>
        We sent an OTP to your email: <strong>{email}</strong>
      </p>

      <form onSubmit={handleSubmit(handleVerifyOtp)}>
        <div>
          <label>Enter OTP</label>
          <input
            type="text"
            placeholder="Enter OTP"
            {...register("otp")}
            maxLength={6}
          />
          {errors.otp && <p style={{ color: "red" }}>{errors.otp.message}</p>}
        </div>

        <button type="submit" disabled={otpValid}>
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;
