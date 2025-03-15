"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./form.module.scss";
import CustomButton from "@/app/components/custom_button";
import { editUser } from "@/app/lib/api";
import useSWRMutation from "swr/mutation";
import ConfirmModal from "@/app/components/confirm_modal";

interface EditUserArg {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

interface EditUserFormArg {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

const Form: React.FC<EditUserFormArg> = ({
  id,
  firstName,
  lastName,
  email,
  phoneNumber,
}) => {
  const router = useRouter();
  const [isFormTouched, setIsFormTouched] = useState(false);
  const [formData, setFormData] = useState<EditUserArg>({
    firstName: firstName,
    lastName: lastName,
    email: email,
    phoneNumber: phoneNumber,
  });

  const validateName = (name: string) =>
    name ? name.trim().length >= 2 : null;

  const [isFormValid, setIsFormValid] = useState(false);

  const { trigger } = useSWRMutation(
    "edit",
    (key, { arg }: { arg: EditUserArg }) => editUser(id, arg)
  );

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
    setModalConfig({ isOpen: true, title, onConfirm });
  };

  const closeModal = () => {
    setModalConfig({ isOpen: false, title: "", onConfirm: null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) return;

    openModal("Are you sure you want to save changes?", async () => {
      try {
        await trigger(formData);
        localStorage.setItem("adminUpdated", "true");
        router.push("/admin/accounts");
      } catch (error) {
        console.error("Failed to update user:", error);
      }
      closeModal();
    });
  };

  const handleCancel = () => {
    if (isFormTouched) {
      openModal(
        "Are you sure you want to cancel? Unsaved changes will be lost.",
        () => {
          router.push("/admin/accounts");
          closeModal();
        }
      );
    } else {
      router.push("/admin/accounts");
    }
  };

  useEffect(() => {
    const handleBackButton = (event: PopStateEvent) => {
      if (isFormTouched) {
        event.preventDefault();
        openModal("Going back will lose your progress. Continue?", () => {
          setIsFormTouched(false);
          closeModal();
          window.removeEventListener("popstate", handleBackButton);
          router.back();
        });

        window.history.pushState(null, "", window.location.href);
      } else {
        window.removeEventListener("popstate", handleBackButton);
        router.back();
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

  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phoneNumber: false,
  });

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (name === "phoneNumber") {
      updatedValue = value.replace(/\D/g, "").slice(0, 11);
    }

    if (name === "firstName" || name === "lastName") {
      updatedValue = value.replace(/[^a-zA-Z\s]/g, "").slice(0, 50);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    setErrors((prev) => ({
      ...prev,
      firstName: name === "firstName" && !validateName(updatedValue),
      lastName: name === "lastName" && !validateName(updatedValue),
      email:
        name === "email" && updatedValue !== "" && !validateEmail(updatedValue),
      phoneNumber: name === "phoneNumber" && updatedValue.length !== 11,
    }));

    setIsFormValid(Object.values(errors).some((error) => error));
    setIsFormTouched(true);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.form_group}>
        <label>First Name</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className={errors.firstName ? styles.invalid_input : ""}
        />
        {errors.firstName && (
          <span className={styles.error}>Must be at least 2 letters.</span>
        )}
      </div>

      {/* Last Name */}
      <div className={styles.form_group}>
        <label>Last Name</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className={errors.lastName ? styles.invalid_input : ""}
        />
        {errors.lastName && (
          <span className={styles.error}>Must be at least 2 letters.</span>
        )}
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
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          className={errors.phoneNumber ? styles.invalid_input : ""}
        />
        {errors.phoneNumber && (
          <span className={styles.error}>Must be 11 digits only.</span>
        )}
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        onConfirm={modalConfig.onConfirm || closeModal}
        onClose={closeModal}
        confirmText="Yes"
        confirmColor="#A80000"
        cancelText="No"
        cancelColor="#CCCCCC"
      />

      {/* Buttons */}
      <div className={`${styles.form_group} ${styles.full_width}`}>
        <div className={styles.button_container}>
          <CustomButton
            label="Save Changes"
            variant="primary"
            size="small"
            type="submit"
            disabled={!isFormValid}
          />
          <CustomButton
            label="Cancel"
            variant="secondary"
            size="small"
            type="button"
            onClick={handleCancel}
          />
        </div>
      </div>
    </form>
  );
};

export default Form;
