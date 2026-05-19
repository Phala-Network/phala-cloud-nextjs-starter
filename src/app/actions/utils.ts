"use server";

import { getComposeHash } from "@phala/dstack-sdk/get-compose-hash";
import type { ActionResult } from "./keys";

export async function composeHashAction(input: {
  appComposeJson: string;
}): Promise<ActionResult<{ hash: string }>> {
  try {
    const parsed = JSON.parse(input.appComposeJson) as Record<string, unknown>;
    const hash = await getComposeHash(parsed as never);
    return { ok: true, data: { hash } };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
