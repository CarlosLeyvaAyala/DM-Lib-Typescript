import { Input } from "skyrimPlatform"
import { Modifier, DxScanCode } from "./types"

/** Returns wether a Modifier is pressed. */
function isModifierPressed(m: Modifier) {
  const l =
    m === "Alt"
      ? DxScanCode.LeftAlt
      : m === "Ctrl"
      ? DxScanCode.LeftControl
      : DxScanCode.LeftShift
  const r =
    m === "Alt"
      ? DxScanCode.RightAlt
      : m === "Ctrl"
      ? DxScanCode.RightControl
      : DxScanCode.RightShift
  return () => Input.isKeyPressed(l) || Input.isKeyPressed(r)
}
/** Is `Shift` pressed? */

export const isShiftPressed = isModifierPressed("Shift")
/** Is `Ctrl` pressed? */
export const isCtrlPressed = isModifierPressed("Ctrl")
/** Is `Alt` pressed? */
export const isAltPressed = isModifierPressed("Alt")
