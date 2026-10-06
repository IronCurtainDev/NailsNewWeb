import { getCloudflareContext } from "@opennextjs/cloudflare";
import fs from "fs";
import path from "path";
import crypto from "crypto";

// ============================================================
// INTERFACES
// ============================================================

export interface User {
  id: string;
  createdAt: string;
  email: string;
  passwordHash: string;
  salt: string;
  name: string;
  phone: string;
}

export interface Booking {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  notes?: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  userId?: string;
}

export interface PressOnOrder {
  id: string;
  createdAt: string;
  customerName: string;
  phone: string;
  shippingAddress?: string;
  setId: string;
  setName: string;
  shape: string;
  size: string;
  price: string;
  notes?: string;
  status: "new" | "processing" | "shipped" | "completed" | "cancelled";
  userId?: string;
}

interface DatabaseSchema {
  users: User[];
  bookings: Booking[];
  orders: PressOnOrder[];
}

// ============================================================
// PASSWORD & TOKEN UTILITIES
// ============================================================

export function hashPassword(password: string, salt: string): string {
  return crypto.createHash("sha256").update(salt + password).digest("hex");
}

export function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

export function generateToken(userId: string, email: string): string {
  const payload = JSON.stringify({ userId, email, ts: Date.now() });
  return Buffer.from(payload).toString("base64");
}

