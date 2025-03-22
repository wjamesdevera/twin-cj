"use client";

import React, {
  useEffect,
  useState,
  useCallback,
  ChangeEvent,
  FormEvent,
} from "react";

import { useRouter, useParams } from "next/navigation";
import { options } from "@/app/api";
import { Loading } from "@/app/components/loading";
import styles from "./page.module.scss";
import EditDayTour from "./form";
import { IoArrowBack } from "react-icons/io5";
import ConfirmModal from "@/app/components/confirm_modal";
import NotificationModal from "@/app/components/notification_modal";

interface DayTour {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: string;
  additionalFeeType: string;
  additionalFeeDescription: string;
  additionalFeeAmount: string;
}

export default function EditDayTourPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [formData, setFormData] = useState<DayTour>({
    id: 0,
    name: "",
    description: "",
    imageUrl: "",
    price: "",
    additionalFeeType: "",
    additionalFeeDescription: "",
    additionalFeeAmount: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMutating, setIsMutating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [originalData, setOriginalData] = useState<DayTour | null>(null);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [confirmMessage, setConfirmMessage] = useState<string>("");

  const [helperText, setHelperText] = useState<{ [key: string]: string }>({
    name: "",
    description: "",
    price: "",
    additionalFeeType: "",
    additionalFeeDescription: "",
    additionalFeeAmount: "",
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

  useEffect(() => {
    if (!id) {
      setError("No ID provided");
      setLoading(false);
      return;
    }

    const fetchDayTour = async () => {
      try {
        const response = await fetch(
          `${options.baseURL}/api/services/day-tours/${id}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch day tour with id: ${id}`);
        }

        const data = await response.json();

        if (data?.data?.dayTour) {
          const { dayTour } = data.data;
          const additionalFee = data.data.dayTour.additionalFee || {};
          const fetchedData = {
            id: dayTour.id,
            name: dayTour.name || "",
            description: dayTour.description || "",
            imageUrl: dayTour?.imageUrl
              ? `${options.baseURL}/uploads/${dayTour.imageUrl}`
              : "",
            price: dayTour.price.toString() || "",
            additionalFeeType: additionalFee.type || "",
            additionalFeeDescription: additionalFee.description || "",
            additionalFeeAmount: additionalFee.amount?.toString() || "",
          };
          setFormData(fetchedData);
          setOriginalData(fetchedData);
        } else {
          setError("Invalid data structure received");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDayTour();
  }, [id]);

  const validateForm = useCallback(() => {
    const isNameValid =
      formData.name.trim().length > 0 && formData.name.trim().length <= 50;

    const isDescriptionValid =
      formData.description.trim().length > 0 &&
      formData.description.trim().length <= 100;

    const isPriceValid =
      /^\d+(\.\d+)?$/.test(formData.price.trim()) &&
      parseFloat(formData.price) > 0;

    const isImageValid =
      !imageFile ||
      (imageFile.size <= 1024 * 1024 &&
        ["image/jpeg", "image/png", "image/jpg"].includes(imageFile.type));

    const isAdditionalFeeValid =
      (formData.additionalFeeType.trim() === "" &&
        formData.additionalFeeDescription.trim() === "" &&
        formData.additionalFeeAmount.trim() === "") ||
      (formData.additionalFeeType.trim() !== "" &&
        formData.additionalFeeDescription.trim() !== "" &&
        /^\d+(\.\d{1,2})?$/.test(formData.additionalFeeAmount.trim()) &&
        parseFloat(formData.additionalFeeAmount) > 0);

    const isValid: boolean =
      isNameValid &&
      isDescriptionValid &&
      isPriceValid &&
      isImageValid &&
      isAdditionalFeeValid;

    setIsFormValid(isValid);
  }, [formData, imageFile]);

  useEffect(() => {
    setIsFormValid(hasChanges() ? true : false);
  }, [formData, imageFile, validateForm]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value, files } = e.target as HTMLInputElement;

      if (name === "image") {
        setImageFile(files ? files[0] : null);
      } else {
        const trimmedValue = value.replace(/^\s+/, "");
        let formattedValue = trimmedValue;

        if (["name", "additionalFeeType"].includes(name)) {
          formattedValue = trimmedValue.replace(/[^a-zA-Z0-9 ]/g, "");
        } else if (["price", "additionalFeeAmount"].includes(name)) {
          formattedValue = trimmedValue.replace(/[^0-9.]/g, "");
        }

        setFormData((prevData) => ({
          ...prevData,
          [name]: formattedValue,
        }));

        setHelperText((prevHelperText) => ({
          ...prevHelperText,
          [name]:
            formattedValue.length === 0
              ? ""
              : name === "name"
              ? formattedValue.length >= 50
                ? "Name must not exceed 50 characters"
                : ""
              : name === "description"
              ? formattedValue.length >= 100
                ? "Description must not exceed 100 characters"
                : ""
              : name === "price"
              ? !/^\d+$/.test(formattedValue) || parseFloat(formattedValue) <= 0
                ? "Rate must be a positive number only"
                : ""
              : name === "additionalFeeType"
              ? ""
              : name === "additionalFeeDescription"
              ? ""
              : name === "additionalFeeAmount"
              ? !/^\d+$/.test(formattedValue) || parseFloat(formattedValue) <= 0
                ? "Additional Fee Amount must be a positive number only"
                : ""
              : prevHelperText[name],
        }));
      }
    },
    []
  );

  const hasChanges = () => {
    if (!originalData) return false;

    const compareWithoutWhitespace = (a: string = "", b: string = "") =>
      a.trim() === b.trim();

    const parseNumber = (val: string) =>
      val.trim() === "" ? 0 : parseFloat(val);

    const requiredFieldsChanged =
      !compareWithoutWhitespace(formData.name, originalData.name) ||
      !compareWithoutWhitespace(
        formData.description,
        originalData.description
      ) ||
      parseNumber(formData.price) !== parseNumber(originalData.price) ||
      !!imageFile;

    const additionalFeeChanged =
      (formData.additionalFeeType.trim() !== "" &&
        !compareWithoutWhitespace(
          formData.additionalFeeType,
          originalData.additionalFeeType
        )) ||
      (formData.additionalFeeDescription.trim() !== "" &&
        !compareWithoutWhitespace(
          formData.additionalFeeDescription,
          originalData.additionalFeeDescription
        )) ||
      (formData.additionalFeeAmount.trim() !== "" &&
        parseNumber(formData.additionalFeeAmount) !==
          parseNumber(originalData.additionalFeeAmount));

    const additionalFeeRemoved =
      originalData?.additionalFeeType &&
      originalData?.additionalFeeDescription &&
      originalData?.additionalFeeAmount &&
      !formData.additionalFeeType.trim() &&
      !formData.additionalFeeDescription.trim() &&
      !formData.additionalFeeAmount.trim();

    return (
      requiredFieldsChanged || additionalFeeChanged || additionalFeeRemoved
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!hasChanges()) {
      setIsMutating(false);
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      imageUrl: imageFile ? URL.createObjectURL(imageFile) : prevData.imageUrl,
    }));

    setConfirmMessage("Are you sure you want to save the changes?");
    setIsConfirmModalOpen(true);
  };

  const handleConfirm = async () => {
    setIsMutating(true);
    const data = new FormData();

    const jsonData: any = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
    };

    if (
      formData.additionalFeeType &&
      formData.additionalFeeDescription &&
      formData.additionalFeeAmount
    ) {
      jsonData.additionalFee = {
        type: formData.additionalFeeType,
        description: formData.additionalFeeDescription,
        amount: Number(formData.additionalFeeAmount),
      };
    } else {
      jsonData.additionalFee = {
        type: "N/A",
        description: "N/A",
        amount: 0,
      };
    }

    data.append("data", JSON.stringify(jsonData));

    if (imageFile) {
      data.append("file", imageFile);
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/services/day-tours/${id}`,
        {
          method: "PUT",
          body: data,
        }
      );

      if (!response.ok) throw new Error("Failed to update day tour");

      const updatedData = await response.json();
      const updatedImageUrl = updatedData?.data?.dayTour?.imageUrl;

      if (updatedImageUrl) {
        setFormData((prevData) => ({
          ...prevData,
          imageUrl: `http://localhost:8080/${updatedImageUrl}?t=${Date.now()}`,
        }));
      }

      setNotification({
        isOpen: true,
        message: "Day Tour Activity updated successfully!",
        type: "success",
      });

      router.push("/admin/day-tour-activities");
    } catch (err) {
      setNotification({
        isOpen: true,
        message:
          err instanceof Error ? err.message : "An unknown error occurred",
        type: "error",
      });
    } finally {
      setIsMutating(false);
    }
  };

  const isFormInvalid =
    Object.values(helperText).some((error) => error !== "") ||
    (JSON.stringify(formData) === JSON.stringify(originalData) && !imageFile);

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;
  if (!formData) return <div>No data found</div>;

  return (
    <div className={styles.page_container}>
      <div className={styles.page_header}>
        <div className={styles.back_arrow} onClick={() => router.back()}>
          <IoArrowBack />
        </div>
        <h1 className={styles.title}>Edit Day Tour Activity</h1>
      </div>
      <EditDayTour
        formData={formData}
        setFormData={setFormData}
        helperText={helperText}
        isMutating={isMutating}
        isFormValid={isFormValid}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        setIsConfirmModalOpen={setIsConfirmModalOpen}
        setConfirmMessage={setConfirmMessage}
      />
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirm}
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
