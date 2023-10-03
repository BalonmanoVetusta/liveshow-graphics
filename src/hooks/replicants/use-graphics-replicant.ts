import { useReplicant } from "hooks/use-replicant";
import { Graphics } from "types/schemas/graphics";

export function useGraphicsReplicant() {
  const [graphics, setInternalGraphics] = useReplicant<Graphics>("graphics", {
    bgColor: "#00ff00",
    music: false,
    spot: false,
    localShield: "https://www.rfebm.com/competiciones/images/escudos/sinescudo.jpg",
    localShieldBgColor: "transparent",
    localTeamColor: "black",
    visitorShield: "https://www.rfebm.com/competiciones/images/escudos/sinescudo.jpg",
    visitorShieldBgColor: "transparent",
    visitorTeamColor: "white",
  });

  const setGraphics = (newGraphics: Graphics) =>
    setInternalGraphics({
      ...graphics,
      ...newGraphics,
    });

  return { setGraphics, ...graphics };
}
