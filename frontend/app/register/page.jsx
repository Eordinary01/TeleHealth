'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Register.module.css';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
    specialty: '', // Add specialty to the state
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const { name, email, password, role, specialty } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('http://127.0.0.1:8080/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors ? data.errors[0].msg : 'Registration failed');
      }

      console.log('Registration successful:', data);
      setSuccessMessage(data.message || 'Registration successful!');

      setTimeout(() => {
        router.push('/login');
      }, 2000); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Register</h1>
      {error && <p className={styles.error}>{error}</p>}
      {successMessage && <p className={styles.success}>{successMessage}</p>}
      <form className={styles.form} onSubmit={handleRegister}>
        <input
          className={styles.input}
          type="text"
          name="name"
          placeholder="Name"
          value={name}
          onChange={handleChange}
          required
        />
        <input
          className={styles.input}
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={handleChange}
          required
        />
        <input
          className={styles.input}
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={handleChange}
          required
        />
        <select
          className={styles.input}
          name="role"
          value={role}
          onChange={handleChange}
        >
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>

        {/* Conditional rendering for doctor fields */}
        {role === 'doctor' && (
          <div>
            <input
              className={styles.input}
              type="text"
              name="specialty"
              placeholder="Specialty"
              value={specialty}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <button className={styles.button} type="submit">Register</button>
      </form>
      <p className={styles.text}>
        Already have an account? <Link href="/login" className={styles.link}>Login here</Link>
      </p>
    </div>
  );
}

export default Register;
