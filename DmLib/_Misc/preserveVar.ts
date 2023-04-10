import { storage } from "skyrimPlatform"

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
export function preserveVar<T>(Store: (k: string, v: T) => void, k: string) {
  return (x: T) => {
    storage[k] = x
    Store(k, x)
    return x
  }
}
