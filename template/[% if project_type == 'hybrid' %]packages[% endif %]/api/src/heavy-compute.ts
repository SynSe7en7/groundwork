// Heavy-compute seam. Long-running or GPU work runs on Modal, reached over
// HTTPS through a thin wrapper (preferably a Supabase Edge Function that holds
// the Modal token server-side). This stays off the hot CRUD and auth path and
// never carries an sb_secret_* key in a client bundle.

export interface HeavyComputeRequest {
  job: string
  payload: Record<string, unknown>
}

export interface HeavyComputeResult {
  ok: boolean
  data?: unknown
  error?: string
}

function resolveEndpoint(): string {
  // Point this at a Supabase Edge Function route or a direct Modal HTTPS
  // endpoint. Keep it in a public env var only if the endpoint is itself
  // unauthenticated; otherwise proxy through an Edge Function.
  return (
    process.env.NEXT_PUBLIC_HEAVY_COMPUTE_URL ??
    process.env.EXPO_PUBLIC_HEAVY_COMPUTE_URL ??
    ''
  )
}

export async function runHeavyCompute(
  request: HeavyComputeRequest,
): Promise<HeavyComputeResult> {
  const endpoint = resolveEndpoint()
  if (!endpoint) {
    return { ok: false, error: 'Heavy-compute endpoint is not configured.' }
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(request),
    })
    if (!response.ok) {
      return { ok: false, error: 'Request failed with status ' + response.status }
    }
    return { ok: true, data: await response.json() }
  } catch (cause) {
    return { ok: false, error: cause instanceof Error ? cause.message : 'Unknown error' }
  }
}
