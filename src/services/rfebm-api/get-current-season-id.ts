function asTwoDigits(x: number): string {
  return x.toString().substring(2, 4) || x.toString();
}

export function getCurrentSeasonId() {
  const now = new Date();
  const year = now.getFullYear();
  if (now.getMonth() < 7) {
    return Number(`${asTwoDigits(year - 1)}${asTwoDigits(year)}`);
  }

  return Number(`${asTwoDigits(year)}${asTwoDigits(year + 1)}`);
}
