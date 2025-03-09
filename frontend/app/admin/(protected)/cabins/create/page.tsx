"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loading } from "@/app/components/loading";
import useSWRMutation from "swr/mutation";
import { createCabin } from "@/app/lib/api";

export default function CreateCabin() {
  const router = useRouter();

  const { trigger, isMutating } = useSWRMutation(
    "create cabin",
    (key, { arg }: { arg: FormData }) => createCabin(arg),
    {
      onSuccess: () => {
        router.push("/admin/cabins");
      },
    }
  );

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
        [section]: { ...prev[section], [name]: file },
      }));
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

        if (
          (type || description || amount) &&
          (!type || !description || amount <= 0)
        ) {
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
    document.querySelectorAll("input, textarea").forEach((input) => {
      (input as HTMLInputElement | HTMLTextAreaElement).value = "";
    });
  };

  return (
    <div>
      {isMutating ? (
        <Loading />
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginTop: "80px" }}></div>

          <label>Title</label>
          <br />
          <input
            type="text"
            name="name"
            data-section="service"
            onChange={handleChange}
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
            onChange={handleChange}
            rows={3}
            cols={30}
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
            min="1"
            value={formData.cabin.minCapacity || ""}
            onChange={handleChange}
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
            min={formData.cabin.minCapacity}
            value={formData.cabin.maxCapacity || ""}
            onChange={handleChange}
          />
          <p className="error" style={{ color: "red" }}>
            {errors.maxCapacity}
          </p>
          <br />

          <label>Image</label>
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
            min="1"
            step="0.01"
            value={formData.service.price || ""}
            onChange={handleChange}
          />
          <p className="error" style={{ color: "red" }}>
            {errors.price}
          </p>
          <br />

          <h1 style={{ fontWeight: "bold" }}>Additional Fees (Optional)</h1>
          <br />

          <label>Type</label>
          <br />
          <input
            type="text"
            name="type"
            data-section="additionalFee"
            onChange={handleChange}
          />
          <p style={{ color: "red" }}>{additionalFeeWarning}</p>
          <br />

          <label>Description</label>
          <br />
          <textarea
            name="description"
            data-section="additionalFee"
            onChange={handleChange}
            rows={3}
            cols={30}
          />
          <p style={{ color: "red" }}>{additionalFeeWarning}</p>
          <br />

          <label>Amount</label>
          <br />
          <input
            type="number"
            name="amount"
            placeholder="₱"
            data-section="additionalFee"
            min="0"
            step="0.01"
            onChange={handleChange}
          />
          <p style={{ color: "red" }}>{additionalFeeWarning}</p>
          <br />

          <button
            type="submit"
            disabled={isFormInvalid}
            style={{
              opacity: isFormInvalid ? 0.9 : 1,
              cursor: isFormInvalid ? "not-allowed" : "pointer",
            }}
          >
            Add Cabin
          </button>
          <button type="button" onClick={handleClear}>
            Clear
          </button>
          <button type="button" onClick={() => router.push("/cabin")}>
            Cancel
          </button>

          <div style={{ marginBottom: "80px" }}></div>
        </form>
      )}
    </div>
  );
}
