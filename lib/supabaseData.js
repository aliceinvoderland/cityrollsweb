export function mapProfileRow(row) {
  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    approvedPurchases: row.approved_purchases ?? 0,
    totalUploads: row.total_uploads ?? 0,
    rewardUnlocked: Boolean(row.reward_unlocked),
    rewardRedeemed: Boolean(row.reward_redeemed),
    createdAt: row.created_at,
    rewardUnlockedAt: row.reward_unlocked_at,
    rewardRedeemedAt: row.reward_redeemed_at,
  };
}

export function mapUploadRow(row) {
  if (!row) return null;

  return {
    id: row.id,
    userId: row.user_id,
    userEmail: row.user_email,
    userName: row.user_name,
    fileUrl: row.file_url,
    filePath: row.file_path,
    amount: row.amount,
    status: row.status,
    createdAt: row.created_at,
    reviewedAt: row.reviewed_at,
    reviewedBy: row.reviewed_by,
  };
}

export function mapRewardRow(row) {
  if (!row) return null;

  return {
    id: row.id,
    userId: row.user_id,
    userName: row.user_name,
    userEmail: row.user_email,
    code: row.code,
    redeemed: Boolean(row.redeemed),
    createdAt: row.created_at,
    redeemedAt: row.redeemed_at,
    redeemedBy: row.redeemed_by,
  };
}

export function formatTimestamp(value, mode = "dateTime") {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return mode === "date"
    ? date.toLocaleDateString()
    : date.toLocaleString();
}
