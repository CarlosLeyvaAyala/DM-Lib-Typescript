import { Input, once, printConsole, settings } from "skyrimPlatform"
import * as Log from "./Log"

/** Was copied from skyrimPlatform.ts because definitions in there are exported as a `const enum`,
 * thus making impossible to convert a string `DxScanCode` to number.
 *
 * With that setup it was impossible to make {@link FromSettings} to read scan codes as strings.
 */
export enum DxScanCode {
  None,
  Escape,
  N1,
  N2,
  N3,
  N4,
  N5,
  N6,
  N7,
  N8,
  N9,
  N0,
  Minus,
  Equals,
  Backspace,
  Tab,
  Q,
  W,
  E,
  R,
  T,
  Y,
  U,
  I,
  O,
  P,
  LeftBracket,
  RightBracket,
  Enter,
  LeftControl,
  A,
  S,
  D,
  F,
  G,
  H,
  J,
  K,
  L,
  Semicolon,
  Apostrophe,
  Console,
  LeftShift,
  BackSlash,
  Z,
  X,
  C,
  V,
  B,
  N,
  M,
  Comma,
  Period,
  ForwardSlash,
  RightShift,
  NumMult,
  LeftAlt,
  Spacebar,
  CapsLock,
  F1,
  F2,
  F3,
  F4,
  F5,
  F6,
  F7,
  F8,
  F9,
  F10,
  NumLock,
  ScrollLock,
  Num7,
  Num8,
  Num9,
  NumMinus,
  Num4,
  Num5,
  Num6,
  NumPlus,
  Num1,
  Num2,
  Num3,
  Num0,
  NumDot,
  F11 = 87,
  F12,
  NumEnter = 156,
  RightControl,
  NumSlash = 181,
  SysRqPtrScr = 183,
  RightAlt,
  Pause = 197,
  Home = 199,
  UpArrow,
  PgUp,
  LeftArrow = 203,
  RightArrow = 205,
  End = 207,
  DownArrow,
  PgDown,
  Insert,
  Delete,
  LeftMouseButton = 256,
  RightMouseButton,
  MiddleMouseButton,
  MouseButton3,
  MouseButton4,
  MouseButton5,
  MouseButton6,
  MouseButton7,
  MouseWheelUp,
  MouseWheelDown,
}

export type KeyPressEvt = () => void
export type KeyHoldEvt = (frames: number) => () => void
export const DoNothing: KeyPressEvt = () => {}
export const DoNothingOnHold: KeyHoldEvt = (_) => () => {}

/** Creates a function that reads and logs a Hotkey at the same time.
 *
 * @param Log {@link DebugLib.Log.TappedFunction} used to log the hotkey.
 * @param Get A function that gets a hotkey by name.
 * @param appendStr Message to append before the hotkey name and data. `"Hotkey "` by default.
 * @returns A function that accepts a key name and returns a {@link Hotkey}.
 *
 * @example
 * const LH = DebugLib.Log.Tap(printConsole)
 * const GetHotkey = GetAndLog(LH, FromValue)
 *
 * ListenTo(GetHotkey("hk1")) // => "Hotkey hk1: Shift Enter" is printed to console
 */
export function GetAndLog(
  log: Log.TappedFunction,
  Get: (k: string) => Hotkey,
  appendStr: string = "Hotkey "
) {
  const A = appendStr ? Log.AppendT(log, appendStr) : log
  return (k: string) => A(k, Get(k), ToString)
}

/** Gets a hotkey from some configuration file.
 *
 * @remarks
 * This function can read both numbers and strings defined in {@link DxScanCode}.
 *
 * @param pluginName Name of the plugin to get the value from.
 * @param optionName Name of the variable that carries the value.
 * @returns The hotkey. `DxScanCode.None` if invalid.
 */
export const FromSettings = (pluginName: string, optionName: string) =>
  FromValue(settings[pluginName][optionName])

