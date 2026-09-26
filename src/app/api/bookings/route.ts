import { NextRequest, NextResponse } from "next/server";
import { getAllBookings, createBooking, updateBooking, deleteBooking } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET /api/bookings - Fetch all bookings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let bookings = getAllBookings();
    if (status && status !== "all") {
      bookings = bookings.filter((b) => b.status === status);
    }

    return NextResponse.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error("GET /api/bookings error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

// POST /api/bookings - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, service, date, time, notes, userId } = body;

    // Validation
    if (!name || !phone || !service || !date || !time) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: name, phone, service, date, and time are required.",
        },
        { status: 400 }
      );
    }

    const newBooking = createBooking({
      name,
      phone,
      service,
      date,
      time,
      notes: notes || "",
      status: "pending",
      userId: userId || undefined,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Booking received successfully",
        data: newBooking,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/bookings error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

// PATCH /api/bookings - Update booking status or info
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Booking ID is required" },
        { status: 400 }
      );
    }

    const updated = updateBooking(id, updates);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Booking updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("PATCH /api/bookings error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update booking" },
      { status: 500 }
    );
  }
}

// DELETE /api/bookings - Delete a booking
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");

    if (!id) {
      const body = await request.json().catch(() => ({}));
      id = body?.id;
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Booking ID is required" },
        { status: 400 }
      );
    }

    const deleted = deleteBooking(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/bookings error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete booking" },
      { status: 500 }
    );
  }
}
