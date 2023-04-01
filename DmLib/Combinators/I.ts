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
