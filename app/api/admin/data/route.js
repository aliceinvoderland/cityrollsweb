import { NextResponse } from "next/server";
import { mapProfileRow, mapRewardRow, mapUploadRow } from "@/lib/supabaseData";
import { requireAdminFromRequest } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const admin = await requireAdminFromRequest(req);
    if (admin.error) {
      return NextResponse.json({ error: admin.error }, { status: admin.status });
    }

    const [uploadsResult, usersResult, rewardsResult] = await Promise.all([
      admin.supabase
        .from("uploads")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false }),
      admin.supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100),
      admin.supabase
        .from("rewards")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100),
    ]);

    if (uploadsResult.error) throw uploadsResult.error;
    if (usersResult.error) throw usersResult.error;
    if (rewardsResult.error) throw rewardsResult.error;

    return NextResponse.json({
      pendingUploads: (uploadsResult.data || []).map(mapUploadRow),
      users: (usersResult.data || []).map(mapProfileRow),
      rewards: (rewardsResult.data || []).map(mapRewardRow),
    });
  } catch (err) {
    console.error("admin/data error:", err);
    return NextResponse.json({ error: err.message || "Failed to load admin data" }, { status: 500 });
  }
}
