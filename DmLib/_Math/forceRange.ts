import { forceMin } from "./forceMin"
import { forceMax } from "./forceMax"

/** Returns a function that ensures some value is between the (inclusive) range [`min`..`max`].
 *
 * @param min The minimum value a number can be.
 * @param max The maximum value a number can be.
 * @returns A function that accepts a number `x` and makes sure it stays within `min` and `max`.
 *
 * @example
 * const itemCount = 42
 * let Take = ForceRange(0, itemCount)
 * Take(-100)     // => 0
 * Take(255)      // => 42
 * Take(3)        // => 3
 *
 * // Redefine Take function to reflect new data
 * Take = ForceRange(0, itemCount - Take(3))
 */

export const forceRange = (min: number, max: number) => (x: number) =>
  forceMin(min)(forceMax(max)(x))
