"use client";

import { walkinSchema } from "@/app/lib/zodSchemas";

type BookingFormData = {
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  packageType: "day-tour" | "cabins";
  selectedPackageId: string;
  selectedPackageName: string;
  checkInDate: string;
  checkOutDate: string;
  paymentAccountName: string;
  paymentAccountNumber: string;
  paymentMethod: string;
  proofOfPayment?: File;
  totalPax: string;
  amount: string;
  bookingStatus: "approve" | "reject" | "cancel";
};
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import styles from "./form.module.scss";
import CustomButton from "@/app/components/custom_button";
import ConfirmModal from "@/app/components/confirm_modal";

type FormFields = {
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  packageType: "day-tour" | "cabins";
  selectedPackageId: string;
  selectedPackageName: string;
  checkInDate: string;
  checkOutDate: string;
  paymentAccountName: string;
  paymentAccountNumber: string;
  paymentMethod: string;
  proofOfPayment?: File;
  totalPax: string;
  amount: string;
  bookingStatus: "approve" | "reject" | "cancel";
};

interface Service {
  id: number;
  serviceCategoryId: number;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
}

interface BookingTypeData {
  id: string;
  name: string;
  price?: number;
  capacity?: number;
  description?: string;
  services?: Service[];
}

interface BookingResponse {
  status: string;
  data: Record<string, BookingTypeData>;
}

interface FormProps {
  referenceNo: string;
}

