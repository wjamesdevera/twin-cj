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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, dataset, files } = e.target as HTMLInputElement;
    const section = dataset.section as "service" | "cabin" | "additionalFee";

    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: files ? files[0] : name === "quantity" || name === "price" || name.includes("Capacity") || name === "amount"
          ? Number(value)
          : value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imageUrl = "";

    // Upload Image First
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

    // Construct the request payload
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
        : undefined, // Only include additionalFee if valid
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

      console.log("Cabin added successfully!");
      router.push("/cabin");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      Title
      <br />
      <input type="text" name="name" data-section="service" onChange={handleChange} required />
      <br />

      Description
      <br />
      <textarea name="description" data-section="service" onChange={handleChange} rows={4} cols={50} required />
      <br />

      Minimum Capacity
      <br />
      <input type="number" name="minCapacity" data-section="cabin" min="1" onChange={handleChange} required />
      <br />

      Maximum Capacity
      <br />
      <input type="number" name="maxCapacity" data-section="cabin" min={formData.cabin.minCapacity} onChange={handleChange} required />
      <br />

      Image
      <br />
      <input type="file" name="image" data-section="service" accept="image/*" onChange={handleChange} required />
      <br />

      Quantity
      <br />
      <input type="number" name="quantity" data-section="service" min="1" onChange={handleChange} required />
      <br />
      
      Rate
      <br />
      <input type="number" name="price" placeholder="₱" data-section="service" min="0" onChange={handleChange} required />
      <br />

      <h1 style={{ fontWeight: "bold" }}>Additional Fees (Optional)</h1>

      Type
      <br />
      <input type="text" name="type" data-section="additionalFee" onChange={handleChange} placeholder="e.g., Cleaning Fee" />
      <br />

      Description
      <br />
      <textarea name="description" data-section="additionalFee" onChange={handleChange} rows={2} cols={50} />
      <br />

      Amount
      <br />
      <input type="number" name="amount" data-section="additionalFee" min="0" onChange={handleChange} />
      <br />

      <button type="submit">Add New Cabin</button>
      <button type="button" onClick={() => router.push("/cabin")}>Cancel</button>
    </form>
  );
}
