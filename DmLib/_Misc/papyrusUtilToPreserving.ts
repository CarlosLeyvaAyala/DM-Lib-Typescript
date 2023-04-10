import { Form } from "skyrimPlatform"

/** Adapts a PapyrusUtil saving function so it can be used with {@link PreserveVar}.
 *
 * @param f Function to adapt.
 * @param obj Object to save values on. Use `null` to save globally.
 * @returns A function that accepts a key and a value.
 *
 * @example
 * const SaveFlt = PapyrusUtilToPreserving(PapyrusUtil.SetFloatValue, null)
 * const SaveInt = PapyrusUtilToPreserving(PapyrusUtil.SetIntValue, null)
 */

export function papyrusUtilToPreserving<T>(
  f: (obj: Form | null | undefined, k: string, v: T) => void,
  obj: Form | null | undefined
) {
  return (k: string, v: T) => {
    f(obj, k, v)
  }
}
