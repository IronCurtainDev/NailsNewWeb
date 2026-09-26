import { NextRequest, NextResponse } from "next/server";
import { parseToken, getUserById, getBookingsByUserId, getOrdersByUserId, updateUser } from "@/lib/db";

export const dynamic = "force-dynamic";

function getTokenFromRequest(request: NextRequest): string | null {
  const auth = request.headers.get("Authorization");
  if (auth && auth.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

// GET /api/auth/me — returns current user profile + their bookings + orders
export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ success: false, error: "Not authenticated." }, { status: 401 });
    }

    const parsed = parseToken(token);
    if (!parsed) {
      return NextResponse.json({ success: false, error: "Invalid token." }, { status: 401 });
    }

    const user = getUserById(parsed.userId);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found." }, { status: 404 });
    }

    const bookings = getBookingsByUserId(user.id);
    const orders = getOrdersByUserId(user.id);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        createdAt: user.createdAt,
      },
      bookings,
      orders,
    });
  } catch (error) {
    console.error("GET /api/auth/me error:", error);
    return NextResponse.json({ success: false, error: "Failed to load profile." }, { status: 500 });
  }
}

// PATCH /api/auth/me — update user profile
export async function PATCH(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ success: false, error: "Not authenticated." }, { status: 401 });
    }

    const parsed = parseToken(token);
    if (!parsed) {
      return NextResponse.json({ success: false, error: "Invalid token." }, { status: 401 });
    }

    const user = getUserById(parsed.userId);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found." }, { status: 404 });
    }

    const body = await request.json();
    const { name, phone } = body;
    const updates: Partial<{ name: string; phone: string }> = {};
    if (name) updates.name = name.trim();
    if (phone) updates.phone = phone.trim();

    const updated = updateUser(user.id, updates);
    return NextResponse.json({
      success: true,
      user: {
        id: updated!.id,
        email: updated!.email,
        name: updated!.name,
        phone: updated!.phone,
        createdAt: updated!.createdAt,
      },
    });
  } catch (error) {
    console.error("PATCH /api/auth/me error:", error);
    return NextResponse.json({ success: false, error: "Failed to update profile." }, { status: 500 });
  }
}
