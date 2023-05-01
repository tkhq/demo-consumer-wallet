import { ethers } from "ethers";
import useSWR from "swr";
import {
  ETHERSCAN_API_KEY,
  useTurnkeyWalletContext,
} from "./TurnkeyWalletContext";

export function useHistoryQuery() {
  const { connectedSigner, network, privateKeyId } = useTurnkeyWalletContext();

  const cacheKey = ["history", network, privateKeyId];

  return useSWR(cacheKey, async () => {
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
  const { connectedSigner, network, privateKeyId } = useTurnkeyWalletContext();

  const cacheKey = ["wallet", network, privateKeyId];

  return useSWR(cacheKey, async () => {
    return {
      address: await connectedSigner.getAddress(),
      balance: await connectedSigner.getBalance(),
      transactionCount: await connectedSigner.getTransactionCount(),
      chainId: await connectedSigner.getChainId(),
    };
  });
}
