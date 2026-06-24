import { supabase } from './supabase';

// Heavy-compute seam. The device calls a Supabase Edge Function named
// `run-heavy`, which holds the Modal secret server-side and forwards the
// request to a Modal HTTPS endpoint. The Modal secret never ships in the app
// bundle, so it stays out of any EXPO_PUBLIC_ var.

export type HeavyComputeResult = {
  ok: boolean;
  data?: unknown;
  error?: string;
};

export async function runHeavyCompute(
  payload: Record<string, unknown>,
): Promise<HeavyComputeResult> {
  const { data, error } = await supabase.functions.invoke('run-heavy', {
    body: payload,
  });

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true, data };
}
