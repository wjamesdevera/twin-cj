"use client";

import { useCallback, useEffect, useState } from "react";
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
import { format } from "date-fns";

// Temporary Schema (remove upon integrating the centralized zod file)

const bookingSchema = z.object({
  referenceCode: z.string().min(1, "Reference Code is required"),
});

interface BookingStatus {
  name: string;
}

type CheckBookingStatus = z.infer<typeof bookingSchema>;
type BookingResponse = Awaited<ReturnType<typeof getBookingStatuses>>;

const formatDate = (dateString?: string, type?: "checkIn" | "checkOut") => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";

  if (type === "checkIn") date.setHours(16, 0);
  if (type === "checkOut") date.setHours(12, 0);

  return format(date, "yyyy-MM-dd HH:mm:ss");
};

export default function Home() {
  const searchParams = useSearchParams();
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [referenceCode, setReferenceCode] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckBookingStatus>({
    resolver: zodResolver(bookingSchema),
  });

  const {
    trigger,
    data: fetchedBookingData,
    isMutating,
  } = useSWRMutation(
    "booking-status",
    (key, { arg }: { arg: CheckBookingStatus }) =>
      getBookingStatuses(arg.referenceCode)
  );

  useEffect(() => {
    const code = searchParams.get("referenceCode");
    if (code) setReferenceCode(code);
  }, [searchParams]);

  useEffect(() => {
    if (referenceCode) {
      setValue("referenceCode", referenceCode);
      trigger({ referenceCode });
    }
  }, [referenceCode, setValue, trigger]);

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
      {fetchedBookingData ? (
        <BookingStatusDetails
          status={fetchedBookingData.bookingStatus.name}
          referenceCode={fetchedBookingData?.referenceCode}
          service={fetchedBookingData?.services[0]?.name}
          category={
            fetchedBookingData?.services[0]?.serviceCategory?.category.name
          }
          totalPax={fetchedBookingData?.totalPax}
          checkIn={formatDate(fetchedBookingData.checkIn, "checkIn")}
          checkOut={formatDate(fetchedBookingData.checkOut, "checkOut")}
          notes={fetchedBookingData?.notes}
          message={fetchedBookingData?.message}
          bookingData={fetchedBookingData}
        />
      ) : hasSubmitted ? (
        <BookingStatusDetails status="invalid" referenceCode="" />
      ) : null}
    </div>
  );
}
