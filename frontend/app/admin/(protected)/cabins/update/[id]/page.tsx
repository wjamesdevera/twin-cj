"use client";

import React, {
  useEffect,
  useState,
  useCallback,
  ChangeEvent,
  FormEvent,
} from "react";

import { useRouter, useParams } from "next/navigation";
import useSWR from "swr";
import { getCabin } from "@/app/lib/api";
import CabinForm from "./form"; 
import { Loading } from "@/app/components/loading";
import { options } from "@/app/api";
import { IoArrowBack } from "react-icons/io5";
import styles from "./page.module.scss";
import ConfirmModal from "@/app/components/confirm_modal";
import NotificationModal from "@/app/components/notification_modal";

interface Service {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
}

interface CabinDetails {
  minCapacity: number;
  maxCapacity: number;
}

interface AdditionalFee {
  type: string;
  description: string;
  amount: number;
}

interface Cabin {
  service: Service;
  cabin: CabinDetails;
  additionalFee: AdditionalFee;
}

export default function UpdateCabin() {
  const router = useRouter();
  const { id } = useParams();

  const [formData, setFormData] = useState<Cabin>({
    service: {
      id: 0,
      name: "",
      description: "",
      imageUrl: "",
      price: 0,
    },
    cabin: {
      minCapacity: 1,
      maxCapacity: 1,
    },
    additionalFee: {
      type: "",
      description: "",
      amount: 0,
    },
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMutating, setIsMutating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [helperText, setHelperText] = useState<{ [key: string]: string }>({
    name: "",
    description: "",
    price: "",
    minCapacity: "",
    maxCapacity: "",
    additionalFeeType: "",
    additionalFeeDescription: "",
    additionalFeeAmount: "",
  });
  const [originalData, setOriginalData] = useState<Cabin | null>(null);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [confirmMessage, setConfirmMessage] = useState<string>("");


  const [notification, setNotification] = useState<{ isOpen: boolean, message: string, type: 'success' | 'error' }>({
    isOpen: false,
    message: '',
    type: 'success'
  });

  const { data, isLoading } = useSWR(id, getCabin);

  useEffect(() => {
    if (data) {
      const { cabin } = data.data;
      const additionalFee = cabin.additionalFee || {};
      const fetchedData = {
        service: {
          id: cabin.id,
          name: cabin.name || "",
          description: cabin.description || "",
          imageUrl: cabin.imageUrl || "",
          price: cabin.price,
        },
        cabin: {
          minCapacity: cabin.minCapacity ?? 1,
          maxCapacity: cabin.maxCapacity ?? 1,
        },
        additionalFee: {
          type: additionalFee.type || "",
          description: additionalFee.description || "",
          amount: additionalFee.amount || 0,
        },
      };
      setFormData(fetchedData);
      setOriginalData(fetchedData);
      setLoading(false);
    }
  }, [data]);

  console.log("Fetched cabin data:", data);

  const validateForm = useCallback(() => {
    const isNameValid =
      formData.service.name.trim().length > 0 &&
      formData.service.name.trim().length <= 50;
    const isDescriptionValid =
      formData.service.description.trim().length > 0 &&
      formData.service.description.trim().length <= 100;
    const isPriceValid = formData.service.price > 0;
    const isImageValid =
      !imageFile ||
      (imageFile.size <= 1024 * 1024 &&
        ["image/jpeg", "image/png", "image/jpg"].includes(imageFile.type));
    const isAdditionalFeeValid =
      (formData.additionalFee.type.trim() === "" &&
        formData.additionalFee.description.trim() === "" &&
        formData.additionalFee.amount === 0) ||
      (formData.additionalFee.type.trim() !== "" &&
        formData.additionalFee.description.trim() !== "" &&
        formData.additionalFee.amount > 0);

    const isValid =
      isNameValid &&
      isDescriptionValid &&
      isPriceValid &&
      isImageValid &&
      isAdditionalFeeValid;
    setIsFormValid(isValid);
  }, [formData, imageFile]);

  useEffect(() => {
    validateForm();
  }, [formData, imageFile, validateForm]);

  const validateField = (name: string, value: any) => {
    if (typeof value === "string" && value.trim() === "") {
      if (["name", "description", "price"].includes(name)) {
        return "This field cannot be empty or contain only spaces.";
      }
    }

    if (value === "" || value === null || value === undefined) {
      if (
        ["name", "description", "price", "minCapacity", "maxCapacity"].includes(
          name
        )
      ) {
        return "This field is required.";
      }
    }

    if (name === "price" && (isNaN(value) || value < 1)) {
      return "Rate must be greater than 0.";
    }
    if (name === "minCapacity" && (isNaN(value) || value < 1)) {
      return "Minimum capacity must be at least 1.";
    }
    if (name === "maxCapacity") {
      if (isNaN(value) || value < 1) {
        return "Maximum capacity must be at least 1.";
      }
      if (value <= formData.cabin.minCapacity) {
        return "Maximum capacity should be greater than minimum capacity.";
      }
    }

    return "";
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, dataset, files } = e.target as HTMLInputElement;
    const section = dataset.section as "service" | "cabin" | "additionalFee";

    if (["name", "type"].includes(name)) {
      const sanitizedValue = value.replace(/^\s+|[^a-zA-Z0-9\s]/g, "");

      setFormData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [name]: sanitizedValue },
      }));

      setHelperText((prev) => ({
        ...prev,
        [name]: sanitizedValue ? "" : prev[name as keyof typeof prev],
      }));

      return;
    }

    if (files && files[0]) {
      const file = files[0];
      const validFormats = ["image/jpeg", "image/jpg", "image/png"];

      if (!validFormats.includes(file.type)) {
        setHelperText((prev) => ({
          ...prev,
          image: "Invalid image format. Only JPG or PNG allowed.",
        }));
        e.target.value = "";
        setImageFile(null);
        return;
      }

      if (file.size > 1048576) {
        setHelperText((prev) => ({
          ...prev,
          image: "File size must be less than 1MB.",
        }));
        e.target.value = "";
        setImageFile(null);
        return;
      }

      setHelperText((prev) => ({ ...prev, image: "" }));
      setImageFile(file);
    } else {
      const numericFields = ["price", "minCapacity", "maxCapacity", "amount"];
      const newValue = numericFields.includes(name)
        ? value === ""
          ? ""
          : Number(value)
        : value;

      setFormData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [name]: newValue },
      }));

      setHelperText((prev) => ({
        ...prev,
        [name]: validateField(name, newValue),
      }));

      if (section === "additionalFee") {
        const updatedAdditionalFee = {
          ...formData.additionalFee,
          [name]: newValue,
        };

        const { type, description, amount } = updatedAdditionalFee;

        if (type && description && amount > 0) {
          setHelperText((prev) => ({ ...prev, additionalFeeWarning: "" }));
        } else if (type || description || amount > 0) {
          setHelperText((prev) => ({
            ...prev,
            additionalFeeWarning:
              "Please complete all additional fee fields or leave them empty.",
          }));
        } else {
          setHelperText((prev) => ({ ...prev, additionalFeeWarning: "" }));
        }
      }
    }
  };

  const hasChanges = () => {
    if (!originalData) return false;

    const compareWithoutWhitespace = (a: string = "", b: string = "") =>
      a.trim() === b.trim();
    const parseNumber = (val: string) =>
      val.trim() === "" ? 0 : parseFloat(val);

    const requiredFieldsChanged =
      !compareWithoutWhitespace(
        formData.service.name,
        originalData.service.name
      ) ||
      !compareWithoutWhitespace(
        formData.service.description,
        originalData.service.description
      ) ||
      formData.service.price !== originalData.service.price ||
      !!imageFile;
    const additionalFeeChanged =
      (formData.additionalFee.type.trim() !== "" &&
        !compareWithoutWhitespace(
          formData.additionalFee.type,
          originalData.additionalFee.type
        )) ||
      (formData.additionalFee.description.trim() !== "" &&
        !compareWithoutWhitespace(
          formData.additionalFee.description,
          originalData.additionalFee.description
        )) ||
      formData.additionalFee.amount !== originalData.additionalFee.amount;
    const additionalFeeRemoved =
      originalData.additionalFee.type &&
      originalData.additionalFee.description &&
      originalData.additionalFee.amount &&
      !formData.additionalFee.type.trim() &&
      !formData.additionalFee.description.trim() &&
      formData.additionalFee.amount === 0;

    const capacityChanged =
      formData.cabin.minCapacity !== originalData.cabin.minCapacity ||
      formData.cabin.maxCapacity !== originalData.cabin.maxCapacity;
    
    return requiredFieldsChanged || capacityChanged || additionalFeeChanged || additionalFeeRemoved;    
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!hasChanges()) {
      setIsMutating(false);
      return;
    }

    setConfirmMessage("Are you sure you want to save the changes?");
    setIsConfirmModalOpen(true);
    
  };
  
  
  const handleConfirm = async () => {
    const data = new FormData();
    const jsonData: any = {
      name: formData.service.name,
      description: formData.service.description,
      price: formData.service.price,
      minCapacity: formData.cabin.minCapacity,
      maxCapacity: formData.cabin.maxCapacity,
    };
  
    if (
      formData.additionalFee.type &&
      formData.additionalFee.description &&
      formData.additionalFee.amount > 0
    ) {
      jsonData.additionalFee = {
        type: formData.additionalFee.type,
        description: formData.additionalFee.description,
        amount: formData.additionalFee.amount,
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
      setIsMutating(true);
  
      const response = await fetch(
        `${options.baseURL}/api/services/cabins/${id}`,
        {
          method: "PUT",
          body: data,
        }
      );
  
      if (!response.ok) throw new Error("Failed to update cabin");
  
      const updatedData = await response.json();
      const updatedImageUrl = updatedData?.data?.cabin?.imageUrl;
  
      if (updatedImageUrl) {
        setFormData((prevData) => ({
          ...prevData,
          service: {
            ...prevData.service,
            imageUrl: `${options.baseURL}/uploads/${updatedImageUrl}?t=${new Date().getTime()}`,
          },
        }));
      }
  
      setNotification({
        isOpen: true,
        message: "Cabin updated successfully!",
        type: "success",
      });
  
      router.push("/admin/cabins");
    } catch (err) {
      setNotification({
        isOpen: true,
        message: err instanceof Error ? err.message : "An unknown error occurred",
        type: "error",
      });
    } finally {
      setIsMutating(false);
    }
  };

  const isFormInvalid = Object.values(helperText).some((error) => error !== "") ||
    (JSON.stringify(formData) === JSON.stringify(originalData) && !imageFile);

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.page_container}>
      <div className={styles.page_header}>
        <div className={styles.back_arrow} onClick={() => router.back()}>
          <IoArrowBack />
        </div>
        <h1 className={styles.title}>Edit Cabin</h1>
      </div>
      <CabinForm
        formData={formData}
        setFormData={setFormData}
        helperText={helperText}
        isMutating={isMutating}
        isFormInvalid={isFormInvalid}
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