import { useNavigation } from "@react-navigation/native";
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

export type TStackParamList = {
  home: undefined;
  history: undefined;
  walletconnect: { uri: string };
  scanner: undefined;
  settings: undefined;
};

export type TWalletConnectScreenProps = NativeStackScreenProps<
  TStackParamList,
  "walletconnect"
>;

export function useTypedNavigation() {
  return useNavigation<NativeStackNavigationProp<TStackParamList>>();
}
