import { Form } from "skyrimPlatform"
import { ModType } from "./espData"
import { getEspAndId } from "./getEspAndId"
import { defaultUIdFmt } from "./defaultUIdFmt"

/** Returns a string that can be used as an unique `Form` identifier.
 *
 * @param form The `Form` to generate data for.
 * @param format The function that will be used to give format to the result of this function.
 * @returns A unique `string` identifier based on fixed formId and esp file data.
 *
 * @example
 * const b = Game.getFormEx(0x03003012)
 * const uId = GetFormUniqueId(b) // => "Hearthfires.esm|0x3012"
 * const uId2 = GetFormUniqueId(b, (e, i) => `${e}|0x${i.toString(16)}`) // => "Hearthfires.esm|0x3012"
 */

export function getUniqueId(
  form: Form | null,
  format: (
    espName: string,
    fixedFormId: number,
    type?: ModType
  ) => string = defaultUIdFmt
): string {
  if (!form) return "Null form"
  const d = getEspAndId(form)
  return format(d.modName, d.fixedFormId, d.type)
}
