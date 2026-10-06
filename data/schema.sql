-- D1 Schema for Aureva by Che

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  createdAt TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  passwordHash TEXT NOT NULL,
  salt TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  createdAt TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL,
  userId TEXT
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  createdAt TEXT NOT NULL,
  customerName TEXT NOT NULL,
  phone TEXT NOT NULL,
  shippingAddress TEXT,
  setId TEXT NOT NULL,
  setName TEXT NOT NULL,
  shape TEXT NOT NULL,
  size TEXT NOT NULL,
  price TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL,
  userId TEXT
);

CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  icon TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  price TEXT NOT NULL,
  duration TEXT NOT NULL,
  desc TEXT NOT NULL,
  highlight TEXT NOT NULL
);
