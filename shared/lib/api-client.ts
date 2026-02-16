"use client"

import { createApiClient, type ApiClient } from "./api"

type CreateBrowserApiOptions = {
  tokenKey?: string
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
  return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : null
}

export function getBrowserApi(
  options: CreateBrowserApiOptions = {}
): ApiClient {
  const tokenKey = options.tokenKey ?? "access_token"

  return createApiClient({
    getToken: () => {
      if (typeof window === "undefined") return null
      return localStorage.getItem(tokenKey) ?? getCookie(tokenKey)
    },
  })
}
