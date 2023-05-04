# Turnkey Demo: Consumer Wallet

## Introduction

This repository features a minimal consumer wallet app powered by Turnkey. Behind the scenes, it uses [`@turnkey/ethers`](https://github.com/tkhq/sdk/tree/main/packages/ethers) for signing and WalletConnect (v1) for accessing dapps.

## Getting started

```bash
$ corepack enable # Updates npm for the local project

# Optional: prefill your credentials in `.env.development.local`.
# Only development builds can use prefilled variables.
$ cp .env.example .env.development.local

$ npm install
$ npm start
```
