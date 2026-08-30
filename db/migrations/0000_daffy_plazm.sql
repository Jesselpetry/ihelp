CREATE SCHEMA "ihelp";
--> statement-breakpoint
CREATE TYPE "ihelp"."resource_type" AS ENUM('slide', 'summary', 'note');--> statement-breakpoint
CREATE TYPE "ihelp"."role" AS ENUM('student', 'insider', 'admin');--> statement-breakpoint
CREATE TYPE "ihelp"."scope" AS ENUM('midterm', 'final');--> statement-breakpoint
CREATE TABLE "ihelp"."exams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subject_code" text NOT NULL,
	"title" text NOT NULL,
	"exam_year" integer NOT NULL,
	"scope" "ihelp"."scope" NOT NULL,
	"file_url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ihelp"."resources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subject_code" text NOT NULL,
	"title" text NOT NULL,
	"type" "ihelp"."resource_type" NOT NULL,
	"scope" "ihelp"."scope",
	"file_url" text NOT NULL,
	"uploader_id" varchar(8) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ihelp"."users" (
	"student_id" varchar(8) PRIMARY KEY NOT NULL,
	"auth_user_id" uuid,
	"email" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"nickname" text,
	"major" text,
	"facebook_url" text,
	"ig_url" text,
	"role" "ihelp"."role" DEFAULT 'student' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_auth_user_id_unique" UNIQUE("auth_user_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "ihelp"."resources" ADD CONSTRAINT "resources_uploader_id_users_student_id_fk" FOREIGN KEY ("uploader_id") REFERENCES "ihelp"."users"("student_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "exams_subject_idx" ON "ihelp"."exams" USING btree ("subject_code");--> statement-breakpoint
CREATE INDEX "resources_subject_idx" ON "ihelp"."resources" USING btree ("subject_code");--> statement-breakpoint
CREATE INDEX "resources_uploader_idx" ON "ihelp"."resources" USING btree ("uploader_id");