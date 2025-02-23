'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from '../edit.module.scss';
import { Loading } from '@/app/components/loading';

interface DayTour {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: string;
  quantity: string;
}

const EditDayTour: React.FC = () => {
  const [formData, setFormData] = useState<DayTour>({
    id: 0,
    name: '',
    description: '',
    imageUrl: '',
    price: '',
    quantity: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMutating, setIsMutating] = useState<boolean>(false);
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
            imageUrl: service?.imageUrl
              ? `http://localhost:8080/uploads/${service.imageUrl}`
              : '',
            price: service.price || 0,
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

    switch (name) {
      case 'name':
        setShowNameHelperText(value.length >= 50);
        break;
      case 'description':
        setShowDescriptionHelperText(value.length >= 100);
        break;
      case 'price':
        setShowRateHelperText(
          !/^\d+(\.\d{1,2})?$/.test(value) || parseFloat(value) <= 0
        );
        break;
      case 'quantity':
        setShowQuantityHelperText(!/^\d+$/.test(value) || parseInt(value) <= 0);
        break;
    }
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

    setIsMutating(true);

    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.quantity
    ) {
      alert('All fields are required.');
      setIsMutating(false);
      return;
    }

    if (
      !/^[0-9]+(\.[0-9]+)?$/.test(formData.price) ||
      parseFloat(formData.price) <= 0
    ) {
      alert('Rate must be a valid positive number.');
      setIsMutating(false);
      return;
    }

    if (
      !/^[0-9]+$/.test(formData.quantity) ||
      parseInt(formData.quantity) <= 0
    ) {
      alert('Quantity must be a positive integer.');
      setIsMutating(false);
      return;
    }

    if (imageFile && imageFile.size > 1024 * 1024) {
      alert('Image size must not exceed 1MB.');
      setIsMutating(false);
      return;
    }

    if (!hasChanges()) {
      alert('Please make changes before saving.');
      setIsMutating(false);
      return;
    }

    if (!window.confirm('Are you sure you want to save changes?')) {
      setIsMutating(false);
      return;
    }

    const data = new FormData();
    const jsonData = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
    };
    data.append('data', JSON.stringify(jsonData));
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/services/day-tour/${id}`,
        {
          method: 'PATCH',
          body: data,
        }
      );

      if (!response.ok) throw new Error('Failed to update day tour');

      alert('Day tour updated successfully!');
      router.push('/admin/content/daytour/dashboard');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
    } finally {
      setIsMutating(false);
    }

    if (loading) return <Loading />;
    if (error) return <div>Error: {error}</div>;
    if (!formData) return <div>No data found</div>;
  };

  return (
    <div className={styles.container}>
      {isMutating ? (
        <Loading />
      ) : (
        <div>
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
              <label htmlFor="price">Rate</label>
              <input
                type="text"
                id="price"
                name="price"
                value={formData.price || ''}
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
      )}
    </div>
  );
};

export default EditDayTour;
