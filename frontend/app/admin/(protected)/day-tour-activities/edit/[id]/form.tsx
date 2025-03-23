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
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, dirtyFields },
  } = useForm<DayTourFormData>({
    resolver: zodResolver(dayTourSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  const { trigger, isMutating } = useSWRMutation(
    "edit",
    (key, { arg }: { arg: FormData }) => updateDayTour(id, arg)
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

  const router = useRouter();

  const handleClear = () => {
    setConfirmAction(() => {
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
      additionalFee:
        formData.additionalFee && dirtyFields["additionalFee"]
          ? {
              type: formData.additionalFee.additionalFeeType,
              description: formData.additionalFee.description || "",
              amount: Number(formData.additionalFee.amount),
            }
          : undefined,
    };

    data.append("data", JSON.stringify(jsonData));
    if (formData.file) {
      data.append("file", formData.file);
    }

    trigger(data);
    setNotification({
      isOpen: true,
      message: "Cabin added successfully!",
      type: "success",
    });

    router.push("/admin/day-tour-activities");
  };

  return isMutating ? (
    <Loading />
  ) : (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.left_column}>
          <div className={styles.form_group}>
            <label>
              Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              {...register("name")}
              className={errors.name && styles.invalid_input}
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
              required
            />
            {errors.description && (
              <span className={styles.error}>{errors.description.message}</span>
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
              required
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
            {!errors.file && (
              <p className={`${styles.message} ${styles.success}`}>
                Image uploaded successfully!
              </p>
            )}

            {errors.file && (
              <p className={`${styles.message} ${styles.error}`}>
                {errors.file.message}
              </p>
            )}

            {errors.file && (
              <p className={`${styles.message} ${styles.error}`}>
                {errors.file.message}
              </p>
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
              </div>

              <div className={styles.form_group}>
                <label>Description</label>
                <textarea
                  {...register("additionalFee.description")}
                  maxLength={100}
                />
              </div>
            </div>

            <div className={styles.additional_fees_right}>
              <div className={styles.form_group}>
                <label>Amount</label>
                <input
                  type="text"
                  {...register("additionalFee.amount")}
                  className={styles.short_input}
                />
              </div>
            </div>
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
