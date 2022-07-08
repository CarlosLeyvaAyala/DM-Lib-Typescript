import { Actor, Utility } from "skyrimPlatform"
import { preserveActor } from "../Form/preserve"

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
