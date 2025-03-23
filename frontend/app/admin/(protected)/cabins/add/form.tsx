"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loading } from "@/app/components/loading";
import styles from "./form.module.scss";
import CustomButton from "@/app/components/custom_button";
import ConfirmModal from "@/app/components/confirm_modal";
import NotificationModal from "@/app/components/notification_modal";
import { z } from "zod";
import {
  capacitySchema,
  descriptionSchema,
  fileSchema,
  nameSchema,
  priceSchema,
} from "@/app/lib/zodSchemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCabin } from "@/app/lib/api";
import useSWRMutation from "swr/mutation";

export const cabinFormSchema = z
  .object({
    name: nameSchema,
    description: descriptionSchema,
    file: fileSchema.optional(),
    price: priceSchema.or(z.number().gt(0)),
    minCapacity: capacitySchema.or(z.number().gt(0)),
    maxCapacity: capacitySchema.or(z.number().gt(0)),
  })
  .refine((cabin) => cabin.minCapacity <= cabin.maxCapacity, {
    path: ["maxCapacity"],
    message: "Max capacity should be greater then min capacity",
  });

type AddCabinFormData = z.infer<typeof cabinFormSchema>;

export default function CabinForm() {
  const router = useRouter();

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddCabinFormData>({
    resolver: zodResolver(cabinFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      minCapacity: 0,
      maxCapacity: 0,
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

  const onSubmit = async (formData: AddCabinFormData) => {
    setConfirmAction(() => () => {
      const data = new FormData();
      const jsonData = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        minCapacity: Number(formData.minCapacity),
        maxCapacity: Number(formData.maxCapacity),
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

      router.push("/admin/cabins");
    });

    setConfirmMessage("Are you sure you want to add this cabin?");
    setIsConfirmModalOpen(true);
  };

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

  const { trigger, isMutating } = useSWRMutation(
    "create cabin",
    (key, { arg }: { arg: FormData }) => createCabin(arg),
    {
      onSuccess: () => {
        router.push("/admin/cabins");
      },
    }
  );

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
              <p className={styles["char-count"]}>
                {watch("description").length}/100 characters
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
              {errors.file && (
                <p className={`${styles.message} ${styles.error}`}>
                  {errors.file.message}
                </p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className={styles.full_width}>
            <div className={styles.button_container}>
              <CustomButton type="submit" label="Add Cabin" />
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
