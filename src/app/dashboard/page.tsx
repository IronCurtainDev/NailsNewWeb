"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ============================================================
// TYPES
// ============================================================

interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  createdAt: string;
}

interface Booking {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  notes?: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
}

interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  phone: string;
  shippingAddress?: string;
  setName: string;
  shape: string;
  size: string;
  price: string;
  notes?: string;
  status: "new" | "processing" | "shipped" | "completed" | "cancelled";
}

// ============================================================
// HELPERS
// ============================================================

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function BookingStatusBadge({ status }: { status: Booking["status"] }) {
  const configs: Record<Booking["status"], { bg: string; color: string; label: string }> = {
    pending:   { bg: "rgba(201,168,76,0.15)",  color: "#E8D28A",  label: "⏳ Pending" },
    confirmed: { bg: "rgba(100,200,100,0.12)", color: "#90E0A0",  label: "✓ Confirmed" },
    cancelled: { bg: "rgba(212,100,80,0.12)",  color: "#F4A49A",  label: "✕ Cancelled" },
    completed: { bg: "rgba(120,120,200,0.15)", color: "#B0B0F0",  label: "★ Completed" },
  };
  const c = configs[status];
  return (
    <span className="font-dm" style={{
      display: "inline-block", padding: "4px 12px", borderRadius: "20px",
      background: c.bg, color: c.color, fontSize: "11px",
      fontWeight: 600, letterSpacing: "0.06em",
    }}>
      {c.label}
    </span>
  );
}

function OrderStatusBadge({ status }: { status: Order["status"] }) {
  const configs: Record<Order["status"], { bg: string; color: string; label: string }> = {
    new:        { bg: "rgba(201,168,76,0.15)",  color: "#E8D28A",  label: "✦ New" },
    processing: { bg: "rgba(100,160,220,0.15)", color: "#90C4E8",  label: "⚙ Processing" },
    shipped:    { bg: "rgba(100,200,170,0.15)", color: "#80E0C0",  label: "📦 Shipped" },
    completed:  { bg: "rgba(120,120,200,0.15)", color: "#B0B0F0",  label: "★ Completed" },
    cancelled:  { bg: "rgba(212,100,80,0.12)",  color: "#F4A49A",  label: "✕ Cancelled" },
  };
  const c = configs[status];
  return (
    <span className="font-dm" style={{
      display: "inline-block", padding: "4px 12px", borderRadius: "20px",
      background: c.bg, color: c.color, fontSize: "11px",
      fontWeight: 600, letterSpacing: "0.06em",
    }}>
      {c.label}
    </span>
  );
}

