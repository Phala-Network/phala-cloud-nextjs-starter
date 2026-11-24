"use server";

import { DstackClientV0 } from "@phala/dstack-sdk";
import type { ActionResult } from "./keys";

export async function versionAction(): Promise<
  ActionResult<{ version: string; rev: string }>
> {
  try {
    const client = new DstackClientV0();
    const res = await client.version();
    return { ok: true, data: { version: res.version, rev: res.rev } };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function isReachableAction(): Promise<
  ActionResult<{ reachable: boolean }>
> {
  const client = new DstackClientV0();
  const ok = await client.isReachable();
  return { ok: true, data: { reachable: ok } };
}
