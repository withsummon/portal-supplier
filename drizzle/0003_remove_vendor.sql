DELETE FROM "notifications"
WHERE "type" IN ('QUOTE_RECEIVED', 'VENDOR_REGISTRATION');--> statement-breakpoint
DELETE FROM "comments"
WHERE "author_id" IN (SELECT "id" FROM "users" WHERE "role" = 'VENDOR');--> statement-breakpoint
DELETE FROM "messages"
WHERE "sender_id" IN (SELECT "id" FROM "users" WHERE "role" = 'VENDOR');--> statement-breakpoint
DELETE FROM "users"
WHERE "role" = 'VENDOR';--> statement-breakpoint
DROP TABLE IF EXISTS "quotes" CASCADE;--> statement-breakpoint
DROP TABLE IF EXISTS "vendors" CASCADE;--> statement-breakpoint
ALTER TYPE "public"."user_role" RENAME TO "user_role_old";--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('ADMIN', 'SELLER');--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" TYPE "public"."user_role" USING "role"::text::"public"."user_role";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'SELLER';--> statement-breakpoint
DROP TYPE "public"."user_role_old";--> statement-breakpoint
ALTER TYPE "public"."notification_type" RENAME TO "notification_type_old";--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM(
  'PROJECT_SUBMITTED',
  'PROJECT_ACCEPTED',
  'PROJECT_REJECTED',
  'PROJECT_CLARIFICATION',
  'PROJECT_STARTED',
  'PROJECT_COMPLETED',
  'PROJECT_PAID',
  'MESSAGE_RECEIVED',
  'SELLER_REGISTRATION',
  'SYSTEM'
);--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "type" TYPE "public"."notification_type" USING "type"::text::"public"."notification_type";--> statement-breakpoint
DROP TYPE "public"."notification_type_old";--> statement-breakpoint
DROP TYPE IF EXISTS "public"."quote_status";--> statement-breakpoint
DROP TYPE IF EXISTS "public"."vendor_status";--> statement-breakpoint
DROP TYPE IF EXISTS "public"."vendor_tier";
