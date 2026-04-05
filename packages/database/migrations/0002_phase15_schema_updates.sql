-- Phase 1.5: Schema updates for organizer CRM enhancements

-- New columns in organizer_profiles
ALTER TABLE "organizer_profiles" ADD COLUMN "phone" varchar(50);
ALTER TABLE "organizer_profiles" ADD COLUMN "website_url" varchar(1000);
ALTER TABLE "organizer_profiles" ADD COLUMN "social_links" jsonb;
ALTER TABLE "organizer_profiles" ADD COLUMN "cancellation_policy_template" jsonb;

-- New table: organizer_guides
CREATE TABLE IF NOT EXISTS "organizer_guides" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "organizer_id" uuid NOT NULL,
  "first_name" varchar(255) NOT NULL,
  "last_name" varchar(255) NOT NULL,
  "photo" varchar(1000),
  "bio" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE "organizer_guides" ADD CONSTRAINT "organizer_guides_organizer_id_users_id_fk" FOREIGN KEY ("organizer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
CREATE INDEX IF NOT EXISTS "idx_organizer_guides_organizer" ON "organizer_guides" USING btree ("organizer_id");

-- Tour schema updates
-- Change insurance from text to varchar(50)
ALTER TABLE "tours" ALTER COLUMN "insurance" TYPE varchar(50);

-- Add new columns to tours
ALTER TABLE "tours" ADD COLUMN "ticket_info" jsonb;
ALTER TABLE "tours" ADD COLUMN "faq" jsonb;
ALTER TABLE "tours" ADD COLUMN "countries" jsonb;

-- Drop old cities column (data migrated to ticket_info)
ALTER TABLE "tours" DROP COLUMN IF EXISTS "cities";
