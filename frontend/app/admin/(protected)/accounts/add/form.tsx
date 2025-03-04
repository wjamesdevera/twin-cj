"use client";

import React, { useState } from "react";
import styles from "./form.module.scss";
import CustomButton from "../../../../components/custom_button";
import useSWRMutation from "swr/mutation";
import { register } from "@/app/lib/api";
import { useRouter } from "next/navigation";

type RegisterUserArg = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
};

const Form: React.FC = () => {
  const router = useRouter();
  const { trigger } = useSWRMutation(
    "register",
    (key, { arg }: { arg: RegisterUserArg }) => register(arg),
    {
      onSuccess: () => {
        localStorage.setItem("adminAdded", "true"); 
        router.push("/admin/accounts"); 
      },
    }
  );
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
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
  const [isConfirmPasswordActive, setIsConfirmPasswordActive] = useState(false);
  const [hasTypedConfirmPassword, setHasTypedConfirmPassword] = useState(false);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password: string) => {
    const validations = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password),
    };

    setPasswordValidations(validations);

    // Enable confirm password field only if all password requirements are met
    setIsConfirmPasswordActive(Object.values(validations).every(Boolean));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (name === "phoneNumber") {
      updatedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    if (name === "firstName" || name === "lastName") {
      updatedValue = value.replace(/[^a-zA-Z\s]/g, "").slice(0, 50);
    }
    
    setFormData((prev) => {
      const updatedFormData = {
        ...prev,
        [name]: updatedValue,
      };

      if (name === "password") {
        validatePassword(value);
        setPasswordMatch(value === updatedFormData.confirmPassword);

        // If password is cleared, reset confirmPassword and disable it
        if (value === "") {
          updatedFormData.confirmPassword = "";
          setIsConfirmPasswordActive(false);
          setHasTypedConfirmPassword(false);
        }
      }

      if (name === "confirmPassword") {
        setPasswordMatch(value === updatedFormData.password);
        setHasTypedConfirmPassword(value.length > 0);
      }

      if (name === "email") {
        setIsEmailValid(validateEmail(value));
      }

      return updatedFormData;
    });

    setErrors((prev) => ({
      ...prev,
      firstName: name === "firstName" && !/^[A-Za-z\s]{2,}$/.test(value),
      lastName: name === "lastName" && !/^[A-Za-z\s]{2,}$/.test(value),
      email: name === "email" && !validateEmail(value),
      phoneNumber: name === "phoneNumber" && value.length !== 10,
      password:
        name === "password" &&
        !Object.values(passwordValidations).every(Boolean),
      confirmPassword:
        name === "confirmPassword" && value !== formData.password,
    }));
  };

  const isFormValid = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      isEmailValid &&
      formData.phoneNumber.length === 10 &&
      Object.values(passwordValidations).every(Boolean) &&
      passwordMatch &&
      !Object.values(errors).includes(true)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      alert("Please fill out all required fields correctly.");
      return;
    }

    trigger({
      ...formData,
      phoneNumber: `+63${formData.phoneNumber}`,
    });

    console.log("Form Submitted", {
      ...formData,
      phoneNumber: `+63${formData.phoneNumber}`,
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* First Name */}
      <div className={styles.form_group}>
        <label>
          First Name <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
          className={errors.firstName ? styles.invalid_input : ""}
        />
        {errors.firstName && (
          <span className={styles.error}>Must be at least 2 letters.</span>
        )}
      </div>

      {/* Last Name */}
      <div className={styles.form_group}>
        <label>
          Last Name <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
          className={errors.lastName ? styles.invalid_input : ""}
        />
        {errors.lastName && (
          <span className={styles.error}>Must be at least 2 letters.</span>
        )}
      </div>

      {/* Email */}
      <div className={styles.form_group}>
        <label>
          Email <span className={styles.required}>*</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className={errors.email ? styles.invalid_input : ""}
        />
        {!isEmailValid && (
          <span className={styles.error}>Invalid email address</span>
        )}
      </div>

      {/* Phone Number */}
      <div className={styles.form_group}>
        <label>
          Phone Number <span className={styles.required}>*</span>
        </label>
        <div className={styles.phone_input_container}>
          <span className={styles.phone_prefix}>+63</span>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className={errors.phoneNumber ? styles.invalid_input : ""}
          />
        </div>
        {errors.phoneNumber && (
          <span className={styles.error}>Must be 10 digits only.</span>
        )}
      </div>

      {/* Password */}
      <div className={styles.form_group}>
        <label>
          Password <span className={styles.required}>*</span>
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          onFocus={() => setIsPasswordFocused(true)}
          onBlur={() => setIsPasswordFocused(false)}
          required
        />
        {isPasswordFocused && (
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
        <label>
          Confirm Password <span className={styles.required}>*</span>
        </label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          disabled={!isConfirmPasswordActive}
        />
        {hasTypedConfirmPassword && !passwordMatch && (
          <span className={styles.error}>Passwords do not match.</span>
        )}
      </div>

      {/* Buttons */}
      <div className={`${styles.form_group} ${styles.full_width}`}>
        <div className={styles.button_container}>
          <CustomButton
            label="Add Admin"
            variant="primary"
            size="small"
            disabled={!isFormValid()}
            onClick={handleSubmit}
          />
          <CustomButton
            label="Clear"
            variant="secondary"
            size="small"
            onClick={() => {
              setFormData(() => ({
                firstName: "",
                lastName: "",
                email: "",
                phoneNumber: "",
                password: "",
                confirmPassword: "",
              }));

              setErrors(() => ({
                firstName: false,
                lastName: false,
                email: false,
                phoneNumber: false,
                password: false,
                confirmPassword: false,
              }));

              setPasswordValidations(() => ({
                length: false,
                lowercase: false,
                uppercase: false,
                number: false,
                special: false,
              }));

              setPasswordMatch(true);
              setIsEmailValid(true);
              setIsConfirmPasswordActive(false);
              setHasTypedConfirmPassword(false);
            }}
          />
        </div>
      </div>
    </form>
  );
};

export default Form;