export function parseToken(token: string): { userId: string; email: string; ts: number } | null {
  try {
    const payload = Buffer.from(token, "base64").toString("utf-8");
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

// ============================================================
// D1 CONTEXT HELPER
// ============================================================

async function getD1(): Promise<any | null> {
  try {
    const ctx = await getCloudflareContext({ async: true });
    const env = ctx?.env as { DB?: any } | undefined;
    if (env?.DB) {
      return env.DB;
    }
  } catch {
    // Cloudflare context not available (e.g. standard local dev or static pre-render)
  }
  return null;
}

// ============================================================
// FALLBACK LOCAL JSON FILE DB (FOR LOCAL DEV WITHOUT WRANGLER)
// ============================================================

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

function ensureLocalDb(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData: DatabaseSchema = {
      users: [],
      bookings: [
        {
          id: "bk_demo1",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          name: "Priya Sharma",
          phone: "+91 98765 43210",
          service: "Gel Extensions",
          date: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
          time: "2:00 PM",
          notes: "Almond shape with subtle chrome finish",
          status: "confirmed",
        },
      ],
      orders: [
        {
          id: "ord_demo1",
          createdAt: new Date(Date.now() - 43200000).toISOString(),
          customerName: "Sneha Patel",
          phone: "+91 98123 45678",
          shippingAddress: "Flat 402, Lotus Residency, Indiranagar, Bangalore - 560038",
          setId: "p1",
          setName: "Blush Pearl & 3D Floral",
          shape: "Almond · Medium",
          size: "M",
          price: "Rs.3000",
          notes: "Need it before the weekend",
          status: "new",
        },
      ],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
    return initialData;
  }

  try {
    const content = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(content);
    if (!parsed.users) parsed.users = [];
    return parsed;
  } catch {
    const fallback: DatabaseSchema = { users: [], bookings: [], orders: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(fallback, null, 2), "utf-8");
    return fallback;
  }
}

function saveLocalDb(data: DatabaseSchema): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// ============================================================
// USER CRUD
// ============================================================

export async function getAllUsers(): Promise<User[]> {
  const d1 = await getD1();
  if (d1) {
    const res = await d1.prepare("SELECT * FROM users ORDER BY createdAt DESC").all();
    return res.results as User[];
  }
  return ensureLocalDb().users;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const d1 = await getD1();
  if (d1) {
    const res = await d1.prepare("SELECT * FROM users WHERE LOWER(email) = LOWER(?)").bind(email.trim()).first();
    return (res as User) || null;
  }
  const db = ensureLocalDb();
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function getUserById(id: string): Promise<User | null> {
  const d1 = await getD1();
  if (d1) {
    const res = await d1.prepare("SELECT * FROM users WHERE id = ?").bind(id).first();
    return (res as User) || null;
  }
  const db = ensureLocalDb();
  return db.users.find((u) => u.id === id) || null;
}

export async function createUser(payload: { email: string; password: string; name: string; phone: string }): Promise<User> {
  const salt = generateSalt();
  const newUser: User = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
    email: payload.email.trim().toLowerCase(),
    passwordHash: hashPassword(payload.password, salt),
    salt,
    name: payload.name.trim(),
    phone: payload.phone.trim(),
  };

  const d1 = await getD1();
  if (d1) {
    await d1
      .prepare(
        "INSERT INTO users (id, createdAt, email, passwordHash, salt, name, phone) VALUES (?, ?, ?, ?, ?, ?, ?)"
      )
      .bind(newUser.id, newUser.createdAt, newUser.email, newUser.passwordHash, newUser.salt, newUser.name, newUser.phone)
      .run();
    return newUser;
  }

  const db = ensureLocalDb();
  db.users.push(newUser);
  saveLocalDb(db);
  return newUser;
}

export async function updateUser(id: string, updates: Partial<Pick<User, "name" | "phone" | "email">>): Promise<User | null> {
  const d1 = await getD1();
  if (d1) {
    const user = await getUserById(id);
    if (!user) return null;
    const updated = { ...user, ...updates };
    await d1
      .prepare("UPDATE users SET name = ?, phone = ?, email = ? WHERE id = ?")
      .bind(updated.name, updated.phone, updated.email, id)
      .run();
    return updated;
  }

  const db = ensureLocalDb();
  const index = db.users.findIndex((u) => u.id === id);
  if (index === -1) return null;
  db.users[index] = { ...db.users[index], ...updates };
  saveLocalDb(db);
  return db.users[index];
}

// ============================================================
// BOOKINGS CRUD
// ============================================================

export async function getAllBookings(): Promise<Booking[]> {
  const d1 = await getD1();
  if (d1) {
    const res = await d1.prepare("SELECT * FROM bookings ORDER BY createdAt DESC").all();
    return res.results as Booking[];
  }
  const db = ensureLocalDb();
  return db.bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getBookingsByUserId(userId: string): Promise<Booking[]> {
  const d1 = await getD1();
  if (d1) {
    const res = await d1.prepare("SELECT * FROM bookings WHERE userId = ? ORDER BY createdAt DESC").bind(userId).all();
    return res.results as Booking[];
  }
  const db = ensureLocalDb();
  return db.bookings
    .filter((b) => b.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createBooking(
  payload: Omit<Booking, "id" | "createdAt" | "status"> & { status?: Booking["status"] }
): Promise<Booking> {
  const newBooking: Booking = {
    id: `bk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
    name: payload.name.trim(),
    phone: payload.phone.trim(),
    service: payload.service,
    date: payload.date,
    time: payload.time,
    notes: payload.notes?.trim() || "",
    status: payload.status || "pending",
    userId: payload.userId || undefined,
  };

  const d1 = await getD1();
  if (d1) {
    await d1
      .prepare(
        "INSERT INTO bookings (id, createdAt, name, phone, service, date, time, notes, status, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
      )
      .bind(
        newBooking.id,
        newBooking.createdAt,
        newBooking.name,
        newBooking.phone,
        newBooking.service,
        newBooking.date,
        newBooking.time,
        newBooking.notes,
        newBooking.status,
        newBooking.userId || null
      )
      .run();
    return newBooking;
  }

  const db = ensureLocalDb();
  db.bookings.unshift(newBooking);
  saveLocalDb(db);
  return newBooking;
}

export async function updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | null> {
  const d1 = await getD1();
  if (d1) {
    const existing = (await d1.prepare("SELECT * FROM bookings WHERE id = ?").bind(id).first()) as Booking | null;
    if (!existing) return null;
    const merged = { ...existing, ...updates };
    await d1
      .prepare("UPDATE bookings SET name = ?, phone = ?, service = ?, date = ?, time = ?, notes = ?, status = ?, userId = ? WHERE id = ?")
      .bind(merged.name, merged.phone, merged.service, merged.date, merged.time, merged.notes || "", merged.status, merged.userId || null, id)
      .run();
    return merged;
  }

  const db = ensureLocalDb();
  const index = db.bookings.findIndex((b) => b.id === id);
  if (index === -1) return null;
  db.bookings[index] = { ...db.bookings[index], ...updates };
  saveLocalDb(db);
  return db.bookings[index];
}

export async function deleteBooking(id: string): Promise<boolean> {
  const d1 = await getD1();
  if (d1) {
    const res = await d1.prepare("DELETE FROM bookings WHERE id = ?").bind(id).run();
    return (res.meta?.changes ?? 0) > 0;
  }

  const db = ensureLocalDb();
  const initialLen = db.bookings.length;
  db.bookings = db.bookings.filter((b) => b.id !== id);
  if (db.bookings.length !== initialLen) {
    saveLocalDb(db);
    return true;
  }
  return false;
}

// ============================================================
// PRESS-ON ORDERS CRUD
// ============================================================

export async function getAllOrders(): Promise<PressOnOrder[]> {
  const d1 = await getD1();
  if (d1) {
    const res = await d1.prepare("SELECT * FROM orders ORDER BY createdAt DESC").all();
    return res.results as PressOnOrder[];
  }
  const db = ensureLocalDb();
  return db.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getOrdersByUserId(userId: string): Promise<PressOnOrder[]> {
  const d1 = await getD1();
  if (d1) {
    const res = await d1.prepare("SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC").bind(userId).all();
    return res.results as PressOnOrder[];
  }
  const db = ensureLocalDb();
  return db.orders
    .filter((o) => o.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createOrder(
  payload: Omit<PressOnOrder, "id" | "createdAt" | "status"> & { status?: PressOnOrder["status"] }
): Promise<PressOnOrder> {
  const newOrder: PressOnOrder = {
    id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
    customerName: payload.customerName.trim(),
    phone: payload.phone.trim(),
    shippingAddress: payload.shippingAddress?.trim() || "",
    setId: payload.setId,
    setName: payload.setName,
    shape: payload.shape,
    size: payload.size,
    price: payload.price,
    notes: payload.notes?.trim() || "",
    status: payload.status || "new",
    userId: payload.userId || undefined,
  };

  const d1 = await getD1();
  if (d1) {
    await d1
      .prepare(
        "INSERT INTO orders (id, createdAt, customerName, phone, shippingAddress, setId, setName, shape, size, price, notes, status, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
      )
      .bind(
        newOrder.id,
        newOrder.createdAt,
        newOrder.customerName,
        newOrder.phone,
        newOrder.shippingAddress || "",
        newOrder.setId,
        newOrder.setName,
        newOrder.shape,
        newOrder.size,
        newOrder.price,
        newOrder.notes,
        newOrder.status,
        newOrder.userId || null
      )
      .run();
    return newOrder;
  }

  const db = ensureLocalDb();
  db.orders.unshift(newOrder);
  saveLocalDb(db);
  return newOrder;
}

export async function updateOrder(id: string, updates: Partial<PressOnOrder>): Promise<PressOnOrder | null> {
  const d1 = await getD1();
  if (d1) {
    const existing = (await d1.prepare("SELECT * FROM orders WHERE id = ?").bind(id).first()) as PressOnOrder | null;
    if (!existing) return null;
    const merged = { ...existing, ...updates };
    await d1
      .prepare(
        "UPDATE orders SET customerName = ?, phone = ?, shippingAddress = ?, setId = ?, setName = ?, shape = ?, size = ?, price = ?, notes = ?, status = ?, userId = ? WHERE id = ?"
      )
      .bind(
        merged.customerName,
        merged.phone,
        merged.shippingAddress || "",
        merged.setId,
        merged.setName,
        merged.shape,
        merged.size,
        merged.price,
        merged.notes || "",
        merged.status,
        merged.userId || null,
        id
      )
      .run();
    return merged;
  }

  const db = ensureLocalDb();
  const index = db.orders.findIndex((o) => o.id === id);
  if (index === -1) return null;
  db.orders[index] = { ...db.orders[index], ...updates };
  saveLocalDb(db);
  return db.orders[index];
}

export async function deleteOrder(id: string): Promise<boolean> {
  const d1 = await getD1();
  if (d1) {
    const res = await d1.prepare("DELETE FROM orders WHERE id = ?").bind(id).run();
    return (res.meta?.changes ?? 0) > 0;
  }

  const db = ensureLocalDb();
  const initialLen = db.orders.length;
  db.orders = db.orders.filter((o) => o.id !== id);
  if (db.orders.length !== initialLen) {
    saveLocalDb(db);
    return true;
  }
  return false;
}
