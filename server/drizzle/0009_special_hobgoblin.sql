CREATE TYPE "public"."role_enum" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TYPE "public"."trip_status_enum" AS ENUM('draft', 'planned', 'ongoing', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."trip_visibility_enum" AS ENUM('private', 'public');--> statement-breakpoint
CREATE TYPE "public"."cost_category_enum" AS ENUM('transport', 'stay', 'activity', 'meal');--> statement-breakpoint
CREATE TABLE "password_reset_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "password_reset_tokens_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "cities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"country" text NOT NULL,
	"region" text,
	"cost_index" numeric(10, 2),
	"popularity" numeric(10, 2),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cities_cost_index_check" CHECK (cost_index IS NULL OR cost_index >= 0),
	CONSTRAINT "cities_popularity_check" CHECK (popularity IS NULL OR popularity >= 0)
);
--> statement-breakpoint
CREATE TABLE "activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"city_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"activity_type" text,
	"cost" numeric(12, 2),
	"duration_minutes" integer,
	"currency" text DEFAULT 'INR',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "activities_cost_check" CHECK (cost IS NULL OR cost >= 0),
	CONSTRAINT "activities_duration_check" CHECK (duration_minutes IS NULL OR duration_minutes > 0)
);
--> statement-breakpoint
CREATE TABLE "activity_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"activity_id" uuid NOT NULL,
	"image_url" text NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "activity_images_order_check" CHECK (display_order >= 0)
);
--> statement-breakpoint
CREATE TABLE "trips" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"cover_photo_url" text,
	"budget_amount" numeric(12, 2),
	"budget_currency" text DEFAULT 'INR' NOT NULL,
	"status" "trip_status_enum" DEFAULT 'draft' NOT NULL,
	"visibility" "trip_visibility_enum" DEFAULT 'private' NOT NULL,
	"public_slug" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "trips_public_slug_unique" UNIQUE("public_slug"),
	CONSTRAINT "trips_dates_check" CHECK (start_date <= end_date),
	CONSTRAINT "trips_budget_check" CHECK (budget_amount IS NULL OR budget_amount >= 0)
);
--> statement-breakpoint
CREATE TABLE "trip_stops" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trip_id" uuid NOT NULL,
	"city_id" uuid NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"sequence_order" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "trip_stops_dates_check" CHECK (start_date <= end_date),
	CONSTRAINT "trip_stops_sequence_check" CHECK (sequence_order > 0)
);
--> statement-breakpoint
CREATE TABLE "trip_stop_activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trip_stop_id" uuid NOT NULL,
	"activity_id" uuid NOT NULL,
	"activity_date" date NOT NULL,
	"start_time" time,
	"end_time" time,
	"sequence_order" integer DEFAULT 1 NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "trip_stop_activities_sequence_check" CHECK (sequence_order > 0),
	CONSTRAINT "trip_stop_activities_time_check" CHECK (start_time IS NULL OR end_time IS NULL OR start_time < end_time)
);
--> statement-breakpoint
CREATE TABLE "trip_cost_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trip_id" uuid NOT NULL,
	"trip_stop_id" uuid,
	"trip_stop_activity_id" uuid,
	"category" "cost_category_enum" NOT NULL,
	"description" text,
	"amount" numeric(12, 2) NOT NULL,
	"currency" text DEFAULT 'INR' NOT NULL,
	"cost_date" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "trip_cost_items_amount_check" CHECK (amount >= 0)
);
--> statement-breakpoint
CREATE TABLE "trip_shares" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trip_id" uuid NOT NULL,
	"shared_with_user_id" uuid NOT NULL,
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "saved_destinations" (
	"user_id" uuid NOT NULL,
	"city_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "saved_destinations_user_id_city_id_pk" PRIMARY KEY("user_id","city_id")
);
--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_images" ADD CONSTRAINT "activity_images_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip_stops" ADD CONSTRAINT "trip_stops_trip_id_trips_id_fk" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip_stops" ADD CONSTRAINT "trip_stops_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip_stop_activities" ADD CONSTRAINT "trip_stop_activities_trip_stop_id_trip_stops_id_fk" FOREIGN KEY ("trip_stop_id") REFERENCES "public"."trip_stops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip_stop_activities" ADD CONSTRAINT "trip_stop_activities_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip_cost_items" ADD CONSTRAINT "trip_cost_items_trip_id_trips_id_fk" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip_cost_items" ADD CONSTRAINT "trip_cost_items_trip_stop_id_trip_stops_id_fk" FOREIGN KEY ("trip_stop_id") REFERENCES "public"."trip_stops"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip_cost_items" ADD CONSTRAINT "trip_cost_items_trip_stop_activity_id_trip_stop_activities_id_fk" FOREIGN KEY ("trip_stop_activity_id") REFERENCES "public"."trip_stop_activities"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip_shares" ADD CONSTRAINT "trip_shares_trip_id_trips_id_fk" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip_shares" ADD CONSTRAINT "trip_shares_shared_with_user_id_users_id_fk" FOREIGN KEY ("shared_with_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip_shares" ADD CONSTRAINT "trip_shares_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_destinations" ADD CONSTRAINT "saved_destinations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_destinations" ADD CONSTRAINT "saved_destinations_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "password_reset_tokens_user_idx" ON "password_reset_tokens" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "password_reset_tokens_hash_idx" ON "password_reset_tokens" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "cities_name_idx" ON "cities" USING btree ("name");--> statement-breakpoint
CREATE INDEX "cities_country_idx" ON "cities" USING btree ("country");--> statement-breakpoint
CREATE INDEX "cities_region_idx" ON "cities" USING btree ("region");--> statement-breakpoint
CREATE INDEX "cities_popularity_idx" ON "cities" USING btree ("popularity");--> statement-breakpoint
CREATE UNIQUE INDEX "cities_country_name_unique" ON "cities" USING btree ("country","name");--> statement-breakpoint
CREATE INDEX "activities_city_idx" ON "activities" USING btree ("city_id");--> statement-breakpoint
CREATE INDEX "activities_type_idx" ON "activities" USING btree ("activity_type");--> statement-breakpoint
CREATE INDEX "activities_cost_idx" ON "activities" USING btree ("cost");--> statement-breakpoint
CREATE INDEX "activities_duration_idx" ON "activities" USING btree ("duration_minutes");--> statement-breakpoint
CREATE INDEX "activities_city_name_idx" ON "activities" USING btree ("city_id","name");--> statement-breakpoint
CREATE INDEX "activity_images_activity_idx" ON "activity_images" USING btree ("activity_id");--> statement-breakpoint
CREATE INDEX "activity_images_order_idx" ON "activity_images" USING btree ("activity_id","display_order");--> statement-breakpoint
CREATE INDEX "trips_owner_idx" ON "trips" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "trips_owner_start_date_idx" ON "trips" USING btree ("owner_id","start_date");--> statement-breakpoint
CREATE INDEX "trips_status_idx" ON "trips" USING btree ("status");--> statement-breakpoint
CREATE INDEX "trips_owner_status_idx" ON "trips" USING btree ("owner_id","status");--> statement-breakpoint
CREATE INDEX "trips_visibility_idx" ON "trips" USING btree ("visibility");--> statement-breakpoint
CREATE INDEX "trips_public_slug_idx" ON "trips" USING btree ("public_slug");--> statement-breakpoint
CREATE INDEX "trip_stops_trip_idx" ON "trip_stops" USING btree ("trip_id");--> statement-breakpoint
CREATE INDEX "trip_stops_city_idx" ON "trip_stops" USING btree ("city_id");--> statement-breakpoint
CREATE UNIQUE INDEX "trip_stops_trip_sequence_unique" ON "trip_stops" USING btree ("trip_id","sequence_order");--> statement-breakpoint
CREATE INDEX "trip_stop_activities_stop_idx" ON "trip_stop_activities" USING btree ("trip_stop_id");--> statement-breakpoint
CREATE INDEX "trip_stop_activities_activity_idx" ON "trip_stop_activities" USING btree ("activity_id");--> statement-breakpoint
CREATE INDEX "trip_stop_activities_date_idx" ON "trip_stop_activities" USING btree ("trip_stop_id","activity_date");--> statement-breakpoint
CREATE INDEX "trip_stop_activities_sequence_idx" ON "trip_stop_activities" USING btree ("trip_stop_id","sequence_order");--> statement-breakpoint
CREATE UNIQUE INDEX "trip_stop_activities_unique" ON "trip_stop_activities" USING btree ("trip_stop_id","activity_id","activity_date","start_time");--> statement-breakpoint
CREATE INDEX "trip_cost_items_trip_idx" ON "trip_cost_items" USING btree ("trip_id");--> statement-breakpoint
CREATE INDEX "trip_cost_items_stop_idx" ON "trip_cost_items" USING btree ("trip_stop_id");--> statement-breakpoint
CREATE INDEX "trip_cost_items_activity_idx" ON "trip_cost_items" USING btree ("trip_stop_activity_id");--> statement-breakpoint
CREATE INDEX "trip_cost_items_category_idx" ON "trip_cost_items" USING btree ("trip_id","category");--> statement-breakpoint
CREATE INDEX "trip_cost_items_date_idx" ON "trip_cost_items" USING btree ("trip_id","cost_date");--> statement-breakpoint
CREATE INDEX "trip_shares_trip_idx" ON "trip_shares" USING btree ("trip_id");--> statement-breakpoint
CREATE INDEX "trip_shares_shared_with_user_idx" ON "trip_shares" USING btree ("shared_with_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "trip_shares_unique_idx" ON "trip_shares" USING btree ("trip_id","shared_with_user_id");--> statement-breakpoint
CREATE INDEX "saved_destinations_city_idx" ON "saved_destinations" USING btree ("city_id");--> statement-breakpoint
CREATE INDEX "saved_destinations_user_idx" ON "saved_destinations" USING btree ("user_id");