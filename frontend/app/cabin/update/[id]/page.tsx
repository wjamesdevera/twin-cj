"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function UpdateCabin() {
  const router = useRouter();
  const { id } = useParams(); // Get cabin ID from URL params

  const [formData, setFormData] = useState({
    service: {
      name: "",
      description: "",
      imageUrl: "", // Existing image URL
      image: null, // New uploaded image
      quantity: 1,
      price: 0,
    },
    cabin: {
      minCapacity: 1,
      maxCapacity: 1,
      additionalFeeId: null,
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch existing cabin data
  useEffect(() => {
    const fetchCabin = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/services/cabins/${id}`);
        const responseText = await response.text();
        console.log("Raw Response:", responseText); // ✅ Debugging raw response
  
        const data = JSON.parse(responseText); // Convert text response to JSON
        console.log("Parsed Data:", data); // ✅ Debugging parsed response
  
        if (response.ok && data.data?.cabin) {
          const cabin = data.data.cabin;
          console.log("Extracted Cabin:", cabin); // ✅ Debugging extracted cabin object
  
          setFormData({
            service: {
              name: cabin.service.name || "",
              description: cabin.service.description || "",
              imageUrl: cabin.service.imageUrl || "",
              image: null, // No file initially
              quantity: 1, // API does not return quantity, defaulting to 1
              price: cabin.service.price || 0
            },
            cabin: {
              minCapacity: cabin.minCapacity || 1,
              maxCapacity: cabin.maxCapacity || 1,
              additionalFeeId: cabin.additionalFee ? cabin.additionalFee.id : null
            }
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

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, dataset, files } = e.target as HTMLInputElement;
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imageUrl = formData.service.imageUrl;

    // Upload new image if selected
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
        imageUrl = uploadData.imageUrl; // Store new image URL
      } catch (error) {
        console.error("Error uploading image:", error);
        return;
      }
    }

    // Prepare the updated request body
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
        additionalFeeId: formData.cabin.additionalFeeId ? Number(formData.cabin.additionalFeeId) : null,
      },
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
        router.push("/cabin"); // Redirect to cabin list after update
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
      <h1 className="text-xl font-bold mb-4">Update Cabin</h1>

      <label>Title</label>
      <br />
      <input type="text" name="name" data-section="service" value={formData.service.name} onChange={handleChange} />
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
      />
      <br />

      <label>Current Image</label>
      <br />
      {formData.service.imageUrl && (
        <img src={`http://localhost:8080/uploads/${formData.service.imageUrl}`} alt="Cabin Image" width="100" />
      )}
      <br />

      <label>New Image (Optional)</label>
      <br />
      <input type="file" name="image" data-section="service" accept="image/*" onChange={handleChange} />
      <br />

      <label>Quantity</label>
      <br />
      <input type="number" name="quantity" data-section="service" value={formData.service.quantity} min="1" onChange={handleChange} />
      <br />

      <label>Rate</label>
      <br />
      <input type="number" name="price" placeholder="₱" data-section="service" value={formData.service.price} min="0" onChange={handleChange} />
      <br />

      <label>Additional Fee ID (Optional)</label>
      <br />
      <input type="text" name="additionalFeeId" data-section="cabin" value={formData.cabin.additionalFeeId || ""} onChange={handleChange} />
      <br />

      <button type="submit">Update Cabin</button>
      <button type="button" onClick={() => router.push("/cabin")}>Cancel</button>
    </form>
  );
}
