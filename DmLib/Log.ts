import { printConsole, settings, writeLogs } from "skyrimPlatform"

/** How much will the console be spammed.
 * - optimization     Meant to only output the times functions take to execute. Used for bottleneck solving.
 * - none       No spam.
 * - error      Just errors and stuff like that.
 * - info       Detailed info so players can know if things are going as expected, but not enough for actual debugging.
 * - verbose    Info meant for developers. Use it for reporting errors or unexpected behavior.
 */
export enum Level {
  optimization = -1,
  none,
  error,
  info,
  verbose,
}

/** Gets the logging level from some configuration file.
 *
 * @param pluginName Name of the plugin to get the value from.
 * @param optionName Name of the variable that carries the value.
 * @returns The logging level from file. `verbose` if value was invalid.
 */
export function LevelFromSettings(
  pluginName: string,
  optionName: string
): Level {
  return LevelFromValue(settings[pluginName][optionName])
}

export function LevelFromValue(v: any) {
  const l =
    typeof v === "string"
      ? v.toLowerCase()
      : typeof v === "number"
      ? v
      : "verbose"
  let t = (<any>Level)[l]
  if (typeof l === "number") t = Level[t]
  return t === undefined ? Level.verbose : t
}

/** A function that accepts a message. Returns nothing. */
export type LoggingFunction = (msg: string) => void

/** Signature of a function used for giving format to logging. */
export type LogFormat = (
  currLogLvl: Level,
  maxLogLvl: Level,
  modName: string,
  date: Date,
  msg: string
) => string

/** Returns a string in the form `"[Mod name]: Message"`.
 * @see {@link FileFmt}.
 *
 * @remarks
 * You can use this function as a guide on how a {@link LogFormat} function
 * used for {@link CreateFunction} can be made.
 *
 * @example
 * const LogI = CreateFunction(userLevel, Level.info, "my-mod", ConsoleFmt, FileFmt)
 * const LogV = CreateFunction(userLevel, Level.verbose, "my-mod", ConsoleFmt, FileFmt)
 *
 * // Console output: "[my-mod]: This is important for the player."
 * // File output: "[info] 4/5/2021 12:32:15 p.m.: This is important for the player."
 * LogI("This is important for the player.")
 *
 * // Console output: "[my-mod]: This is useful for debugging."
 * // File output: "[verbose] 4/5/2021 12:32:15 p.m.: This is useful for debugging."
 * LogV("This is useful for debugging.")
 */
export const ConsoleFmt: LogFormat = (_, __, n, ___, msg) => `[${n}]: ${msg}`

/** Returns a string in the form `"[logging level] date-time: Message"`.
 * @see {@link ConsoleFmt}.
 *
 * @remarks
 * You can use this function as a guide on how a {@link LogFormat} function
 * used for {@link CreateFunction} can be made.
 *
 * Format for https://github.com/Scarfsail/AdvancedLogViewer :\
 *    `[{Type}] {Date} {Time}: {Message}`
 *
 * @example
 * const LogI = CreateFunction(userLevel, Level.info, "my-mod", ConsoleFmt, FileFmt)
 * const LogV = CreateFunction(userLevel, Level.verbose, "my-mod", ConsoleFmt, FileFmt)
 *
 * // Console output: "[my-mod]: This is important for the player."
 * // File output: "[info] 4/5/2021 12:32:15 p.m.: This is important for the player."
 * LogI("This is important for the player.")
 *
 * // Console output: "[my-mod]: This is useful for debugging."
 * // File output: "[verbose] 4/5/2021 12:32:15 p.m.: This is useful for debugging."
 * LogV("This is useful for debugging.")
 */
export const FileFmt: LogFormat = (_, m, __, t, msg) =>
  `[${Level[m]}] ${t.toLocaleString()}: ${msg}`

/** A function that accepts a message, a variable and an optional function.
 *
 * Returns the variable after logging the message.
 * If a function was passed, it will be applied to the variable before logging.
 *
 * Function `f` must be a function that transforms variables of the same type
 *  of `x` to string.
 */
export type TappedFunction = <T>(msg: string, x: T, f?: (x: T) => string) => T

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
export function Append(f: LoggingFunction, append: any): LoggingFunction {
  return (msg: any) => f(append + msg)
}

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
export const append = Append

