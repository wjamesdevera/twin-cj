"use client";

import React, { useState } from "react";
import Header from "./../components/Header";
import Accordion from "./../components/Accordion";
import ScheduleSelector from "./../components/ScheduleSelector";
import BookingCard from "./../components/BookingCard";
import Additionals from "./../components/Additionals";
import GuestInformation from "../components/GuestInformation";

interface AccordionItem {
  title: string;
  content: React.JSX.Element;
  required?: boolean;
}

const Booking: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [selectedAdditionals, setSelectedAdditionals] = useState<string[]>([]);
  const [bookingType, setBookingType] = useState<string>("day-tour");

  const handleAdditionalSelect = (title: string) => {
    setSelectedAdditionals((prevSelected) => {
      if (prevSelected.includes(title)) {
        return prevSelected.filter((item) => item !== title);
      } else {
        return [...prevSelected, title];
      }
    });
  };

  const handleOptionSelect = (option: string) => {
    setBookingType(option);
    setSelectedOption("");
  };

  const accordionItems = [
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

              <BookingCard
                title="River Day Tour"
                description="Enjoy a relaxing escape with our River Day Tour, offering serene views of the Norzagaray and Angat Rivers."
                price="₱300"
                additionalPrice="+ ₱ 20 per head"
                imageSrc="./assets/mini-cabin.png"
                isSelected={selectedOption === "river-day-tour"}
                onSelect={() => setSelectedOption("river-day-tour")}
              />
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
              <BookingCard
                title="Mini Cabin"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi at neque egestas turpis varius pellentesque vitae sed est."
                price="₱2,000"
                additionalPrice="for 2 pax"
                imageSrc="./assets/mini-cabin.png"
                isSelected={selectedOption === "mini-cabin"}
                onSelect={() => setSelectedOption("mini-cabin")}
              />
            </div>
          ),
        }
      : null,
    {
      title: "Booking Details",
      content: <GuestInformation />,
    },
  ].filter((item): item is AccordionItem => item !== null) as AccordionItem[];

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
