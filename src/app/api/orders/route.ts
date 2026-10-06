import { NextRequest, NextResponse } from "next/server";
import { getAllOrders, createOrder, updateOrder, deleteOrder } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET /api/orders - Fetch all press-on orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let orders = await getAllOrders();
    if (status && status !== "all") {
      orders = orders.filter((o) => o.status === status);
    }

    return NextResponse.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new press-on order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, phone, shippingAddress, setId, setName, shape, size, price, notes, userId } = body;

    // Validation
    if (!customerName || !phone || !setName || !size || !price) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: customerName, phone, setName, size, and price are required.",
        },
        { status: 400 }
      );
    }

    const newOrder = await createOrder({
      customerName,
      phone,
      shippingAddress: shippingAddress || "",
      setId: setId || "custom",
      setName,
      shape: shape || "Custom",
      size,
      price,
      notes: notes || "",
      status: "new",
      userId: userId || undefined,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Press-on order received successfully",
        data: newOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}

// PATCH /api/orders - Update order status or info
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Order ID is required" },
        { status: 400 }
      );
    }

    const updated = await updateOrder(id, updates);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("PATCH /api/orders error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update order" },
      { status: 500 }
    );
  }
}

// DELETE /api/orders - Delete an order
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
        { success: false, error: "Order ID is required" },
        { status: 400 }
      );
    }

    const deleted = await deleteOrder(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/orders error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete order" },
      { status: 500 }
    );
  }
}
