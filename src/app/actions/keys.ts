"use server";

import { DstackClient } from "@phala/dstack-sdk";

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export type GetKeyResult = {
  key: string;
  signatureChain: string[];
};

export async function getKeyAction(input: {
  path?: string;
  purpose?: string;
  algorithm?: string;
}): Promise<ActionResult<GetKeyResult>> {
  try {
    const client = new DstackClient();
    const res = await client.getKey(
      input.path ?? "",
      input.purpose ?? "",
      input.algorithm || "secp256k1",
    );
    return {
      ok: true,
      data: {
        key: Buffer.from(res.key).toString("hex"),
        signatureChain: res.signature_chain.map((s) =>
          Buffer.from(s).toString("hex"),
        ),
      },
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export type GetTlsKeyResult = {
  key: string;
  certificateChain: string[];
};

export async function getTlsKeyAction(input: {
  subject?: string;
  altNames?: string[];
  usageRaTls?: boolean;
  usageServerAuth?: boolean;
  usageClientAuth?: boolean;
  notBefore?: number;
  notAfter?: number;
  withAppInfo?: boolean;
}): Promise<ActionResult<GetTlsKeyResult>> {
  try {
    const client = new DstackClient();
    const res = await client.getTlsKey({
      subject: input.subject,
      altNames: input.altNames,
      usageRaTls: input.usageRaTls,
      usageServerAuth: input.usageServerAuth,
      usageClientAuth: input.usageClientAuth,
      notBefore: input.notBefore,
      notAfter: input.notAfter,
      withAppInfo: input.withAppInfo,
    });
    return {
      ok: true,
      data: {
        key: res.key,
        certificateChain: res.certificate_chain,
      },
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
