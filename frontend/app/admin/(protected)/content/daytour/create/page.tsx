'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

function Page() {
  const router = useRouter();

  interface DayTourFormData {
    name: string;
    description: string;
    image: File | null;
    rate: string;
    quantity: string;
  }

  const [formData, setFormData] = useState<DayTourFormData>({
    name: '',
    description: '',
    image: null,
    rate: '',
    quantity: '',
  });

  const [showNameHelperText, setShowNameHelperText] = useState<boolean>(false);
  const [showDescriptionHelperText, setshowDescriptionHelperText] =
    useState<boolean>(false);
  const [showRateHelperText, setShowRateHelperText] = useState<boolean>(false);
  const [showQuantityHelperText, setShowQuantityHelperText] =
    useState<boolean>(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });

    if (name === 'name' && value.length >= 50) {
      setShowNameHelperText(true);
    } else if (name === 'name' && value.length <= 49) {
      setShowNameHelperText(false);
    }

    if (name === 'description' && value.length >= 100) {
      setshowDescriptionHelperText(true);
    } else if (name === 'description' && value.length <= 99) {
      setshowDescriptionHelperText(false);
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

  const handleSubmit = async (e: FormEvent) => {
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

    if (formData.name.length > 50) {
      alert('Name must not exceed 50 characters.');
      return;
    }

    if (formData.description.length > 100) {
      alert('Description must not exceed 100 characters.');
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

    if (!formData.image) {
      alert('Please upload an image.');
      return;
    }

    if (formData.image && formData.image.size > 1024 * 1024) {
      alert('Image size must not exceed 1MB.');
      return;
    }

    const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (formData.image && !validImageTypes.includes(formData.image.type)) {
      alert('Invalid image type. Only JPG, JPEG, and PNG are allowed.');
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    if (formData.image) {
      data.append('image', formData.image);
    }
    data.append('rate', formData.rate);
    data.append('quantity', formData.quantity);

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
    }
  };

  return (
    <div>
      <h1>Create Day Tour</h1>
      <form onSubmit={handleSubmit}>
        <div>
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
            name="rate"
            value={formData.rate}
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
        <button type="submit">Submit</button>
        <button
          type="button"
          onClick={() => router.push('/admin/content/daytour/dashboard')}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default Page;
