import { now } from "./now"
import { toHumanHours } from "./toHumanHours"
import { HumanHours, SkyrimHours } from "./types"

/** Returns in human hours how much time has passed between `Now` and some hour given
 * in {@link SkyrimHours}.
 * @param then {@link SkyrimHours}
 * @returns Hour span in {@link HumanHours}
 */
export const hourSpan = (then: SkyrimHours): HumanHours =>
  toHumanHours(now() - then)
