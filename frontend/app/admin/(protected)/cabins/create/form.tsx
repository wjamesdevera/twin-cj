"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loading } from "@/app/components/loading";
import { useDropzone } from "react-dropzone";
import styles from "./form.module.scss"; 
import CustomButton from "@/app/components/custom_button";


interface FormProps {
  trigger: (data: FormData) => void;
  isMutating: boolean;
}

export default function CabinForm({ trigger, isMutating }: FormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    service: {
      name: "",
      description: "",
      image: null as File | null,
      price: 1,
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

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string>("");

  const handleFileUpload = (file: File | null) => {
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type) || file.size > 1048576) {
        setImageError(
          "Please upload a valid JPEG, JPG, or PNG file (max size: 1MB)."
        );
        setFormData((prev) => ({
          ...prev,
          service: { ...prev.service, image: null },
        }));
        setImagePreview(null);
      } else {
        setFormData((prev) => ({
          ...prev,
          service: { ...prev.service, image: file },
        }));
        setImagePreview(URL.createObjectURL(file));
        setImageError("");
      }
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      service: { ...prev.service, image: null },
    }));
    setImagePreview(null);
    setImageError("");
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    handleFileUpload(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [".jpeg", ".jpg"], "image/png": [".png"] },
    maxSize: 1048576,
    onDropRejected: (fileRejections) => {
        if (fileRejections.length > 0) {
          setImageError("File size must be less than 1MB.");
        }
      },
  });
  
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    minCapacity: "",
    maxCapacity: "",
    image: "",
    price: "",
  });

  const [additionalFeeWarning, setAdditionalFeeWarning] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, dataset } = e.target as HTMLInputElement;
    const section = dataset.section as "service" | "cabin" | "additionalFee";
  
    if (["name", "type"].includes(name)) {
      const sanitizedValue = value.replace(/^\s+|[^a-zA-Z0-9\s]/g, "");
  
      setFormData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [name]: sanitizedValue },
      }));
  
      setErrors((prev) => ({
        ...prev,
        [name]: sanitizedValue ? "" : prev[name as keyof typeof prev],
      }));
  
      return;
    }
  
    const numericFields = ["price", "minCapacity", "maxCapacity", "amount"];
    const newValue = numericFields.includes(name) ? (value === "" ? "" : Number(value)) : value;
  
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [name]: newValue },
    }));
  
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, newValue),
    }));
  
    if (section === "additionalFee") {
      const updatedAdditionalFee = { ...formData.additionalFee, [name]: newValue };
  
      const { type, description, amount } = updatedAdditionalFee;
  
      if (type && description && amount > 0) {
        setAdditionalFeeWarning("");
      } else if (type || description || amount > 0) {
        setAdditionalFeeWarning("Please complete all additional fee fields or leave them empty.");
      } else {
        setAdditionalFeeWarning("");
      }
    }
  };
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { type, description, amount } = formData.additionalFee;
    const isAdditionalFeeFilled = type || description || amount > 0;
    const isAdditionalFeeComplete = type && description && amount > 0;

    if (isAdditionalFeeFilled && !isAdditionalFeeComplete) {
      setAdditionalFeeWarning("Please complete all additional fee fields or leave them empty.");
      return;
    }
    

    // const isConfirmed = window.confirm(
    //   "Are you sure you want to add this cabin?"
    // );
    // if (!isConfirmed) return;
    // NOTE: ADD a modal before adding of cabin

    const newErrors = {
      name: validateField("name", formData.service.name),
      description: validateField("description", formData.service.description),
      minCapacity: validateField("minCapacity", formData.cabin.minCapacity),
      maxCapacity: validateField("maxCapacity", formData.cabin.maxCapacity),
      price: validateField("price", formData.service.price),
      image: formData.service.image ? "" : "Image is required.",
    };

    setErrors(newErrors);

    if (!formData.service.image) {
        setImageError("Please upload an image before submitting.");
      }
      

    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }

    
    const data = new FormData();
    const jsonData = {
      name: formData.service.name,
      description: formData.service.description,
      price: Number(formData.service.price),
      minCapacity: Number(formData.cabin.minCapacity),
      maxCapacity: Number(formData.cabin.maxCapacity),
      additionalFee: formData.additionalFee.type?.trim()
        ? {
            type: formData.additionalFee.type,
            description: formData.additionalFee.description || "",
            amount: Number(formData.additionalFee.amount),
          }
        : undefined,
    };

    data.append("data", JSON.stringify(jsonData));
    if (formData.service.image) {
      data.append("file", formData.service.image);
    }

    trigger(data);
  };

        const isFormEmpty =
        !formData.service.name.trim() ||
        !formData.service.description.trim() ||
        !formData.service.image ||
        formData.service.price < 1 ||
        formData.cabin.minCapacity < 1 ||
        formData.cabin.maxCapacity < 1;

        const isFormInvalid =
        isFormEmpty ||
        Object.values(errors).some((error) => error !== "") ||
        additionalFeeWarning !== "";
        const handleClear = () => {
            setFormData({
            service: {
                name: "",
                description: "",
                image: null,
                price: 1,
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
            setErrors({
            name: "",
            description: "",
            minCapacity: "",
            maxCapacity: "",
            image: "",
            price: "",
            });
            setAdditionalFeeWarning("");
            setImagePreview(null); 
            setImageError(""); 
            
            document.querySelectorAll("input, textarea").forEach((input) => {
            (input as HTMLInputElement | HTMLTextAreaElement).value = "";
            });
        };

            
  return (
    <div>
      {isMutating ? (
        <Loading />
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.left_column}>
            <div className={styles.form_group}>
              <label>Service Name <span className={styles.required}>*</span></label>
              <input 
                type="text" 
                name="name" 
                data-section="service" 
                value={formData.service.name} 
                onChange={handleChange} 
                className={errors.name ? styles.invalid_input : ""} />
              {errors.name && <span className={styles.error}>{errors.name}</span>}
            </div>

            <div className={styles.form_group}>
              <label>Description <span className={styles.required}>*</span></label>
              <textarea name="description" data-section="service" value={formData.service.description} onChange={handleChange} className={errors.description ? styles.invalid_input : ""}></textarea>
              {errors.description && <span className={styles.error}>{errors.description}</span>}
            </div>

          </div>

         {/* Right Column */}
         <div className={styles.right_column}>
         <div className={styles.capacityRateContainer}>
            <div className={styles.form_group}>
                <label>Min Capacity <span className={styles.required}>*</span></label>
                <input type="number" name="minCapacity" data-section="cabin" value={formData.cabin.minCapacity} onChange={handleChange} className={errors.minCapacity ? styles.invalid_input : ""} />
                {errors.minCapacity && <span className={styles.error}>{errors.minCapacity}</span>}
            </div>

            <div className={styles.form_group}>
                <label>Max Capacity <span className={styles.required}>*</span></label>
                <input type="number" name="maxCapacity" data-section="cabin" value={formData.cabin.maxCapacity} onChange={handleChange} className={errors.maxCapacity ? styles.invalid_input : ""} />
                {errors.maxCapacity && <span className={styles.error}>{errors.maxCapacity}</span>}
            </div>

        <div className={styles.form_group}>
            <label>Rate <span className={styles.required}>*</span></label>
            <input 
            type="number" 
            name="price"   
            placeholder="₱"
            data-section="service"    
            min="1"
            step="0.01" 
            value={formData.service.price} 
            onChange={handleChange} 
            className={`${errors.price ? styles.invalid_input : styles.peso_input}`}
            />
            {errors.price && <span className={styles.error}>{errors.price}</span>}
        </div>
        </div>


        <div className={styles.form_group}>
            <label>
            Upload Image <span className={styles.required}>*</span>
            </label>
            <div {...getRootProps()} className={styles.dragDropArea}>
            <input {...getInputProps()} />
            {imagePreview ? (
                <div className={styles.imagePreview}>
                <img src={imagePreview} alt="Uploaded" className={styles.uploadedImage} />
                <button className={styles.removeImageButton} onClick={handleRemoveImage}>
                    &times;
                </button>
                </div>
            ) : (
                <div className={styles.uploadPlaceholder}>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="gray">
                    <path d="M19 10C18.7348 10 18.4804 10.1054 18.2929 10.2929C18.1054 10.4804 18 10.7348 18 11V14.38L16.52 12.9C15.9974 12.3815 15.2911 12.0906 14.555 12.0906C13.8189 12.0906 13.1126 12.3815 12.59 12.9L11.89 13.61L9.41 11.12C8.88742 10.6015 8.18113 10.3106 7.445 10.3106C6.70887 10.3106 6.00258 10.6015 5.48 11.12L4 12.61V7C4 6.73478 4.10536 6.48043 4.29289 6.29289C4.48043 6.10536 4.73478 6 5 6H13C13.2652 6 13.5196 5.89464 13.7071 5.70711C13.8946 5.51957 14 5.26522 14 5C14 4.73478 13.8946 4.48043 13.7071 4.29289C13.5196 4.10536 13.2652 4 13 4H5C4.20435 4 3.44129 4.31607 2.87868 4.87868C2.31607 5.44129 2 6.20435 2 7V19.22C2.00264 19.9565 2.29637 20.6621 2.81715 21.1828C3.33794 21.7036 4.04351 21.9974 4.78 22H17.22C17.491 21.9978 17.7603 21.9574 18.02 21.88C18.5974 21.718 19.1058 21.3711 19.4671 20.8924C19.8283 20.4137 20.0226 19.8297 20.02 19.23V11C20.02 10.867 19.9935 10.7353 19.942 10.6126C19.8905 10.49 19.8151 10.3789 19.7201 10.2857C19.6251 10.1926 19.5125 10.1194 19.3888 10.0703C19.2652 10.0212 19.133 9.99734 19 10ZM5 20C4.73478 20 4.48043 19.8946 4.29289 19.7071C4.10536 19.5196 4 19.2652 4 19V15.43L6.89 12.54C7.03615 12.3947 7.23389 12.3131 7.44 12.3131C7.64611 12.3131 7.84385 12.3947 7.99 12.54L15.46 20H5ZM18 19C17.9936 19.1936 17.931 19.3812 17.82 19.54L13.3 15L14.01 14.3C14.0817 14.2268 14.1673 14.1687 14.2617 14.129C14.3561 14.0893 14.4576 14.0689 14.56 14.0689C14.6624 14.0689 14.7639 14.0893 14.8583 14.129C14.9527 14.1687 15.0383 14.2268 15.11 14.3L18 17.21V19ZM21 4H20V3C20 2.73478 19.8946 2.48043 19.7071 2.29289C19.5196 2.10536 19.2652 2 19 2C18.7348 2 18.4804 2.10536 18.2929 2.29289C18.1054 2.48043 18 2.73478 18 3V4H17C16.7348 4 16.4804 4.10536 16.2929 4.29289C16.1054 4.48043 16 4.73478 16 5C16 5.26522 16.1054 5.51957 16.2929 5.70711C16.4804 5.89464 16.7348 6 17 6H18V7C18 7.26522 18.1054 7.51957 18.2929 7.70711C18.4804 7.89464 18.7348 8 19 8C19.2652 8 19.5196 7.89464 19.7071 7.70711C19.8946 7.51957 20 7.26522 20 7V6H21C21.2652 6 21.5196 5.89464 21.7071 5.70711C21.8946 5.51957 22 5.26522 22 5C22 4.73478 21.8946 4.48043 21.7071 4.29289C21.5196 4.10536 21.2652 4 21 4Z" fill="gray"/>
                </svg>
                <p className={styles.uploadText}>
                    Drag and drop or click to upload (JPEG, JPG, PNG, max 1MB)
                </p>
                </div>
            )}
            </div>
            {formData.service.image && !imageError && (
            <p className={`${styles.message} ${styles.success}`}>File uploaded successfully</p>
            )}

            {imageError && (
            <p className={`${styles.message} ${styles.error}`}>{imageError}</p>
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
                <input type="text" name="type" data-section="additionalFee" 
                onChange={handleChange} value={formData.additionalFee.type} maxLength={50} />
                {!formData.additionalFee.type && additionalFeeWarning && 
                <p className={styles.error}>{additionalFeeWarning}</p>}
            </div>

            <div className={styles.form_group}>
                <label>Description</label>
                <textarea name="description" data-section="additionalFee" onChange={handleChange} rows={3} 
                maxLength={100} value={formData.additionalFee.description} />
                {!formData.additionalFee.description && additionalFeeWarning && 
                <p className={styles.error}>{additionalFeeWarning}</p>}
            </div>
            </div>

            <div className={styles.additional_fees_right}>
            <div className={styles.form_group}>
                <label>Amount</label>
                <input 
                    type="number" 
                    name="amount" 
                    placeholder="₱"
                    data-section="additionalFee" 
                    min="0" 
                    step="0.01" 
                    onChange={handleChange} 
                    value={formData.additionalFee.amount} 
                    onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()} 
                    className={`${styles.peso_input} ${styles.short_input}`}

                />
        {!(formData.additionalFee.amount > 0) && additionalFeeWarning && 
            <p className={styles.error}>{additionalFeeWarning}</p>}
        </div>

            </div>
        </div>
        </div>

      {/* Buttons */}
      <div className={styles.full_width}>
          <div className={styles.button_container}>
            <CustomButton type="submit" label="Add Cabin" />
            <CustomButton type="button" label="Clear" variant="secondary" onClick={handleClear} />
            <CustomButton type="button" label="Cancel" variant="danger" onClick={() => router.push("/admin/cabins")} />
          </div>
        </div>
      </form>
      )}
    </div>
  );
}
