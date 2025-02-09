"use client";

import React, { useState } from "react";
import Header from "./../components/Header";
import Accordion from "./../components/Accordion";
import ScheduleSelector from "./../components/ScheduleSelector";
import BookingCard from "./../components/BookingCard";
import Additionals from "./../components/Additionals";
import GuestInformation from "../components/GuestInformation";

const Booking: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>("");

  const accordionItems = [
    {
      title: "Resort Schedule",
      content: <ScheduleSelector />,
    },
    {
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
          <BookingCard
            title="Swimming Pool Day Tour"
            description="Enjoy a fun-filled day at our swimming pool, perfect for families and groups looking for relaxation and recreation."
            price="₱500"
            additionalPrice="+ ₱ 200 per head"
            imageSrc="./assets/mini-cabin.png"
            isSelected={selectedOption === "river-day-tour"}
            onSelect={() => setSelectedOption("river-day-tour")}
          />
          <BookingCard
            title="Gazebo Day Tour"
            description="Ideal for birthday celebrations, receptions, and team-building activities."
            price="₱3,000"
            additionalPrice="+ ₱ 20 per head"
            imageSrc="./assets/mini-cabin.png"
            isSelected={selectedOption === "river-day-tour"}
            onSelect={() => setSelectedOption("river-day-tour")}
          />
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
          <BookingCard
            title="Camping Tent Rental"
            description="2 pillows and 2 blankets included"
            price="₱500"
            additionalPrice=""
            imageSrc="./assets/mini-cabin.png"
            isSelected={selectedOption === "river-day-tour"}
            onSelect={() => setSelectedOption("river-day-tour")}
          />
        </div>
      ),
    },
    {
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
      title: (
        <div>
          Additionals{" "}
          <span
            style={{
              fontSize: "0.85rem",
              backgroundColor: "#F3F3F3",
              color: "857E7E",
              padding: "0.2rem 2rem",
              marginLeft: "0.8rem",
              borderRadius: "50px",
            }}
          >
            Optional
          </span>
        </div>
      ),
      content: (
        <Additionals
          title="Cabana"
          price="₱500 - 10 pax"
          imageSrc="./assets/venti-cabin.png"
          isSelected={selectedOption === "venti-cabin"}
          onSelect={() => setSelectedOption("venti-cabin")}
        />
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
