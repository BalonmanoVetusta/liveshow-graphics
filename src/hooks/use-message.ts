import { useEffect } from "react";

export type ListenForFunction<T> = (message: T) => void;

export declare type UseMessageProps<T> = {
  messageName: string;
  bundleName: string;
  listenFor: ListenForFunction<T> | undefined;
};

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
    const { nodecg = undefined } = window || globalThis;
    if (typeof nodecg === typeof undefined) {
      throw new Error("No nodecg found");
    }

    return nodecg!.sendMessageToBundle(messageName, bundleName, data);
  }

  useEffect(() => {
    if (listenFor === undefined) {
      return;
    }

    const { nodecg = undefined } = window || globalThis;
    if (typeof nodecg === typeof undefined) {
      throw new Error("No nodecg found");
    }

    nodecg!.listenFor(messageName, bundleName, listenFor);

    return () => {
      if (listenFor) {
        nodecg!.unlisten(messageName, listenFor);
      }
    };
  }, []);

  return { sendMessage };
}
