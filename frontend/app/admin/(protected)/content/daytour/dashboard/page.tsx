'use client';
import React, { useEffect, useState } from 'react';
import styles from './dashboard.module.scss';

interface DayTour {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  rate: number;
}

const DayTourView = () => {
  const [dayTours, setDayTours] = useState<DayTour[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
            rate: tour.service?.price || 0,
          }));

          console.log('Mapped day tours:', mappedDayTours);

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

  const handleEdit = (id: number) => {
    console.log('Edit day tour with id:', id);
  };

  const handleDelete = async (id: number) => {
    try {
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
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
    }
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
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Image</th>
            <th>Rate</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {dayTours.map((dayTour) => (
            <tr key={dayTour.id}>
              <td>{dayTour.name}</td>
              <td>{dayTour.description}</td>
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
              <td>PHP {dayTour.rate}</td>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DayTourView;
