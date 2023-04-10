import { settings } from "skyrimPlatform"
import { fromValue } from "./fromValue"

/** Gets a hotkey from some configuration file.
 *
 * @remarks
 * This function can read both numbers and strings defined in {@link DxScanCode}.
 *
 * @param pluginName Name of the plugin to get the value from.
 * @param optionName Name of the variable that carries the value.
 * @returns The hotkey. `DxScanCode.None` if invalid.
 */

export const fromSettings = (pluginName: string, optionName: string) =>
  fromValue(settings[pluginName][optionName])
