'use client';
import React, { useEffect, useState } from 'react';
import styles from './dashboard.module.scss';
import { useRouter } from 'next/navigation';

interface DayTour {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  rate: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

const DayTourView = () => {
  const [dayTours, setDayTours] = useState<DayTour[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDayTours = async () => {
      try {
        const response = await fetch(
          'http://localhost:8080/api/services/day-tours',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
            },
          }
        );

        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();

        if (Array.isArray(data?.data?.dayTours)) {
          const mappedDayTours = data.data.dayTours.map((tour: any) => ({
            id: tour.id,
            name: tour.service?.name || 'Unnamed Tour',
            description:
              tour.service?.description || 'No description available',
            imageUrl: tour.service?.imageUrl || '',
            rate: parseFloat(tour.service?.price || 0).toFixed(2),
            quantity: tour.service?.quantity || 0,
            createdAt: new Date(tour.createdAt).toLocaleDateString(),
            updatedAt: new Date(tour.updatedAt).toLocaleDateString(),
          }));

          setDayTours((prevTours) => {
            const isSameData =
              JSON.stringify(prevTours) === JSON.stringify(mappedDayTours);
            return isSameData ? prevTours : mappedDayTours;
          });
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDayTours();
  }, []);

  const handleAdd = () => {
    router.push('/admin/content/daytour/create');
  };

  const handleEdit = (id: number) => {
    router.push(`/admin/content/daytour/edit/${id}`);
  };

  const handleDelete = async (id?: number) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete the selected day tour/s?'
    );
    if (!confirmed) {
      return;
    }

    try {
      if (id) {
        // Single delete
        const response = await fetch(
          `http://localhost:8080/api/services/day-tour/${id}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Failed to delete day tour with id: ${id}`);
        }
        setDayTours((prevTours) => prevTours.filter((tour) => tour.id !== id));
      } else {
        // Multiple delete
        await Promise.all(
          selectedIds.map(async (id) => {
            const response = await fetch(
              `http://localhost:8080/api/services/day-tour/${id}`,
              {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );
            if (!response.ok) {
              throw new Error(`Failed to delete day tour with id: ${id}`);
            }
          })
        );

        setDayTours((prevTours) =>
          prevTours.filter((tour) => !selectedIds.includes(tour.id))
        );
        setSelectedIds([]);
        alert('Selected day tours deleted successfully!');
      }
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
    }
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedIds((prevSelectedIds) =>
      prevSelectedIds.includes(id)
        ? prevSelectedIds.filter((selectedId) => selectedId !== id)
        : [...prevSelectedIds, id]
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Day Tours</h1>
      <button className="add" onClick={handleAdd}>
        Add Day Tour
      </button>
      <button
        className="delete"
        onClick={() => handleDelete()}
        disabled={!selectedIds.length}
      >
        Delete Selected
      </button>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Select</th>
            <th>Actions</th>
            <th>ID</th>
            <th>Name</th>
            <th>Image</th>
            <th>Description</th>
            <th>Rate</th>
            <th>Quantity</th>
            <th>Date Created</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {dayTours.map((dayTour) => (
            <tr key={dayTour.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(dayTour.id)}
                  onChange={() => handleCheckboxChange(dayTour.id)}
                />
              </td>
              <td className={styles.actions}>
                <button className="edit" onClick={() => handleEdit(dayTour.id)}>
                  Edit
                </button>
                <button
                  className="delete"
                  onClick={() => handleDelete(dayTour.id)}
                >
                  Delete
                </button>
              </td>
              <td>{dayTour.id}</td>
              <td>{dayTour.name}</td>
              <td>
                {dayTour.imageUrl ? (
                  <img
                    src={`http://localhost:8080/uploads/${dayTour.imageUrl}`}
                    alt={dayTour.name}
                    width="100"
                    height="100"
                  />
                ) : (
                  'No image available'
                )}
              </td>
              <td>{dayTour.description}</td>
              <td>₱{dayTour.rate}</td>
              <td>{dayTour.quantity}</td>
              <td>{dayTour.createdAt}</td>
              <td>{dayTour.updatedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DayTourView;
