import { FederationResponse, GetFederationDataParams, GetMatchDataParams, GetTournamentDataParams } from "./types";
export { getCurrentSeasonId } from "./get-current-season-id";

const API_BASE_URL = "https://rfebm.7metros.es/api";
const API_VERSION = "v2";
const DEFAULT_FEDERATION = 9999; // National federation

export async function getFederationData({
  federationId = DEFAULT_FEDERATION,
  subfederationId,
  seasonId,
  categoryId,
  championshipId,
}: Partial<GetFederationDataParams> = {}): Promise<FederationResponse | null> {
  const url = new URL(`${API_BASE_URL}/${API_VERSION}/federation/${federationId}`);

  if (subfederationId) {
    url.searchParams.append("subfederationId", subfederationId.toString());
  }

  if (seasonId) {
    url.searchParams.append("seasonId", seasonId.toString());
  }

  if (categoryId) {
    url.searchParams.append("categoryId", categoryId.toString());
  }

  if (championshipId) {
    url.searchParams.append("championshipId", championshipId.toString());
  }

  try {
    const response = await fetch(url.toString());
    if (response.status !== 200) throw new Error(`Error fetching data from ${url.toString()}`);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
  }

  return null;
}

export async function getTournamentData({
  tournamentId,
  week = "latest",
}: Partial<GetTournamentDataParams>): Promise<unknown> {
  const url = new URL(`${API_BASE_URL}/${API_VERSION}/tournament/${tournamentId}/${week}`);

  try {
    const response = await fetch(url.toString());
    if (response.status !== 200) throw new Error(`Error fetching data from ${url.toString()}`);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
  }

  return null;
}

export async function getMatchData({ tournamentId, week, matchId }: Partial<GetMatchDataParams>): Promise<unknown> {
  const url = new URL(`${API_BASE_URL}/${API_VERSION}/tournament/${tournamentId}/${week}/${matchId}/live`);

  try {
    const response = await fetch(url.toString());
    if (response.status !== 200) throw new Error(`Error fetching data from ${url.toString()}`);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
  }

  return null;
}
