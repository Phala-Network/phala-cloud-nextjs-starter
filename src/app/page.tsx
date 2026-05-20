import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { KeysTab } from "@/components/tabs/keys-tab";
import { AttestationTab } from "@/components/tabs/attestation-tab";
import { SignVerifyTab } from "@/components/tabs/sign-verify-tab";
import { BlockchainTab } from "@/components/tabs/blockchain-tab";
import { UtilsTab } from "@/components/tabs/utils-tab";
import { DiagnosticsTab } from "@/components/tabs/diagnostics-tab";
import pkg from "../../package.json";

const SDK_VERSION =
  pkg.dependencies["@phala/dstack-sdk"]?.replace(/^[\^~]/, "") ?? "unknown";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 space-y-8">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold tracking-tight">
            Phala Cloud × dstack SDK
          </h1>
          <Badge variant="secondary" className="font-mono">
            @phala/dstack-sdk@{SDK_VERSION}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground max-w-3xl">
          Interactive demo of every <code className="text-xs">DstackClient</code>{" "}
          method plus the viem / solana / compose-hash helpers. Each tab maps to
          one capability surface; each card runs a server action talking to the
          guest agent on <code className="text-xs">/var/run/dstack.sock</code>{" "}
          (or whatever <code className="text-xs">DSTACK_SIMULATOR_ENDPOINT</code>{" "}
          you have set).
        </p>
      </header>

      <Separator />

      <Tabs defaultValue="keys" className="w-full flex-col">
        <TabsList className="flex w-fit flex-wrap h-auto gap-1">
          <TabsTrigger value="keys">Keys</TabsTrigger>
          <TabsTrigger value="attestation">Attestation</TabsTrigger>
          <TabsTrigger value="sign">Sign &amp; Verify</TabsTrigger>
          <TabsTrigger value="chain">Blockchain</TabsTrigger>
          <TabsTrigger value="utils">Compose &amp; Env</TabsTrigger>
          <TabsTrigger value="diag">Diagnostics</TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="mt-6">
          <KeysTab />
        </TabsContent>
        <TabsContent value="attestation" className="mt-6">
          <AttestationTab />
        </TabsContent>
        <TabsContent value="sign" className="mt-6">
          <SignVerifyTab />
        </TabsContent>
        <TabsContent value="chain" className="mt-6">
          <BlockchainTab />
        </TabsContent>
        <TabsContent value="utils" className="mt-6">
          <UtilsTab />
        </TabsContent>
        <TabsContent value="diag" className="mt-6">
          <DiagnosticsTab />
        </TabsContent>
      </Tabs>
    </main>
  );
}
