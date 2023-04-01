import { K } from "./K"
import { tap } from "./tap"
/** Returns a value while executing a function.
 *
 * @see {@link DebugLib.Log.R} for a sample usage.
 *
 * @param f Function to execute.
 * @param x Value to return.
 * @returns `x`
 */
export const Return = <T>(f: void, x: T) => tap(x, K(f))
