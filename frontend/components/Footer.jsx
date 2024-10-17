import React from "react";
import classes from "./Footer.module.css";
import Image from "next/image";

export function Footer() {
  return (
    <section className={classes.footer}>
      <main className={classes.main}>
        <div className={classes.first}>
          <div className={classes.firstContent}>
            <div>Fast</div>
            <div>Fastest health service provider across the world!</div>
            <div>
              <button>Read More!</button>
            </div>
          </div>
        </div>
      </main>

      <main className={classes.main}>
        <div className={classes.first}>
          <div className={classes.firstContent}>
            <div>Certification</div>
            <div>
              Our platform is a certified TeleHealth platform. To check our
              certifications please click on view.
            </div>
            <div>
              <button>Read More!</button>
            </div>
          </div>
        </div>
      </main>

      <div className={classes.faqContainer}>
        <h1>FAQ</h1>

        <div className={classes.faqItem}>
          <h2>
            <span className={classes.plusicon}>+</span> Are the doctors
            certified?
          </h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>

        <div className={classes.faqItem}>
          <h2>
            <span className={classes.plusicon}>+</span> Is the prescription
            provided valid in hospitals?
          </h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>

        <div className={classes.faqItem}>
          <h2>
            <span className={classes.plusicon}>+</span> Is it mandatory to
            provide my personal information?
          </h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
      </div>
    </section>
  );
}

export default Footer;
