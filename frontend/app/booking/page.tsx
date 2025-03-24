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
}

interface BookingCardData {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isBooked?: boolean;
}

interface BookingTypeData {
  services: BookingCardData[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Booking: React.FC = () => {
  const router = useRouter();
  const [bookingData, setBookingData] = useState({
    selectedOption: "",
    bookingType: null as string | null,
    bookingCards: [] as BookingCardData[],
    checkInDate: null as Date | null,
    checkOutDate: null as Date | null,
    guestCounts: { adults: 1, children: 0 },
  });

  const [availableServices, setAvailableServices] = useState<string[]>([]);
  const [showAccordion, setShowAccordion] = useState(false);

  const { data, error } = useSWR<{
    status: string;
    data: Record<string, BookingTypeData>;
  }>(
    bookingData.bookingType
      ? `http://localhost:8080/api/bookings?type=${
          bookingData.bookingType
        }&checkInDate=${bookingData.checkInDate?.toISOString()}&checkOutDate=${bookingData.checkOutDate?.toISOString()}`
      : null,
    fetcher
  );

  useEffect(() => {
    if (data?.status === "success" && bookingData.bookingType) {
      let services = data.data[bookingData.bookingType]?.services || [];

      // Filter out services that are booked
      services = services.filter((service) => !service.isBooked);

      setBookingData((prev) => ({
        ...prev,
        bookingCards: services,
      }));
      setAvailableServices(services.map((service) => service.name));
    }
  }, [data, bookingData.bookingType]);

  const handleConfirmBooking = (bookingDetails: any) => {
    const bookingPayload = {
      ...bookingData,
      guestCounts: bookingDetails.guestCounts || bookingData.guestCounts,
      contactNumber: bookingDetails.contactNumber,
      specialRequest: bookingDetails.specialRequest,
      email: bookingDetails.email,
      firstName: bookingDetails.firstName,
      lastName: bookingDetails.lastName,
      bookingCards: bookingData.bookingCards.filter(
        (card) => card.name === bookingData.selectedOption
      ),
    };
    sessionStorage.setItem("bookingData", JSON.stringify(bookingPayload));
    router.push("/payment_details");
  };

  const handleChange = (key: string, value: any) => {
    setBookingData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (error) return <div>Failed to load</div>;

  const accordionItems: AccordionItem[] = [
    {
      title: "Resort Schedule",
      content: (
        <ScheduleSelector
          selectedOption={bookingData.bookingType}
          handleOptionSelect={(option) => handleChange("bookingType", option)}
        />
      ),
    },
    bookingData.bookingType === "day-tour"
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
              {bookingData.bookingCards
                .filter((card) => availableServices.includes(card.name))
                .map((card) => (
                  <BookingCard
                    key={card.name}
                    title={card.name}
                    description={card.description}
                    price={`₱${card.price}`}
                    imageSrc={card.imageUrl}
                    isSelected={bookingData.selectedOption === card.name}
                    onSelect={() => handleChange("selectedOption", card.name)}
                  />
                ))}
            </div>
          ),
        }
      : null,
    bookingData.bookingType === "cabins"
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
              {bookingData.bookingCards
                .filter((card) => availableServices.includes(card.name))
                .map((card) => (
                  <BookingCard
                    key={card.name}
                    title={card.name}
                    description={card.description}
                    price={`₱${card.price}`}
                    imageSrc={card.imageUrl}
                    isSelected={bookingData.selectedOption === card.name}
                    onSelect={() => handleChange("selectedOption", card.name)}
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
      <Header
        onCheckAvailability={(details) => {
          handleChange("checkInDate", details.checkInDate);
          handleChange("checkOutDate", details.checkOutDate);
          handleChange("guestCounts", details.guestCounts);
          setShowAccordion(true);
        }}
      />
      {showAccordion && (
        <main style={{ padding: "1rem" }} id="booking-accordion">
          <Accordion items={accordionItems} initialOpenIndex={0} />
        </main>
      )}
    </div>
  );
};

export default Booking;
