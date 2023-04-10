import { Utility } from "skyrimPlatform"
import { preserveActor } from "./Form"
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

/** Does something to an `Actor` after some time has passed.
 *
 * @remarks
 * This was made to hide the tediousness of having to retrieve and check
 * for an `Actor` each time the `Utility.wait` function is used.
 *
 * The Actor `a` is guaranteed to exist at the time `DoSomething` is
 * executed. If the function is not executed it means `a` is no longer
 * available.
 *
 * @param a `Actor` to work on.
 * @param time Time to wait (seconds).
 * @param DoSomething What to do when the time has passed.
 */
export function waitActor(
  a: Actor,
  time: number,
  DoSomething: (act: Actor) => void
) {
  const actor = preserveActor(a)
  const f = async () => {
    await Utility.wait(time)
    const act = actor()
    if (!act) return
    DoSomething(act)
  }
  f()
}
