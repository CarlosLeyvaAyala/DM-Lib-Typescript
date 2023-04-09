import { LoggingFunction, TappedFunction } from "./types"

/** Makes a logging function to log a value, then returns that value.
 *
 * @param f - The logging function.
 * @returns A {@link TappedFunction}.
 *
 * @remarks
 * This function is intended to be used to initialize variables while logging them,
 * so logging looks cleaner and variables become self documenting in code and
 * "debuggeable" at the same time.
 *
 * @example
 * const IntToHex = (x: number) => x.toString(16)
 * const LogAndInit = Tap(printConsole)
 *
 * // "Value for x: 3". Meanwhile: x === 3.
 * const x = LogAndInit("Value for x", 3)
 *
 * // "Hex: ff". Meanwhile: ff === 255
 * const ff = LogAndInit("Hex", 255, IntToHex)
 *
 * // Don't know what the next call will yield, but we can log it to console to see it!
 * const form = LogAndInit("Found form", Game.getFormFromFile(0x3bba, "Skyrim.esm"))
 */
export function tap(f: LoggingFunction): TappedFunction {
  return function <T>(msg: string, x: T, g?: (x: T) => string): T {
    if (g) {
      if (msg) f(`${msg}: ${g(x)}`)
      else f(g(x))
    } else {
      if (msg) f(`${msg}: ${x}`)
      else f(`${x}`)
    }
    return x
  }
}
