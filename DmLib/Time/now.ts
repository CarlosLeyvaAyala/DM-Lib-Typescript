import { Utility } from "skyrimPlatform"
import { SkyrimHours } from "./types"

/** Current time in {@link SkyrimHours}. */
export const now: () => SkyrimHours = Utility.getCurrentGameTime

export { now as Now }
