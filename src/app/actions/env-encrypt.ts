"use server";

import {
  verifyEnvEncryptPublicKey,
  verifyEnvEncryptPublicKeyLegacy,
} from "@phala/dstack-sdk";
import { encryptEnvVars, type EnvVar } from "@phala/dstack-sdk/encrypt-env-vars";
import type { ActionResult } from "./keys";

type KmsResponse = {
  public_key: string;
  signature?: string;
  signature_v1?: string;
  timestamp?: number | string;
};

export type FetchPubKeyResult = {
  publicKey: string;
  signatureType: "v1" | "legacy" | "none";
  signer: string | null;
  timestamp?: number | string;
};

export async function fetchAndVerifyPubKeyAction(input: {
  kmsUrl: string;
  appId: string;
}): Promise<ActionResult<FetchPubKeyResult>> {
  try {
    if (!input.kmsUrl) throw new Error("kmsUrl is required");
    if (!input.appId) throw new Error("appId is required");

    const url =
      input.kmsUrl.replace(/\/$/, "") + "/prpc/GetAppEnvEncryptPubKey?json";
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ app_id: input.appId }),
    });
    if (!res.ok) {
      throw new Error(`KMS returned ${res.status} ${res.statusText}`);
    }
    const data = (await res.json()) as KmsResponse;
    if (!data.public_key) throw new Error("KMS response missing public_key");

    const pkBytes = Buffer.from(data.public_key.replace(/^0x/, ""), "hex");

    if (data.signature_v1 && data.timestamp !== undefined) {
      const sigBytes = Buffer.from(
        data.signature_v1.replace(/^0x/, ""),
        "hex",
      );
      const signer = verifyEnvEncryptPublicKey(
        pkBytes,
        sigBytes,
        input.appId,
        typeof data.timestamp === "string"
          ? BigInt(data.timestamp)
          : BigInt(data.timestamp),
      );
      return {
        ok: true,
        data: {
          publicKey: data.public_key,
          signatureType: "v1",
          signer,
          timestamp: data.timestamp,
        },
      };
    }

    if (data.signature) {
      const sigBytes = Buffer.from(data.signature.replace(/^0x/, ""), "hex");
      const signer = verifyEnvEncryptPublicKeyLegacy(
        pkBytes,
        sigBytes,
        input.appId,
      );
      return {
        ok: true,
        data: {
          publicKey: data.public_key,
          signatureType: "legacy",
          signer,
        },
      };
    }

    return {
      ok: true,
      data: {
        publicKey: data.public_key,
        signatureType: "none",
        signer: null,
      },
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function encryptEnvAction(input: {
  publicKeyHex: string;
  envs: EnvVar[];
}): Promise<ActionResult<{ encrypted: string }>> {
  try {
    if (!input.publicKeyHex) throw new Error("publicKeyHex is required");
    if (!input.envs || input.envs.length === 0) {
      throw new Error("at least one env var required");
    }
    const encrypted = await encryptEnvVars(input.envs, input.publicKeyHex);
    return { ok: true, data: { encrypted } };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
