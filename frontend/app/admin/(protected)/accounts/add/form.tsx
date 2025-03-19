"use client";

import React, { useState, useEffect } from "react";
import styles from "./form.module.scss";
import CustomButton from "../../../../components/custom_button";
import useSWRMutation from "swr/mutation";
import { register } from "@/app/lib/api";
import { useRouter } from "next/navigation";
import ConfirmModal from "../../../../components/confirm_modal";

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

  const [isFormTouched, setIsFormTouched] = useState(false);

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    onConfirm: (() => void) | null;
  }>({
    isOpen: false,
    title: "",
    onConfirm: null,
  });

  const openModal = (title: string, onConfirm: () => void) => {
    setModalConfig({
      isOpen: true,
      title,
      onConfirm,
    });
  };

  const closeModal = () => {
    setModalConfig({ isOpen: false, title: "", onConfirm: null });
  };


  const handleClearFields = (e: React.MouseEvent) => {
    e.preventDefault();
  
    openModal("Are you sure you want to clear all fields?", () => {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
      });
  
      setErrors({
        firstName: false,
        lastName: false,
        email: false,
        phoneNumber: false,
        password: false,
        confirmPassword: false,
      });
  
      setPasswordValidations({
        length: false,
        lowercase: false,
        uppercase: false,
        number: false,
        special: false,
      });
  
      setPasswordMatch(true);
      setIsEmailValid(true);
      setIsConfirmPasswordActive(false);
      setHasTypedConfirmPassword(false);
      setIsFormTouched(false);
  
      window.history.replaceState(null, "", window.location.href);
  
      closeModal();
    });
  };
  
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

    setIsConfirmPasswordActive(Object.values(validations).every(Boolean));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (name === "phoneNumber") {
        updatedValue = value.replace(/\D/g, "").slice(0, 11); 
    } else if (name === "firstName" || name === "lastName") {
        updatedValue = value.replace(/[^a-zA-Z\s]/g, "").slice(0, 50); 
    }

    setFormData((prev) => {
        if (prev[name as keyof typeof formData] === updatedValue) return prev;

        const updatedFormData = { ...prev, [name]: updatedValue };

        if (!isFormTouched) setIsFormTouched(true);

        if (name === "password") {
            validatePassword(updatedValue);
            setPasswordMatch(updatedValue === updatedFormData.confirmPassword);

            if (updatedValue === "") {
                updatedFormData.confirmPassword = "";
                setIsConfirmPasswordActive(false);
                setHasTypedConfirmPassword(false);
            }
        }

        if (name === "confirmPassword") {
            setPasswordMatch(updatedValue === updatedFormData.password);
            setHasTypedConfirmPassword(updatedValue.length > 0);
        }

        if (name === "email") {
            setIsEmailValid(validateEmail(updatedValue));
        }

        return updatedFormData;
    });

    setErrors((prev) => ({
        ...prev,
        firstName: name === "firstName" && !/^[A-Za-z\s]{2,}$/.test(updatedValue),
        lastName: name === "lastName" && !/^[A-Za-z\s]{2,}$/.test(updatedValue),
        email: name === "email" && !validateEmail(updatedValue),
        phoneNumber: name === "phoneNumber" && updatedValue.length > 0 && updatedValue.length !== 11,
        password:
            name === "password" &&
            !Object.values(passwordValidations).every(Boolean),
        confirmPassword: name === "confirmPassword" && updatedValue !== formData.password,
    }));
};

  const isFormValid = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      isEmailValid &&
      formData.phoneNumber.length === 11 &&
      Object.values(passwordValidations).every(Boolean) &&
      passwordMatch &&
      !Object.values(errors).includes(true)
    );
  };

  useEffect(() => {
    const handleBackButton = () => {
      if (isFormTouched) {
        openModal("Going back will lose your progress. Continue?", () => {
          closeModal(); 
          router.push("/admin/accounts"); 
        });
  
        window.history.pushState(null, "", window.location.href);
      }
    };
  
    if (isFormTouched) {
      window.history.pushState(null, "", window.location.href);
    }
  
    window.addEventListener("popstate", handleBackButton);
  
    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [router, isFormTouched]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!isFormValid()) {
      alert("Please fill out all required fields correctly.");
      return;
    }
  
    openModal("Are you sure you want to add this Admin?", () => {
      trigger(formData);
      closeModal();
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
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className={errors.phoneNumber ? styles.invalid_input : ""}
          />
        {errors.phoneNumber && (
          <span className={styles.error}>Must be 11 digits only.</span>
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

      <ConfirmModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        onConfirm={() => {
          if (modalConfig.onConfirm) {
            modalConfig.onConfirm();
          }
          setTimeout(() => {
            closeModal();
          }, 50);
        }}
        onClose={closeModal}
        confirmText="Yes"
        confirmColor="#A80000"
        cancelText="No"
        cancelColor="#CCCCCC"
      />

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
            onClick={(e) => handleClearFields(e)} 
            disabled={!isFormTouched}
          />

        </div>
      </div>
    </form>
    
  );
};

export default Form;
