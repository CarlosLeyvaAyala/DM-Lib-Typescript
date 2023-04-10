import { tap } from "./tap"
import { createFunction } from "./createFunction"
import { Level, LogFormat } from "./types"

/** Creates all functions at all logging levels with their corresponding Tapped counterparts.
 *
 * @param mod Mod name. This will be saved for each line.
 * @param logLvl Current logging level for the mod.
 * @param Console Console format.
 * @param File File format.
 * @returns An object with all functions.
 */

export function createAll(
  mod: string,
  logLvl: Level,
  Console?: LogFormat,
  File?: LogFormat
) {
  const CLF = (logAt: Level) =>
    createFunction(logLvl, logAt, mod, Console, File)

  const O = CLF(Level.optimization)
  const N = CLF(Level.none)
  const E = CLF(Level.error)
  const I = CLF(Level.info)
  const V = CLF(Level.verbose)
  return {
    /** Log at special mode: optimization. */
    Optimization: O,
    /** Log at none level. Basically, ignore logging settings, except when using special modes. */
    None: N,
    /** Log at error level. */
    Error: E,
    /** Log at info level. */
    Info: I,
    /** Log at verbose level. */
    Verbose: V,
    /** Log at special mode: optimization. Return value. */
    TapO: tap(O),
    /** Log at none level and return value. */
    TapN: tap(N),
    /** Log at error level and return value. */
    TapE: tap(E),
    /** Log at info level and return value. */
    TapI: tap(I),
    /** Log at verbose level and return value. */
    TapV: tap(V),
  }
}
