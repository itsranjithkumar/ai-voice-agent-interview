import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { db } from "@/app/firebase/admin";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });

  const { vapiKey, assistantId } = await req.json();
  if (!vapiKey) return NextResponse.json({ success: false, error: "Missing key" }, { status: 400 });

  // Save both vapiKey and assistantId if provided
  const updateData: Record<string, any> = { vapiKey };
  if (assistantId !== undefined) {
    updateData.assistantId = assistantId;
  }
  await db.collection("users").doc(user.id).update(updateData);
  return NextResponse.json({ success: true });
}
