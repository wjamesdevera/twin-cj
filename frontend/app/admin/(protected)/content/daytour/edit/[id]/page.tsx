'use client';
import React, {
  useEffect,
  useState,
  useCallback,
  ChangeEvent,
  FormEvent,
} from 'react';
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
  const [helperText, setHelperText] = useState<{ [key: string]: boolean }>({
    name: false,
    description: false,
    price: false,
    quantity: false,
  });
  const [originalData, setOriginalData] = useState<DayTour | null>(null);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

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

  useEffect(() => {
    const priceStr = String(formData.price).trim();
    const quantityStr = String(formData.quantity).trim();

    const isValid =
      !!formData.name &&
      !!formData.description &&
      !!priceStr &&
      !!quantityStr &&
      formData.name.length <= 50 &&
      formData.description.length <= 100 &&
      /^\d+(\.\d{1,2})?$/.test(priceStr) &&
      parseFloat(priceStr) > 0 &&
      /^\d+$/.test(quantityStr) &&
      parseInt(quantityStr) > 0 &&
      (!imageFile || imageFile.size <= 1024 * 1024);

    setIsFormValid(isValid && hasChanges());
  }, [formData, imageFile]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value, files } = e.target as HTMLInputElement;
      setFormData((prevData) => ({
        ...prevData,
        [name]: files ? files[0] : value,
      }));

      setHelperText((prevHelperText) => ({
        ...prevHelperText,
        [name]:
          name === 'name'
            ? value.length >= 50
            : name === 'description'
            ? value.length >= 100
            : name === 'price'
            ? !/^\d+(\.\d{1,2})?$/.test(value) || parseFloat(value) <= 0
            : name === 'quantity'
            ? !/^\d+$/.test(value) || parseInt(value) <= 0
            : false,
      }));
    },
    []
  );

  const hasChanges = () => {
    if (!originalData) return false;

    const compareWithoutWhitespace = (a: string, b: string) =>
      a.trim() === b.trim();

    return (
      !compareWithoutWhitespace(formData.name, originalData.name) ||
      !compareWithoutWhitespace(
        formData.description,
        originalData.description
      ) ||
      parseFloat(formData.price) !== parseFloat(originalData.price) ||
      parseInt(formData.quantity) !== parseInt(originalData.quantity) ||
      !!imageFile
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsMutating(true);

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
  };

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;
  if (!formData) return <div>No data found</div>;

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
              {helperText.name && (
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
              {helperText.description && (
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
              {helperText.price && (
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
              {helperText.quantity && (
                <small className={styles.helperText}>
                  Quantity must be a positive integer
                </small>
              )}
            </div>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={!isFormValid}
            >
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
