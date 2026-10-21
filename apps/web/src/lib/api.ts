const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl?.trim()) {
  throw new Error("NEXT_PUBLIC_API_URL is required in apps/web/.env.local");
}

export const API_URL = apiUrl.trim().replace(/\/+$/, "");
export const FRONTEND_ONLY = process.env.NEXT_PUBLIC_FRONTEND_ONLY === "true";
