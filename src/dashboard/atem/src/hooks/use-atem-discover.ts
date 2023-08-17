import { AtemAutodiscoverEvents } from "extension/atem-autodiscover";
import { AtemInfo } from "extension/atem-autodiscover/lib/atem-mdns";
import { useState } from "react";

export function useAtemDiscover() {
  const [devices, setDevices] = useState<AtemInfo[]>([]);

  function startListening() {
    nodecg.sendMessage(AtemAutodiscoverEvents.START);

    nodecg.listenFor(
      AtemAutodiscoverEvents.DEVICES,
      (allDevices: AtemInfo[]) => {
        setDevices(allDevices);
      }
    );
  }

  function stopListening() {
    nodecg.sendMessage(AtemAutodiscoverEvents.STOP);
  }

  function updateDevices() {
    nodecg.sendMessage(AtemAutodiscoverEvents.GET_DEVICES);
  }

  return { devices, startListening, stopListening, updateDevices };
}
