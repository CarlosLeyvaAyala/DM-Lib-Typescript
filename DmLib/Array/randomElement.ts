/** Returns a random element from some array.
 *
 * @param arr Array to get the element from.
 * @returns A random element.
 */
export function randomElement<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}
