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
// FILE HELPERS
// ============================================================

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

function ensureDb(): DatabaseSchema {
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
          price: "₹1,899",
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
    // Ensure users array exists for older dbs
    if (!parsed.users) parsed.users = [];
    return parsed;
  } catch (error) {
    console.error("Error reading database file, resetting:", error);
    const fallback: DatabaseSchema = { users: [], bookings: [], orders: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(fallback, null, 2), "utf-8");
    return fallback;
  }
}

function saveDb(data: DatabaseSchema): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// ============================================================
// PASSWORD UTILITIES
// ============================================================

export function hashPassword(password: string, salt: string): string {
  return crypto
    .createHash("sha256")
    .update(salt + password)
    .digest("hex");
}

export function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

// ============================================================
// SESSION TOKEN UTILITIES
// ============================================================

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
// USER CRUD
// ============================================================

export function getAllUsers(): User[] {
  return ensureDb().users;
}

export function getUserByEmail(email: string): User | null {
  const db = ensureDb();
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export function getUserById(id: string): User | null {
  const db = ensureDb();
  return db.users.find((u) => u.id === id) || null;
}

export function createUser(payload: { email: string; password: string; name: string; phone: string }): User {
  const db = ensureDb();
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
  db.users.push(newUser);
  saveDb(db);
  return newUser;
}

export function updateUser(id: string, updates: Partial<Pick<User, "name" | "phone" | "email">>): User | null {
  const db = ensureDb();
  const index = db.users.findIndex((u) => u.id === id);
  if (index === -1) return null;
  db.users[index] = { ...db.users[index], ...updates };
  saveDb(db);
  return db.users[index];
}

// ============================================================
// BOOKINGS CRUD
// ============================================================

export function getAllBookings(): Booking[] {
  const db = ensureDb();
  return db.bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getBookingsByUserId(userId: string): Booking[] {
  const db = ensureDb();
  return db.bookings
    .filter((b) => b.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function createBooking(
  payload: Omit<Booking, "id" | "createdAt" | "status"> & { status?: Booking["status"] }
): Booking {
  const db = ensureDb();
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
    userId: payload.userId,
  };

  db.bookings.unshift(newBooking);
  saveDb(db);
  return newBooking;
}

export function updateBooking(id: string, updates: Partial<Booking>): Booking | null {
  const db = ensureDb();
  const index = db.bookings.findIndex((b) => b.id === id);
  if (index === -1) return null;

  db.bookings[index] = { ...db.bookings[index], ...updates };
  saveDb(db);
  return db.bookings[index];
}

export function deleteBooking(id: string): boolean {
  const db = ensureDb();
  const initialLen = db.bookings.length;
  db.bookings = db.bookings.filter((b) => b.id !== id);
  if (db.bookings.length !== initialLen) {
    saveDb(db);
    return true;
  }
  return false;
}

// ============================================================
// PRESS-ON ORDERS CRUD
// ============================================================

export function getAllOrders(): PressOnOrder[] {
  const db = ensureDb();
  return db.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getOrdersByUserId(userId: string): PressOnOrder[] {
  const db = ensureDb();
  return db.orders
    .filter((o) => o.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function createOrder(
  payload: Omit<PressOnOrder, "id" | "createdAt" | "status"> & { status?: PressOnOrder["status"] }
): PressOnOrder {
  const db = ensureDb();
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
    userId: payload.userId,
  };

  db.orders.unshift(newOrder);
  saveDb(db);
  return newOrder;
}

export function updateOrder(id: string, updates: Partial<PressOnOrder>): PressOnOrder | null {
  const db = ensureDb();
  const index = db.orders.findIndex((o) => o.id === id);
  if (index === -1) return null;

  db.orders[index] = { ...db.orders[index], ...updates };
  saveDb(db);
  return db.orders[index];
}

export function deleteOrder(id: string): boolean {
  const db = ensureDb();
  const initialLen = db.orders.length;
  db.orders = db.orders.filter((o) => o.id !== id);
  if (db.orders.length !== initialLen) {
    saveDb(db);
    return true;
  }
  return false;
}
