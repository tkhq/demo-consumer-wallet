import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import Ionicons from "@expo/vector-icons/Ionicons";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { TouchableOpacity } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useTypedNavigation, type TStackParamList } from "./navigation";
import { HistoryScreen } from "./screens/HistoryScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { WalletConnectScreen } from "./screens/WalletConnectScreen";
import { TurnkeyWalletContextProvider } from "./turnkey/TurnkeyWalletContext";

const Stack = createNativeStackNavigator<TStackParamList>();

export function AppRoot() {
  return (
    <>
      <TurnkeyWalletContextProvider>
        <ActionSheetProvider>
          <SafeAreaProvider>
            <NavigationContainer>
              <Stack.Navigator initialRouteName="home">
                <Stack.Screen
                  name="home"
                  options={{
                    title: "Wallet",
                    headerLargeTitle: true,
                    headerRight: HistoryButton,
                  }}
                  component={HomeScreen}
                />
                <Stack.Screen
                  name="history"
                  options={{ title: "History", presentation: "modal" }}
                  component={HistoryScreen}
                />
                <Stack.Screen
                  name="walletconnect"
                  options={{ title: "WalletConnect", presentation: "modal" }}
                  component={WalletConnectScreen}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </SafeAreaProvider>
        </ActionSheetProvider>
      </TurnkeyWalletContextProvider>

      <StatusBar style="auto" />
    </>
  );
}

function HistoryButton() {
  const navigation = useTypedNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("history");
      }}
    >
      <Ionicons name="book-outline" size={24} />
    </TouchableOpacity>
  );
}
