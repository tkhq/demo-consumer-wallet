import * as React from "react";
import { Button, StyleSheet, View } from "react-native";
import { LabeledTextInput } from "../components/Design";
import { ScrollContainer } from "../components/ScrollContainer";
import {
  KEY_LIST,
  initialCredentialsState,
  useCredentialsContext,
} from "../turnkey/CredentialsContext";

export function SettingsScreen() {
  const {
    credentials: storedCredentials,
    updateCredential,
    resetAll,
  } = useCredentialsContext();

  const [localCredentials, setLocalCredentials] =
    React.useState(storedCredentials);

  const isDirty = // This isn't pretty
    JSON.stringify(localCredentials) !== JSON.stringify(storedCredentials);

  return (
    <ScrollContainer>
      <View style={styles.root}>
        {KEY_LIST.map((keyName) => {
          return (
            <LabeledTextInput
              key={keyName}
              value={localCredentials[keyName] ?? ""}
              label={keyName}
              auxiliary="Tap to edit"
              onChangeText={(text) => {
                setLocalCredentials((currentState) => ({
                  ...currentState,
                  [keyName]: text || null,
                }));
              }}
              placeholder=""
            />
          );
        })}
        <View style={styles.buttonGroup}>
          <Button
            title="Save"
            disabled={!isDirty}
            onPress={() => {
              Object.keys(localCredentials).forEach((key) => {
                // @ts-expect-error -- `Object.keys(...)` doesn't refine
                updateCredential(key, localCredentials[key]);
              });
            }}
          />
          <Button
            title="Reset all"
            onPress={async () => {
              await resetAll();

              setLocalCredentials(initialCredentialsState);
            }}
          />
        </View>
      </View>
    </ScrollContainer>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  emptyStateContainer: {
    display: "flex",
    marginVertical: 16,
    alignItems: "center",
  },
  buttonGroup: {
    padding: 4,
  },
});
