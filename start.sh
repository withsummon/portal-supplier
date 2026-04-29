#!/bin/sh
# Startup script: run migrations then start server

echo "Checking database schema..."
# Use push (without --force) so drizzle-kit only adds new tables/columns,
# never drops existing ones. The `yes` pipes confirmation for non-interactive runs.
yes | bunx drizzle-kit push 2>&1

echo "Starting server..."
exec node server.js
