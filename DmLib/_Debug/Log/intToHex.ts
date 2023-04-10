/** Converts an integer to hexadecimal notation.
 *
 * @remarks
 * This function has apparently absurd safeguards because it's intended to be used for logging.\
 * If you want a straight forward conversion, just use `x.toString(16)`.
 *
 * @param x
 * @returns string
 */
export function intToHex(x: number) {
  return !x || typeof x !== "number"
    ? "IntToHex: Undefined value"
    : x.toString(16)
}
