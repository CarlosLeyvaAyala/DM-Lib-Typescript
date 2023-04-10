import { Point } from "./Point"

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
export function cubicSpline(points: Point[]) {
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
