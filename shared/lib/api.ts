export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export type ApiRequestOptions = {
  headers?: HeadersInit
  query?: Record<string, string | number | boolean | null | undefined>
  body?: unknown
  signal?: AbortSignal
  cache?: RequestCache
  credentials?: RequestCredentials
  auth?: boolean
}

export type CreateApiClientOptions = {
  baseUrl?: string
  defaultHeaders?: HeadersInit
  getToken?: () => string | null | undefined | Promise<string | null | undefined>
}

export type ApiErrorPayload = {
  status: number
  message: string
  details?: unknown
}

export class ApiError extends Error {
  status: number
  details?: unknown

  constructor(payload: ApiErrorPayload) {
    super(payload.message)
    this.name = "ApiError"
    this.status = payload.status
    this.details = payload.details
  }
}

const DEFAULT_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""

function buildQuery(query: ApiRequestOptions["query"] = {}): string {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value === null || value === undefined) continue
    params.set(key, String(value))
  }
  const qs = params.toString()
  return qs ? `?${qs}` : ""
}

async function parseJsonSafe<T>(res: Response): Promise<T | undefined> {
  const contentType = res.headers.get("content-type") ?? ""
  if (!contentType.includes("application/json")) return undefined
  return (await res.json()) as T
}

async function request<T>(
  method: HttpMethod,
  path: string,
  options: ApiRequestOptions = {},
  clientOptions?: CreateApiClientOptions
): Promise<T> {
  const {
    headers,
    query,
    body,
    signal,
    cache,
    credentials,
    auth = true,
  } = options

  const baseUrl = clientOptions?.baseUrl ?? DEFAULT_BASE_URL
  const url = `${baseUrl}${path}${buildQuery(query)}`
  const token = auth ? await clientOptions?.getToken?.() : undefined
  const authHeader =
    token ? { Authorization: `Bearer ${token}` } : undefined

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
      ...clientOptions?.defaultHeaders,
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
    cache,
    credentials,
  })

  if (!res.ok) {
    const errorBody = await parseJsonSafe<{
      message?: string
      details?: unknown
    }>(res)
    throw new ApiError({
      status: res.status,
      message: errorBody?.message ?? res.statusText,
      details: errorBody?.details,
    })
  }

  const data = await parseJsonSafe<T>(res)
  return data as T
}

async function requestForm<T>(
  method: Extract<HttpMethod, "POST" | "PUT" | "PATCH">,
  path: string,
  formData: FormData,
  options: Omit<ApiRequestOptions, "body"> = {},
  clientOptions?: CreateApiClientOptions
): Promise<T> {
  const {
    headers,
    query,
    signal,
    cache,
    credentials,
    auth = true,
  } = options

  const baseUrl = clientOptions?.baseUrl ?? DEFAULT_BASE_URL
  const url = `${baseUrl}${path}${buildQuery(query)}`
  const token = auth ? await clientOptions?.getToken?.() : undefined
  const authHeader =
    token ? { Authorization: `Bearer ${token}` } : undefined

  const res = await fetch(url, {
    method,
    headers: {
      ...authHeader,
      ...clientOptions?.defaultHeaders,
      ...headers,
    },
    body: formData,
    signal,
    cache,
    credentials,
  })

  if (!res.ok) {
    const errorBody = await parseJsonSafe<{
      message?: string
      details?: unknown
    }>(res)
    throw new ApiError({
      status: res.status,
      message: errorBody?.message ?? res.statusText,
      details: errorBody?.details,
    })
  }

  const data = await parseJsonSafe<T>(res)
  return data as T
}

export type ApiClient = ReturnType<typeof createApiClient>

export function createApiClient(options: CreateApiClientOptions = {}) {
  return {
    get<T>(path: string, requestOptions?: Omit<ApiRequestOptions, "body">) {
      return request<T>("GET", path, requestOptions, options)
    },
    post<T>(path: string, body?: unknown, requestOptions?: ApiRequestOptions) {
      return request<T>("POST", path, { ...requestOptions, body }, options)
    },
    put<T>(path: string, body?: unknown, requestOptions?: ApiRequestOptions) {
      return request<T>("PUT", path, { ...requestOptions, body }, options)
    },
    patch<T>(path: string, body?: unknown, requestOptions?: ApiRequestOptions) {
      return request<T>("PATCH", path, { ...requestOptions, body }, options)
    },
    delete<T>(path: string, requestOptions?: ApiRequestOptions) {
      return request<T>("DELETE", path, requestOptions, options)
    },
    postForm<T>(
      path: string,
      formData: FormData,
      requestOptions?: Omit<ApiRequestOptions, "body">
    ) {
      return requestForm<T>("POST", path, formData, requestOptions, options)
    },
  }
}
