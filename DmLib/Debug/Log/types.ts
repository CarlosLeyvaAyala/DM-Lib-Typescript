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

/** A function that accepts a message, a variable and an optional function.
 *
 * Returns the variable after logging the message.
 * If a function was passed, it will be applied to the variable before logging.
 *
 * Function `f` must be a function that transforms variables of the same type
 *  of `x` to string.
 */
export type TappedFunction = <T>(msg: string, x: T, f?: (x: T) => string) => T
