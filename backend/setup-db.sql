-- Create the opinions table for storing user opinions about events
CREATE TABLE IF NOT EXISTS opinions (
  id SERIAL PRIMARY KEY,
  event_id TEXT NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index for faster queries by event_id
CREATE INDEX IF NOT EXISTS idx_opinions_event_id ON opinions(event_id);

-- Create an index for sorting by creation time
CREATE INDEX IF NOT EXISTS idx_opinions_created_at ON opinions(created_at DESC); 