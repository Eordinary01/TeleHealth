'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Calendar, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import styles from '../Appointments.module.css'

export default function CreateAppointment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token } = useAuth();
  
  const [doctor, setDoctor] = useState(null);
  const [dateTime, setDateTime] = useState('');
  const [type, setType] = useState('');
  const [error, setError] = useState(null);

  // Pre-selected doctor ID from previous page
  const doctorId = searchParams.get('doctorId');

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!doctorId) {
        router.push('/doctorCard');
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/doctor/${doctorId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch doctor details');
        }

        const data = await response.json();
        setDoctor(data);
      } catch (err) {
        setError(err.message);
        router.push('/doctorCard');
      }
    };

    fetchDoctor();
  }, [doctorId, router, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/appointment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          patientId: user.id,
          doctorId: doctorId,
          dateTime,
          type
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create appointment');
      }

      router.push('/appointments');
    } catch (err) {
      setError(err.message);
    }
  };

  if (!doctor) {
    return <div className={styles.loading}>Loading doctor details...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Book Appointment</h1>
      
      <div className={styles.doctorInfo}>
        <div className={styles.doctorHeader}>
          <User className={styles.icon} />
          <h3 className={styles.doctorName}>{doctor?.name}</h3>
        </div>
        <p><strong>Specialty:</strong> {doctor.specialty}</p>
        <p><strong>Consultation Fee:</strong> ${doctor.consultationFee || '69'}</p>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            <Calendar className={styles.icon} /> Select Date and Time
          </label>
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            <Clock className={styles.icon} /> Appointment Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={styles.input}
            required
          >
            <option value="">Select Appointment Type</option>
            <option value="virtual">Virtual</option>
          
          </select>
        </div>

        <button type="submit" className={styles.button}>
          Confirm Appointment
        </button>
      </form>
    </div>
  );
}