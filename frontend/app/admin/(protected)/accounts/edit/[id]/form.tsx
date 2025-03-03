"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "./form.module.scss";
import CustomButton from "@/app/components/custom_button";
import useSWR from "swr";
import { editUser, getUserById } from "@/app/lib/api";
import { Loading } from "@/app/components/loading";
import useSWRMutation from "swr/mutation";

interface EditUserArg {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

const Form: React.FC = () => {
  const [formData, setFormData] = useState<EditUserArg>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });
  const { id } = useParams<{ id: string }>();
  const { data: userData, isLoading } = useSWR(id, getUserById);
  const { trigger } = useSWRMutation(
    "edit",
    (key, { arg }: { arg: EditUserArg }) => editUser(id, arg)
  );
  useEffect(() => {
    if (userData?.data) {
      setFormData({
        firstName: userData.data.firstName || "",
        lastName: userData.data.lastName || "",
        email: userData.data.email || "",
        phoneNumber: userData.data.phoneNumber || "",
      });
    }
  }, [userData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trigger(formData);
  };

  const [errors, setErrors] = useState({
    email: false,
    phoneNumber: false,
  });

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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

      return updatedFormData;
    });

    setErrors((prev) => ({
      ...prev,
      email: name === "email" && value !== "" && !validateEmail(value),
      phoneNumber:
        name === "phoneNumber" && value !== "" && value.length !== 10,
    }));
  };

  return isLoading ? (
    <Loading />
  ) : (
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

      {/* Buttons */}
      <div className={`${styles.form_group} ${styles.full_width}`}>
        <div className={styles.button_container}>
          <CustomButton
            label="Save Changes"
            variant="primary"
            size="small"
            type="submit"
          />
          <CustomButton
            label="Cancel"
            variant="secondary"
            size="small"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </form>
  );
};

export default Form;
