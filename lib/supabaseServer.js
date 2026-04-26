import { createClient } from "@supabase/supabase-js";
import { getAdminEmails, getServerEnvMessage } from "@/lib/supabaseEnv";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://example.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "demo-service-role-key";

export function createSupabaseAdminClient() {
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function getSupabaseSetupError() {
  return getServerEnvMessage();
}

async function authenticateRequest(req) {
  const setupError = getSupabaseSetupError();
  if (setupError) {
    return { error: setupError, status: 503 };
  }

  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { error: "Unauthorized", status: 401 };
  }

  const token = authHeader.slice("Bearer ".length);
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return { error: "Invalid token", status: 401 };
  }

  return {
    supabase,
    user: data.user,
    token,
  };
}

export async function requireUserFromRequest(req) {
  return authenticateRequest(req);
}

export async function requireAdminFromRequest(req) {
  const auth = await authenticateRequest(req);
  if (auth.error) {
    return auth;
  }

  const email = auth.user.email?.toLowerCase() || "";
  if (!getAdminEmails().includes(email)) {
    return { error: "Forbidden", status: 403 };
  }

  return auth;
}
