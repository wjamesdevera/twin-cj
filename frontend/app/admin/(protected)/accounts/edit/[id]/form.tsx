"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./form.module.scss";
import CustomButton from "@/app/components/custom_button";
import { editUser } from "@/app/lib/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useSWRMutation from "swr/mutation";
import ConfirmModal from "@/app/components/confirm_modal";
import { useForm } from "react-hook-form";
import {
  emailSchema,
  nameSchema,
  phoneNumberSchema,
} from "@/app/lib/zodSchemas";

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

const formSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phoneNumber: phoneNumberSchema,
});

type FormData = z.infer<typeof formSchema>;

const Form: React.FC<EditUserFormArg> = ({
  id,
  firstName,
  lastName,
  email,
  phoneNumber,
}) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
    },
  });

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

  const onSubmit = async (data: FormData) => {
    openModal("Are you sure you want to save changes?", async () => {
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

  const handleCancel = () => {
    if (isDirty) {
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
      if (isDirty) {
        event.preventDefault();
        openModal("Going back will lose your progress. Continue?", () => {
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

    if (isDirty) {
      window.history.pushState(null, "", window.location.href);
    }

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [router, isDirty]);

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.form_group}>
        <label>First Name</label>
        <input
          type="text"
          {...register("firstName")}
          className={errors.firstName ? styles.invalid_input : ""}
          placeholder="Enter your first name"
        />
        {errors.firstName && (
          <span className={styles.error}>{errors.firstName.message}</span>
        )}
      </div>

      {/* Last Name */}
      <div className={styles.form_group}>
        <label>Last Name</label>
        <input
          type="text"
          {...register("lastName")}
          className={errors.lastName ? styles.invalid_input : ""}
          placeholder="Enter your last name"
        />
        {errors.lastName && (
          <span className={styles.error}>{errors.lastName.message}</span>
        )}
      </div>

      {/* Email */}
      <div className={styles.form_group}>
        <label>Email</label>
        <input
          type="email"
          {...register("email")}
          className={errors.email ? styles.invalid_input : ""}
          placeholder="email@email.com"
        />
        {errors.email && (
          <span className={styles.error}>{errors.email.message}</span>
        )}
      </div>

      {/* Phone Number */}
      <div className={styles.form_group}>
        <label>Phone Number</label>
        <input
          type="tel"
          maxLength={11}
          {...register("phoneNumber")}
          className={errors.phoneNumber ? styles.invalid_input : ""}
          placeholder="09XXXXXXXXX"
        />
        {errors.phoneNumber && (
          <span className={styles.error}>{errors.phoneNumber.message}</span>
        )}
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        onConfirm={modalConfig.onConfirm || closeModal}
        onClose={closeModal}
        confirmText="Yes"
        cancelText="No"
      />

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
            type="button"
            onClick={handleCancel}
          />
        </div>
      </div>
    </form>
  );
};

export default Form;
