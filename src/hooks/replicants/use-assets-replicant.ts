import NodeCG from "@nodecg/types";
import { useReplicant } from "hooks/use-replicant";

export function useAssetReplicant(assetName: string): NodeCG.AssetFile[] {
  const [assets] = useReplicant<NodeCG.AssetFile[]>(`assets:${assetName}`, []);

  return assets;
}
