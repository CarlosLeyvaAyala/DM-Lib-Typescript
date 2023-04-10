import { Point } from "./Point"
/** Creates a linear function adjusted to two points.
 *
 * @param p1 Initial point.
 * @param p2 Ending point.
 * @returns A linear function that accepts an `x` argument.
 *
 * @example
 * const f = linCurve({ x: 24, y: 2 }, { x: 96, y: 16 })
 * f(24) // => 2
 * f(96) // => 16
 * f(0)  // => -2.6666666666667
 */
export function linCurve(p1: Point, p2: Point) {
  const x1 = p1.x
  const y1 = p1.y
  const m = (p2.y - y1) / (p2.x - x1)

  return (x: number) => m * (x - x1) + y1
}
