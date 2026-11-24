"use client";

import { useState, useTransition } from "react";
import {
  v1AttestAction,
  v1EthAccountAction,
  v1GetKeyAction,
  v1InfoAction,
  v1IssueCertAction,
  v1SolanaAccountAction,
  v1VersionAction,
} from "@/app/actions/v1";
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

export function V1Tab() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <InfoCard />
      <GetKeyCard />
      <AttestCard />
      <IssueCertCard />
      <EthCard />
      <SolanaCard />
    </div>
  );
}

function InfoCard() {
  const [result, setResult] = useState<unknown>(null);
  const [pending, start] = useTransition();
  return (
    <Card>
      <CardHeader>
        <CardTitle>info / version</CardTitle>
        <CardDescription>
          App identity from the guest agent, and the agent version. A 404 error
          means the agent predates v1 (dstack OS &lt; 0.6.0).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Button disabled={pending} onClick={() => start(async () => setResult(await v1InfoAction()))}>
            Get info
          </Button>
          <Button
            variant="outline"
            disabled={pending}
            onClick={() => start(async () => setResult(await v1VersionAction()))}
          >
            Get version
          </Button>
        </div>
        <Separator />
        <ResultPanel result={result} pending={pending} />
      </CardContent>
    </Card>
  );
}

function GetKeyCard() {
  const [domain, setDomain] = useState("storage-encryption");
  const [algorithm, setAlgorithm] = useState<"secp256k1" | "ed25519">("secp256k1");
  const [result, setResult] = useState<unknown>(null);
  const [pending, start] = useTransition();
  return (
    <Card>
      <CardHeader>
        <CardTitle>getKey</CardTitle>
        <CardDescription>
          Derive a deterministic key. Same domain and algorithm give the same
          key.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-1.5">
          <Label htmlFor="v1-key-domain">domain</Label>
          <Input id="v1-key-domain" value={domain} onChange={(e) => setDomain(e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="v1-key-algo">algorithm</Label>
          <Select
            value={algorithm}
            onValueChange={(v) => v && setAlgorithm(v as "secp256k1" | "ed25519")}
          >
            <SelectTrigger id="v1-key-algo">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="secp256k1">secp256k1</SelectItem>
              <SelectItem value="ed25519">ed25519</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          disabled={pending}
          onClick={() => start(async () => setResult(await v1GetKeyAction({ domain, algorithm })))}
        >
          Derive key
        </Button>
        <Separator />
        <ResultPanel result={result} pending={pending} />
      </CardContent>
    </Card>
  );
}

function AttestCard() {
  const [reportData, setReportData] = useState("hello-dstack");
  const [result, setResult] = useState<unknown>(null);
  const [pending, start] = useTransition();
  return (
    <Card>
      <CardHeader>
        <CardTitle>attest</CardTitle>
        <CardDescription>
          Versioned attestation bound to your report data. Input is hashed as
          sha512(&quot;app-data:&quot; || utf8(input)) to fill the 64-byte
          report data.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-1.5">
          <Label htmlFor="v1-attest-rd">user input</Label>
          <Input id="v1-attest-rd" value={reportData} onChange={(e) => setReportData(e.target.value)} />
        </div>
        <Button disabled={pending} onClick={() => start(async () => setResult(await v1AttestAction(reportData)))}>
          Attest
        </Button>
        <Separator />
        <ResultPanel result={result} pending={pending} />
      </CardContent>
    </Card>
  );
}

function IssueCertCard() {
  const [subject, setSubject] = useState("api.example.com");
  const [altNames, setAltNames] = useState("localhost,127.0.0.1");
  const [usageRaTls, setUsageRaTls] = useState(false);
  const [result, setResult] = useState<unknown>(null);
  const [pending, start] = useTransition();
  return (
    <Card>
      <CardHeader>
        <CardTitle>issueCert (TLS key)</CardTitle>
        <CardDescription>
          Generate a fresh TLS keypair and certificate chain. Each call returns
          a new key.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-1.5">
          <Label htmlFor="v1-tls-subject">subject</Label>
          <Input id="v1-tls-subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="v1-tls-alt">altNames (comma separated)</Label>
          <Input id="v1-tls-alt" value={altNames} onChange={(e) => setAltNames(e.target.value)} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={usageRaTls} onChange={(e) => setUsageRaTls(e.target.checked)} />
          usageRaTls
        </label>
        <Button
          disabled={pending}
          onClick={() =>
            start(async () =>
              setResult(
                await v1IssueCertAction({
                  subject,
                  altNames: altNames
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                  usageRaTls,
                }),
              ),
            )
          }
        >
          Issue cert
        </Button>
        <Separator />
        <ResultPanel result={result} pending={pending} />
      </CardContent>
    </Card>
  );
}

function EthCard() {
  const [domain, setDomain] = useState("wallet/ethereum");
  const [message, setMessage] = useState("hello dstack");
  const [result, setResult] = useState<unknown>(null);
  const [pending, start] = useTransition();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ethereum (viem)</CardTitle>
        <CardDescription>
          secp256k1 key from <code className="text-xs">getKey</code> passed to{" "}
          <code className="text-xs">privateKeyToAccount</code>. Optionally signs
          a message.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-1.5">
          <Label htmlFor="v1-eth-domain">domain</Label>
          <Input id="v1-eth-domain" value={domain} onChange={(e) => setDomain(e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="v1-eth-msg">message (optional, signed if present)</Label>
          <Input id="v1-eth-msg" value={message} onChange={(e) => setMessage(e.target.value)} />
        </div>
        <Button
          disabled={pending}
          onClick={() =>
            start(async () =>
              setResult(await v1EthAccountAction({ domain, message: message || undefined })),
            )
          }
        >
          Derive eth account
        </Button>
        <Separator />
        <ResultPanel result={result} pending={pending} />
      </CardContent>
    </Card>
  );
}

function SolanaCard() {
  const [domain, setDomain] = useState("wallet/solana");
  const [result, setResult] = useState<unknown>(null);
  const [pending, start] = useTransition();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Solana (@solana/web3.js)</CardTitle>
        <CardDescription>
          ed25519 key from <code className="text-xs">getKey</code> used as the
          32-byte seed for <code className="text-xs">Keypair.fromSeed</code>.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-1.5">
          <Label htmlFor="v1-sol-domain">domain</Label>
          <Input id="v1-sol-domain" value={domain} onChange={(e) => setDomain(e.target.value)} />
        </div>
        <Button
          disabled={pending}
          onClick={() => start(async () => setResult(await v1SolanaAccountAction({ domain })))}
        >
          Derive solana keypair
        </Button>
        <Separator />
        <ResultPanel result={result} pending={pending} />
      </CardContent>
    </Card>
  );
}
