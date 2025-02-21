"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface Cabin {
  id: number;
  minCapacity: number;
  maxCapacity: number;
  service: Service;
  createdAt?: string;
  updatedAt?: string;
}

const formatPrice = (price: number) => {
  return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatDate = (isoString?: string) => {
  if (!isoString) return "N/A";
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
};

const CabinDashboard = () => {
  const router = useRouter();

  const [cabins, setCabins] = useState<Cabin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCabins, setSelectedCabins] = useState<number[]>([]);

  useEffect(() => {
    const fetchCabins = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/services/cabins");
        if (!response.ok) {
          throw new Error("Failed to fetch cabins");
        }
        const data = await response.json();
        setCabins(data.data.cabins);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCabins();
  }, []);

  const toggleSelection = (id: number) => {
    setSelectedCabins((prev) =>
      prev.includes(id) ? prev.filter((cabinId) => cabinId !== id) : [...prev, id]
    );
  };

  const deleteCabin = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this cabin?")) return;

    try {
      const response = await fetch(`http://localhost:8080/api/services/cabins/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete cabin");
      }

      setCabins((prevCabins) => prevCabins.filter((cabin) => cabin.id !== id));
      setSelectedCabins((prev) => prev.filter((cabinId) => cabinId !== id));

      alert("Cabin deleted successfully!");
    } catch (err) {
      console.error("Error deleting cabin:", err);
      alert("Error deleting cabin.");
    }
  };

  const deleteSelectedCabins = async () => {
    if (selectedCabins.length === 0) {
      alert("No cabins selected.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete the selected cabin/s?")) return;

    try {
      const response = await fetch(`http://localhost:8080/api/services/cabins/bulk-delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedCabins }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete selected cabin/s");
      }

      setCabins((prevCabins) => prevCabins.filter((cabin) => !selectedCabins.includes(cabin.id)));
      setSelectedCabins([]);

      alert("Selected cabin/s deleted successfully!");
    } catch (err) {
      console.error("Error deleting selected cabin/s:", err);
      alert("Error deleting selected cabin/s.");
    }
  };

  if (loading) return <p>Loading cabins...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <button onClick={() => router.push("/cabin/create")}>Add Cabin</button>
      <button onClick={deleteSelectedCabins} disabled={selectedCabins.length === 0}>Delete Selected</button>

      <div>
        <table style={{ width: "100%", textAlign: "center" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid" }}>Select</th>
              <th style={{ border: "1px solid" }}>Action</th>
              <th style={{ border: "1px solid" }}>ID</th>
              <th style={{ border: "1px solid" }}>Name</th>
              <th style={{ border: "1px solid" }}>Image</th>
              <th style={{ border: "1px solid" }}>Description</th>
              <th style={{ border: "1px solid" }}>Rate</th>
              <th style={{ border: "1px solid" }}>Minimum Capacity</th>
              <th style={{ border: "1px solid" }}>Maximum Capacity</th>
              <th style={{ border: "1px solid" }}>Quantity</th>
              <th style={{ border: "1px solid" }}>Date Created</th>
              <th style={{ border: "1px solid" }}>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {cabins.map((cabin) => (
              <tr key={cabin.id}>
                <td style={{ border: "1px solid", verticalAlign: "middle" }}>
                  <input
                    type="checkbox"
                    checked={selectedCabins.includes(cabin.id)}
                    onChange={() => toggleSelection(cabin.id)}
                  />
                </td>
                <td style={{ border: "1px solid", verticalAlign: "middle" }}>
                  <button onClick={() => router.push(`/cabin/update/${cabin.id}`)}>Edit</button>
                  <button onClick={() => deleteCabin(cabin.id)}>Delete</button>
                </td>
                <td style={{ border: "1px solid", verticalAlign: "middle" }}>{cabin.id}</td>
                <td style={{ border: "1px solid", verticalAlign: "middle" }}>{cabin.service.name}</td>
                <td style={{ border: "1px solid", verticalAlign: "middle" }}>
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Image src={cabin.service.imageUrl} alt={cabin.service.name} width={135} height={90} />
                  </div>
                </td>
                <td style={{ border: "1px solid", verticalAlign: "middle" }}>{cabin.service.description}</td>
                <td style={{ border: "1px solid", verticalAlign: "middle" }}>₱{formatPrice(cabin.service.price)}</td>
                <td style={{ border: "1px solid", verticalAlign: "middle" }}>{cabin.minCapacity}</td>
                <td style={{ border: "1px solid", verticalAlign: "middle" }}>{cabin.maxCapacity}</td>
                <td style={{ border: "1px solid", verticalAlign: "middle" }}>{cabin.service.quantity}</td>
                <td style={{ border: "1px solid", verticalAlign: "middle" }}>{formatDate(cabin.createdAt)}</td>
                <td style={{ border: "1px solid", verticalAlign: "middle" }}>{formatDate(cabin.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CabinDashboard;
