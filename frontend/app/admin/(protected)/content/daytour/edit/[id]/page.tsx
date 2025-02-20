'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from '../edit.module.scss';

interface DayTour {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  rate: string;
  quantity: string;
}

const EditDayTour: React.FC = () => {
  const [formData, setFormData] = useState<DayTour>({
    id: 0,
    name: '',
    description: '',
    imageUrl: '',
    rate: '',
    quantity: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showNameHelperText, setShowNameHelperText] = useState<boolean>(false);
  const [showDescriptionHelperText, setShowDescriptionHelperText] =
    useState<boolean>(false);
  const [showRateHelperText, setShowRateHelperText] = useState<boolean>(false);
  const [showQuantityHelperText, setShowQuantityHelperText] =
    useState<boolean>(false);
  const [originalData, setOriginalData] = useState<DayTour | null>(null);

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
          const fetchedData = {
            id: data.data.dayTour.id,
            name: service.name || '',
            description: service.description || '',
            imageUrl: service.imageUrl || '',
            rate: service.price || 0,
            quantity: service.quantity || 0,
          };
          setFormData(fetchedData);
          setOriginalData(fetchedData);
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const hasChanges = () => {
    if (!originalData) return true;
    const { imageUrl, ...originalDataWithoutImage } = originalData;
    const { imageUrl: currentImage, ...currentDataWithoutImage } = formData;
    return (
      JSON.stringify(originalDataWithoutImage) !==
        JSON.stringify(currentDataWithoutImage) || !!imageFile
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.description ||
      !formData.rate ||
      !formData.quantity
    ) {
      alert('All fields are required.');
      return;
    }

    if (
      !/^[0-9]+(\.[0-9]+)?$/.test(formData.rate) ||
      parseFloat(formData.rate) <= 0
    ) {
      alert('Rate must be a valid positive number.');
      return;
    }

    if (
      !/^[0-9]+$/.test(formData.quantity) ||
      parseInt(formData.quantity) <= 0
    ) {
      alert('Quantity must be a positive integer.');
      return;
    }

    if (!hasChanges()) {
      alert(
        'No changes detected. Please modify at least one field before submitting.'
      );
      return;
    }

    const updatedFormData = new FormData();
    updatedFormData.append('name', formData.name);
    updatedFormData.append('description', formData.description);
    updatedFormData.append('rate', formData.rate);
    updatedFormData.append('quantity', formData.quantity);
    if (imageFile) updatedFormData.append('image', imageFile);

    try {
      const response = await fetch(
        `http://localhost:8080/api/services/day-tour/${id}`,
        {
          method: 'PATCH',
          body: updatedFormData,
        }
      );

      if (!response.ok) throw new Error('Failed to update day tour');

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
            maxLength={50}
            required
          />
          {showNameHelperText && (
            <small className={styles.helperText}>
              Name must not exceed 50 characters
            </small>
          )}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            maxLength={100}
            required
          />
          {showDescriptionHelperText && (
            <small className={styles.helperText}>
              Description must not exceed 100 characters
            </small>
          )}
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
            type="text"
            id="rate"
            name="rate"
            value={formData.rate || ''}
            onChange={handleChange}
            required
          />
          {showRateHelperText && (
            <small className={styles.helperText}>
              Rate must be a positive number only
            </small>
          )}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="quantity">Quantity</label>
          <input
            type="text"
            id="quantity"
            name="quantity"
            value={formData?.quantity || ''}
            onChange={handleChange}
            required
          />
          {showQuantityHelperText && (
            <small className={styles.helperText}>
              Quantity must be a positive integer
            </small>
          )}
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
