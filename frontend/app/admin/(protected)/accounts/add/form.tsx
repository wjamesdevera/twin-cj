"use client";

import React, { useState, useEffect, useCallback } from "react";
import styles from "./form.module.scss";
import CustomButton from "@/app/components/custom_button";
import useSWRMutation from "swr/mutation";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ConfirmModal from "@/app/components/confirm_modal";
import {
  emailSchema,
  nameSchema,
  passwordSchema,
  phoneNumberSchema,
} from "@/app/lib/zodSchemas";
import { registerAccount } from "@/app/lib/api";
import { Loading } from "@/app/components/loading";

interface RegisterUserArg {
  confirmPassword: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phoneNumber: string;
}

const formSchema = z
  .object({
    firstName: nameSchema,
    lastName: nameSchema,
    email: emailSchema,
    phoneNumber: phoneNumberSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>;

const Form: React.FC = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const { trigger, isMutating } = useSWRMutation(
    "register",
    (key, { arg }: { arg: RegisterUserArg }) => registerAccount(arg),
    {
      onSuccess: () => {
        router.push("/admin/accounts");
      },
    }
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
      closeModal();
      reset();
    });
  };

  const handleBackButton = useCallback(() => {
    if (isDirty) {
      openModal("Going back will lose your progress. Continue?", () => {
        closeModal();
        router.push("/admin/accounts");
      });

      window.history.pushState(null, "", window.location.href);
    }
  }, [isDirty, router]);

  useEffect(() => {
    if (isDirty) {
      window.history.pushState(null, "", window.location.href);
    }

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [isDirty, handleBackButton]);

  const onSubmit = (data: FormData) => {
    console.log("Submitting...");
    openModal("Are you sure you want to add this Admin?", async () => {
      try {
        await trigger(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.message === "Email already in use") {
          setError(
            "email",
            { type: "focus", message: error.message },
            { shouldFocus: true }
          );
        } else if (error.message === "Phone number already in use") {
          setError(
            "phoneNumber",
            {
              type: "focus",
              message: error.message,
            },
            { shouldFocus: true }
          );
        }
      } finally {
        closeModal();
      }
    });
  };

  return isMutating ? (
    <Loading />
  ) : (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      {/* First Name */}
      <div className={styles.form_group}>
        <label>
          First Name <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          {...register("firstName")}
          required
          className={errors.firstName ? styles.invalid_input : ""}
          placeholder="Enter your first name"
        />
        {errors.firstName && (
          <span className={styles.error}>{errors.firstName.message}</span>
        )}
      </div>

      {/* Last Name */}
      <div className={styles.form_group}>
        <label>
          Last Name <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          {...register("lastName")}
          required
          className={errors.lastName ? styles.invalid_input : ""}
          placeholder="Enter your last name"
        />
        {errors.lastName && (
          <span className={styles.error}>{errors.lastName.message}</span>
        )}
      </div>

      {/* Email */}
      <div className={styles.form_group}>
        <label>
          Email <span className={styles.required}>*</span>
        </label>
        <input
          type="email"
          {...register("email")}
          required
          className={errors.email ? styles.invalid_input : ""}
          placeholder="email@email.com"
        />
        {errors.email && (
          <span className={styles.error}>{errors.email.message}</span>
        )}
      </div>

      {/* Phone Number */}
      <div className={styles.form_group}>
        <label>
          Phone Number <span className={styles.required}>*</span>
        </label>
        <input
          type="tel"
          maxLength={11}
          {...register("phoneNumber")}
          required
          className={errors.phoneNumber ? styles.invalid_input : ""}
          placeholder="09XXXXXXXXX"
        />
        {errors.phoneNumber && (
          <span className={styles.error}>{errors.phoneNumber.message}</span>
        )}
      </div>

      {/* Password */}
      <div className={styles.form_group}>
        <label>
          Password <span className={styles.required}>*</span>
        </label>
        <input type="password" {...register("password")} placeholder="Enter your password" required />
        {errors.password && (
          <span className={styles.error}>{errors.password.message}</span>
        )}
      </div>

      {/* Confirm Password */}
      <div className={styles.form_group}>
        <label>
          Confirm Password <span className={styles.required}>*</span>
        </label>
        <input type="password" {...register("confirmPassword")} placeholder="Confirm your password" required />
        {errors.confirmPassword && (
          <span className={styles.error}>{errors.confirmPassword.message}</span>
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
            type="submit"
          />
          <CustomButton
            label="Clear"
            variant="secondary"
            size="small"
            onClick={(e) => handleClearFields(e)}
          />
        </div>
      </div>
    </form>
  );
};

export default Form;
