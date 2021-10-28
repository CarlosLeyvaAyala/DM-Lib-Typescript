/**
 * Functional combinators.
 *
 *
 * Highly recommended reading:
 *
 * https://tgdwyer.github.io/
 * https://leanpub.com/javascriptallongesix/read#leanpub-auto-making-data-out-of-functions
 */

/** Returns whatever it's passed to it.
 *
 * @param x
 * @returns x
 *
 * @remarks
 * This is NOT STUPID. It's useful, for example, for feeding it to
 * functions that may transform values, but we don't want to transform
 * something in particular.
 *
 * It's not much useful by itself, but you will soon see it's value
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
// export const O =
//   <T, U>(f1: (x: T) => U | null, f2: (x: T) => U) =>
//   (x: T): U =>
//     f1(x) || f2(x)

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

// Aliases for actual human beings.
export const Identity = I
export const Alt = O

// Aliases for people preferring names starting in lowercase.
// These names are more in line with skyrimPlatform naming conventions.
export const identity = I
export const alt = O
