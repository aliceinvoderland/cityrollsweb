import { NextResponse } from "next/server";
import { generateRewardCode } from "@/lib/rewardCode";
import { requireAdminFromRequest } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

const GOAL = 3;

async function ensureRewardRow(supabase, userRow) {
  const { data: existingReward, error: existingError } = await supabase
    .from("rewards")
    .select("*")
    .eq("user_id", userRow.id)
    .maybeSingle();

  if (existingError) throw existingError;
  if (existingReward) return existingReward;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = generateRewardCode();
    const { data: createdReward, error: createError } = await supabase
      .from("rewards")
      .insert({
        user_id: userRow.id,
        user_name: userRow.name,
        user_email: userRow.email,
        code,
        redeemed: false,
      })
      .select("*")
      .maybeSingle();

    if (!createError) return createdReward;

    if (createError.code === "23505") {
      const { data: retryReward, error: retryError } = await supabase
        .from("rewards")
        .select("*")
        .eq("user_id", userRow.id)
        .maybeSingle();

      if (retryError) throw retryError;
      if (retryReward) return retryReward;
      continue;
    }

    throw createError;
  }

  throw new Error("Unable to create reward code");
}

export async function POST(req) {
  try {
    const admin = await requireAdminFromRequest(req);
    if (admin.error) {
      return NextResponse.json({ error: admin.error }, { status: admin.status });
    }

    const { uploadId, action } = await req.json();
    if (!uploadId || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { data: upload, error: uploadError } = await admin.supabase
      .from("uploads")
      .select("*")
      .eq("id", uploadId)
      .maybeSingle();

    if (uploadError) throw uploadError;
    if (!upload) return NextResponse.json({ error: "Upload not found" }, { status: 404 });
    if (upload.status !== "pending") {
      return NextResponse.json({ error: "Already reviewed" }, { status: 400 });
    }

    if (action === "reject") {
      const { error: rejectError } = await admin.supabase
        .from("uploads")
        .update({
          status: "rejected",
          reviewed_at: new Date().toISOString(),
          reviewed_by: admin.user.email,
        })
        .eq("id", uploadId);

      if (rejectError) throw rejectError;
      return NextResponse.json({ success: true, status: "rejected" });
    }

    const { data: userRow, error: userError } = await admin.supabase
      .from("users")
      .select("*")
      .eq("id", upload.user_id)
      .maybeSingle();

    if (userError) throw userError;
    if (!userRow) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const newApproved = (userRow.approved_purchases || 0) + 1;
    const shouldUnlock = newApproved >= GOAL && !userRow.reward_unlocked;
    const now = new Date().toISOString();

    const { error: approveError } = await admin.supabase
      .from("uploads")
      .update({
        status: "approved",
        reviewed_at: now,
        reviewed_by: admin.user.email,
      })
      .eq("id", uploadId);

    if (approveError) throw approveError;

    const { error: updateUserError } = await admin.supabase
      .from("users")
      .update({
        approved_purchases: newApproved,
        ...(shouldUnlock
          ? {
              reward_unlocked: true,
              reward_unlocked_at: now,
            }
          : {}),
      })
      .eq("id", upload.user_id);

    if (updateUserError) throw updateUserError;

    if (shouldUnlock) {
      await ensureRewardRow(admin.supabase, {
        id: upload.user_id,
        name: userRow.name,
        email: userRow.email,
      });
    }

    return NextResponse.json({
      success: true,
      status: "approved",
      approvedPurchases: newApproved,
      unlocked: shouldUnlock,
    });
  } catch (err) {
    console.error("admin/review error:", err);
    return NextResponse.json({ error: err.message || "Review failed" }, { status: 500 });
  }
}
