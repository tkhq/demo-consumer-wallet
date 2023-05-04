import type { TInfuraNetwork } from "./turnkey/TurnkeyWalletContext";

export function getNetworkDisplayValue(network: TInfuraNetwork): string {
  return network === "homestead" ? "mainnet" : network;
}

export function getEtherscanUrl(
  urlPath: string,
  network: TInfuraNetwork
): string {
  return new URL(
    urlPath,
    network === "homestead"
      ? `https://etherscan.io/`
      : `https://${network}.etherscan.io/`
  ).href;
}

export function truncateAddress(input: string): string {
  return input.slice(0, 6) + "..." + input.slice(-4);
}

export function assertNonEmptyString(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  x: any,
  name: string
): asserts x is string {
  if (typeof x !== "string" || !x) {
    throw new Error(
      `Expected ${name} to be a non-empty string, got ${JSON.stringify(x)}`
    );
  }
}
