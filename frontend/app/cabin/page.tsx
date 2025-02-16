"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

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

const CabinsPage = () => {
  const [cabins, setCabins] = useState<Cabin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <p className="text-center text-gray-500">Loading cabins...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div>
      <button>Add Cabin</button>
      <div>
        <table>
          <thead>
            <tr>
              <th>Action</th>
              <th>ID</th>
              <th>Name</th>
              <th>Image</th>
              <th>Description</th>
              <th>Rate</th>
              <th>Capacity</th>
              <th>Quantity</th>
              <th>Date Created</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {cabins.map((cabin) => (
              <tr key={cabin.id} className="border-b">
                <td>
                  <button>Edit</button>
                  <button>Delete</button>
                </td>
                <td>{cabin.id}</td>
                <td>{cabin.service.name}</td>
                <td>
                  <Image
                    src={cabin.service.imageUrl}
                    alt={cabin.service.name}
                    width={135}
                    height={90}
                  />
                </td>
                <td>{cabin.service.description}</td>
                <td>₱{cabin.service.price}</td>
                <td>{cabin.minCapacity} - {cabin.maxCapacity} people</td>
                <td>{cabin.service.quantity}</td>
                <td>{cabin.createdAt}</td>
                <td>{cabin.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CabinsPage;
