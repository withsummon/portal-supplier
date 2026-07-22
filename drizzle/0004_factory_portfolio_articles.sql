ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "kind" text DEFAULT 'PRODUCT' NOT NULL;--> statement-breakpoint
UPDATE "products" SET "kind" = 'PRODUCT' WHERE "kind" IS NULL;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "articles" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "title" text NOT NULL,
  "slug" text NOT NULL,
  "excerpt" text,
  "content" text NOT NULL,
  "cover_image" text,
  "status" text DEFAULT 'DRAFT' NOT NULL,
  "published_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "articles_slug_unique" UNIQUE("slug")
);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "articles_slug_idx" ON "articles" USING btree ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "articles_status_published_at_idx" ON "articles" USING btree ("status","published_at");
