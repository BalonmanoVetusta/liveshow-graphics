import { useEffect } from "react";

export type ListenForFunction<T> = (message: T) => void;

export declare type UseMessageProps<T> = {
  messageName: string;
  bundleName: string;
  listenFor: ListenForFunction<T> | undefined;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type UseMessageReturn<T> = {
  sendMessage: <T>(message: T) => void;
};

// T message type
export default function useMessage<T>({
  messageName,
  bundleName = "CURR_BNDL",
  listenFor = undefined,
}: UseMessageProps<T>): UseMessageReturn<T> {
  function sendMessage<T>(data: T) {
    if (typeof nodecg === typeof undefined) {
      throw new Error("No nodecg found");
    }

    return nodecg?.sendMessageToBundle(messageName, bundleName, data);
  }

  useEffect(() => {
    if (listenFor === undefined) {
      return;
    }

    if (typeof nodecg === typeof undefined) {
      throw new Error("No nodecg found");
    }

    nodecg?.listenFor(messageName, bundleName, listenFor);

    return () => {
      if (listenFor) {
        nodecg?.unlisten(messageName, listenFor);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { sendMessage };
}
