import React from "react";
import classes from "./Front.module.css";

function Main() {
  return (
    <section>
      <main className={classes.front}>
        <div>Skip the waiting room</div>
        <div className={classes.illustration}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600">
            
            <defs>
              <linearGradient
                id="techGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#818CF8" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient
                id="glowGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#22C55E" stopOpacity="0" />
                <stop offset="50%" stopColor="#22C55E" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Background */}
            <rect x="0" y="0" width="1200" height="600" fill="#f8fafc" />

            {/* Tech Circle Background */}
            <circle cx="600" cy="300" r="250" fill="url(#techGradient)" />

            {/* Animated Tech Rings */}
            <g transform="translate(600, 300)">
              <circle
                cx="0"
                cy="0"
                r="200"
                stroke="#4F46E5"
                fill="none"
                strokeWidth="2"
                opacity="0.2"
              />
              <circle
                cx="0"
                cy="0"
                r="180"
                stroke="#4F46E5"
                fill="none"
                strokeWidth="2"
                opacity="0.3"
              />
              <circle
                cx="0"
                cy="0"
                r="160"
                stroke="#4F46E5"
                fill="none"
                strokeWidth="2"
                opacity="0.4"
              />
            </g>

            {/* Anime-Style Doctor Character */}
            <g transform="translate(500, 300)">
              {/* Hair */}
              <path
                d="M-40,-120 C-60,-110 -40,-80 -30,-90 C-20,-100 -10,-110 0,-115 C10,-110 20,-100 30,-90 C40,-80 60,-110 40,-120 Z"
                fill="#2D3748"
              />

              {/* Face */}
              <circle cx="0" cy="-95" r="25" fill="#FED7D7" />

              {/* Eyes */}
              <ellipse cx="-10" cy="-95" rx="5" ry="8" fill="#2D3748" />
              <ellipse cx="10" cy="-95" rx="5" ry="8" fill="#2D3748" />
              <circle cx="-12" cy="-98" r="2" fill="white" />
              <circle cx="8" cy="-98" r="2" fill="white" />

              {/* Lab Coat */}
              <path d="M-40,-70 L40,-70 L50,50 L-50,50 Z" fill="white" />
              <path d="M-30,-70 L-20,50" stroke="#E2E8F0" fill="none" />
              <path d="M30,-70 L20,50" stroke="#E2E8F0" fill="none" />

              {/* Stethoscope */}
              <path
                d="M-15,-40 C-45,-20 -60,30 -30,60"
                stroke="#818CF8"
                fill="none"
                strokeWidth="4"
              />
              <circle cx="-30" cy="60" r="8" fill="#818CF8" />
            </g>

            {/* Floating Medical Icons */}
            <g transform="translate(800, 200)">
              {/* Heartbeat Monitor */}
              <rect
                x="-100"
                y="-30"
                width="200"
                height="60"
                rx="10"
                fill="#2D3748"
              />
              <path
                d="M-80,0 L-60,0 L-40,-20 L-20,20 L0,0 L80,0"
                stroke="#EF4444"
                fill="none"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </g>

            {/* Floating DNA Helix */}
            <g transform="translate(300, 300)">
              <path
                d="M-30,-50 C0,-30 30,-50 30,-30 C30,-10 -30,10 -30,30 C-30,50 30,30 30,50"
                stroke="#22C55E"
                fill="none"
                strokeWidth="3"
                opacity="0.6"
              />
              <path
                d="M-30,-30 C0,-50 30,-30 30,-50 C30,-70 -30,-90 -30,-70 C-30,-50 30,-70 30,-50"
                stroke="#22C55E"
                fill="none"
                strokeWidth="3"
                opacity="0.6"
              />
            </g>

            {/* Tech Particles */}
            <g>
              <circle cx="200" cy="150" r="5" fill="#4F46E5" opacity="0.5" />
              <circle cx="1000" cy="450" r="4" fill="#EF4444" opacity="0.5" />
              <circle cx="300" cy="500" r="6" fill="#22C55E" opacity="0.5" />
              <circle cx="900" cy="100" r="5" fill="#818CF8" opacity="0.5" />
            </g>

            {/* Glowing Line */}
            <rect
              x="0"
              y="280"
              width="1200"
              height="40"
              fill="url(#glowGradient)"
            />
          </svg>
        </div>
      </main>

      <main className={classes.second}>
        <div>
          Enhance your health journey with Artificial Intelligence and expert
          doctors all at one stop!
        </div>
      </main>

      <div className={classes.container}>
        <h1>Select What You're Looking For</h1>

        <div className={classes.cards}>
          <div className={classes.card}>
            <img
              src="https://framerusercontent.com/images/e22wfWCW4IUBT1ZeT1jgW5b53og.png"
              alt="Track Your Current Health"
            />
            <h2>Track Your Current Health</h2>
            <p>Update your health and keep a record of it!</p>
          </div>

          <div className={classes.card}>
            <img
              src="https://framerusercontent.com/images/8pkUB7n7vxG2rRkuLt3kJD83tA.png"
              alt="Track Your Current Health"
            />
            <h2>AI consultation</h2>
            <p>
              Get AI powered symptom check and know what is going on and get
              instant relief measures!
            </p>
          </div>

          <div className={classes.card}>
            <img
              src="https://framerusercontent.com/images/gnUslhYXSXZ5rDubmnNXdzXgqU.png"
              alt="Track Your Current Health"
            />
            <h2>Professional consultation</h2>
            <p>
              One to one consultation with expert doctors from all over the
              world!
            </p>
          </div>

          <div className={classes.card}>
            <img
              src="https://framerusercontent.com/images/UNdwTcqZX4x3s52k4C5W8NYCOD8.jpg"
              alt="AI Consultation"
            />
            <h2>Search nearby hospitals</h2>
            <p>
              One stop guide to know where to go. Search nearby specialty
              hospitals!
            </p>
          </div>
          <div className={classes.card}>
            <img
              src="https://framerusercontent.com/images/Y0QGsUGYJJrCo0UxRLTHNTB92YE.png"
              alt="AI Consultation"
            />
            <h2>Call an ambulance</h2>
            <p>
              In case of emergency directly book an ambulance without waiting in
              queue!
            </p>
          </div>

          <div className={classes.card}>
            <img
              src="https://framerusercontent.com/images/6HodD2uOBXAHR6lCWDYyvh3MMRw.png"
              alt="Professional Consultation"
            />
            <h2>Learn to stay fit</h2>
            <p>Dive into articles on fittness to know yourself better!</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Main;
