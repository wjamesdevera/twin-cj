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
    const { name, value, type } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'number' ? Number(value) || 0 : value,
    }));
    if (name === 'name') {
      if (value.length >= 49) {
        setShowNameHelperText(true);
      } else {
        setShowNameHelperText(false);
      }
    }

    if (name === 'description') {
      if (value.length >= 99) {
        setShowDescriptionHelperText(true);
      } else {
        setShowDescriptionHelperText(false);
      }
    }

    if (name === 'rate') {
      const rateRegex = /^\d+(\.\d+)?$/;
      if (!rateRegex.test(value) || parseFloat(value) <= 0) {
        setShowRateHelperText(true);
      } else {
        setShowRateHelperText(false);
      }
    }

    if (name === 'quantity') {
      const quantityRegex = /^\d+$/;
      if (!quantityRegex.test(value) || parseInt(value) <= 0) {
        setShowQuantityHelperText(true);
      } else {
        setShowQuantityHelperText(false);
      }
    }
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
      !/^\d+(\.\d+)?$/.test(formData.rate) ||
      isNaN(parseFloat(formData.rate)) ||
      parseFloat(formData.rate) <= 0
    ) {
      alert('Rate must be a valid positive number.');
      return;
    }

    if (
      !/^\d+$/.test(formData.quantity) ||
      isNaN(parseInt(formData.quantity)) ||
      parseInt(formData.quantity) <= 0
    ) {
      alert('Quantity must be a positive integer.');
      return;
    }

    const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (imageFile && !validImageTypes.includes(imageFile.type)) {
      alert('Invalid image type. Only JPG, JPEG, and PNG are allowed.');
      return;
    }

    if (
      originalData &&
      JSON.stringify(originalData) === JSON.stringify(formData)
    ) {
      alert(
        'No changes detected. Please modify at least one field before submitting.'
      );
      return;
    }

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
        const errorData = await response.json();
        throw new Error(`Failed to update day tour with id: ${id}`);
      }

      alert('Day tour updated successfully!');
      router.push('/admin/content/daytour/dashboard');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
      return;
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
