import {
  Actor,
  Form,
  Game,
  Input,
  once,
  printConsole,
  settings,
  storage,
  Utility,
  writeLogs,
} from "skyrimPlatform"

/** Time related functions. */
export namespace TimeLib {
  /** Ratio to convert Skyrim hours to human hours. */
  const gameHourRatio = 1.0 / 24.0

  /** Current time in {@link SkyrimHours}. */
  export const Now: () => SkyrimHours = Utility.getCurrentGameTime

  /** Hours as a fraction of a day; where 1.0 == 24 hours. */
  export type SkyrimHours = number

  /** Hours as humans use them; where 24 == 1.0 days. */
  export type HumanHours = number

  /** Changes {@link SkyrimHours} to {@link HumanHours}.
   *
   * @param x Time in {@link SkyrimHours}.
   * @returns Time in human readable hours.
   *
   * @example
   * ToHumanHours(2.0)   // => 48. Two full days
   * ToHumanHours(0.5)   // => 12. Half a day
   */
  export const ToHumanHours = (x: SkyrimHours): HumanHours => x / gameHourRatio

  /** Converts a {@link SkyrimHours} to a `string` in {@link HumanHours} */
  export const ToHumanHoursStr = (x: SkyrimHours) => ToHumanHours(x).toString()

  /** Changes {@link HumanHours} to {@link SkyrimHours}.
   *
   * @param x Time in human readable hours.
   * @returns Time in {@link SkyrimHours}.
   *
   * @example
   * ToHumanHours(48)   // => 2.0. Two full days
   * ToHumanHours(12)   // => 0.5. Half a day
   */
  export const ToSkyrimHours = (x: HumanHours): SkyrimHours => x * gameHourRatio

  /** Returns in human hours how much time has passed between `Now` and some hour given
   * in {@link SkyrimHours}.
   * @param then {@link SkyrimHours}
   * @returns Hour span in {@link HumanHours}
   */
  export const HourSpan = (then: SkyrimHours): HumanHours =>
    ToHumanHours(Now() - then)
}

/** Math related functions. */
export namespace MathLib {
  /** A point in 2D space. */
  export interface Point {
    x: number
    y: number
  }

  /** Creates a linear function adjusted to two points.
   *
   * @param p1 Initial point.
   * @param p2 Ending point.
   * @returns A linear function that accepts an `x` argument.
   *
   * @example
   * const f = LinCurve({ x: 24, y: 2 }, { x: 96, y: 16 })
   * f(24) // => 2
   * f(96) // => 16
   * f(0)  // => -2.6666666666667
   */
  export function LinCurve(p1: Point, p2: Point) {
    const x1 = p1.x
    const y1 = p1.y
    const m = (p2.y - y1) / (p2.x - x1)

    return (x: number) => m * (x - x1) + y1
  }

  /** Creates an exponential function that adjusts a curve of some `shape` to two points.
   *
   * @remarks
   * Some `shape` values, like `0`, may lead to linear functions instead of exponential ones.
   * For those cases, this function returns a {@link LinCurve}.
   *
   * @param shape
   * @param p1 Initial point.
   * @param p2 Ending point.
   * @returns An exponential function that accepets an `x` argument.
   *
   * @example
   * const f = ExpCurve(-2.3, { x: 0, y: 3 }, { x: 1, y: 0.5 })
   * f(0)       // => 3
   * f(0.1)     // => 2.4290958125478785
   * f(0.5)     // => 1.1012227076272225
   * f(0.9)     // => 0.572039991172326
   * f(1)       // => 0.5
   */
  export function ExpCurve(shape: number, p1: Point, p2: Point) {
    const e = Math.exp
    const b = shape
    const ebx1 = e(b * p1.x)
    const divisor = e(b * p2.x) - ebx1

    // Shape is actually a line, not an exponential curve.
    if (divisor === 0) return LinCurve(p1, p2)

    const a = (p2.y - p1.y) / divisor
    const c = p1.y - a * ebx1

    return (x: number) => a * e(b * x) + c
  }

  /** Returns a function that ensures some value is at least `min`.
   *
   * @param min The minimum value a number can be.
   * @returns A function that accepts a number `x` and returns `x` or `min`.
   *
   * @example
   * const LowestHp = ForceMin(10)
   * LowestHp(-1)     // => 10
   * LowestHp(255)    // => 255
   */
  export const ForceMin = (min: number) => (x: number) => Math.max(min, x)

  /** Returns a function that ensures some value is at most `max`.
   *
   * @param max The maximum value a number can be.
   * @returns A function that accepts a number `x` and returns `x` or `max`.
   *
   * @example
   * let MaxSpeed = ForceMax(1.7)
   * MaxSpeed(2)     // => 1.7
   * MaxSpeed(1.7)   // => 1.7
   * MaxSpeed(0.5)   // => 0.5
   *
   * MaxSpeed = ForceMax(1)
   * MaxSpeed(1.1)   // => 1
   */
  export const ForceMax = (max: number) => (x: number) => Math.min(max, x)

