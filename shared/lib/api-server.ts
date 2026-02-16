import "server-only"

import { cookies } from "next/headers"

import { createApiClient, type ApiClient } from "./api"

type CreateServerApiOptions = {
  tokenCookie?: string
  baseUrl?: string
}

export function getServerApi(
  options: CreateServerApiOptions = {}
): ApiClient {
  const tokenCookie = options.tokenCookie ?? "access_token"

  return createApiClient({
    baseUrl: options.baseUrl ?? process.env.API_BASE_URL,
    getToken: async () => {
      const cookieStore = await cookies()
      return cookieStore.get(tokenCookie)?.value ?? null
    },
  })
}
