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

interface BookingTypeData {
  services: BookingCardData[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Booking: React.FC = () => {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [bookingType, setBookingType] = useState<string | null>(null);
  const [bookingCards, setBookingCards] = useState<BookingCardData[]>([]);
  //const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showAccordian, setShowAccordian] = useState<boolean>(false);
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);

  const [type, setType] = useState<string>("");
  const [guestCounts, setGuestCounts] = useState<{
    adults: number;
    children: number;
  }>({
    adults: 1,
    children: 0,
  });

  const { data, error } = useSWR<{
    status: string;
    data: Record<string, BookingTypeData>;
  }>(
    bookingType
      ? `http://localhost:8080/api/bookings?type=${bookingType}`
      : null,
    fetcher
  );

  useEffect(() => {
    if (data && data.status === "success" && bookingType) {
      setBookingCards(data.data[bookingType]?.services || []);
    }
  }, [data, bookingType]);

  const handleOptionSelect = (option: string) => {
    setBookingType(option);
    setSelectedOption("");
    {
      /* isMutating */
    }
    // setIsLoading(true);
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
  // if (isLoading) return <Loading />;

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
          title: "Day Tour Packages",
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
                  imageSrc={card.imageUrl}
                  isSelected={selectedOption === card.name}
                  onSelect={() => setSelectedOption(card.name)}
                />
              ))}
            </div>
          ),
        }
      : null,
    bookingType === "cabins"
      ? {
          title: "Overnight",
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
