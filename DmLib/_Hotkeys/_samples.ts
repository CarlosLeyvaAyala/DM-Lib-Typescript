import { printConsole } from "skyrimPlatform"
import { KeyHoldEvt } from "./types"

/** Not an useful function. Use it as a template. @see {@link listenTo} */

export const logPress = () => {
  printConsole(`Key was pressed`)
}
/** Not an useful function. Use it as a template. @see {@link listenTo} */
export const logRelease = () => {
  printConsole(`Key was released`)
}
/** Not an useful function. Use it as a template. @see {@link listenTo} */
export const logHold: KeyHoldEvt = (n) => () => {
  printConsole(`Key has been held for ${n} frames.`)
}
