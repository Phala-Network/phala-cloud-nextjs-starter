"use server";

import { DstackClient } from "@phala/dstack-sdk";
import { toViemAccountSecure } from "@phala/dstack-sdk/viem";
import { toKeypairSecure } from "@phala/dstack-sdk/solana";
import type { ActionResult } from "./keys";

export type EthAccountResult = {
  address: string;
  signature?: string;
};

export async function ethAccountAction(input: {
  path: string;
  message?: string;
}): Promise<ActionResult<EthAccountResult>> {
  try {
    const client = new DstackClient();
    const key = await client.getKey(input.path || "ethereum");
    const account = toViemAccountSecure(key);
    const out: EthAccountResult = { address: account.address };
    if (input.message) {
      out.signature = await account.signMessage({ message: input.message });
    }
    return { ok: true, data: out };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export type SolanaAccountResult = {
  publicKey: string;
};

export async function solanaAccountAction(input: {
  path: string;
}): Promise<ActionResult<SolanaAccountResult>> {
  try {
    const client = new DstackClient();
    const key = await client.getKey(input.path || "solana");
    const keypair = toKeypairSecure(key);
    return { ok: true, data: { publicKey: keypair.publicKey.toBase58() } };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
