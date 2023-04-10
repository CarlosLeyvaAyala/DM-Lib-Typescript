import { Armor, ObjectReference } from "skyrimPlatform"
import { forEachItem } from "./forEachItem"

/**
 * Iterates over all armors belonging to some `ObjectReference`, from last to first.
 *
 * @param o - The object reference to iterate over.
 * @param f - Function applied to each armor.
 */
export function forEachArmorR(o: ObjectReference, f: (armor: Armor) => void) {
  forEachItem(o, (i) => {
    const a = Armor.from(i)
    if (!a) return
    f(a)
  })
}
