import { ethers } from "ethers";
import useSWR from "swr";
import { useCredentialsContext } from "./CredentialsContext";
import { useTurnkeyWalletContext } from "./TurnkeyWalletContext";

export function useHistoryQuery() {
  const { credentials } = useCredentialsContext();
  const { connectedSigner, network } = useTurnkeyWalletContext();
  const { TURNKEY_PRIVATE_KEY_ID, ETHERSCAN_API_KEY } = credentials;

  const cacheKey = ["history", network, TURNKEY_PRIVATE_KEY_ID || "<unknown>"];

  return useSWR(cacheKey, async () => {
    if (connectedSigner == null) {
      throw new Error(`Signer has not been initialized`);
    }
    if (!ETHERSCAN_API_KEY) {
      throw new Error(`Cannot find ETHERSCAN_API_KEY`);
    }

    const address = await connectedSigner.getAddress();
    const etherscanProvider = new ethers.providers.EtherscanProvider(
      network,
      ETHERSCAN_API_KEY
    );

    const transactionList = [
      ...(await etherscanProvider.getHistory(address)),
    ].sort((item1, item2) => (item2.timestamp ?? 0) - (item1.timestamp ?? 0));

    return {
      address,
      transactionList,
    };
  });
}

export function useWalletQuery() {
  const { credentials } = useCredentialsContext();
  const { connectedSigner, network } = useTurnkeyWalletContext();
  const { TURNKEY_PRIVATE_KEY_ID } = credentials;

  const cacheKey = ["wallet", network, TURNKEY_PRIVATE_KEY_ID || "<unknown>"];

  return useSWR(cacheKey, async () => {
    if (connectedSigner == null) {
      throw new Error(`Signer has not been initialized`);
    }

    return {
      address: await connectedSigner.getAddress(),
      balance: await connectedSigner.getBalance(),
      transactionCount: await connectedSigner.getTransactionCount(),
      chainId: await connectedSigner.getChainId(),
    };
  });
}
