"use client";

import { useState, useTransition } from "react";
import {
  emitEventAction,
  signAction,
  verifyAction,
} from "@/app/actions/sign-verify";
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

export function SignVerifyTab() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <SignAndVerifyCard />
      <EmitEventCard />
    </div>
  );
}

function SignAndVerifyCard() {
  const [algorithm, setAlgorithm] = useState("ed25519");
  const [message, setMessage] = useState("dstack sign demo");
  const [signed, setSigned] = useState<{ signature: string; publicKey: string } | null>(null);
  const [signResult, setSignResult] = useState<unknown>(null);
  const [verifyResult, setVerifyResult] = useState<unknown>(null);
  const [pending, start] = useTransition();

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>sign + verify</CardTitle>
        <CardDescription>
          Sign with a derived key, then verify. ed25519 / secp256k1 supported
          (require OS ≥ 0.5.7). Verify reuses the signature & public key from
          the previous sign step.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="grid gap-1.5">
            <Label htmlFor="sign-algo">algorithm</Label>
            <Select value={algorithm} onValueChange={(v) => v && setAlgorithm(v)}>
              <SelectTrigger id="sign-algo">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ed25519">ed25519</SelectItem>
                <SelectItem value="secp256k1">secp256k1</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="sign-msg">message</Label>
            <Input
              id="sign-msg"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            disabled={pending}
            onClick={() =>
              start(async () => {
                const res = await signAction({ algorithm, message });
                setSignResult(res);
                if (res.ok) {
                  setSigned({
                    signature: res.data.signature,
                    publicKey: res.data.publicKey,
                  });
                }
                setVerifyResult(null);
              })
            }
          >
            Sign
          </Button>
          <Button
            variant="outline"
            disabled={pending || !signed}
            onClick={() =>
              start(async () => {
                if (!signed) return;
                setVerifyResult(
                  await verifyAction({
                    algorithm,
                    message,
                    signatureHex: signed.signature,
                    publicKeyHex: signed.publicKey,
                  }),
                );
              })
            }
          >
            Verify
          </Button>
          <Button
            variant="ghost"
            disabled={pending || !signed}
            onClick={() =>
              start(async () => {
                if (!signed) return;
                setVerifyResult(
                  await verifyAction({
                    algorithm,
                    message: message + "_tampered",
                    signatureHex: signed.signature,
                    publicKeyHex: signed.publicKey,
                  }),
                );
              })
            }
          >
            Verify with tampered message
          </Button>
        </div>
        <Separator />
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs uppercase text-muted-foreground">Sign result</Label>
            <ResultPanel result={signResult} pending={pending && !signed} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs uppercase text-muted-foreground">Verify result</Label>
            <ResultPanel result={verifyResult} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmitEventCard() {
  const [event, setEvent] = useState("app:config_loaded");
  const [payload, setPayload] = useState("v1.0.0");
  const [result, setResult] = useState<unknown>(null);
  const [pending, start] = useTransition();
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>emitEvent</CardTitle>
        <CardDescription>
          Extend RTMR3 with a custom event. The event is replayed in the next
          quote's event log. Requires OS ≥ 0.5.0.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="grid gap-1.5">
            <Label htmlFor="ee-event">event</Label>
            <Input id="ee-event" value={event} onChange={(e) => setEvent(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="ee-payload">payload</Label>
            <Input id="ee-payload" value={payload} onChange={(e) => setPayload(e.target.value)} />
          </div>
        </div>
        <Button
          disabled={pending}
          onClick={() =>
            start(async () => setResult(await emitEventAction({ event, payload })))
          }
        >
          Emit event
        </Button>
        <Separator />
        <ResultPanel result={result} pending={pending} />
      </CardContent>
    </Card>
  );
}
