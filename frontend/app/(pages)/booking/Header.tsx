import React, { useState } from "react";
import Image from "next/image";
import styles from "./header.module.scss";
import headerImage from "@/public/assets/header.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";

type GuestType = "adults" | "children";
type Action = "increment" | "decrement";

const GuestsDropdown: React.FC<{
  guestCounts: { adults: number; children: number };
  onApply: (counts: { adults: number; children: number }) => void;
}> = ({ guestCounts, onApply }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempGuestCounts, setTempGuestCounts] = useState(guestCounts);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleGuestChange = (type: GuestType, action: Action) => {
    setTempGuestCounts((prev) => {
      const updatedCount =
        action === "increment" ? prev[type] + 1 : Math.max(prev[type] - 1, 0);
      return { ...prev, [type]: updatedCount };
    });
  };

  const handleCancel = () => {
    setTempGuestCounts(guestCounts);
    setIsOpen(false);
  };

  const handleApply = () => {
    onApply(tempGuestCounts);
    setIsOpen(false);
  };

  return (
    <div className={styles["guests-dropdown"]}>
      <div className={styles["dropdown-summary"]} onClick={toggleDropdown}>
        {guestCounts.adults} Adult{guestCounts.adults > 1 ? "s" : ""},{" "}
        {guestCounts.children} Child
        {guestCounts.children > 1 ? "ren" : ""}
        <span className={styles["chevron-down"]}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 33 33"
            fill="none"
          >
            <g opacity="1">
              <path
                d="M8.03643 11.6458C8.43916 11.2431 9.0921 11.2431 9.49483 11.6458L15.9844 18.1353L22.4738 11.6458C22.8766 11.2431 23.5296 11.2431 23.9324 11.6458C24.335 12.0485 24.335 12.7015 23.9324 13.1042L16.7136 20.3229C16.3109 20.7257 15.6579 20.7257 15.2552 20.3229L8.03643 13.1042C7.63369 12.7015 7.63369 12.0485 8.03643 11.6458Z"
                fill="#7a7878"
              />
            </g>
          </svg>
        </span>
      </div>

      {isOpen && (
        <div className={styles["dropdown-content"]}>
          <div className={styles["dropdown-header"]}>
            <span className={styles["select-guests-label"]}>Select Guests</span>
          </div>

          <div
            className={styles["guest-row"]}
            style={{
              border: "1px solid #E0E0E0",
            }}
          >
            <span>Adults</span>
            <div className={styles["counter"]}>
              <button onClick={() => handleGuestChange("adults", "decrement")}>
                -
              </button>
              <span>{tempGuestCounts.adults}</span>
              <button onClick={() => handleGuestChange("adults", "increment")}>
                +
              </button>
            </div>
          </div>

          <div className={styles["guest-row"]}>
            <span>Children</span>
            <div className={styles["counter"]}>
              <button
                onClick={() => handleGuestChange("children", "decrement")}
              >
                -
              </button>
              <span>{tempGuestCounts.children}</span>
              <button
                onClick={() => handleGuestChange("children", "increment")}
              >
                +
              </button>
            </div>
          </div>

          <div className={styles["dropdown-actions"]}>
            <button className={styles["cancel-btn"]} onClick={handleCancel}>
              Cancel
            </button>
            <button className={styles["apply-btn"]} onClick={handleApply}>
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

interface HeaderProps {
  onCheckAvailability: (details: {
    checkInDate: Date | null;
    checkOutDate: Date | null;
    guestCounts: { adults: number; children: number };
  }) => void;
}

const Header: React.FC<HeaderProps> = ({ onCheckAvailability }) => {
  const [guestCounts, setGuestCounts] = useState({
    adults: 1,
    children: 0,
  });

  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);

  const handleApplyGuests = (counts: { adults: number; children: number }) => {
    setGuestCounts(counts);
  };

  const handleCheckAvailability = async () => {
    if (!checkInDate || !checkOutDate) {
      Swal.fire({
        title: "Please select check-in and check-out dates",
        icon: "error",
      });
      return;
    }

    //NOTE:
    if (checkInDate > checkOutDate) {
      Swal.fire({
        title: "Check-out date must be after check-in date",
        icon: "error",
      });
      return;
    }

    if (guestCounts.adults === 0 && guestCounts.children === 0) {
      Swal.fire({
        title: "Please select at least one guest",
        icon: "error",
      });
      return;
    }

    const url = `http://localhost:8080/api/bookings?type=cabins&checkInDate=${checkInDate.toISOString()}&checkOutDate=${checkOutDate.toISOString()}&_=${new Date().getTime()}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      if (!response.ok) {
        alert(`Error: ${data.error}`);
        return;
      }

      if (checkInDate && checkOutDate) {
        onCheckAvailability({
          checkInDate,
          checkOutDate,
          guestCounts,
        });

        // added a smooth scroll to the accordion
        setTimeout(() => {
          const accordionElement = document.getElementById("booking-accordion");
          if (accordionElement) {
            accordionElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 200);
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
    }
  };

  return (
    <header className={styles["header-container"]}>
      <Image
        src={headerImage}
        alt="Header Image"
        fill
        priority
        className={styles["header-image"]}
      />
      <div className={styles["header-overlay"]}>
        <h1 className={styles["header-title"]}>BOOK YOUR STAY</h1>
        <p className={styles["header-subtitle"]}>
          We are delighted to host you a memorable stay experience at Twin CJ
          Riverside Glamping Resort.
          <br />
          We look forward to creating an unforgettable experience for you.
        </p>

        <div className={styles["booking-form"]}>
          <div className={styles["form-field-group"]}>
            <label className={styles["form-label"]}>
              Check in <span className={styles.required}>*</span>
            </label>
            <DatePicker
              selected={checkInDate}
              onChange={(date: Date | null) => setCheckInDate(date)}
              placeholderText="Select check-in date"
              className={styles["form-input"]}
              dateFormat="MMMM d, yyyy"
              minDate={new Date()}
            />
          </div>

          <div className={styles["form-field-group"]}>
            <label className={styles["form-label"]}>
              Check out <span className={styles.required}>*</span>
            </label>
            <DatePicker
              selected={checkOutDate}
              onChange={(date: Date | null) => setCheckOutDate(date)}
              placeholderText="Select check-out date"
              className={styles["form-input"]}
              dateFormat="MMMM d, yyyy"
              minDate={checkInDate || new Date()}
            />
          </div>

          <div className={styles["form-field-group"]}>
            <label className={styles["form-label"]}>
              No. of Guests <span className={styles.required}>*</span>
            </label>
            <GuestsDropdown
              guestCounts={guestCounts}
              onApply={handleApplyGuests}
            />
          </div>

          <button
            className={styles["check-availability-btn"]}
            onClick={handleCheckAvailability}
          >
            CHECK AVAILABILITY
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
