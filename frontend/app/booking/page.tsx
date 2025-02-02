"use client";

import React, { useState } from "react";
import Header from "./../components/Header";
import Accordion from "./../components/Accordion";
import ScheduleSelector from "./../components/ScheduleSelector";
import BookingCard from "./../components/BookingCard";
import GuestInformation from "../components/GuestInformation";

const Booking: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>("");

  const accordionItems = [
    {
      title: "Resort Schedule",
      content: <ScheduleSelector />,
    },
    {
      title: "Cabins",
      content: (
        <div style={{ display: "grid", gap: "1rem" }}>
          <p
            style={{
              fontSize: "1rem",
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
          <BookingCard
            title="Maxi Cabin"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi at neque egestas turpis varius pellentesque vitae sed est."
            price="₱5,000"
            additionalPrice="for 6-8 pax"
            imageSrc="./assets/maxi-cabin.png"
            isSelected={selectedOption === "maxi-cabin"}
            onSelect={() => setSelectedOption("maxi-cabin")}
          />
          <BookingCard
            title="Venti Cabin"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi at neque egestas turpis varius pellentesque vitae sed est."
            price="₱10,000"
            additionalPrice="for 15-20 pax"
            imageSrc="./assets/venti-cabin.png"
            isSelected={selectedOption === "venti-cabin"}
            onSelect={() => setSelectedOption("venti-cabin")}
          />
        </div>
      ),
    },
    {
      title: "Booking Details",
      content: <GuestInformation />,
    },
  ];

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
