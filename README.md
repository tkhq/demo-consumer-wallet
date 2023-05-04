# Turnkey Demo: Consumer Wallet

## Introduction

This repository features a minimal consumer wallet app powered by Turnkey. Behind the scenes, it uses [`@turnkey/ethers`](https://github.com/tkhq/sdk/tree/main/packages/ethers) for signing and WalletConnect (v1) for accessing dapps.

## Getting started

Make sure you have Node.js installed locally; we recommend using Node v16+.

```bash
$ node --version # v16+
$ git clone https://github.com/tkhq/demo-consumer-wallet
$ cd demo-consumer-wallet/
$ corepack enable # Updates npm for the local project

# *Optional*: prefill your Turnkey credentials in `.env.development.local`.
# Feel free to skip this step; only development builds can use prefilled variables (for convenience)
$ cp .env.example .env.development.local

$ npm install
$ npm start # Follow the instructions on screen to build to your device or a simulator
```

## Technical tl;dr

Create a [`TurnkeySigner`](https://github.com/tkhq/sdk/tree/main/packages/ethers), bring your own provider, then bridge it via EIP-1193:
https://github.com/tkhq/demo-consumer-wallet/blob/7f558c5717ba22993ac3f9a8dfc7a0e0abbaaf4d/src/turnkey/TurnkeyWalletContext.tsx#L59-L73

WalletConnect payloads are signed by Turnkey and broadcasted by your provider, all via the bridge:
https://github.com/tkhq/demo-consumer-wallet/blob/7f558c5717ba22993ac3f9a8dfc7a0e0abbaaf4d/src/screens/WalletConnectScreen.tsx#L218-L222
