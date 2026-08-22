ALTER TABLE "users" ADD COLUMN "recovery_expires_at" timestamp with time zone;--> statement-breakpoint
CREATE INDEX "users_deleted_at_idx" ON "users" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "users_recovery_expires_at_idx" ON "users" USING btree ("recovery_expires_at");