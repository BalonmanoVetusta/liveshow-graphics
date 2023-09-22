import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { bundleName, nodecgEndpoint } from "services/global-variables";

const fetchJsonAsset = (filename: string) => async () =>
  fetch(`${nodecgEndpoint}/${bundleName}/assets/static-data/${filename}.json`)
    .then((res) => res.json())
    .catch(() => []);

const fetchGetOptionsToPath = (path: string, init?: RequestInit) => async () =>
  fetch(`https://rfebm.7metros.es/api/v1/${path}`, init)
    .then((res) => res.json())
    .catch(() => []);

export function useFetchSelectTournament() {
  const season = 2324;
  const [federation, setFederationInternal] = useState<number>(9999);
  const [subFederation, setSubFederationInternal] = useState<number>(0);
  const [category, setCategoryInternal] = useState<number>(0);
  const [championship, setChampionshipInternal] = useState<number>(0);

  const setFromValue = (values: Array<number>, setter: Dispatch<SetStateAction<number>>) => (value: number) => {
    if (values.includes(value)) setter(value);
  };

  const { data: federations } = useQuery({
    queryKey: ["federations"],
    queryFn: fetchJsonAsset("federations"),
  });

  const {
    data: { subFederations = [] },
  } = useQuery({
    queryKey: ["subFederations", federation],
    queryFn: fetchGetOptionsToPath(`/api/v1/federation/${federation}`),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchJsonAsset("categories"),
  });

  const championshipsQueryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (federation > 0) params.append("federationId", federation.toString());
    if (subFederation > 0) params.append("subFederationId", subFederation.toString());
    if (category > 0) params.append("categoryId", category.toString());
    if (season > 0) params.append("seasonId", season.toString());
    return params.toString();
  }, [season, federation, subFederation, category]);

  const { data: championships = [] } = useQuery({
    queryKey: ["championships", federation, subFederation, category],
    queryFn: fetchGetOptionsToPath(`/championships?${championshipsQueryParams}`),
  });

  const tournamentsQueryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (federation > 0) params.append("federationId", federation.toString());
    if (subFederation > 0) params.append("subFederationId", subFederation.toString());
    if (category > 0) params.append("categoryId", category.toString());
    if (season > 0) params.append("seasonId", season.toString());
    if (championship > 0) params.append("championshipId", championship.toString());
    return params.toString();
  }, [federation, subFederation, category, season, championship]);

  const { data: tournaments = [] } = useQuery({
    queryKey: ["tournaments", federation, subFederation, category, championship],
    queryFn: fetchGetOptionsToPath(`/tournaments?${tournamentsQueryParams}`),
  });

  return {
    federations,
    federation,
    setFederation: setFromValue(federations, setFederationInternal),
    subFederations,
    subFederation,
    setSubFederation: setFromValue(subFederations, setSubFederationInternal),
    season,
    categories,
    category,
    setCategory: setFromValue(categories, setCategoryInternal),
    championships,
    championship,
    setChampionship: setFromValue(championships, setChampionshipInternal),
    tournaments,
  };
}
