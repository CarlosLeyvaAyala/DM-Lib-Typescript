import { toHumanHours } from "./toHumanHours"
import { HumanHours, SkyrimHours } from "./types"

/** Converts a {@link SkyrimHours} to a `string` in {@link HumanHours}. */
export const toHumanHoursStr = (x: SkyrimHours) => toHumanHours(x).toString()
