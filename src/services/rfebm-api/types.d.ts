// Federation stuff
export type GetFederationDataParams = {
  federationId: number;
  subfederationId?: number;
  seasonId?: number;
  categoryId?: number;
  championshipId?: number;
};

export type FederationResponse = {
  id: number;
  name: string;
  shieldImageUrl: string;
  web: string;
  subFederations: SubFederation[];
  categories: SelectOption[];
  seasons: Season[];
  championships: SelectOption[];
  tournaments: SelectOption[];
};

export type SelectOption = {
  id: number;
  name: string;
};

export type Season = {
  id: number;
  startDate: Date;
  endDate: Date;
  label: string;
  name: string;
};

export type SubFederation = {
  id: number;
  name: string;
  subfederationOf: number;
};

// Tournament stuff
export type GetFullTournamentDataParams = {
  tournamentId: number;
};

export type GetTournamentDataOfWeekParams = {
  tournamentId: number;
  week?: number | "latest";
};

// Match stuff

export type GetMatchDataParams = {
  tournamentId: number;
  week: number;
  matchId: number;
};
