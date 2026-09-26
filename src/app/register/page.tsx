"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("aureva_token");
    if (token) router.push("/dashboard");
  }, [router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Registration failed. Please try again.");
        return;
      }
      localStorage.setItem("aureva_token", data.token);
      localStorage.setItem("aureva_user", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "14px 16px", borderRadius: "10px",
    background: "rgba(250,248,245,0.05)", border: "1px solid rgba(201,168,76,0.2)",
    color: "var(--ivory)", fontSize: "14px", fontFamily: "DM Sans, sans-serif",
    outline: "none", transition: "border-color 0.2s",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase",
    color: "rgba(250,248,245,0.4)", display: "block", marginBottom: "8px",
    fontFamily: "DM Sans, sans-serif",
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--noir)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>

      {/* Background shimmer */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(201,168,76,0.07) 0%, transparent 70%)",
      }} />

      <div style={{
        position: "relative", zIndex: 1, width: "100%", maxWidth: "460px",
        background: "rgba(30,30,28,0.95)",
        border: "1px solid rgba(201,168,76,0.25)",
        borderRadius: "20px",
        padding: "48px 40px",
        boxShadow: "0 40px 80px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,76,0.1)",
        backdropFilter: "blur(20px)",
        margin: "24px 0",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Link href="/" style={{ textDecoration: "none", display: "inline-flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "60px", height: "60px", borderRadius: "50%",
              border: "1.5px solid rgba(201,168,76,0.5)",
              background: "white", display: "flex", alignItems: "center",
              justifyContent: "center", overflow: "hidden", padding: "4px",
            }}>
              <Image src="/logo.png" alt="Auréva Nails" width={52} height={52} className="object-contain" />
            </div>
            <div>
              <span className="font-display block" style={{ fontSize: "20px", color: "var(--ivory)", letterSpacing: "-0.01em", lineHeight: 1.1 }}>
                AURÉVA NAILS
              </span>
              <span className="font-dm block" style={{ fontSize: "9px", letterSpacing: "0.32em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600 }}>
                BY CHE
              </span>
            </div>
          </Link>
        </div>

        <h1 className="font-display" style={{ fontSize: "28px", color: "var(--ivory)", marginBottom: "8px", textAlign: "center" }}>
          Create your account
        </h1>
        <p className="font-dm" style={{ fontSize: "13px", color: "rgba(250,248,245,0.5)", textAlign: "center", marginBottom: "32px", letterSpacing: "0.02em" }}>
          Book appointments & track your orders in one place
        </p>

        {error && (
          <div style={{
            background: "rgba(212,100,80,0.12)", border: "1px solid rgba(212,100,80,0.3)",
            borderRadius: "10px", padding: "12px 16px", marginBottom: "20px",
            display: "flex", alignItems: "center", gap: "10px",
          }}>
            <span style={{ fontSize: "16px" }}>⚠</span>
            <span className="font-dm" style={{ fontSize: "13px", color: "#F4A49A" }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Name */}
          <div>
            <label style={labelStyle}>Full Name</label>
            <input
              id="register-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.6)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.2)")}
            />
          </div>

          {/* Email */}
          <div>
            <label style={labelStyle}>Email Address</label>
            <input
              id="register-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.6)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.2)")}
            />
          </div>

          {/* Phone */}
          <div>
            <label style={labelStyle}>WhatsApp / Phone</label>
            <input
              id="register-phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.6)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.2)")}
            />
          </div>

          {/* Password */}
          <div>
            <label style={labelStyle}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                id="register-password"
                type={showPass ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                style={{ ...inputStyle, paddingRight: "44px" }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.6)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.2)")}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer",
                  color: "rgba(250,248,245,0.4)", fontSize: "16px", padding: "4px",
                }}
              >
                {showPass ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label style={labelStyle}>Confirm Password</label>
            <input
              id="register-confirm-password"
              type={showPass ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.6)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.2)")}
            />
          </div>

          {/* Password strength indicator */}
          {password.length > 0 && (
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{
                  flex: 1, height: "3px", borderRadius: "2px",
                  background: password.length >= i * 3
                    ? (password.length >= 9 ? "var(--gold)" : "rgba(201,168,76,0.5)")
                    : "rgba(250,248,245,0.1)",
                  transition: "background 0.3s",
                }} />
              ))}
              <span className="font-dm" style={{ fontSize: "10px", color: "rgba(250,248,245,0.3)", marginLeft: "4px", whiteSpace: "nowrap" }}>
                {password.length < 6 ? "Too short" : password.length < 9 ? "Good" : "Strong"}
              </span>
            </div>
          )}

          {/* Submit */}
          <button
            id="register-submit"
            type="submit"
            disabled={loading}
            style={{
              marginTop: "8px",
              width: "100%", padding: "16px",
              background: loading ? "rgba(201,168,76,0.4)" : "linear-gradient(135deg, #C9A84C 0%, #E8D28A 50%, #C9A84C 100%)",
              border: "none", borderRadius: "10px",
              color: "var(--noir)", fontFamily: "DM Sans, sans-serif",
              fontSize: "13px", fontWeight: 600, letterSpacing: "0.14em",
              textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.25s ease",
              boxShadow: loading ? "none" : "0 8px 24px -4px rgba(201,168,76,0.35)",
            }}
          >
            {loading ? "Creating account..." : "Create Account ✦"}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "28px 0" }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(201,168,76,0.15)" }} />
          <span className="font-dm" style={{ fontSize: "11px", color: "rgba(250,248,245,0.3)", letterSpacing: "0.08em" }}>OR</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(201,168,76,0.15)" }} />
        </div>

        <p className="font-dm" style={{ textAlign: "center", fontSize: "13px", color: "rgba(250,248,245,0.4)" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "var(--gold)", textDecoration: "none", fontWeight: 500 }}>
            Sign in →
          </Link>
        </p>

        <p className="font-dm" style={{ textAlign: "center", fontSize: "13px", color: "rgba(250,248,245,0.3)", marginTop: "12px" }}>
          <Link href="/" style={{ color: "rgba(201,168,76,0.5)", textDecoration: "none" }}>
            ← Back to studio
          </Link>
        </p>
      </div>
    </div>
  );
}