/** Reads a hotkey from a Json object inside some settings file.
 * @example
 * ```json
 * // Settings file
 * {
 *   "hotkeys": {
 *     "hk1": "Shift Enter"
 *   }
 * }
 * ```
 * ```ts
 *
 * // Typescript
 * const hk = FromObject("plugin", "hotkeys", "hk1") // => Shift + Enter
 * ```
 * @param pluginName Name of the plugin to get the value from.
 * @param objectName Name of the parent object of the wanted key.
 * @param optionName Name of the variable that carries the value.
 * @returns The hotkey. `DxScanCode.None` if invalid.
 */
export const FromObject = (
  pluginName: string,
  objectName: string,
  optionName: string
  // @ts-ignore
) => FromValue(settings[pluginName][objectName][optionName])

/** Extracts modifiers from a string hotkey. */
function ExtractHkAndModifiers(s: string) {
  if (!s) return { hk: "None", modifiers: undefined }
  let m: Modifiers | undefined = {}
  const Find = (sub: Modifier) => {
    if (s.indexOf(sub) > -1) {
      s = s.replace(sub, "").trim()
      return true
    } else return false
  }

  m.alt = Find("Alt")
  m.ctrl = Find("Ctrl")
  m.shift = Find("Shift")

  // Undefined if no modifiers were found
  m = !m.alt && !m.ctrl && !m.shift ? undefined : m

  return { hk: s, modifiers: m }
}

export type Modifier = "Alt" | "Ctrl" | "Shift"

