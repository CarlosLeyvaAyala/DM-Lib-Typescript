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
