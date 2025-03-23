"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loading } from "@/app/components/loading";
import styles from "./form.module.scss";
import CustomButton from "@/app/components/custom_button";
import ConfirmModal from "@/app/components/confirm_modal";
import NotificationModal from "@/app/components/notification_modal";
import {
  descriptionSchema,
  fileSchema,
  nameSchema,
  priceSchema,
} from "@/app/lib/zodSchemas";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useSWRMutation from "swr/mutation";
import { createDayTour } from "@/app/lib/api";

export const dayTourSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
  file: fileSchema.optional(),
  price: priceSchema.or(z.number().gt(0)),
  additionalFee: z
    .object({
      additionalFeeType: z
        .string()
        .trim()
        .transform((val) => (val === "" ? undefined : val)) // Convert empty string to undefined
        .optional() // Make field optional
        .refine((val) => val === undefined || val.length >= 2, {
          message: "Name must be at least 2 characters",
        })
        .refine((val) => val === undefined || val.length <= 50, {
          message: "Name must be at most 50 characters long",
        })
        .refine((val) => val === undefined || /^[A-Za-z\s]+$/.test(val), {
          message: "Name can only contain letters and spaces",
        })
        .transform((val) => (val ? val.replace(/\s+/g, " ").trim() : val)),
      description: z
        .string()
        .trim()
        .transform((val) => (val === "" ? undefined : val)) // Convert empty string to undefined
        .optional() // Make field optional
        .refine(
          (val) => val === undefined || val.length >= 2,
          "Description is required"
        )
        .refine(
          (val) => val === undefined || val.length <= 100,
          "Description is required"
        )
        .refine(
          (val) => (val === undefined ? true : val.trim().length > 0),
          "Description cannot be just spaces"
        )
        .optional(),
      amount: z
        .string()
        .trim()
        .transform((val) => (val === "" ? undefined : val)) // Convert empty string to undefined
        .optional() // Make field optional
        .refine((val) => val === undefined || /^[0-9.]+$/.test(val), {
          message: "Price must be a number",
        })
        .refine((val) => val === undefined || Number(val) >= 0, {
          message: "Invalid price",
        })
        .or(z.number().gte(0)),
    })
    .optional(),
});

type AddDayTourData = z.infer<typeof dayTourSchema>;

export default function DayTourForm() {
  const router = useRouter();

  const { trigger, isMutating } = useSWRMutation(
    "add",
    (key, { arg }: { arg: FormData }) => createDayTour(arg),
    {
      onSuccess: () => {
        router.push("/admin/day-tour-activities");
      },
    }
  );

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, dirtyFields },
  } = useForm<AddDayTourData>({
    resolver: zodResolver(dayTourSchema),
  });

  const [notification, setNotification] = useState<{
    isOpen: boolean;
    message: string;
    type: "success" | "error";
  }>({
    isOpen: false,
    message: "",
    type: "success",
  });

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(
    () => () => {}
  );
  const [confirmMessage, setConfirmMessage] = useState("");

  const handleClear = () => {
    setConfirmAction(() => () => {
      reset();
    });

    setConfirmMessage("Are you sure you want to clear all the fields?");
    setIsConfirmModalOpen(true);
  };

  const handleCancel = () => {
    setConfirmAction(() => () => router.back());
    setConfirmMessage("Are you sure you want to cancel?");
    setIsConfirmModalOpen(true);
  };

  const onSubmit = async (formData: AddDayTourData) => {
    setConfirmAction(() => () => {
      const data = new FormData();
      const jsonData = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        additionalFee:
          dirtyFields["additionalFee"] && formData.additionalFee
            ? {
                type: formData.additionalFee.additionalFeeType || "",
                description: formData.additionalFee.description || "",
                amount: Number(formData.additionalFee.amount),
              }
            : undefined,
      };

      data.append("data", JSON.stringify(jsonData));
      if (formData.file) {
        data.append("file", formData.file);
      }

      console.log(data);

      trigger(data);
      setNotification({
        isOpen: true,
        message: "Cabin added successfully!",
        type: "success",
      });

      router.push("/admin/day-tour-activities");
    });

    setConfirmMessage("Are you sure you want to add this day tour?");
    setIsConfirmModalOpen(true);
  };

  return (
    <div>
      {isMutating ? (
        <Loading />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.left_column}>
            <div className={styles.form_group}>
              <label>
                Title<span className={styles.required}>*</span>
              </label>
              <input type="text" {...register("name")} maxLength={50} />
              {errors.name && (
                <span className={styles.error}>{errors.name.message}</span>
              )}
            </div>

            <div className={styles.form_group}>
              <label>
                Description <span className={styles.required}>*</span>
              </label>
              <textarea {...register("description")} maxLength={100} />
              {errors.description && (
                <span className={styles.error}>
                  {errors.description.message}
                </span>
              )}
            </div>
          </div>
          <div className={styles.right_column}>
            <div className={styles.form_group}>
              <label>
                Rate <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                placeholder="₱"
                data-section="service"
                {...register("price")}
                min="1"
                step="0.01"
                className={styles.short_input}
              />
              {errors.price && (
                <span className={styles.error}>{errors.price.message}</span>
              )}
            </div>

            <div className={styles.form_group}>
              <label>
                Upload Image <span className={styles.required}>*</span>
              </label>
              <input
                type="file"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setValue("file", e.target.files[0]); // Manually set value
                  }
                }}
              />
              {errors.file && (
                <span className={styles.error}>{errors.file.message}</span>
              )}
            </div>
          </div>
          <div className={styles.full_width}>
            <h3 className={styles.section_title}>Additional Fees (Optional)</h3>
            <div className={styles.additional_fees_container}>
              <div className={styles.additional_fees_left}>
                <div className={styles.form_group}>
                  <label>Type</label>
                  <input
                    type="text"
                    {...register("additionalFee.additionalFeeType")}
                    maxLength={50}
                  />
                  {errors.additionalFee?.additionalFeeType && (
                    <span className={styles.error}>
                      {errors.additionalFee.additionalFeeType.message}
                    </span>
                  )}
                </div>

                <div className={styles.form_group}>
                  <label>Description</label>
                  <textarea
                    rows={3}
                    cols={30}
                    maxLength={100}
                    {...register("additionalFee.description")}
                  />
                  {errors.additionalFee?.description && (
                    <span className={styles.error}>
                      {errors.additionalFee.description.message}
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.additional_fees_right}>
                <div className={styles.form_group}>
                  <label>Amount</label>
                  <input
                    type="number"
                    placeholder="₱"
                    min="0"
                    step="0.01"
                    {...register("additionalFee.amount")}
                    className={styles.short_input}
                  />
                  {errors.additionalFee?.amount && (
                    <span className={styles.error}>
                      {errors.additionalFee.amount.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className={styles.full_width}>
            <div className={styles.button_container}>
              <CustomButton type="submit" label="Add Day Tour" />
              <CustomButton
                type="button"
                label="Clear"
                variant="secondary"
                onClick={handleClear}
              />
              <CustomButton
                type="button"
                label="Cancel"
                variant="danger"
                onClick={handleCancel}
              />
            </div>
          </div>
        </form>
      )}

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={() => {
          confirmAction();
          setIsConfirmModalOpen(false);
        }}
        title={confirmMessage}
        confirmText="Yes"
        cancelText="No"
      />
      <NotificationModal
        isOpen={notification.isOpen}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ ...notification, isOpen: false })}
      />
    </div>
  );
}
