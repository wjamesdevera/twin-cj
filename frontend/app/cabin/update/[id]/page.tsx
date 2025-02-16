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
      image: null,
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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCabin = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/services/cabins/${id}`);
        const responseText = await response.text();
        console.log("Raw Response:", responseText);
  
        const data = JSON.parse(responseText);
        console.log("Parsed Data:", data);
  
        if (response.ok && data.data?.cabin) {
          const cabin = data.data.cabin;
          console.log("Extracted Cabin:", cabin);
  
          setFormData({
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
          });
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
      <input type="text" name="name" data-section="service" value={formData.service.name} onChange={handleChange} required />
      <br />

      <label>Description</label>
      <br />
      <textarea
        name="description"
        data-section="service"
        value={formData.service.description}
        onChange={handleChange}
        rows={4}
        cols={50}
        style={{ resize: "vertical" }}
        required
      />
      <br />

      <label>Minimum Capacity</label>
      <br />
      <input
        type="number"
        name="minCapacity"
        data-section="cabin"
        value={formData.cabin.minCapacity}
        min="1"
        onChange={handleChange}
        required
      />
      <br />

      <label>Maximum Capacity</label>
      <br />
      <input
        type="number"
        name="maxCapacity"
        data-section="cabin"
        value={formData.cabin.maxCapacity}
        min={formData.cabin.minCapacity}
        onChange={handleChange}
        required
      />
      <br />

      <label>New Image (Optional)</label>
      <br />
      <input type="file" name="image" data-section="service" accept="image/*" onChange={handleChange} />
      <br />

      <label>Quantity</label>
      <br />
      <input type="number" name="quantity" data-section="service" value={formData.service.quantity} min="1" onChange={handleChange} required />
      <br />

      <label>Rate</label>
      <br />
      <input type="number" name="price" placeholder="₱" data-section="service" value={formData.service.price} min="0" onChange={handleChange} required />
      <br />

      <h1 style={{ fontWeight: "bold" }}>Additional Fees (Optional)</h1>

      Type
      <br />
      <input type="text" name="type" data-section="additionalFee" value={formData.additionalFee.type} onChange={handleChange} placeholder="e.g., Cleaning Fee" />
      <br />

      Description
      <br />
      <textarea name="description" data-section="additionalFee" value={formData.additionalFee.description} onChange={handleChange} rows={2} cols={50} />
      <br />

      Amount
      <br />
      <input type="number" name="amount" data-section="additionalFee" value={formData.additionalFee.amount} min="0" onChange={handleChange} />
      <br />

      <button type="submit">Update Cabin</button>
      <button type="button" onClick={() => router.push("/cabin")}>Cancel</button>
    </form>
  );
}
