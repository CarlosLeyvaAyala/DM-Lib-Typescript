import { minutesToHours } from "./minutesToHours"
import { toSkyrimHours } from "./toSkyrimHours"
import { HumanMinutes, SkyrimHours } from "./types"

/** Converts {@link HumanMinutes} to {@link SkyrimHours}.
 * @param  {number} x Minutes to convert.
 */
export const minutesToSkyrimHours = (x: HumanMinutes) =>
  toSkyrimHours(minutesToHours(x))
