import type { TAlchemyNetwork } from "./turnkey/TurnkeyWalletContext";

export function getNetworkDisplayValue(network: TAlchemyNetwork): string {
  return network === "homestead" ? "mainnet" : network;
}
