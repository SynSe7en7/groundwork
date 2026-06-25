import { supabase } from './supabase';

// Heavy-compute seam. The device calls a Supabase Edge Function named
// `run-heavy`, which holds the Modal secret server-side and forwards the
// request to a Modal HTTPS endpoint. The Modal secret never ships in the app
// bundle, so it stays out of any EXPO_PUBLIC_ var.
//
// The `run-heavy` function is scaffolded only when the project opts into Modal.
// Without it there is nothing to invoke, so the seam stays off by default and
// is enabled with EXPO_PUBLIC_HEAVY_COMPUTE_ENABLED=true once the function is
// deployed. When it is off the seam no-ops with a clear message rather than
// failing on the missing function.

export type HeavyComputeResult = {
  ok: boolean;
  data?: unknown;
  error?: string;
};

function isEnabled(): boolean {
  return process.env.EXPO_PUBLIC_HEAVY_COMPUTE_ENABLED === 'true';
}

export async function runHeavyCompute(
  payload: Record<string, unknown>,
): Promise<HeavyComputeResult> {
  if (!isEnabled()) {
    return {
      ok: false,
      error:
        'Heavy-compute seam is not configured. Deploy the run-heavy Edge Function and set EXPO_PUBLIC_HEAVY_COMPUTE_ENABLED=true.',
    };
  }

  const { data, error } = await supabase.functions.invoke('run-heavy', {
    body: payload,
  });

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true, data };
}
