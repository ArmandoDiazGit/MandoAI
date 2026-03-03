import type { Result } from "./ResutModel";

export async function generate(
  prompt: string,
  opts?: { signal?: AbortSignal },
): Promise<Result<string>> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/generateOpenAI", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
      signal: opts?.signal,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        error: data?.detail ?? "Request failed",
      };
    }
    return { ok: true, data: data as string };
  } catch (err: any) {
    if (err?.name === "AbortError") {
      return { ok: false, error: "__CANCELLED__" };
    }
    return { ok: false, error: "Network error. Please try again." };
  }
}
