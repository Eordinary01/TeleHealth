import React from "react";
import classes from "./Front.module.css";

function Main() {

  return (
    <section>
      <main className={classes.front}>
        <div>Skip the waiting room</div>
        <div></div>
      </main>

      <main className={classes.second}>
        <div>
          Enhance your health journey with Artificial Intelligence and expert
          doctors all at one stop!
        </div>
        <button>Sign In</button>
      </main>

      <div class={classes.container}>
        <h1>Select What You're Looking For</h1>

        <div class={classes.cards}>
          <div class={classes.card}>
            <img src="https://framerusercontent.com/images/e22wfWCW4IUBT1ZeT1jgW5b53og.png" alt="Track Your Current Health" />
            <h2>Track Your Current Health</h2>
            <p>Update your health and keep a record of it!</p>
          </div>

          <div class={classes.card}>
            <img src="https://framerusercontent.com/images/8pkUB7n7vxG2rRkuLt3kJD83tA.png" alt="Track Your Current Health" />
            <h2>AI consultation</h2>
            <p>Get AI powered symptom check and know what is going on and get instant relief measures!</p>
          </div>

          <div class={classes.card}>
            <img src="https://framerusercontent.com/images/gnUslhYXSXZ5rDubmnNXdzXgqU.png" alt="Track Your Current Health" />
            <h2>Professional consultation</h2>
            <p>One to one consultation with expert doctors from all over the world!</p>
          </div>

          <div class={classes.card}>
            <img src="https://framerusercontent.com/images/UNdwTcqZX4x3s52k4C5W8NYCOD8.jpg" alt="AI Consultation" />
            <h2>Search nearby hospitals</h2>
            <p>
            One stop guide to know where to go. Search nearby specialty hospitals! 
            </p>
          </div>
          <div class={classes.card}>
            <img src="https://framerusercontent.com/images/Y0QGsUGYJJrCo0UxRLTHNTB92YE.png" alt="AI Consultation" />
            <h2>Call an ambulance</h2>
            <p>
            In case of emergency directly book an ambulance without waiting in queue! 
            </p>
          </div>

          <div class={classes.card}>
            <img src="https://framerusercontent.com/images/6HodD2uOBXAHR6lCWDYyvh3MMRw.png" alt="Professional Consultation" />
            <h2>Learn to stay fit</h2>
            <p>
            Dive into articles on fittness to know yourself better!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Main;
