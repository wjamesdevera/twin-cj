"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function UpdateCabin() {
  const router = useRouter();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    service: {
      name: "",
      description: "",
      imageUrl: "",
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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<{
    service: {
      name: string;
      description: string;
      imageUrl: string;
      image: File | null;
      quantity: number;
      price: number;
    };
    cabin: {
      minCapacity: number;
      maxCapacity: number;
    };
    additionalFee: {
      type: string;
      description: string;
      amount: number;
    };
  } | null>(null);  

  useEffect(() => {
    const fetchCabin = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/services/cabins/${id}`);
        const data = await response.json();
  
        if (response.ok && data.data?.cabin) {
          const cabin = data.data.cabin;
  
          const formattedData = {
            service: {
              name: cabin.service.name || "",
              description: cabin.service.description || "",
              imageUrl: cabin.service.imageUrl || "",
              image: null,
              quantity: cabin.service.quantity || 1,
              price: cabin.service.price || 0,
            },
            cabin: {
              minCapacity: cabin.minCapacity || 1,
              maxCapacity: cabin.maxCapacity || 1,
            },
            additionalFee: cabin.additionalFee
              ? {
                  type: cabin.additionalFee.type || "",
                  description: cabin.additionalFee.description || "",
                  amount: cabin.additionalFee.amount || 0,
                }
              : { type: "", description: "", amount: 0 },
          };
  
          setFormData(formattedData);
          setInitialData(formattedData); // Store initial data for comparison
        } else {
          throw new Error(data.message || "Failed to fetch cabin details.");
        }
      } catch (err) {
        console.error("Error fetching cabin:", err);
        setError("Something went wrong while fetching data.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchCabin();
  }, [id]);

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    minCapacity: "",
    maxCapacity: "",
    quantity: "",
    price: "",
    image: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, dataset, files } = e.target as HTMLInputElement;
    const section = dataset.section as "service" | "cabin" | "additionalFee";
  
    if (files && files[0]) {
      const file = files[0];
      const validFormats = ["image/jpeg", "image/jpg", "image/png", "image/gif"]; // Allowed formats
  
      // Check for valid format
      if (!validFormats.includes(file.type)) {
        setErrors((prev) => ({ ...prev, image: "Invalid image format. Only JPG, PNG, or GIF allowed." }));
        e.target.value = ""; // Reset file input
        setFormData((prev) => ({ ...prev, service: { ...prev.service, image: null } })); // Reset image state
        return;
      }
  
      // Check for file size
      if (file.size > 1048576) {
        setErrors((prev) => ({ ...prev, image: "File size must be less than 1MB." }));
        e.target.value = ""; // Reset file input
        setFormData((prev) => ({ ...prev, service: { ...prev.service, image: null } })); // Reset image state
        return;
      }
  
      // If file is valid, store the new image and reset errors
      setErrors((prev) => ({ ...prev, image: "" }));
      setFormData((prev) => ({
        ...prev,
        service: { ...prev.service, image: file },
      }));
    } else {
      const numericFields = ["quantity", "price", "minCapacity", "maxCapacity", "amount"];
      const newValue = numericFields.includes(name) 
        ? value === "" ? "" : Number(value)  // Convert empty string to null
        : value;
  
      setFormData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [name]: newValue },
      }));
  
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, newValue),
      }));
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

    const newErrors = {
      name: validateField("name", formData.service.name),
      description: validateField("description", formData.service.description),
      minCapacity: validateField("minCapacity", formData.cabin.minCapacity),
      maxCapacity: validateField("maxCapacity", formData.cabin.maxCapacity),
      quantity: validateField("quantity", formData.service.quantity),
      price: validateField("price", formData.service.price),
      image: "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }
  
    // Check if any field has changed
    const isChanged = JSON.stringify(formData) !== JSON.stringify(initialData);
    if (!isChanged) {
      alert("No changes detected. Please modify at least one field before submitting.");
      return;
    }
  
    let imageUrl = formData.service.imageUrl;
  
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
      additionalFee:
        formData.additionalFee.type || formData.additionalFee.description || formData.additionalFee.amount > 0
          ? { ...formData.additionalFee }
          : null,
    };
  
    try {
      const response = await fetch(`http://localhost:8080/api/services/cabins/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      if (response.ok) {
        alert("Cabin updated successfully!");
        router.push("/cabin");
      } else {
        throw new Error("Failed to update cabin.");
      }
    } catch (error) {
      console.error("Error updating cabin:", error);
    }
  };

  if (loading) return <p>Loading cabin details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <form onSubmit={handleSubmit}>
      <label>Title</label>
      <br />
      <input type="text" name="name" data-section="service" value={formData.service.name} onChange={handleChange} />
      <p className="error" style={{ color: "red" }}>{errors.name}</p>
      <br />

      <label>Description</label>
      <br />
      <textarea
        name="description"
        data-section="service"
        value={formData.service.description}
        onChange={handleChange}
        rows={3}
        cols={30}
        style={{ resize: "vertical" }}
      />
      <p className="error" style={{ color: "red" }}>{errors.description}</p>
      <br />

      <label>Minimum Capacity</label>
      <br />
      <input
        type="number"
        name="minCapacity"
        data-section="cabin"
        value={formData.cabin.minCapacity || ""}
        min="1"
        onChange={handleChange}
      />
      <p className="error" style={{ color: "red" }}>{errors.minCapacity}</p>
      <br />

      <label>Maximum Capacity</label>
      <br />
      <input
        type="number"
        name="maxCapacity"
        data-section="cabin"
        value={formData.cabin.maxCapacity || ""}
        min={formData.cabin.minCapacity}
        onChange={handleChange}
      />
      <p className="error" style={{ color: "red" }}>{errors.maxCapacity}</p>
      <br />

      <label>New Image (Optional)</label>
      <br />
      <input type="file" name="image" data-section="service" accept="image/jpeg, image/jpg, image/png, image/gif" onChange={handleChange} />
      <p className="error" style={{ color: "red" }}>{errors.image}</p>
      <br />

      <label>Quantity</label>
      <br />
      <input type="number" name="quantity" data-section="service" value={formData.service.quantity || ""} min="1" onChange={handleChange} />
      <p className="error" style={{ color: "red" }}>{errors.quantity}</p>
      <br />

      <label>Rate</label>
      <br />
      <input type="number" name="price" placeholder="₱" data-section="service" value={formData.service.price || ""} min="1" onChange={handleChange} />
      <p className="error" style={{ color: "red" }}>{errors.price}</p>
      <br />

      <h1 style={{ fontWeight: "bold" }}>Additional Fees (Optional)</h1>
      <br />

      Type
      <br />
      <input type="text" name="type" data-section="additionalFee" value={formData.additionalFee.type} onChange={handleChange} />
      <br /><br />

      Description
      <br />
      <textarea name="description" data-section="additionalFee" value={formData.additionalFee.description} onChange={handleChange} rows={3} cols={30} />
      <br /><br />

      Amount
      <br />
      <input type="number" name="amount" data-section="additionalFee" value={formData.additionalFee.amount} min="0" onChange={handleChange} />
      <br /><br />

      <button type="submit">Update Cabin</button>
      <button type="button" onClick={() => router.push("/cabin")}>Cancel</button>
    </form>
  );
}
