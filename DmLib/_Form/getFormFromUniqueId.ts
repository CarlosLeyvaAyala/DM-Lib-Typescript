import { Game } from "skyrimPlatform"

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
