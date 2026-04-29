#!/bin/sh
# Startup script: sync schema then start server

echo "Syncing database schema with drizzle-kit push..."
# Use push to ensure the DB schema matches the latest schema.
# --force makes it non-interactive. This is safe for push-based setups.
bunx drizzle-kit push --force 2>&1

echo "Starting server..."
exec node server.js
