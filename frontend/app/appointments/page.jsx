'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, Clock, User, Activity, Plus, Check, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './Appointments.module.css'

const AppointmentRow = ({ appointment, role, onUpdateStatus }) => {
  const handleStatusUpdate = async (status) => {
    try {
      const response = await fetch(`http://localhost:8080/appointment/${appointment._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        onUpdateStatus(appointment._id, status);
      }
    } catch (error) {
      console.error('Failed to update appointment status:', error);
    }
  };

  return (
    <tr>
      {role === 'doctor' && (
        <td>
          <div className={`${styles.flexCenter}`}>
            <User className="w-4 h-4" />
            {appointment.patient?.name}
          </div>
        </td>
      )}
      {role === 'patient' && (
        <td>
          <div className={`${styles.flexCenter}`}>
            <User className="w-4 h-4" />
            {appointment.doctor?.user?.name}
          </div>
        </td>
      )}
      <td>
        <div className={`${styles.flexCenter}`}>
          <Calendar className="w-4 h-4" />
          {new Date(appointment.dateTime).toLocaleDateString()}
        </div>
      </td>
      <td>
        <div className={`${styles.flexCenter}`}>
          <Clock className="w-4 h-4" />
          {new Date(appointment.dateTime).toLocaleTimeString()}
        </div>
      </td>
      <td>
        <div className={`${styles.flexCenter}`}>
          <Activity className="w-4 h-4" />
          {appointment.type}
        </div>
      </td>
      <td className={`${styles.status} ${styles[appointment.status.toLowerCase()]}`}>
        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
        {role === 'doctor' && appointment.status === 'pending' && (
          <div className="flex gap-2 mt-2">
            <button 
              onClick={() => handleStatusUpdate('completed')} 
              className={`${styles.iconButton} ${styles.confirmButton}`}
            >
              <Check className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleStatusUpdate('rejected')} 
              className={`${styles.iconButton} ${styles.cancelButton}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};

const useAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();

  const fetchAppointments = async () => {
    if (!token) {
      setError('Authentication required');
      setLoading(false);
      return;
    }

    try {
      const endpoint =
        user.role === 'doctor'
          ? `http://localhost:8080/appointment`
          : `http://localhost:8080/appointment/${user.id}`;

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to fetch appointments');
      }

      const data = await response.json();
      setAppointments(data);
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const updateAppointmentStatus = (appointmentId, newStatus) => {
    setAppointments(prev => 
      prev.map(appointment => 
        appointment._id === appointmentId 
          ? { ...appointment, status: newStatus } 
          : appointment
      )
    );
  };

  return {
    appointments,
    error,
    loading,
    fetchAppointments,
    updateAppointmentStatus,
  };
};

export default function Appointments() {
  const { 
    appointments, 
    error, 
    loading, 
    fetchAppointments, 
    updateAppointmentStatus 
  } = useAppointments();
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    fetchAppointments();
  }, [isLoggedIn]);

  const handleBookAppointment = () => {
    router.push('/doctorCard');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Your Appointments</h1>

      {user.role === 'patient' && (
        <div className="mb-6 flex justify-end">
          <button
            onClick={handleBookAppointment}
            className={`${styles.button} flex items-center gap-2`}
          >
            <Plus className="w-4 h-4" />
            Book Appointment
          </button>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      {appointments.length > 0 ? (
        <div className="overflow-x-auto">
          <table className={styles.table}>
            <thead>
              <tr>
                {user.role === 'doctor' ? (
                  <th>Patient</th>
                ) : (
                  <th>Doctor</th>
                )}
                <th>Date</th>
                <th>Time</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <AppointmentRow
                  key={appointment._id}
                  appointment={appointment}
                  role={user.role}
                  onUpdateStatus={updateAppointmentStatus}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className={styles.error}>No appointments found.</p>
      )}
    </div>
  );
}