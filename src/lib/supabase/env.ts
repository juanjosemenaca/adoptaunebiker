function cleanEnv(value: string | undefined) {
  if (!value) return "";
  return value.trim().replace(/^["']|["']$/g, "").trim();
}

function runtimeEnv(name: string) {
  // Next inlines `process.env.NEXT_PUBLIC_*` at build. Reading through a
  // local `process.env` keeps the runtime object Vercel injects into the
  // serverless function after deploy.
  const env = process.env;
  return cleanEnv(env[name]);
}

export function configuredSupabaseUrl() {
  return runtimeEnv("SUPABASE_URL") || runtimeEnv("NEXT_PUBLIC_SUPABASE_URL");
}

export function configuredSupabaseKey() {
  return (
    runtimeEnv("SUPABASE_PUBLISHABLE_KEY") ||
    runtimeEnv("SUPABASE_ANON_KEY") ||
    runtimeEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") ||
    runtimeEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  );
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
