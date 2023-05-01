import * as React from "react";
import { LabeledRow } from "./Design";

type TLogEntry = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: string | any;
  label: string;
  id?: string;
  timestamp?: number;
};

type TLogFullEntry = TLogEntry & {
  id: string;
  timestamp: number;
};

export function LogView(props: { logList: Array<TLogFullEntry> }) {
  const { logList } = props;

  return (
    <>
      {logList.map(({ id, label, timestamp, data }) => (
        <LabeledRow
          key={id}
          label={label}
          auxiliary={new Date(timestamp).toLocaleTimeString()}
          value={
            typeof data === "string" ? data : JSON.stringify(data, null, 2)
          }
        />
      ))}
    </>
  );
}

export function useLogViewData(): {
  logList: Array<TLogFullEntry>;
  appendLog: (item: TLogEntry) => void;
} {
  const [logList, setLogList] = React.useState<Array<TLogFullEntry>>([]);

  return {
    logList,
    appendLog: React.useCallback((item: TLogEntry) => {
      setLogList((list) => {
        const id = item.id ?? String(performance.now());
        const timestamp = item.timestamp ?? Date.now();

        // Reverse chronological order
        return [{ ...item, id, timestamp }, ...list];
      });
    }, []),
  };
}
