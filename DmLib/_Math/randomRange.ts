/**
 * Returns a random number in the [`min`, `max`] range.
 * @param min Minimum value.
 * @param max Maximum value.
 * @returns A random number.
 */
export const randomRange = (min: number, max: number) =>
  Math.random() * (max - min) + min
