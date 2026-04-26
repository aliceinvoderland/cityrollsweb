const CLIENT_ENV = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
};

const SERVER_ENV = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
};

export function getMissingClientEnv() {
  return Object.entries(CLIENT_ENV)
    .filter(([, value]) => !value)
    .map(([key]) => key);
}

export function getMissingServerEnv() {
  return Object.entries(SERVER_ENV)
    .filter(([, value]) => !value)
    .map(([key]) => key);
}

export function getClientEnvMessage() {
  const missing = getMissingClientEnv();
  if (!missing.length) return "";
  return `Project setup incomplete. Missing ${missing.join(", ")}. Add them to .env.local and restart the dev server.`;
}

export function getServerEnvMessage() {
  const missing = getMissingServerEnv();
  if (!missing.length) return null;
  return `Project setup incomplete. Missing ${missing.join(", ")}. Add them to .env.local and restart the dev server.`;
}

export function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}
