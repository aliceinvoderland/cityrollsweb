import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const admin = await requireAdminFromRequest(req);
  if (admin.error) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }

  return NextResponse.json({ admin: true, email: admin.user.email });
}
