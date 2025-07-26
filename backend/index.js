'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { neon } = require('@neondatabase/serverless');

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Neon connection
const sql = neon(process.env.DATABASE_URL);

// --- API Endpoints ---

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'API is running' });
});

// Get all opinions for an event
app.get('/api/opinions/:eventId', async (req, res) => {
  const { eventId } = req.params;
  try {
    const result = await sql.query('SELECT * FROM opinions WHERE event_id = $1 ORDER BY created_at DESC', [eventId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch opinions', details: err.message });
  }
});

// Add a new opinion
app.post('/api/opinions', async (req, res) => {
  const { event_id, comment } = req.body;
  if (!event_id || !comment) {
    return res.status(400).json({ error: 'event_id and comment are required' });
  }
  try {
    const result = await sql.query('INSERT INTO opinions (event_id, comment) VALUES ($1, $2) RETURNING *', [event_id, comment]);
    if (result.rows && result.rows.length > 0) {
      res.status(201).json(result.rows[0]);
    } else {
      res.status(201).json({ event_id, comment, id: Date.now() });
    }
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to add opinion', details: err.message });
  }
});

// (Optional) Get all events (if you want to store events in DB)
// app.get('/api/events', async (req, res) => {
//   try {
//     const result = await sql('SELECT * FROM events ORDER BY date DESC');
//     res.json(result);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch events', details: err.message });
//   }
// });

app.listen(port, () => {
  console.log(`Backend API running on http://localhost:${port}`);
}); 