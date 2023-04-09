import { Form } from "skyrimPlatform"
import { ModType } from "./espData"

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
