"use client";

import { walkinSchema } from "@/app/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

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

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function WalkinForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormFields>({ resolver: zodResolver(walkinSchema) });

  const packageType = watch("packageType");
  const checkInDate = watch("checkInDate");
  const checkOutDate = watch("checkOutDate");

  const formattedCheckInDate = checkInDate
    ? new Date(checkInDate).toISOString()
    : "";

  const formattedCheckOutDate = checkOutDate
    ? new Date(checkOutDate).toISOString()
    : "";

  const { data, error } = useSWR<{
    status: string;
    data: Record<string, Package[]>;
  }>(
    packageType && checkInDate
      ? `http://localhost:8080/api/bookings?type=${encodeURIComponent(
          packageType
        )}&checkInDate=${new Date(checkInDate).toISOString().split("T")[0]}${
          packageType === "Overnight" && checkOutDate
            ? `&checkOutDate=${
                new Date(checkOutDate).toISOString().split("T")[0]
              }`
            : ""
        }`
      : null,
    fetcher
  );

  const availablePackages = data?.data?.[packageType] || [];

  const onSubmit = (formData: FormFields) => {
    console.log("Walk-in Booking Data:", formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>First Name:</label>
        <input {...register("firstName")} type="text" />
        {errors.firstName && <p>{errors.firstName?.message}</p>}
      </div>
      <div>
        <label>Last Name:</label>
        <input {...register("lastName")} type="text" />
        {errors.lastName && <p>{errors.lastName?.message}</p>}
      </div>
      <div>
        <label>Email:</label>
        <input {...register("email")} type="email" />
        {errors.email && <p>{errors.email?.message}</p>}
      </div>
      <div>
        <label>Contact Number:</label>
        <input {...register("contactNumber")} type="text" />
        {errors.contactNumber && <p>{errors.contactNumber?.message}</p>}
      </div>
      <div>
        <label>Check-In Date:</label>
        <input {...register("checkInDate")} type="date" />
        {errors.checkInDate && <p>{errors.checkInDate?.message}</p>}
      </div>
      <div>
        <label>Check-Out Date:</label>
        <input {...register("checkOutDate")} type="date" />
        {errors.checkOutDate && <p>{errors.checkOutDate?.message}</p>}
      </div>
      <div>
        <label>Payment Account Name:</label>
        <input {...register("paymentAccountName")} type="text" />
        {errors.paymentAccountName && (
          <p>{errors.paymentAccountName?.message}</p>
        )}
      </div>
      <div>
        <label>Payment Account Number:</label>
        <input {...register("paymentAccountNumber")} type="text" />
        {errors.paymentAccountNumber && (
          <p>{errors.paymentAccountNumber?.message}</p>
        )}
      </div>
      <div>
        <label>Payment Method:</label>
        <input {...register("paymentMethod")} type="text" />
        {errors.paymentMethod && <p>{errors.paymentMethod?.message}</p>}
      </div>
      <div>
        <label>Booking Status:</label>
        <input {...register("bookingStatus")} type="text" />
        {errors.bookingStatus && <p>{errors.bookingStatus?.message}</p>}
      </div>

      <div>
        <label>Package Type:</label>
        <select {...register("packageType")} defaultValue="">
          <option value="" disabled>
            Select Package Type
          </option>
          <option value="Day Tour">Day Tour</option>
          <option value="Overnight">Overnight</option>
        </select>
        {errors.packageType && <p>{errors.packageType?.message}</p>}
      </div>

      {packageType && (
        <div>
          <label>
            {packageType === "Day Tour"
              ? "Day Tour Package"
              : "Cabin Selection"}
            :
          </label>
          <select {...register("selectedPackage")} defaultValue="">
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
          {errors.selectedPackage && <p>{errors.selectedPackage?.message}</p>}
        </div>
      )}

      <div>
        <label>Proof of Payment:</label>
        <input
          type="file"
          {...register("proofOfPayment")}
          accept="image/*,application/pdf"
        />
        {errors.proofOfPayment && <p>{errors.proofOfPayment?.message}</p>}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