/** Creates a logging function that appends some message before logging.
 *
 * @see {@link Append}
 *
 * @param f Function to wrap.
 * @param append Message to append each time the result is called.
 * @returns A {@link TappedFunction}.
 */
export function AppendT(f: TappedFunction, append: any): TappedFunction {
  return <T>(msg: string, x: T, fmt?: (x: T) => string) =>
    f(append + msg, x, fmt)
}

/** Creates a logging function that appends some message before logging.
 *
 * @see {@link Append}
 *
 * @param f Function to wrap.
 * @param append Message to append each time the result is called.
 * @returns A {@link TappedFunction}.
 */
export const appendT = AppendT

/** Creates a function used for logging. Said function can log to either console or to some file.
 *
 * @see {@link FileFmt}, {@link ConsoleFmt}.
 *
 * @param currLogLvl The log level the user has selected. I.e. how much info they want to get.
 * @param logAt At which level this function will log.
 * @param modName Name of the mod. Will be used to output messages and to name the output file.
 * Output file will be named `"Data\Platform\Plugins\modName-logs.txt"`.
 * @param ConsoleFmt A function of type {@link LogFormat}. If `undefined`, nothing will be output to console.
 * @param FileFmt A function of type {@link LogFormat}. If `undefined`, nothing will be output to file.
 * @returns A function that logs a message as a string.
 *
 * @example
 * // LogI will only log to file
 * const LogI = CreateFunction(Level.info, Level.info, "my-mod", undefined, FileFmt)
 *
 * // LogV won't log anything because player only wants to log at most Level.info type messages
 * const LogV = CreateFunction(Level.info, Level.verbose, "my-mod", ConsoleFmt, FileFmt)
 */
export function CreateFunction(
  currLogLvl: Level,
  logAt: Level,
  modName: string,
  ConsoleFmt?: LogFormat,
  FileFmt?: LogFormat
): LoggingFunction {
  return function (msg: any) {
    const canLog =
      currLogLvl >= logAt || (currLogLvl < 0 && currLogLvl === logAt)
    if (!canLog) return

    const t = new Date()
    if (ConsoleFmt) printConsole(ConsoleFmt(currLogLvl, logAt, modName, t, msg))
    if (FileFmt) writeLogs(modName, FileFmt(currLogLvl, logAt, modName, t, msg))
  }
}

/** Creates all functions at all logging levels with their corresponding Tapped counterparts.
 *
 * @param mod Mod name. This will be saved for each line.
 * @param logLvl Current logging level for the mod.
 * @param Console Console format.
 * @param File File format.
 * @returns An object with all functions.
 */
export function CreateAll(
  mod: string,
  logLvl: Level,
  Console?: LogFormat,
  File?: LogFormat
) {
  const CLF = (logAt: Level) =>
    CreateFunction(logLvl, logAt, mod, Console, File)

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
    TapO: Tap(O),
    /** Log at none level and return value. */
    TapN: Tap(N),
    /** Log at error level and return value. */
    TapE: Tap(E),
    /** Log at info level and return value. */
    TapI: Tap(I),
    /** Log at verbose level and return value. */
    TapV: Tap(V),
  }
}

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
export function Tap(f: LoggingFunction): TappedFunction {
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

import * as C from "./Combinators"

/** Returns `x` while executing a logging function. `R` means _[R]eturn_.
 *
 * @remarks
 * This is useful for uncluttering logging calls when returning values from functions,
 * but can be used to log variable assignments as well.
 *
 * At first this may look like it's doing the same as {@link Tap}, but this function provides much
 * more flexibility at the cost of doing more writing.\
 * Both functions are useful and can be used together for great flexibilty.
 *
 * @param f A function that takes any number of arguments and returns `void`.
 * @param x The value to be returned.
 * @returns `x`
 *
 * @example
 * const Msg = (s: string) => { printConsole(`This is a ${s}`) }
 * const x = R(Msg("number"), 2)       // => "This is a number"; x === 2
 * const s = R(Msg("string"), "noob")  // => "This is a string"; s === "noob"
 */
export const R = C.Return

/** Converts an integer to hexadecimal notation.
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
