"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loading } from "@/app/components/loading";
import styles from "./form.module.scss";
import CustomButton from "@/app/components/custom_button";
import ConfirmModal from "@/app/components/confirm_modal";
import NotificationModal from "@/app/components/notification_modal";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useSWRMutation from "swr/mutation";
import { updateDayTour } from "@/app/lib/api";
import { dayTourSchema } from "../../add/form";

interface DayTourProps {
  id: string;
  defaultValues: DayTourFormData;
}

type DayTourFormData = z.infer<typeof dayTourSchema>;

export default function EditDayTour({ id, defaultValues }: DayTourProps) {
  const router = useRouter();
  console.log(defaultValues);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DayTourFormData>({
    resolver: zodResolver(dayTourSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  const { trigger, isMutating, error } = useSWRMutation(
    "edit",
    (key, { arg }: { arg: FormData }) => updateDayTour(id, arg),
    {
      onError: () => {
        console.log(error);
      },
    }
  );

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(
    () => () => {}
  );
  const [confirmMessage, setConfirmMessage] = useState("");

  const [notification, setNotification] = useState<{
    isOpen: boolean;
    message: string;
    type: "success" | "error";
  }>({
    isOpen: false,
    message: "",
    type: "success",
  });

  const handleClear = () => {
    setConfirmAction(() => () => {
      reset();
    });

    setConfirmMessage("Are you sure you want to reset all the fields?");
    setIsConfirmModalOpen(true);
  };

  const handleCancel = () => {
    setConfirmAction(() => () => router.back());
    setConfirmMessage("Are you sure you want to cancel?");
    setIsConfirmModalOpen(true);
  };

  const onSubmit = async (formData: DayTourFormData) => {
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
    await trigger(data);
    setNotification({
      isOpen: true,
      message: "Changes saved successfully!",
      type: "success",
    });

    router.push("/admin/day-tour-activities");
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
              <input
                type="text"
                {...register("name")}
                className={errors.name && styles.invalid_input}
                maxLength={51}
                placeholder="Enter the day tour name"
                required
              />
              {errors.name && (
                <span className={styles.error}>{errors.name.message}</span>
              )}
            </div>

            <div className={styles.form_group}>
              <label>
                Description <span className={styles.required}>*</span>
              </label>
              <textarea
                {...register("description")}
                className={errors.description && styles.invalid_input}
                maxLength={501}
                placeholder="Enter the description"
                required
              />
              <p className={styles["char-count"]}>
                {watch("description").length}/500 characters
              </p>
              {errors.description && (
                <span className={styles.error}>
                  {errors.description.message}
                </span>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className={styles.right_column}>
            <div className={styles.form_group}>
              <label>
                Rate <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                {...register("price")}
                className={styles.short_input}
                placeholder="₱"
                required
              />
              {errors.price && (
                <span className={styles.error}>{errors.price.message}</span>
              )}
            </div>

            <div className={styles.form_group}>
              <label>
                Upload Image
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
                <p className={`${styles.message} ${styles.error}`}>
                  {errors.file.message}
                </p>
              )}
            </div>
          </div>

          <div className={styles.full_width}>
            <div className={styles.button_container}>
              <CustomButton type="submit" label="Save Changes" />
              <CustomButton
                type="button"
                label="Reset"
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
      ;
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
