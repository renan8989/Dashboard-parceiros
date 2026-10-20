import { date, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const campaigns = mysqlTable("campaigns", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  channel: varchar("channel", { length: 80 }).default("WhatsApp Business").notNull(),
  startedAt: date("startedAt").notNull(),
  objective: text("objective"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const partners = mysqlTable("partners", {
  id: int("id").autoincrement().primaryKey(),
  campaignId: int("campaignId").notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  company: varchar("company", { length: 160 }),
  phone: varchar("phone", { length: 32 }).notNull(),
  contactedAt: date("contactedAt").notNull(),
  responseStatus: mysqlEnum("responseStatus", ["responded", "no_response"]).default("no_response").notNull(),
  responseQuality: mysqlEnum("responseQuality", ["positive", "follow_up", "negative", "none"]).default("none").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const touchpoints = mysqlTable("touchpoints", {
  id: int("id").autoincrement().primaryKey(),
  partnerId: int("partnerId").notNull(),
  happenedAt: timestamp("happenedAt").defaultNow().notNull(),
  kind: mysqlEnum("kind", ["message", "call", "note"]).default("message").notNull(),
  detail: text("detail").notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = typeof campaigns.$inferInsert;
export type Partner = typeof partners.$inferSelect;
export type InsertPartner = typeof partners.$inferInsert;
export type Touchpoint = typeof touchpoints.$inferSelect;
export type InsertTouchpoint = typeof touchpoints.$inferInsert;
