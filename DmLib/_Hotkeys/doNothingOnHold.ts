import { KeyHoldEvt } from "./types"

/** Does nothing on key hold. */

export const doNothingOnHold: KeyHoldEvt = (_) => () => {}
