"use server";

import { DstackClient } from "@phala/dstack-sdk";
import type { ActionResult } from "./keys";

export type SignResult = {
  signature: string;
  publicKey: string;
  signatureChain: string[];
};

export async function signAction(input: {
  algorithm: string;
  message: string;
}): Promise<ActionResult<SignResult>> {
  try {
    const client = new DstackClient();
    const res = await client.sign(input.algorithm, input.message);
    return {
      ok: true,
      data: {
        signature: Buffer.from(res.signature).toString("hex"),
        publicKey: Buffer.from(res.public_key).toString("hex"),
        signatureChain: res.signature_chain.map((s) =>
          Buffer.from(s).toString("hex"),
        ),
      },
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export type VerifyResult = {
  valid: boolean;
};

export async function verifyAction(input: {
  algorithm: string;
  message: string;
  signatureHex: string;
  publicKeyHex: string;
}): Promise<ActionResult<VerifyResult>> {
  try {
    const client = new DstackClient();
    const res = await client.verify(
      input.algorithm,
      input.message,
      Buffer.from(input.signatureHex, "hex"),
      Buffer.from(input.publicKeyHex, "hex"),
    );
    return { ok: true, data: { valid: res.valid } };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function emitEventAction(input: {
  event: string;
  payload: string;
}): Promise<ActionResult<{ emitted: true }>> {
  try {
    const client = new DstackClient();
    await client.emitEvent(input.event, input.payload);
    return { ok: true, data: { emitted: true } };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
