/**
 * Returns whether a number in the [`min`, `max`] range.
 * @param x Value to check.
 * @param min Minimum value.
 * @param max Maximum value.
 * @returns A `bool`.
 */
export const isInRange = (x: number, min: number, max: number) =>
  x >= min && x <= max
