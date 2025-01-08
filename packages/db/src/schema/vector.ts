import { pgTable, uuid, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const embeddings = pgTable("embeddings", {
  id: uuid("id").primaryKey().$defaultFn(() => createId()),
  contentId: text("content_id").notNull(),
  contentType: text("content_type").notNull(),
  embedding: text("embedding").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}); 