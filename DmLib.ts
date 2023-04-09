import {
  Actor,
  Ammo,
  Armor,
  Book,
  Cell,
  Form,
  FormType,
  Game,
  hooks,
  Ingredient,
  Input,
  Key,
  Keyword,
  MiscObject,
  ObjectReference,
  once,
  Outfit,
  Potion,
  printConsole,
  settings,
  SlotMask,
  SoulGem,
  Utility,
  Weapon,
  writeLogs,
} from "skyrimPlatform"

/** Math related functions. */
export namespace MathLib {}

/** Functions related to `Forms`. */
export namespace FormLib {
  export const enum ItemType {
    None,
    Weapon,
    Ammo,
    Armor,
    Potion,
    Poison,
    Scroll,
    Food,
    Ingredient,
    Book,
    Key,
    Misc,
    SoulGem,
  }

  /** Returns what type of item a `Form` is.
   * @param  {Form|null} item Form to check.
   */
  export function GetItemType(item: Form | null) {
    if (!item) return ItemType.None
    if (Weapon.from(item)) return ItemType.Weapon
    if (Ammo.from(item)) return ItemType.Ammo
    if (Armor.from(item)) return ItemType.Armor

    const asP = Potion.from(item)
    if (asP) {
      if (asP.isPoison()) return ItemType.Poison
      if (asP.isFood()) return ItemType.Food
      return ItemType.Potion
    }

    if (Ingredient.from(item)) return ItemType.Ingredient
    if (Book.from(item)) return ItemType.Book
    if (Key.from(item)) return ItemType.Key
    if (SoulGem.from(item)) return ItemType.SoulGem
    if (MiscObject.from(item)) return ItemType.Misc

    return ItemType.None
  }

  /** Tries to do something on an `Actor` on each slot mask.
   * @param  {Actor|null} a Actor to work on.
   * @param  {(slot:number)=>void} DoSomething What to do on each slot mask.
   */
  export function ForEachSlotMask(
    a: Actor | null,
    DoSomething: (slot: number) => void
  ) {
    if (!a) return
    for (let i = SlotMask.Head; i < SlotMask.FX01; i *= 2) {
      DoSomething(i)
    }
  }

