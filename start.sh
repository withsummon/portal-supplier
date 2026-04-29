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

echo "Starting server..."
exec node server.js
