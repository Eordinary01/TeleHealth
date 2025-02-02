"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Stethoscope } from "lucide-react";
import styles from "./DoctorList.module.css";

const DoctorCard = ({ doctor }) => {
  const router = useRouter();

  const handleBookAppointment = () => {
    router.push(`/appointments/create?doctorId=${doctor._id}`);
  };

  return (
    <div className={styles.doctorCard}>
      <div className={styles.doctorHeader}>
        <User className={styles.icon} />
        <h3 className={styles.doctorName}>{doctor.user.name}</h3>
      </div>
      <div className={styles.doctorSpecialties}>
        <Stethoscope className={styles.icon} />
        <div>
          <span className={styles.specialty}>{doctor.specialty}</span>
        </div>
      </div>
      <div className={styles.doctorDetails}>
        {/* <p><strong>Email:</strong> {doctor.email}</p> */}
        <p><strong>Consultation Fee:</strong> ${doctor.consultationFee || 'N/A'}</p>
      </div>
      <button 
        className={styles.bookButton} 
        onClick={handleBookAppointment}
      >
        Book Appointment
      </button>
    </div>
  );
};

export default function DoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/doctor', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch doctors");
        }
        
        const data = await response.json();
        setDoctors(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (isLoading) {
    return <div className={styles.loading}>Loading doctors...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Our Doctors</h1>
      {doctors.length > 0 ? (
        <div className={styles.doctorsGrid}>
          {doctors.map((doctor) => (
            <DoctorCard key={doctor._id} doctor={doctor} />
          ))}
        </div>
      ) : (
        <p className={styles.noDoctors}>No doctors found.</p>
      )}
    </div>
  );
}