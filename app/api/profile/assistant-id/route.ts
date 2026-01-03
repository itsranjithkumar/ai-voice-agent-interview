import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { db } from "@/app/firebase/admin";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });

  const { assistantId } = await req.json();
  if (!assistantId) return NextResponse.json({ success: false, error: "Assistant ID is required" }, { status: 400 });

  try {
    await db.collection("users").doc(user.id).update({ assistantId });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating assistant ID:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update assistant ID" },
      { status: 500 }
    );
  }
}