export default function EditBooking({
  referenceNo,
  defaultValues,
}: {
  referenceNo: string;
  defaultValues: BookingFormData;
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(walkinSchema),
    mode: "onChange",
  });

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<
    "approve" | "pending" | "cancel" | "Reupload" | ""
  >("");
  const [statusReason, setStatusReason] = useState("");
  const [tempReason, setTempReason] = useState("");
  const [reasonError, setReasonError] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [cancelReason, setCancelReason] = useState("");

  const packageType = watch("packageType");
  const checkInDate = watch("checkInDate");
  const checkOutDate = watch("checkOutDate");

  // Fetch booking data
  useEffect(() => {
    if (!referenceNo) return;

    const fetchBooking = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/bookings/${referenceNo}`
        );
        if (!response.ok) throw new Error("Failed to fetch booking");

        const bookingData = await response.json();

        Object.entries(bookingData).forEach(([key, value]) => {
          const typedKey = key as keyof FormFields;

          if (typeof value === "string" || value instanceof File) {
            setValue(typedKey, value);
          } else if (value === null || value === undefined) {
            setValue(typedKey, "");
          } else {
            console.warn(
              `Skipping key ${key} due to incompatible type:`,
              value
            );
          }
        });
      } catch (err) {
        console.error("Failed to load booking data:", err);
      }
    };

    fetchBooking();
  }, [referenceNo, setValue]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as
      | "approve"
      | "pending"
      | "cancel"
      | "Reupload";
    setSelectedStatus(newStatus);
    setIsStatusModalOpen(true);

    if (newStatus === "cancel") {
      setTempReason(rejectReason);
    } else {
      setTempReason("");
    }

    setReasonError("");
  };

  const handleConfirm = () => {
    if (selectedStatus === "cancel" && !tempReason.trim()) {
      setReasonError("Reason is required");
      return;
    } else if (selectedStatus === "cancel") {
      setCancelReason(tempReason);
    }

    setStatusReason(selectedStatus === "approve" ? "" : tempReason);
    setIsStatusModalOpen(false);
  };

  const fetcher = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  // Fetch available services
  const { data, error } = useSWR<BookingResponse>(
    packageType && checkInDate
      ? `http://localhost:8080/api/bookings?type=${encodeURIComponent(
          packageType
        )}&checkInDate=${
          checkInDate ? new Date(checkInDate).toISOString() : ""
        }&checkOutDate=${
          packageType === "cabins" && checkOutDate
            ? new Date(checkOutDate).toISOString()
            : checkInDate
            ? new Date(checkInDate).toISOString()
            : ""
        }`
      : null,
    fetcher
  );

  const availablePackages: Service[] =
    data?.data?.[packageType]?.services || [];

  useEffect(() => {
    if (packageType === "day-tour") {
      setValue("checkOutDate", watch("checkInDate"));
      trigger("checkOutDate");
    }
  }, [packageType, watch("checkInDate")]);

  const handleEditBooking = () => {
    handleSubmit(onSubmit)();
  };

  const onSubmit = async (formData: FormFields) => {
    if (!formData.bookingStatus) {
      alert("Booking Status is required!");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/bookings/update",
        {
          method: "PUT",
          body: JSON.stringify(formData),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      console.log("Booking updated successfully!");
      router.push("http://localhost:3000/admin/bookings");
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  const handleCancel = () => {
    router.push("http://localhost:3000/admin/bookings");
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
              {...register("firstName", { disabled: true })}
              type="text"
              value={watch("firstName")}
              readOnly
            />
          </div>

          <div className={styles.form_group}>
            <label>
              Last Name <span className={styles.required}>*</span>
            </label>
            <input
              {...register("lastName", { disabled: true })}
              type="text"
              readOnly
            />
          </div>

          <div className={styles.form_group}>
            <label>
              Package Type <span className={styles.required}>*</span>
            </label>
            <select {...register("packageType", { disabled: true })} disabled>
              <option value="day-tour">Day Tour</option>
              <option value="cabins">Overnight</option>
            </select>
          </div>
          {packageType && (
            <div className={styles.form_group}>
              <label>
                {packageType === "day-tour"
                  ? "Day Tour Package"
                  : "Cabin Selection"}
                :
              </label>
              <select disabled>
                <option value="">Select an Option</option>
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
            </div>
          )}

          <div className={styles.form_group}>
            <label>
              Total Guests <span className={styles.required}>*</span>
            </label>
            <input
              {...register("totalPax", { disabled: true })}
              type="number"
              min={1}
              readOnly
            />
          </div>

          <div className={styles.form_group}>
            <label>
              Booking Status <span className={styles.required}>*</span>
            </label>
            <select
              {...register("bookingStatus")}
              onChange={(e) => {
                const status = e.target.value as
                  | "approve"
                  | "pending"
                  | "cancel"
                  | "Reupload";

                setSelectedStatus(status);

                if (status === "cancel") {
                  setTempReason(cancelReason);
                } else {
                  setTempReason("");
                }

                setReasonError("");
                setTimeout(() => setIsStatusModalOpen(true), 0);
              }}
            >
              <option value="approve">Approve</option>
              <option value="pending">Pending</option>
              <option value="reupload">Reupload</option>
              <option value="cancel">Cancel</option>
            </select>

            {statusReason && selectedStatus !== "approve" && (
              <p className={styles.status_reason}>
                <strong>Reason:</strong> {statusReason}
              </p>
            )}
          </div>
        </div>

        <div className={styles.right_column}>
          <div className={styles.form_group}>
            <label>
              Email <span className={styles.required}>*</span>
            </label>
            <input
              {...register("email", { disabled: true })}
              type="email"
              readOnly
            />
          </div>

          <div className={styles.form_group}>
            <label>
              Contact Number <span className={styles.required}>*</span>
            </label>
            <input
              {...register("contactNumber", { disabled: true })}
              type="text"
              maxLength={11}
              readOnly
            />
          </div>

          <div className={styles.form_group}>
            <label>
              Check-in Date <span className={styles.required}>*</span>
            </label>
            <input
              {...register("checkInDate", { disabled: true })}
              type="date"
              readOnly
            />
          </div>

          {packageType === "cabins" && (
            <div className={styles.form_group}>
              <label>
                Check-out Date <span className={styles.required}>*</span>
              </label>
              <input
                {...register("checkOutDate", { disabled: true })}
                type="date"
                readOnly
              />
            </div>
          )}

          <div className={styles.form_group}>
            <label>
              Amount <span className={styles.required}>*</span>
            </label>
            <input
              {...register("amount", { disabled: true })}
              type="number"
              min={1}
              readOnly
            />
          </div>
        </div>
      </div>

      <div className={styles.full_width}>
        <div className={styles.button_container}>
          <CustomButton
            type="button"
            label="Edit Booking"
            onClick={handleEditBooking}
          />

          <CustomButton
            type="button"
            label="Cancel"
            variant="danger"
            onClick={handleCancel}
          />
        </div>

        {selectedStatus === "cancel" && (
          <>
            <h2>Message for Cancellation</h2>
            <textarea
              placeholder="Enter reason (max 100 characters)"
              maxLength={100}
              value={tempReason}
              onChange={(e) => {
                setTempReason(e.target.value);

                if (e.target.value.trim()) {
                  setReasonError("");
                }
              }}
            />
            {tempReason.length > 100 && (
              <span className="error-message">
                Reason can't be more than 100 characters
              </span>
            )}
          </>
        )}
        {/* <ConfirmModal
          isOpen={isStatusModalOpen}
          onClose={() => {
            setIsStatusModalOpen(false);
            setReasonError("");
          }}
          onConfirm={() => {
            if (selectedStatus === "cancel" && !tempReason.trim()) {
              setReasonError("Reason is required");
              return;
            }

            if (selectedStatus === "cancel") {
              setCancelReason(tempReason);
            }

            setStatusReason(selectedStatus === "approve" ? "" : tempReason);
            setIsStatusModalOpen(false);
          }}
          title={`Are you sure you want to ${selectedStatus}?`}
          confirmText="Yes"
          cancelText="No"
        >
          {selectedStatus === "cancel" && (
            <>
              <textarea
                placeholder="Enter reason (max 100 characters)"
                maxLength={100}
                value={tempReason}
                onChange={(e) => {
                  setTempReason(e.target.value);
                  if (e.target.value.trim()) {
                    setReasonError("");
                  }
                }}
              />
              {reasonError && <p className={styles.error}>{reasonError}</p>}
            </>
          )}
        </ConfirmModal> */}
      </div>
    </form>
  );
}
