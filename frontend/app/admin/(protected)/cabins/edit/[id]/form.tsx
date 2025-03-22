"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loading } from "@/app/components/loading";
import styles from "./form.module.scss";
import CustomButton from "@/app/components/custom_button";
import ConfirmModal from "@/app/components/confirm_modal";
import { cabinFormSchema } from "../../add/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import NotificationModal from "@/app/components/notification_modal";
import useSWRMutation from "swr/mutation";
import { updateCabin } from "@/app/lib/api";

interface CabinFormProps {
  id: string;
  defaultValues: EditCabinFormData;
}

type EditCabinFormData = z.infer<typeof cabinFormSchema>;

export default function CabinForm({ id, defaultValues }: CabinFormProps) {
  const router = useRouter();
  const { trigger, isMutating } = useSWRMutation(
    "edit",
    (key, { arg }: { arg: FormData }) => updateCabin(id, arg)
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EditCabinFormData>({
    resolver: zodResolver(cabinFormSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

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

  const onSubmit = async (formData: EditCabinFormData) => {
    setConfirmAction(() => () => {
      const data = new FormData();
      const jsonData = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        minCapacity: Number(formData.minCapacity),
        maxCapacity: Number(formData.maxCapacity),
        additionalFee: formData.additionalFee
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

      router.push("/admin/cabins");
    });

    setConfirmMessage("Are you sure you want to add this cabin?");
    setIsConfirmModalOpen(true);
  };

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

  return (
    <div>
      {isMutating ? (
        <Loading />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.left_column}>
            <div className={styles.form_group}>
              <label>
                Service Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                placeholder="Cabin name"
                {...register("name")}
                className={errors.name && styles.invalid_input}
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
                placeholder="Description"
                {...register("description")}
                className={errors.description && styles.invalid_input}
              />
              {errors.description && (
                <span className={styles.error}>
                  {errors.description.message}
                </span>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className={styles.right_column}>
            <div className={styles.capacityRateContainer}>
              <div className={styles.form_group}>
                <label>
                  Min Capacity <span className={styles.required}>*</span>
                </label>
                <input
                  type="number"
                  {...register("minCapacity")}
                  className={errors.minCapacity && styles.invalid_input}
                />
                {errors.minCapacity && (
                  <span className={styles.error}>
                    {errors.minCapacity.message}
                  </span>
                )}
              </div>

              <div className={styles.form_group}>
                <label>
                  Max Capacity <span className={styles.required}>*</span>
                </label>
                <input
                  type="number"
                  {...register("maxCapacity")}
                  className={errors.maxCapacity && styles.invalid_input}
                />
                {errors.maxCapacity && (
                  <span className={styles.error}>
                    {errors.maxCapacity.message}
                  </span>
                )}
              </div>

              <div className={styles.form_group}>
                <label>
                  Rate
                  <span className={styles.required}>*</span>
                </label>
                <input
                  type="number"
                  placeholder="₱"
                  {...register("price")}
                  min="1"
                  step="0.01"
                  className={errors.price && styles.invalid_input}
                />
                {errors.price && (
                  <span className={styles.error}>{errors.price.message}</span>
                )}
              </div>
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
            </div>
          </div>

          {/* Additional Fees Section */}
          <div className={styles.full_width}>
            <h3 className={styles.section_title}>Additional Fees (Optional)</h3>
            <div className={styles.additional_fees_container}>
              <div className={styles.additional_fees_left}>
                <div className={styles.form_group}>
                  <label>Type</label>
                  <input
                    type="text"
                    data-section="additionalFee"
                    {...register("additionalFee.additionalFeeType")}
                    maxLength={50}
                  />
                  {errors.additionalFee?.additionalFeeType && (
                    <p className={`${styles.message} ${styles.error}`}>
                      {errors.additionalFee.additionalFeeType.message}
                    </p>
                  )}
                </div>

                <div className={styles.form_group}>
                  <label>Description</label>
                  <textarea
                    data-section="additionalFee"
                    {...register("additionalFee.description")}
                    rows={3}
                    cols={30}
                    maxLength={100}
                  />
                  {errors.additionalFee?.description && (
                    <p className={`${styles.message} ${styles.error}`}>
                      {errors.additionalFee.description.message}
                    </p>
                  )}
                </div>
              </div>

              <div className={styles.additional_fees_right}>
                <div className={styles.form_group}>
                  <label>Amount</label>
                  <input
                    type="number"
                    placeholder="₱"
                    {...register("additionalFee.amount")}
                    min="0"
                    step="0.01"
                    className={styles.short_input}
                  />
                  {errors.additionalFee?.amount && (
                    <p className={`${styles.message} ${styles.error}`}>
                      {errors.additionalFee.amount.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className={styles.full_width}>
            <div className={styles.button_container}>
              <CustomButton type="submit" label="Edit Cabin" />
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
