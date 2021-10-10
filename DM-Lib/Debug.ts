/**
 * Module for debugging-related functions.
 */
import { printConsole, settings, Utility } from "../skyrimPlatform"

/** How much will the console be spammed.
 * - Optimization - Meant to only output the times functions take to execute. Used for bottleneck solving.
 * - None
 * - Error - Just errors
 * - Info - Detailed info so the players can know if things are going as expected, but not enough for actual debugging.
 * - Verbose - Info meant for developers.
 */
export enum LoggingLevel {
  optimization = -1,
  none,
  error,
  info,
  verbose,
}

export function ReadLoggingFromSettings(
  pluginName: string,
  optionName: string
): LoggingLevel {
  const l = settings[pluginName][optionName]
  const l2 = typeof l === "string" ? l : "None"
  const t = (<any>LoggingLevel)[l2]
  return t === undefined ? LoggingLevel.verbose : t
}

/** A function that accepts a message. Returns nothing. */
export type LoggingFunction = (msg: string) => void

/** A function that accepts both a message, a variable and an optional function.
 * Returns the variable after logging the message.
 * If a function was passed, it will be applied to the variable before logging.
 */
export type TappedLoggingFunction = <T>(
  msg: string,
  x: T,
  f?: (x: T) => string
) => T

/** Creates a logging function that will log the mod's name and message when the log level is correct.
 *
 * @returns A function that logs a message to the console.
 *
 * @remarks
 * Levels with negative numbers will only be displayed when the current logging level is exactly their value,
 * while positive numbers will get displayed when the current logging level is at least their value.
 * @see {@link LoggingLevel}
 *
 * @example
 * const CLF = (logAt: LoggingLevel) => CreateLoggingFunction("Meh", LoggingLevel.Info, logAt)
 * const LogO = CLF(LoggingLevel.Optimization)
 * const LogE = CLF(LoggingLevel.Error)
 * const LogI = CLF(LoggingLevel.Info)
 * const LogV = CLF(LoggingLevel.Verbose)
 *
 * LogO("Meh")              // ""
 * LogI("Mi mi mi mi mi")   // "[Meh] Mi mi mi mi mi"
 * LogV("Meh!")             // "[Meh] Meh!"
 */
export function CreateLoggingFunction(
  modName: string,
  currLogLvl: LoggingLevel,
  logAt: LoggingLevel
): LoggingFunction {
  return function (msg: string) {
    const m = `[${modName}] ${msg}`

    if (currLogLvl >= logAt || (currLogLvl < 0 && currLogLvl === logAt))
      printConsole(m)
  }
}

/**
 * Makes a logging function to log a value, then returns that value.
 *
 * @param f - The logging function.
 * @returns A {@link TappedLoggingFunction}.
 *
 * @remarks
 * This function is intended to be used to initialize variables while logging them,
 * so logging looks cleaner and variables become self documenting in code and
 * "debuggeable" at the same time.
 *
 * @example
 * const LogAndInit = TapLog(printConsole)
 * const x = LogAndInit("Value for x", 3) // -> "Value for x: 3". Meanwhile: x === 3.
 *
 * // Don't know what the next call will yield, but we can log it to console to see it!
 * const form = LogAndInit("Found form", Game.getFormFromFile(0x3bba, "Skyrim.esm"))
 */
export function TapLog(f: LoggingFunction): TappedLoggingFunction {
  return function <T>(msg: string, x: T, g?: (x: T) => string): T {
    if (g) f(`${msg}: ${g(x)}`)
    else f(`${msg}: ${x}`)
    return x
  }
}

/** @experimental
 * Measures the time it takes a function to execute and logs that.
 *
 * @remarks
 * `Utility.getCurrentRealTime()` seems to be returning the same value for both
 * times the function starts and ends.\
 * I suspect this is because most functions in Skyrim Platform don't wait for the others to end.
 *
 * @param f - Function to measure.
 * @param Log - Function used for logging the time. You can supply a logging level-aware function.
 */
export function Benchmark(f: () => void, Log: LoggingFunction): () => void {
  return () => {
    const t1 = Utility.getCurrentRealTime()
    Log(`${f.name} start time: ${t1}`)

    f()

    const t2 = Utility.getCurrentRealTime()
    Log(`${f.name} end time: ${t2}`)
    Log(`Execution time for ${f.name}: ${t2 - t1}`)
  }
}
