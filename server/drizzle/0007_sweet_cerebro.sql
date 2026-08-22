CREATE TABLE "rag_files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"file_id" text NOT NULL,
	"name" text NOT NULL,
	"size" integer NOT NULL,
	"file_path" text NOT NULL,
	"url" text NOT NULL,
	"file_type" text NOT NULL,
	"mimetype" text NOT NULL,
	"uploaded_by" uuid,
	"processing_status" text DEFAULT 'pending' NOT NULL,
	"rag_status" text DEFAULT 'pending' NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chunks" ADD COLUMN "rag_file_id" uuid;--> statement-breakpoint
ALTER TABLE "rag_files" ADD CONSTRAINT "rag_files_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chunks" ADD CONSTRAINT "chunks_rag_file_id_rag_files_id_fk" FOREIGN KEY ("rag_file_id") REFERENCES "public"."rag_files"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chunks_rag_file_id_idx" ON "chunks" USING btree ("rag_file_id");