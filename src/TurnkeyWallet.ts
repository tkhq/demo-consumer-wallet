import { TurnkeySigner } from "@turnkey/ethers";
import { ethers } from "ethers";
import ExpoConstants from "expo-constants";

const TURNKEY_API_PUBLIC_KEY =
  ExpoConstants.manifest?.extra?.TURNKEY_API_PUBLIC_KEY;
const TURNKEY_API_PRIVATE_KEY =
  ExpoConstants.manifest?.extra?.TURNKEY_API_PRIVATE_KEY;
const TURNKEY_BASE_URL = ExpoConstants.manifest?.extra?.TURNKEY_BASE_URL;
const TURNKEY_ORGANIZATION_ID =
  ExpoConstants.manifest?.extra?.TURNKEY_ORGANIZATION_ID;
const TURNKEY_PRIVATE_KEY_ID =
  ExpoConstants.manifest?.extra?.TURNKEY_PRIVATE_KEY_ID;
const ALCHEMY_API_KEY = ExpoConstants.manifest?.extra?.ALCHEMY_API_KEY;

const turnkeySigner = new TurnkeySigner({
  apiPublicKey: TURNKEY_API_PUBLIC_KEY,
  apiPrivateKey: TURNKEY_API_PRIVATE_KEY,
  baseUrl: TURNKEY_BASE_URL,
  organizationId: TURNKEY_ORGANIZATION_ID,
  privateKeyId: TURNKEY_PRIVATE_KEY_ID,
});

export const connectedTurnkeySigner = turnkeySigner.connect(
  new ethers.providers.AlchemyProvider("goerli", ALCHEMY_API_KEY)
);
