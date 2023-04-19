import bonjour from "bonjour";

export const ATEM_MDNS_TXT_CLASS = "AtemSwitcher";
const ATEM_MDNS_TYPE = "blackmagic";
const ATEM_MDNS_PROTOCOL = "tcp";

export declare interface AtemInfo {
  name: string;
  address: string;
  fqdn: string;
  host: string;
  port: number;
}

export function blackmagicMDNSDetector() {
  const bonjourInstance = bonjour();

  return bonjourInstance.find({
    type: ATEM_MDNS_TYPE,
    protocol: ATEM_MDNS_PROTOCOL,
  });
}
