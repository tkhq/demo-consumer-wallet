import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import Ionicons from "@expo/vector-icons/Ionicons";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  type NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { TouchableOpacity } from "react-native";
import { RootSiblingParent } from "react-native-root-siblings";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TurnkeyWalletContextProvider } from "./TurnkeyWalletContext";
import { HomeScreen } from "./screens/HomeScreen";
import { SettingsScreen } from "./screens/SettingsScreen";

type TStackParamList = {
  wallet: undefined;
  settings: undefined;
};

const Stack = createNativeStackNavigator<TStackParamList>();

export function AppRoot() {
  return (
    <>
      <TurnkeyWalletContextProvider>
        <ActionSheetProvider>
          <RootSiblingParent>
            <SafeAreaProvider>
              <NavigationContainer>
                <Stack.Navigator initialRouteName="wallet">
                  <Stack.Screen
                    name="wallet"
                    options={{
                      title: "Wallet",
                      headerLargeTitle: true,
                      headerRight: SettingsButton,
                    }}
                    component={HomeScreen}
                  />
                  <Stack.Screen
                    name="settings"
                    options={{ title: "Settings", presentation: "modal" }}
                    component={SettingsScreen}
                  />
                </Stack.Navigator>
              </NavigationContainer>
            </SafeAreaProvider>
          </RootSiblingParent>
        </ActionSheetProvider>
      </TurnkeyWalletContextProvider>

      <StatusBar style="auto" />
    </>
  );
}

function SettingsButton() {
  const navigation =
    useNavigation<NativeStackNavigationProp<TStackParamList>>();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("settings");
      }}
    >
      <Ionicons name="settings-outline" size={24} />
    </TouchableOpacity>
  );
}
