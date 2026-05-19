"use client";

import { useState, useTransition } from "react";
import {
  attestAction,
  getQuoteAction,
  infoAction,
} from "@/app/actions/attestation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ResultPanel } from "@/components/result-panel";

export function AttestationTab() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <GetQuoteCard />
      <AttestCard />
      <InfoCard />
    </div>
  );
}

function GetQuoteCard() {
  const [reportData, setReportData] = useState("hello-dstack");
  const [result, setResult] = useState<unknown>(null);
  const [pending, start] = useTransition();
  return (
    <Card>
      <CardHeader>
        <CardTitle>getQuote</CardTitle>
        <CardDescription>
          Generate a raw TDX quote with up to 64 bytes of caller-supplied report
          data. Returns the quote, event log, and replayed RTMR values.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-1.5">
          <Label htmlFor="quote-rd">reportData (≤64 bytes)</Label>
          <Input
            id="quote-rd"
            value={reportData}
            onChange={(e) => setReportData(e.target.value)}
          />
        </div>
        <Button
          disabled={pending}
          onClick={() => start(async () => setResult(await getQuoteAction(reportData)))}
        >
          Generate quote
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
          Generate a versioned dstack attestation (works across TDX / GCP / Nitro
          providers). Cleaner than raw quote for cross-platform deployments.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-1.5">
          <Label htmlFor="attest-rd">reportData (≤64 bytes)</Label>
          <Input
            id="attest-rd"
            value={reportData}
            onChange={(e) => setReportData(e.target.value)}
          />
        </div>
        <Button
          disabled={pending}
          onClick={() => start(async () => setResult(await attestAction(reportData)))}
        >
          Attest
        </Button>
        <Separator />
        <ResultPanel result={result} pending={pending} />
      </CardContent>
    </Card>
  );
}

function InfoCard() {
  const [result, setResult] = useState<unknown>(null);
  const [pending, start] = useTransition();
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>info</CardTitle>
        <CardDescription>
          App identity, TCB info, cloud vendor/product, compose hash, vm config.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          disabled={pending}
          onClick={() => start(async () => setResult(await infoAction()))}
        >
          Get info
        </Button>
        <Separator />
        <ResultPanel result={result} pending={pending} />
      </CardContent>
    </Card>
  );
}
