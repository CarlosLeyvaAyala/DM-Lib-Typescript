/** Returns a function that ensures some value is at least `min`.
 *
 * @param min The minimum value a number can be.
 * @returns A function that accepts a number `x` and returns `x` or `min`.
 *
 * @example
 * const LowestHp = ForceMin(10)
 * LowestHp(-1)     // => 10
 * LowestHp(255)    // => 255
 */

export const forceMin = (min: number) => (x: number) => Math.max(min, x)
