CREATE TABLE "ihelp"."site_visits" (
	"day" date NOT NULL,
	"visitor_hash" text NOT NULL,
	"hits" integer DEFAULT 1 NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "site_visits_day_visitor_hash_pk" PRIMARY KEY("day","visitor_hash")
);
--> statement-breakpoint
CREATE INDEX "site_visits_day_idx" ON "ihelp"."site_visits" USING btree ("day");