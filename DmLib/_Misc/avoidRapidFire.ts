import { now } from "../Time/now"

/** Avoids a function to be executed many times at the same time.
 *
 * @param f The function to wrap.
 * @returns A function that will be called only once when the engine
 * tries to spam it.
 *
 * @remarks
 * Sometimes the engine is so fast a function may be called many times
 * in a row. For example, the `OnSleepStart` event may be fired 4 times
 * in a row, thus executing a function those 4 times, even when it was
 * intended to run only once.
 *
 * This function will make a function in that situation to be called
 * only once, as expected.
 *
 * @warning
 * Since this function is a "closure" it needs to be used outside loops
 * and things that may redefine the inner variables inside it.
 *
 * If this function doesn't appear to work, try to use it outside the
 * current execution block.
 *
 * @example
 * let f = () => { printConsole("Only once") }
 * f = AvoidRapidFire(f)
 *
 * // The engine is so fast this will actually work
 * f()
 * f()
 * f()
 */
export function avoidRapidFire(f: () => void) {
  let lastExecuted = 0
  return () => {
    const t = now()
    if (lastExecuted === t) return
    lastExecuted = t
    f()
  }
}
