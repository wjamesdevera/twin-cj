'use client';
import React, { useEffect, useState } from 'react';

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Day Tours</h1>
      {dayTours.length === 0 ? <p>No tours available.</p> : null}
      <ul>
        {dayTours.map((dayTour, index) => (
          <li key={index}>
            <h2>Name: {dayTour.name || 'No Name'}</h2>
            <p>Description: {dayTour.description || 'No Description'}</p>
            {dayTour.imageUrl ? (
              <img
                src={
                  dayTour.imageUrl.startsWith('http')
                    ? dayTour.imageUrl
                    : `http://localhost:8080/uploads/${dayTour.imageUrl}`
                }
                alt={dayTour.name}
              />
            ) : (
              <p>No image available</p>
            )}
            <p>Rate: PHP {dayTour.rate || 'N/A'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DayTourView;
