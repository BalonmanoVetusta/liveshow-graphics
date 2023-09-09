import { PlayerInfoPayload, Team } from "hooks/use-match-actions/types";
import { MatchAction } from "types/schemas/match-action";
import { MatchActions } from "types/schemas/match-actions";

export declare type PlayerInfoPayloadWithSuspensionLength = PlayerInfoPayload & {
  suspensionLength: number;
};
export declare type MatchActionSuspensionTime = MatchAction & {
  payload: PlayerInfoPayloadWithSuspensionLength;
};

export function groupSuspensionsByTimeAndPlayerNumber(
  actions: MatchActions,
  team: Team,
  suspensionTime = 120_000,
): Array<MatchActionSuspensionTime> {
  const suspensions = actions.filter(
    (a) => (a.action === "SUSPENSION" || a.action === "DISQUALIFICATION") && a.team === team,
  );

  const suspensionsWithLength: Array<MatchActionSuspensionTime> = suspensions.map(
    (s: MatchAction): MatchActionSuspensionTime => {
      (s as MatchActionSuspensionTime).payload.suspensionLength = 1;
      return <MatchActionSuspensionTime>s;
    },
  );

  const groupedSuspensions: Array<MatchActionSuspensionTime> = suspensionsWithLength.reduce(
    (acc, suspension: MatchActionSuspensionTime) => {
      if (acc.length === 0 || !Array.isArray(acc)) return [suspension];
      const { number } = suspension.payload as PlayerInfoPayloadWithSuspensionLength;
      const previousSuspensions = acc.filter((s) => {
        const previousMatchTimeEndSuspensionTime = s.matchTime + suspensionTime;

        return s.payload.number === number && previousMatchTimeEndSuspensionTime > s.matchTime;
      });

      // No previous suspensions
      if (previousSuspensions.length === 0) {
        acc.push(suspension);
        return acc;
      }

      // More than one previous suspension means that this reducer didn't work as expected
      if (previousSuspensions.length > 1)
        throw new Error("More than one previous suspension found for the same player in the reducer");

      const [previousSuspension] = previousSuspensions;
      const previousSuspensionId = previousSuspension.id;
      const previousSuspensionIndex = acc.findIndex((s) => s.id === previousSuspensionId);

      // No previous suspension found in acc which should not happened. This would mean that this reducer didn't work as expected
      if (previousSuspensionIndex === -1)
        throw new Error("Previous suspension not found while counting suspensions for the same player in the reducer");

      acc[previousSuspensionIndex].payload.suspensionLength ??= 1;
      ++acc[previousSuspensionIndex].payload.suspensionLength;

      return acc;
    },
    [] as Array<MatchActionSuspensionTime>,
  );

  return groupedSuspensions;
}
