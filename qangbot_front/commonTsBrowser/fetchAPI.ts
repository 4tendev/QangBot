import { NEXT_PUBLIC_BACKEND_URL } from "@/settings";
export function fetchapi(
  endpoint: string,
  method: "GET" | "POST" | "OPTIONS" | "PATCH" | "PUT" | "DELETE",
  data?: object
) {
  return fetch(NEXT_PUBLIC_BACKEND_URL + endpoint, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },

    body: data ? JSON.stringify(data) : null,
    credentials: "include",
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}
