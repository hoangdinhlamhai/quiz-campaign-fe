const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8789'

class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
  ) {
    super(`API ${status}`)
  }
}

// During SSR on Cloudflare, fetch quiz-be via the Service Binding (env.QUIZ_BE)
// instead of its public workers.dev URL — same-account Worker-to-Worker calls
// over workers.dev are blocked (error 1042). The custom server entry stashes
// the CF `env` in AsyncLocalStorage under globalThis.__cfEnvStorage.
function getServiceBinding(): { fetch: typeof fetch } | null {
  if (typeof window !== 'undefined') return null
  const storage = (globalThis as Record<string, any>).__cfEnvStorage
  const env = storage?.getStore?.()
  const binding = env?.QUIZ_BE
  return binding && typeof binding.fetch === 'function' ? binding : null
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const binding = getServiceBinding()
  // Service bindings require an absolute URL; host is ignored for internal routing.
  const url = binding ? `https://quiz-be.internal${path}` : `${BASE_URL}${path}`
  const doFetch = binding ? binding.fetch.bind(binding) : fetch

  const res = await doFetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null)
    throw new ApiError(res.status, errorBody)
  }

  return res.json() as Promise<T>
}

export function get<T>(path: string): Promise<T> {
  return request<T>('GET', path)
}

export function post<T>(path: string, body?: unknown): Promise<T> {
  return request<T>('POST', path, body)
}

export { ApiError }
