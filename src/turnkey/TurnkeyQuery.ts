import useSWR from "swr";
import {
  useTurnkeyWalletContext,
  ETHERSCAN_API_KEY,
} from "./TurnkeyWalletContext";
import { ethers } from "ethers";

export function useHistoryQuery() {
  const { signer, network, privateKeyId } = useTurnkeyWalletContext();

  return useSWR(`/history/${network}/${privateKeyId}`, async () => {
    const address = await signer.getAddress();
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
  const { signer, network, privateKeyId } = useTurnkeyWalletContext();

  return useSWR(`/wallet/${network}/${privateKeyId}`, async () => {
    return {
      address: await signer.getAddress(),
      balance: await signer.getBalance(),
      transactionCount: await signer.getTransactionCount(),
      chainId: await signer.getChainId(),
    };
  });
}
