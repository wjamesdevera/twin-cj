'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from '../edit.module.scss';

interface DayTour {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  rate: number;
}

const EditDayTour: React.FC = () => {
  const [dayTour, setDayTour] = useState<DayTour | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [rate, setRate] = useState<number | undefined>(undefined);
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    if (!id) {
      setError('No ID provided');
      setLoading(false);
      return;
    }

    const fetchDayTour = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/services/day-tour/${id}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch day tour with id: ${id}`);
        }
        const data = await response.json();
        setDayTour(data.data.dayTour);
        setName(data.data.dayTour.name);
        setDescription(data.data.dayTour.description);
        setRate(data.data.dayTour.rate);
        setImageUrl(data.data.dayTour.imageUrl); // Set imageUrl
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDayTour();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name ?? '');
    formData.append('description', description ?? '');
    if (imageFile) {
      formData.append('image', imageFile);
      formData.append('replaceImage', 'true');
    }
    formData.append('rate', rate?.toString() ?? '0');

    try {
      const response = await fetch(
        `http://localhost:8080/api/services/day-tour/${id}`,
        {
          method: 'PATCH',
          body: formData,
        }
      );

      const contentType = response.headers.get('content-type');
      let responseBody;
      if (contentType && contentType.includes('application/json')) {
        responseBody = await response.json();
      } else {
        responseBody = await response.text();
      }

      if (!response.ok) {
        throw new Error(`Failed to update day tour with id: ${id}`);
      }
      router.push('/admin/content/daytour/dashboard');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <h1>Edit Day Tour</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name ?? ''}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            value={description ?? ''}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="imageUrl">Image</label>
          <input
            type="file"
            accept=".jpg,.png,.jpeg"
            id="imageUrl"
            onChange={(e) =>
              setImageFile(e.target.files ? e.target.files[0] : null)
            }
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="rate">Rate</label>
          <input
            type="number"
            id="rate"
            value={rate ?? ''}
            onChange={(e) => setRate(Number(e.target.value))}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditDayTour;
