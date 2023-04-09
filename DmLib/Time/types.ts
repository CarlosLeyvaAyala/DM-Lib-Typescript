/** Ratio to convert Skyrim hours to human hours. */
export const gameHourRatio = 1.0 / 24.0

/** Hours as a fraction of a day; where 1.0 == 24 hours. */
export type SkyrimHours = number

/** Hours as humans use them; where 24 == 1.0 days. */
export type HumanHours = number

/** Minutes as humans use them; where `1 == 0.00069444` Skyrim days. */
export type HumanMinutes = number
