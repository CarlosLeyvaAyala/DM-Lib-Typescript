import { Cell, Form, FormType } from "skyrimPlatform"

/** Iterates over all forms of `formType` in some `cell`.
 *
 * @param cell Cell to search forms for.
 * @param formType {@link FormType}
 * @param f Function applied to each `Form`.
 */

export function forEachFormInCell(
  cell: Cell | null | undefined,
  formType: FormType,
  f: (frm: Form) => void
) {
  if (!cell) return
  let i = cell.getNumRefs(formType)
  while (i > 0) {
    i--
    const frm = cell.getNthRef(i, formType)
    if (frm) f(frm)
  }
}
