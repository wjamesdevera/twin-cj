"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateCabin() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    service: {
      name: "",
      description: "",
      image: null as File | null,
      quantity: 1,
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

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    minCapacity: "",
    maxCapacity: "",
    image: "",
    quantity: "",
    price: "",
  });

  const [additionalFeeWarning, setAdditionalFeeWarning] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, dataset, files } = e.target as HTMLInputElement;
    const section = dataset.section as "service" | "cabin" | "additionalFee";
  
    if (files && files[0]) {
      const file = files[0];
      const validFormats = ["image/jpeg", "image/jpg", "image/png"]; // Allowed formats
  
      // Check for valid format
      if (!validFormats.includes(file.type)) {
        setErrors((prev) => ({ ...prev, image: "Invalid image format. Only JPG or PNG allowed." }));
        e.target.value = ""; // Clear the file input
        setFormData((prev) => ({
          ...prev,
          service: { ...prev.service, image: null }, // Clear previously uploaded image
        }));
        return;
      }
  
      // Check for file size
      if (file.size > 1048576) {
        setErrors((prev) => ({ ...prev, image: "File size must be less than 1MB." }));
        e.target.value = "";
        setFormData((prev) => ({
          ...prev,
          service: { ...prev.service, image: null }, // Clear previously uploaded image
        }));
        return;
      }
  
      // If file is valid, clear errors and store the new image
      setErrors((prev) => ({ ...prev, image: "" }));
      setFormData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [name]: file },
      }));
    } else {
      const numericFields = ["quantity", "price", "minCapacity", "maxCapacity", "amount"];
      const newValue = numericFields.includes(name) ? (value === "" ? "" : Number(value)) : value; // Ensure numeric conversion
      
      setFormData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [name]: newValue }, // Use `newValue` instead of `value`
      }));
  
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, newValue),
      }));

      // Ensure correct handling of additional fee fields
      if (section === "additionalFee") {
        const updatedAdditionalFee = {
          ...formData.additionalFee,
          [name]: newValue, // Ensure type safety
        };
      
        const { type, description, amount } = updatedAdditionalFee;

        if ((type || description || amount) && (!type || !description || amount <= 0)) {
          setAdditionalFeeWarning("Please complete all additional fee fields or leave them empty.");
        } else {
          setAdditionalFeeWarning("");
        }
      }
    }
  };  

  const validateField = (name: string, value: any) => {
    // Check for empty values first
    if (value === "" || value === null || value === undefined) {
      if (["name", "description", "quantity", "price", "minCapacity", "maxCapacity"].includes(name)) {
        return "This field is required.";
      }
    }
  
    // Custom validation rules
    if (name === "price" && (isNaN(value) || value < 1)) {
      return "Rate must be greater than 0.";
    }
    if (name === "quantity" && (isNaN(value) || value < 1)) {
      return "Quantity must be at least 1.";
    }
    if (name === "minCapacity" && (isNaN(value) || value < 1)) {
      return "Minimum capacity must be at least 1.";
    }
    if (name === "maxCapacity") {
      if (isNaN(value) || value < 1) {
        return "Maximum capacity must be at least 1.";
      }
      if (value < formData.cabin.minCapacity) {
        return "Maximum capacity cannot be less than minimum capacity.";
      }
    }
  
    return "";
  };  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isConfirmed = window.confirm("Are you sure you want to add this cabin?");
    if (!isConfirmed) return;

    // Validate all fields before submission
    const newErrors = {
      name: validateField("name", formData.service.name),
      description: validateField("description", formData.service.description),
      minCapacity: validateField("minCapacity", formData.cabin.minCapacity),
      maxCapacity: validateField("maxCapacity", formData.cabin.maxCapacity),
      quantity: validateField("quantity", formData.service.quantity),
      price: validateField("price", formData.service.price),
      image: formData.service.image ? "" : "Image is required.",
    };

    setErrors(newErrors);

    // Check if there are any errors before proceeding
    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }

    let imageUrl = "";
    if (formData.service.image) {
      const imageFormData = new FormData();
      imageFormData.append("image", formData.service.image);

      try {
        const uploadResponse = await fetch("http://localhost:8080/api/upload", {
          method: "POST",
          body: imageFormData,
        });

        const uploadData = await uploadResponse.json();
        if (!uploadResponse.ok) {
          throw new Error(uploadData.message || "Image upload failed");
        }
        imageUrl = uploadData.imageUrl;
      } catch (error) {
        console.error("Error uploading image:", error);
        return;
      }
    }

    const requestBody = {
      service: {
        name: formData.service.name,
        description: formData.service.description,
        imageUrl: imageUrl,
        quantity: formData.service.quantity,
        price: formData.service.price,
      },
      cabin: {
        minCapacity: formData.cabin.minCapacity,
        maxCapacity: formData.cabin.maxCapacity,
      },
      additionalFee: formData.additionalFee.type && formData.additionalFee.amount > 0
        ? { ...formData.additionalFee }
        : undefined,
    };

    try {
      const response = await fetch("http://localhost:8080/api/services/cabins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to create cabin");
      }

      alert("Cabin created successfully!");
      router.push("/cabin");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Title</label>
      <br />
      <input type="text" name="name" data-section="service" onChange={handleChange} />
      <p className="error" style={{ color: "red" }}>{errors.name}</p>
      <br />

      <label>Description</label>
      <br />
      <textarea name="description" data-section="service" onChange={handleChange} rows={3} cols={30} />
      <p className="error" style={{ color: "red" }}>{errors.description}</p>
      <br />

      <label>Minimum Capacity</label>
      <br />
      <input type="number" name="minCapacity" data-section="cabin" min="1" value={formData.cabin.minCapacity || ""} onChange={handleChange} />
      <p className="error" style={{ color: "red" }}>{errors.minCapacity}</p>
      <br />

      <label>Maximum Capacity</label>
      <br />
      <input type="number" name="maxCapacity" data-section="cabin" min={formData.cabin.minCapacity} value={formData.cabin.maxCapacity || ""} onChange={handleChange} />
      <p className="error" style={{ color: "red" }}>{errors.maxCapacity}</p>
      <br />

      <label>Image</label>
      <br />
      <input type="file" name="image" data-section="service" accept="image/jpeg, image/jpg, image/png, image/gif" onChange={handleChange} />
      <p className="error" style={{ color: "red" }}>{errors.image}</p>
      <br />

      <label>Quantity</label>
      <br />
      <input type="number" name="quantity" data-section="service" min="1" value={formData.service.quantity || ""} onChange={handleChange} />
      <p className="error" style={{ color: "red" }}>{errors.quantity}</p>
      <br />

      <label>Rate</label>
      <br />
      <input type="number" name="price" placeholder="₱" data-section="service" min="1" step="0.01" value={formData.service.price || ""} onChange={handleChange} />
      <p className="error" style={{ color: "red" }}>{errors.price}</p>
      <br />

      <h1 style={{ fontWeight: "bold" }}>Additional Fees (Optional)</h1>
      <br />

      <label>Type</label>
      <br />
      <input type="text" name="type" data-section="additionalFee" onChange={handleChange} />
      <p style={{ color: "red" }}>{additionalFeeWarning}</p>
      <br />

      <label>Description</label>
      <br />
      <textarea name="description" data-section="additionalFee" onChange={handleChange} rows={3} cols={30} />
      <p style={{ color: "red" }}>{additionalFeeWarning}</p>
      <br />

      <label>Amount</label>
      <br />
      <input type="number" name="amount" placeholder="₱" data-section="additionalFee" min="0" step="0.01" onChange={handleChange} />
      <p style={{ color: "red" }}>{additionalFeeWarning}</p>
      <br />

      <button type="submit">Add Cabin</button>
      <button type="button" onClick={() => router.push("/cabin")}>Cancel</button>
    </form>
  );
}
