CREATE TYPE "public"."media_status" AS ENUM('WISHLIST', 'IN_PROGRESS', 'COMPLETED');--> statement-breakpoint
CREATE TYPE "public"."book_format" AS ENUM('PHYSICAL', 'EBOOK', 'AUDIOBOOK');--> statement-breakpoint
CREATE TYPE "public"."book_source" AS ENUM('AMAZON', 'KINDLE', 'KOBO', 'PHYSICAL', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."place_category" AS ENUM('RESTAURANT', 'CAFE', 'BAR', 'ATTRACTION', 'MUSEUM', 'PARK', 'HOTEL', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."place_location_type" AS ENUM('LOCAL', 'DOMESTIC', 'INTERNATIONAL');--> statement-breakpoint
CREATE TYPE "public"."place_price_range" AS ENUM('INEXPENSIVE', 'MODERATE', 'EXPENSIVE', 'VERY_EXPENSIVE');--> statement-breakpoint
CREATE TABLE "media_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"ai_description" text,
	"rating" integer,
	"ranking" integer,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"author" text,
	"date_added" timestamp DEFAULT now() NOT NULL,
	"date_updated" timestamp DEFAULT now() NOT NULL,
	"status" "media_status" DEFAULT 'WISHLIST' NOT NULL,
	"source" text,
	"source_url" text,
	"image_url" text,
	"media_type" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_to_tags" (
	"media_id" uuid NOT NULL,
	"tag_id" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recently_viewed" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"media_id" uuid NOT NULL,
	"viewed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"date_added" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tags_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "user_preferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"preferences" jsonb DEFAULT '{}'::jsonb,
	"date_updated" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_preferences_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "book_authors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"biography" text
);
--> statement-breakpoint
CREATE TABLE "book_genres" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	CONSTRAINT "book_genres_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "book_to_authors" (
	"book_id" uuid NOT NULL,
	"author_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "book_to_genres" (
	"book_id" uuid NOT NULL,
	"genre_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "books" (
	"id" uuid PRIMARY KEY NOT NULL,
	"isbn" text,
	"isbn13" text,
	"page_count" integer,
	"publisher" text,
	"published_date" text,
	"format" "book_format",
	"source" "book_source",
	"language" text,
	"current_page" integer,
	"series" text,
	"series_position" integer,
	"edition" text,
	"translator" text
);
--> statement-breakpoint
CREATE TABLE "place_photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"place_id" uuid NOT NULL,
	"url" text NOT NULL,
	"caption" text,
	"is_primary" integer DEFAULT 0,
	"date_added" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "places" (
	"id" uuid PRIMARY KEY NOT NULL,
	"category" "place_category" NOT NULL,
	"address" text,
	"city" text NOT NULL,
	"state" text,
	"country" text NOT NULL,
	"postal_code" text,
	"coordinates" jsonb,
	"website" text,
	"phone" text,
	"price_range" "place_price_range",
	"visit_date" timestamp,
	"planned_date" timestamp,
	"location_type" "place_location_type" DEFAULT 'LOCAL' NOT NULL,
	"notes" text
);
--> statement-breakpoint
ALTER TABLE "media_to_tags" ADD CONSTRAINT "media_to_tags_media_id_media_items_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_to_tags" ADD CONSTRAINT "media_to_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recently_viewed" ADD CONSTRAINT "recently_viewed_media_id_media_items_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_to_authors" ADD CONSTRAINT "book_to_authors_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_to_authors" ADD CONSTRAINT "book_to_authors_author_id_book_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."book_authors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_to_genres" ADD CONSTRAINT "book_to_genres_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_to_genres" ADD CONSTRAINT "book_to_genres_genre_id_book_genres_id_fk" FOREIGN KEY ("genre_id") REFERENCES "public"."book_genres"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_id_media_items_id_fk" FOREIGN KEY ("id") REFERENCES "public"."media_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "place_photos" ADD CONSTRAINT "place_photos_place_id_places_id_fk" FOREIGN KEY ("place_id") REFERENCES "public"."places"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "places" ADD CONSTRAINT "places_id_media_items_id_fk" FOREIGN KEY ("id") REFERENCES "public"."media_items"("id") ON DELETE cascade ON UPDATE no action;