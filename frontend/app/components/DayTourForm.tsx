import React, { useState, ChangeEvent, FormEvent } from 'react';

interface DayTourFormProps {
  onSubmit: (formData: FormData) => void;
  initialData?: DayTourFormData;
}

interface DayTourFormData {
  name: string;
  description: string;
  image: File | null;
  rate: string;
}

function DayTourForm({ onSubmit, initialData }: DayTourFormProps) {
  const [formData, setFormData] = useState<DayTourFormData>(
    initialData || {
      name: '',
      description: '',
      image: null,
      rate: '',
    }
  );

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    if (formData.image) {
      data.append('image', formData.image);
    }
    data.append('rate', formData.rate);
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div></div>
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
      <button type="submit">Submit</button>
    </form>
  );
}

export default DayTourForm;
