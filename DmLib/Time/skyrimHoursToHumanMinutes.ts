import { hoursToMinutes } from "./hoursToMinutes"
import { toHumanHours } from "./toHumanHours"
import { HumanMinutes, SkyrimHours } from "./types"

/** Converts {@link SkyrimHours} to {@link HumanMinutes}.
 * @param  {number} x Minutes to convert.
 */
export const skyrimHoursToHumanMinutes = (x: SkyrimHours) =>
  hoursToMinutes(toHumanHours(x))
