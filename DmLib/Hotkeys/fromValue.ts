import { Hotkey, Modifiers, DxScanCode, Modifier } from "./types"

/** Converts either a `string` or `number` to a hotkey value.
 * @remarks
 * This function is best used in tandem with {@link listenTo},
 * so that function can execute hotkeys like `"Ctrl Enter"`.
 */

export function fromValue(l: any): Hotkey {
  let t: number | undefined = undefined
  let m: Modifiers | undefined = undefined

  if (typeof l === "string") {
    const { hk, modifiers } = extractHkAndModifiers(l)
    t = (<any>DxScanCode)[hk]
    m = modifiers
  } else if (typeof l === "number") t = l
  return t === undefined ? { hk: DxScanCode.None } : { hk: t, modifiers: m }
}
/** Extracts modifiers from a string hotkey. */
function extractHkAndModifiers(s: string) {
  if (!s) return { hk: "None", modifiers: undefined }
  let m: Modifiers | undefined = {}
  const find = (sub: Modifier) => {
    if (s.indexOf(sub) > -1) {
      s = s.replace(sub, "").trim()
      return true
    } else return false
  }

  m.alt = find("Alt")
  m.ctrl = find("Ctrl")
  m.shift = find("Shift")

  // Undefined if no modifiers were found
  m = !m.alt && !m.ctrl && !m.shift ? undefined : m

  return { hk: s, modifiers: m }
}
