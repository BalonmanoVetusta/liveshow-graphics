#!/usr/bin/env bun
// Update the json data about tournaments for given federation and category
import { join, resolve, dirname } from "path";
import { mkdir } from "node:fs/promises";
import { getCurrentSeasonId, getFederationData } from "../src/services/rfebm-api";
import type { FederationResponse } from "../src/services/rfebm-api/types";

const FEDERATION = 9999; // Federation to parse
const CATEGORY = 200017; // Category to parse
const CHAMPIONSHIP = 205385; // Championship to parse

const dataPath = resolve(join(import.meta.dir, "..", "assets", "data"));
await mkdir(dataPath, { recursive: true });

async function updateSubfederations({ subFederations = [], id }: FederationResponse) {
  if (subFederations.length <= 1) return;
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

async function updateChampionships({
  championships,
  id: federationId,
  seasonId,
}: FederationResponse & { seasonId: number }) {
  if (championships.length === 0) return;
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

async function updateTournaments({
  tournaments,
  id: federationId,
  championshipId,
  seasonId,
}: FederationResponse & { championshipId: number; seasonId: number }) {
  if (tournaments.length === 0) return;

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

async function main(federationId: number, categoryId: number, championshipId?: number) {
  const seasonId = getCurrentSeasonId();
  const json = await getFederationData({
    federationId,
    seasonId,
    categoryId,
    championshipId,
  });

  if (json) {
    Promise.all([
      updateSubfederations(json),
      updateCategories(json),
      updateSeasons(json),
      updateChampionships({ ...json, seasonId }),
      championshipId ? updateTournaments({ ...json, championshipId, seasonId }) : Promise.resolve(), // Not best solution at all
    ]).then(() => {
      console.log("Data updated");
    });
  }
}

// Start for a known federation and category
main(FEDERATION, CATEGORY, CHAMPIONSHIP);
