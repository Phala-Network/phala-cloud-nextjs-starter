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

This starter uses the frozen v0 guest API (`DstackClientV0` from `@phala/dstack-sdk` 0.6.0). Local development needs a running dstack guest-agent simulator (Linux). See [sdk/simulator](https://github.com/Dstack-TEE/dstack/tree/next/sdk/simulator).

Point the SDK at it with `DSTACK_SIMULATOR_ENDPOINT` — a unix socket path, or an `http://` / `https://` URL (the v0 client accepts both). Set it in `.env.local` (see `env.local.example`) or export it:

```shell
export DSTACK_SIMULATOR_ENDPOINT=/path/to/dstack.sock
# or: export DSTACK_SIMULATOR_ENDPOINT=http://127.0.0.1:8090
```

Then start the Next.js development server:

```shell
yarn dev
```

By default, the Next.js development server will listen on port 3000. Open http://127.0.0.1:3000/ in your browser and check.

The Attestation tab hashes caller input as `sha512("app-data:" || utf8(input))`
before it becomes TDX `report_data`, so a quote cannot be reused as an RA-TLS
client certificate. The result includes the original input and the derivation.

This repo also includes code snippets for the following common use cases:

The UI tabs call `DstackClientV0` (`getKey`, `getQuote`, `getTlsKey`, `info`, `sign` / `verify`, `emitEvent`) plus `encryptEnvVars` / `getComposeHash` helpers.

## Build

You need to build the image and push it to DockerHub for deployment. The following instructions are for publishing to a public registry via DockerHub:

```shell
sudo docker build . -t leechael/phala-cloud-nextjs-starter
sudo docker push leechael/phala-cloud-nextjs-starter
```

## Deploy

You can copy and paste the `docker-compose.yml` file from this repo to deploy to Phala Cloud, follow the [tutorial](https://docs.phala.network/phala-cloud/create-cvm/create-with-docker-compose) in the Phala Docs.
