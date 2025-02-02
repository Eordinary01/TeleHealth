"use client";

import React from "react";
import Link from "next/link";
import classes from "./Header.module.css";
import { useAuth } from "@/contexts/AuthContext"; 
import doctorImage from "../assets/images.jpg"
import Image from "next/image";

function Header() {
  const { isLoggedIn, logout, user } = useAuth();

  return (
    <header className={classes.header}>
      <Image src={doctorImage} alt="Logo" height={62} width={62} />

      <div>
        {isLoggedIn ? (
          <>
            <Link href="/">Home</Link>
            <Link href="/appointments">Appointments</Link>
            {user?.role !== "doctor" && (
              <Link href="/doctorCard">Doctor Availability</Link>
            )}
            <Link href="/chat">Check Symptoms</Link>
          </>
        ) : (
          // Placeholder message or empty div for unauthenticated users
          <span>Please log in to access the application</span>
        )}
      </div>

      <div>
        {!isLoggedIn ? (
          <Link href="/login">
            <button className={classes.button}>Log In/Sign Up</button>
          </Link>
        ) : (
          <button onClick={logout} className={classes.button}>
            Logout
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
