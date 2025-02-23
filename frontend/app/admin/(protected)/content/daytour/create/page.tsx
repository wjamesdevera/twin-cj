'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Loading } from '@/app/components/loading';

function Page() {
  const router = useRouter();

  interface DayTourFormData {
    name: string;
    description: string;
    image: File | null;
    price: string;
    quantity: string;
  }

  const [formData, setFormData] = useState<DayTourFormData>({
    name: '',
    description: '',
    image: null,
    price: '',
    quantity: '',
  });

  const [showNameHelperText, setShowNameHelperText] = useState<boolean>(false);
  const [showDescriptionHelperText, setshowDescriptionHelperText] =
    useState<boolean>(false);
  const [showRateHelperText, setShowRateHelperText] = useState<boolean>(false);
  const [showQuantityHelperText, setShowQuantityHelperText] =
    useState<boolean>(false);
  const [isMutating, setIsMutating] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  useEffect(() => {
    const isValid =
      !!formData.name &&
      !!formData.description &&
      !!formData.price &&
      !!formData.quantity &&
      !!formData.image &&
      formData.name.length <= 50 &&
      formData.description.length <= 100 &&
      /^\d+(\.\d+)?$/.test(formData.price) &&
      parseFloat(formData.price) > 0 &&
      /^\d+$/.test(formData.quantity) &&
      parseInt(formData.quantity) > 0 &&
      formData.image !== null &&
      formData.image.size <= 1024 * 1024 &&
      ['image/jpeg', 'image/png', 'image/jpg'].includes(formData.image.type);

    setIsFormValid(isValid);
  }, [formData]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });

    switch (name) {
      case 'name':
        setShowNameHelperText(value.length >= 50);
        break;
      case 'description':
        setshowDescriptionHelperText(value.length >= 100);
        break;
      case 'price':
        const priceRegex = /^\d+(\.\d+)?$/;
        setShowRateHelperText(
          !priceRegex.test(value) || parseFloat(value) <= 0
        );
        break;
      case 'quantity':
        const quantityRegex = /^\d+$/;
        setShowQuantityHelperText(
          !quantityRegex.test(value) || parseInt(value) <= 0
        );
        break;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsMutating(true);

    if (!window.confirm('Are you sure you want to add this Day tour?')) {
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

    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      const response = await fetch(
        'http://localhost:8080/api/services/day-tour/',
        {
          method: 'POST',
          body: data,
        }
      );

      if (response.ok) {
        alert('Day tour created successfully!');
        router.push('/admin/content/daytour/dashboard');
      }
    } catch (error) {
      console.error('Error creating day tour:', error);
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <div>
      {isMutating ? (
        <Loading />
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <div>
              <h1>Create Day Tour</h1>

              <label>Title:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                maxLength={50}
              />
              {showNameHelperText && (
                <small>Title must not exceed 50 characters</small>
              )}
            </div>
            <div>
              <label>Description:</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                maxLength={100}
              />
              {showDescriptionHelperText && (
                <small>Description must not exceed 100 characters</small>
              )}
            </div>
            <div>
              <label>Upload Image:</label>
              <input
                type="file"
                accept=".jpg,.png,.jpeg"
                name="image"
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Rate:</label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
              />
              {showRateHelperText && (
                <small>Rate must be a positive number only</small>
              )}
            </div>
            <div>
              <label>Quantity:</label>
              <input
                type="text"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
              />
              {showQuantityHelperText && (
                <small>Quantity must be a positive integer</small>
              )}
            </div>
            <button type="submit" disabled={!isFormValid}>
              Submit
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/content/daytour/dashboard')}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Page;
