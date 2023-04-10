import { LoggingFunction } from "./types"

/** Creates a logging function that appends some message before logging.
 *
 * @param f Function to wrap.
 * @param append Message to append each time the result is called.
 * @returns A {@link LoggingFunction}.
 *
 * @example
 * const CMLL = Append(printConsole, "Kemonito: ")
 * CMLL("Kicks")       // => "Kemonito: Kicks"
 * CMLL("Flies!")      // => "Kemonito: Flies!"
 * CMLL("Is love")     // => "Kemonito: Is love"
 * CMLL("Is life")     // => "Kemonito: Is life"
 */

export function append(f: LoggingFunction, append: any): LoggingFunction {
  return (msg: any) => f(append + msg)
}
