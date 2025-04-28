"use client";

import { useEffect, useState } from "react";
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
import { useSearchParams } from "next/navigation";

const bookingSchema = z.object({
  referenceCode: z.string().min(1, "Reference Code is required"),
});

type CheckBookingStatus = z.infer<typeof bookingSchema>;

export default function Home() {
  const searchParams = useSearchParams();
  const referenceCode = searchParams.get("referenceCode");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookingSchema),
  });

  const {
    trigger,
    data: bookingResponse,
    isMutating,
  } = useSWRMutation(
    "key",
    (key, { arg }: { arg: CheckBookingStatus }) =>
      getBookingStatuses(arg.referenceCode),
    {
      onSuccess: () => {
        console.log(bookingResponse);
      },
    }
  );

  const { bookingStatus } = bookingResponse ? bookingResponse.data : {};

  useEffect(() => {
    if (referenceCode) {
      setValue("referenceCode", referenceCode);
      trigger({ referenceCode });
    }
  }, [referenceCode, setValue, trigger]);

  const fetchBookingData = async (data: CheckBookingStatus) => {
    setHasSubmitted(true);
    await trigger(data);
  };

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
          checkIn={bookingStatus?.checkIn}
          checkOut={bookingStatus?.checkOut}
          message={bookingStatus?.message}
          bookingData={bookingStatus}
        />
      ) : hasSubmitted ? (
        <BookingStatusDetails status="invalid" referenceCode="" />
      ) : null}
    </div>
  );
}
