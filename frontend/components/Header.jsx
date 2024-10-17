import React from "react";
import classes from "./Header.module.css";

function Header() {
  return (
    <header className={classes.header}>
      <img src="" alt="girl" />
      <div>
        <a href="">Home</a>
        <a href="">Virtual Consultation</a>
        <a href="">Doctor availability</a>
        <a href="">Check symptoms</a>
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
