import { Return } from "../Combinators/Return"

export namespace Log {
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
  export const R = Return
}
