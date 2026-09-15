import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const rewardRequests = sqliteTable("reward_requests", {
  id: text("id").primaryKey(),
  country: text("country").notNull(),
  countryCode: text("country_code").notNull(),
  phone: text("phone").notNull(),
  game: text("game").notNull(),
  gameUsername: text("game_username").notNull(),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
}, (table) => [
  index("idx_reward_requests_status_created").on(table.status, table.createdAt),
  index("idx_reward_requests_phone").on(table.phone),
]);
