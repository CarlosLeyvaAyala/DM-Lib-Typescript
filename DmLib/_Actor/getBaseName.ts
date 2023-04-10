import { Actor } from "skyrimPlatform"

/**
 * Returns the name of the base of an `Actor`.
 * @param a Actor to get name from.
 * @returns Actor name.
 */
export function getBaseName(a: Actor | null) {
  const u = "unknown"
  if (!a) return u
  return a.getLeveledActorBase()?.getName() || u
}
