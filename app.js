require("module-alias/register");
require("dotenv").config();
require('./src/models/ServiceProvider'); // Load ServiceProvider first


const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const morgan = require("morgan");
const corsOptions = require("./src/config/corsOption");
// const userRoutes = require("./src/routes/userRoutes");
const eventDetailRoutes = require("./src/routes/eventDetailRoutes");
const facilityBookingRoutes = require("./src/routes/facilityBookingRoutes");
const bodyParser = require("body-parser");
const multer = require("multer");


//Shivam added
const sectorRoutes = require("./src/routes/SectorRoutes");
const bookingRoutes = require("./src/routes/BookingRoutes");

const CronJobService = require('./services/cronJobService');


// Initialize cron jobs
const cronService = new CronJobService();
const app = express();

// ---------------------------
// Basic middleware
// ---------------------------
app.use(cors(corsOptions));
app.use(helmet());


// Middleware for parsing JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// JSON + URL-encoded parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Multer for handling ALL FormData requests (files + fields)
const upload = multer();
// app.use(upload.any()); // ✅ applies to all routes by default

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}


// / Optional: Add endpoint to manually trigger feedback (for testing)
app.post('/api/trigger-feedback/:eventId', async (req, res) => {
  try {
    const result = await cronService.triggerPostEventFeedback(req.params.eventId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// NEW: Endpoint to manually trigger event reminders
app.post('/api/trigger-reminders/:eventId', async (req, res) => {
  try {
    const { reminderType } = req.query; // ?reminderType=1hour or 1day or both
    const result = await cronService.triggerEventReminders(req.params.eventId, reminderType || 'both');
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 Shutting down cron jobs...');
  cronService.stopAllJobs();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('📴 Shutting down cron jobs...');
  cronService.stopAllJobs();
  process.exit(0);
});



// // OR use conditional middleware:
// app.use((req, res, next) => {
//   if (req.path === '/api/events/send-bulk-invitations') {
//     // Skip body parsing for file upload route
//     next();
//   } else {
//     app.use(upload.none());
//     express.json()(req, res, next);
//   }})
// ---------------------------
// Static files
// ---------------------------
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------------------------
// Routes
// ---------------------------
app.get("/", (req, res) => res.send("API is running 🚀"));

// app.use("/api/users", tes);
app.use("/api", eventDetailRoutes);
app.use("/api/facility-bookings", facilityBookingRoutes);
app.use("/api/sectors", sectorRoutes);
app.use("/api/bookings", bookingRoutes);

// ---------------------------
// Error handling
// ---------------------------
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(err.status || 500).json({
    "Server Error": err.message || "Internal Server Error",
  });
});

module.exports = app;
