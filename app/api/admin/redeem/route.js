import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const admin = await requireAdminFromRequest(req);
    if (admin.error) {
      return NextResponse.json({ error: admin.error }, { status: admin.status });
    }

    const { code } = await req.json();
    if (!code) return NextResponse.json({ error: "Code required" }, { status: 400 });

    const cleanCode = code.toUpperCase().trim();
    const { data: rewardRow, error: rewardError } = await admin.supabase
      .from("rewards")
      .select("*")
      .eq("code", cleanCode)
      .maybeSingle();

    if (rewardError) throw rewardError;
    if (!rewardRow) return NextResponse.json({ error: "Invalid code" }, { status: 404 });
    if (rewardRow.redeemed) return NextResponse.json({ error: "Already redeemed" }, { status: 400 });

    const now = new Date().toISOString();

    const { error: updateRewardError } = await admin.supabase
      .from("rewards")
      .update({
      redeemed: true,
      redeemed_at: now,
      redeemed_by: admin.user.email,
    })
      .eq("id", rewardRow.id);

    if (updateRewardError) throw updateRewardError;

    const { error: updateUserError } = await admin.supabase
      .from("users")
      .update({
        reward_redeemed: true,
        reward_redeemed_at: now,
      })
      .eq("id", rewardRow.user_id);

    if (updateUserError) throw updateUserError;

    return NextResponse.json({ success: true, user: rewardRow.user_name });
  } catch (err) {
    console.error("admin/redeem error:", err);
    return NextResponse.json({ error: err.message || "Redeem failed" }, { status: 500 });
  }
}
