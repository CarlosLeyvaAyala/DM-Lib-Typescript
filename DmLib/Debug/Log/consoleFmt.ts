import { LogFormat } from "./types"

/** Returns a string in the form `"[Mod name]: Message"`.
 * @see {@link fileFmt}.
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

export const consoleFmt: LogFormat = (_, __, n, ___, msg) => `[${n}]: ${msg}`
