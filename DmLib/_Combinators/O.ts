/** Creates a function that accepts one parameter `x`. Returns `f1(x)` if not `null`, else `f2(x)`.
 *
 * @param f1 First function to apply.
 * @param f2 Second function to apply.
 * @returns `f1(x)` if not `null`, else `f2(x)`.
 */
export const O =
  <U>(f1: (...args: any[]) => U | null, f2: (...args: any[]) => U) =>
  (...args: any[]): U =>
    f1(...args) || f2(...args)
