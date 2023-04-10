import { appendT } from "../Debug/Log/appendT"
import { TappedFunction } from "../Debug/Log/types"
import { toString } from "./toString"
import { Hotkey } from "./types"

/** Creates a function that reads and logs a Hotkey at the same time.
 *
 * @param Log {@link TappedFunction} used to log the hotkey.
 * @param Get A function that gets a hotkey by name.
 * @param appendStr Message to append before the hotkey name and data. `"Hotkey "` by default.
 * @returns A function that accepts a key name and returns a {@link Hotkey}.
 *
 * @example
 * const LH = tap(printConsole)
 * const GetHotkey = GetAndLog(LH, FromValue)
 *
 * ListenTo(GetHotkey("hk1")) // => "Hotkey hk1: Shift Enter" is printed to console
 */

export function getAndLog(
  Log: TappedFunction,
  Get: (k: string) => Hotkey,
  appendStr: string = "Hotkey "
) {
  const A = appendStr ? appendT(Log, appendStr) : Log
  return (k: string) => A(k, Get(k), toString)
}
