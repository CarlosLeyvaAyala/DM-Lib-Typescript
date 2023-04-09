import { settings } from "skyrimPlatform"
import { fromValue } from "./fromValue"

/** Reads a hotkey from a Json object inside some settings file.
 * @example
 * ```json
 * // Settings file
 * {
 *   "hotkeys": {
 *     "hk1": "Shift Enter"
 *   }
 * }
 * ```
 * ```ts
 *
 * // Typescript
 * const hk = FromObject("plugin", "hotkeys", "hk1") // => Shift + Enter
 * ```
 * @param pluginName Name of the plugin to get the value from.
 * @param objectName Name of the parent object of the wanted key.
 * @param optionName Name of the variable that carries the value.
 * @returns The hotkey. `DxScanCode.None` if invalid.
 */

export const fromObject = (
  pluginName: string,
  objectName: string,
  optionName: string
  // @ts-ignore
) => fromValue(settings[pluginName][objectName][optionName])
