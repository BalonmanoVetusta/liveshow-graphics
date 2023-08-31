import { useReplicant } from "hooks/use-replicant";
import { Asset } from "types/Asset";

export function useAssetReplicant(assetName: string) {
  const [assets] = useReplicant<Asset[]>(`assets:${assetName}`, []);

  return assets;
}
