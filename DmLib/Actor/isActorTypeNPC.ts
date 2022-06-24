import { Actor, Game, Keyword } from "skyrimPlatform"

/**
 * Returns wether an `Actor` `Race` has the `ActorTypeNPC` `Keyword`.
 *
 * @remarks
 * This function is useful to check if an `Actor` is a _humanoid_ type of
 * character. Most of these character types are sentient, playable, use the
 * installed body modifier (CBBE, UNP, etc), are not creatures...
 *
 * @param a `Actor` to check.
 * @returns Wether the `Actor` has the `Keyword`.
 */
export function isActorTypeNPC(a: Actor | null) {
  if (!a) return false
  const ActorTypeNPC = Keyword.from(Game.getFormFromFile(0x13794, "Skyrim.esm"))
  return a.getRace()?.hasKeyword(ActorTypeNPC) || false
}
