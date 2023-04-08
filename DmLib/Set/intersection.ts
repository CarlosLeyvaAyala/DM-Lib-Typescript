/** Calculates the intersection of two sets.
 * @see
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
 */
export function intersection<T>(setA: Set<T>, setB: Set<T>) {
  const _intersection = new Set<T>()
  for (const elem of setB) {
    if (setA.has(elem)) {
      _intersection.add(elem)
    }
  }
  return _intersection
}
