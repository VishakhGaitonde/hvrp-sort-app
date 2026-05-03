const express = require('express');
const cors = require('cors');
const sortRoutes = require('./routes/sort');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = new Set(
  [process.env.FRONTEND_URL, process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`, 'http://localhost:3000', 'http://localhost:4173']
    .filter(Boolean)
);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.size === 0 || allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  }
}));
app.use(express.json({ limit: '10mb' }));

app.use('/api/sort', sortRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'HVRP Sorting API running' });
});

app.listen(PORT, () => {
  console.log(`🚀 HVRP Backend running on http://localhost:${PORT}`);
});