#!/bin/sh
# Startup script: run schema fixes then start server

echo "Syncing database schema..."
# Use push (without --force) to add new tables/columns.
# The `yes` pipes confirmation for non-interactive runs.
yes | bunx drizzle-kit push

if [ $? -ne 0 ]; then
  echo "ERROR: Failed to sync database schema. Server not started."
  exit 1
fi

echo "Ensuring project PAID status exists..."
node -e "
  const { Client } = require('pg');
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  client.connect()
    .then(() => client.query(\"ALTER TYPE \\\"public\\\".\\\"project_status\\\" ADD VALUE IF NOT EXISTS 'PAID' BEFORE 'CANCELLED'\"))
    .then(() => client.end())
    .catch(async (error) => {
      console.error('Failed to add PAID project status:', error.message);
      await client.end().catch(() => {});
      process.exit(1);
    });
"

if [ $? -ne 0 ]; then
  echo "ERROR: Failed to add PAID project status. Server not started."
  exit 1
fi

echo "Starting server..."
exec node server.js
