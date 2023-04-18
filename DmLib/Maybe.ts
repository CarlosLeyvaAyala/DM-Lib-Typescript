/** Deals with missing values.
 * @remarks
 * Static functions are performance oriented, while instance methods are pipe oriented.
 */
export class Maybe<T> {
  private readonly _value: T | null | undefined
  constructor(value: T | null | undefined) {
    this._value = value
  }

  get value() {
    return this._value
  }

  public static map<T, U>(value: T | null | undefined, mapper: (v: T) => U) {
    if (value === null) return null
    if (value === undefined) return undefined
    return mapper(value)
  }

  public map<U>(mapper: (v: T) => U | null | undefined): Maybe<U> {
    return new Maybe(Maybe.map(this._value, mapper))
  }

  public static mapNone<T, U>(value: T | null | undefined, none: U) {
    if (value === null || value === undefined) return none
    return value as T
  }

  public mapNone<U>(none: U) {
    return Maybe.mapNone(this._value, none)
  }

  public static noneToNull<T>(value: T | null | undefined) {
    if (value === null || value === undefined) return null
    return value as T
  }

  public noneToNull() {
    return Maybe.noneToNull(this._value)
  }

  public static noneToUndefined<T>(value: T | null | undefined) {
    if (value === null || value === undefined) return undefined
    return value as T
  }

  public noneToUndefined() {
    return Maybe.noneToUndefined(this._value)
  }

  public static isNone<T>(value: T | null | undefined) {
    return value === null || value === undefined
  }

  public isNone() {
    return Maybe.isNone(this._value)
  }

  public static hasValue<T>(value: T | null | undefined) {
    return value !== null && value !== undefined
  }

  public hasValue() {
    return Maybe.hasValue(this._value)
  }
}
