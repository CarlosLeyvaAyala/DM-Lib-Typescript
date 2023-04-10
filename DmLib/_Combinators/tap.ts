/** Applies function `f` to `x` and returns `x`. Useful for chaining functions that return nothing.
 *
 * @param x
 * @param f
 * @returns x
 */
export function tap<K>(x: K, f: (x: K) => void) {
  f(x)
  return x
}
