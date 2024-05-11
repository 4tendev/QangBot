"use server";
import { BACKEND_LOCAL_URL } from "@/settings";
export default async function getData(
  endpoint: string,
  cache: "no-store" | "force-cache" = "no-store"
) {
  const { cookies } = require("next/headers");

  const userCookies = cookies();
  const res = await fetch(
    BACKEND_LOCAL_URL + endpoint,

    {
      method: "GET",
      headers: { Cookie: userCookies },
      cache: cache,
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
