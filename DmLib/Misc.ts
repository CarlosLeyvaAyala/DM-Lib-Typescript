import { Form, storage, Utility } from "skyrimPlatform"
import * as Time from "./Time"
import { getErrorMsg } from "./Error"

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
export function AvoidRapidFire(f: () => void) {
  let lastExecuted = 0
  return () => {
    const t = Time.Now()
    if (lastExecuted === t) return
    lastExecuted = t
    f()
  }
}

/** Adapts a JContainers saving function so it can be used with {@link PreserveVar}.
 *
 * @param f Function to adapt.
 * @returns A function that accepts a key and a value.
 *
 * @example
 * const SaveFlt = JContainersToPreserving(JDB.solveFltSetter)
 * const SaveInt = JContainersToPreserving(JDB.solveIntSetter)
 */
export function JContainersToPreserving<T>(
  f: (k: string, v: T, b?: boolean) => void
) {
  return (k: string, v: T) => {
    f(k, v, true)
  }
}
/** Adapts a PapyrusUtil saving function so it can be used with {@link PreserveVar}.
 *
 * @param f Function to adapt.
 * @param obj Object to save values on. Use `null` to save globally.
 * @returns A function that accepts a key and a value.
 *
 * @example
 * const SaveFlt = PapyrusUtilToPreserving(PapyrusUtil.SetFloatValue, null)
 * const SaveInt = PapyrusUtilToPreserving(PapyrusUtil.SetIntValue, null)
 */
export function PapyrusUtilToPreserving<T>(
  f: (obj: Form | null | undefined, k: string, v: T) => void,
  obj: Form | null | undefined
) {
  return (k: string, v: T) => {
    f(obj, k, v)
  }
}

/** Saves a variable to both storage and wherever the `Store` function saves it.
 *
 * @remarks
 * The `storage` variable saves values across hot reloads, but not game sessions.
 *
 * At the time of creating this function, Skyrim Platform doesn't implement any
 * way of saving variables to the SKSE co-save, so values aren't preserved across
 * save game saves.
 *
 * This function lets us save variables using wrapped functions from either
 * **JContainers** or **PapyursUtil**.
 *
 * @param Store A function that saves a variable somewhere.
 * @param k `string` key to identify where the variable will be saved.
 * @returns A fuction that saves a value and returns it.
 *
 * @example
 * const SaveFlt = JContainersToPreserving(JDB.solveFltSetter)
 * const SaveInt = JContainersToPreserving(JDB.solveIntSetter)
 * const SFloat = PreserveVar(SaveFlt, "floatKey")
 * const SInt = PreserveVar(SaveInt, "intKey")
 *
 * // Use SFloat each time we want to make sure a value won't get lost when reloading the game.
 * let x = SFloat(10)   // => x === 10
 * x = SFloat(53.78)    // => x === 53.78
 */
export function PreserveVar<T>(Store: (k: string, v: T) => void, k: string) {
  return (x: T) => {
    storage[k] = x
    Store(k, x)
    return x
  }
}
export const preserveVar = PreserveVar
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
export function UpdateEach(seconds: number) {
  let lastUpdated = 0
  return (f: () => void) => {
    const t = Utility.getCurrentRealTime()
    if (t - lastUpdated < seconds) return
    lastUpdated = t
    f()
  }
}

export const updateEach = UpdateEach

/** Generates a random unique identifier.
 * @returns A version 4 RFC 4122/DCE 1.1 UUID.
 */
export function uuidV4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/** Generates a random unique identifier.
 * @returns A version 4 RFC 4122/DCE 1.1 UUID.
 */
export const guid = uuidV4

/**
 * Waits some time, then does something.
 * @remark
 * This function was made to avoid all the clutter that requires to call an `async` function.
 *
 * @param time Time to wait (seconds).
 * @param DoSomething What to do after `time` has passed.
 */
export function wait(time: number, DoSomething: () => void) {
  const F = async () => {
    await Utility.wait(time)
    DoSomething()
  }
  F()
}

/**
 * Tries to do something. Logs an error if an exception happens.
 * @param DoSomething Thing to do.
 * @param Logger Logger function.
 */
export function tryE(DoSomething: () => void, Logger: (msg: string) => void) {
  try {
    DoSomething()
  } catch (error) {
    Logger(getErrorMsg(error))
  }
}