  /** Returns a function that ensures some value is between the (inclusive) range [`min`..`max`].
   *
   * @param min The minimum value a number can be.
   * @param max The maximum value a number can be.
   * @returns A function that accepts a number `x` and makes sure it stays within `min` and `max`.
   *
   * @example
   * const itemCount = 42
   * let Take = ForceRange(0, itemCount)
   * Take(-100)     // => 0
   * Take(255)      // => 42
   * Take(3)        // => 3
   *
   * // Redefine Take function to reflect new data
   * Take = ForceRange(0, itemCount - Take(3))
   */
  export const ForceRange = (min: number, max: number) => (x: number) =>
    ForceMin(min)(ForceMax(max)(x))

  /** Ensures some value is always positive.
   *
   * @param x A number.
   * @returns `0` if `x` is negative, else `x`.
   *
   * @example
   * ForcePositive(-100)     // => 0
   * ForcePositive(255)      // => 255
   * ForcePositive(0)        // => 0
   */
  export const ForcePositive = (x: number) => ForceMin(0)(x)

  /** Ensures some value always stays within the (inclusive) range [`0`..`1`].
   *
   * @param x A number.
   * @returns A number between [`0`..`1`].
   *
   * @example
   * ForcePercent(-0.1)       // => 0
   * ForcePercent(10)         // => 1
   * ForcePercent(0.5)        // => 0.5
   */
  export const ForcePercent = (x: number) => ForceRange(0, 1)(x)
}

/** Functional programming combinators.
 *
 * @remarks
 * Many of these may be arcane, but they are quite useful nonetheless.
 *
 * Some of them are used in this library and you aren't required to use any
 * of these, ever.\
 * But if you know when to use them, your code will be shorter and your intentions
 * clearer.
 *
 * Highly recommended reading:
 *
 * https://tgdwyer.github.io/
 * https://leanpub.com/javascriptallongesix/read#leanpub-auto-making-data-out-of-functions
 */
export namespace Combinators {
  /** Returns whatever it's passed to it.
   *
   * @param x
   * @returns x
   *
   * @remarks
   * **This is NOT STUPID**. It's useful, for example, for feeding it to
   * functions that may transform values, but we don't want to transform
   * something in particular.
   *
   * It's not much useful by itself, but you will soon see its value
   * when you start composing functions.
   *
   * @see {@link K} for other uses.
   *
   * @example
   * const lower = (x: string) => x.toLowerCase()
   * const upper = (x: string) => x.toUpperCase()
   * const f = (x: string, g: (x: string) => string) => g(x)
   *
   * const x = f("LOWER", lower)
   * const y = f("upper", upper)
   * const z = f("sAmE", I)
   */
  export const I = <T>(x: T) => x

  /** Returns a function that accepts one parameter, but ignores it and returns whatever
   * you originally defined it with.
   *
   * @param x
   * @returns `function (y: any) => x`
   *
   * @remarks
   * This can be used to make a function constant; that is, no matter what you
   * pass to it, it will always returns the value you first defined it with.
   * This is useful to plug constants into places that are expecting functions.
   *
   * If combined with {@link I} it can do useful things. `K(I)` will always
   * return the second parameter you pass to it.
   *
   * Combined with {@link O} can be used to make one liners that ensure a calculated value
   * is always returned.
   *
   * @see {@link O} for more uses.
   *
   * @example
   * const first = K
   * const second = k(I)
   * first("primero")("segundo")    // => "primero"
   * second("primero")("segundo")   // => "segundo"
   *
   * const msg = K("You are a moron")
   * const validate = (x: number) => (typeof x !== "number" ? null : x.toString())
   * const intToStr = O(validate, msg)
   * intToStr(null)   // => "You are a moron"
   * intToStr(32)     // => 32
   *
   * const guaranteedActorBase = O((a: Actor) => a.getLeveledActorBase(), K(Game.getPlayer()?.getBaseObject()))
   * guaranteedActorBase(null)              // => player
   * guaranteedActorBase(whiterunGuard)     // => Whiterun Guard
   */
  export const K =
    <T>(x: T) =>
    (y: any): T =>
      x

  /** Creates a function that accepts one parameter `x`. Returns `f1(x)` if not `null`, else `f2(x)`.
   *
   * @param f1 First function to apply.
   * @param f2 Second function to apply.
   * @returns `f1(x)` if not `null`, else `f2(x)`.
   */
  export const O =
    <U>(f1: (...args: any[]) => U | null, f2: (...args: any[]) => U) =>
    (...args: any[]): U =>
      f1(...args) || f2(...args)

