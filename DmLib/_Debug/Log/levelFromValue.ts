import { Level } from "./types"

/** Gets the logging level from some value.
 * @remarks
 * Defaults to `verbose` if level could not be recognized.
 */

export function levelFromValue(v: any) {
  const l =
    typeof v === "string"
      ? v.toLowerCase()
      : typeof v === "number"
      ? v
      : "verbose"
  let t = (<any>Level)[l]
  if (typeof l === "number") t = Level[t]
  return t === undefined ? Level.verbose : t
}
