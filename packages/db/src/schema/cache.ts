import { pgTable, uuid, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const keyValue = pgTable("key_value", {
  id: uuid("id").primaryKey().$defaultFn(() => createId()),
  key: text("key").notNull().unique(),
  value: jsonb("value").notNull(),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}); 