/** Returns wether a Modifier is pressed. */
function IsModifierPressed(m: Modifier) {
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
export const IsShiftPressed = IsModifierPressed("Shift")
/** Is `Ctrl` pressed? */
export const IsCtrlPressed = IsModifierPressed("Ctrl")
/** Is `Alt` pressed? */
export const IsAltPressed = IsModifierPressed("Alt")

/** Converts either a `string` or `number` to a hotkey value.
 * @remarks
 * This function is best used in tandem with {@link ListenTo},
 * so that function can execute hotkeys like `"Ctrl Enter"`.
 */
export function FromValue(l: any): Hotkey {
  let t: number | undefined = undefined
  let m: Modifiers | undefined = undefined

  if (typeof l === "string") {
    const { hk, modifiers } = ExtractHkAndModifiers(l)
    t = (<any>DxScanCode)[hk]
    m = modifiers
  } else if (typeof l === "number") t = l
  return t === undefined ? { hk: DxScanCode.None } : { hk: t, modifiers: m }
}

export const fromValue = FromValue

/** Converts a {@link Hotkey} to string.
 * @remarks Used for presenting info to players.
 */
export function ToString(h: Hotkey) {
  const k = DxScanCode[h.hk]
  const s = h.modifiers?.shift ? "Shift + " : ""
  const c = h.modifiers?.ctrl ? "Ctrl + " : ""
  const a = h.modifiers?.alt ? "Alt + " : ""
  return c + s + a + k
}

/** Full hotkey structure. */
export interface Hotkey {
  hk: DxScanCode
  modifiers?: Modifiers
}

/** Possible modifiers a hotkey function can have. */
export interface Modifiers {
  shift?: boolean
  ctrl?: boolean
  alt?: boolean
}

/** Used to contain the function that checks for modifiers.
 * Made like this for optimization purposes.
 */
namespace Modifiers {
  type TF = () => boolean
  const S = IsShiftPressed
  const A = IsAltPressed
  const C = IsCtrlPressed
  const T = (k: boolean | undefined, P: TF, f: TF) => {
    const p = P()
    if (k) {
      if (!p) return false // Key isn't pressed, but should
      return f() // Check if next sequence is pressed
    } else {
      if (p) return false // Key is pressed, but shouldn't
      return f() // Check if next sequence is pressed
    }
  }

  export function Continue(m: Modifiers) {
    const TC = () => T(m.ctrl, C, () => true)
    const TAC = () => T(m.alt, A, TC)
    const TSAC = () => T(m.shift, S, TAC)
    return TSAC()
  }
}

export type ListeningFunction = (
  OnPress?: KeyPressEvt,
  OnRelease?: KeyPressEvt,
  OnHold?: KeyHoldEvt
) => void

/** Listen to {@link Hotkey}. */
export const ListenTo = (hk: Hotkey, enable: boolean = true) =>
  ListenToS(hk.hk, enable, hk.modifiers)

/** "ListenTo - Simple". Listens for some Hotkey press / release / hold.
 *
 * @see {@link https://www.creationkit.com/index.php?title=Input_Script#DXScanCodes | DXScanCodes}
 * for possible hotkey values.
 *
 * @remarks
 * Use functions generated by this function ***only inside an `'update'` event***.
 * But ***DON'T GENERATE functions INSIDE an `'update'` event***.
 *
 * This function is intended to be used for quick prototyping.\
 * For "production" code, use {@link ListenTo}.
 *
 * @param hk The hotkey to listen for.
 * @param enable If `false`, a blank function will be returned.\
 * Use this argument when you need to listen to hotkeys only when you know some condition
 * will be true. This will avoid wasting time doing checks that will never come true.
 *
 * @returns A function that accepts three callbacks:
 * 1. OnKeyPress
 * 1. OnKeyReleased
 * 1. OnKeyHold - This one gets how many frames has the key being held
 *
 * @example
 * const LogPress = () => { printConsole(`Key was pressed`) }
 *
 * const LogRelease = () => { printConsole(`Key was released`) }
 *
 * const LogHold: KeyHoldEvt = n => () => { printConsole(`Key has been held for ${n} frames.`) }
 *
 * const DoStuff = ListenTo(76)           // Listen to num5
 * const OnlyCareForHold = ListenTo(77)   // Listen to num6
 *
 * const specialModeEnabled = settings["mod"]["specialMode"]
 * const SpecialOperation = ListenTo(DxScanCode.F10, specialModeEnabled)
 *
 * on('update', () => {
 *   DoStuff(LogPress, LogRelease, LogHold)
 *   OnlyCareForHold(undefined, undefined, LogHold)
 *
 *   SpecialOperation(LogPress)
 *
 *   // Never generate functions inside an update event.
 *   // The following code won't work.
 *   const NonWorking = ListenTo(78)
 *   NonWorking(LogPress, undefined, LogHold)
 * })
 */
export function ListenToS(
  hk: number,
  enable: boolean = true,
  modifiers?: Modifiers
): ListeningFunction {
  let old = false
  let frames = 0

  return enable && hk > DxScanCode.None
    ? (
        OnPress: KeyPressEvt = DoNothing,
        OnRelease: KeyPressEvt = DoNothing,
        OnHold: KeyHoldEvt = DoNothingOnHold
      ) => {
        if (modifiers && !Modifiers.Continue(modifiers)) return
        const p = Input.isKeyPressed(hk)

        if (old !== p) {
          frames = 0
          if (p) once("update", OnPress)
          else once("update", OnRelease)
        } else if (p) {
          frames++
          once("update", OnHold(frames))
        }

        old = p
      }
    : (
        OnPress: KeyPressEvt = DoNothing,
        OnRelease: KeyPressEvt = DoNothing,
        OnHold: KeyHoldEvt = DoNothingOnHold
      ) => {}
}

/** Not an useful function. Use it as a template. @see {@link ListenTo} */
export const LogPress = () => {
  printConsole(`Key was pressed`)
}

/** Not an useful function. Use it as a template. @see {@link ListenTo} */
export const LogRelease = () => {
  printConsole(`Key was released`)
}

/** Not an useful function. Use it as a template. @see {@link ListenTo} */
export const LogHold: KeyHoldEvt = (n) => () => {
  printConsole(`Key has been held for ${n} frames.`)
}
