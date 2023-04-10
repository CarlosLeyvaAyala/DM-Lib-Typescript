import { FormEspInfo, ModType } from "./espData"

/** Adapter to change a {@link FormEspInfo} to `undefined` if needed. */

export const formEspInfoToUndef = (d: FormEspInfo) =>
  d.type === ModType.unknown ? { name: undefined, type: undefined } : d
