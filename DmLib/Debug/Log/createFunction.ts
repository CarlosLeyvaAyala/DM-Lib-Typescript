import { printConsole, writeLogs } from "skyrimPlatform"
import { Level, LogFormat, LoggingFunction } from "./types"

/** Creates a function used for logging. Said function can log to either console or to some file.
 *
 * @see {@link fileFmt}, {@link consoleFmt}.
 *
 * @param currLogLvl The log level the user has selected. I.e. how much info they want to get.
 * @param logAt At which level this function will log.
 * @param modName Name of the mod. Will be used to output messages and to name the output file.
 * Output file will be named `"Data\Platform\Plugins\modName-logs.txt"`.
 * @param consoleFmt A function of type {@link LogFormat}. If `undefined`, nothing will be output to console.
 * @param fileFmt A function of type {@link LogFormat}. If `undefined`, nothing will be output to file.
 * @returns A function that logs a message as a string.
 *
 * @example
 * // LogI will only log to file
 * const LogI = CreateFunction(Level.info, Level.info, "my-mod", undefined, FileFmt)
 *
 * // LogV won't log anything because player only wants to log at most Level.info type messages
 * const LogV = CreateFunction(Level.info, Level.verbose, "my-mod", ConsoleFmt, FileFmt)
 */

export function createFunction(
  currLogLvl: Level,
  logAt: Level,
  modName: string,
  consoleFmt?: LogFormat,
  fileFmt?: LogFormat
): LoggingFunction {
  const canLog = currLogLvl >= logAt || (currLogLvl < 0 && currLogLvl === logAt)

  if (!canLog) return (_: any) => {}
  else
    return function (msg: any) {
      const t = new Date()
      if (consoleFmt)
        printConsole(consoleFmt(currLogLvl, logAt, modName, t, msg))
      if (fileFmt)
        writeLogs(modName, fileFmt(currLogLvl, logAt, modName, t, msg))
    }
}
