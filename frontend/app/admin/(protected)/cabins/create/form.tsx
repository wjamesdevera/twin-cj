"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loading } from "@/app/components/loading";
import styles from "./form.module.scss"; 

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
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    minCapacity: "",
    maxCapacity: "",
    image: "",
    price: "",
  });

  const [additionalFeeWarning, setAdditionalFeeWarning] = useState("");

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

      setErrors((prev) => ({
        ...prev,
        [name]: sanitizedValue ? "" : prev[name as keyof typeof prev],
      }));

      return;
    }

    if (files && files[0]) {
        const file = files[0];
        const validFormats = ["image/jpeg", "image/jpg", "image/png"];
  
        if (!validFormats.includes(file.type)) {
          setErrors((prev) => ({
            ...prev,
            image: "Invalid image format. Only JPG or PNG allowed.",
          }));
          e.target.value = "";
          setFormData((prev) => ({
            ...prev,
            service: { ...prev.service, image: null },
          }));
          setImagePreview(null);
          return;
        }

      if (file.size > 1048576) {
        setErrors((prev) => ({
          ...prev,
          image: "File size must be less than 1MB.",
        }));
        e.target.value = "";
        setFormData((prev) => ({
          ...prev,
          service: { ...prev.service, image: null },
        }));
        setImagePreview(null);
        return;
      }

      setErrors((prev) => ({ ...prev, image: "" }));
      setFormData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [name]: file },
      }));

         const reader = new FileReader();
         reader.onload = (e) => {
           setImagePreview(e.target?.result as string);
         };
         reader.readAsDataURL(file);
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

      setErrors((prev) => ({
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
          setAdditionalFeeWarning("");
        } else if (type || description || amount > 0) {
          setAdditionalFeeWarning(
            "Please complete all additional fee fields or leave them empty."
          );
        } else {
          setAdditionalFeeWarning("");
        }
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
      setAdditionalFeeWarning(
        "Please complete all additional fee fields or leave them empty."
      );
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

  const isFormInvalid =
    Object.values(errors).some((error) => error !== "") ||
    additionalFeeWarning !== "";

  return (
    <div>
      {isMutating ? (
        <Loading />
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.left_column}>
            <div className={styles.form_group}>
              <label>Service Name <span className={styles.required}>*</span></label>
              <input type="text" name="name" data-section="service" value={formData.service.name} onChange={handleChange} className={errors.name ? styles.invalid_input : ""} />
              {errors.name && <span className={styles.error}>{errors.name}</span>}
            </div>

            <div className={styles.form_group}>
              <label>Description <span className={styles.required}>*</span></label>
              <textarea name="description" data-section="service" value={formData.service.description} onChange={handleChange} className={errors.description ? styles.invalid_input : ""}></textarea>
              {errors.description && <span className={styles.error}>{errors.description}</span>}
            </div>

            <div className={styles.capacity_container}>
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
            </div>
          </div>

         {/* Right Column */}
         <div className={styles.right_column}>
            <div className={styles.form_group}>
              <label>Rate <span className={styles.required}>*</span></label>
              <div className={styles.peso_input_container}>
                <span className={styles.peso_prefix}>₱</span>
                <input type="number" name="price" data-section="service" value={formData.service.price} onChange={handleChange} className={errors.price ? styles.invalid_input : styles.peso_input} />
              </div>
              {errors.price && <span className={styles.error}>{errors.price}</span>}
            </div>

            <div className={styles.form_group}>
              <label>Upload Image <span className={styles.required}>*</span></label>
              <input type="file" name="image" data-section="service" onChange={handleChange} className={errors.image ? styles.invalid_input : ""} />
              {errors.image && <span className={styles.error}>{errors.image}</span>}
              {imagePreview && <img src={imagePreview} alt="Preview" className={styles.image_preview} />}
            </div>
          </div>

           {/* Additional Fees Section */}
        <div className={styles.full_width}>
            <h3 className={styles.section_title}>Additional Fees (Optional)</h3>
        </div>

            <div className={styles.additional_fees_container}>
            <div className={styles.additional_fees_left}>
                <div className={styles.type_amount_wrapper}>

            <div className={styles.form_group}>
                <label>Type</label>
                <input
                type="text"
                name="type"
                data-section="additionalFee"
                onChange={handleChange}
                maxLength={50}
                value={formData.additionalFee.type}
                />
                {!formData.additionalFee.type && additionalFeeWarning && (
                <p className={styles.error}>{additionalFeeWarning}</p>
                )}
            </div>

            <div className={`${styles.form_group} ${styles.small_field}`}>
                <label>Amount</label>
                <div className={styles.peso_input_container}>
                <span className={styles.peso_prefix}>₱</span>
                <input
                    type="number"
                    name="amount"
                    data-section="additionalFee"
                    min="0"
                    step="0.01"
                    onChange={handleChange}
                    value={formData.additionalFee.amount}
                    onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                    className={styles.peso_input}
                />
                </div>
                {!(formData.additionalFee.amount > 0) && additionalFeeWarning && (
                <p className={styles.error}>{additionalFeeWarning}</p>
                )}
            </div>
            </div>

            <div className={styles.form_group}>
            <label>Description</label>
            <textarea
                name="description"
                data-section="additionalFee"
                onChange={handleChange}
                rows={3}
                maxLength={100}
            />
            {!formData.additionalFee.description && additionalFeeWarning && (
                <p className={styles.error}>{additionalFeeWarning}</p>
            )}
            </div>
        </div>
        </div>


      {/* Buttons */}
      <div className={styles.full_width}>
        <div className={styles.button_container}>
          <button type="submit" disabled={isFormInvalid} className={styles.primary}>
            Add Cabin
          </button>
          <button type="button" onClick={() => router.push("/admin/cabins")} className={styles.secondary}>
            Cancel
          </button>
        </div>
      </div>
    </form>
      )}
    </div>
  );
}
