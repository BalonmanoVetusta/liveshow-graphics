#!/usr/bin/env bun
// Update the json data about federations and seasons and get the default values
import { join, resolve, dirname } from "path";
import { mkdir } from "node:fs/promises";
import { getFederationData } from "../src/services/rfebm-api";
import type { FederationResponse } from "../src/services/rfebm-api/types";

const dataPath = resolve(join(import.meta.dir, "..", "assets", "data"));
const championshipId = 205385;
await mkdir(dataPath, { recursive: true });
const json = await getFederationData({
  federationId: 9999,
  seasonId: 2324,
  categoryId: 200017,
  championshipId,
});

async function updateSubfederations({ subFederations = [], id }: FederationResponse) {
  if (subFederations.length === 0) return;
  const filePath = join(dataPath, id.toString(), "subfederations.json");
  try {
    await mkdir(dirname(filePath), { recursive: true });
    const { default: previous } = await import(filePath);
    const newValueSet = new Set([...previous, ...subFederations]);
    const newValue = Array.from(newValueSet);
    Bun.write(filePath, JSON.stringify(newValue, null, 2));
  } catch (error) {
    // console.error(error);
    Bun.write(filePath, JSON.stringify(subFederations, null, 2));
  }
}

async function updateCategories({ categories }: FederationResponse) {
  if (categories.length === 0) return;
  const filePath = join(dataPath, "categories.json");
  try {
    const { default: previous } = await import(filePath);
    const newValueSet = new Set([...previous, ...categories]);
    const newValue = Array.from(newValueSet);
    Bun.write(filePath, JSON.stringify(newValue, null, 2));
  } catch (error) {
    // console.error(error);
    Bun.write(filePath, JSON.stringify(categories, null, 2));
  }
}

async function updateSeasons({ seasons }: FederationResponse) {
  if (seasons.length === 0) return;
  const filePath = join(dataPath, "seasons.json");
  try {
    const { default: previous } = await import(filePath);
    const newValueSet = new Set([...previous, ...seasons]);
    const newValue = Array.from(newValueSet);
    Bun.write(filePath, JSON.stringify(newValue, null, 2));
  } catch (error) {
    // console.error(error);
    Bun.write(filePath, JSON.stringify(seasons, null, 2));
  }
}

async function updateChampionships({ championships, seasons, id: federationId }: FederationResponse) {
  if (championships.length === 0) return;
  const seasonId = seasons.sort((a, b) => b.id - a.id)[0].id; // latest season
  const filePath = join(dataPath, federationId.toString(), seasonId.toString(), "championships.json");
  try {
    await mkdir(dirname(filePath), { recursive: true });
    const previous = await import(filePath);
    const newValueSet = new Set([...previous, ...championships]);
    const newValue = Array.from(newValueSet);
    Bun.write(filePath, JSON.stringify(newValue, null, 2));
  } catch (error) {
    Bun.write(filePath, JSON.stringify(championships, null, 2));
    // console.error(error);
  }
}

async function updateTournaments({ seasons, tournaments, id: federationId }: FederationResponse) {
  if (tournaments.length === 0) return;

  const seasonId = seasons.sort((a, b) => b.id - a.id)[0].id; // latest season
  const filePath = join(
    dataPath,
    federationId.toString(),
    seasonId.toString(),
    championshipId.toString(),
    "tournaments.json",
  );
  try {
    await mkdir(dirname(filePath), { recursive: true });
    const { default: previous } = await import(filePath);
    const newValueSet = new Set([...previous, ...tournaments]);
    const newValue = Array.from(newValueSet);
    Bun.write(filePath, JSON.stringify(newValue, null, 2));
  } catch (error) {
    // console.error(error);
    Bun.write(filePath, JSON.stringify(tournaments, null, 2));
  }
}

if (json) {
  Promise.all([
    updateSubfederations(json),
    updateCategories(json),
    updateSeasons(json),
    updateChampionships(json),
    updateTournaments(json),
  ]).then(() => {
    console.log("Data updated");
  });
}
