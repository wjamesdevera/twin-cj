"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import { deleteCabin, getCabins, multiDeleteCabin } from "@/app/lib/api";
import { Loading } from "@/app/components/loading";
import useSWRMutation from "swr/mutation";

interface Service {
  id: number;
}

interface AdditionalFee {
  type: string;
  description: string;
  amount: number;
}

interface Cabin {
  id: number;
  minCapacity: number;
  maxCapacity: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  service: Service;
  additionalFee?: AdditionalFee | null;
  createdAt?: string;
  updatedAt?: string;
}

const formatPrice = (price: number) => {
  return price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatDate = (isoString?: string) => {
  if (!isoString) return "N/A";
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

const CabinDashboard = () => {
  const router = useRouter();

  const [selectedCabins, setSelectedCabins] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const { data, isLoading } = useSWR("getCabins", getCabins);

  const { cabins } = data?.data || [];

  const toggleSelection = (id: number) => {
    setSelectedCabins((prev) =>
      prev.includes(id)
        ? prev.filter((cabinId) => cabinId !== id)
        : [...prev, id]
    );
  };

  const { trigger, isMutating } = useSWRMutation(
    "deleteCabin",
    (key, { arg }: { arg: number }) => deleteCabin(arg)
  );

  const handleDeleteCabin = async (id: number) => {
    // NOTE: Add a modal before running the trigger for deleteawait trigger(id);
    const confirmed = window.confirm(
      "Are you sure you want to delete the selected cabin/s?"
    );
    if (!confirmed) {
      return;
    }
    await trigger(id);
    mutate("getCabins");
    alert("Cabin deleted successfully!");
  };

  const deleteSelectedCabins = async () => {
    if (selectedCabins.length === 0) {
      alert("No cabins selected.");
      return;
    }

    // NOTE: ADD modal before deletion
    const confirmed = window.confirm(
      "Are you sure you want to delete the selected cabin/s?"
    );
    if (!confirmed) {
      return;
    }

    multiDeleteCabin(selectedCabins.join(","));
    setSelectedCabins([]);
    setSelectAll(false);

    alert("Selected cabin/s deleted successfully!");
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedCabins([]);
    } else {
      setSelectedCabins(cabins.map((cabin: Cabin) => cabin.id));
    }
    setSelectAll(!selectAll);
  };

  return isLoading ? (
    <Loading />
  ) : (
    <div>
      <button onClick={() => router.push("/admin/cabins/create")}>
        Add Cabin
      </button>
      <button
        onClick={deleteSelectedCabins}
        disabled={selectedCabins.length === 0}
      >
        Delete Selected
      </button>

      <div>
        <table style={{ width: "100%", textAlign: "center" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid" }}>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                />
              </th>
              <th style={{ border: "1px solid" }}>Action</th>
              <th style={{ border: "1px solid" }}>ID</th>
              <th style={{ border: "1px solid" }}>Name</th>
              <th style={{ border: "1px solid" }}>Image</th>
              <th style={{ border: "1px solid" }}>Description</th>
              <th style={{ border: "1px solid" }}>Rate</th>
              <th style={{ border: "1px solid" }}>Minimum Capacity</th>
              <th style={{ border: "1px solid" }}>Maximum Capacity</th>
              <th style={{ border: "1px solid" }}>Additional Fee Type</th>
              <th style={{ border: "1px solid" }}>
                Additional Fee Description
              </th>
              <th style={{ border: "1px solid" }}>Additional Fee Amount</th>
              <th style={{ border: "1px solid" }}>Date Created</th>
              <th style={{ border: "1px solid" }}>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {cabins.map((cabin: Cabin) => (
              <tr key={cabin.id}>
                <td style={{ border: "1px solid", verticalAlign: "middle" }}>
                  <input
                    type="checkbox"
                    checked={selectedCabins.includes(cabin.id)}
                    onChange={() => toggleSelection(cabin.id)}
                  />
                </td>
                <td style={{ border: "1px solid", verticalAlign: "middle" }}>
                  <button
                    onClick={() =>
                      router.push(`/admin/cabins/update/${cabin.id}`)
                    }
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDeleteCabin(cabin.id)}>
                    Delete
                  </button>
                </td>
                <td style={{ border: "1px solid", verticalAlign: "middle" }}>
                  {cabin.id}
                </td>
                <td style={{ border: "1px solid", verticalAlign: "middle" }}>
                  {cabin.name}
                </td>
                <td style={{ border: "1px solid", verticalAlign: "middle" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      src={cabin.imageUrl}
                      alt={cabin.name}
                      width={135}
                      height={90}
                    />
                  </div>
                </td>
                <td style={{ border: "1px solid", verticalAlign: "middle" }}>
                  {cabin.description}
                </td>
                <td style={{ border: "1px solid", verticalAlign: "middle" }}>
                  ₱{formatPrice(cabin.price)}
                </td>
                <td style={{ border: "1px solid", verticalAlign: "middle" }}>
                  {cabin.minCapacity}
                </td>
                <td style={{ border: "1px solid", verticalAlign: "middle" }}>
                  {cabin.maxCapacity}
                </td>
                <td style={{ border: "1px solid", verticalAlign: "middle" }}>
                  {cabin.additionalFee?.type || "N/A"}
                </td>
                <td style={{ border: "1px solid", verticalAlign: "middle" }}>
                  {cabin.additionalFee?.description || "N/A"}
                </td>
                <td style={{ border: "1px solid", verticalAlign: "middle" }}>
                  {cabin.additionalFee?.amount
                    ? `₱${formatPrice(cabin.additionalFee.amount)}`
                    : "N/A"}
                </td>
                <td style={{ border: "1px solid", verticalAlign: "middle" }}>
                  {formatDate(cabin.createdAt)}
                </td>
                <td style={{ border: "1px solid", verticalAlign: "middle" }}>
                  {formatDate(cabin.updatedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CabinDashboard;
