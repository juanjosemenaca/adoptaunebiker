function cleanEnv(value: string | undefined) {
  if (!value) return "";
  return value.trim().replace(/^["']|["']$/g, "").trim();
}

// Keep these as static `process.env.NAME` reads so Vercel includes them in
// the serverless function environment. Dynamic lookups are invisible to that tracer.
const tracedUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const tracedKey =
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function configuredSupabaseUrl() {
  return cleanEnv(tracedUrl);
}

export function configuredSupabaseKey() {
  return cleanEnv(tracedKey);
}

export function hasSupabaseEnv() {
  const url = configuredSupabaseUrl();
  const key = configuredSupabaseKey();
  return Boolean(url && key && !url.includes("grasrjavkbeboynacvzp"));
}

export function supabaseUrl() {
  const value = configuredSupabaseUrl();
  if (!value) throw new Error("Falta NEXT_PUBLIC_SUPABASE_URL");
  if (value.includes("grasrjavkbeboynacvzp")) {
    throw new Error("Esta app no debe usar el proyecto ERP de Supabase.");
  }
  return value;
}

export function supabasePublishableKey() {
  const value = configuredSupabaseKey();
  if (!value) throw new Error("Falta NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  return value;
}
