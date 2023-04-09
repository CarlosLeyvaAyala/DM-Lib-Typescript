import { TappedFunction } from "./types"

/** Creates a logging function that appends some message before logging.
 *
 * @see {@link append}
 *
 * @param f Function to wrap.
 * @param append Message to append each time the result is called.
 * @returns A {@link TappedFunction}.
 */

export function appendT(f: TappedFunction, append: any): TappedFunction {
  return <T>(msg: string, x: T, fmt?: (x: T) => string) =>
    f(append + msg, x, fmt)
}
