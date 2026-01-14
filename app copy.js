require("module-alias/register");
require("dotenv").config();
require('./src/models/ServiceProvider'); // Load ServiceProvider first
require('./src/models/Event'); // Then load Event
const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require('helmet');
const morgan = require('morgan');
const corsOptions = require("./src/config/corsOption");
const userRoutes = require("./src/routes/userRoutes");
const eventRoutes = require("./src/routes/eventRoutes");
const eventDetailRoutes = require("./src/routes/eventDetailRoutes");
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(helmet());



// Middleware for parsing JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// // OR use conditional middleware:
// app.use((req, res, next) => {
//   if (req.path === '/api/events/send-bulk-invitations') {
//     // Skip body parsing for file upload route
//     next();
//   } else {
//     express.json()(req, res, next);
//   }
// });

// Multer for multipart/form-data (FormData)
const upload = multer(); // Use default config; adjust if you need file uploads directly here
app.use(upload.any()); // Parses all fields; use .none() if no files are expected


// app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.get("/", (req, res) => res.send("API is running 🚀"));
app.use("/api/users", userRoutes);
app.use("/api", eventRoutes);
app.use("/api", eventDetailRoutes);
// Error handling (basic)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ "Server Error": err.message || "Internal Server Error" });
});



module.exports = app;