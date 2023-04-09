import { Hotkey, DxScanCode } from "./types"

/** Converts a {@link Hotkey} to string.
 * @remarks Used for presenting info to players.
 */

export function toString(h: Hotkey) {
  const k = DxScanCode[h.hk]
  const s = h.modifiers?.shift ? "Shift + " : ""
  const c = h.modifiers?.ctrl ? "Ctrl + " : ""
  const a = h.modifiers?.alt ? "Alt + " : ""
  return c + s + a + k
}
