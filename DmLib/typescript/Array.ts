/** Returns a random element from some array.
 *
 * @param arr Array to get the element from.
 * @returns A random element.
 */
export function RandomElement<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export const fst = <A, B>(tuple: [A, B]) => tuple[0]
export const snd = <A, B>(tuple: [A, B]) => tuple[1]

/** Extend array */
declare global {
  interface Array<T> {
    iter(action: (i: T) => void): Array<T>
    randomElement(): T
    singleOrDefault(defaultValue: T): T
    singleOrNull(): T | null
    maxBy(compare: (a: T, b: T) => number): T | undefined
    minBy(compare: (a: T, b: T) => number): T | undefined
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

Array.prototype.maxBy = function <T>(
  compare: (a: T, b: T) => number
): T | undefined {
  if (this.length === 0) return undefined

  let max = this[0]
  for (let i = 1; i < this.length; i++) {
    const t = this[i]
    const c = compare(max, t)
    max = c >= 0 ? max : t
  }
  return max
}

Array.prototype.minBy = function <T>(
  compare: (a: T, b: T) => number
): T | undefined {
  if (this.length === 0) return undefined

  let min = this[0]
  for (let i = 1; i < this.length; i++) {
    const t = this[i]
    const c = compare(min, t)
    min = c <= 0 ? min : t
  }
  return min
}
