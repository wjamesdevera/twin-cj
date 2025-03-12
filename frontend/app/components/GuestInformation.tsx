import React, { useState } from "react";
import styles from "./guestinformation.module.scss";
import BookingButton from "./BookingButton";
import TermsAndConditions from "./TermsandConditions";

const GuestInformation: React.FC = () => {
  // State for form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [retypeEmail, setRetypeEmail] = useState("");

  // State for validation messages
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [contactNumberError, setContactNumberError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [retypeEmailError, setRetypeEmailError] = useState("");

  // State for the checkboxes
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isPrivacyChecked, setIsPrivacyChecked] = useState(false);

  // Validate First Name and Last Name (alphabetic only)
  const validateName = (name: string, field: "firstName" | "lastName") => {
    const regex = /^[A-Za-z]+$/;
    if (!regex.test(name)) {
      if (field === "firstName") {
        setFirstNameError("First Name should only contain letters.");
      } else {
        setLastNameError("Last Name should only contain letters.");
      }
    } else {
      if (field === "firstName") {
        setFirstNameError("");
      } else {
        setLastNameError("");
      }
    }
  };

  // Validate Contact Number (numbers only and up to 11 digits)
  const validateContactNumber = (number: string) => {
    const regex = /^\d+$/;
    if (!regex.test(number)) {
      setContactNumberError("Contact Number should only contain numbers.");
    } else if (number.length > 11) {
      setContactNumberError("Contact Number should not exceed 11 digits.");
    } else {
      setContactNumberError("");
    }
  };

  // Validate Email
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  // Ensure email matches the re-typed email
  const validateRetypeEmail = (retypeEmail: string) => {
    if (retypeEmail !== email) {
      setRetypeEmailError("Emails do not match.");
    } else {
      setRetypeEmailError("");
    }
  };

  // Check if all fields are filled and both checkboxes are checked
  const isFormValid =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    contactNumber.trim() !== "" &&
    email.trim() !== "" &&
    retypeEmail.trim() !== "" &&
    email === retypeEmail &&
    isTermsChecked &&
    isPrivacyChecked &&
    !firstNameError &&
    !lastNameError &&
    !contactNumberError &&
    !emailError &&
    !retypeEmailError;

  return (
    <div className={styles.guestInfoContainer}>
      <h2 className={styles.sectionTitle}>Guest Information</h2>
      <form className={styles.form}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label>First Name</label>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                validateName(e.target.value, "firstName");
              }}
              className={firstNameError ? styles.errorInput : ""}
            />
            {firstNameError && (
              <p className={styles.errorText}>{firstNameError}</p>
            )}
          </div>
          <div className={styles.field}>
            <label>Last Name</label>
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                validateName(e.target.value, "lastName");
              }}
              className={lastNameError ? styles.errorInput : ""}
            />
            {lastNameError && (
              <p className={styles.errorText}>{lastNameError}</p>
            )}
          </div>
          <div className={styles.field}>
            <label>Contact Number</label>
            <input
              type="text"
              placeholder="09123456789"
              value={contactNumber}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 11) {
                  setContactNumber(value);
                  validateContactNumber(value);
                }
              }}
              maxLength={11}
              className={contactNumberError ? styles.errorInput : ""}
            />
            {contactNumberError && (
              <p className={styles.errorText}>{contactNumberError}</p>
            )}
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Type your Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateEmail(e.target.value);
              }}
              className={emailError ? styles.errorInput : ""}
            />
            {emailError && <p className={styles.errorText}>{emailError}</p>}
          </div>
          <div className={styles.field}>
            <label>Re-type Email</label>
            <input
              type="email"
              placeholder="Re-type your Email"
              value={retypeEmail}
              onChange={(e) => {
                setRetypeEmail(e.target.value);
                validateRetypeEmail(e.target.value);
              }}
              className={retypeEmailError ? styles.errorInput : ""}
            />
            {retypeEmailError && (
              <p className={styles.errorText}>{retypeEmailError}</p>
            )}
          </div>
        </div>
        <div className={styles.checkboxRow}>
          <label>
            <input
              type="checkbox"
              checked={isTermsChecked}
              disabled={!isTermsChecked}
              readOnly // prevents the user to uncheck the checkbox
            />{" "}
            I have read and agree to the{" "}
            <TermsAndConditions
              type="terms"
              onAgree={() => setIsTermsChecked(true)}
            />
            .
          </label>
          <label>
            <input
              type="checkbox"
              checked={isPrivacyChecked}
              disabled={!isPrivacyChecked}
              readOnly
            />{" "}
            I consent to the processing of my personal data as explained in the{" "}
            <TermsAndConditions
              type="privacy"
              onAgree={() => setIsPrivacyChecked(true)}
            />
            .
          </label>
        </div>
      </form>

      {/* Disable the button unless all fields are filled and both checkboxes are checked */}
      <BookingButton
        text="Proceed to Payment"
        onClick={() => {}}
        disabled={!isFormValid}
      />
    </div>
  );
};

export default GuestInformation;
