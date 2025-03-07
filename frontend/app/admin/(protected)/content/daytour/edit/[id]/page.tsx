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
  additionalFeeType: string;
  additionalFeeDescription: string;
  additionalFeeAmount: string;
}

const EditDayTour: React.FC = () => {
  const [formData, setFormData] = useState<DayTour>({
    id: 0,
    name: '',
    description: '',
    imageUrl: '',
    price: '',
    additionalFeeType: '',
    additionalFeeDescription: '',
    additionalFeeAmount: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMutating, setIsMutating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [helperText, setHelperText] = useState<{ [key: string]: boolean }>({
    name: false,
    description: false,
    price: false,
    additionalFeeType: false,
    additionalFeeDescription: false,
    additionalFeeAmount: false,
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
          const additionalFee = service.additionalFee || {};
          const fetchedData = {
            id: data.data.dayTour.id,
            name: service.name || '',
            description: service.description || '',
            imageUrl: service?.imageUrl
              ? `http://localhost:8080/uploads/${service.imageUrl}`
              : '',
            price: service.price.toString() || '',
            additionalFeeType: additionalFee.type || '',
            additionalFeeDescription: additionalFee.description || '',
            additionalFeeAmount: additionalFee.amount?.toString() || '',
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

  const validateForm = useCallback(() => {
    const isNameValid =
      formData.name.trim().length > 0 && formData.name.trim().length <= 50;

    const isDescriptionValid =
      formData.description.trim().length > 0 &&
      formData.description.trim().length <= 100;

    const isPriceValid =
      /^\d+(\.\d+)?$/.test(formData.price.trim()) &&
      parseFloat(formData.price) > 0;

    const isImageValid =
      !imageFile ||
      (imageFile.size <= 1024 * 1024 &&
        ['image/jpeg', 'image/png', 'image/jpg'].includes(imageFile.type));

    const isAdditionalFeeTypeTouched =
      formData.additionalFeeType.trim().length > 0;
    const isAdditionalFeeDescriptionTouched =
      formData.additionalFeeDescription.trim().length > 0;
    const isAdditionalFeeAmountTouched =
      formData.additionalFeeAmount.trim().length > 0;

    const isAdditionalFeeValid =
      (!isAdditionalFeeTypeTouched &&
        !isAdditionalFeeDescriptionTouched &&
        !isAdditionalFeeAmountTouched) ||
      (isAdditionalFeeTypeTouched &&
        isAdditionalFeeDescriptionTouched &&
        isAdditionalFeeAmountTouched &&
        /^\d+(\.\d+)?$/.test(formData.additionalFeeAmount.trim()) &&
        parseFloat(formData.additionalFeeAmount) > 0);

    const isValid: boolean =
      isNameValid &&
      isDescriptionValid &&
      isPriceValid &&
      isImageValid &&
      isAdditionalFeeValid &&
      Boolean(hasChanges());

    setIsFormValid(isValid);
  }, [formData, imageFile]);

  useEffect(() => {
    validateForm();
  }, [formData, imageFile, validateForm]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value, files } = e.target as HTMLInputElement;
      const trimmedValue = value.trim();

      setFormData((prevData) => ({
        ...prevData,
        [name]: files ? files[0] : trimmedValue,
      }));

      const isFilled = (val: string) => val.trim().length > 0;

      setHelperText((prev) => ({
        ...prev,
        name: name === 'name' ? value.length >= 50 : prev.name,
        description:
          name === 'description' ? value.length >= 100 : prev.description,
        price:
          name === 'price'
            ? !/^\d+(\.\d{1,2})?$/.test(trimmedValue) ||
              isNaN(parseFloat(trimmedValue)) ||
              parseFloat(trimmedValue) <= 0
            : prev.price,

        additionalFeeType:
          name === 'additionalFeeType' &&
          (isFilled(formData.additionalFeeDescription) ||
            isFilled(formData.additionalFeeAmount)) &&
          !isFilled(trimmedValue)
            ? true
            : prev.additionalFeeType,

        additionalFeeDescription:
          name === 'additionalFeeDescription' &&
          isFilled(formData.additionalFeeType) &&
          !isFilled(trimmedValue)
            ? true
            : prev.additionalFeeDescription,

        additionalFeeAmount:
          name === 'additionalFeeAmount' &&
          isFilled(formData.additionalFeeType) &&
          (!/^\d+(\.\d{1,2})?$/.test(value) || parseFloat(value) <= 0)
            ? true
            : prev.additionalFeeAmount,
      }));
    },
    [formData]
  );

  const hasChanges = () => {
    if (!originalData) return false;

    const compareWithoutWhitespace = (a: string = '', b: string = '') =>
      a.trim() === b.trim();

    const parseNumber = (val: string) =>
      val.trim() === '' ? 0 : parseFloat(val);

    const requiredFieldsChanged =
      !compareWithoutWhitespace(formData.name, originalData.name) ||
      !compareWithoutWhitespace(
        formData.description,
        originalData.description
      ) ||
      parseNumber(formData.price) !== parseNumber(originalData.price) ||
      !!imageFile;

    const additionalFeeChanged =
      !compareWithoutWhitespace(
        formData.additionalFeeType,
        originalData.additionalFeeType
      ) ||
      !compareWithoutWhitespace(
        formData.additionalFeeDescription,
        originalData.additionalFeeDescription
      ) ||
      parseNumber(formData.additionalFeeAmount) !==
        parseNumber(originalData.additionalFeeAmount);

    return (
      requiredFieldsChanged ||
      (formData.additionalFeeType && additionalFeeChanged)
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsMutating(true);

    if (!hasChanges()) {
      setIsMutating(false);
      return;
    }

    if (!window.confirm('Are you sure you want to save changes?')) {
      setIsMutating(false);
      return;
    }

    const data = new FormData();
    const jsonData: any = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
    };

    if (
      formData.additionalFeeType &&
      formData.additionalFeeDescription &&
      formData.additionalFeeAmount
    ) {
      jsonData.additionalFee = {
        type: formData.additionalFeeType,
        description: formData.additionalFeeDescription,
        amount: Number(formData.additionalFeeAmount),
      };
    }
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

      const updatedData = await response.json();
      const updatedImageUrl = updatedData?.data?.dayTour?.imageUrl;

      if (updatedImageUrl) {
        setFormData((prevData) => ({
          ...prevData,
          imageUrl: `http://localhost:8080/${updatedImageUrl}?t=${new Date().getTime()}`,
        }));
      }

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
              <h1>Additional Fees (Optional)</h1>
              <label htmlFor="additionalFeeType">Additional Fee Type</label>
              <input
                type="text"
                id="additionalFeeType"
                name="additionalFeeType"
                value={formData.additionalFeeType || ''}
                onChange={handleChange}
              />

              {helperText.additionalFeeType && (
                <small className={styles.helperText}>
                  Additional Fee Type is required
                </small>
              )}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="additionalFeeDescription">
                Additional Fee Description
              </label>
              <input
                type="text"
                id="additionalFeeDescription"
                name="additionalFeeDescription"
                value={formData.additionalFeeDescription || ''}
                onChange={handleChange}
              />
              {helperText.additionalFeeDescription && (
                <small className={styles.helperText}>
                  Additional Fee Description is required
                </small>
              )}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="additionalFeeAmount">Additional Fee Amount</label>
              <input
                type="text"
                id="additionalFeeAmount"
                name="additionalFeeAmount"
                value={formData.additionalFeeAmount || ''}
                onChange={handleChange}
              />
              {helperText.additionalFeeAmount && (
                <small className={styles.helperText}>
                  Additional Fee Amount must be a positive number only
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
