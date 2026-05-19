"use client";

import { useState, useTransition } from "react";
import { composeHashAction } from "@/app/actions/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
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

export function UtilsTab() {
  return (
    <div className="grid gap-4">
      <ComposeHashCard />
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
