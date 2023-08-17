import type NodeCG from "@nodecg/types";
import {
  ATEM_MDNS_TXT_CLASS,
  AtemInfo,
  blackmagicMDNSDetector,
} from "./lib/atem-mdns";

export enum AtemAutodiscoverEvents {
  START = "atem:autodiscover:start",
  STOP = "atem:autodiscover:stop",
  NEW_DEVICE = "atem:autodiscover:device",
  DEVICES = "atem:autodiscover:devices",
  UPDATE = "atem:autodiscover:update",
  GET_DEVICES = "atem:autodiscover:get-devices",
}

export async function handleAtemAutodiscover(nodecg: NodeCG.ServerAPI) {
  nodecg.log.info("Atem autodiscover extension loaded");

  let browser: ReturnType<typeof blackmagicMDNSDetector> | undefined =
    undefined;
  let devices: Array<AtemInfo> = [];

  nodecg.listenFor(AtemAutodiscoverEvents.START, () => {
    nodecg.log.info("Starting ATEM autodiscover");
    devices = [];
    browser = blackmagicMDNSDetector().on("up", (service) => {
      if (service.txt.class !== ATEM_MDNS_TXT_CLASS) return;
      service.addresses.forEach((address) => {
        const device: AtemInfo = {
          name: service.name,
          address,
          fqdn: service.fqdn,
          host: service.host,
          port: service.port,
        };
        nodecg.log.info("New ATEM device found", { device });
        nodecg.sendMessage(AtemAutodiscoverEvents.NEW_DEVICE, device);
        devices.push(device);
        nodecg.sendMessage(AtemAutodiscoverEvents.DEVICES, devices);
      });
    });
    browser.start();
  });

  nodecg.listenFor(AtemAutodiscoverEvents.STOP, () => {
    nodecg.log.info("Stopping ATEM autodiscover");
    if (browser) {
      browser.stop();
      browser = undefined;
    }
  });

  nodecg.listenFor(AtemAutodiscoverEvents.GET_DEVICES, () => {
    nodecg.sendMessage(AtemAutodiscoverEvents.DEVICES, devices);
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const atemConfig = (nodecg.bundleConfig?.atem ?? {}) as unknown as any;
  // If config autodiscover continuosly, start autodiscover
  if (atemConfig.autodiscover) {
    nodecg.sendMessage(AtemAutodiscoverEvents.START);
  }
}
