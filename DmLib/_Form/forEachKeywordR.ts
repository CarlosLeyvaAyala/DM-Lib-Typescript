import { Form, Keyword } from "skyrimPlatform"

/** Iterates over all keywords belonging to some `Form`, from last to first.
 *
 * @param o - The form to iterate over.
 * @param f - Function applied to each keyword.
 */

export function forEachKeywordR(o: Form | null, f: (keyword: Keyword) => void) {
  if (!o) return
  let i = o.getNumKeywords()
  while (i > 0) {
    i--
    const k = Keyword.from(o.getNthKeyword(i))
    if (k) f(k)
  }
}
