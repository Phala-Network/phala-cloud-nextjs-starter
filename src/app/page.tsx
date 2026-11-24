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
import { V1Tab } from "@/components/tabs/v1-tab";
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
          Interactive demo of the dstack guest API v1 (
          <code className="text-xs">DstackClient</code>). Each card runs a
          server action talking to the guest agent on{" "}
          <code className="text-xs">/var/run/dstack.sock</code> (or whatever{" "}
          <code className="text-xs">DSTACK_SIMULATOR_ENDPOINT</code> you have
          set). Requires dstack OS &gt;= 0.6.0.
        </p>
      </header>

      <Separator />

      <Tabs defaultValue="v1" className="w-full flex-col">
        <TabsList className="flex w-fit flex-wrap h-auto gap-1">
          <TabsTrigger value="v1">v1</TabsTrigger>
          <TabsTrigger value="utils">Compose &amp; Env</TabsTrigger>
          <TabsTrigger value="v0">v0 (legacy)</TabsTrigger>
        </TabsList>
        <TabsContent value="v1" className="mt-6">
          <V1Tab />
        </TabsContent>
        <TabsContent value="utils" className="mt-6">
          <UtilsTab />
        </TabsContent>
        <TabsContent value="v0" className="mt-6 space-y-6">
          <p className="text-sm text-muted-foreground">
            Use v0 only for keys already derived with v0, or on dstack OS &lt;
            0.6 (such as current GPU images).
          </p>
          <V0Tabs />
        </TabsContent>
      </Tabs>
    </main>
  );
}

function V0Tabs() {
  return (
    <Tabs defaultValue="keys" className="w-full flex-col">
      <TabsList className="flex w-fit flex-wrap h-auto gap-1">
        <TabsTrigger value="keys">Keys</TabsTrigger>
        <TabsTrigger value="attestation">Attestation</TabsTrigger>
        <TabsTrigger value="sign">Sign &amp; Verify</TabsTrigger>
        <TabsTrigger value="chain">Blockchain</TabsTrigger>
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
      <TabsContent value="diag" className="mt-6">
        <DiagnosticsTab />
      </TabsContent>
    </Tabs>
  );
}
