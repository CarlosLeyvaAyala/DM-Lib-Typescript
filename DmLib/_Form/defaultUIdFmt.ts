/** Returns a string in the `PluginName|0xHexFormID` format.
 * @param  {string} espName
 * @param  {number} fixedFormId
 *
 * @remarks
 * This is used by default by {@link getUniqueId}.
 */

export const defaultUIdFmt = (espName: string, fixedFormId: number) =>
  `${espName}|0x${fixedFormId.toString(16)}`
