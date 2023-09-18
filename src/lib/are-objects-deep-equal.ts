export function areObjectsDeepEqual<T extends object = object>(a: T, b: T): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
