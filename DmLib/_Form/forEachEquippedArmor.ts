import { Actor, Armor, SlotMask } from "skyrimPlatform"

/** Does something for each `Armor` an `Actor` has equipped.
 *
 * @param a Actor to check.
 * @param DoSomething What to do when an equipped armor is found.
 */
// * Notice how this function doesn't use ForEachEquippedSlotMask.
// * That's because this function is used quite a lot in real time
// * and it's better to help it be faster, even if it's only one bit.

export function forEachEquippedArmor(
  a: Actor | null,
  DoSomething: (arm: Armor) => void
) {
  if (!a) return
  for (let i = SlotMask.Head; i < SlotMask.FX01; i *= 2) {
    const x = Armor.from(a.getWornForm(i))
    if (x) DoSomething(x)
  }
}
