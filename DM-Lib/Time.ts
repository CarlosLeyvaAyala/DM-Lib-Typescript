import { Utility } from "../skyrimPlatform"

/** Ratio to convert Skyrim hours to human hours */
const gameHourRatio = 1.0 / 24.0

/** Current time in Skyrim Hours */
export const Now = Utility.getCurrentGameTime

/** Hours as a fraction of a day; where 1.0 == 24 hours. */
export type SkyrimHours = number

/** Hours as humans use them; where 24 == 1.0 days. */
export type HumanHours = number

/** Changes Skyrim hours to human hours.
 *
 * @param x Skyrim hours.
 * @returns Human readable hours.
 *
 * @example
 * 48 <- ToHumanHours(2.0)   // Two full days
 * 12 < -ToHumanHours(0.5)   // Half a day
 */
export const ToHumanHours = (x: SkyrimHours): HumanHours => x / gameHourRatio

/** Changes human hours to Skyrim hours.
 *
 * @param x Human readable hours.
 * @returns Skyrim hours.
 *
 * @example
 * 2.0 <- ToHumanHours(48)   // Two full days
 * 0.5 < -ToHumanHours(12)   // Half a day
 */
export const ToSkyrimHours = (x: HumanHours): SkyrimHours => x * gameHourRatio

/** Returns in human hours how much time has passed between `Now` and some hour.
 * @param then Skyrim Hour
 * @returns Human hour
 */
export const HourSpan = (then: SkyrimHours): HumanHours =>
  ToHumanHours(Now() - then)

// Aliases for people preferring names starting in lowercase.
// These names are more in line with skyrimPlatform naming conventions.
export const now = Now
export const toHumanHours = ToHumanHours
export const toSkyrimHours = ToSkyrimHours
export const hourSpan = HourSpan
