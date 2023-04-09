/** Returns a function that ensures some value is at most `max`.
 *
 * @param max The maximum value a number can be.
 * @returns A function that accepts a number `x` and returns `x` or `max`.
 *
 * @example
 * let MaxSpeed = ForceMax(1.7)
 * MaxSpeed(2)     // => 1.7
 * MaxSpeed(1.7)   // => 1.7
 * MaxSpeed(0.5)   // => 0.5
 *
 * MaxSpeed = ForceMax(1)
 * MaxSpeed(1.1)   // => 1
 */
export const forceMax = (max: number) => (x: number) => Math.min(max, x)
