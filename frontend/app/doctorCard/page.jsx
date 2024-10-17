"use client";

import React, { useEffect, useState } from "react";
import { User, Stethoscope } from "lucide-react";
import styles from "./DoctorList.module.css";
import Header from "@/components/Header";

const DoctorCard = ({ doctor }) => (
  <div className={styles.doctorCard}>
    <div className={styles.doctorHeader}>
      <User className={styles.icon} />
      <h3 className={styles.doctorName}>{doctor.user.name}</h3>
    </div>
    <div className={styles.doctorSpecialties}>
      <Stethoscope className={styles.icon} />
      <div>
        {doctor.specialty.map((spec, index) => (
          <span key={index} className={styles.specialty}>
            {spec}
          </span>
        ))}
      </div>
    </div>
    {/* <div className={styles.doctorId}>
      <strong>ID:</strong> {doctor._id}
    </div> */}
    <button className={styles.bookButton}>Book Now</button>{" "}
    {/* New Book Button */}
  </div>
);

export default function DoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("/api/doctors");
        if (!response.ok) {
          throw new Error("Failed to fetch doctors");
        }
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setError(error.message);
      }
    };

    fetchDoctors();
  }, []);

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div>
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
    </div>
  );
}
