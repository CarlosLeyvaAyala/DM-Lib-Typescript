import { Game, Form } from "skyrimPlatform"
import { FormEspInfo, ModType } from "espData"

/** Gets the esp a form belongs to.
 *
 * @param form Form to get the esp from.
 * @returns Name and type of the esp file he form belongs to.
 */
// * This code was adapted from `GetFormIdentifier` in FileUtils.cpp
// * in SKEE64 (RaceMenu dll); line 177.
export function getFormEsp(form: Form | null): FormEspInfo {
  const nil = { name: "", type: ModType.unknown }
  if (!form) return nil

  const formId = form.getFormID()
  const modIndex = formId >>> 24

  if (modIndex == 0xfe) {
    const lightIndex = (formId >>> 12) & 0xfff
    if (lightIndex < Game.getLightModCount())
      return { name: Game.getLightModName(lightIndex), type: ModType.esl }
  } else return { name: Game.getModName(modIndex), type: ModType.esp }

  return nil
}
