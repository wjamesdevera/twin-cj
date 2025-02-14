'use client';
import DayTourForm from '@/app/components/DayTourForm';
import React from 'react';
import assert from 'assert';

function Page() {
  const handleCreateDayTour = async (formData: FormData) => {
    try {
      const response = await fetch(
        'http://localhost:8080/api/services/day-tour/',
        {
          method: 'POST',
          body: formData,
        }
      );

      assert(response.ok, 'Failed to create day tour');

      console.log('Day tour created successfully');
    } catch (error) {
      console.error('Error creating day tour:', error);
    }
  };

  return (
    <div>
      <h1>Create Day Tour</h1>
      <DayTourForm onSubmit={handleCreateDayTour} />
    </div>
  );
}

export default Page;
