"use client";

import { useState, useTransition } from "react";
import {
  ethAccountAction,
  solanaAccountAction,
} from "@/app/actions/blockchain";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ResultPanel } from "@/components/result-panel";

export function BlockchainTab() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <EthCard />
      <SolanaCard />
    </div>
  );
}

function EthCard() {
  const [path, setPath] = useState("wallet/ethereum");
  const [message, setMessage] = useState("hello dstack");
  const [result, setResult] = useState<unknown>(null);
  const [pending, start] = useTransition();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ethereum (viem)</CardTitle>
        <CardDescription>
          <code className="text-xs">toViemAccountSecure</code> derives an
          ethereum account from a TEE key via SHA256. Optionally signs a message
          with that account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-1.5">
          <Label htmlFor="eth-path">key path</Label>
          <Input id="eth-path" value={path} onChange={(e) => setPath(e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="eth-msg">message (optional, signed if present)</Label>
          <Input
            id="eth-msg"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="(leave empty for address only)"
          />
        </div>
        <Button
          disabled={pending}
          onClick={() =>
            start(async () =>
              setResult(await ethAccountAction({ path, message: message || undefined })),
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
  const [path, setPath] = useState("wallet/solana");
  const [result, setResult] = useState<unknown>(null);
  const [pending, start] = useTransition();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Solana (@solana/web3.js)</CardTitle>
        <CardDescription>
          <code className="text-xs">toKeypairSecure</code> derives a Solana
          Keypair from a TEE key via SHA256. Shows the base58 public key.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-1.5">
          <Label htmlFor="sol-path">key path</Label>
          <Input id="sol-path" value={path} onChange={(e) => setPath(e.target.value)} />
        </div>
        <Button
          disabled={pending}
          onClick={() =>
            start(async () => setResult(await solanaAccountAction({ path })))
          }
        >
          Derive solana keypair
        </Button>
        <Separator />
        <ResultPanel result={result} pending={pending} />
      </CardContent>
    </Card>
  );
}