  /** Applies function `f` to `x` and returns `x`. Useful for chaining functions that return nothing.
   *
   * @param x
   * @param f
   * @returns x
   */
  export function Tap<K>(x: K, f: (x: K) => void) {
    f(x)
    return x
  }
}

export namespace FormLib {
  export function PreserveForm(frm: Form | null) {
    if (!frm) return () => null
    const id = frm.getFormID()
    return () => Game.getFormEx(id)
  }

  export function PreserveActor(a: Actor | null) {
    const f = PreserveForm(a)
    return () => Actor.from(f())
  }

  export enum ModType {
    esp,
    esl,
    unknown,
  }

  /**
   * Gets the esp a form belongs to.
   *
   * @remarks
   * This code was adapted from `GetFormIdentifier` in FileUtils.cpp
   * in SKEE64 (RaceMenu dll); line 177.
   *
   * @param form Form to get the esp from.
   * @returns Name and type of the esp file he form belongs to.
   */
  export function GetFormEsp(form: Form | null | undefined) {
    const nil = { name: "", type: ModType.unknown }
    if (!form) return nil

    const formId = form.getFormID()
    const modIndex = formId >>> 24

    if (modIndex == 0xfe) {
      const lightIndex = (formId >>> 12) & 0xfff
      if (lightIndex < Game.getLightModCount())
        return { name: Game.getLightModName(lightIndex), type: ModType.esl }
    } else return { name: Game.getModName(modIndex), type: ModType.esp }

    return nil
  }

  /**
   * Returns the relative `formId` of some `Form`.
   *
   * @param form The `Form` to get the relative `formId` from.
   * @param modType Does the `Form` belong to an esp or esl file?
   * @returns Fixed `formId`. `-1` if `form` or `modType` are invalid.
   */
  export function GetFixedFormId(
    form: Form | null | undefined,
    modType: ModType
  ) {
    if (!form || modType === ModType.unknown) return -1
    const id = form.getFormID()
    return modType === ModType.esp ? id & 0xffffff : id & 0xfff
  }

  /**
   * Returns the esp file, type and fixed formId for a `Form`.
   *
   * @param form `Form` to get data from.
   * @returns An object with all data.
   */
  export function GetFormEspAndId(form: Form | null | undefined) {
    const esp = GetFormEsp(form)
    const id = GetFixedFormId(form, esp.type)
    return { modName: esp.name, type: esp.type, fixedFormId: id }
  }

  /**
   * Returns a string that can be used as an unique `Form` identifier.
   *
   * @param form The `Form` to generate data for.
   * @param format The function that will be used to give format to the result of this function.
   * @returns A unique `string` identifier based on fixed formId and esp file data.
   *
   * @example
   * const b = Game.getFormEx(0x03003012)
   * const uId = GetFormUniqueId(b, (e, i) => `${e}|0x${i.toString(16)}`) // => "Hearthfires.esm|0x3012"
   */
  export function GetFormUniqueId(
    form: Form | null | undefined,
    format: (name: string, fixedFormId: number, type?: ModType) => string
  ): string {
    if (!form) return "Undefined form"
    const d = GetFormEspAndId(form)
    return format(d.modName, d.fixedFormId, d.type)
  }
}

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

export namespace Misc {
  /** Avoids a function to be executed many times at the same time.
   *
   * @param f The function to wrap.
   * @returns A function that will be called only once when the engine
   * tries to spam it.
   *
   * @remarks
   * Sometimes the engine is so fast a function may be called many times
   * in a row. For example, the `OnSleepStart` event may be fired 4 times
   * in a row, thus executing a function those 4 times, even when it was
   * intended to run only once.
   *
   * This function will make a function in that situation to be called
   * only once, as expected.
   *
   * @warning
   * Since this function is a "closure" it needs to be used outside loops
   * and things that may redefine the inner variables inside it.
   *
   * If this function doesn't appear to work, try to use it outside the
   * current execution block.
   *
   * @example
   * let f = () => { printConsole("Only once") }
   * f = AvoidRapidFire(f)
   *
   * // The engine is so fast this will actually work
   * f()
   * f()
   * f()
   */
  export function AvoidRapidFire(f: () => void) {
    let lastExecuted = 0
    return () => {
      const t = TimeLib.Now()
      if (lastExecuted === t) return
      lastExecuted = t
      f()
    }
  }

  /** Adapts a JContainers saving function so it can be used with {@link PreserveVar}.
   *
   * @param f Function to adapt.
   * @returns A function that accepts a key and a value.
   *
   * @example
   * const SaveFlt = JContainersToPreserving(JDB.solveFltSetter)
   * const SaveInt = JContainersToPreserving(JDB.solveIntSetter)
   */
  export function JContainersToPreserving<T>(
    f: (k: string, v: T, b?: boolean) => void
  ) {
    return (k: string, v: T) => {
      f(k, v, true)
    }
  }

