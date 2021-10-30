import { K, Tap } from "./Combinators"

/**
 * Module for debugging-related functions.
 */
import { printConsole, settings, Utility, writeLogs } from "../skyrimPlatform"

/** How much will the console be spammed.
 * - optimization     Meant to only output the times functions take to execute. Used for bottleneck solving.
 *
 * - none       No spam.
 * - error      Just errors and stuff like that.
 * - info       Detailed info so players can know if things are going as expected, but not enough for actual debugging.
 * - verbose    Info meant for developers. Use it for reporting errors or unexpected behavior.
 */
export enum LoggingLevel {
  optimization = -1,
  none,
  error,
  info,
  verbose,
}

/**
 * Gets the logging level from some configuration file.
 *
 * @param pluginName Name of the plugin to get the value from.
 * @param optionName Name of the variable that carries the value.
 * @returns The logging level from file. `verbose` if value was invalid.
 */
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

/** A function that accepts a message, a variable and an optional function.
 *
 * Returns the variable after logging the message.
 * If a function was passed, it will be applied to the variable before logging.
 *
 * Function `f` must be a function that transforms variables of the same type
 *  of `x` to string.
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

export type LogFormat = (
  currLogLvl: LoggingLevel,
  maxLogLvl: LoggingLevel,
  modName: string,
  date: Date,
  msg: string
) => string

export function CreateLoggingFunctionEx(
  currLogLvl: LoggingLevel,
  logAt: LoggingLevel,
  modName: string,
  ConsoleFmt?: LogFormat,
  FileFmt?: LogFormat
) {
  return function (msg: string) {
    const canLog =
      currLogLvl >= logAt || (currLogLvl < 0 && currLogLvl === logAt)
    if (!canLog) return

    const t = new Date()
    if (ConsoleFmt) printConsole(ConsoleFmt(currLogLvl, logAt, modName, t, msg))
    if (FileFmt) writeLogs(modName, FileFmt(currLogLvl, logAt, modName, t, msg))
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
 * const IntToHex = (x: number) => x.toString(16)
 * const LogAndInit = TapLog(printConsole)
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
export function TapLog(f: LoggingFunction): TappedLoggingFunction {
  return function <T>(msg: string, x: T, g?: (x: T) => string): T {
    if (g) f(`${msg}: ${g(x)}`)
    else f(`${msg}: ${x}`)
    return x
  }
}

/** Returns `x` while executing a logging function.
 *
 * @remarks
 * This is useful for uncluttering logging calls when returning values from functions,
 * but can be used to log variable assignments as well.
 *
 * At first this may look like it's doing the same as {@link TapLog}, but this function provides much
 * more flexibility at the cost of doing more writing.\
 * Both functions are useful and can be used together for great flexibilty.
 *
 * @param f A function that takes any number of arguments and returns `void`.
 * @param x The value to be returned.
 * @returns `x`
 *
 * @example
 * const Msg = (s: string) => { printConsole(`This is a ${s}`) }
 * const x = LogR(Msg("number"), 2)       // => "This is a number"; x === 2
 * const s = LogR(Msg("string"), "noob")  // => "This is a string"; s === "noob"
 */
export const LogR = <T>(f: void, x: T) => Tap(x, K(f))

/** @experimental
 * Doesn't work right now. Maybe I need to use promises and whatnot.
 *
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

/**
 * Converts an integer to hexadecimal notation.
 *
 * @remarks
 * This function has apparently absurd safeguards because it's intended to be used for logging.\
 * If you want a straight forward conversion, just use `x.toString(16)`.
 *
 * @param x
 * @returns string
 */
export function IntToHex(x: number) {
  return !x || typeof x !== "number"
    ? "IntToHex: Undefined value"
    : x.toString(16)
}
