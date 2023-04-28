import * as React from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";

export function ScrollContainer(props: {
  children: React.ReactNode;
  withRefreshControl?: boolean;
}) {
  const { children, withRefreshControl = false } = props;

  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [keyInvalidationIndex, setKeyInvalidationIndex] =
    React.useState<number>(0); // Poor man's refresh control

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scrollView}
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={
          withRefreshControl ? (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => {
                setIsRefreshing(true);
                setKeyInvalidationIndex((num) => num + 1);

                setTimeout(() => {
                  setIsRefreshing(false);
                }, 500);
              }}
            />
          ) : undefined
        }
      >
        <React.Fragment key={keyInvalidationIndex}>{children}</React.Fragment>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollView: {
    paddingHorizontal: 16,
  },
});
