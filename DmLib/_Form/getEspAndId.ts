import { Form } from "skyrimPlatform"
import { getFormEsp } from "./getFormEsp"
import { getFixedFormId } from "./getFixedFormId"

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
