"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// ==========================================
// DATA
// ==========================================

const SERVICES = [
  {
    id: "s1",
    icon: "✦",
    title: "Gel Manicure",
    subtitle: "Gel manicure",
    price: "Rs.3500",
    duration: "90 mins",
    desc: "Sterile dry manicure, deep cuticle work, strengthening BIAB rubber base, and lasting chip-free colour.",
    highlight: "Lasts 3–4 weeks",
  },
  {
    id: "s2",
    icon: "✧",
    title: "Gel Extensions",
    subtitle: "Soft Gel / Gel-X Full Set",
    price: "Rs.5000",
    duration: "120 mins",
    desc: "Custom-fitted soft gel tips cured with LED builder gel. Lightweight, natural flex, zero damage.",
    highlight: "No drilling needed",
  },
  {
    id: "s4",
    icon: "❋",
    title: "Bridal Suite",
    subtitle: "Bridal nails",
    price: "Rs.7500",
    duration: "150 mins",
    desc: "Full bridal consultation, custom sizing, crystal cluster embellishments, 24K chrome filigree, and press-on trial set.",
    highlight: "Includes trial set",
  },
  {
    id: "s5",
    icon: "✦",
    title: "Press-On Nails",
    subtitle: "Ready-to-Wear & Custom Sets",
    price: "From Rs.3000",
    duration: "Instant Wear",
    desc: "Salon-quality reusable gel press-on nails. Handcrafted by Che with professional gel, complete with prep kit, buffer, and premium adhesive.",
    highlight: "Reusable & Ready to Buy",
  },
];

const PRESS_ON_SETS = [
  {
    id: "p1",
    title: "Blush Pearl & 3D Floral",
    tag: "Best Seller",
    price: "Rs.3000",
    priceUSD: "$10",
    shape: "Almond",
    length: "Medium",
    src: "/nails.png",
    desc: "Hand-sculpted 3D blossom petals, luminous freshwater pearl charms, and sheer rose-milk gel base.",
    features: ["Hand-sculpted 3D florals", "Freshwater pearl charms", "Reinforced gel overlay"],
  },
  {
    id: "p2",
    title: "Champagne Velvet Cat-Eye",
    tag: "Trending",
    price: "Rs.4000",
    priceUSD: "$14",
    shape: "Oval",
    length: "Medium",
    src: "/cat eye.png",
    desc: "Multi-angle magnetic velvet shimmer with a deep champagne gold reflection and mirror glass topcoat.",
    features: ["Magnetic velvet effect", "Champagne gold pigment", "Ultra high-gloss finish"],
  },
  {
    id: "p3",
    title: "Summer Breeze Baby Blue",
    tag: "New Drop",
    price: "Rs.3500",
    priceUSD: "$12",
    shape: "Squoval",
    length: "Short / Active",
    src: "/summernails.png",
    desc: "Clean French tip silhouette with micro polka dots, pastel sky blue, and chip-resistant seal.",
    features: ["Pastel French tips", "Hand-painted micro dots", "Short natural length"],
  },
  {
    id: "p4",
    title: "Wild Caramel Leopard",
    tag: "Che's Pick",
    price: "Rs.3500",
    priceUSD: "$12",
    shape: "Almond",
    length: "Long",
    src: "/lepord.png",
    desc: "Intricately hand-painted leopard spots over warm honey-caramel glaze with velvety matte or glass finish.",
    features: ["Bespoke animal print", "Caramel amber base", "Wear matte or glossy"],
  },
];

const SIZING_DATA = [
  { size: "XS", thumb: "14mm", index: "10mm", middle: "11mm", ring: "10mm", pinky: "8mm", fit: "Petite nail beds" },
  { size: "S", thumb: "15mm", index: "11mm", middle: "12mm", ring: "11mm", pinky: "9mm", fit: "Narrow to average" },
  { size: "M", thumb: "16mm", index: "12mm", middle: "13mm", ring: "12mm", pinky: "10mm", fit: "Most popular fit" },
  { size: "L", thumb: "17mm", index: "13mm", middle: "14mm", ring: "13mm", pinky: "11mm", fit: "Wide nail beds" },
  { size: "Custom", thumb: "Custom", index: "Custom", middle: "Custom", ring: "Custom", pinky: "Custom", fit: "Send exact mm or coin photo" },
];

const GALLERY_ITEMS = [
  {
    id: "g1",
    src: "/nails.png",
    alt: "Floral Pink Nails with Flowers",
    label: "3D arts",
    category: "Gel Extensions",
    tall: true,
  },
  {
    id: "g2",
    src: "/cat eye.png",
    alt: "Champagne Glitter Almond Nails",
    label: "Floral Romance",
    category: "Nail Art",
    tall: false,
  },
  {
    id: "g3",
    src: "/summernails.png",
    alt: "Blue Polka Dot Almond Nails",
    label: "Polka Dot Blue",
    category: "Gel Manicure",
    tall: false,
  },
  {
    id: "g4",
    src: "/lepord.png",
    alt: "Leopard Print Caramel Nails",
    label: "Leopard Luxe",
    category: "Nail Art",
    tall: false,
  },
  {
    id: "g5",
    src: "/nail-new.jpg",
    alt: "3D arts with Almond Nails",
    label: "3D Tropical arts",
    category: "Gel Extensions",
    tall: false,
  },
  {
    id: "g6",
    src: "/cat eye.png",
    alt: "Custom Bridal Nail Art",
    label: "Bridal Set",
    category: "Bridal Suite",
    tall: false,
  },
];

const TESTIMONIALS = [
  {
    id: "t1",
    name: "Priya M.",
    location: "Mumbai",
    stars: 5,
    text: "Che is genuinely the most talented nail artist I've found. My bridal set had everyone asking where I got them done — absolute perfection.",
    service: "Bridal Suite",
  },
  {
    id: "t2",
    name: "Ananya S.",
    location: "Bangalore",
    stars: 5,
    text: "The leopard print design she created was SO precise — I couldn't believe it was hand-painted. Lasted over 3 weeks with zero chips.",
    service: "Bespoke Nail Art",
  },
  {
    id: "t3",
    name: "Riya K.",
    location: "Delhi",
    stars: 5,
    text: "My gel extensions look and feel completely natural. The BIAB base is revolutionary — my natural nails are actually stronger underneath.",
    service: "Gel Extensions",
  },
  {
    id: "t4",
    name: "Tara N.",
    location: "Pune",
    stars: 5,
    text: "The floral art she did for my birthday was stunning — soft pink roses with tiny gems. I was obsessed. Already booked my next appointment!",
    service: "Bespoke Nail Art",
  },
];

const TIMES = ["10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"];

const MARQUEE_ITEMS = [
  "Gel Manicures",
  "★",
  "Gel Extensions",
  "★",
  "Bespoke Nail Art",
  "★",
  "Bridal Nails",
  "★",
  "Chrome & Foils",
  "★",
  "3D Embellishments",
  "★",
  "Russian Manicure",
  "★",
  "Press-On Sets",
  "★",
];

// ==========================================
// COMPONENT
// ==========================================

