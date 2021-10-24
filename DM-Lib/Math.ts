export interface Point {
  x: number
  y: number
}

/**
 * Creates a linear function adjusted to two points.
 *
 * @param p1
 * @param p2
 * @returns A linear function that accepts an `x` argument.
 *
 * @example
 * const f = LinCurve({ x: 24, y: 2 }, { x: 96, y: 16 })
 * f(24) // => 2
 * f(96) // => 16
 * f(0)  // => -2.6666666666667
 */
export function LinCurve(p1: Point, p2: Point) {
  return (x: number) => {
    const m = (p2.y - p1.y) / (p2.x - p1.x)
    return m * (x - p1.x) + p1.y
  }
}
