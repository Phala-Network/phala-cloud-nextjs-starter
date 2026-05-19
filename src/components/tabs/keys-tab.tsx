"use client";

import { useState, useTransition } from "react";
import { getKeyAction, getTlsKeyAction } from "@/app/actions/keys";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ResultPanel } from "@/components/result-panel";

export function KeysTab() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <GetKeyCard />
      <GetTlsKeyCard />
    </div>
  );
}

function GetKeyCard() {
  const [path, setPath] = useState("wallet/eth");
  const [purpose, setPurpose] = useState("");
  const [algorithm, setAlgorithm] = useState("secp256k1");
  const [result, setResult] = useState<unknown>(null);
  const [pending, start] = useTransition();

  return (
    <Card>
      <CardHeader>
        <CardTitle>getKey</CardTitle>
        <CardDescription>
          Derive a deterministic key bound to the app identity. Same path → same
          key. Supports secp256k1 / ed25519 (latter requires OS ≥ 0.5.7).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-1.5">
          <Label htmlFor="key-path">path</Label>
          <Input
            id="key-path"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="(empty)"
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="key-purpose">purpose</Label>
          <Input
            id="key-purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="(optional)"
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="key-algo">algorithm</Label>
          <Select value={algorithm} onValueChange={(v) => v && setAlgorithm(v)}>
            <SelectTrigger id="key-algo">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="secp256k1">secp256k1</SelectItem>
              <SelectItem value="k256">k256 (alias)</SelectItem>
              <SelectItem value="ed25519">ed25519 (OS ≥ 0.5.7)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          disabled={pending}
          onClick={() => start(async () => setResult(await getKeyAction({ path, purpose, algorithm })))}
        >
          Derive key
        </Button>
        <Separator />
        <ResultPanel result={result} pending={pending} />
      </CardContent>
    </Card>
  );
}

function GetTlsKeyCard() {
  const [subject, setSubject] = useState("api.example.com");
  const [altNames, setAltNames] = useState("localhost,127.0.0.1");
  const [usageRaTls, setUsageRaTls] = useState(false);
  const [withAppInfo, setWithAppInfo] = useState(false);
  const [result, setResult] = useState<unknown>(null);
  const [pending, start] = useTransition();

  return (
    <Card>
      <CardHeader>
        <CardTitle>getTlsKey</CardTitle>
        <CardDescription>
          Generate a fresh TLS keypair + certificate chain. Each call produces a
          new key. <code className="text-xs">withAppInfo</code> requires OS ≥
          0.5.7.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-1.5">
          <Label htmlFor="tls-subject">subject</Label>
          <Input id="tls-subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="tls-alt">altNames (comma separated)</Label>
          <Input
            id="tls-alt"
            value={altNames}
            onChange={(e) => setAltNames(e.target.value)}
            placeholder="localhost,127.0.0.1"
          />
        </div>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={usageRaTls}
              onChange={(e) => setUsageRaTls(e.target.checked)}
            />
            usageRaTls
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={withAppInfo}
              onChange={(e) => setWithAppInfo(e.target.checked)}
            />
            withAppInfo
          </label>
        </div>
        <Button
          disabled={pending}
          onClick={() =>
            start(async () =>
              setResult(
                await getTlsKeyAction({
                  subject,
                  altNames: altNames
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                  usageRaTls,
                  withAppInfo: withAppInfo || undefined,
                }),
              ),
            )
          }
        >
          Generate TLS key
        </Button>
        <Separator />
        <ResultPanel result={result} pending={pending} />
      </CardContent>
    </Card>
  );
}
