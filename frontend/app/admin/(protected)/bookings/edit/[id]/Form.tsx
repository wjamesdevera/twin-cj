"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import styles from "./form.module.scss";
import CustomButton from "@/app/components/custom_button";
import { z } from "zod";
import useSWRMutation from "swr/mutation";
import { editBookingStatus } from "@/app/lib/api";

type ServiceCategory = {
  id: number;
  categoryId: number;
};

type Service = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  serviceCategoryId: number;
  serviceCategory: ServiceCategory;
};

type BookingService = {
  service: Service;
};

type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
};

type Transaction = {
  id: string;
  proofOfPaymentImageUrl: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
};

type BookingResponse = {
  id: number;
  referenceCode: string;
  checkIn: string;
  checkOut: string;
  totalPax: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  services: BookingService[];
  customer: Customer;
  bookingStatus: string;
  transaction: Transaction;
};

type BookingStatus = {
  id?: number;
  name?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
};

const editBookingSchema = z.object({
  bookingStatus: z.string(),
});

type EditBookingData = z.infer<typeof editBookingSchema>;

export default function EditBooking({
  referenceNo,
  bookingStatus,
  defaultValues,
}: {
  referenceNo: string;
  bookingStatus: BookingStatus[] | [];
  defaultValues: BookingResponse;
}) {
  const router = useRouter();
  const { register, handleSubmit } = useForm<EditBookingData>({
    resolver: zodResolver(editBookingSchema),
    defaultValues: {},
  });

  const { trigger } = useSWRMutation(
    "edit",
    (key, { arg }: { arg: EditBookingData }) =>
      editBookingStatus(referenceNo, arg)
  );

  const onSubmit = async (formData: EditBookingData) => {
    await trigger(formData);
  };

  const handleCancel = () => {
    router.push("http://localhost:3000/admin/bookings");
  };

  console.log(defaultValues.services.map((service) => service.service.name));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.form_group_container}>
        <div className={styles.left_column}>
          <div className={styles.form_group}>
            <label>
              First Name <span className={styles.required}>*</span>
            </label>
            <input
              value={defaultValues.customer.firstName}
              disabled={true}
              type="text"
              readOnly
            />
          </div>

          <div className={styles.form_group}>
            <label>
              Last Name <span className={styles.required}>*</span>
            </label>
            <input
              value={defaultValues.customer.firstName}
              disabled={true}
              type="text"
              readOnly
            />
          </div>

          <div className={styles.form_group}>
            <label>
              Package Type <span className={styles.required}>*</span>
            </label>
            <input
              disabled
              value={
                defaultValues.services.map(
                  (service) => service.service.serviceCategory.categoryId
                )[0] === 1
                  ? "Cabin"
                  : "Day-Tour"
              }
            />
          </div>
          <div className={styles.form_group}>
            <label>Package</label>
            <input
              disabled
              defaultValue={
                defaultValues.services.map((service) => service.service.name)[0]
              }
            />
          </div>
          <div className={styles.form_group}>
            <label>
              Total Guests <span className={styles.required}>*</span>
            </label>
            <input
              value={defaultValues.totalPax}
              disabled
              type="number"
              min={1}
              readOnly
            />
          </div>

          <div className={styles.form_group}>
            <label>
              Booking Status <span className={styles.required}>*</span>
            </label>
            <select {...register("bookingStatus")}>
              {bookingStatus.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.right_column}>
          <div className={styles.form_group}>
            <label>
              Email <span className={styles.required}>*</span>
            </label>
            <input
              value={defaultValues.customer.email}
              disabled
              type="email"
              readOnly
            />
          </div>

          <div className={styles.form_group}>
            <label>
              Contact Number <span className={styles.required}>*</span>
            </label>
            <input
              value={defaultValues.customer.phoneNumber}
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
              value={new Date(defaultValues.checkIn).toLocaleDateString(
                "en-US",
                {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                }
              )}
              disabled
              readOnly
            />
          </div>

          <div className={styles.form_group}>
            <label>
              Check-out Date <span className={styles.required}>*</span>
            </label>
            <input
              value={new Date(defaultValues.checkOut).toLocaleDateString(
                "en-US",
                {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                }
              )}
              disabled
              readOnly
            />
          </div>

          <div className={styles.form_group}>
            <label>
              Amount <span className={styles.required}>*</span>
            </label>
            <input
              value={defaultValues.transaction.amount}
              disabled
              type="number"
              min={1}
              readOnly
            />
          </div>
        </div>
      </div>

      <div className={styles.full_width}>
        <div className={styles.button_container}>
          <CustomButton type="submit" label="Edit Booking" />

          <CustomButton
            type="button"
            label="Cancel"
            variant="danger"
            onClick={handleCancel}
          />
        </div>
      </div>
    </form>
  );
}
