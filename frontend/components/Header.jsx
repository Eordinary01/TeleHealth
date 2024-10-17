'use client'
import React, { useState, useEffect } from "react";
import Link from "next/link";
import classes from "./Header.module.css";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check for token in localStorage (auth persistence)
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // If token exists, set to true
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <header className={classes.header}>
      <img src="" alt="Logo" />

      <div>
        <Link href="/">Home</Link>
        <Link href="/appointments">Appointments</Link>
        <Link href="/doctorCard">Doctor Availability</Link>
        <Link href="/check-symptoms">Check Symptoms</Link>
        <Link href="/health-records">Health Records</Link>
        <Link href="/emergency">Emergency</Link>
        <Link href="/support">Support</Link>
      </div>

      <div>
        {!isLoggedIn ? (
          <Link href="/login">
            <button className={classes.button}>Log In/Sign Up</button>
          </Link>
        ) : (
          <button onClick={handleLogout} className={classes.button}>
            Logout
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
