"use client";

import { walkinSchema } from "@/app/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import styles from "./form.module.scss";
import CustomButton from "@/app/components/custom_button";
import ConfirmModal from "@/app/components/confirm_modal";

interface Package {
  id: string;
  name: string;
  price?: number;
  capacity?: number;
  description?: string;
}

type FormFields = {
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  packageType: "Day Tour" | "Overnight";
  selectedPackage: string;
  checkInDate: string;
  checkOutDate: string;
  paymentAccountName: string;
  paymentAccountNumber: string;
  paymentMethod: string;
  bookingStatus: string;
  proofOfPayment?: File;
};

interface BookingTypeData {
  id: string;
  name: string;
  price?: number;
  capacity?: number;
  description?: string;
}

export default function WalkinForm() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    trigger,
    formState: { errors },
  } = useForm<FormFields>({ resolver: zodResolver(walkinSchema) });

  const router = useRouter();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState<() => void>(
    () => () => {}
  );

  const packageType = watch("packageType");
  const checkInDate = watch("checkInDate");
  const checkOutDate = watch("checkOutDate");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minDate = today.toISOString().split("T")[0];

  const fetcher = async (url: string) => {
    console.log("Fetching URL:", url);
    const response = await fetch(url);
    const data = await response.json();
    console.log("Response data:", data);
    return data;
  };

  const { data, error } = useSWR<{
    status: string;
    data: Record<string, BookingTypeData[]>;
  }>(
    packageType && checkInDate
      ? `http://localhost:8080/api/bookings?type=${encodeURIComponent(
          packageType
        )}&checkInDate=${
          checkInDate ? new Date(checkInDate).toISOString() : ""
        }&checkOutDate=${
          packageType === "Overnight" && checkOutDate
            ? new Date(checkOutDate).toISOString()
            : checkInDate
            ? new Date(checkInDate).toISOString()
            : ""
        }`
      : null,
    fetcher
  );

  console.log("Data received:", data);

  const availablePackages: BookingTypeData[] = data?.data?.[packageType] || [];

  console.log("Available packages:", availablePackages);

  const onSubmit = async (formData: FormFields) => {
    console.log("Submitting...");
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "proofOfPayment" && value instanceof File) {
          formDataToSend.append(key, value);
        } else {
          formDataToSend.append(key, String(value));
        }
      });

      const response = await fetch("http://localhost:8080/api/bookings", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      console.log("Booking submitted successfully!");
      // router.push("http://localhost:3000/admin/bookings");
    } catch (error: any) {
      console.error("Error submitting booking:", error);
    }
  };

  const handleCancel = () => {
    setConfirmMessage("Are you sure you want to cancel?");
    setConfirmAction(
      () => () => router.push("http://localhost:3000/admin/bookings")
    );
    setIsConfirmModalOpen(true);
  };

  const handleAddBooking = async () => {
    const isValid = await trigger();

    if (!isValid) return;

    setConfirmMessage("Are you sure you want to add this booking?");
    setConfirmAction(() => () => handleSubmit(onSubmit)());
    setIsConfirmModalOpen(true);
  };

  const handleClear = () => {
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.form_group_container}>
        <div className={styles.left_column}>
          <div className={styles.form_group}>
            <label>
              First Name <span className={styles.required}>*</span>
            </label>
            <input
              {...register("firstName")}
              type="text"
              onBlur={() => trigger("firstName")}
            />
            {errors.firstName && (
              <p className={styles.error}>{errors.firstName?.message}</p>
            )}
          </div>

          <div className={styles.form_group}>
            <label>
              Last Name <span className={styles.required}>*</span>
            </label>
            <input
              {...register("lastName")}
              type="text"
              onBlur={() => trigger("lastName")}
            />
            {errors.lastName && (
              <p className={styles.error}>{errors.lastName?.message}</p>
            )}
          </div>

          <div className={styles.form_group}>
            <label>
              Package Type <span className={styles.required}>*</span>
            </label>
            <select
              {...register("packageType")}
              defaultValue=""
              onBlur={() => trigger("packageType")}
            >
              <option value="" disabled>
                Select Package Type
              </option>
              <option value="Day Tour">Day Tour</option>
              <option value="Overnight">Overnight</option>
            </select>
            {errors.packageType && (
              <p className={styles.error}>{errors.packageType?.message}</p>
            )}
          </div>

          {packageType && (
            <div className={styles.form_group}>
              <label>
                {packageType === "Day Tour"
                  ? "Day Tour Package"
                  : "Cabin Selection"}
                :
              </label>
              <select
                {...register("selectedPackage")}
                defaultValue=""
                onBlur={() => trigger("selectedPackage")}
              >
                <option value="" disabled>
                  Select an Option
                </option>
                {availablePackages.length > 0 ? (
                  availablePackages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No options available!
                  </option>
                )}
              </select>
              {errors.selectedPackage && (
                <p className={styles.error}>
                  {errors.selectedPackage?.message}
                </p>
              )}
            </div>
          )}

          <div className={styles.form_group}>
            <label>
              Payment Account Name <span className={styles.required}>*</span>
            </label>
            <input
              {...register("paymentAccountName")}
              type="text"
              onBlur={() => trigger("paymentAccountName")}
            />
            {errors.paymentAccountName && (
              <p className={styles.error}>
                {errors.paymentAccountName?.message}
              </p>
            )}
          </div>

          <div className={styles.form_group}>
            <label>
              Payment Method <span className={styles.required}>*</span>
            </label>
            <select
              {...register("paymentMethod")}
              defaultValue=""
              onBlur={() => trigger("paymentMethod")}
            >
              <option value="" disabled>
                Select Payment Method
              </option>
              <option value="Gcash">Gcash</option>
              <option value="Credit Card">Credit Card</option>
            </select>
            {errors.paymentMethod && (
              <p className={styles.error}>{errors.paymentMethod?.message}</p>
            )}
          </div>
        </div>

        <div className={styles.right_column}>
          <div className={styles.form_group}>
            <label>
              Email <span className={styles.required}>*</span>
            </label>
            <input
              {...register("email")}
              type="email"
              onBlur={() => trigger("email")}
            />
            {errors.email && (
              <p className={styles.error}>{errors.email?.message}</p>
            )}
          </div>
          <div className={styles.form_group}>
            <label>
              Contact Number <span className={styles.required}>*</span>
            </label>
            <input
              {...register("contactNumber")}
              type="text"
              onBlur={() => trigger("contactNumber")}
            />
            {errors.contactNumber && (
              <p className={styles.error}>{errors.contactNumber?.message}</p>
            )}
          </div>

          <div className={styles.form_group}>
            <label>
              Check-in Date <span className={styles.required}>*</span>
            </label>
            <input
              {...register("checkInDate")}
              type="date"
              min={minDate}
              onBlur={() => trigger("checkInDate")}
            />
            {errors.checkInDate && (
              <p className={styles.error}>{errors.checkInDate?.message}</p>
            )}
          </div>

          {packageType === "Overnight" && (
            <div className={styles.form_group}>
              <label>
                Check-out Date <span className={styles.required}>*</span>
              </label>
              <input
                {...register("checkOutDate")}
                type="date"
                min={minDate}
                onBlur={() => trigger("checkOutDate")}
              />
              {errors.checkOutDate && (
                <p className={styles.error}>{errors.checkOutDate?.message}</p>
              )}
            </div>
          )}

          <div className={styles.form_group}>
            <label>
              Payment Account Number <span className={styles.required}>*</span>
            </label>
            <input
              {...register("paymentAccountNumber")}
              type="text"
              onBlur={() => trigger("paymentAccountNumber")}
            />
            {errors.paymentAccountNumber && (
              <p className={styles.error}>
                {errors.paymentAccountNumber?.message}
              </p>
            )}
          </div>

          <div className={styles.form_group}>
            <label>
              Proof of Payment <span className={styles.required}>*</span>
            </label>
            <input
              type="file"
              {...register("proofOfPayment")}
              accept="image/*,application/pdf"
            />
            {errors.proofOfPayment && (
              <p className={styles.error}>{errors.proofOfPayment?.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className={styles.full_width}>
        <div className={styles.button_container}>
          <CustomButton
            type="button"
            label="Add Booking"
            onClick={handleAddBooking}
          />
          <CustomButton
            type="button"
            label="Clear"
            variant="secondary"
            onClick={handleClear}
          />
          <CustomButton
            type="button"
            label="Cancel"
            variant="danger"
            onClick={handleCancel}
          />
        </div>

        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={() => {
            confirmAction();
            setIsConfirmModalOpen(false);
          }}
          title={confirmMessage}
          confirmText="Yes"
          cancelText="No"
        />
      </div>
    </form>
  );
}
