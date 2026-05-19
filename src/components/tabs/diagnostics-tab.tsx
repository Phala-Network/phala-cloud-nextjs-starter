"use client";

import { useState, useTransition } from "react";
import {
  isReachableAction,
  versionAction,
} from "@/app/actions/diagnostics";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ResultPanel } from "@/components/result-panel";

export function DiagnosticsTab() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <VersionCard />
      <IsReachableCard />
    </div>
  );
}

function VersionCard() {
  const [result, setResult] = useState<unknown>(null);
  const [pending, start] = useTransition();
  return (
    <Card>
      <CardHeader>
        <CardTitle>version</CardTitle>
        <CardDescription>
          Guest-agent version + git revision. Requires OS ≥ 0.5.7 (errors on
          older).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          disabled={pending}
          onClick={() => start(async () => setResult(await versionAction()))}
        >
          Query version
        </Button>
        <Separator />
        <ResultPanel result={result} pending={pending} />
      </CardContent>
    </Card>
  );
}

function IsReachableCard() {
  const [result, setResult] = useState<unknown>(null);
  const [pending, start] = useTransition();
  return (
    <Card>
      <CardHeader>
        <CardTitle>isReachable</CardTitle>
        <CardDescription>
          500ms health probe against <code className="text-xs">/Info</code>.
          Returns a boolean, never throws.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          disabled={pending}
          onClick={() => start(async () => setResult(await isReachableAction()))}
        >
          Probe
        </Button>
        <Separator />
        <ResultPanel result={result} pending={pending} />
      </CardContent>
    </Card>
  );
}