  /** Does something for each `Armor` an `Actor` has equipped.
   *
   * @param a Actor to check.
   * @param DoSomething What to do when an equipped armor is found.
   */
  // * Notice how this function doesn't use ForEachEquippedSlotMask.
  // * That's because this function is used quite a lot in real time
  // * and it's better to help it be faster, even if it's only one bit.
  export function ForEachEquippedArmor(
    a: Actor | null,
    DoSomething: (arm: Armor) => void
  ) {
    if (!a) return
    for (let i = SlotMask.Head; i < SlotMask.FX01; i *= 2) {
      const x = Armor.from(a.getWornForm(i))
      if (x) DoSomething(x)
    }
  }

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
  export function GetEquippedArmors(
    a: Actor | null,
    nonRepeated: boolean = true,
    playableOnly: boolean = true,
    namedOnly: boolean = true
  ) {
    if (!a) return []
    const all: Armor[] = []

    ForEachEquippedArmor(a, (x) => {
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

  /** Iterates over all keywords belonging to some `Form`, from last to first.
   *
   * @param o - The form to iterate over.
   * @param f - Function applied to each keyword.
   */
  export function ForEachKeywordR(
    o: Form | null,
    f: (keyword: Keyword) => void
  ) {
    if (!o) return
    let i = o.getNumKeywords()
    while (i > 0) {
      i--
      const k = Keyword.from(o.getNthKeyword(i))
      if (k) f(k)
    }
  }

  /** Iterates over all items belonging to some `Outfit`, from last to first.
   *
   * @param o - The outfit to iterate over.
   * @param f - Function applied to each item.
   */
  export function ForEachOutfitItemR(
    o: Outfit | null,
    f: (item: Form) => void
  ) {
    if (!o) return
    let i = o.getNumParts()
    while (i > 0) {
      i--
      const ii = o.getNthPart(i)
      if (ii) f(ii)
    }
  }

  /** Iterates over all forms of `formType` in some `cell`.
   *
   * @param cell Cell to search forms for.
   * @param formType {@link FormType}
   * @param f Function applied to each `Form`.
   */
  export function ForEachFormInCell(
    cell: Cell | null | undefined,
    formType: FormType,
    f: (frm: Form) => void
  ) {
    if (!cell) return
    let i = cell.getNumRefs(formType)
    while (i > 0) {
      i--
      const frm = cell.getNthRef(i, formType)
      if (frm) f(frm)
    }
  }

  /** Returns wether an `ObjectReference` is an alchemy lab.
   * @param  {ObjectReference} furniture The furniture to check.
   *
   * @remarks
   * This function is intended to be used with `on("furnitureEnter")`
   * and `on("furnitureExit")` Skyrim Platform events.
   */
  export const IsAlchemyLab = (furniture: ObjectReference) =>
    ObjRefHasName(furniture, "alchemy")

  /** Tests if an object reference contains some name */
  const ObjRefHasName = (f: ObjectReference, name: string) =>
    f.getBaseObject()?.getName().toLowerCase().includes(name)
}

/** Functions related to arrays. */
export namespace ArrayLib {
  /** Returns a random element from some array.
   *
   * @param arr Array to get the element from.
   * @returns A random element.
   */
  export function RandomElement<T>(arr: T[]) {
    return arr[Math.floor(Math.random() * arr.length)]
  }
}

/** Functions related to maps. */
export namespace MapLib {
  /** Joins two maps, applying a function when keys collide.
   *
   * @param m1 First map.
   * @param m2 Second map.
   * @param OnExistingKey Function for solving collisions.
   * @returns
   */
  export function JoinMaps<K, V>(
    m1: Map<K, V>,
    m2: Map<K, V> | null | undefined,
    OnExistingKey: (v1: V, v2: V, k?: K) => V
  ) {
    if (!m2) return m1
    const o = new Map<K, V>(m1)
    m2.forEach((v2, k) => {
      if (o.has(k)) o.set(k, OnExistingKey(o.get(k) as V, v2, k))
      else o.set(k, v2)
    })
    return o
  }
}

/** Miscelaneous functions that don't belong to other categories. */
export namespace Misc {
  /** Adapts a PapyrusUtil saving function so it can be used with {@link PreserveVar}.
   *
   * @param f Function to adapt.
   * @param obj Object to save values on. Use `null` to save globally.
   * @returns A function that accepts a key and a value.
   *
   * @example
   * const SaveFlt = PapyrusUtilToPreserving(PapyrusUtil.SetFloatValue, null)
   * const SaveInt = PapyrusUtilToPreserving(PapyrusUtil.SetIntValue, null)
   */
  export function PapyrusUtilToPreserving<T>(
    f: (obj: Form | null | undefined, k: string, v: T) => void,
    obj: Form | null | undefined
  ) {
    return (k: string, v: T) => {
      f(obj, k, v)
    }
  }

  /** Returns a function that accepts a function `f` that gets executed each `seconds`.
   *
   * @remarks
   * This is meant to be used as a substitute of sorts to the `OnUpdate` Papyrus event,
   * but it doesn't check if the player has the game paused inside a menu; that's up to
   * `f` to implement.
   *
   * @param seconds Seconds between checks.
   * @returns A function that accepts a function `f`.
   *
   * @example
   * const RTcalc = UpdateEach(3)
   *
   * on("update", () => {
   *    RTcalc(() => { printConsole("Real time calculations") })
   * }
   */
  export function UpdateEach(seconds: number) {
    let lastUpdated = 0
    return (f: () => void) => {
      const t = Utility.getCurrentRealTime()
      if (t - lastUpdated < seconds) return
      lastUpdated = t
      f()
    }
  }
}

/** Functions related to hotkeys. */
export namespace Hotkeys {
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
    Log: DebugLib.Log.TappedFunction,
    Get: (k: string) => Hotkey,
    appendStr: string = "Hotkey "
  ) {
    const A = appendStr ? DebugLib.Log.AppendT(Log, appendStr) : Log
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
}

/** Useful functions for debugging. */
export namespace DebugLib {
  export namespace Log {
    /** How much will the console be spammed.
     * - optimization     Meant to only output the times functions take to execute. Used for bottleneck solving.
     * - none       No spam.
     * - error      Just errors and stuff like that.
     * - info       Detailed info so players can know if things are going as expected, but not enough for actual debugging.
     * - verbose    Info meant for developers. Use it for reporting errors or unexpected behavior.
     */
    export enum Level {
      optimization = -1,
      none,
      error,
      info,
      verbose,
    }

    /** Gets the logging level from some configuration file.
     *
     * @param pluginName Name of the plugin to get the value from.
     * @param optionName Name of the variable that carries the value.
     * @returns The logging level from file. `verbose` if value was invalid.
     */
    export function LevelFromSettings(
      pluginName: string,
      optionName: string
    ): Level {
      return LevelFromValue(settings[pluginName][optionName])
    }

    export function LevelFromValue(v: any) {
      const l =
        typeof v === "string"
          ? v.toLowerCase()
          : typeof v === "number"
          ? v
          : "verbose"
      let t = (<any>Level)[l]
      if (typeof l === "number") t = Level[t]
      return t === undefined ? Level.verbose : t
    }

    /** A function that accepts a message. Returns nothing. */
    export type LoggingFunction = (msg: string) => void

    /** Signature of a function used for giving format to logging. */
    export type LogFormat = (
      currLogLvl: Level,
      maxLogLvl: Level,
      modName: string,
      date: Date,
      msg: string
    ) => string

    /** Returns a string in the form `"[Mod name]: Message"`.
     * @see {@link FileFmt}.
     *
     * @remarks
     * You can use this function as a guide on how a {@link LogFormat} function
     * used for {@link CreateFunction} can be made.
     *
     * @example
     * const LogI = CreateFunction(userLevel, Level.info, "my-mod", ConsoleFmt, FileFmt)
     * const LogV = CreateFunction(userLevel, Level.verbose, "my-mod", ConsoleFmt, FileFmt)
     *
     * // Console output: "[my-mod]: This is important for the player."
     * // File output: "[info] 4/5/2021 12:32:15 p.m.: This is important for the player."
     * LogI("This is important for the player.")
     *
     * // Console output: "[my-mod]: This is useful for debugging."
     * // File output: "[verbose] 4/5/2021 12:32:15 p.m.: This is useful for debugging."
     * LogV("This is useful for debugging.")
     */
    export const ConsoleFmt: LogFormat = (_, __, n, ___, msg) =>
      `[${n}]: ${msg}`

    /** Returns a string in the form `"[logging level] date-time: Message"`.
     * @see {@link ConsoleFmt}.
     *
     * @remarks
     * You can use this function as a guide on how a {@link LogFormat} function
     * used for {@link CreateFunction} can be made.
     *
     * Format for https://github.com/Scarfsail/AdvancedLogViewer :\
     *    `[{Type}] {Date} {Time}: {Message}`
     *
     * @example
     * const LogI = CreateFunction(userLevel, Level.info, "my-mod", ConsoleFmt, FileFmt)
     * const LogV = CreateFunction(userLevel, Level.verbose, "my-mod", ConsoleFmt, FileFmt)
     *
     * // Console output: "[my-mod]: This is important for the player."
     * // File output: "[info] 4/5/2021 12:32:15 p.m.: This is important for the player."
     * LogI("This is important for the player.")
     *
     * // Console output: "[my-mod]: This is useful for debugging."
     * // File output: "[verbose] 4/5/2021 12:32:15 p.m.: This is useful for debugging."
     * LogV("This is useful for debugging.")
     */
    export const FileFmt: LogFormat = (_, m, __, t, msg) =>
      `[${Level[m]}] ${t.toLocaleString()}: ${msg}`

    /** A function that accepts a message, a variable and an optional function.
     *
     * Returns the variable after logging the message.
     * If a function was passed, it will be applied to the variable before logging.
     *
     * Function `f` must be a function that transforms variables of the same type
     *  of `x` to string.
     */
    export type TappedFunction = <T>(
      msg: string,
      x: T,
      f?: (x: T) => string
    ) => T

    /** Creates a logging function that appends some message before logging.
     *
     * @param f Function to wrap.
     * @param append Message to append each time the result is called.
     * @returns A {@link LoggingFunction}.
     *
     * @example
     * const CMLL = Append(printConsole, "Kemonito: ")
     * CMLL("Kicks")       // => "Kemonito: Kicks"
     * CMLL("Flies!")      // => "Kemonito: Flies!"
     * CMLL("Is love")     // => "Kemonito: Is love"
     * CMLL("Is life")     // => "Kemonito: Is life"
     */
    export function Append(f: LoggingFunction, append: any): LoggingFunction {
      return (msg: any) => f(append + msg)
    }

    /** Creates a logging function that appends some message before logging.
     *
     * @see {@link Append}
     *
     * @param f Function to wrap.
     * @param append Message to append each time the result is called.
     * @returns A {@link TappedFunction}.
     */
    export function AppendT(f: TappedFunction, append: any): TappedFunction {
      return <T>(msg: string, x: T, fmt?: (x: T) => string) =>
        f(append + msg, x, fmt)
    }

    /** Creates a function used for logging. Said function can log to either console or to some file.
     *
     * @see {@link FileFmt}, {@link ConsoleFmt}.
     *
     * @param currLogLvl The log level the user has selected. I.e. how much info they want to get.
     * @param logAt At which level this function will log.
     * @param modName Name of the mod. Will be used to output messages and to name the output file.
     * Output file will be named `"Data\Platform\Plugins\modName-logs.txt"`.
     * @param ConsoleFmt A function of type {@link LogFormat}. If `undefined`, nothing will be output to console.
     * @param FileFmt A function of type {@link LogFormat}. If `undefined`, nothing will be output to file.
     * @returns A function that logs a message as a string.
     *
     * @example
     * // LogI will only log to file
     * const LogI = CreateFunction(Level.info, Level.info, "my-mod", undefined, FileFmt)
     *
     * // LogV won't log anything because player only wants to log at most Level.info type messages
     * const LogV = CreateFunction(Level.info, Level.verbose, "my-mod", ConsoleFmt, FileFmt)
     */
    export function CreateFunction(
      currLogLvl: Level,
      logAt: Level,
      modName: string,
      ConsoleFmt?: LogFormat,
      FileFmt?: LogFormat
    ): LoggingFunction {
      const canLog =
        currLogLvl >= logAt || (currLogLvl < 0 && currLogLvl === logAt)

      if (!canLog) return (_: any) => {}
      else
        return function (msg: any) {
          const t = new Date()
          if (ConsoleFmt)
            printConsole(ConsoleFmt(currLogLvl, logAt, modName, t, msg))
          if (FileFmt)
            writeLogs(modName, FileFmt(currLogLvl, logAt, modName, t, msg))
        }
    }

    /** Creates all functions at all logging levels with their corresponding Tapped counterparts.
     *
     * @param mod Mod name. This will be saved for each line.
     * @param logLvl Current logging level for the mod.
     * @param Console Console format.
     * @param File File format.
     * @returns An object with all functions.
     */
    export function CreateAll(
      mod: string,
      logLvl: Level,
      Console?: LogFormat,
      File?: LogFormat
    ) {
      const CLF = (logAt: Level) =>
        CreateFunction(logLvl, logAt, mod, Console, File)

      const O = CLF(Level.optimization)
      const N = CLF(Level.none)
      const E = CLF(Level.error)
      const I = CLF(Level.info)
      const V = CLF(Level.verbose)
      return {
        /** Log at special mode: optimization. */
        Optimization: O,
        /** Log at none level. Basically, ignore logging settings, except when using special modes. */
        None: N,
        /** Log at error level. */
        Error: E,
        /** Log at info level. */
        Info: I,
        /** Log at verbose level. */
        Verbose: V,
        /** Log at special mode: optimization. Return value. */
        TapO: Tap(O),
        /** Log at none level and return value. */
        TapN: Tap(N),
        /** Log at error level and return value. */
        TapE: Tap(E),
        /** Log at info level and return value. */
        TapI: Tap(I),
        /** Log at verbose level and return value. */
        TapV: Tap(V),
      }
    }

    /** Makes a logging function to log a value, then returns that value.
     *
     * @param f - The logging function.
     * @returns A {@link TappedFunction}.
     *
     * @remarks
     * This function is intended to be used to initialize variables while logging them,
     * so logging looks cleaner and variables become self documenting in code and
     * "debuggeable" at the same time.
     *
     * @example
     * const IntToHex = (x: number) => x.toString(16)
     * const LogAndInit = Tap(printConsole)
     *
     * // "Value for x: 3". Meanwhile: x === 3.
     * const x = LogAndInit("Value for x", 3)
     *
     * // "Hex: ff". Meanwhile: ff === 255
     * const ff = LogAndInit("Hex", 255, IntToHex)
     *
     * // Don't know what the next call will yield, but we can log it to console to see it!
     * const form = LogAndInit("Found form", Game.getFormFromFile(0x3bba, "Skyrim.esm"))
     */
    export function Tap(f: LoggingFunction): TappedFunction {
      return function <T>(msg: string, x: T, g?: (x: T) => string): T {
        if (g) {
          if (msg) f(`${msg}: ${g(x)}`)
          else f(g(x))
        } else {
          if (msg) f(`${msg}: ${x}`)
          else f(`${x}`)
        }
        return x
      }
    }

    /** Converts an integer to hexadecimal notation.
     *
     * @remarks
     * This function has apparently absurd safeguards because it's intended to be used for logging.\
     * If you want a straight forward conversion, just use `x.toString(16)`.
     *
     * @param x
     * @returns string
     */
    export function IntToHex(x: number) {
      return !x || typeof x !== "number"
        ? "IntToHex: Undefined value"
        : x.toString(16)
    }
  }

  /** @experimental
   * Doesn't work right now. Maybe I need to use promises and whatnot.
   *
   * Measures the time it takes a function to execute and logs that.
   *
   * @remarks
   * `Utility.getCurrentRealTime()` seems to be returning the same value for both
   * times the function starts and ends.\
   * I suspect this is because most functions in Skyrim Platform don't wait for the others to end.
   *
   * @param f - Function to measure.
   * @param Log - Function used for logging the time. You can supply a logging level-aware function.
   */
  export function Benchmark(
    f: () => void,
    Log: Log.LoggingFunction
  ): () => void {
    return () => {
      const t1 = Utility.getCurrentRealTime()
      Log(`${f.name} start time: ${t1}`)

      const ff = new Promise<number>((resolve, _) => {
        f()
        resolve(Utility.getCurrentRealTime())
      })

      ff.then((t2) => {
        Log(`${f.name} end time: ${t2}`)
        Log(`Execution time for ${f.name}: ${t2 - t1}`)
      })
    }
  }
}

/** Animation helpers */
export namespace AnimLib {}
