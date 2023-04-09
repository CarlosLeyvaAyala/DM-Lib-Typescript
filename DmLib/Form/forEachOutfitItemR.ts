import { Form, Outfit } from "skyrimPlatform"

/** Iterates over all items belonging to some `Outfit`, from last to first.
 *
 * @param o - The outfit to iterate over.
 * @param f - Function applied to each item.
 */

export function forEachOutfitItemR(o: Outfit | null, f: (item: Form) => void) {
  if (!o) return
  let i = o.getNumParts()
  while (i > 0) {
    i--
    const ii = o.getNthPart(i)
    if (ii) f(ii)
  }
}
