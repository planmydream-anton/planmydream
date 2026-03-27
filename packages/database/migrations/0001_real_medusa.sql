CREATE TABLE "organizer_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"patronymic" varchar(255),
	"about_me" text,
	"photo_url" varchar(1000),
	"country" varchar(100),
	"legal_form" varchar(50),
	"inn" varchar(20),
	"ogrnip" varchar(20),
	"legal_name" varchar(500),
	"short_legal_name" varchar(255),
	"legal_address" jsonb,
	"legal_phone" varchar(50),
	"vat_rates" jsonb,
	"email_contact" varchar(255),
	"email_documents" varchar(255),
	"additional_contacts" text,
	"review_urls" jsonb,
	"timezone" varchar(100),
	"work_schedule" jsonb,
	"notify_inquiries" boolean DEFAULT true NOT NULL,
	"notify_promotions" boolean DEFAULT false NOT NULL,
	"telegram_chat_id" varchar(100),
	"vk_id" varchar(100),
	"email_verified" boolean DEFAULT false NOT NULL,
	"identity_verified" boolean DEFAULT false NOT NULL,
	"data_verified" boolean DEFAULT false NOT NULL,
	"verification_submitted_at" timestamp with time zone,
	"verification_completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "organizer_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "tours" ADD COLUMN "language" varchar(10);--> statement-breakpoint
ALTER TABLE "tours" ADD COLUMN "max_weight" integer;--> statement-breakpoint
ALTER TABLE "tours" ADD COLUMN "tour_types" jsonb;--> statement-breakpoint
ALTER TABLE "tours" ADD COLUMN "geography" jsonb;--> statement-breakpoint
ALTER TABLE "tours" ADD COLUMN "starting_location" jsonb;--> statement-breakpoint
ALTER TABLE "tours" ADD COLUMN "video_stories_url" varchar(1000);--> statement-breakpoint
ALTER TABLE "tours" ADD COLUMN "key_impressions" jsonb;--> statement-breakpoint
ALTER TABLE "tours" ADD COLUMN "guides" jsonb;--> statement-breakpoint
ALTER TABLE "tours" ADD COLUMN "insurance" text;--> statement-breakpoint
ALTER TABLE "tours" ADD COLUMN "cancellation_policy" jsonb;--> statement-breakpoint
ALTER TABLE "tours" ADD COLUMN "packing_list" text;--> statement-breakpoint
ALTER TABLE "tours" ADD COLUMN "cities" jsonb;--> statement-breakpoint
ALTER TABLE "tours" ADD COLUMN "travel_recommendations" text;--> statement-breakpoint
ALTER TABLE "tours" ADD COLUMN "general_tourist_comment" text;--> statement-breakpoint
ALTER TABLE "tours" ADD COLUMN "rejection_reason" text;--> statement-breakpoint
ALTER TABLE "tours" ADD COLUMN "moderated_by" uuid;--> statement-breakpoint
ALTER TABLE "tours" ADD COLUMN "moderated_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "organizer_id" uuid;--> statement-breakpoint
ALTER TABLE "organizer_profiles" ADD CONSTRAINT "organizer_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_organizer_profiles_user" ON "organizer_profiles" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "tours" ADD CONSTRAINT "tours_moderated_by_users_id_fk" FOREIGN KEY ("moderated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_organizer_id_users_id_fk" FOREIGN KEY ("organizer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_inquiries_organizer" ON "inquiries" USING btree ("organizer_id");