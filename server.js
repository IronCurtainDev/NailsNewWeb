/**
 * Auréva Nails - Standalone Node.js Backend Server
 * 
 * Can be run independently via: node server.js
 * Port: 5000 (default)
 * 
 * Endpoints:
 * - GET  /api/bookings - Get all appointment bookings
 * - POST /api/bookings - Create new appointment booking
 * - GET  /api/orders   - Get all press-on nail orders
 * - POST /api/orders   - Create new press-on nail order
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const PORT = process.env.PORT || 5000;
const DATA_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

function ensureDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const initialData = { bookings: [], orders: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
    return initialData;
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
  } catch (e) {
    return { bookings: [], orders: [] };
  }
}

function saveDb(data) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Handle CORS Preflight
  if (method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    });
    return res.end();
  }

  // ------------------------------------
  // BOOKINGS ROUTE
  // ------------------------------------
  if (pathname === "/api/bookings") {
    const db = ensureDb();

    if (method === "GET") {
      const status = parsedUrl.query.status;
      let list = db.bookings || [];
      if (status && status !== "all") {
        list = list.filter((b) => b.status === status);
      }
      return sendJson(res, 200, { success: true, count: list.length, data: list });
    }

    if (method === "POST") {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => {
        try {
          const payload = JSON.parse(body);
          if (!payload.name || !payload.phone || !payload.service || !payload.date || !payload.time) {
            return sendJson(res, 400, { success: false, error: "Missing required fields" });
          }
          const newBooking = {
            id: `bk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            createdAt: new Date().toISOString(),
            name: payload.name.trim(),
            phone: payload.phone.trim(),
            service: payload.service,
            date: payload.date,
            time: payload.time,
            notes: payload.notes || "",
            status: "pending",
          };
          db.bookings.unshift(newBooking);
          saveDb(db);
          return sendJson(res, 201, { success: true, message: "Booking created", data: newBooking });
        } catch (e) {
          return sendJson(res, 400, { success: false, error: "Invalid JSON" });
        }
      });
      return;
    }
  }

  // ------------------------------------
  // ORDERS ROUTE
  // ------------------------------------
  if (pathname === "/api/orders") {
    const db = ensureDb();

    if (method === "GET") {
      const status = parsedUrl.query.status;
      let list = db.orders || [];
      if (status && status !== "all") {
        list = list.filter((o) => o.status === status);
      }
      return sendJson(res, 200, { success: true, count: list.length, data: list });
    }

    if (method === "POST") {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => {
        try {
          const payload = JSON.parse(body);
          if (!payload.customerName || !payload.phone || !payload.setName || !payload.size || !payload.price) {
            return sendJson(res, 400, { success: false, error: "Missing required fields" });
          }
          const newOrder = {
            id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            createdAt: new Date().toISOString(),
            customerName: payload.customerName.trim(),
            phone: payload.phone.trim(),
            shippingAddress: payload.shippingAddress || "",
            setId: payload.setId || "custom",
            setName: payload.setName,
            shape: payload.shape || "Custom",
            size: payload.size,
            price: payload.price,
            notes: payload.notes || "",
            status: "new",
          };
          db.orders.unshift(newOrder);
          saveDb(db);
          return sendJson(res, 201, { success: true, message: "Order created", data: newOrder });
        } catch (e) {
          return sendJson(res, 400, { success: false, error: "Invalid JSON" });
        }
      });
      return;
    }
  }

  // 404 Not Found
  sendJson(res, 404, { success: false, error: "Endpoint not found" });
});

server.listen(PORT, () => {
  console.log(`[Auréva Nails Backend] Running on http://localhost:${PORT}`);
  console.log(`- Database file: ${DB_FILE}`);
  console.log(`- GET/POST /api/bookings`);
  console.log(`- GET/POST /api/orders`);
});
