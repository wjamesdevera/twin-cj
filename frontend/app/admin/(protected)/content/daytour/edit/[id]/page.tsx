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
  quantity: number;
}

const EditDayTour: React.FC = () => {
  const [formData, setFormData] = useState<DayTour>({
    id: 0,
    name: '',
    description: '',
    imageUrl: '',
    rate: 0,
    quantity: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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

        if (data?.data?.dayTour?.service) {
          const service = data.data.dayTour.service;
          setFormData({
            id: data.data.dayTour.id,
            name: service.name || '',
            description: service.description || '',
            imageUrl: service.imageUrl || '',
            rate: service.price || 0,
            quantity: service.quantity || 0,
          });
        } else {
          setError('Invalid data structure received');
        }
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'number' ? Number(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    const updatedFormData = new FormData();
    updatedFormData.append('name', formData.name);
    updatedFormData.append('description', formData.description);
    if (imageFile) {
      updatedFormData.append('image', imageFile);
      updatedFormData.append('replaceImage', 'true');
    }
    updatedFormData.append('rate', formData.rate.toString());
    updatedFormData.append('quantity', formData.quantity.toString());

    try {
      const response = await fetch(
        `http://localhost:8080/api/services/day-tour/${id}`,
        {
          method: 'PATCH',
          body: updatedFormData,
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update day tour with id: ${id}`);
      }

      alert('Day tour updated successfully!');
      router.push('/admin/content/daytour/dashboard');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!formData) return <div>No data found</div>;

  return (
    <div className={styles.container}>
      <h1>Edit Day Tour</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
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
            name="rate"
            value={formData.rate || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData?.quantity || ''}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          Save Changes
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/content/daytour/dashboard')}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditDayTour;
