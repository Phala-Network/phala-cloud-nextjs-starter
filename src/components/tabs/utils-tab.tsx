"use client";

import { useState, useTransition } from "react";
import { composeHashAction } from "@/app/actions/utils";
import {
  encryptEnvAction,
  fetchAndVerifyPubKeyAction,
} from "@/app/actions/env-encrypt";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ResultPanel } from "@/components/result-panel";

const DEFAULT_COMPOSE = `{
  "manifest_version": 2,
  "name": "my-app",
  "runner": "docker-compose",
  "docker_compose_file": "version: '3'\\nservices:\\n  app:\\n    image: nginx",
  "kms_enabled": true,
  "gateway_enabled": true,
  "allowed_envs": ["FOO", "BAR"]
}`;

const DEFAULT_ENVS = `[
  {"key": "DATABASE_URL", "value": "postgresql://user:pass@host:5432/db"},
  {"key": "API_KEY", "value": "sk-test-1234"}
]`;

export function UtilsTab() {
  return (
    <div className="grid gap-4">
      <ComposeHashCard />
      <KmsEncryptEnvCard />
    </div>
  );
}

function ComposeHashCard() {
  const [json, setJson] = useState(DEFAULT_COMPOSE);
  const [result, setResult] = useState<unknown>(null);
  const [pending, start] = useTransition();
  return (
    <Card>
      <CardHeader>
        <CardTitle>getComposeHash</CardTitle>
        <CardDescription>
          Hash a docker-compose / app config object deterministically. This is
          the same hash used by the on-chain KMS allowlist. Pure function — no
          TEE call required.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-1.5">
          <Label htmlFor="ch-json">app compose JSON</Label>
          <Textarea
            id="ch-json"
            value={json}
            onChange={(e) => setJson(e.target.value)}
            rows={10}
            className="font-mono text-xs"
          />
        </div>
        <Button
          disabled={pending}
          onClick={() =>
            start(async () => setResult(await composeHashAction({ appComposeJson: json })))
          }
        >
          Compute hash
        </Button>
        <Separator />
        <ResultPanel result={result} pending={pending} />
      </CardContent>
    </Card>
  );
}

function KmsEncryptEnvCard() {
  const [kmsUrl, setKmsUrl] = useState("");
  const [appId, setAppId] = useState("");
  const [envsJson, setEnvsJson] = useState(DEFAULT_ENVS);
  const [publicKey, setPublicKey] = useState("");
  const [fetchResult, setFetchResult] = useState<unknown>(null);
  const [encryptResult, setEncryptResult] = useState<unknown>(null);
  const [pending, start] = useTransition();

  return (
    <Card>
      <CardHeader>
        <CardTitle>verifyEnvEncryptPublicKey + encryptEnvVars</CardTitle>
        <CardDescription>
          Mirrors the <code className="text-xs">vmm-cli.py</code> flow: fetch
          the env-encrypt public key from KMS via{" "}
          <code className="text-xs">/prpc/GetAppEnvEncryptPubKey</code>, verify
          its signature (v1 with timestamp, or legacy), then ECIES-encrypt env
          vars against the verified key.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="grid gap-1.5">
            <Label htmlFor="kms-url">KMS URL</Label>
            <Input
              id="kms-url"
              value={kmsUrl}
              onChange={(e) => setKmsUrl(e.target.value)}
              placeholder="https://kms.example.com:8443"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="kms-app">app_id (hex, 20 bytes)</Label>
            <Input
              id="kms-app"
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
              placeholder="0x…"
              className="font-mono text-xs"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            disabled={pending}
            onClick={() =>
              start(async () => {
                setEncryptResult(null);
                setPublicKey("");
                const res = await fetchAndVerifyPubKeyAction({ kmsUrl, appId });
                setFetchResult(res);
                if (res.ok) setPublicKey(res.data.publicKey);
              })
            }
          >
            Fetch &amp; verify pub key
          </Button>
          {publicKey ? (
            <Badge variant="outline" className="font-mono text-[10px]">
              pubkey loaded: {publicKey.slice(0, 12)}…
            </Badge>
          ) : null}
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs uppercase text-muted-foreground">
            Step 1 — KMS fetch + signature verify
          </Label>
          <ResultPanel result={fetchResult} pending={pending && !publicKey} />
        </div>

        <Separator />

        <div className="grid gap-1.5">
          <Label htmlFor="env-vars">
            env vars (JSON array of {`{key, value}`})
          </Label>
          <Textarea
            id="env-vars"
            value={envsJson}
            onChange={(e) => setEnvsJson(e.target.value)}
            rows={6}
            className="font-mono text-xs"
          />
        </div>
        <Button
          disabled={pending || !publicKey}
          onClick={() =>
            start(async () => {
              try {
                const envs = JSON.parse(envsJson);
                setEncryptResult(
                  await encryptEnvAction({ publicKeyHex: publicKey, envs }),
                );
              } catch (err) {
                setEncryptResult({
                  ok: false,
                  error: err instanceof Error ? err.message : String(err),
                });
              }
            })
          }
        >
          Encrypt env vars
        </Button>
        <div className="space-y-1.5">
          <Label className="text-xs uppercase text-muted-foreground">
            Step 2 — ECIES encrypt
          </Label>
          <ResultPanel result={encryptResult} />
        </div>
      </CardContent>
    </Card>
  );
}
