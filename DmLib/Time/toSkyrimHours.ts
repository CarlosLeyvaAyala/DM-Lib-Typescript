import { HumanHours, SkyrimHours, gameHourRatio } from "./types"

/** Converts {@link HumanHours} to {@link SkyrimHours}.
 *
 * @param x Time in human readable hours.
 * @returns Time in {@link SkyrimHours}.
 *
 * @example
 * ToHumanHours(48)   // => 2.0. Two full days
 * ToHumanHours(12)   // => 0.5. Half a day
 */
export const toSkyrimHours = (x: HumanHours): SkyrimHours => x * gameHourRatio
