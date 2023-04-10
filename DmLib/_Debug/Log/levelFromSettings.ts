import { settings } from "skyrimPlatform"
import { levelFromValue } from "./levelFromValue"
import { Level } from "./types"

/** Gets the logging level from some configuration file.
 *
 * @param pluginName Name of the plugin to get the value from.
 * @param optionName Name of the variable that carries the value.
 * @returns The logging level from file. `verbose` if value was invalid.
 */

export function levelFromSettings(
  pluginName: string,
  optionName: string
): Level {
  return levelFromValue(settings[pluginName][optionName])
}
