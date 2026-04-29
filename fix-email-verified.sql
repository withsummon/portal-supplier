-- Fix email_verified: convert timestamp -> boolean
-- This uses USNG clause because PostgreSQL can't auto-cast text "false" -> boolean
ALTER TABLE "users" ALTER COLUMN "email_verified" TYPE boolean USING (email_verified IS NOT NULL);
