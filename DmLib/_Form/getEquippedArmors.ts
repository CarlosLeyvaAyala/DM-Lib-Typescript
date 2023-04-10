import { Actor, Armor, Game } from "skyrimPlatform"
import { forEachEquippedArmor } from "./forEachEquippedArmor"

/** Gets all armors an `Actor` is wearing.
 *
 * @param a Actor to check for.
 * @param nonRepeated Some armors may occupy more than one bodyslot.
 * When this value is `false`, those armors will be returned multiple times: once for each slot.
 * @param playableOnly Return only playeable armors?
 * @param namedOnly Return only named armors?
 * @returns An array with all equipped armors.
 *
 * @remarks
 * ***WARNING***. This function ***may*** be slow (not to Papyrus levels, of course) and
 * it's recommended to be used with caution in real production code.
 *
 * However, it can be safely used sparingly.
 */

export function getEquippedArmors(
  a: Actor | null,
  nonRepeated: boolean = true,
  playableOnly: boolean = true,
  namedOnly: boolean = true
) {
  if (!a) return []
  const all: Armor[] = []

  forEachEquippedArmor(a, (x) => {
    const p = playableOnly ? (x.isPlayable() ? x : null) : x
    const n = p && namedOnly ? (p.getName() !== "" ? p : null) : p
    if (n) all.push(n)
  })

  const GetNonRepeated = () => {
    const uIds = [...new Set(all.map((a) => a.getFormID()))]
    return uIds.map((id) => Armor.from(Game.getFormEx(id)) as Armor)
  }

  return nonRepeated ? GetNonRepeated() : all
}
