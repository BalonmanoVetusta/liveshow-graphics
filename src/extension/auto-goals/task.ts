import NodeCG from "@nodecg/types";
import { getCurrentSeasonLabel, getMatchData } from "services/rfebm-api";
import { AutoGoals } from "types/schemas/auto-goals";
import { MatchActions } from "types/schemas/match-actions";

export enum AutoGoalsFetchActions {
  GOAL = "Gol",
  SUSPENSION = "Exclusión", // 2' suspension
  YELLOW_CARD = "Amonestación", // Yellow card
  DISQUALIFICATION = "Descalificación", // Red card
  TIMEOUT = "Tiempo muerto", // Timeout
}

export enum MatchStatus {
  UNKNOWN = "desconocido",
  NO_DATA = "no-data",
  PENDING = "pendiente",
  IN_PROGRESS = "live",
  FINISHED = "finalizado",
}

const TIMEOUT = 180_000; // 5 minutes without any change of actions or scores then we stop the auto goals and must be reactivated manually
const PULL_SECONDS = 15;
export const CRON_SCHEDULE = `*/${PULL_SECONDS} * * * * *`;
let inMemoryDb: Map<string, unknown> | undefined;

if (typeof inMemoryDb === "undefined") {
  inMemoryDb = new Map<string, unknown>();
}

export function startAutoGoals(nodecg: NodeCG.ServerAPI, autoGoals: NodeCG.ServerReplicant<AutoGoals>) {
  const matchActions = nodecg.Replicant<MatchActions>("match-actions", nodecg.bundleName, { defaultValue: [] });
  // reset the data before start
  matchActions.value.length = 0;
  matchActions.value = [];

  // Reset all autoGoals data
  autoGoals.value = {
    federationId: autoGoals.value?.federationId ?? 0,
    subfederationId: autoGoals.value?.subfederationId ?? 0,
    seasonId: autoGoals.value?.seasonId ?? 0,
    seasonLabel: getCurrentSeasonLabel(),
    categoryId: autoGoals.value?.categoryId ?? 0,
    championshipId: autoGoals.value?.championshipId ?? 0,
    championshipName: "Liga",
    tournamentId: autoGoals.value?.tournamentId ?? 0,
    week: autoGoals.value?.week ?? 0,
    matchId: autoGoals.value?.matchId ?? 0,
    active: autoGoals.value?.active ?? false,
    status: MatchStatus.UNKNOWN,
    localTeam: {},
    visitorTeam: {},
  };

  // Should put as inactive if any value change
  autoGoals.on("change", (newValue) => {
    const { active = false, tournamentId = 0, matchId = 0, week = 0 } = newValue ?? {};
    if (active === false) return;

    if (tournamentId === 0 || matchId === 0 || week === 0) {
      autoGoals.value!.active = false;
    }
  });

  let lastMatchCheckTimestamp = 0;
  let initialDataWasLoaded = false;

  return {
    task: () => {
      const time = lastMatchCheckTimestamp > 0 ? Date.now() - lastMatchCheckTimestamp : 0;
      if (time > TIMEOUT) autoGoals.value!.active = false;

      const { tournamentId = 0, matchId = 0, week = 0 } = autoGoals.value ?? {};

      if (tournamentId === 0 || matchId === 0 || week === 0) {
        autoGoals.value!.active = false;
        return;
      }

      getMatchData({ tournamentId, matchId, week }).then((received = {}) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = received as any;
        const status = data.status?.toLowerCase() ?? MatchStatus.UNKNOWN;
        if (!data || Object.keys(data).length === 0 || status === MatchStatus.UNKNOWN) {
          autoGoals.value!.active = false;
          lastMatchCheckTimestamp = 0;
          autoGoals.value!.status = MatchStatus.NO_DATA;
          return;
        }

        if (!initialDataWasLoaded && status === MatchStatus.PENDING) {
          const { date = "" } = data;
          const now = new Date();
          const [day, month, year] = date.split("-").map(Number);
          const [todayDay, todayMonth, todayYear] = now.toLocaleDateString().split("/").map(Number);
          // Is the match today?
          if (todayDay !== day || todayMonth !== month || todayYear !== year) {
            autoGoals.value!.active = false;
            return;
          }
        }

        // Alawys update fields
        lastMatchCheckTimestamp = Date.now();
        autoGoals.value!.status = data.status.toLowerCase();

        // Only the first time this data should be updated
        if (
          !initialDataWasLoaded &&
          data.status.toLowerCase() === MatchStatus.IN_PROGRESS &&
          data.local.players.length > 0 &&
          data.visitor.players.length > 0
        ) {
          autoGoals.value!.localTeam = data.local;
          autoGoals.value!.visitorTeam = data.visitor;
          autoGoals.value!.championshipName = data.championship.name;
          autoGoals.value!.seasonLabel = data.season.label;

          initialDataWasLoaded = true;
        }

        // TODO: Match actions implementation here it should add only new actions

        // Not in progress or pending stop after get all posible data
        if (![MatchStatus.IN_PROGRESS, MatchStatus.PENDING].includes(status)) autoGoals.value!.active = false;
      });
    },
  };
}
