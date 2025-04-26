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

// Temporary Schema (remove upon integrating the centralized zod file)
// type Category = {
//   id: number;
//   name: string;
//   createdAt: string;
//   updatedAt: string;
// };

// type ServiceCategory = {
//   id: number;
//   categoryId: number;
//   category: Category;
// };

// type Service = {
//   id: number;
//   name: string;
//   description: string;
//   imageUrl: string;
//   price: number;
//   createdAt: string;
//   updatedAt: string;
//   serviceCategoryId: number;
//   serviceCategory: ServiceCategory;
// };

// type Customer = {
//   id: number;
//   personalDetailId: string;
//   createdAt: string;
//   updatedAt: string;
// };

// type BookingStatuses = {
//   id: number;
//   name: string;
//   createdAt: string;
//   updatedAt: string;
// };

// type Transaction = {
//   id: string;
//   proofOfPaymentImageUrl: string;
//   amount: number;
//   createdAt: string;
//   updatedAt: string;
//   paymentAccountId: number;
// };

// type BookingResponse = {
//   id: number;
//   referenceCode: string;
//   checkIn: string;
//   checkOut: string;
//   totalPax: number;
//   notes: string | null;
//   createdAt: string;
//   updatedAt: string;
//   customerId: number;
//   bookingStatusId: number;
//   transactionId: string;
//   customer: Customer;
//   bookingStatus: BookingStatuses;
//   services: Service[];
//   transaction: Transaction;
// }

const bookingSchema = z.object({
  referenceCode: z.string().min(1, "Reference Code is required"),
});

// interface BookingStatus {
//   name: string;
// }

// interface BookingData {
//   bookingStatus?: BookingStatus;
//   referenceCode: string;
//   services: Array<{
//     id: number;
//     name: string;
//     serviceCategory: {
//       category: {
//         name: string;
//       };
//     };
//   }>;
//   totalPax: number;
//   message: string;
//   checkIn: string;
//   checkOut: string;
// }

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
  } = useSWRMutation("key", (key, { arg }: { arg: CheckBookingStatus }) =>
    getBookingStatuses(arg.referenceCode)
  );

  const bookingData = bookingResponse || bookingResponse;

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
      {bookingData ? (
        <BookingStatusDetails
          status={bookingData.bookingStatus.name}
          referenceCode={bookingData?.referenceCode}
          service={bookingData?.services[0]?.name}
          category={bookingData?.services[0]?.serviceCategory?.category.name}
          totalPax={bookingData?.totalPax}
          checkIn={bookingData?.checkIn}
          checkOut={bookingData?.checkOut}
          note={bookingData?.notes}
          message={bookingData?.message}
          bookingData={bookingData}
        />
      ) : hasSubmitted ? (
        <BookingStatusDetails status="invalid" referenceCode="" />
      ) : null}
    </div>
  );
}
