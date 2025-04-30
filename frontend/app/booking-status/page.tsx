"use client";

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import BookingStatusDetails from "../components/BookingStatusDetails";
import BookingStatusReference from "@/app/components/BookingStatusReference";
import Hero from "../components/Hero";
import styles from "../page.module.scss";
import useSWRMutation from "swr/mutation";
import { getBookingStatuses } from "../lib/api";
import { Loading } from "../components/loading";
import { format } from "date-fns";

// Temporary Schema (remove upon integrating the centralized zod file)

const bookingSchema = z.object({
  referenceCode: z.string().min(1, "Reference Code is required"),
});

type CheckBookingStatus = z.infer<typeof bookingSchema>;

const formatDate = (dateString?: string, type?: "checkIn" | "checkOut") => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";

  if (type === "checkIn") date.setHours(16, 0);
  if (type === "checkOut") date.setHours(12, 0);

  return format(date, "yyyy-MM-dd HH:mm:ss");
};

export default function Home() {
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckBookingStatus>({
    resolver: zodResolver(bookingSchema),
  });

  const {
    trigger,
    data: bookingResponse,
    isMutating,
  } = useSWRMutation(
    "booking-status",
    (key, { arg }: { arg: CheckBookingStatus }) =>
      getBookingStatuses(arg.referenceCode)
  );

  const { bookingStatus } = bookingResponse ? bookingResponse.data : {};

  const fetchBookingData = useCallback(
    async (data: CheckBookingStatus) => {
      setHasSubmitted(true);
      await trigger(data);
    },
    [trigger]
  );

  if (isMutating) return <Loading />;

  return isMutating ? (
    <Loading />
  ) : (
    <div className={styles.page} style={{ marginBottom: "65px" }}>
      <Hero
        imageURL="/assets/view-booking-status-hero.png"
        height="335px"
        marginBottom="65px"
      />
      <BookingStatusReference
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        fetchBookingData={fetchBookingData}
      />
      {bookingStatus ? (
        <BookingStatusDetails
          status={bookingStatus.bookingStatus.name}
          referenceCode={bookingStatus?.referenceCode}
          service={bookingStatus?.services[0]?.name}
          category={bookingStatus?.services[0]?.serviceCategory?.category.name}
          totalPax={bookingStatus?.totalPax}
          checkIn={formatDate(bookingStatus?.checkIn)}
          checkOut={formatDate(bookingStatus?.checkOut)}
          message={bookingStatus?.message}
          bookingData={bookingStatus}
        />
      ) : hasSubmitted ? (
        <BookingStatusDetails status="invalid" referenceCode="" />
      ) : null}
    </div>
  );
}
