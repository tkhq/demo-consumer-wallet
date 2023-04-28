import type { TAlchemyNetwork } from "./turnkey/TurnkeyWalletContext";

export function getNetworkDisplayValue(network: TAlchemyNetwork): string {
  return network === "homestead" ? "mainnet" : network;
}

export function getEtherscanUrl(
  urlPath: string,
  network: TAlchemyNetwork
): string {
  return new URL(
    urlPath,
    network === "homestead"
      ? `https://etherscan.io/`
      : `https://${network}.etherscan.io/`
  ).href;
}
