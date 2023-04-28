import { useActionSheet } from "@expo/react-native-action-sheet";

// Helper for extracting (narrowing) a union from literal strings,
// such that we can get `id` typed as a union and not just `string`
// https://github.com/Microsoft/TypeScript/issues/17915#issuecomment-413347828
type NarrowLiterals<Union> = Union extends string ? Union : never;

export function usePrompt() {
  const { showActionSheetWithOptions } = useActionSheet();

  function showPrompt<T extends string>(input: {
    title: string;
    message: string;
    actionList: Array<{
      id: NarrowLiterals<T>;
      title: string;
      type: "default" | "cancel" | "destructive";
      isDisabled?: boolean;
    }>;
  }): Promise<{ id: T | undefined }> {
    const { title, message, actionList } = input;

    const cancelButtonIndices = findAllIndices(
      actionList,
      (item) => item.type === "cancel"
    );

    if (cancelButtonIndices.length !== 1) {
      throw new Error(
        `There must be exactly one action with the type of "cancel"`
      );
    }

    const destructiveButtonIndices = findAllIndices(
      actionList,
      (item) => item.type === "destructive"
    );

    const disabledButtonIndices = findAllIndices(
      actionList,
      (item) => item.isDisabled === true
    );

    return new Promise((resolve) => {
      showActionSheetWithOptions(
        {
          title,
          message,
          options: actionList.map((item) => item.title),
          cancelButtonIndex: cancelButtonIndices[0],
          destructiveButtonIndex: destructiveButtonIndices,
          disabledButtonIndices,
        },
        (selectedIndex) => {
          resolve({
            id:
              selectedIndex == null ? undefined : actionList[selectedIndex].id,
          });
        }
      );
    });
  }

  return {
    showPrompt,
  };
}

function findAllIndices<T>(
  list: Array<T>,
  predicate: (x: T) => boolean
): Array<number> {
  const result: Array<number> = [];

  for (let i = 0; i < list.length; i++) {
    if (predicate(list[i])) {
      result.push(i);
    }
  }

  return result;
}
