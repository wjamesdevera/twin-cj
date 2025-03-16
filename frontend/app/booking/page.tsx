"use client";

import React, { useState, useEffect } from "react";
import useSWR from "swr";
import Header from "./../components/Header";
import Accordion from "./../components/Accordion";
import ScheduleSelector from "./../components/ScheduleSelector";
import BookingCard from "./../components/BookingCard";
import GuestInformation from "../components/GuestInformation";
import { Loading } from "../components/loading";
import { useRouter } from "next/navigation";

interface AccordionItem {
  title: string;
  content: React.JSX.Element;
  required?: boolean;
  // additionalFee?: string;
}

interface BookingCardData {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  // additionalFee?: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Booking: React.FC = () => {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [bookingType, setBookingType] = useState<string>("day-tour");
  const [bookingCards, setBookingCards] = useState<BookingCardData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showAccordian, setShowAccordian] = useState<boolean>(false);
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [guestCounts, setGuestCounts] = useState<{
    adults: number;
    children: number;
  }>({
    adults: 1,
    children: 0,
  });

  const { data, error } = useSWR<{
    status: string;
    data: { dayTours?: BookingCardData[]; cabins?: BookingCardData[] };
  }>(
    `http://localhost:8080/api/services/${
      bookingType === "day-tour" ? "day-tours" : "cabins"
    }`,
    fetcher
  );

  useEffect(() => {
    if (data) {
      if (
        bookingType === "day-tour" &&
        data.data &&
        Array.isArray(data.data.dayTours)
      ) {
        setBookingCards(
          data.data.dayTours.map(({ name, description, price, imageUrl }) => ({
            name,
            description,
            price,
            imageUrl,
          }))
        );
      } else if (
        bookingType === "overnight" &&
        data.data &&
        Array.isArray(data.data.cabins)
      ) {
        setBookingCards(
          data.data.cabins.map(({ name, description, price, imageUrl }) => ({
            name,
            description,
            price,
            imageUrl,
          }))
        );
      } else {
        setBookingCards([]);
      }
      setIsLoading(false);
    }
  }, [data, bookingType]);

  const handleOptionSelect = (option: string) => {
    setBookingType(option);
    setSelectedOption("");
    {
      /* isMutating */
    }
    //setIsLoading(true);
  };

  // Check Availability then shows the Accordion
  const handleCheckAvailability = (details: {
    checkInDate: Date | null;
    checkOutDate: Date | null;
    guestCounts: { adults: number; children: number };
  }) => {
    // NOTE: this is temporary, will be replaced with actual checking of availability
    setCheckInDate(details.checkInDate);
    setCheckOutDate(details.checkOutDate);
    setGuestCounts(details.guestCounts);
    setShowAccordian(true);
  };

  // Confirm Booking then redirects to Payment Details page
  const handleConfirmBooking = (bookingDetails: any) => {
    const bookingData = {
      selectedOption,
      bookingType,
      bookingCards,
      checkInDate,
      checkOutDate,
      guestCounts,
      specialRequests: bookingDetails.specialRequests,
      ...bookingDetails,
    };
    sessionStorage.setItem("bookingData", JSON.stringify(bookingData));
    router.push("/payment_details");
  };

  if (error) return <div>Failed to load</div>;
  if (isLoading) return <Loading />;

  const accordionItems: AccordionItem[] = [
    {
      title: "Resort Schedule",
      content: (
        <ScheduleSelector
          selectedOption={bookingType}
          handleOptionSelect={handleOptionSelect}
        />
      ),
    },
    bookingType === "day-tour"
      ? {
          title: "Package Type",
          content: (
            <div style={{ display: "grid", gap: "1rem" }}>
              <p
                style={{
                  fontSize: "1rem",
                  marginTop: "2rem",
                  marginBottom: "1rem",
                }}
              >
                Choose one Package Type (required)
              </p>
              {bookingCards.map((card) => (
                <BookingCard
                  key={card.name}
                  title={card.name}
                  description={card.description}
                  price={`₱${card.price}`}
                  // additionalPrice={card.additionalFee || ""}
                  imageSrc={card.imageUrl}
                  isSelected={selectedOption === card.name}
                  onSelect={() => setSelectedOption(card.name)}
                />
              ))}
            </div>
          ),
        }
      : null,
    bookingType === "overnight"
      ? {
          title: "Cabins",
          content: (
            <div style={{ display: "grid", gap: "1rem" }}>
              <p
                style={{
                  fontSize: "1rem",
                  marginTop: "2rem",
                  marginBottom: "1rem",
                }}
              >
                Choose one cabin (required)
              </p>
              {bookingCards.map((card) => (
                <BookingCard
                  key={card.name}
                  title={card.name}
                  description={card.description}
                  price={`₱${card.price}`}
                  // additionalPrice={card.additionalFee || ""}
                  imageSrc={card.imageUrl}
                  isSelected={selectedOption === card.name}
                  onSelect={() => setSelectedOption(card.name)}
                />
              ))}
            </div>
          ),
        }
      : null,
    {
      title: "Booking Details",
      content: <GuestInformation onConfirmBooking={handleConfirmBooking} />,
    },
  ].filter((item): item is AccordionItem => item !== null);

  return (
    <div>
      <Header onCheckAvailability={handleCheckAvailability} />
      {showAccordian && (
        <main style={{ padding: "1rem" }}>
          <Accordion items={accordionItems} />
        </main>
      )}
    </div>
  );
};

export default Booking;
