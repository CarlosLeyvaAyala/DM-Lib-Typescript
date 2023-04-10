import { forceRange } from "./forceRange"

/** Ensures some value always stays within the (inclusive) range [`0`..`1`].
 *
 * @param x A number.
 * @returns A number between [`0`..`1`].
 *
 * @example
 * ForcePercent(-0.1)       // => 0
 * ForcePercent(10)         // => 1
 * ForcePercent(0.5)        // => 0.5
 */

export const forcePercent = (x: number) => forceRange(0, 1)(x)
