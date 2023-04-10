/** Math related functions. */
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
const linCurve = LinCurve

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

  // Avoid invalid number of points.
  if (n == -1) return (x: number) => 0
  if (n == 0) return (x: number) => points[0].y
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
export const forceRange = ForceRange

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
export const forcePercent = ForcePercent

/**
 * Returns whether a number in the [`min`, `max`] range.
 * @param x Value to check.
 * @param min Minimum value.
 * @param max Maximum value.
 * @returns A `bool`.
 */
export const isInRange = (x: number, min: number, max: number) =>
  x >= min && x <= max

/**
 * Returns a random number in the [`min`, `max`] range.
 * @param min Minimum value.
 * @param max Maximum value.
 * @returns A random number.
 */
export const randomRange = (min: number, max: number) =>
  Math.random() * (max - min) + min
