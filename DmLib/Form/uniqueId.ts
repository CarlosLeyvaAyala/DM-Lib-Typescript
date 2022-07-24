import { Game, Form } from "skyrimPlatform"
import { FormEspInfo, ModType } from "espData"
import { getFormEsp } from "getFormEsp"

/**
 * Returns a `Form` from a string.
 * @param uId - Unique FormID to get the `Form` from.
 * @param fmt - Regular expression to get the `Form` from.
 * @param espGroup - In which group from the RegExp the Plugin file is expected to be.
 * @param formIdGroup - In which group from the RegExp the FormID is expected to be.
 * @returns `Form | null`
 *
 * @remarks
 * This function uses `Game.getFormFromFile`, so it expects `uId` to have
 * a relative FormID and a plugin name.
 *
 * With its default parameters, it recognizes unique ids in the format:
 *      `PluginName|0xHexFormID`
 *
 * @example
 * ```
 *  const VendorItemOreIngot = getFormFromUniqueId("Skyrim.esm|0x914ec")
 *  const NullForm = getFormFromUniqueId("Skyrim.esm|595180")  // Not a valid hex id
 *  const OreIngotAgain = getFormFromUniqueId("595180-Skyrim.esm", /(\d+)-(.*)/, 2, 1)
 * ```
 */
export function getFormFromUniqueId(
  uId: string,
  fmt: RegExp = /(.*)\|(0[xX].*)/,
  espGroup: number = 1,
  formIdGroup: number = 2
) {
  const m = uId.match(fmt)
  if (!m) return null
  const esp = m[espGroup]
  const formId = Number(m[formIdGroup])
  return Game.getFormFromFile(formId, esp)
}

/** Adapter to change a {@link FormEspInfo} to `undefined` if needed. */
export const formEspInfoToUndef = (d: FormEspInfo) =>
  d.type === ModType.unknown ? { name: undefined, type: undefined } : d

/** Returns the relative `formId` of some `Form`.
 *
 * @param form The `Form` to get the relative `formId` from.
 * @param modType Does the `Form` belong to an esp or esl file?
 * @returns Fixed `formId`. `-1` if `form` or `modType` are invalid.
 */
export function getFixedFormId(form: Form | null, modType: ModType) {
  if (!form || modType === ModType.unknown) return -1
  const id = form.getFormID()
  return modType === ModType.esp ? id & 0xffffff : id & 0xfff
}

/** Returns the esp file, type and fixed formId for a `Form`.
 *
 * @param form `Form` to get data from.
 * @returns An object with all data.
 */
export function getEspAndId(form: Form | null) {
  const esp = getFormEsp(form)
  const id = getFixedFormId(form, esp.type)
  return { modName: esp.name, type: esp.type, fixedFormId: id }
}

/** Returns a string in the `PluginName|0xHexFormID` format.
 * @param  {string} espName
 * @param  {number} fixedFormId
 *
 * @remarks
 * This is used by default by {@link getFormUniqueId}.
 */
export const defaultUIdFmt = (espName: string, fixedFormId: number) =>
  `${espName}|0x${fixedFormId.toString(16)}`

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
  if (!form) return "Undefined form"
  const d = getEspAndId(form)
  return format(d.modName, d.fixedFormId, d.type)
}
