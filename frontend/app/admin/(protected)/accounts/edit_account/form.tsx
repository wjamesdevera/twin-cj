"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./form.module.scss";
import CustomButton from "../../../../components/custom_button";

const Form: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    email: false,
    phoneNumber: false,
    password: false,
    confirmPassword: false,
  });

  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
  });

  const [passwordMatch, setPasswordMatch] = useState(true);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password: string) => {
    setPasswordValidations({
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password),
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (name === "phoneNumber") {
      updatedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    if (name === "firstName" || name === "lastName") {
      updatedValue = value.replace(/[^a-zA-Z]/g, "").slice(0, 50);
    }

    setFormData((prev) => {
      const updatedFormData = {
        ...prev,
        [name]: updatedValue,
      };

      if (name === "password") {
        validatePassword(value);
        setPasswordMatch(value === updatedFormData.confirmPassword);
      }

      if (name === "confirmPassword") {
        setPasswordMatch(value === updatedFormData.password);
      }

      if (name === "email") {
        setIsEmailValid(value === "" || validateEmail(value));
      }

      return updatedFormData;
    });

    setErrors((prev) => ({
      ...prev,
      email: name === "email" && value !== "" && !validateEmail(value),
      phoneNumber:
        name === "phoneNumber" && value !== "" && value.length !== 10,
      password:
        name === "password" &&
        value !== "" &&
        !Object.values(passwordValidations).every(Boolean),
      confirmPassword:
        name === "confirmPassword" &&
        value !== "" &&
        value !== formData.password,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted", {
      ...formData,
      phoneNumber: formData.phoneNumber ? `+63${formData.phoneNumber}` : "",
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* First Name */}
      <div className={styles.form_group}>
        <label>First Name</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />
      </div>

      {/* Last Name */}
      <div className={styles.form_group}>
        <label>Last Name</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />
      </div>

      {/* Email */}
      <div className={styles.form_group}>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? styles.invalid_input : ""}
        />
        {errors.email && (
          <span className={styles.error}>Invalid email address</span>
        )}
      </div>

      {/* Phone Number */}
      <div className={styles.form_group}>
        <label>Phone Number</label>
        <div className={styles.phone_input_container}>
          <span className={styles.phone_prefix}>+63</span>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className={errors.phoneNumber ? styles.invalid_input : ""}
          />
        </div>
        {errors.phoneNumber && (
          <span className={styles.error}>Must be 10 digits only.</span>
        )}
      </div>

      {/* Password */}
      <div className={styles.form_group}>
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          onFocus={() => setIsPasswordFocused(true)}
          onBlur={() => setIsPasswordFocused(false)}
        />
        {isPasswordFocused && formData.password && (
          <div className={styles.password_requirements}>
            <p>
              <strong>Your password must contain:</strong>
            </p>
            <ul>
              <li
                className={
                  passwordValidations.length ? styles.valid : styles.invalid
                }
              >
                ✔ At least 8 characters
              </li>
              <li
                className={
                  passwordValidations.lowercase ? styles.valid : styles.invalid
                }
              >
                ✔ Lowercase letter (a-z)
              </li>
              <li
                className={
                  passwordValidations.uppercase ? styles.valid : styles.invalid
                }
              >
                ✔ Uppercase letter (A-Z)
              </li>
              <li
                className={
                  passwordValidations.number ? styles.valid : styles.invalid
                }
              >
                ✔ Number (0-9)
              </li>
              <li
                className={
                  passwordValidations.special ? styles.valid : styles.invalid
                }
              >
                ✔ Special character (!@#$%^&*)
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div className={styles.form_group}>
        <label>Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          disabled={!formData.password}
        />
        {!passwordMatch && formData.confirmPassword && (
          <span className={styles.error}>Passwords do not match.</span>
        )}
      </div>

      {/* Buttons */}
      <div className={`${styles.form_group} ${styles.full_width}`}>
        <div className={styles.button_container}>
          <CustomButton label="Save Changes" variant="primary" size="small" />
          <CustomButton
            label="Cancel"
            variant="secondary"
            size="small"
            onClick={() => router.push("/admin/admin_accounts")}
          />
        </div>
      </div>
    </form>
  );
};

export default Form;
