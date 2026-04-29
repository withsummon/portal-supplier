#!/bin/sh
# Startup script: run schema fixes then start server

echo "Applying database schema fixes..."

# Fix email_verified column type (timestamp -> boolean) if needed.
# This is idempotent - fails gracefully if column is already boolean.
# The USING clause handles the type cast: timestamp -> boolean.
node -e "
  const { drizzle } = require('drizzle-orm/node-postgres');
  const { Client } = require('pg');
  const client = new Client(process.env.DATABASE_URL);
  client.connect().then(async () => {
    // Check current column type
    const res = await client.query(\"SELECT data_type FROM information_schema.columns WHERE table_name='users' AND column_name='email_verified'\");
    const colType = res.rows[0]?.data_type;
    if (colType === 'timestamp with time zone' || colType === 'timestamp') {
      console.log('Fixing email_verified column type (timestamp -> boolean)...');
      await client.query('ALTER TABLE \"users\" ALTER COLUMN \"email_verified\" TYPE boolean USING (email_verified IS NOT NULL)');
      console.log('email_verified column fixed.');
    } else {
      console.log('email_verified column is already boolean. Skipping.');
    }
    await client.end();
    process.exit(0);
  }).catch(err => {
    console.error('Failed to fix email_verified:', err.message);
    client.end();
    process.exit(1);
  });
"

if [ $? -ne 0 ]; then
  echo "ERROR: Failed to fix email_verified column. Server not started."
  exit 1
fi

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
