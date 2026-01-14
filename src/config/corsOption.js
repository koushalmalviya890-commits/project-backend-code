require('dotenv').config();

const whitelist = [
  process.env.FRONTEND_URL,
  'https://cumma.in',
  'https://www.cumma.in',
  'https://testwebsite.cumma.in',
  'http://localhost:3000',
  'http://localhost:3001',
  'https://testadmin.cumma.in'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Authorization"],
  credentials: true,  // ✅ here
  optionsSuccessStatus: 200
};

module.exports = corsOptions;
