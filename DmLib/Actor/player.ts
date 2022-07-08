import { Actor, Game, ObjectReference } from "skyrimPlatform"

/** Player FormId. */
export const playerId = 0x14

/** Gets the player as an `Actor`.
 *
 * @remarks
 * This function is intended to be used as a callback when you are defining functions that
 * need the player, but
 * {@link https://github.com/skyrim-multiplayer/skymp/blob/main/docs/skyrim_platform/native.md#native-functions game functions are not available}
 * when defining them.
 *
 * @privateRemarks
 * `Game.getPlayer()` is guaranteed to get an `Actor` in Skyrim Platform, so it's
 * ok to do `Game.getPlayer() as Actor`.
 */
export const Player = () => Game.getPlayer() as Actor

/**
 * Is an object the player?
 * @param a Object to be tested.
 * @returns Wether the object is the player.
 */
export function isPlayer(a: Actor | ObjectReference | null) {
  if (!a) return false
  return a.getFormID() === playerId
}
