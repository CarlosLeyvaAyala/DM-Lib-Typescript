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
