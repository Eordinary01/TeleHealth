const path = require("path");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8080;

// Middleware Order is Important!
// 1. Basic middleware
app.use(bodyParser.json()); // Use this instead of express.json()
app.use(bodyParser.urlencoded({ extended: true }));

// 2. CORS configuration
// app.use(cors());


// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader(
//       "Access-Control-Allow-Methods",
//       "GET, POST, OPTIONS, PUT, DELETE, PATCH"
//     );
//     res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//     next();
//   });

  const corsOptions = {
    origin: ['http://localhost:3000'],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
    optionsSuccessStatus: 204
  };

  app.use(cors(corsOptions));

// 3. Static files
const imagesDir = path.join(__dirname, "images");
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}
app.use("/images", express.static(imagesDir));

// 4. Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imagesDir);
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// 5. Apply multer middleware
app.use(
  multer({
    storage: storage,
    fileFilter: fileFilter,
  }).single("image")
);

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Hello Dev...." });
});

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/aiChatBot");
const appointmentRoutes = require("./routes/appointmentRoutes");
const doctorRoutes = require("./routes/doctorRoutes");

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/appointment", appointmentRoutes);
app.use("/doctor", doctorRoutes);

// Error handling
app.use((error, req, res, next) => {
  console.error(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

// Database connection
mongoose
  .connect(process.env.MONGO_ID)
  .then(() => {
    app.listen(port);
    console.log(`App listening on port ${port}!`);
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });