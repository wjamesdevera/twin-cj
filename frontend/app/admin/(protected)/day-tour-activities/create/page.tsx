"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
  FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import { Loading } from "@/app/components/loading";

function Page() {
  const router = useRouter();

  interface DayTourFormData {
    name: string;
    description: string;
    image: File | null;
    price: string;
    additionalFeeType: string;
    additionalFeeDescription: string;
    additionalFeeAmount: string;
  }

  const [formData, setFormData] = useState<DayTourFormData>({
    name: "",
    description: "",
    image: null,
    price: "",
    additionalFeeType: "",
    additionalFeeDescription: "",
    additionalFeeAmount: "",
  });

  // helper text initial state
  const [helperText, setHelperText] = useState<{ [key: string]: boolean }>({
    name: false,
    description: false,
    price: false,
    additionalFeeType: false,
    additionalFeeDescription: false,
    additionalFeeAmount: false,
  });

  const [isMutating, setIsMutating] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  // form validations
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
      formData.image !== null &&
      formData.image.size <= 1024 * 1024 &&
      ["image/jpeg", "image/png", "image/jpg"].includes(formData.image.type);

    const isAdditionalFeeTypeTouched =
      formData.additionalFeeType.trim().length > 0;
    const isAdditionalFeeDescriptionTouched =
      formData.additionalFeeDescription.trim().length > 0;
    const isAdditionalFeeAmountTouched =
      formData.additionalFeeAmount.trim().length > 0;

    const isAdditionalFeeValid =
      (!isAdditionalFeeTypeTouched &&
        !isAdditionalFeeDescriptionTouched &&
        !isAdditionalFeeAmountTouched) ||
      (isAdditionalFeeTypeTouched &&
        isAdditionalFeeDescriptionTouched &&
        isAdditionalFeeAmountTouched &&
        /^\d+(\.\d+)?$/.test(formData.additionalFeeAmount.trim()) &&
        parseFloat(formData.additionalFeeAmount) > 0);

    const isValid =
      isNameValid &&
      isDescriptionValid &&
      isPriceValid &&
      isImageValid &&
      isAdditionalFeeValid;

    setIsFormValid(isValid);
  }, [formData]);

  useEffect(() => {
    validateForm();
  }, [formData, validateForm]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value, files } = e.target as HTMLInputElement;
      const trimmedValue = value.trim();

      setFormData((prevData) => ({
        ...prevData,
        [name]: files ? files[0] : value,
      }));

      const isFilled = (val: string) => val.trim().length > 0;

      setHelperText((prevHelperText) => ({
        ...prevHelperText,
        [name]:
          name === "name"
            ? trimmedValue.length === 0 || trimmedValue.length > 50
            : name === "description"
            ? trimmedValue.length === 0 || trimmedValue.length > 100
            : name === "price"
            ? !/^\d+(\.\d+)?$/.test(trimmedValue) ||
              parseFloat(trimmedValue) <= 0
            : name === "additionalFeeType"
            ? trimmedValue.length === 0
            : name === "additionalFeeDescription"
            ? trimmedValue.length === 0
            : name === "additionalFeeAmount"
            ? !/^\d+(\.\d+)?$/.test(trimmedValue) ||
              parseFloat(trimmedValue) <= 0
            : false,
      }));
    },
    []
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsMutating(true);

    if (!window.confirm("Are you sure you want to add this Day tour?")) {
      setIsMutating(false);
      return;
    }

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
    }

    data.append("data", JSON.stringify(jsonData));

    if (formData.image) {
      data.append("file", formData.image);
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/services/day-tours/",
        {
          method: "POST",
          body: data,
        }
      );

      if (response.ok) {
        alert("Day tour created successfully!");
        router.push("/admin/day-tour-activities");
      }
    } catch (error) {
      console.error("Error creating day tour:", error);
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <div>
      {isMutating ? (
        <Loading />
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <div>
              <h1>Create Day Tour</h1>

              <label>Title:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                maxLength={50}
              />
              {helperText.name && (
                <small>Title must not exceed 50 characters</small>
              )}
            </div>
            <div>
              <label>Description:</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                maxLength={100}
              />
              {helperText.description && (
                <small>Description must not exceed 100 characters</small>
              )}
            </div>
            <div>
              <label>Upload Image:</label>
              <input
                type="file"
                accept=".jpg,.png,.jpeg"
                name="image"
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Rate:</label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
              />
              {helperText.price && (
                <small>Rate must be a positive number only</small>
              )}
            </div>
            <div>
              <h1>Additional Fees (Optional)</h1>
              <label>Additional Fee Type:</label>
              <input
                type="text"
                name="additionalFeeType"
                value={formData.additionalFeeType}
                onChange={handleChange}
              />
              {helperText.additionalFeeType && (
                <small>Additional Fee Type is required</small>
              )}
            </div>
            <div>
              <label>Additional Fee Description:</label>
              <input
                type="text"
                name="additionalFeeDescription"
                value={formData.additionalFeeDescription}
                onChange={handleChange}
              />
              {helperText.additionalFeeDescription && (
                <small>Additional Fee Description is required</small>
              )}
            </div>
            <div>
              <label>Additional Fee Amount:</label>
              <input
                type="text"
                name="additionalFeeAmount"
                value={formData.additionalFeeAmount}
                onChange={handleChange}
              />
              {helperText.additionalFeeAmount && (
                <small>
                  Additional Fee Amount must be a positive number only
                </small>
              )}
            </div>
            <button type="submit" disabled={!isFormValid}>
              Submit
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/day-tour-activities")}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Page;
