import { forceMin } from "./forceMin"

/** Ensures some value is always positive.
 *
 * @param x A number.
 * @returns `0` if `x` is negative, else `x`.
 *
 * @example
 * ForcePositive(-100)     // => 0
 * ForcePositive(255)      // => 255
 * ForcePositive(0)        // => 0
 */

export const forcePositive = (x: number) => forceMin(0)(x)
