/**
 * Modal seam. Modal is the heavy-compute escape hatch, reached over HTTPS and
 * kept out of the hot CRUD and auth path. The endpoint URL and a shared token
 * live in server-only environment variables.
 */
export type ModalJobPayload = {
  job_id: string;
  [key: string]: unknown;
};

export async function submitModalJob(payload: ModalJobPayload) {
  const endpoint = process.env.MODAL_ENDPOINT_URL;
  const token = process.env.MODAL_TOKEN;

  if (!endpoint) {
    throw new Error("MODAL_ENDPOINT_URL is not configured");
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Modal job submission failed with status ${res.status}`);
  }

  return res.json();
}