export default function Home() {
  // Nav
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Auth
  const [authUser, setAuthUser] = useState<{ id: string; name: string; email: string; phone: string } | null>(null);

  // Gallery filter
  const [galleryFilter, setGalleryFilter] = useState("All");

  // Dynamic Services
  const [servicesData, setServicesData] = useState(SERVICES);

  // Booking form
  const [bookingService, setBookingService] = useState(SERVICES[0].title);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState(TIMES[0]);
  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingMsg, setBookingMsg] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Press-On Shop
  const [selectedSet, setSelectedSet] = useState<(typeof PRESS_ON_SETS)[0] | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({
    p1: "M",
    p2: "M",
    p3: "M",
    p4: "M",
  });
  const [sizingGuideOpen, setSizingGuideOpen] = useState(false);

  // Press-on order form state
  const [orderCustomerName, setOrderCustomerName] = useState("");
  const [orderPhone, setOrderPhone] = useState("");
  const [orderAddress, setOrderAddress] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSuccessId, setOrderSuccessId] = useState<string | null>(null);

  // Toast
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3800);
  };

  // Load auth user and services
  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          setServicesData(data.data);
        }
      })
      .catch((err) => console.error("Failed to fetch services:", err));

    try {
      const stored = localStorage.getItem("aureva_user");
      if (stored) {
        const user = JSON.parse(stored);
        setAuthUser(user);
        setBookingName(user.name || "");
        setBookingPhone(user.phone || "");
        setOrderCustomerName(user.name || "");
        setOrderPhone(user.phone || "");
      }
    } catch {}
  }, []);

  // Scroll detect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Booking submit to Node.js backend
  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: bookingName,
          phone: bookingPhone,
          service: bookingService,
          date: bookingDate,
          time: bookingTime,
          notes: bookingMsg,
          userId: authUser?.id,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit booking");
      }
      setBookingSuccess(true);
      showToast("Booking received! Che will confirm your appointment shortly. 💅");
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to submit booking. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  // Press-on order submit to Node.js backend
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSet) return;
    if (!orderCustomerName.trim() || !orderPhone.trim()) {
      showToast("Please enter your name and WhatsApp/Phone number.");
      return;
    }

    setOrderLoading(true);
    const size = selectedSizes[selectedSet.id] || "M";
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: orderCustomerName,
          phone: orderPhone,
          shippingAddress: orderAddress,
          setId: selectedSet.id,
          setName: selectedSet.title,
          shape: `${selectedSet.shape} · ${selectedSet.length}`,
          size: size,
          price: selectedSet.price,
          notes: orderNotes,
          userId: authUser?.id,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit order");
      }

      const orderId = data.data?.id || "ord_new";
      setOrderSuccessId(orderId);
      showToast(`Order #${orderId} saved to studio database! 💅`);

      // Open WhatsApp with pre-filled message
      const waMsg = `Hi Che! I just placed an order on your website for the "${selectedSet.title}" Press-On Set.\n\nOrder ID: ${orderId}\nSize: ${size}\nPrice: ${selectedSet.price}\nName: ${orderCustomerName}\nPhone: ${orderPhone}${orderAddress ? `\nAddress: ${orderAddress}` : ""}${orderNotes ? `\nNotes: ${orderNotes}` : ""}\n\nPlease confirm payment and delivery details!`;
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(waMsg)}`;
      setTimeout(() => {
        window.open(waUrl, "_blank");
      }, 1000);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to place order. Please try again.");
    } finally {
      setOrderLoading(false);
    }
  };

  const galleryCategories = ["All", "Gel Extensions", "Nail Art", "Gel Manicure", "Bridal Suite"];
  const filteredGallery =
    galleryFilter === "All"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((g) => g.category === galleryFilter);

  return (
    <div className="min-h-screen" style={{ background: "var(--ivory)", color: "var(--text-primary)" }}>

      {/* ──────────────────────────────────────────────────────
          TOAST NOTIFICATION
      ────────────────────────────────────────────────────── */}
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-lg fade-up"
          style={{
            background: "var(--noir)",
            color: "var(--gold-light)",
            border: "1px solid rgba(201,168,76,0.4)",
            boxShadow: "var(--shadow-dark)",
            maxWidth: "360px",
          }}
        >
          <span style={{ color: "var(--gold)", fontSize: "18px" }}>✦</span>
          <span className="font-dm text-xs" style={{ letterSpacing: "0.04em" }}>
            {toast}
          </span>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────
          1. ANNOUNCEMENT TICKER
      ────────────────────────────────────────────────────── */}
      <div
        style={{
          background: "var(--noir)",
          borderBottom: "1px solid rgba(201,168,76,0.25)",
          overflow: "hidden",
          padding: "10px 0",
        }}
      >
        <div className="marquee-track" aria-hidden="true">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              className="font-dm"
              style={{
                fontSize: "11px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: i % 2 === 1 ? "var(--gold)" : "rgba(250,248,245,0.75)",
                padding: "0 24px",
                whiteSpace: "nowrap",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────
          2. STICKY HEADER
      ────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50"
        style={{
          background: scrolled ? "rgba(250,248,245,0.97)" : "var(--ivory)",
          borderBottom: scrolled ? "1px solid var(--border-light)" : "1px solid transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          transition: "all 0.35s ease",
          boxShadow: scrolled ? "var(--shadow-soft)" : "none",
        }}
      >
        <div
          className="max-w-7xl mx-auto flex items-center justify-between"
          style={{ padding: "18px 32px" }}
        >
          {/* Logo */}
          <a href="#" className="flex items-center gap-3" style={{ textDecoration: "none" }}>
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                border: "1.5px solid var(--border-mid)",
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                padding: "3px",
              }}
            >
              <Image
                src="/logo.png"
                alt="Auréva Nails By Che"
                width={46}
                height={46}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <span
                className="font-display block"
                style={{ fontSize: "22px", color: "var(--noir)", letterSpacing: "-0.01em", lineHeight: 1.1 }}
              >
                AURÉVA NAILS
              </span>
              <span
                className="font-dm block"
                style={{ fontSize: "9px", letterSpacing: "0.32em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600 }}
              >
                BY CHE
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {[
              { label: "Services", href: "#services" },
              { label: "Press-Ons", href: "#press-ons" },
              { label: "Gallery", href: "#gallery" },
              { label: "About", href: "#about" },
              { label: "Booking", href: "#booking" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="font-dm"
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  textDecoration: "none",
                  transition: "color 0.25s ease",
                  position: "relative",
                }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--gold-dark)")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--text-muted)")}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right CTA + Social */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/aureva_nails_by_che"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 font-dm"
              style={{
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                textDecoration: "none",
                transition: "color 0.25s ease",
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--gold-dark)")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--text-muted)")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="2" y="2" width="20" height="20" rx="5"/>
                <circle cx="12" cy="12" r="5"/>
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
              </svg>
              Instagram
            </a>
            {/* Auth button removed */}
            <a
              href="#booking"
              className="btn-dark hidden sm:inline-flex"
              style={{ padding: "11px 24px", fontSize: "10px" }}
            >
              Book Now
            </a>
            {/* Mobile menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2"
              aria-label="Menu"
              style={{ color: "var(--text-primary)", background: "none", border: "none", cursor: "pointer" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <>
                    <line x1="3" y1="7" x2="21" y2="7" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="17" x2="21" y2="17" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {menuOpen && (
          <div
            style={{
              borderTop: "1px solid var(--border-light)",
              background: "var(--ivory)",
              padding: "24px 32px",
            }}
          >
            <nav className="flex flex-col gap-5">
              {[
                { label: "Services", href: "#services" },
                { label: "Press-Ons", href: "#press-ons" },
                { label: "Gallery", href: "#gallery" },
                { label: "About", href: "#about" },
                { label: "Booking", href: "#booking" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-dm"
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--text-primary)",
                    textDecoration: "none",
                  }}
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#booking"
                onClick={() => setMenuOpen(false)}
                className="btn-dark"
                style={{ padding: "13px 24px", fontSize: "10px", marginTop: "8px" }}
              >
                Book Now
              </a>
              {/* Auth button removed */}
            </nav>
          </div>
        )}
      </header>

      {/* ──────────────────────────────────────────────────────
          3. HERO SECTION
      ────────────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: "92vh",
          background: "var(--ivory)",
          display: "grid",
          gridTemplateColumns: "1fr",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decorative elements */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "-120px",
            right: "-80px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-60px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="max-w-7xl mx-auto w-full" style={{ padding: "60px 32px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "64px",
              alignItems: "center",
            }}
            className="flex flex-col lg:grid"
          >
            {/* Left: Text */}
            <div className="fade-up" style={{ animationDelay: "0.1s" }}>
              {/* Tag */}
              <div
                className="inline-flex items-center gap-2 font-dm"
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "var(--gold)",
                  border: "1px solid var(--border-mid)",
                  padding: "7px 16px",
                  borderRadius: "100px",
                  marginBottom: "28px",
                  background: "var(--gold-pale)",
                  display: "inline-flex",
                }}
              >
                <span>✦</span> Luxury Nail Artistry by Che
              </div>

              {/* Headline */}
              <h1
                className="font-display"
                style={{
                  fontSize: "clamp(52px, 7vw, 96px)",
                  fontWeight: 400,
                  lineHeight: 0.95,
                  color: "var(--noir)",
                  marginBottom: "32px",
                  letterSpacing: "-0.03em",
                }}
              >
                Your Nails,
                <br />
                <em
                  style={{
                    fontStyle: "italic",
                    background: "linear-gradient(135deg, #8B6914 0%, #C9A84C 40%, #F0D88A 65%, #B88A28 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Your Statement.
                </em>
              </h1>

              {/* Gold line */}
              <div
                style={{
                  width: "60px",
                  height: "1.5px",
                  background: "linear-gradient(90deg, var(--gold), transparent)",
                  marginBottom: "28px",
                }}
              />

              {/* Subtitle */}
              <p
                className="font-dm"
                style={{
                  fontSize: "16px",
                  fontWeight: 300,
                  color: "var(--text-muted)",
                  lineHeight: 1.75,
                  maxWidth: "440px",
                  marginBottom: "40px",
                }}
              >
                Bespoke gel nails, extensions, and hand-painted nail art crafted in a private studio setting.
                Every set is a one-of-a-kind creation tailored entirely to you.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3" style={{ marginBottom: "48px" }}>
                <a
                  href="#press-ons"
                  className="btn-gold shimmer-hover"
                  style={{ padding: "12px 24px", fontSize: "10.5px" }}
                >
                  <span>Buy Press-On Nails</span>
                  <span>✦</span>
                </a>
                <a
                  href="#booking"
                  className="btn-dark"
                  style={{ padding: "11px 20px", fontSize: "10px" }}
                >
                  Book Your Appointment
                </a>
                <a
                  href="#gallery"
                  className="btn-outline"
                  style={{ padding: "11px 20px", fontSize: "10px" }}
                >
                  View My Work
                </a>
              </div>

              {/* Social proof */}
              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <div className="stars font-dm" style={{ fontSize: "14px", marginBottom: "2px" }}>
                    ★★★★★
                  </div>
                  <div className="font-dm" style={{ fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.04em" }}>
                    5.0 · 200+ happy clients
                  </div>
                </div>
                <div style={{ width: "1px", height: "36px", background: "var(--border-light)" }} />
                <div>
                  <div
                    className="font-display"
                    style={{ fontSize: "28px", color: "var(--gold)", lineHeight: 1 }}
                  >
                    3+
                  </div>
                  <div className="font-dm" style={{ fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.04em" }}>
                    Years of expertise
                  </div>
                </div>
                <div style={{ width: "1px", height: "36px", background: "var(--border-light)" }} />
                <div>
                  <div
                    className="font-display"
                    style={{ fontSize: "28px", color: "var(--gold)", lineHeight: 1 }}
                  >
                    100%
                  </div>
                  <div className="font-dm" style={{ fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.04em" }}>
                    Custom designs
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Image Collage */}
            <div
              className="fade-up hidden lg:block"
              style={{ position: "relative", animationDelay: "0.25s" }}
            >
              {/* Main large image */}
              <div
                className="img-zoom-wrap"
                style={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  aspectRatio: "4/5",
                  position: "relative",
                  border: "2px solid white",
                  boxShadow: "var(--shadow-dark)",
                }}
              >
                <Image
                  src="/nails.png"
                  alt="nails by Auréva"
                  fill
                  sizes="(max-width: 1024px) 0px, 500px"
                  className="object-cover"
                  priority
                  style={{ borderRadius: "14px" }}
                />
                {/* Overlay card */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "20px",
                    left: "20px",
                    right: "20px",
                    background: "rgba(250,248,245,0.96)",
                    backdropFilter: "blur(12px)",
                    borderRadius: "12px",
                    padding: "16px 20px",
                    border: "1px solid var(--border-mid)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                  }}
                >
                  <div>
                    <div className="font-dm" style={{ fontSize: "9px", letterSpacing: "0.26em", textTransform: "uppercase", color: "var(--gold-dark)", fontWeight: 700, marginBottom: "4px" }}>
                      Featured Look
                    </div>
                    <div className="font-display" style={{ fontSize: "18px", color: "var(--noir)" }}>
                      Nail arts with gel extensions
                    </div>
                  </div>
                  <a
                    href="#booking"
                    className="btn-gold shimmer-hover"
                    style={{ padding: "10px 18px", fontSize: "10px", borderRadius: "8px", whiteSpace: "nowrap" }}
                  >
                    Book This
                  </a>
                </div>
              </div>

              {/* Floating secondary card — bottom left */}
              {/* <div
                className="img-zoom-wrap"
                style={{
                  position: "absolute",
                  bottom: "-40px",
                  left: "-40px",
                  width: "180px",
                  height: "180px",
                  borderRadius: "14px",
                  overflow: "hidden",
                  border: "4px solid white",
                  boxShadow: "var(--shadow-dark)",
                }} */}
              
                {/* <Image
                  src="/nail-new.jpg"
                  alt="Floral pink nail art"
                  fill
                  sizes="180px"
                  className="object-cover"
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(17,17,16,0.55), transparent)",
                  }}
                />
                <div
                  style={{ position: "absolute", bottom: "12px", left: "12px" }}
                >
                  <div className="font-dm" style={{ fontSize: "8px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold-light)", fontWeight: 700 }}>
                    Floral Art
                  </div>
                </div>
              </div> */}

              {/* Floating badge — top right */}
              <div
                className="badge-pulse"
                style={{
                  position: "absolute",
                  top: "24px",
                  right: "-20px",
                  background: "var(--noir)",
                  border: "2px solid var(--gold)",
                  borderRadius: "100px",
                  padding: "10px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span style={{ color: "var(--gold)", fontSize: "14px" }}>✦</span>
                <span className="font-dm" style={{ fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--gold-light)", fontWeight: 600, whiteSpace: "nowrap" }}>
                  Now Booking
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────
          4. SERVICES SECTION
      ────────────────────────────────────────────────────── */}
      <section
        id="services"
        style={{
          background: "var(--ivory-warm)",
          borderTop: "1px solid var(--border-light)",
          borderBottom: "1px solid var(--border-light)",
          padding: "100px 0",
        }}
      >
        <div className="max-w-7xl mx-auto" style={{ padding: "0 32px" }}>
          {/* Header */}
          <div className="text-center" style={{ marginBottom: "64px" }}>
            <div
              className="font-dm inline-block"
              style={{
                fontSize: "10px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "var(--gold)",
                fontWeight: 600,
                marginBottom: "16px",
              }}
            >
              ✦ What We Offer ✦
            </div>
            <h2
              className="font-display"
              style={{ fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 400, color: "var(--noir)", lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: "16px" }}
            >
              Nail Services
            </h2>
            <div className="divider-gold" style={{ marginBottom: "20px" }} />
            <p
              className="font-dm"
              style={{ fontSize: "15px", color: "var(--text-muted)", fontWeight: 300, maxWidth: "480px", margin: "0 auto", lineHeight: 1.75 }}
            >
              Every service is performed with premium professional products in a clean, private studio environment.
            </p>
          </div>

          {/* Services Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1px",
              background: "var(--border-light)",
              border: "1px solid var(--border-light)",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "var(--shadow-soft)",
            }}
          >
            {servicesData.map((srv, i) => (
              <div
                key={srv.id}
                className="service-card"
                style={{
                  background: i % 2 === 0 ? "#ffffff" : "var(--ivory)",
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: "var(--gold-pale)",
                    border: "1px solid var(--border-mid)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                    color: "var(--gold)",
                    marginBottom: "24px",
                  }}
                >
                  {srv.icon}
                </div>

                {/* Tag */}
                <div
                  className="font-dm"
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    color: "var(--gold-dark)",
                    fontWeight: 700,
                    marginBottom: "8px",
                  }}
                >
                  {srv.subtitle}
                </div>

                <h3
                  className="font-display"
                  style={{ fontSize: "26px", color: "var(--noir)", fontWeight: 500, marginBottom: "12px", letterSpacing: "-0.02em" }}
                >
                  {srv.title}
                </h3>
                <p
                  className="font-dm"
                  style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 300, lineHeight: 1.7, marginBottom: "24px" }}
                >
                  {srv.desc}
                </p>

                {/* Details row */}
                <div className="flex items-center justify-between" style={{ borderTop: "1px solid var(--border-light)", paddingTop: "20px", marginTop: "auto" }}>
                  <div>
                    <div className="font-display" style={{ fontSize: "24px", color: "var(--noir)", fontWeight: 600 }}>
                      {srv.price}
                    </div>
                    <div className="font-dm" style={{ fontSize: "11px", color: "var(--text-light)", letterSpacing: "0.08em" }}>
                      {srv.duration}
                    </div>
                  </div>
                  <div
                    className="font-dm"
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "var(--gold-dark)",
                      fontWeight: 700,
                      background: "var(--gold-pale)",
                      padding: "6px 12px",
                      borderRadius: "100px",
                      border: "1px solid var(--border-mid)",
                    }}
                  >
                    {srv.highlight}
                  </div>
                </div>

                {srv.id === "s5" ? (
                  <a
                    href="#press-ons"
                    className="btn-gold shimmer-hover"
                    style={{ width: "100%", marginTop: "20px", padding: "12px", fontSize: "10px", textAlign: "center" }}
                  >
                    Shop Press-On Sets ↓
                  </a>
                ) : (
                  <a
                    href="#booking"
                    className="btn-outline shimmer-hover"
                    style={{ width: "100%", marginTop: "20px", padding: "12px", fontSize: "10px", textAlign: "center" }}
                  >
                    Book This Service
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* ──────────────────────────────────────────────────
              PRESS-ON NAILS TO BUY BOUTIQUE SUBSECTION
          ────────────────────────────────────────────────── */}
          <div
            id="press-ons"
            className="scroll-mt-24"
            style={{
              marginTop: "90px",
              paddingTop: "75px",
              borderTop: "1px solid var(--border-mid)",
            }}
          >
            {/* Boutique Header */}
            <div className="text-center" style={{ marginBottom: "50px" }}>
              <div
                className="font-dm inline-flex items-center gap-2"
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "var(--gold-dark)",
                  fontWeight: 700,
                  background: "var(--gold-pale)",
                  border: "1px solid var(--border-mid)",
                  padding: "6px 16px",
                  borderRadius: "100px",
                  marginBottom: "16px",
                }}
              >
                <span>✦ Auréva Boutique</span>
                <span style={{ opacity: 0.4 }}>•</span>
                <span>Ready to Wear Sets ✦</span>
              </div>
              <h2
                className="font-display"
                style={{
                  fontSize: "clamp(34px, 4.5vw, 56px)",
                  fontWeight: 400,
                  color: "var(--noir)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  marginBottom: "16px",
                }}
              >
                Press-On Nails to Buy
              </h2>
              <div className="divider-gold" style={{ marginBottom: "20px" }} />
              <p
                className="font-dm"
                style={{
                  fontSize: "15px",
                  color: "var(--text-muted)",
                  fontWeight: 300,
                  maxWidth: "580px",
                  margin: "0 auto",
                  lineHeight: 1.75,
                }}
              >
                Salon-quality luxury delivered straight to your door. Each set is meticulously hand-painted by Che with 100% soak-off builder gel, reusable 5+ times, and custom fitted to your natural nail beds.
              </p>

              {/* Sizing & custom buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3" style={{ marginTop: "24px" }}>
                <button
                  type="button"
                  onClick={() => setSizingGuideOpen(true)}
                  className="font-dm inline-flex items-center gap-2"
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--gold-dark)",
                    background: "#ffffff",
                    border: "1px solid var(--border-mid)",
                    padding: "9px 18px",
                    borderRadius: "100px",
                    cursor: "pointer",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--gold)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-mid)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="10" rx="2" />
                    <line x1="6" y1="7" x2="6" y2="11" />
                    <line x1="10" y1="7" x2="10" y2="13" />
                    <line x1="14" y1="7" x2="14" y2="11" />
                    <line x1="18" y1="7" x2="18" y2="13" />
                  </svg>
                  Nail Sizing Chart & Guide
                </button>
                <a
                  href="https://www.instagram.com/aureva_nails_by_che"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-dm inline-flex items-center gap-2"
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    background: "transparent",
                    border: "1px solid var(--border-light)",
                    padding: "9px 18px",
                    borderRadius: "100px",
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span>Request Custom Design ↗</span>
                </a>
              </div>
            </div>

            {/* What's In The Kit Strip */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
                marginBottom: "48px",
                background: "#ffffff",
                border: "1px solid var(--border-light)",
                borderRadius: "16px",
                padding: "24px 28px",
                boxShadow: "var(--shadow-soft)",
              }}
            >
              {[
                { icon: "📦", title: "10 Custom Nails", desc: "Crafted to your exact natural nail size" },
                { icon: "💎", title: "Salon Gel Glue", desc: "Up to 3-4 weeks strong, waterproof wear" },
                { icon: "🏷️", title: "24 Reusable Tabs", desc: "Instant application & damage-free removal" },
                { icon: "🪄", title: "Full Prep Kit", desc: "Dual file, wooden cuticle pusher & prep wipes" },
              ].map((kit, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div
                    style={{
                      fontSize: "20px",
                      width: "40px",
                      height: "40px",
                      borderRadius: "10px",
                      background: "var(--gold-pale)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {kit.icon}
                  </div>
                  <div>
                    <div className="font-dm" style={{ fontSize: "13px", fontWeight: 600, color: "var(--noir)" }}>
                      {kit.title}
                    </div>
                    <div className="font-dm" style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 300, lineHeight: 1.4, marginTop: "2px" }}>
                      {kit.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Press-On Products Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "24px",
                marginBottom: "48px",
              }}
            >
              {PRESS_ON_SETS.map((set) => {
                const currentSize = selectedSizes[set.id] || "M";
                return (
                  <div
                    key={set.id}
                    className="card-luxury flex flex-col"
                    style={{
                      background: "#ffffff",
                      borderRadius: "16px",
                      overflow: "hidden",
                      border: "1px solid var(--border-mid)",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {/* Image Box */}
                    <div
                      className="img-zoom-wrap relative"
                      style={{ height: "260px", background: "var(--ivory-warm)" }}
                    >
                      <Image
                        src={set.src}
                        alt={set.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 300px"
                        style={{ objectFit: "cover" }}
                      />
                      <div className="img-overlay-gold" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 z-10 flex gap-2">
                        <span
                          className="font-dm"
                          style={{
                            fontSize: "9px",
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            color: "var(--noir)",
                            fontWeight: 700,
                            background: "rgba(255, 255, 255, 0.95)",
                            backdropFilter: "blur(4px)",
                            padding: "4px 10px",
                            borderRadius: "100px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          }}
                        >
                          {set.tag}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3 z-10">
                        <span
                          className="font-dm"
                          style={{
                            fontSize: "9px",
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: "#ffffff",
                            fontWeight: 600,
                            background: "rgba(17, 17, 16, 0.75)",
                            backdropFilter: "blur(4px)",
                            padding: "4px 10px",
                            borderRadius: "100px",
                            border: "1px solid rgba(255,255,255,0.15)",
                          }}
                        >
                          {set.shape} · {set.length}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1" style={{ padding: "24px" }}>
                      <div className="flex items-start justify-between gap-2" style={{ marginBottom: "8px" }}>
                        <h3
                          className="font-display"
                          style={{ fontSize: "22px", color: "var(--noir)", fontWeight: 500, lineHeight: 1.2 }}
                        >
                          {set.title}
                        </h3>
                      </div>

                      <p
                        className="font-dm"
                        style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 300, lineHeight: 1.6, marginBottom: "16px" }}
                      >
                        {set.desc}
                      </p>

                      {/* Features bullets */}
                      <div className="flex flex-wrap gap-1.5" style={{ marginBottom: "20px" }}>
                        {set.features.map((feat, fi) => (
                          <span
                            key={fi}
                            className="font-dm"
                            style={{
                              fontSize: "10px",
                              color: "var(--gold-dark)",
                              background: "var(--gold-pale)",
                              padding: "3px 8px",
                              borderRadius: "4px",
                              fontWeight: 500,
                            }}
                          >
                            ✓ {feat}
                          </span>
                        ))}
                      </div>

                      {/* Sizing Picker on Card */}
                      <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "16px", marginBottom: "20px" }}>
                        <div className="flex items-center justify-between" style={{ marginBottom: "8px" }}>
                          <span className="font-dm" style={{ fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 600 }}>
                            Select Size:
                          </span>
                          <button
                            type="button"
                            onClick={() => setSizingGuideOpen(true)}
                            className="font-dm"
                            style={{ fontSize: "10px", color: "var(--gold-dark)", textDecoration: "underline", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                          >
                            Size Guide ?
                          </button>
                        </div>
                        <div className="flex gap-1.5">
                          {["XS", "S", "M", "L", "Custom"].map((sz) => (
                            <button
                              key={sz}
                              type="button"
                              onClick={() => setSelectedSizes((prev) => ({ ...prev, [set.id]: sz }))}
                              style={{
                                flex: 1,
                                padding: "6px 0",
                                fontSize: "11px",
                                fontWeight: currentSize === sz ? 700 : 500,
                                borderRadius: "6px",
                                border: currentSize === sz ? "1.5px solid var(--gold)" : "1px solid var(--border-mid)",
                                background: currentSize === sz ? "var(--noir)" : "#ffffff",
                                color: currentSize === sz ? "var(--gold-light)" : "var(--noir)",
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                              }}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Price & Buy Button */}
                      <div className="flex items-center justify-between gap-3" style={{ marginTop: "auto" }}>
                        <div>
                          <div className="font-display" style={{ fontSize: "24px", color: "var(--noir)", fontWeight: 600, lineHeight: 1 }}>
                            {set.price}
                          </div>
                          <div className="font-dm" style={{ fontSize: "10px", color: "var(--text-light)", letterSpacing: "0.08em" }}>
                            {set.priceUSD} · Includes Prep Kit
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedSet(set)}
                          className="btn-gold shimmer-hover"
                          style={{
                            padding: "10px 18px",
                            fontSize: "10px",
                            borderRadius: "8px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            cursor: "pointer",
                          }}
                        >
                          <span>Buy Now</span>
                          <span>✦</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Press-On Callout Banner */}
            <div
              style={{
                background: "linear-gradient(135deg, #181816 0%, #111110 100%)",
                borderRadius: "16px",
                padding: "36px 40px",
                border: "1px solid rgba(201, 168, 76, 0.25)",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "24px",
                flexWrap: "wrap",
                boxShadow: "var(--shadow-dark)",
              }}
            >
              <div style={{ maxWidth: "600px" }}>
                <div
                  className="font-dm"
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    color: "var(--gold)",
                    fontWeight: 700,
                    marginBottom: "8px",
                  }}
                >
                  ✦ Custom Nail Art Made For You ✦
                </div>
                <h3
                  className="font-display"
                  style={{
                    fontSize: "28px",
                    color: "#ffffff",
                    fontWeight: 400,
                    letterSpacing: "-0.01em",
                    marginBottom: "10px",
                  }}
                >
                  Need a bespoke set for a wedding or special outfit?
                </h3>
                <p
                  className="font-dm"
                  style={{
                    fontSize: "13px",
                    color: "rgba(255, 255, 255, 0.65)",
                    fontWeight: 300,
                    lineHeight: 1.6,
                  }}
                >
                  Che crafts fully personalized press-on sets matched to your attire, Swarovski crystals, chrome textures, and 3D charms. Send your reference pictures directly on WhatsApp or Instagram.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="https://api.whatsapp.com/send?text=Hi%20Che!%20I'm%20interested%20in%20ordering%20a%20Custom%20Bespoke%20Press-On%20Nails%20set.%20Can%20we%20discuss%20the%20design?"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold"
                  style={{ padding: "13px 24px", fontSize: "11px", textDecoration: "none" }}
                >
                  Chat on WhatsApp
                </a>
                <a
                  href="https://www.instagram.com/aureva_nails_by_che"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                  style={{
                    padding: "13px 22px",
                    fontSize: "11px",
                    borderColor: "rgba(255,255,255,0.2)",
                    color: "#ffffff",
                    textDecoration: "none",
                  }}
                >
                  Instagram DM ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────
          5. GALLERY SECTION
      ────────────────────────────────────────────────────── */}
      <section id="gallery" style={{ padding: "100px 0", background: "white" }}>
        <div className="max-w-7xl mx-auto" style={{ padding: "0 32px" }}>
          {/* Header */}
          <div className="text-center" style={{ marginBottom: "48px" }}>
            <div
              className="font-dm inline-block"
              style={{ fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 600, marginBottom: "16px" }}
            >
              ✦ Portfolio ✦
            </div>
            <h2
              className="font-display"
              style={{ fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 400, color: "var(--noir)", lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: "16px" }}
            >
              The Work
            </h2>
            <div className="divider-gold" style={{ marginBottom: "20px" }} />
            <p
              className="font-dm"
              style={{ fontSize: "15px", color: "var(--text-muted)", fontWeight: 300, maxWidth: "440px", margin: "0 auto", lineHeight: 1.75 }}
            >
              A curated selection of recent sets — each one entirely custom, entirely Che.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2" style={{ marginBottom: "40px" }}>
            {galleryCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setGalleryFilter(cat)}
                className="font-dm"
                style={{
                  padding: "9px 20px",
                  borderRadius: "100px",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  border: "1px solid",
                  transition: "all 0.25s ease",
                  background: galleryFilter === cat ? "var(--noir)" : "transparent",
                  color: galleryFilter === cat ? "var(--gold-light)" : "var(--text-muted)",
                  borderColor: galleryFilter === cat ? "var(--noir)" : "var(--border-light)",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Masonry-style Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gridAutoRows: "240px",
              gap: "12px",
            }}
            className="gallery-grid"
          >
            {filteredGallery.map((item, i) => (
              <div
                key={item.id}
                className="img-zoom-wrap"
                style={{
                  gridRow: item.tall ? "span 2" : "span 1",
                  borderRadius: "12px",
                  overflow: "hidden",
                  position: "relative",
                  cursor: "pointer",
                  boxShadow: "var(--shadow-soft)",
                }}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover"
                  style={{ transition: "transform 0.7s ease" }}
                />
                {/* Overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(17,17,16,0.7) 0%, rgba(17,17,16,0.1) 50%, transparent 100%)",
                    opacity: 0,
                    transition: "opacity 0.4s ease",
                  }}
                  className="gallery-overlay"
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "16px",
                    left: "16px",
                    right: "16px",
                    transform: "translateY(12px)",
                    opacity: 0,
                    transition: "all 0.4s ease",
                  }}
                  className="gallery-info"
                >
                  <div className="font-dm" style={{ fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 600, marginBottom: "4px" }}>
                    {item.category}
                  </div>
                  <div className="font-display" style={{ fontSize: "18px", color: "white" }}>
                    {item.label}
                  </div>
                </div>
                {/* Category pill always visible */}
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    left: "12px",
                    background: "rgba(17,17,16,0.75)",
                    backdropFilter: "blur(8px)",
                    borderRadius: "100px",
                    padding: "5px 12px",
                    border: "1px solid rgba(201,168,76,0.35)",
                  }}
                >
                  <span className="font-dm" style={{ fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold-light)", fontWeight: 600 }}>
                    {item.category}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Gallery hover CSS via style tag */}
          <style>{`
            .gallery-grid > div:hover .gallery-overlay { opacity: 1 !important; }
            .gallery-grid > div:hover .gallery-info { opacity: 1 !important; transform: translateY(0) !important; }
            @media (max-width: 640px) {
              .gallery-grid { grid-template-columns: repeat(2,1fr) !important; }
              .gallery-grid > div { grid-row: span 1 !important; }
            }
          `}</style>

          {/* Instagram CTA */}
          <div className="text-center" style={{ marginTop: "48px" }}>
            <a
              href="https://www.instagram.com/aureva_nails_by_che"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline inline-flex items-center gap-3"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="2" y="2" width="20" height="20" rx="5"/>
                <circle cx="12" cy="12" r="5"/>
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
              </svg>
              See More on Instagram  ↗
            </a>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────
          6. ABOUT / WHY CHE SECTION
      ────────────────────────────────────────────────────── */}
      <section
        id="about"
        style={{
          background: "var(--noir)",
          padding: "100px 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative radial */}
        <div aria-hidden style={{ position: "absolute", top: 0, right: 0, width: "500px", height: "500px", background: "radial-gradient(ellipse at top right, rgba(201,168,76,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div aria-hidden style={{ position: "absolute", bottom: 0, left: 0, width: "400px", height: "400px", background: "radial-gradient(ellipse at bottom left, rgba(201,168,76,0.05) 0%, transparent 65%)", pointerEvents: "none" }} />

        <div className="max-w-7xl mx-auto" style={{ padding: "0 32px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "80px",
              alignItems: "center",
            }}
            className="flex flex-col lg:grid"
          >
            {/* Left: Image */}
            <div style={{ position: "relative" }} className="hidden lg:block">
              <div
                className="img-zoom-wrap"
                style={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  aspectRatio: "3/4",
                  position: "relative",
                  border: "2px solid rgba(201,168,76,0.3)",
                }}
              >
                <Image
                  src="/nail-new.jpg"
                  alt="Auréva Nails - Floral nail art by Che"
                  fill
                  sizes="500px"
                  className="object-cover"
                />
              </div>
              {/* Floating stat */}
              <div
                style={{
                  position: "absolute",
                  bottom: "-24px",
                  right: "-24px",
                  background: "linear-gradient(135deg, #C9A84C 0%, #E8D28A 50%, #C9A84C 100%)",
                  borderRadius: "12px",
                  padding: "24px 28px",
                  boxShadow: "var(--shadow-dark)",
                  textAlign: "center",
                }}
              >
                <div className="font-display" style={{ fontSize: "42px", color: "var(--noir)", fontWeight: 600, lineHeight: 1 }}>
                  200+
                </div>
                <div className="font-dm" style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--noir)", fontWeight: 600, marginTop: "6px" }}>
                  Clients Served
                </div>
              </div>
            </div>

            {/* Right: Content */}
            <div>
              <div
                className="font-dm inline-block"
                style={{ fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 600, marginBottom: "20px" }}
              >
                ✦ The Artist Behind the Nails ✦
              </div>
              <h2
                className="font-display"
                style={{ fontSize: "clamp(36px, 4.5vw, 58px)", fontWeight: 400, color: "var(--ivory)", lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: "24px" }}
              >
                Meet Che —<br />
                <em style={{ fontStyle: "italic", color: "var(--gold-light)" }}>Nail artist & creator.</em>
              </h2>
              <p
                className="font-dm"
                style={{ fontSize: "15px", color: "rgba(250,248,245,0.65)", fontWeight: 300, lineHeight: 1.8, marginBottom: "20px" }}
              >
                Every set that leaves this studio is the result of hours of careful craft, premium products, and a deep passion for making clients feel extraordinary.
              </p>
              <p
                className="font-dm"
                style={{ fontSize: "15px", color: "rgba(250,248,245,0.65)", fontWeight: 300, lineHeight: 1.8, marginBottom: "40px" }}
              >
                From delicate florals to intricate leopard art to polished chrome — Che brings creative vision and technical precision to every nail, every time.
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-3" style={{ marginBottom: "40px" }}>
                {["Premium Gel Products", "Sterile Tools", "Zero Nail Damage", "Fully Custom", "Private Studio"].map((feat) => (
                  <span
                    key={feat}
                    className="font-dm"
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      fontWeight: 600,
                      color: "var(--gold-light)",
                      border: "1px solid rgba(201,168,76,0.3)",
                      padding: "7px 14px",
                      borderRadius: "100px",
                    }}
                  >
                    {feat}
                  </span>
                ))}
              </div>

              <a href="#booking" className="btn-gold shimmer-hover">
                Book with Che ✦
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────
          7. TESTIMONIALS
      ────────────────────────────────────────────────────── */}
      <section
        style={{
          background: "var(--ivory-warm)",
          padding: "100px 0",
          borderTop: "1px solid var(--border-light)",
        }}
      >
        <div className="max-w-7xl mx-auto" style={{ padding: "0 32px" }}>
          <div className="text-center" style={{ marginBottom: "56px" }}>
            <div
              className="font-dm inline-block"
              style={{ fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 600, marginBottom: "16px" }}
            >
              ✦ Client Love ✦
            </div>
            <h2
              className="font-display"
              style={{ fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 400, color: "var(--noir)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
            >
              What They Say
            </h2>
            <div className="divider-gold" style={{ marginTop: "20px" }} />
          </div>

          {/* Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
            }}
          >
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="card-luxury"
                style={{
                  padding: "36px 32px",
                  borderRadius: "16px",
                }}
              >
                {/* Stars */}
                <div className="stars font-dm" style={{ fontSize: "14px", marginBottom: "20px" }}>
                  {"★".repeat(t.stars)}
                </div>
                <blockquote
                  className="font-dm"
                  style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: 300, lineHeight: 1.8, fontStyle: "italic", marginBottom: "24px" }}
                >
                  &ldquo;{t.text}&rdquo;
                </blockquote>
                <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "20px" }}>
                  <div className="font-dm" style={{ fontSize: "13px", fontWeight: 600, color: "var(--noir)" }}>
                    {t.name}
                  </div>
                  <div className="font-dm" style={{ fontSize: "11px", color: "var(--text-light)", letterSpacing: "0.08em" }}>
                    {t.location} · {t.service}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────
          8. BOOKING SECTION
      ────────────────────────────────────────────────────── */}
      <section
        id="booking"
        style={{
          background: "var(--ivory)",
          padding: "100px 0",
          borderTop: "1px solid var(--border-light)",
        }}
      >
        <div className="max-w-6xl mx-auto" style={{ padding: "0 32px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.3fr",
              gap: "80px",
              alignItems: "start",
            }}
            className="flex flex-col lg:grid"
          >
            {/* Left: Info */}
            <div style={{ paddingTop: "8px" }}>
              <div
                className="font-dm inline-block"
                style={{ fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 600, marginBottom: "20px" }}
              >
                ✦ Private Studio ✦
              </div>
              <h2
                className="font-display"
                style={{ fontSize: "clamp(36px, 4.5vw, 58px)", fontWeight: 400, color: "var(--noir)", lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: "24px" }}
              >
                Book Your
                <br />
                <em style={{ fontStyle: "italic", color: "var(--gold)" }}>Appointment</em>
              </h2>
              <p
                className="font-dm"
                style={{ fontSize: "15px", color: "var(--text-muted)", fontWeight: 300, lineHeight: 1.8, marginBottom: "40px" }}
              >
                All sessions are by appointment only. Fill out the form and Che will confirm your slot within 24 hours via WhatsApp or phone.
              </p>

              {/* Details */}
              {[
                { icon: "⏱", label: "Duration", value: "45–150 minutes depending on service" },
                { icon: "✦", label: "Location", value: "Private studio — address shared on confirmation" },
                { icon: "✓", label: "Deposit", value: "50% deposit required to confirm booking" },
                { icon: "★", label: "Experience", value: "3+ years · 200+ happy clients" },
              ].map((detail) => (
                <div
                  key={detail.label}
                  className="flex gap-4"
                  style={{ marginBottom: "24px", paddingBottom: "24px", borderBottom: "1px solid var(--border-light)" }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "10px",
                      background: "var(--gold-pale)",
                      border: "1px solid var(--border-mid)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                      color: "var(--gold)",
                      flexShrink: 0,
                    }}
                  >
                    {detail.icon}
                  </div>
                  <div>
                    <div className="font-dm" style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold-dark)", fontWeight: 700, marginBottom: "4px" }}>
                      {detail.label}
                    </div>
                    <div className="font-dm" style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 300 }}>
                      {detail.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Form */}
            <div
              style={{
                background: "white",
                border: "1px solid var(--border-light)",
                borderRadius: "20px",
                padding: "48px 40px",
                boxShadow: "var(--shadow-soft)",
              }}
            >
              {bookingSuccess ? (
                <div className="text-center" style={{ padding: "40px 20px" }}>
                  <div style={{ fontSize: "56px", marginBottom: "24px" }}>✦</div>
                  <h3
                    className="font-display"
                    style={{ fontSize: "32px", color: "var(--noir)", marginBottom: "16px" }}
                  >
                    Request Received!
                  </h3>
                  <p
                    className="font-dm"
                    style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: 300, lineHeight: 1.75, marginBottom: "32px" }}
                  >
                    Che will reach out within 24 hours to confirm your appointment and share payment details.
                  </p>
                  <button
                    onClick={() => setBookingSuccess(false)}
                    className="btn-outline"
                    style={{ width: "100%" }}
                  >
                    Make Another Booking
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBooking}>
                  <h3
                    className="font-display"
                    style={{ fontSize: "30px", color: "var(--noir)", marginBottom: "32px", letterSpacing: "-0.02em" }}
                  >
                    Request an Appointment
                  </h3>

                  {/* Name */}
                  <div style={{ marginBottom: "20px" }}>
                    <label className="font-dm" style={{ display: "block", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, color: "var(--text-muted)", marginBottom: "8px" }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingName}
                      onChange={(e) => setBookingName(e.target.value)}
                      placeholder="Your full name"
                      className="input-luxury"
                      style={{ borderRadius: "8px" }}
                    />
                  </div>

                  {/* Phone */}
                  <div style={{ marginBottom: "20px" }}>
                    <label className="font-dm" style={{ display: "block", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, color: "var(--text-muted)", marginBottom: "8px" }}>
                      WhatsApp / Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={bookingPhone}
                      onChange={(e) => setBookingPhone(e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      className="input-luxury"
                      style={{ borderRadius: "8px" }}
                    />
                  </div>

                  {/* Service */}
                  <div style={{ marginBottom: "20px" }}>
                    <label className="font-dm" style={{ display: "block", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, color: "var(--text-muted)", marginBottom: "8px" }}>
                      Service *
                    </label>
                    <select
                      value={bookingService}
                      onChange={(e) => setBookingService(e.target.value)}
                      className="input-luxury"
                      style={{ borderRadius: "8px", cursor: "pointer", appearance: "auto" }}
                    >
                      {servicesData.map((s) => (
                        <option key={s.id} value={s.title}>
                          {s.title} — {s.price}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date + Time */}
                  <div className="flex gap-4" style={{ marginBottom: "20px" }}>
                    <div style={{ flex: 1 }}>
                      <label className="font-dm" style={{ display: "block", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, color: "var(--text-muted)", marginBottom: "8px" }}>
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="input-luxury"
                        style={{ borderRadius: "8px" }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="font-dm" style={{ display: "block", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, color: "var(--text-muted)", marginBottom: "8px" }}>
                        Preferred Time *
                      </label>
                      <select
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="input-luxury"
                        style={{ borderRadius: "8px", cursor: "pointer", appearance: "auto" }}
                      >
                        {TIMES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div style={{ marginBottom: "32px" }}>
                    <label className="font-dm" style={{ display: "block", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, color: "var(--text-muted)", marginBottom: "8px" }}>
                      Design Inspo / Notes
                    </label>
                    <textarea
                      rows={3}
                      value={bookingMsg}
                      onChange={(e) => setBookingMsg(e.target.value)}
                      placeholder="Tell Che your vision — color, shape, design references, etc."
                      className="input-luxury"
                      style={{ borderRadius: "8px", resize: "vertical" }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-gold shimmer-hover"
                    style={{ width: "100%", fontSize: "11px", letterSpacing: "0.2em", position: "relative" }}
                    disabled={bookingLoading}
                  >
                    {bookingLoading ? (
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                        <span style={{ display: "inline-block", width: "14px", height: "14px", border: "2px solid rgba(17,17,16,0.3)", borderTopColor: "var(--noir)", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                        Sending Request...
                      </span>
                    ) : (
                      "Request Appointment ✦"
                    )}
                  </button>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  <p
                    className="font-dm text-center"
                    style={{ fontSize: "11px", color: "var(--text-light)", marginTop: "16px", lineHeight: 1.6 }}
                  >
                    Che will confirm within 24 hours · No payment taken online
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────
          9. FULL-WIDTH CTA BANNER
      ────────────────────────────────────────────────────── */}
      <section
        style={{
          background: "var(--noir)",
          borderTop: "1px solid rgba(201,168,76,0.2)",
          padding: "80px 32px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(201,168,76,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: "640px", margin: "0 auto" }}>
          <div
            className="font-dm inline-block"
            style={{ fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 600, marginBottom: "20px" }}
          >
            ✦ Don&apos;t Wait ✦
          </div>
          <h2
            className="font-display"
            style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 400, color: "var(--ivory)", lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: "24px" }}
          >
            Slots fill fast.
            <br />
            <em style={{ fontStyle: "italic", color: "var(--gold-light)" }}>Book yours today.</em>
          </h2>
          <p
            className="font-dm"
            style={{ fontSize: "15px", color: "rgba(250,248,245,0.6)", fontWeight: 300, lineHeight: 1.75, marginBottom: "40px" }}
          >
            Auréva is a one-artist studio with limited weekly appointments. Reserve your date before it&apos;s gone.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#booking" className="btn-gold shimmer-hover">
              Book Now ✦
            </a>
            <a
              href="https://www.instagram.com/aureva_nails_by_che"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
              style={{ color: "var(--ivory)", borderColor: "rgba(201,168,76,0.4)" }}
            >
              View Instagram  ↗
            </a>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────
          10. FOOTER
      ────────────────────────────────────────────────────── */}
      <footer
        style={{
          background: "var(--noir-deep)",
          borderTop: "1px solid rgba(201,168,76,0.15)",
          padding: "60px 32px 40px",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
              gap: "48px",
              marginBottom: "48px",
              paddingBottom: "48px",
              borderBottom: "1px solid rgba(201,168,76,0.12)",
            }}
            className="flex flex-col sm:grid"
          >
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3" style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    border: "1.5px solid rgba(201,168,76,0.3)",
                    overflow: "hidden",
                    padding: "3px",
                  }}
                >
                  <Image src="/logo.png" alt="Auréva" width={38} height={38} className="object-contain" />
                </div>
                <div>
                  <div className="font-display" style={{ fontSize: "18px", color: "var(--ivory)", letterSpacing: "-0.01em" }}>
                    AURÉVA NAILS
                  </div>
                  <div className="font-dm" style={{ fontSize: "8px", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 600 }}>
                    BY CHE
                  </div>
                </div>
              </div>
              <p className="font-dm" style={{ fontSize: "13px", color: "rgba(250,248,245,0.45)", fontWeight: 300, lineHeight: 1.75, maxWidth: "240px" }}>
                Bespoke gel nails, extensions & nail art in a private studio setting. Every set is custom-crafted by Che.
              </p>
            </div>

            {/* Services */}
            <div>
              <div className="font-dm" style={{ fontSize: "10px", letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 700, marginBottom: "20px" }}>
                Services
              </div>
              {servicesData.map((s) => (
                <a
                  key={s.id}
                  href="#services"
                  className="font-dm block"
                  style={{ fontSize: "13px", color: "rgba(250,248,245,0.45)", fontWeight: 300, marginBottom: "10px", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--gold-light)")}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(250,248,245,0.45)")}
                >
                  {s.title}
                </a>
              ))}
            </div>

            {/* Info */}
            <div>
              <div className="font-dm" style={{ fontSize: "10px", letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 700, marginBottom: "20px" }}>
                Studio Info
              </div>
              {[
                "By Appointment Only",
                "Private Studio",
                "Mon–Sat: 10am–7pm",
                "Sun: Closed",
              ].map((item) => (
                <div key={item} className="font-dm" style={{ fontSize: "13px", color: "rgba(250,248,245,0.45)", fontWeight: 300, marginBottom: "10px" }}>
                  {item}
                </div>
              ))}
            </div>

            {/* Connect */}
            <div>
              <div className="font-dm" style={{ fontSize: "10px", letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 700, marginBottom: "20px" }}>
                Connect
              </div>
              <a
                href="https://www.instagram.com/aureva_nails_by_che"
                target="_blank"
                rel="noopener noreferrer"
                className="font-dm flex items-center gap-2"
                style={{ fontSize: "13px", color: "rgba(250,248,245,0.45)", fontWeight: 300, marginBottom: "10px", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--gold-light)")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(250,248,245,0.45)")}
              >
                Instagram ↗
              </a>
              <a
                href="#booking"
                className="font-dm block"
                style={{ fontSize: "13px", color: "rgba(250,248,245,0.45)", fontWeight: 300, marginBottom: "10px", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--gold-light)")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(250,248,245,0.45)")}
              >
                Book Appointment
              </a>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="font-dm" style={{ fontSize: "11px", color: "rgba(250,248,245,0.3)", letterSpacing: "0.06em" }}>
              © {new Date().getFullYear()} Auréva Nails by Che. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="/admin"
                className="font-dm"
                style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(201, 168, 76, 0.6)", textDecoration: "none", transition: "color 0.2s ease" }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--gold)")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(201, 168, 76, 0.6)")}
              >
                ✦ Studio Admin
              </a>
              <p className="font-dm" style={{ fontSize: "11px", color: "rgba(250,248,245,0.3)", letterSpacing: "0.06em" }}>
                Crafted with love ✦
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* ──────────────────────────────────────────────────
          PRESS-ON QUICK-BUY / ORDER MODAL
      ────────────────────────────────────────────────── */}
      {selectedSet && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(17, 17, 16, 0.78)", backdropFilter: "blur(6px)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedSet(null);
              setOrderSuccessId(null);
            }
          }}
        >
          <div
            className="card-luxury relative w-full max-w-xl overflow-hidden animate-fadeIn"
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
              border: "1px solid var(--border-mid)",
              maxHeight: "92vh",
              overflowY: "auto",
            }}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => {
                setSelectedSet(null);
                setOrderSuccessId(null);
              }}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: "var(--gold-pale)",
                border: "1px solid var(--border-mid)",
                color: "var(--noir)",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 700,
              }}
            >
              ✕
            </button>

            <div className="flex flex-col sm:flex-row">
              {/* Product preview */}
              <div
                className="sm:w-2/5 relative h-48 sm:h-auto"
                style={{ background: "var(--ivory-warm)", minHeight: "220px" }}
              >
                <Image
                  src={selectedSet.src}
                  alt={selectedSet.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 240px"
                  style={{ objectFit: "cover" }}
                />
                <div className="img-overlay-gold" />
                <div className="absolute bottom-3 left-3 z-10">
                  <span
                    className="font-dm"
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#ffffff",
                      fontWeight: 600,
                      background: "rgba(17, 17, 16, 0.85)",
                      padding: "4px 8px",
                      borderRadius: "100px",
                      border: "1px solid rgba(255,255,255,0.15)",
                    }}
                  >
                    {selectedSet.shape} · {selectedSet.length}
                  </span>
                </div>
              </div>

              {/* Product order details */}
              <div className="sm:w-3/5 p-6 flex flex-col justify-between">
                <div>
                  <div
                    className="font-dm"
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "var(--gold-dark)",
                      fontWeight: 700,
                      marginBottom: "4px",
                    }}
                  >
                    {selectedSet.tag} · Direct Studio Order
                  </div>
                  <h3
                    className="font-display"
                    style={{ fontSize: "22px", color: "var(--noir)", fontWeight: 500, lineHeight: 1.15, marginBottom: "6px" }}
                  >
                    {selectedSet.title}
                  </h3>

                  <div className="flex items-baseline gap-2" style={{ marginBottom: "14px" }}>
                    <span className="font-display" style={{ fontSize: "22px", color: "var(--noir)", fontWeight: 600 }}>
                      {selectedSet.price}
                    </span>
                    <span className="font-dm" style={{ fontSize: "11px", color: "var(--text-light)" }}>
                      ({selectedSet.priceUSD}) · Kit Included
                    </span>
                  </div>

                  {/* Size selection */}
                  <div style={{ marginBottom: "14px" }}>
                    <div className="flex items-center justify-between" style={{ marginBottom: "6px" }}>
                      <label className="font-dm" style={{ fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600, color: "var(--text-muted)" }}>
                        Select Size:
                      </label>
                      <button
                        type="button"
                        onClick={() => setSizingGuideOpen(true)}
                        className="font-dm"
                        style={{ fontSize: "10px", color: "var(--gold-dark)", textDecoration: "underline", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                      >
                        Sizing Guide ?
                      </button>
                    </div>

                    <div className="grid grid-cols-5 gap-1">
                      {["XS", "S", "M", "L", "Custom"].map((sz) => {
                        const isCur = (selectedSizes[selectedSet.id] || "M") === sz;
                        return (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => setSelectedSizes((prev) => ({ ...prev, [selectedSet.id]: sz }))}
                            style={{
                              padding: "5px 0",
                              fontSize: "11px",
                              fontWeight: isCur ? 700 : 500,
                              borderRadius: "6px",
                              border: isCur ? "1.5px solid var(--gold)" : "1px solid var(--border-mid)",
                              background: isCur ? "var(--noir)" : "var(--ivory)",
                              color: isCur ? "var(--gold-light)" : "var(--noir)",
                              cursor: "pointer",
                            }}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Order Input Form */}
                  <form onSubmit={handlePlaceOrder}>
                    <div className="flex flex-col gap-2.5" style={{ marginBottom: "16px" }}>
                      <div>
                        <label className="font-dm block" style={{ fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px" }}>
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Sneha Patel"
                          value={orderCustomerName}
                          onChange={(e) => setOrderCustomerName(e.target.value)}
                          className="input-luxury"
                          style={{ padding: "8px 12px", fontSize: "12px", borderRadius: "6px" }}
                        />
                      </div>

                      <div>
                        <label className="font-dm block" style={{ fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px" }}>
                          WhatsApp / Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. +91 98765 43210"
                          value={orderPhone}
                          onChange={(e) => setOrderPhone(e.target.value)}
                          className="input-luxury"
                          style={{ padding: "8px 12px", fontSize: "12px", borderRadius: "6px" }}
                        />
                      </div>

                      <div>
                        <label className="font-dm block" style={{ fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px" }}>
                          Shipping Address (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="City, Pincode or full shipping address"
                          value={orderAddress}
                          onChange={(e) => setOrderAddress(e.target.value)}
                          className="input-luxury"
                          style={{ padding: "8px 12px", fontSize: "12px", borderRadius: "6px" }}
                        />
                      </div>
                    </div>

                    {orderSuccessId && (
                      <div className="font-dm" style={{ fontSize: "11px", color: "var(--gold-dark)", background: "var(--gold-pale)", padding: "8px 12px", borderRadius: "6px", marginBottom: "12px" }}>
                        ✓ Order #{orderSuccessId} saved! Opening WhatsApp...
                      </div>
                    )}

                    <div className="flex flex-col gap-2">
                      <button
                        type="submit"
                        disabled={orderLoading}
                        className="btn-gold shimmer-hover flex items-center justify-center gap-2"
                        style={{ width: "100%", padding: "12px", fontSize: "11px", borderRadius: "8px", border: "none", cursor: orderLoading ? "not-allowed" : "pointer" }}
                      >
                        <span>{orderLoading ? "Submitting Order..." : "Place Order & Open WhatsApp"}</span>
                        <span>✦</span>
                      </button>

                      <a
                        href="https://www.instagram.com/aureva_nails_by_che"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline flex items-center justify-center gap-2"
                        style={{ width: "100%", padding: "9px", fontSize: "10px", textDecoration: "none", borderRadius: "8px" }}
                      >
                        <span>Or Order via Instagram DM</span>
                        <span>↗</span>
                      </a>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────
          PRESS-ON SIZING GUIDE MODAL
      ────────────────────────────────────────────────── */}
      {sizingGuideOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(17, 17, 16, 0.78)", backdropFilter: "blur(6px)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSizingGuideOpen(false);
          }}
        >
          <div
            className="card-luxury relative w-full max-w-xl overflow-hidden animate-fadeIn"
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
              border: "1px solid var(--border-mid)",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "32px",
            }}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setSizingGuideOpen(false)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: "var(--gold-pale)",
                border: "1px solid var(--border-mid)",
                color: "var(--noir)",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 700,
              }}
            >
              ✕
            </button>

            <div
              className="font-dm"
              style={{
                fontSize: "10px",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "var(--gold-dark)",
                fontWeight: 700,
                marginBottom: "8px",
              }}
            >
              ✦ Fitting & Measurement Guide ✦
            </div>
            <h3
              className="font-display"
              style={{ fontSize: "28px", color: "var(--noir)", fontWeight: 500, letterSpacing: "-0.01em", marginBottom: "12px" }}
            >
              Nail Bed Sizing Chart
            </h3>
            <p
              className="font-dm"
              style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 300, lineHeight: 1.6, marginBottom: "24px" }}
            >
              Measure the widest part of your natural nail bed using measuring tape, or place clear tape across your nail, mark the sidewalls, and measure with a millimeter ruler.
            </p>

            {/* Sizing Table */}
            <div
              style={{
                border: "1px solid var(--border-light)",
                borderRadius: "12px",
                overflow: "hidden",
                marginBottom: "24px",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "var(--ivory-warm)", borderBottom: "1px solid var(--border-light)" }}>
                    <th className="font-dm" style={{ padding: "10px 12px", fontSize: "11px", fontWeight: 700, color: "var(--noir)" }}>Size</th>
                    <th className="font-dm" style={{ padding: "10px 8px", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)" }}>Thumb</th>
                    <th className="font-dm" style={{ padding: "10px 8px", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)" }}>Index</th>
                    <th className="font-dm" style={{ padding: "10px 8px", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)" }}>Middle</th>
                    <th className="font-dm" style={{ padding: "10px 8px", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)" }}>Ring</th>
                    <th className="font-dm" style={{ padding: "10px 8px", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)" }}>Pinky</th>
                  </tr>
                </thead>
                <tbody>
                  {SIZING_DATA.map((row, idx) => (
                    <tr
                      key={row.size}
                      style={{
                        background: idx % 2 === 0 ? "#ffffff" : "var(--ivory)",
                        borderBottom: idx === SIZING_DATA.length - 1 ? "none" : "1px solid var(--border-light)",
                      }}
                    >
                      <td className="font-dm" style={{ padding: "10px 12px", fontSize: "12px", fontWeight: 700, color: "var(--gold-dark)" }}>
                        {row.size}
                      </td>
                      <td className="font-dm" style={{ padding: "10px 8px", fontSize: "11px", color: "var(--noir)" }}>{row.thumb}</td>
                      <td className="font-dm" style={{ padding: "10px 8px", fontSize: "11px", color: "var(--noir)" }}>{row.index}</td>
                      <td className="font-dm" style={{ padding: "10px 8px", fontSize: "11px", color: "var(--noir)" }}>{row.middle}</td>
                      <td className="font-dm" style={{ padding: "10px 8px", fontSize: "11px", color: "var(--noir)" }}>{row.ring}</td>
                      <td className="font-dm" style={{ padding: "10px 8px", fontSize: "11px", color: "var(--noir)" }}>{row.pinky}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Measuring Tips */}
            <div
              style={{
                background: "var(--gold-pale)",
                border: "1px solid var(--border-mid)",
                borderRadius: "12px",
                padding: "16px 20px",
                marginBottom: "24px",
              }}
            >
              <div className="font-dm" style={{ fontSize: "12px", fontWeight: 700, color: "var(--gold-dark)", marginBottom: "6px" }}>
                ✦ Tip: Free Digital Sizing Consultation
              </div>
              <p className="font-dm" style={{ fontSize: "12px", color: "var(--noir)", fontWeight: 300, lineHeight: 1.5 }}>
                Not sure about millimeter measurements? Place your hand flat on plain white paper next to a coin, snap a clear top-down photo, and DM it to Che on Instagram. She will size your set personally!
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSizingGuideOpen(false)}
              className="btn-dark"
              style={{ width: "100%", padding: "12px", fontSize: "11px", borderRadius: "8px", cursor: "pointer" }}
            >
              Got It · Close Guide
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
