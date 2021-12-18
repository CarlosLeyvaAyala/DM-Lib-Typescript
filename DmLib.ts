import {
  Actor,
  Armor,
  Cell,
  Form,
  FormType,
  Game,
  Input,
  ObjectReference,
  once,
  printConsole,
  settings,
  SlotMask,
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

  /** Creates a spline function given a list of points.
   *
   * @remarks
   * This function:
   *  - Was adapted from https://www.developpez.net/forums/d331608-3/general-developpement/algorithme-mathematiques/contribuez/image-interpolation-spline-cubique/#post3513925
   *  - Is not optimized for plotting charts. Will be slow when used in that context.
   *  - Acts like Photoshop curves. I.e. if the first and/or last point isn't at
   *    the edge of the valid range [`0`..`1`] it will consider outlier `y` values
   *    to be a straight line from the edge `points`.
   *
   * @param points Points used to create the spline.
   * `x` range ***MUST BE [`0`..`1`]***.
   * `points` ***MUST BE*** ordered by x.
   *
   * @returns A function that accepts a `x` (ranging at [`0`..`1`]) and evaluates the
   * spline value at that point.
   */
  export function CubicSpline(points: Point[]) {
    const n = points.length - 1

    // assert(n > 1, "CubicSpline(): You must supply at least two points.")

    // Avoid invalid number of points.
    if (n == 0) return (x: number) => 0
    if (n == 1) return (x: number) => points[0].y
    const sd = SecondDerivative(points)

    return (x: number) => {
      // Start as a flat line
      const p1 = points[0]
      if (p1.x > 0 && x <= p1.x) return p1.y

      // End as a flat line
      const pn = points[n]
      if (pn.x < 1 && x >= pn.x) return pn.y

      // Make sure the last point is always returned
      if (x === pn.x) return pn.y

      for (let i = 0; i < n; i++) {
        const cur = points[i]
        const next = points[i + 1]

        if (x >= cur.x && x < next.x) {
          const t = (x - cur.x) / (next.x - cur.x)

          const a = 1 - t
          const b = t
          const h = next.x - cur.x

          return (
            a * cur.y +
            b * next.y +
            ((h * h) / 6) *
              ((a * a * a - a) * sd[i] + (b * b * b - b) * sd[i + 1])
          )
        }
      }

      // assert(
      //   false,
      //   "CubicSpline() should have never reached this line. This is an error on part of the programmer. Sending a dummy value."
      // )
      // Should never return this. Used for debugging purposes.
      return -999999
    }
  }

  /** Helper function for {@link CubicSpline}. Calculates f'' for a list of points. */
  function SecondDerivative(p: Point[]) {
    const n = p.length

    // build the tridiagonal system
    // (assume 0 boundary conditions: y2[0]=y2[-1]=0)
    let matrix: number[][] = Array.from({ length: n }, (_) => [0, 0, 0])
    let result = Array.from({ length: n }, (_) => 0)

    matrix[0][1] = 1
    for (let i = 1; i < n - 1; i++) {
      matrix[i][0] = (p[i].x - p[i - 1].x) / 6
      matrix[i][1] = (p[i + 1].x - p[i - 1].x) / 3
      matrix[i][2] = (p[i + 1].x - p[i].x) / 6
      result[i] =
        (p[i + 1].y - p[i].y) / (p[i + 1].x - p[i].x) -
        (p[i].y - p[i - 1].y) / (p[i].x - p[i - 1].x)
    }
    matrix[n - 1][1] = 1

    // solving pass1 (up->down)
    for (let i = 1; i < n; i++) {
      const k = matrix[i][0] / matrix[i - 1][1]
      matrix[i][1] -= k * matrix[i - 1][2]
      matrix[i][0] = 0
      result[i] -= k * result[i - 1]
    }

    // solving pass2 (down->up)
    for (let i = n - 2; i >= 0; i--) {
      const k = matrix[i][2] / matrix[i + 1][1]
      matrix[i][1] -= k * matrix[i + 1][0]
      matrix[i][2] = 0
      result[i] -= k * result[i + 1]
    }

    // return second derivative value for each point P
    let y2: number[] = new Array(n)
    for (let i = 0; i < n; i++) y2[i] = result[i] / matrix[i][1]
    return y2
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
 * - https://tgdwyer.github.io/
 * - https://leanpub.com/javascriptallongesix/read#leanpub-auto-making-data-out-of-functions
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

  /** Returns a value while executing a function.
   *
   * @see {@link DebugLib.Log.R} for a sample usage.
   *
   * @param f Function to execute.
   * @param x Value to return.
   * @returns `x`
   */
  export const Return = <T>(f: void, x: T) => Tap(x, K(f))
}

/** Functions related to `Forms`. */
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
  /** Does something to an `Actor` after some time has passed.
   *
   * @remarks
   * This was made to hide the tediousness of having to retrieve and check
   * for an `Actor` each time the `Utility.wait` function is used.
   *
   * @param a `Actor` to work on.
   * @param time Time to wait.
   * @param DoSomething What to do when the time has passed.
   */
  export function WaitActor(
    a: Actor,
    time: number,
    DoSomething: (act: Actor) => void
  ) {
    const actor = PreserveActor(a)
    const f = async () => {
      await Utility.wait(time)
      const act = actor()
      if (!act) return
      DoSomething(act)
    }
    f()
  }

  /** Does something for each `Armor` an `Actor` has equipped.
   *
   * @param a Actor to check.
   * @param DoSomething What to do when an equipped armor is found.
   */
  export function ForEachEquippedArmor(
    a: Actor | null | undefined,
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
   */
  export function GetEquippedArmors(
    a: Actor | null | undefined,
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

    const u = nonRepeated
      ? all.filter((v, idx, A) => {
          for (let i = idx + 1; i < A.length; i++) {
            if (v.getFormID() === A[i].getFormID()) return false
          }
          return true
        })
      : all
    return u
  }

  /** Iterates over all items belonging to some `ObjectReference`, from last to first.
   *
   * @param o - The object reference to iterate over.
   * @param f - Function applied to each item.
   */
  export function ForEachItemR(
    o: ObjectReference,
    f: (item: Form | null) => void
  ) {
    let i = o.getNumItems()
    while (i > 0) {
      i--
      f(o.getNthForm(i))
    }
  }

  /** Iterates over all armors belonging to some `ObjectReference`, from last to first.
   *
   * @param o - The object reference to iterate over.
   * @param f - Function applied to each armor.
   */
  export function ForEachArmorR(o: ObjectReference, f: (armor: Armor) => void) {
    ForEachItemR(o, (i) => {
      const a = Armor.from(i)
      if (!a) return
      f(a)
    })
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

  /** In what space is the mod loaded in? */
  export const enum ModType {
    esp,
    esl,
    unknown,
  }

  /** Info a `Form` gets about its esp. */
  export interface FormEspInfo {
    name: string
    type: ModType
  }

  /** Gets the esp a form belongs to.
   *
   * @remarks
   * This code was adapted from `GetFormIdentifier` in FileUtils.cpp
   * in SKEE64 (RaceMenu dll); line 177.
   *
   * @param form Form to get the esp from.
   * @returns Name and type of the esp file he form belongs to.
   */
  export function GetFormEsp(form: Form | null | undefined): FormEspInfo {
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

  /** Adapter to change a {@link FormEspInfo} to `undefined` if needed. */
  export const FormEspInfoToUndef = (d: FormEspInfo) =>
    d.type === ModType.unknown ? { name: undefined, type: undefined } : d

  /** Returns the relative `formId` of some `Form`.
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

  /** Returns the esp file, type and fixed formId for a `Form`.
   *
   * @param form `Form` to get data from.
   * @returns An object with all data.
   */
  export function GetFormEspAndId(form: Form | null | undefined) {
    const esp = GetFormEsp(form)
    const id = GetFixedFormId(form, esp.type)
    return { modName: esp.name, type: esp.type, fixedFormId: id }
  }

  /** Returns a string that can be used as an unique `Form` identifier.
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

  /** Saves a variable to both storage and wherever the `Store` function saves it.
   *
   * @remarks
   * The `storage` variable saves values across hot reloads, but not game sessions.
   *
   * At the time of creating this function, Skyrim Platform doesn't implement any
   * way of saving variables to the SKSE co-save, so values aren't preserved across
   * save game saves.
   *
   * This function lets us save variables using wrapped functions from either
   * **JContainers** or **PapyursUtil**.
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
   *
   * // Use SFloat each time we want to make sure a value won't get lost when reloading the game.
   * let x = SFloat(10)   // => x === 10
   * x = SFloat(53.78)    // => x === 53.78
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
  ) {
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
    export const R = C.Return

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
