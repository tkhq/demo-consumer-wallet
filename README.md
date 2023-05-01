# Turnkey Demo: Consumer Wallet

## Introduction

This repository features a minimal consumer wallet app powered by Turnkey. Behind the scenes, it uses [`@turnkey/ethers`](https://github.com/tkhq/sdk/tree/main/packages/ethers) for signing and WalletConnect (v1) for accessing dapps.

## Getting started

```bash
$ corepack enable # Updates npm for the local project

$ cp .env.example .env # Now update your credentials in `.env`
$ npm install
$ npm start
# Press `i` to open the app in iOS Simulator. Install Xcode if you don't have it already.
```
