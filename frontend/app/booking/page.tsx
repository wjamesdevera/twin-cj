"use client";

import React, { useState, useEffect } from "react";
import useSWR from "swr";
import Header from "./../components/Header";
import Accordion from "./../components/Accordion";
import ScheduleSelector from "./../components/ScheduleSelector";
import BookingCard from "./../components/BookingCard";
import Additionals from "./../components/Additionals";
import GuestInformation from "../components/GuestInformation";
import { Loading } from "../components/loading";
import { set } from "zod";

interface AccordionItem {
  title: string;
  content: React.JSX.Element;
  required?: boolean;
}

interface BookingCardData {
  name: string;
  description: string;
  price: number;
  additionalFee: string | null;
  imageUrl: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Booking: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [bookingType, setBookingType] = useState<string>("day-tour");
  const [bookingCards, setBookingCards] = useState<BookingCardData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
      console.log(data);
      if (
        bookingType === "day-tour" &&
        data.data &&
        Array.isArray(data.data.dayTours)
      ) {
        setBookingCards(data.data.dayTours);
      } else if (
        bookingType === "overnight" &&
        data.data &&
        Array.isArray(data.data.cabins)
      ) {
        setBookingCards(data.data.cabins);
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
                  additionalPrice={card.additionalFee || ""}
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
                  additionalPrice={card.additionalFee || ""}
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
      content: <GuestInformation />,
    },
  ].filter((item): item is AccordionItem => item !== null);

  return (
    <div>
      <Header />
      <main style={{ padding: "1rem" }}>
        <Accordion items={accordionItems} />
      </main>
    </div>
  );
};

export default Booking;
