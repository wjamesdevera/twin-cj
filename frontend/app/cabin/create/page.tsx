"use client";

import { useState } from "react";

export default function CabinForm() {
  const [formData, setFormData] = useState({
    service: {
      name: "",
      description: "",
      image: null,
      quantity: 1,
      price: 0,
    },
    cabin: {
      minCapacity: 1,
      maxCapacity: 1,
      additionalFeeId: null,
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, dataset, files } = e.target as HTMLInputElement; // Type assertion to support both elements
    const section = dataset.section as "service" | "cabin";
  
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: files ? files[0] : name === "quantity" || name === "price" || name.includes("Capacity")
          ? Number(value)
          : value,
      },
    }));
  };   

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    let imageUrl = "";
  
    // If an image is selected, upload it first
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
        imageUrl = uploadData.imageUrl; // Store uploaded image URL
      } catch (error) {
        console.error("Error uploading image:", error);
        return;
      }
    }
  
    // Now send the form data with the image URL
    const requestBody = {
      service: {
        name: formData.service.name,
        description: formData.service.description,
        imageUrl: imageUrl, // Use uploaded image URL
        quantity: formData.service.quantity,
        price: formData.service.price,
      },
      cabin: {
        minCapacity: formData.cabin.minCapacity,
        maxCapacity: formData.cabin.maxCapacity,
        additionalFeeId: formData.cabin.additionalFeeId ? Number(formData.cabin.additionalFeeId) : null,
      },
    };
  
    try {
      const response = await fetch("http://localhost:8080/api/services/cabins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      const data = await response.json();
      console.log("Success:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };    

  return (
    <form onSubmit={handleSubmit}>
      Title
      <br />
      <input type="text" name="name" data-section="service" onChange={handleChange} />
      <br />

      Description
      <br />
      <textarea name="description" data-section="service" onChange={handleChange} rows={4} cols={50} style={{ resize: "vertical" }} />
      <br />

      Minimum Capacity
      <br />
      <input type="number" name="minCapacity" data-section="cabin" min="1" onChange={handleChange} />
      <br />

      Maximum Capacity
      <br />
      <input type="number" name="maxCapacity" data-section="cabin" min={formData.cabin.minCapacity} onChange={handleChange} />
      <br />

      Image
      <br />
      <input type="file" name="image" data-section="service" accept="image/*" onChange={handleChange} />
      <br />

      Quantity
      <br />
      <input type="number" name="quantity" data-section="service" min="1" onChange={handleChange} />
      <br />
      
      Rate
      <br />
      <input type="number" name="price" placeholder="₱" data-section="service" min="0" onChange={handleChange} />
      <br />

      Additional Fee ID (Optional)
      <br />
      <input type="text" name="additionalFeeId" data-section="cabin" onChange={handleChange} />
      <br />

      <button type="submit">Add New Cabin</button>
    </form>
  );
}
