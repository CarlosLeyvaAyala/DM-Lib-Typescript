/** Returns a random element from some array.
 *
 * @param arr Array to get the element from.
 * @returns A random element.
 */
export function RandomElement<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

/** Extend array */
declare global {
  interface Array<T> {
    iter(action: (i: T) => void): Array<T>
    randomElement(): T
    singleOrDefault(defaultValue: T): T
    singleOrNull(): T | null
  }
}

Array.prototype.iter = function <T>(action: (i: T) => void) {
  for (const item of this) action(item)
  return this
}

Array.prototype.singleOrNull = function () {
  return this.length < 1 ? null : this[0]
}

Array.prototype.singleOrDefault = function <T>(defaultValue: T) {
  return this.singleOrNull ?? defaultValue
}

Array.prototype.randomElement = function <T>(): T {
  return this[Math.floor(Math.random() * this.length)]
}
