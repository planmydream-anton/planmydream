CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"name" varchar(255),
	"role" varchar(50) DEFAULT 'manager' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "destinations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"country" varchar(255),
	"description" text,
	"cover_image_url" varchar(1000),
	"seo_title" varchar(255),
	"seo_description" varchar(500),
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "destinations_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "tours" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" varchar(500) NOT NULL,
	"subtitle" varchar(500),
	"tagline" text,
	"description" text,
	"price_from" numeric(10, 2),
	"currency" varchar(10) DEFAULT 'USD' NOT NULL,
	"duration_days" integer,
	"route" varchar(1000),
	"difficulty" varchar(50),
	"group_size_min" integer,
	"group_size_max" integer,
	"highlights" jsonb,
	"program" jsonb,
	"includes" jsonb,
	"excludes" jsonb,
	"payment_terms" text,
	"accommodation_info" text,
	"additional_services" text,
	"weather_info" text,
	"comfort_level" varchar(20),
	"min_age" integer,
	"arrival_info" text,
	"accommodations" jsonb,
	"seo_title" varchar(255),
	"seo_description" varchar(500),
	"seo_keywords" varchar(500),
	"og_image_url" varchar(1000),
	"destination_id" uuid,
	"created_by" uuid,
	"organizer_id" uuid,
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"position" integer DEFAULT 0,
	"is_featured" integer DEFAULT 0,
	"discount_percent" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published_at" timestamp with time zone,
	CONSTRAINT "tours_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "departures" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tour_id" uuid NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"spots_total" integer DEFAULT 0,
	"spots_booked" integer DEFAULT 0,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"filename" varchar(500) NOT NULL,
	"original_filename" varchar(500),
	"url" varchar(1000) NOT NULL,
	"type" varchar(50) NOT NULL,
	"mime_type" varchar(100),
	"size_bytes" integer,
	"width" integer,
	"height" integer,
	"alt_text" varchar(500),
	"caption" text,
	"tags" text[],
	"video_provider" varchar(50),
	"video_id" varchar(100),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid
);
--> statement-breakpoint
CREATE TABLE "tour_media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tour_id" uuid NOT NULL,
	"media_id" uuid NOT NULL,
	"position" integer DEFAULT 0,
	"is_cover" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" varchar(500) NOT NULL,
	"excerpt" text,
	"content" text,
	"cover_image_url" varchar(1000),
	"category" varchar(100),
	"tags" text[],
	"seo_title" varchar(255),
	"seo_description" varchar(500),
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	CONSTRAINT "articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "faqs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"category" varchar(100),
	"position" integer DEFAULT 0,
	"tour_id" uuid,
	"status" varchar(20) DEFAULT 'published' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" varchar(500) NOT NULL,
	"content" text,
	"template" varchar(100) DEFAULT 'default',
	"seo_title" varchar(255),
	"seo_description" varchar(500),
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tour_id" uuid,
	"author_name" varchar(255) NOT NULL,
	"author_photo_url" varchar(1000),
	"rating" integer,
	"text" text NOT NULL,
	"travel_date" date,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"position" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "advantages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"icon" varchar(100),
	"position" integer DEFAULT 0,
	"is_active" integer DEFAULT 1,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_type" varchar(100) NOT NULL,
	"entity_id" uuid NOT NULL,
	"action" varchar(50) NOT NULL,
	"changes" jsonb,
	"user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255),
	"phone" varchar(50) NOT NULL,
	"tour_id" uuid,
	"departure_id" uuid,
	"message" text,
	"source" varchar(100),
	"utm_source" varchar(255),
	"utm_medium" varchar(255),
	"utm_campaign" varchar(255),
	"page_url" varchar(1000),
	"amocrm_lead_id" integer,
	"amocrm_synced_at" timestamp with time zone,
	"status" varchar(50) DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(255) NOT NULL,
	"value" jsonb,
	"description" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "team_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"role" varchar(255) NOT NULL,
	"bio" text,
	"photo_url" varchar(1000),
	"position" integer DEFAULT 0,
	"is_active" integer DEFAULT 1,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tours" ADD CONSTRAINT "tours_destination_id_destinations_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."destinations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tours" ADD CONSTRAINT "tours_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tours" ADD CONSTRAINT "tours_organizer_id_team_members_id_fk" FOREIGN KEY ("organizer_id") REFERENCES "public"."team_members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "departures" ADD CONSTRAINT "departures_tour_id_tours_id_fk" FOREIGN KEY ("tour_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tour_media" ADD CONSTRAINT "tour_media_tour_id_tours_id_fk" FOREIGN KEY ("tour_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tour_media" ADD CONSTRAINT "tour_media_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faqs" ADD CONSTRAINT "faqs_tour_id_tours_id_fk" FOREIGN KEY ("tour_id") REFERENCES "public"."tours"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_tour_id_tours_id_fk" FOREIGN KEY ("tour_id") REFERENCES "public"."tours"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_tour_id_tours_id_fk" FOREIGN KEY ("tour_id") REFERENCES "public"."tours"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_departure_id_departures_id_fk" FOREIGN KEY ("departure_id") REFERENCES "public"."departures"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_tours_status" ON "tours" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_tours_destination" ON "tours" USING btree ("destination_id");--> statement-breakpoint
CREATE INDEX "idx_tours_slug" ON "tours" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_departures_tour" ON "departures" USING btree ("tour_id");--> statement-breakpoint
CREATE INDEX "idx_departures_dates" ON "departures" USING btree ("start_date","end_date");--> statement-breakpoint
CREATE INDEX "idx_departures_status" ON "departures" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_media_type" ON "media" USING btree ("type");--> statement-breakpoint
CREATE INDEX "idx_tour_media_tour" ON "tour_media" USING btree ("tour_id");--> statement-breakpoint
CREATE INDEX "idx_tour_media_media" ON "tour_media" USING btree ("media_id");--> statement-breakpoint
CREATE INDEX "idx_articles_status" ON "articles" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_articles_category" ON "articles" USING btree ("category");--> statement-breakpoint
CREATE INDEX "idx_articles_slug" ON "articles" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_reviews_tour" ON "reviews" USING btree ("tour_id");--> statement-breakpoint
CREATE INDEX "idx_reviews_status" ON "reviews" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_audit_entity" ON "audit_log" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "idx_audit_user" ON "audit_log" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_inquiries_status" ON "inquiries" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_inquiries_created" ON "inquiries" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_inquiries_tour" ON "inquiries" USING btree ("tour_id");