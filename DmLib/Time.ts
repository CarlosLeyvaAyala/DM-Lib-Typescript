import { Utility } from "skyrimPlatform"

/** Ratio to convert Skyrim hours to human hours. */
const gameHourRatio = 1.0 / 24.0

/** Current time in {@link SkyrimHours}. */
export const Now: () => SkyrimHours = Utility.getCurrentGameTime

/** Hours as a fraction of a day; where 1.0 == 24 hours. */
export type SkyrimHours = number

/** Hours as humans use them; where 24 == 1.0 days. */
export type HumanHours = number

/** Minutes as humans use them; where `1 == 0.00069444` Skyrim days. */
export type HumanMinutes = number

/** Changes {@link SkyrimHours} to {@link HumanHours}.
 *
 * @param x Time in {@link SkyrimHours}.
 * @returns Time in human readable hours.
 *
 * @example
 * ToHumanHours(2.0)   // => 48. Two full days
 * ToHumanHours(0.5)   // => 12. Half a day
 */
export const ToHumanHours = (x: SkyrimHours): HumanHours => x / gameHourRatio

/** Changes {@link SkyrimHours} to {@link HumanHours}.
 *
 * @param x Time in {@link SkyrimHours}.
 * @returns Time in human readable hours.
 *
 * @example
 * ToHumanHours(2.0)   // => 48. Two full days
 * ToHumanHours(0.5)   // => 12. Half a day
 */
export const toHumanHours = ToHumanHours

/** Converts a {@link SkyrimHours} to a `string` in {@link HumanHours}. */
export const ToHumanHoursStr = (x: SkyrimHours) => ToHumanHours(x).toString()

/** Converts a time in minutes to hours. */
export const MinutesToHours = (x: number) => x / 60

/** Converts a time in hours to minutes. */
export const HoursToMinutes = (x: number) => x * 60

/** Converts {@link HumanHours} to {@link SkyrimHours}.
 *
 * @param x Time in human readable hours.
 * @returns Time in {@link SkyrimHours}.
 *
 * @example
 * ToHumanHours(48)   // => 2.0. Two full days
 * ToHumanHours(12)   // => 0.5. Half a day
 */
export const ToSkyrimHours = (x: HumanHours): SkyrimHours => x * gameHourRatio

/** Converts {@link HumanHours} to {@link SkyrimHours}.
 *
 * @param x Time in human readable hours.
 * @returns Time in {@link SkyrimHours}.
 *
 * @example
 * ToHumanHours(48)   // => 2.0. Two full days
 * ToHumanHours(12)   // => 0.5. Half a day
 */
export const toSkyrimHours = ToSkyrimHours

/** Returns in human hours how much time has passed between `Now` and some hour given
 * in {@link SkyrimHours}.
 * @param then {@link SkyrimHours}
 * @returns Hour span in {@link HumanHours}
 */
export const HourSpan = (then: SkyrimHours): HumanHours =>
  ToHumanHours(Now() - then)

/** Returns in human hours how much time has passed between `Now` and some hour given
 * in {@link SkyrimHours}.
 * @param then {@link SkyrimHours}
 * @returns Hour span in {@link HumanHours}
 */
export const hourSpan = HourSpan

/** Converts {@link HumanMinutes} to {@link SkyrimHours}.
 * @param  {number} x Minutes to convert.
 */
export const MinutesToSkyrimHours = (x: HumanMinutes) =>
  ToSkyrimHours(MinutesToHours(x))

/** Converts {@link SkyrimHours} to {@link HumanMinutes}.
 * @param  {number} x Minutes to convert.
 */
export const SkyrimHoursToHumanMinutes = (x: SkyrimHours) =>
  HoursToMinutes(ToHumanHours(x))
