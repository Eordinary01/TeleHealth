'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateAppointment() {
  const [doctor, setDoctor] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('/api/appointments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ doctor, dateTime }),
      });

      if (response.ok) {
        setSuccess('Appointment created successfully!');
        router.push('/appointments');
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Error creating appointment');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <h1>Create Appointment</h1>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Doctor ID</label>
          <input
            type="text"
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Date and Time</label>
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Appointment</button>
      </form>
    </div>
  );
}
