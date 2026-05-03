const express = require('express');
const cors = require('cors');
const sortRoutes = require('./routes/sort');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "https://hvrp-sort-app.vercel.app",
  "http://localhost:3000",
  "http://localhost:4173"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS blocked: " + origin));
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.options("*", cors()); // ✅ IMPORTANT

app.use(express.json({ limit: '10mb' }));

app.use('/api/sort', sortRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});