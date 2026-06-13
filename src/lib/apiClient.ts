import { useAuthStore } from '@/store/authStore'
import type { AuthUser } from '@/types/platform'

const configuredApiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL
const API_BASE_URL = configuredApiUrl?.replace(/\/$/, '') ?? '/api/v1'

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
  auth?: boolean
  retryOnUnauthorized?: boolean
}

type AuthResponse = {
  user: AuthUser
  accessToken: string
  refreshToken: string
}

/** Error thrown for non-OK API responses — carries the HTTP status and an
 *  optional machine-readable `code` (e.g. 'ACCOUNT_NOT_FOUND') so callers can
 *  branch on the exact failure without string-matching the message. */
export class ApiError extends Error {
  status: number
  code?: string
  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

let refreshInFlight: Promise<boolean> | null = null

async function ensureRefreshed(refreshToken: string): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = refreshSession(refreshToken).finally(() => {
      refreshInFlight = null
    })
  }
  return refreshInFlight
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = true, retryOnUnauthorized = true, headers, body, ...rest } = options
  const authState = useAuthStore.getState()

  const requestHeaders = new Headers(headers)
  requestHeaders.set('Content-Type', 'application/json')

  if (auth && authState.accessToken) {
    requestHeaders.set('Authorization', `Bearer ${authState.accessToken}`)
  }

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: requestHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error('Backend API ishlamayapti. Backend serverni ishga tushiring.')
  }

  if (response.status === 401 && auth) {
    if (retryOnUnauthorized && authState.refreshToken) {
      const refreshed = await ensureRefreshed(authState.refreshToken)

      if (refreshed) {
        return request<T>(path, {
          ...options,
          retryOnUnauthorized: false,
        })
      }
    }

    useAuthStore.getState().clearSession()
    throw new Error('Login required. Please sign in again.')
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => ({ message: 'Unexpected API error.' }))
    throw new ApiError(payload.message ?? 'API request failed.', response.status, payload.code)
  }

  if (response.status === 204) {
    return {} as T
  }

  return response.json() as Promise<T>
}

async function refreshSession(refreshToken: string): Promise<boolean> {
  try {
    const payload = await request<AuthResponse>('/auth/refresh', {
      method: 'POST',
      auth: false,
      retryOnUnauthorized: false,
      body: { refreshToken },
    })

    useAuthStore.getState().setSession(payload)
    return true
  } catch {
    return false
  }
}

export const apiClient = {
  get: <T>(path: string, options: Omit<RequestOptions, 'method'> = {}) => request<T>(path, options),
  post: <T>(path: string, body?: unknown, options: Omit<RequestOptions, 'method' | 'body'> = {}) =>
    request<T>(path, { ...options, method: 'POST', body }),
  patch: <T>(path: string, body?: unknown, options: Omit<RequestOptions, 'method' | 'body'> = {}) =>
    request<T>(path, { ...options, method: 'PATCH', body }),
  put: <T>(path: string, body?: unknown, options: Omit<RequestOptions, 'method' | 'body'> = {}) =>
    request<T>(path, { ...options, method: 'PUT', body }),
  delete: <T>(path: string, options: Omit<RequestOptions, 'method'> = {}) =>
    request<T>(path, { ...options, method: 'DELETE' }),
}

