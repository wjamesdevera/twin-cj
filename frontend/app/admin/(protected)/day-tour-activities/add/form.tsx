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
  file: fileSchema,
  price: priceSchema.or(z.number().gt(0)),
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
    watch,
    formState: { errors },
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
                Day Tour Name <span className={styles.required}>*</span>
              </label>
              <input type="text" {...register("name")} maxLength={51} placeholder="Enter the day tour name" />
              {errors.name && (
                <span className={styles.error}>{errors.name.message}</span>
              )}
            </div>

            <div className={styles.form_group}>
              <label>
                Description <span className={styles.required}>*</span>
              </label>
              <textarea {...register("description")} maxLength={501} placeholder="Enter the description" />
              {errors.description && (
                <span className={styles.error}>
                  {errors.description.message}
                </span>
              )}
              <p className={styles["char-count"]}>
                {watch("description")?.length || 0}/500 characters
              </p>
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
