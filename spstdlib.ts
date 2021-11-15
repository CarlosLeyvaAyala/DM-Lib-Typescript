/** This is a prototype for a standard library for Skyrim Platform. Don't use this file. */

import { Form, Game, Utility } from "skyrimPlatform"

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

  /** Changes Skyrim hours to human hours.
   *
   * @param x Skyrim hours.
   * @returns Human readable hours.
   *
   * @example
   * ToHumanHours(2.0)   // => 48. Two full days
   * ToHumanHours(0.5)   // => 12. Half a day
   */
  export const ToHumanHours = (x: SkyrimHours): HumanHours => x / gameHourRatio

  /** Changes human hours to Skyrim hours.
   *
   * @param x Human readable hours.
   * @returns Skyrim hours.
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
 */
export namespace Combinators {}

export namespace Forms {
  export function PreserveForm(frm: Form | null) {
    if (!frm) return () => null
    const id = frm.getFormID()
    return () => Game.getFormEx(id)
  }
}
