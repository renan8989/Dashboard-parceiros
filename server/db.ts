import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { campaigns, InsertCampaign, InsertPartner, InsertTouchpoint, partners, touchpoints, InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function ensureFirstCampaign() {
  const db = await getDb();
  if (!db) return null;
  const current = await db.select().from(campaigns).orderBy(desc(campaigns.startedAt)).limit(1);
  if (current[0]) return current[0];
  const result = await db.insert(campaigns).values({
    name: "Loteamento • investida da semana",
    channel: "WhatsApp Business",
    startedAt: new Date(),
    objective: "Apresentar a oportunidade de parceria e identificar quem demonstrou interesse.",
  });
  const id = Number(result[0].insertId);
  const created = await db.select().from(campaigns).where(eq(campaigns.id, id)).limit(1);
  return created[0] ?? null;
}

export async function listCampaigns() {
  const db = await getDb();
  if (!db) return [];
  await ensureFirstCampaign();
  return db.select().from(campaigns).orderBy(desc(campaigns.startedAt));
}

export async function listPartners(campaignId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(partners).where(eq(partners.campaignId, campaignId)).orderBy(desc(partners.updatedAt));
}

export async function createPartner(input: InsertPartner) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(partners).values(input);
  const created = await db.select().from(partners).where(eq(partners.id, Number(result[0].insertId))).limit(1);
  return created[0];
}

export async function updatePartner(id: number, input: Partial<InsertPartner>) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(partners).set(input).where(eq(partners.id, id));
  const updated = await db.select().from(partners).where(eq(partners.id, id)).limit(1);
  return updated[0];
}

export async function listTouchpoints(partnerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(touchpoints).where(eq(touchpoints.partnerId, partnerId)).orderBy(desc(touchpoints.happenedAt));
}

export async function createTouchpoint(input: InsertTouchpoint) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(touchpoints).values(input);
  const created = await db.select().from(touchpoints).where(eq(touchpoints.id, Number(result[0].insertId))).limit(1);
  return created[0];
}
