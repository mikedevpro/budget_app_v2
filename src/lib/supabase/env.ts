function assertValidHttpUrl(value: string, name: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error();
    }
  } catch {
    throw new Error(
      `[Supabase] ${name} must be a valid HTTP/HTTPS URL. ` +
        `Current value looks invalid. Set real values in .env.local.`
    );
  }
}

export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || url.includes("your_supabase_project_url")) {
    throw new Error(
      "[Supabase] NEXT_PUBLIC_SUPABASE_URL is missing or still a placeholder in .env.local"
    );
  }

  if (!anonKey || anonKey.includes("your_supabase_anon_key")) {
    throw new Error(
      "[Supabase] NEXT_PUBLIC_SUPABASE_ANON_KEY is missing or still a placeholder in .env.local"
    );
  }

  assertValidHttpUrl(url, "NEXT_PUBLIC_SUPABASE_URL");

  return { url, anonKey };
}
