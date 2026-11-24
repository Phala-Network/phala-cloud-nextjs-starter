"use server";

import { createHash } from "crypto";
import { DstackClient } from "@phala/dstack-sdk";
import { Keypair } from "@solana/web3.js";
import { privateKeyToAccount } from "viem/accounts";
import type { ActionResult } from "./keys";

const REPORT_DATA_DERIVATION = 'sha512("app-data:" || utf8(user_input))';

const hex = (bytes: Uint8Array) => Buffer.from(bytes).toString("hex");

function errorResult(err: unknown): { ok: false; error: string } {
  return { ok: false, error: err instanceof Error ? err.message : String(err) };
}

export type V1InfoResult = {
  appId: string;
  appName: string;
  instanceId: string;
  deviceId: string;
  composeHash: string;
  osImageHash: string;
  mrAggregated: string;
  keyProviderInfo: string;
  vmConfig: string;
  cloudVendor: string;
  cloudProduct: string;
};

export async function v1InfoAction(): Promise<ActionResult<V1InfoResult>> {
  try {
    const res = await new DstackClient().info();
    return {
      ok: true,
      data: {
        appId: hex(res.app_id),
        appName: res.app_name,
        instanceId: hex(res.instance_id),
        deviceId: hex(res.device_id),
        composeHash: hex(res.compose_hash),
        osImageHash: hex(res.os_image_hash),
        mrAggregated: hex(res.mr_aggregated),
        keyProviderInfo: res.key_provider_info,
        vmConfig: res.vm_config,
        cloudVendor: res.cloud_vendor,
        cloudProduct: res.cloud_product,
      },
    };
  } catch (err) {
    return errorResult(err);
  }
}

export async function v1VersionAction(): Promise<
  ActionResult<{ version: string; rev: string }>
> {
  try {
    const res = await new DstackClient().version();
    return { ok: true, data: { version: res.version, rev: res.rev } };
  } catch (err) {
    return errorResult(err);
  }
}

export type V1GetKeyResult = {
  key: string;
  publicKey: string;
  signatureChain: string[];
  rootEpoch: number;
  appEpoch: number;
};

export async function v1GetKeyAction(input: {
  domain: string;
  algorithm: "secp256k1" | "ed25519";
}): Promise<ActionResult<V1GetKeyResult>> {
  try {
    const res = await new DstackClient().getKey(input.domain, input.algorithm);
    return {
      ok: true,
      data: {
        key: hex(res.key),
        publicKey: hex(res.public_key),
        signatureChain: res.signature_chain.map(hex),
        rootEpoch: res.root_epoch,
        appEpoch: res.app_epoch,
      },
    };
  } catch (err) {
    return errorResult(err);
  }
}

export type V1AttestResult = {
  attestation: string;
  userInput: string;
  reportDataHex: string;
  reportDataDerivation: string;
};

export async function v1AttestAction(
  userInput: string,
): Promise<ActionResult<V1AttestResult>> {
  try {
    if (!userInput) throw new Error("reportData required");
    // Hash under a tag so the 64-byte report data cannot collide with RA-TLS.
    const reportData = createHash("sha512")
      .update("app-data:")
      .update(userInput)
      .digest();
    const res = await new DstackClient().attest(reportData);
    return {
      ok: true,
      data: {
        attestation: hex(res.attestation),
        userInput,
        reportDataHex: hex(reportData),
        reportDataDerivation: REPORT_DATA_DERIVATION,
      },
    };
  } catch (err) {
    return errorResult(err);
  }
}

export type V1IssueCertResult = {
  key: string;
  certificateChain: string[];
};

export async function v1IssueCertAction(input: {
  subject?: string;
  altNames?: string[];
  usageRaTls?: boolean;
}): Promise<ActionResult<V1IssueCertResult>> {
  try {
    const res = await new DstackClient().issueCert(input);
    return {
      ok: true,
      data: { key: res.key, certificateChain: res.certificate_chain },
    };
  } catch (err) {
    return errorResult(err);
  }
}

export async function v1EthAccountAction(input: {
  domain: string;
  message?: string;
}): Promise<ActionResult<{ address: string; signature?: string }>> {
  try {
    const res = await new DstackClient().getKey(input.domain, "secp256k1");
    const account = privateKeyToAccount(`0x${hex(res.key)}`);
    const signature = input.message
      ? await account.signMessage({ message: input.message })
      : undefined;
    return { ok: true, data: { address: account.address, signature } };
  } catch (err) {
    return errorResult(err);
  }
}

export async function v1SolanaAccountAction(input: {
  domain: string;
}): Promise<ActionResult<{ publicKey: string }>> {
  try {
    const res = await new DstackClient().getKey(input.domain, "ed25519");
    const keypair = Keypair.fromSeed(res.key);
    return { ok: true, data: { publicKey: keypair.publicKey.toBase58() } };
  } catch (err) {
    return errorResult(err);
  }
}
