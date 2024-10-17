import React from "react";
import classes from "./Header.module.css";
import Link from "next/link";

function Header() {
  return (
    <header className={classes.header}>
      <img src="" alt="girl" />
      <div>
        <Link href="/">Home</Link>
        <a href="">Virtual Consultation</a>
        <a href="">Doctor availability</a>
        <Link href="/chat">Check symptoms</Link>
        <a href="">Health records</a>
        <a href="">Emergency</a>
        <a href="">Support</a>
      </div>

      <img src="" alt="" />
      <button className={classes.button}>Log In/Sign Up</button>
    </header>
  );
}

export default Header;
