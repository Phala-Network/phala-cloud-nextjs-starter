"use server";

import { DstackClient } from "@phala/dstack-sdk";
import type { ActionResult } from "./keys";

export type GetQuoteResult = {
  quote: string;
  eventLog: string;
  reportData?: string;
  vmConfig?: string;
  rtmrs: string[];
};

export async function getQuoteAction(
  reportData: string,
): Promise<ActionResult<GetQuoteResult>> {
  try {
    if (!reportData) throw new Error("reportData required");
    const client = new DstackClient();
    const res = await client.getQuote(reportData);
    return {
      ok: true,
      data: {
        quote: res.quote,
        eventLog: res.event_log,
        reportData: res.report_data,
        vmConfig: res.vm_config,
        rtmrs: res.replayRtmrs(),
      },
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export type AttestResult = {
  attestation: string;
};

export async function attestAction(
  reportData: string,
): Promise<ActionResult<AttestResult>> {
  try {
    if (!reportData) throw new Error("reportData required");
    const client = new DstackClient();
    const res = await client.attest(reportData);
    return { ok: true, data: { attestation: res.attestation } };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export type InfoResult = {
  appId: string;
  instanceId: string;
  appName: string;
  deviceId: string;
  composeHash: string;
  osImageHash?: string;
  mrAggregated?: string;
  keyProviderInfo: string;
  vmConfig?: string;
  cloudVendor?: string;
  cloudProduct?: string;
  tcbInfo: unknown;
};

export async function infoAction(): Promise<ActionResult<InfoResult>> {
  try {
    const client = new DstackClient();
    const res = await client.info();
    return {
      ok: true,
      data: {
        appId: res.app_id,
        instanceId: res.instance_id,
        appName: res.app_name,
        deviceId: res.device_id,
        composeHash: res.compose_hash,
        osImageHash: res.os_image_hash,
        mrAggregated: res.mr_aggregated,
        keyProviderInfo: res.key_provider_info,
        vmConfig: res.vm_config,
        cloudVendor: res.cloud_vendor,
        cloudProduct: res.cloud_product,
        tcbInfo: res.tcb_info,
      },
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
