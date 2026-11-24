# Phala Cloud Next.js Starter

[![](https://cloud.phala.network/deploy-button.svg)](https://cloud.phala.network/templates/nextjs-starter)

This is a template for developing a [Next.js](https://nextjs.org/)-based app with boilerplate code targeting deployment on [Phala Cloud](https://cloud.phala.network/) and [DStack](https://github.com/dstack-TEE/dstack/). It includes the SDK by default to make integration with TEE features easier. This repo also includes a default Dockerfile and docker-compose.yml for deployment.

## Requirements
- [Node](https://nodejs.org/en) >= v24
- [yarn](https://yarnpkg.com/)
- Docker or Orbstack

## Development

First, you need to clone this repo:

```shell
git clone --depth 1 https://github.com/Phala-Network/phala-cloud-nextjs-starter.git
```

Next, let's initialize the development environment:

```shell
yarn
cp env.local.example .env.local
```

This starter demos the dstack guest API v1 (`DstackClient` from `@phala/dstack-sdk` 0.6.0). v1 needs dstack OS >= 0.6.0 (guest agent >= 0.6.0). On Phala Cloud, CPU images dstack-0.6.x have it; GPU images are still 0.5.15 and only speak v0 (see [Legacy v0](#legacy-v0)). Local development needs a running dstack guest-agent simulator (Linux) that serves v1. See [sdk/simulator](https://github.com/Dstack-TEE/dstack/tree/next/sdk/simulator).

Point the SDK at it with `DSTACK_SIMULATOR_ENDPOINT` — a unix socket path, or an `http://` / `https://` URL. Set it in `.env.local` (see `env.local.example`) or export it:

```shell
export DSTACK_SIMULATOR_ENDPOINT=/path/to/dstack.sock
# or: export DSTACK_SIMULATOR_ENDPOINT=http://127.0.0.1:8090
```

Then start the Next.js development server:

```shell
yarn dev
```

By default, the Next.js development server will listen on port 3000. Open http://127.0.0.1:3000/ in your browser and check.

The v1 tab hashes caller input as `sha512("app-data:" || utf8(input))`
before it becomes TDX `report_data`, so a quote cannot be reused as an RA-TLS
client certificate. The result includes the original input and the derivation.

The v1 tab calls `DstackClient` (`info`, `version`, `getKey`, `attest`, `issueCert`) and builds an Ethereum account (viem `privateKeyToAccount`) and a Solana keypair (`Keypair.fromSeed`) from `getKey` bytes:

```ts
import { DstackClient } from "@phala/dstack-sdk";

const client = new DstackClient();
const { key } = await client.getKey("wallet/ethereum", "secp256k1"); // 32 bytes
const { attestation } = await client.attest(Buffer.from("my-report-data")); // 1-64 bytes
```

Do not hold assets in a wallet derived from `getKey`: the key is a function of the KMS root, so these wallets suit demos and low-value or rotatable signing only. See the [dstack SDK warning](https://github.com/Dstack-TEE/dstack/blob/next/sdk/js/README.md#blockchain-helpers).

The "Compose & Env" tab (`getComposeHash`, `encryptEnvVars`) needs no guest agent and works with either API.

## Legacy v0

The "v0 (legacy)" tab keeps the previous `DstackClientV0` examples (`getKey`, `getQuote`, `getTlsKey`, `info`, `sign` / `verify`, `emitEvent`, viem / solana adapters). Use it only if your app already published keys derived with v0, or you run on dstack OS < 0.6 such as current GPU images.

> **v1 keys are not v0 keys.** `getKey` derives different key material on the two APIs for the same name, and there is no migration path back. An app that has published v0-derived addresses or keys must keep using `DstackClientV0`.

## Build

You need to build the image and push it to DockerHub for deployment. The following instructions are for publishing to a public registry via DockerHub:

```shell
sudo docker build . -t leechael/phala-cloud-nextjs-starter
sudo docker push leechael/phala-cloud-nextjs-starter
```

## Deploy

You can copy and paste the `docker-compose.yml` file from this repo to deploy to Phala Cloud, follow the [tutorial](https://docs.phala.network/phala-cloud/create-cvm/create-with-docker-compose) in the Phala Docs.