// ============================================================
// DASHBOARD PAGE
// ============================================================

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "bookings" | "orders" | "profile">("overview");

  // Profile edit state
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem("aureva_token");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        localStorage.removeItem("aureva_token");
        localStorage.removeItem("aureva_user");
        router.push("/login");
        return;
      }
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setBookings(data.bookings || []);
        setOrders(data.orders || []);
        setEditName(data.user.name);
        setEditPhone(data.user.phone);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = () => {
    localStorage.removeItem("aureva_token");
    localStorage.removeItem("aureva_user");
    router.push("/");
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("aureva_token");
    if (!token) return;
    setProfileSaving(true);
    setProfileMsg("");
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: editName, phone: editPhone }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem("aureva_user", JSON.stringify(data.user));
        setProfileMsg("✓ Profile updated successfully!");
        setTimeout(() => setProfileMsg(""), 3000);
      }
    } catch {
      setProfileMsg("Failed to update profile.");
    } finally {
      setProfileSaving(false);
    }
  };

  // ── Styles ──
  const cardStyle: React.CSSProperties = {
    background: "rgba(30,30,28,0.8)",
    border: "1px solid rgba(201,168,76,0.2)",
    borderRadius: "16px",
    padding: "28px",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "13px 16px", borderRadius: "10px",
    background: "rgba(250,248,245,0.05)", border: "1px solid rgba(201,168,76,0.2)",
    color: "var(--ivory)", fontSize: "14px", fontFamily: "DM Sans, sans-serif",
    outline: "none", transition: "border-color 0.2s",
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--noir)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "56px", height: "56px", borderRadius: "50%",
            border: "2px solid rgba(201,168,76,0.3)", borderTopColor: "var(--gold)",
            margin: "0 auto 16px", animation: "spin 1s linear infinite",
          }} />
          <p className="font-dm" style={{ color: "rgba(250,248,245,0.5)", fontSize: "13px" }}>Loading your dashboard…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const statCards = [
    { label: "Total Bookings", value: bookings.length, icon: "📅", color: "#E8D28A" },
    { label: "Active Bookings", value: bookings.filter(b => b.status === "pending" || b.status === "confirmed").length, icon: "✦", color: "#C9A84C" },
    { label: "Orders Placed", value: orders.length, icon: "📦", color: "#90C4E8" },
    { label: "Member Since", value: user ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "—", icon: "♡", color: "#F4A49A" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--noir)", color: "var(--ivory)" }}>

      {/* Background gradient */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, background: "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(201,168,76,0.06) 0%, transparent 60%)" }} />

      {/* ── TOP NAV ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(17,17,16,0.95)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(201,168,76,0.15)",
        padding: "0 32px",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "50%", border: "1px solid rgba(201,168,76,0.4)", background: "white", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: "2px" }}>
              <Image src="/logo.png" alt="Auréva" width={34} height={34} className="object-contain" />
            </div>
            <span className="font-display" style={{ fontSize: "17px", color: "var(--ivory)", letterSpacing: "-0.01em" }}>AURÉVA NAILS</span>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span className="font-dm" style={{ fontSize: "13px", color: "rgba(250,248,245,0.5)" }}>
              Hello, <span style={{ color: "var(--gold)" }}>{user?.name?.split(" ")[0]}</span>
            </span>
            <Link href="/#booking" style={{
              padding: "8px 18px", borderRadius: "8px",
              background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.3)",
              color: "var(--gold)", textDecoration: "none",
              fontSize: "12px", fontFamily: "DM Sans, sans-serif", fontWeight: 500, letterSpacing: "0.1em",
            }}>
              + Book Now
            </Link>
            <button
              id="dashboard-logout"
              onClick={handleLogout}
              style={{
                padding: "8px 16px", borderRadius: "8px",
                background: "rgba(212,100,80,0.1)", border: "1px solid rgba(212,100,80,0.25)",
                color: "#F4A49A", cursor: "pointer",
                fontSize: "12px", fontFamily: "DM Sans, sans-serif", fontWeight: 500, letterSpacing: "0.08em",
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 32px", position: "relative", zIndex: 1 }}>

        {/* ── PAGE TITLE ── */}
        <div style={{ marginBottom: "36px" }}>
          <h1 className="font-display" style={{ fontSize: "36px", color: "var(--ivory)", marginBottom: "6px" }}>
            My Dashboard
          </h1>
          <p className="font-dm" style={{ fontSize: "13px", color: "rgba(250,248,245,0.4)", letterSpacing: "0.04em" }}>
            {user?.email} · Member since {user ? formatDate(user.createdAt) : ""}
          </p>
        </div>

        {/* ── STAT CARDS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "36px" }}>
          {statCards.map((s, i) => (
            <div key={i} style={{
              ...cardStyle,
              display: "flex", alignItems: "center", gap: "16px",
              background: "rgba(20,20,18,0.9)",
            }}>
              <div style={{ fontSize: "28px", width: "48px", height: "48px", borderRadius: "12px", background: "rgba(201,168,76,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {s.icon}
              </div>
              <div>
                <div className="font-display" style={{ fontSize: "26px", color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div className="font-dm" style={{ fontSize: "11px", color: "rgba(250,248,245,0.4)", letterSpacing: "0.08em", marginTop: "4px" }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── TABS ── */}
        <div style={{ display: "flex", gap: "4px", marginBottom: "28px", background: "rgba(30,30,28,0.8)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "12px", padding: "6px" }}>
          {([
            { key: "overview", label: "Overview", icon: "✦" },
            { key: "bookings", label: `Bookings (${bookings.length})`, icon: "📅" },
            { key: "orders",   label: `Orders (${orders.length})`, icon: "📦" },
            { key: "profile",  label: "Profile", icon: "👤" },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              id={`tab-${tab.key}`}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1, padding: "10px 16px", borderRadius: "8px", border: "none", cursor: "pointer",
                fontFamily: "DM Sans, sans-serif", fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em",
                transition: "all 0.2s",
                background: activeTab === tab.key ? "linear-gradient(135deg, #C9A84C 0%, #E8D28A 50%, #C9A84C 100%)" : "transparent",
                color: activeTab === tab.key ? "var(--noir)" : "rgba(250,248,245,0.4)",
                boxShadow: activeTab === tab.key ? "0 4px 12px rgba(201,168,76,0.25)" : "none",
              }}
            >
              <span style={{ marginRight: "6px" }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── TAB: OVERVIEW ── */}
        {activeTab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {/* Recent Bookings */}
            <div style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 className="font-display" style={{ fontSize: "20px", color: "var(--ivory)" }}>Recent Bookings</h2>
                <button onClick={() => setActiveTab("bookings")} className="font-dm" style={{ fontSize: "11px", color: "var(--gold)", background: "none", border: "none", cursor: "pointer", letterSpacing: "0.1em" }}>
                  View all →
                </button>
              </div>
              {bookings.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <div style={{ fontSize: "36px", marginBottom: "12px" }}>📅</div>
                  <p className="font-dm" style={{ fontSize: "13px", color: "rgba(250,248,245,0.35)" }}>No bookings yet</p>
                  <Link href="/#booking" style={{ display: "inline-block", marginTop: "12px", color: "var(--gold)", fontSize: "12px", fontFamily: "DM Sans", textDecoration: "none" }}>
                    Book your first appointment →
                  </Link>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {bookings.slice(0, 3).map((b) => (
                    <div key={b.id} style={{ background: "rgba(250,248,245,0.03)", borderRadius: "10px", padding: "14px", border: "1px solid rgba(201,168,76,0.1)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <div className="font-dm" style={{ fontSize: "13px", fontWeight: 600, color: "var(--ivory)" }}>{b.service}</div>
                          <div className="font-dm" style={{ fontSize: "11px", color: "rgba(250,248,245,0.4)", marginTop: "3px" }}>{b.date} · {b.time}</div>
                        </div>
                        <BookingStatusBadge status={b.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Orders */}
            <div style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 className="font-display" style={{ fontSize: "20px", color: "var(--ivory)" }}>Recent Orders</h2>
                <button onClick={() => setActiveTab("orders")} className="font-dm" style={{ fontSize: "11px", color: "var(--gold)", background: "none", border: "none", cursor: "pointer", letterSpacing: "0.1em" }}>
                  View all →
                </button>
              </div>
              {orders.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <div style={{ fontSize: "36px", marginBottom: "12px" }}>💅</div>
                  <p className="font-dm" style={{ fontSize: "13px", color: "rgba(250,248,245,0.35)" }}>No orders yet</p>
                  <Link href="/#press-ons" style={{ display: "inline-block", marginTop: "12px", color: "var(--gold)", fontSize: "12px", fontFamily: "DM Sans", textDecoration: "none" }}>
                    Shop press-on sets →
                  </Link>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {orders.slice(0, 3).map((o) => (
                    <div key={o.id} style={{ background: "rgba(250,248,245,0.03)", borderRadius: "10px", padding: "14px", border: "1px solid rgba(201,168,76,0.1)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <div className="font-dm" style={{ fontSize: "13px", fontWeight: 600, color: "var(--ivory)" }}>{o.setName}</div>
                          <div className="font-dm" style={{ fontSize: "11px", color: "rgba(250,248,245,0.4)", marginTop: "3px" }}>{o.price} · Size {o.size}</div>
                        </div>
                        <OrderStatusBadge status={o.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB: BOOKINGS ── */}
        {activeTab === "bookings" && (
          <div style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 className="font-display" style={{ fontSize: "24px", color: "var(--ivory)" }}>My Appointments</h2>
              <Link href="/#booking" style={{
                padding: "10px 20px", borderRadius: "8px",
                background: "linear-gradient(135deg, #C9A84C, #E8D28A, #C9A84C)",
                color: "var(--noir)", textDecoration: "none",
                fontSize: "12px", fontFamily: "DM Sans, sans-serif", fontWeight: 600, letterSpacing: "0.1em",
              }}>
                + New Booking
              </Link>
            </div>

            {bookings.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <div style={{ fontSize: "56px", marginBottom: "16px" }}>📅</div>
                <p className="font-display" style={{ fontSize: "22px", color: "rgba(250,248,245,0.5)", marginBottom: "8px" }}>No appointments yet</p>
                <p className="font-dm" style={{ fontSize: "13px", color: "rgba(250,248,245,0.3)" }}>Book your first nail appointment with Che</p>
                <Link href="/#booking" style={{ display: "inline-block", marginTop: "20px", padding: "12px 28px", background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "8px", color: "var(--gold)", textDecoration: "none", fontSize: "13px", fontFamily: "DM Sans" }}>
                  Book an Appointment →
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {bookings.map((b) => (
                  <div key={b.id} style={{
                    background: "rgba(250,248,245,0.03)", border: "1px solid rgba(201,168,76,0.12)",
                    borderRadius: "12px", padding: "20px 24px",
                    display: "grid", gridTemplateColumns: "1fr auto",
                    gap: "16px", alignItems: "start",
                  }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                        <span className="font-display" style={{ fontSize: "18px", color: "var(--ivory)" }}>{b.service}</span>
                        <BookingStatusBadge status={b.status} />
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                        <div className="font-dm" style={{ fontSize: "12px", color: "rgba(250,248,245,0.45)" }}>
                          <span style={{ color: "var(--gold)", marginRight: "6px" }}>📅</span> {b.date}
                        </div>
                        <div className="font-dm" style={{ fontSize: "12px", color: "rgba(250,248,245,0.45)" }}>
                          <span style={{ color: "var(--gold)", marginRight: "6px" }}>⏰</span> {b.time}
                        </div>
                        {b.notes && (
                          <div className="font-dm" style={{ fontSize: "12px", color: "rgba(250,248,245,0.35)", fontStyle: "italic" }}>
                            &ldquo;{b.notes}&rdquo;
                          </div>
                        )}
                      </div>
                      <div className="font-dm" style={{ fontSize: "10px", color: "rgba(250,248,245,0.2)", marginTop: "8px", letterSpacing: "0.06em" }}>
                        ID: {b.id} · Booked {formatDate(b.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB: ORDERS ── */}
        {activeTab === "orders" && (
          <div style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 className="font-display" style={{ fontSize: "24px", color: "var(--ivory)" }}>My Press-On Orders</h2>
              <Link href="/#press-ons" style={{
                padding: "10px 20px", borderRadius: "8px",
                background: "linear-gradient(135deg, #C9A84C, #E8D28A, #C9A84C)",
                color: "var(--noir)", textDecoration: "none",
                fontSize: "12px", fontFamily: "DM Sans, sans-serif", fontWeight: 600, letterSpacing: "0.1em",
              }}>
                + Order a Set
              </Link>
            </div>

            {orders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <div style={{ fontSize: "56px", marginBottom: "16px" }}>💅</div>
                <p className="font-display" style={{ fontSize: "22px", color: "rgba(250,248,245,0.5)", marginBottom: "8px" }}>No orders yet</p>
                <p className="font-dm" style={{ fontSize: "13px", color: "rgba(250,248,245,0.3)" }}>Browse our handcrafted press-on nail sets</p>
                <Link href="/#press-ons" style={{ display: "inline-block", marginTop: "20px", padding: "12px 28px", background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "8px", color: "var(--gold)", textDecoration: "none", fontSize: "13px", fontFamily: "DM Sans" }}>
                  Shop Press-Ons →
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {orders.map((o) => (
                  <div key={o.id} style={{
                    background: "rgba(250,248,245,0.03)", border: "1px solid rgba(201,168,76,0.12)",
                    borderRadius: "12px", padding: "20px 24px",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
                          <span className="font-display" style={{ fontSize: "18px", color: "var(--ivory)" }}>{o.setName}</span>
                          <OrderStatusBadge status={o.status} />
                        </div>
                        <span className="font-dm" style={{ fontSize: "20px", color: "var(--gold-light)", fontWeight: 600 }}>{o.price}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                      <div className="font-dm" style={{ fontSize: "12px", color: "rgba(250,248,245,0.45)" }}>
                        <span style={{ color: "var(--gold)", marginRight: "6px" }}>✦</span> Shape: {o.shape}
                      </div>
                      <div className="font-dm" style={{ fontSize: "12px", color: "rgba(250,248,245,0.45)" }}>
                        <span style={{ color: "var(--gold)", marginRight: "6px" }}>📐</span> Size: {o.size}
                      </div>
                      {o.shippingAddress && (
                        <div className="font-dm" style={{ fontSize: "12px", color: "rgba(250,248,245,0.45)" }}>
                          <span style={{ color: "var(--gold)", marginRight: "6px" }}>📍</span> {o.shippingAddress}
                        </div>
                      )}
                    </div>
                    {o.notes && (
                      <div className="font-dm" style={{ fontSize: "12px", color: "rgba(250,248,245,0.3)", fontStyle: "italic", marginTop: "10px" }}>
                        &ldquo;{o.notes}&rdquo;
                      </div>
                    )}
                    <div className="font-dm" style={{ fontSize: "10px", color: "rgba(250,248,245,0.2)", marginTop: "10px", letterSpacing: "0.06em" }}>
                      ID: {o.id} · Ordered {formatDate(o.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB: PROFILE ── */}
        {activeTab === "profile" && (
          <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: "20px" }}>
            {/* Profile card */}
            <div style={{ ...cardStyle, textAlign: "center" }}>
              <div style={{
                width: "80px", height: "80px", borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(201,168,76,0.3) 0%, rgba(201,168,76,0.08) 100%)",
                border: "2px solid rgba(201,168,76,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 16px", fontSize: "32px",
              }}>
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <h3 className="font-display" style={{ fontSize: "22px", color: "var(--ivory)", marginBottom: "4px" }}>{user?.name}</h3>
              <p className="font-dm" style={{ fontSize: "13px", color: "rgba(250,248,245,0.4)", marginBottom: "4px" }}>{user?.email}</p>
              <p className="font-dm" style={{ fontSize: "13px", color: "rgba(250,248,245,0.4)", marginBottom: "20px" }}>{user?.phone}</p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
                <div style={{ background: "rgba(201,168,76,0.08)", borderRadius: "10px", padding: "14px" }}>
                  <div className="font-display" style={{ fontSize: "24px", color: "var(--gold)" }}>{bookings.length}</div>
                  <div className="font-dm" style={{ fontSize: "10px", color: "rgba(250,248,245,0.4)", letterSpacing: "0.08em" }}>BOOKINGS</div>
                </div>
                <div style={{ background: "rgba(144,196,232,0.08)", borderRadius: "10px", padding: "14px" }}>
                  <div className="font-display" style={{ fontSize: "24px", color: "#90C4E8" }}>{orders.length}</div>
                  <div className="font-dm" style={{ fontSize: "10px", color: "rgba(250,248,245,0.4)", letterSpacing: "0.08em" }}>ORDERS</div>
                </div>
              </div>

              <p className="font-dm" style={{ fontSize: "11px", color: "rgba(250,248,245,0.25)", letterSpacing: "0.06em" }}>
                Member since {user ? formatDate(user.createdAt) : ""}
              </p>
            </div>

            {/* Edit form */}
            <div style={cardStyle}>
              <h2 className="font-display" style={{ fontSize: "22px", color: "var(--ivory)", marginBottom: "24px" }}>Edit Profile</h2>

              {profileMsg && (
                <div style={{
                  background: profileMsg.startsWith("✓") ? "rgba(100,200,100,0.1)" : "rgba(212,100,80,0.1)",
                  border: `1px solid ${profileMsg.startsWith("✓") ? "rgba(100,200,100,0.3)" : "rgba(212,100,80,0.3)"}`,
                  borderRadius: "10px", padding: "12px 16px", marginBottom: "20px",
                }}>
                  <span className="font-dm" style={{ fontSize: "13px", color: profileMsg.startsWith("✓") ? "#90E0A0" : "#F4A49A" }}>{profileMsg}</span>
                </div>
              )}

              <form onSubmit={handleProfileSave} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                  <label className="font-dm" style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(250,248,245,0.4)", display: "block", marginBottom: "8px" }}>
                    Full Name
                  </label>
                  <input
                    id="profile-name"
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.6)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.2)")}
                  />
                </div>

                <div>
                  <label className="font-dm" style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(250,248,245,0.4)", display: "block", marginBottom: "8px" }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    style={{ ...inputStyle, opacity: 0.4, cursor: "not-allowed" }}
                  />
                  <p className="font-dm" style={{ fontSize: "11px", color: "rgba(250,248,245,0.3)", marginTop: "6px" }}>Email cannot be changed.</p>
                </div>

                <div>
                  <label className="font-dm" style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(250,248,245,0.4)", display: "block", marginBottom: "8px" }}>
                    WhatsApp / Phone
                  </label>
                  <input
                    id="profile-phone"
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.6)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.2)")}
                  />
                </div>

                <button
                  id="profile-save"
                  type="submit"
                  disabled={profileSaving}
                  style={{
                    padding: "14px 32px",
                    background: profileSaving ? "rgba(201,168,76,0.4)" : "linear-gradient(135deg, #C9A84C 0%, #E8D28A 50%, #C9A84C 100%)",
                    border: "none", borderRadius: "10px",
                    color: "var(--noir)", fontFamily: "DM Sans, sans-serif",
                    fontSize: "12px", fontWeight: 600, letterSpacing: "0.14em",
                    textTransform: "uppercase", cursor: profileSaving ? "not-allowed" : "pointer",
                    alignSelf: "flex-start",
                    boxShadow: profileSaving ? "none" : "0 6px 20px rgba(201,168,76,0.25)",
                    transition: "all 0.2s",
                  }}
                >
                  {profileSaving ? "Saving..." : "Save Changes ✦"}
                </button>
              </form>

              <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px solid rgba(201,168,76,0.12)" }}>
                <h3 className="font-dm" style={{ fontSize: "13px", color: "rgba(250,248,245,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>
                  Quick Actions
                </h3>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <Link href="/#booking" style={{
                    padding: "10px 20px", borderRadius: "8px",
                    background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)",
                    color: "var(--gold)", textDecoration: "none",
                    fontSize: "12px", fontFamily: "DM Sans", fontWeight: 500,
                  }}>
                    📅 Book Appointment
                  </Link>
                  <Link href="/#press-ons" style={{
                    padding: "10px 20px", borderRadius: "8px",
                    background: "rgba(144,196,232,0.08)", border: "1px solid rgba(144,196,232,0.2)",
                    color: "#90C4E8", textDecoration: "none",
                    fontSize: "12px", fontFamily: "DM Sans", fontWeight: 500,
                  }}>
                    💅 Shop Press-Ons
                  </Link>
                  <button onClick={handleLogout} style={{
                    padding: "10px 20px", borderRadius: "8px",
                    background: "rgba(212,100,80,0.08)", border: "1px solid rgba(212,100,80,0.2)",
                    color: "#F4A49A", cursor: "pointer",
                    fontSize: "12px", fontFamily: "DM Sans", fontWeight: 500,
                  }}>
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
