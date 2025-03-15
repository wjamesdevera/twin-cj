"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loading } from "@/app/components/loading";
import useSWR from "swr";
import { getCabin } from "@/app/lib/api";
import { options } from "@/app/api";

export default function UpdateCabin() {
  const router = useRouter();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    service: {
      name: "",
      description: "",
      imageUrl: "",
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

  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<{
    service: {
      name: string;
      description: string;
      imageUrl: string;
      image: File | null;
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
  const [isMutating, setIsMutating] = useState<boolean>(false);

  const { data, isLoading } = useSWR(id, getCabin);

  useEffect(() => {
    if (data) {
      const { cabin } = data.data;
      setFormData({
        service: {
          name: cabin?.name || "",
          description: cabin.description || "",
          imageUrl: cabin.imageUrl || "",
          image: null,
          price: cabin.price,
        },
        cabin: {
          minCapacity: cabin.minCapacity ?? 1,
          maxCapacity: cabin.maxCapacity ?? 1,
        },
        additionalFee: {
          type: cabin.additionalFee?.type || "",
          description: cabin.additionalFee?.description || "",
          amount: cabin.additionalFee?.amount || 0,
        },
      });
    }
  }, [data]);

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    minCapacity: "",
    maxCapacity: "",
    price: "",
    image: "",
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
        return;
      }

      setErrors((prev) => ({ ...prev, image: "" }));
      setFormData((prev) => ({
        ...prev,
        service: { ...prev.service, image: file },
      }));
    } else {
      const numericFields = ["price", "minCapacity", "maxCapacity", "amount"];
      const newValue = numericFields.includes(name)
        ? value === ""
          ? ""
          : Number(value)
        : value;
      
      if (typeof newValue === "number") {
        if (name === "minCapacity") {
          if (newValue < 1 || newValue > 99) return;
        }
  
        if (name === "maxCapacity") {
          if (newValue <= formData.cabin.minCapacity || newValue > 99) return;
        }
      }

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

    const isConfirmed = window.confirm(
      "Are you sure you want to update this cabin?"
    );
    if (!isConfirmed) return;

    const newErrors = {
      name: validateField("name", formData.service.name),
      description: validateField("description", formData.service.description),
      minCapacity: validateField("minCapacity", formData.cabin.minCapacity),
      maxCapacity: validateField("maxCapacity", formData.cabin.maxCapacity),
      price: validateField("price", formData.service.price),
      image: "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }

    const isChanged = JSON.stringify(formData) !== JSON.stringify(initialData);
    if (!isChanged) {
      alert(
        "No changes detected. Please modify at least one field before submitting."
      );
      return;
    }

    let imageUrl = formData.service.imageUrl;

    if (formData.service.image) {
      const imageFormData = new FormData();
      imageFormData.append("file", formData.service.image);

      try {
        const uploadResponse = await fetch(`${options.baseURL}/api/upload`, {
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

    // const requestBody = {
    //   service: {
    //     name: formData.service.name,
    //     description: formData.service.description,
    //     imageUrl: imageUrl,
    //     price: formData.service.price,
    //   },
    //   cabin: {
    //     minCapacity: formData.cabin.minCapacity,
    //     maxCapacity: formData.cabin.maxCapacity,
    //   },
    //   additionalFee:
    //     formData.additionalFee.type ||
    //     formData.additionalFee.description ||
    //     formData.additionalFee.amount > 0
    //       ? { ...formData.additionalFee }
    //       : null,
    // };

    const requestBody: any = {
      name: formData.service.name,
      description: formData.service.description,
      price: Number(formData.service.price),
      imageUrl: imageUrl,
      minCapacity: formData.cabin.minCapacity,
      maxCapacity: formData.cabin.maxCapacity,
    };

    if (
      formData.additionalFee.type &&
      formData.additionalFee.description &&
      formData.additionalFee.amount
    ) {
      requestBody.additionalFee = {
        type: formData.additionalFee.type,
        description: formData.additionalFee.description,
        amount: Number(formData.additionalFee.amount),
      };
    } else {
      requestBody.additionalFee = {
        type: "",
        description: "",
        amount: 0,
      };
    }

    const jsonData = {
      data: JSON.stringify(requestBody),
    };

    try {
      setIsMutating(true);

      const response = await fetch(
        `http://localhost:8080/api/services/cabins/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsonData),
        }
      );

      if (response.ok) {
        alert("Cabin updated successfully!");
        router.push("/admin/cabins");
      } else {
        throw new Error("Failed to update cabin.");
      }
    } catch (error) {
      console.error("Error updating cabin:", error);
    } finally {
      setIsMutating(false);
    }
  };

  const isFormInvalid =
    Object.values(errors).some((error) => error !== "") ||
    additionalFeeWarning !== "" ||
    JSON.stringify(formData) === JSON.stringify(initialData);

  const handleClear = () => {
    if (initialData) {
      setFormData(initialData);
      setErrors({
        name: "",
        description: "",
        minCapacity: "",
        maxCapacity: "",
        price: "",
        image: "",
      });
      setAdditionalFeeWarning("");
      document.querySelectorAll("input, textarea").forEach((input) => {
        (input as HTMLInputElement | HTMLTextAreaElement).value = "";
      });
    }
  };

  // if (loading) return <p>Loading cabin details...</p>;
  // if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      {isMutating ? (
        <Loading />
      ) : (
        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <br />
          <input
            type="text"
            name="name"
            data-section="service"
            value={formData.service.name}
            onChange={handleChange}
            maxLength={50}
          />
          <p className="error" style={{ color: "red" }}>
            {errors.name}
          </p>
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
            maxLength={100}
          />
          <p className="error" style={{ color: "red" }}>
            {errors.description}
          </p>
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
            max={formData.cabin.maxCapacity - 1 || 1}
            onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
          />
          <p className="error" style={{ color: "red" }}>
            {errors.minCapacity}
          </p>
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
            max={30}
            onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
          />
          <p className="error" style={{ color: "red" }}>
            {errors.maxCapacity}
          </p>
          <br />
          <label>New Image (Optional)</label>
          <br />
          <input
            type="file"
            name="image"
            data-section="service"
            accept="image/jpeg, image/jpg, image/png, image/gif"
            onChange={handleChange}
          />
          <p className="error" style={{ color: "red" }}>
            {errors.image}
          </p>
          <br />
          <label>Rate</label>
          <br />
          <input
            type="number"
            name="price"
            placeholder="₱"
            data-section="service"
            step="0.01"
            value={formData.service.price || ""}
            min="1"
            onChange={handleChange}
          />
          <p className="error" style={{ color: "red" }}>
            {errors.price}
          </p>
          <br />
          <h1 style={{ fontWeight: "bold" }}>Additional Fees (Optional)</h1>
          <br />
          Type
          <br />
          <input
            type="text"
            name="type"
            data-section="additionalFee"
            value={formData.additionalFee.type}
            onChange={handleChange}
            maxLength={50}
          />
          {!formData.additionalFee.type && additionalFeeWarning && (
            <p style={{ color: "red" }}>{additionalFeeWarning}</p>
          )}
          <br /><br />
          Description
          <br />
          <textarea
            name="description"
            data-section="additionalFee"
            value={formData.additionalFee.description}
            onChange={handleChange}
            rows={3}
            cols={30}
            maxLength={100}
          />
          {!formData.additionalFee.description && additionalFeeWarning && (
            <p style={{ color: "red" }}>{additionalFeeWarning}</p>
          )}
          <br /><br />
          Amount
          <br />
          <input
            type="number"
            name="amount"
            data-section="additionalFee"
            value={formData.additionalFee.amount}
            min="0"
            step="0.01"
            onChange={handleChange}
            onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
          />
          {!(formData.additionalFee.amount > 0) && additionalFeeWarning && (
            <p style={{ color: "red" }}>{additionalFeeWarning}</p>
          )}
          <br /><br />
          <button
            type="submit"
            disabled={isFormInvalid}
            style={{
              opacity: isFormInvalid ? 0.5 : 1,
              cursor: isFormInvalid ? "not-allowed" : "pointer",
            }}
          >
            Update Cabin
          </button>
          <button type="button" onClick={handleClear}>
            Reset
          </button>
          <button type="button" onClick={() => router.push("/admin/cabins")}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}
