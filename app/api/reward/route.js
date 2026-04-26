import { NextResponse } from "next/server";
import { generateRewardCode } from "@/lib/rewardCode";
import { requireUserFromRequest } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

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

export async function GET(req) {
  try {
    const auth = await requireUserFromRequest(req);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { data: userRow, error: userError } = await auth.supabase
      .from("users")
      .select("*")
      .eq("id", auth.user.id)
      .maybeSingle();

    if (userError) throw userError;
    if (!userRow) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    if (!userRow.reward_unlocked) {
      return NextResponse.json({ error: "Reward not unlocked yet" }, { status: 403 });
    }

    if (userRow.reward_redeemed) {
      return NextResponse.json({ error: "Reward already redeemed" }, { status: 409 });
    }

    const rewardRow = await ensureRewardRow(auth.supabase, userRow);
    return NextResponse.json({ code: rewardRow.code, redeemed: Boolean(rewardRow.redeemed) });
  } catch (err) {
    console.error("reward route error:", err);
    return NextResponse.json({ error: err.message || "Failed to load reward" }, { status: 500 });
  }
}
