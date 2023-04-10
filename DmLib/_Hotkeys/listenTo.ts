import { listenToS } from "./listenToS"
import { Hotkey } from "./types"

/** Listen to {@link Hotkey}. */

export const listenTo = (hk: Hotkey, enable: boolean = true) =>
  listenToS(hk.hk, enable, hk.modifiers)
