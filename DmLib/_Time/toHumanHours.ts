import { HumanHours, SkyrimHours, gameHourRatio } from "./types"

/** Changes {@link SkyrimHours} to {@link HumanHours}.
 *
 * @param x Time in {@link SkyrimHours}.
 * @returns Time in human readable hours.
 *
 * @example
 * ToHumanHours(2.0)   // => 48. Two full days
 * ToHumanHours(0.5)   // => 12. Half a day
 */
export const toHumanHours = (x: SkyrimHours): HumanHours => x / gameHourRatio