  /** Saves a variable to both storage and wherever the `Storage` variable saves it.
   *
   * @param Store A function that saves a variable somewhere.
   * @param k `string` key to identify where the variable will be saved.
   * @returns A fuction that saves a value and returns it.
   *
   * @example
   * const SaveFlt = JContainersToPreserving(JDB.solveFltSetter)
   * const SaveInt = JContainersToPreserving(JDB.solveIntSetter)
   * const SFloat = PreserveVar(SaveFlt, "floatKey")
   * const SInt = PreserveVar(SaveInt, "intKey")
   * const x = SFloat(10)   // => x === 10
   */
  export function PreserveVar<T>(Store: (k: string, v: T) => void, k: string) {
    return (x: T) => {
      storage[k] = x
      Store(k, x)
      return x
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

export namespace Hotkeys {
  export type KeyPressEvt = () => void
  export type KeyHoldEvt = (frames: number) => () => void
  export const DoNothing: KeyPressEvt = () => {}
  export const DoNothingOnHold: KeyHoldEvt = (_) => () => {}

  /**
   * Gets a hotkey from some configuration file.
   *
   * @param pluginName Name of the plugin to get the value from.
   * @param optionName Name of the variable that carries the value.
   * @returns The hotkey. `-1` if invalid.
   */
  export function ReadFromSettings(pluginName: string, optionName: string) {
    const l = settings[pluginName][optionName]
    return typeof l === "number" ? l : -1
  }

  /**
   * Listens for some Hotkey press / release / hold.
   *
   * @see {@link https://www.creationkit.com/index.php?title=Input_Script#DXScanCodes | DXScanCodes}
   * for possible hotkey values.
   *
   * @remarks
   * Use functions generated by this function ***only inside an `'update'` event***.
   * But ***DON'T GENERATE functions INSIDE an `'update'` event***.
   *
   * @param hk The hotkey to listen for.
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
   * on('update', () => {
   *   DoStuff(LogPress, LogRelease, LogHold)
   *   OnlyCareForHold(undefined, undefined, LogHold)
   *
   *   // Never generate functions inside an update event.
   *   // The following code won't work.
   *   const NonWorking = ListenTo(78)
   *   NonWorking(LogPress, undefined, LogHold)
   * })
   */
  export function ListenTo(hk: number) {
    let old = false
    let frames = 0

    return (
      OnPress: KeyPressEvt = DoNothing,
      OnRelease: KeyPressEvt = DoNothing,
      OnHold: KeyHoldEvt = DoNothingOnHold
    ) => {
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

export namespace DebugLib {
  export namespace Log {
    /** How much will the console be spammed.
     * - optimization     Meant to only output the times functions take to execute. Used for bottleneck solving.
     *
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
      const l = settings[pluginName][optionName]
      const l2 =
        typeof l === "string"
          ? l.toLowerCase()
          : typeof l === "number"
          ? l
          : "verbose"
      let t = (<any>Level)[l2]
      if (typeof l2 === "number") t = Level[t]
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
      return (msg: any) => {
        f(append + msg)
      }
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
      return function (msg: any) {
        const canLog =
          currLogLvl >= logAt || (currLogLvl < 0 && currLogLvl === logAt)
        if (!canLog) return

        const t = new Date()
        if (ConsoleFmt)
          printConsole(ConsoleFmt(currLogLvl, logAt, modName, t, msg))
        if (FileFmt)
          writeLogs(modName, FileFmt(currLogLvl, logAt, modName, t, msg))
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
        if (g) f(`${msg}: ${g(x)}`)
        else f(`${msg}: ${x}`)
        return x
      }
    }

    const C = Combinators

    /** Returns `x` while executing a logging function. `R` means _[R]eturn_.
     *
     * @remarks
     * This is useful for uncluttering logging calls when returning values from functions,
     * but can be used to log variable assignments as well.
     *
     * At first this may look like it's doing the same as {@link Tap}, but this function provides much
     * more flexibility at the cost of doing more writing.\
     * Both functions are useful and can be used together for great flexibilty.
     *
     * @param f A function that takes any number of arguments and returns `void`.
     * @param x The value to be returned.
     * @returns `x`
     *
     * @example
     * const Msg = (s: string) => { printConsole(`This is a ${s}`) }
     * const x = R(Msg("number"), 2)       // => "This is a number"; x === 2
     * const s = R(Msg("string"), "noob")  // => "This is a string"; s === "noob"
     */
    export const R = <T>(f: void, x: T) => C.Tap(x, C.K(f))

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
