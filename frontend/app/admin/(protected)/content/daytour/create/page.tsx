'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import assert from 'assert';
import { useRouter } from 'next/navigation';

function Page() {
  const router = useRouter();

  interface DayTourFormData {
    name: string;
    description: string;
    image: File | null;
    rate: string;
    capacity: string;
  }

  const [formData, setFormData] = useState<DayTourFormData>({
    name: '',
    description: '',
    image: null,
    rate: '',
    capacity: '',
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate input fields
    if (
      !formData.name ||
      !formData.description ||
      !formData.rate ||
      !formData.capacity
    ) {
      console.error('Validation Error: All fields are required.');
      return;
    }

    if (isNaN(parseFloat(formData.rate)) || parseFloat(formData.rate) <= 0) {
      console.error('Validation Error: Rate must be a positive number.');
      return;
    }

    if (
      isNaN(parseInt(formData.capacity)) ||
      parseInt(formData.capacity) <= 0
    ) {
      console.error('Validation Error: Capacity must be a positive integer.');
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    if (formData.image) {
      data.append('image', formData.image);
    }
    data.append('rate', formData.rate);
    data.append('capacity', formData.capacity);

    try {
      const response = await fetch(
        'http://localhost:8080/api/services/day-tour/',
        {
          method: 'POST',
          body: data,
        }
      );

      const responseData = await response.json();
      if (!response.ok) {
        console.error('Request failed:', responseData);
        throw new Error(responseData.message || 'Failed to create day tour');
      }

      // Redirects to admin dashboard
      router.push('/admin/content/daytour/dashboard');
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
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
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
            type="number"
            name="rate"
            value={formData.rate}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Capacity:</label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Page;
