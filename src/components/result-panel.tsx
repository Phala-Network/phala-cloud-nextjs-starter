"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

type ActionLike = { ok: true; data: unknown } | { ok: false; error: string };

function isActionResult(x: unknown): x is ActionLike {
  return typeof x === "object" && x !== null && "ok" in x;
}

type Props = {
  result: unknown;
  pending?: boolean;
};

export function ResultPanel({ result, pending }: Props) {
  if (pending) {
    return (
      <div className="rounded-md border bg-muted px-3 py-2 text-xs text-muted-foreground">
        Running…
      </div>
    );
  }
  if (result === null || result === undefined) return null;

  if (isActionResult(result) && !result.ok) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="break-all font-mono text-xs">
          {result.error}
        </AlertDescription>
      </Alert>
    );
  }

  const payload = isActionResult(result) && result.ok ? result.data : result;

  return (
    <pre className="max-h-96 overflow-auto rounded-md border bg-muted px-3 py-2 text-xs font-mono whitespace-pre-wrap break-all">
      {JSON.stringify(payload, null, 2)}
    </pre>
  );
}
