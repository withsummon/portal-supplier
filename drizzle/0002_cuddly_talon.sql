CREATE TYPE "public"."offer_template_type" AS ENUM('FIXED', 'RANGE', 'CUSTOM');--> statement-breakpoint
CREATE TABLE "offer_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid,
	"name" text NOT NULL,
	"description" text,
	"default_pricing_type" "offer_template_type" DEFAULT 'RANGE' NOT NULL,
	"default_min_amount" numeric(12, 2),
	"default_max_amount" numeric(12, 2),
	"default_currency" text DEFAULT 'USD',
	"default_duration" integer DEFAULT 30,
	"default_terms" text,
	"custom_fields" jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
ALTER TABLE "offer_templates" ADD CONSTRAINT "offer_templates_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "offer_templates_category_idx" ON "offer_templates" USING btree ("category_id");
