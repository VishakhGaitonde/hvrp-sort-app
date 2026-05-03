const express = require('express');
const cors = require('cors');
const sortRoutes = require('./routes/sort');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/sort', sortRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'HVRP Sorting API running' });
});

app.listen(PORT, () => {
  console.log(`🚀 HVRP Backend running on http://localhost:${PORT}`);
});