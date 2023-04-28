import type { TAlchemyNetwork } from "./TurnkeyWalletContext";

export function getNetworkDisplayValue(network: TAlchemyNetwork): string {
  return network === "homestead" ? "mainnet" : network;
}
