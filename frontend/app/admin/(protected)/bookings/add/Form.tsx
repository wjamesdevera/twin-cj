"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { walkinSchema } from "@/app/lib/zodSchemas";

export default function WalkinForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(walkinSchema) });

  const [dayTourPackages, setDayTourPackages] = useState([]);
  const [cabinOptions, setCabinOptions] = useState([]);

  const packageType = watch("packageType");
  const checkInDate = watch("checkInDate");
  const checkOutDate = watch("checkOutDate");

  useEffect(() => {
    if (!packageType || !checkInDate || !checkOutDate) return;

    const fetchServices = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/bookings/getServicesByCategory?type=${packageType}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }

        const services = await response.json();

        if (packageType === "Day Tour") {
          setDayTourPackages(services["Day Tour"]?.services || []);
        } else if (packageType === "Overnight") {
          setCabinOptions(services["Overnight"]?.services || []);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, [packageType, checkInDate, checkOutDate]);

  const onSubmit = async (data: any) => {
    console.log("Walk-in Booking Data:", data);
    // Submit data to backend
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>First Name:</label>
      <input {...register("firstName")} />
      {errors.firstName && <p>{errors.firstName.message}</p>}

      <label>Email:</label>
      <input {...register("email")} />
      {errors.email && <p>{errors.email.message}</p>}

      <label>Contact Number:</label>
      <input {...register("contactNumber")} />
      {errors.contactNumber && <p>{errors.contactNumber.message}</p>}

      <label>Package Type:</label>
      <select {...register("packageType")}>
        <option value="">Select Package</option>
        <option value="Day Tour">Day Tour</option>
        <option value="Overnight">Overnight</option>
      </select>
      {errors.packageType && <p>{errors.packageType.message}</p>}

      {packageType === "Day Tour" && dayTourPackages.length > 0 && (
        <>
          <label>Day Tour Package:</label>
          <select {...register("selectedPackage")}>
            <option value="">Select a Day Tour Package</option>
            {dayTourPackages.map((pkg: any) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.name}
              </option>
            ))}
          </select>
          {errors.selectedPackage && <p>{errors.selectedPackage.message}</p>}
        </>
      )}

      {packageType === "Overnight" && cabinOptions.length > 0 && (
        <>
          <label>Cabin Selection:</label>
          <select {...register("selectedPackage")}>
            <option value="">Select a Cabin</option>
            {cabinOptions.map((cabin: any) => (
              <option key={cabin.id} value={cabin.id}>
                {cabin.name}
              </option>
            ))}
          </select>
          {errors.selectedPackage && <p>{errors.selectedPackage.message}</p>}
        </>
      )}

      <label>Check-in Date:</label>
      <input type="date" {...register("checkInDate")} />
      {errors.checkInDate && <p>{errors.checkInDate.message}</p>}

      {packageType === "Overnight" && (
        <>
          <label>Check-out Date:</label>
          <input type="date" {...register("checkOutDate")} />
          {errors.checkOutDate && <p>{errors.checkOutDate.message}</p>}
        </>
      )}

      <label>Proof of Payment:</label>
      <input type="file" {...register("proofOfPayment")} />
      {errors.proofOfPayment && <p>{errors.proofOfPayment.message}</p>}

      <label>Booking Status:</label>
      <select {...register("bookingStatus")}>
        <option value="">Select Status</option>
        <option value="Pending">Pending</option>
        <option value="Confirmed">Confirmed</option>
      </select>
      {errors.bookingStatus && <p>{errors.bookingStatus.message}</p>}

      <button type="submit">Submit</button>
    </form>
  );
}
