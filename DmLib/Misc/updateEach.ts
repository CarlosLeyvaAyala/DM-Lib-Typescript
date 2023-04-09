import { Utility } from "skyrimPlatform"

/** Returns a function that accepts a function `f` that gets executed each `seconds`.
 *
 * @remarks
 * This is meant to be used as a substitute of sorts to the `OnUpdate` Papyrus event,
 * but it doesn't check if the player has the game paused inside a menu; that's up to
 * `f` to implement.
 *
 * @param seconds Seconds between checks.
 * @returns A function that accepts a function `f`.
 *
 * @example
 * const RTcalc = UpdateEach(3)
 *
 * on("update", () => {
 *    RTcalc(() => { printConsole("Real time calculations") })
 * }
 */

export function updateEach(seconds: number) {
  let lastUpdated = 0
  return (f: () => void) => {
    const t = Utility.getCurrentRealTime()
    if (t - lastUpdated < seconds) return
    lastUpdated = t
    f()
  }
}
