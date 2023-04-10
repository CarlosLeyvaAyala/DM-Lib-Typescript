import { Actor, SlotMask } from "skyrimPlatform"

/** Tries to do something on an `Actor` on each slot mask.
 * @param  {Actor|null} a Actor to work on.
 * @param  {(slot:number)=>void} DoSomething What to do on each slot mask.
 */

export function forEachSlotMask(
  a: Actor | null,
  DoSomething: (slot: number) => void
) {
  if (!a) return
  for (let i = SlotMask.Head; i < SlotMask.FX01; i *= 2) {
    DoSomething(i)
  }
}
