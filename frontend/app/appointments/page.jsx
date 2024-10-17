"use client";
import React, { useEffect, useState } from "react";
import { Calendar, Clock, User, Activity } from "lucide-react";
import styles from "./Appointments.module.css";
import Header from "@/components/Header";

const AppointmentRow = ({ appointment }) => (
  <tr className={styles.appointmentRow}>
    <td className={styles.cell}>
      <User className={styles.icon} />
      {appointment.doctor?.user?.name}
    </td>
    <td className={styles.cell}>
      <Calendar className={styles.icon} />
      {new Date(appointment.dateTime).toLocaleDateString()}
    </td>
    <td className={styles.cell}>
      <Clock className={styles.icon} />
      {new Date(appointment.dateTime).toLocaleTimeString()}
    </td>
    <td className={styles.cell}>
      <Activity className={styles.icon} />
      {appointment.type}
    </td>
    <td className={`${styles.cell} ${styles[appointment.status]}`}>
      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
    </td>
  </tr>
);

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("/api/appointments", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAppointments(data);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch appointments");
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setError(error.message);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div>
      <div className={styles.container}>
        <h1 className={styles.header}>Your Appointments</h1>
        {error && <p className={styles.error}>{error}</p>}
        {appointments.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.tableHeader}>Doctor</th>
                <th className={styles.tableHeader}>Date</th>
                <th className={styles.tableHeader}>Time</th>
                <th className={styles.tableHeader}>Type</th>
                <th className={styles.tableHeader}>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <AppointmentRow
                  key={appointment._id}
                  appointment={appointment}
                />
              ))}
            </tbody>
          </table>
        ) : (
          <p className={styles.noAppointments}>No appointments found.</p>
        )}
      </div>
    </div>
  );
}
