import { Point } from "./Point"
import { linCurve } from "./linCurve"
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
export function expCurve(shape: number, p1: Point, p2: Point) {
  const e = Math.exp
  const b = shape
  const ebx1 = e(b * p1.x)
  const divisor = e(b * p2.x) - ebx1

  // Shape is actually a line, not an exponential curve.
  if (divisor === 0) return linCurve(p1, p2)

  const a = (p2.y - p1.y) / divisor
  const c = p1.y - a * ebx1

  return (x: number) => a * e(b * x) + c
}
