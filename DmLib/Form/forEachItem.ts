import { Form, ObjectReference, Utility } from "skyrimPlatform"

/**
 * Iterates over all items belonging to some `ObjectReference`, from last to first.
 * @internal
 *
 * @param o - The object reference to iterate over.
 * @param f - Function applied to each item.
 *
 * @remarks
 * Better use {@link forEachItem }.\
 * That function sends a `Form`, not a `Form | null`, so you are guaranteed to
 * have a form at the point that function gets executed.
 */
export function forEachItemR(
  o: ObjectReference,
  f: (item: Form | null) => void
) {
  let i = o.getNumItems()
  while (i > 0) {
    i--
    f(o.getNthForm(i))
  }
}

/**
 * Iterates over all items belonging to some `ObjectReference`, from last to first.
 *
 * @param o - The object reference to iterate over.
 * @param f - Function applied to each item.
 */
export function forEachItem(o: ObjectReference, f: (item: Form) => void) {
  forEachItemR(o, (item) => {
    if (!item) return
    f(item)
  })
}

/**
 * Iterates over all items belonging to some `ObjectReference`, from last to first. Waits
 * some time before each operation.
 *
 * @param o - The object reference to iterate over.
 * @param wait - Time (seconds) to wait.
 * @param f - Function applied to each item.
 */
export function forEachItemW(
  o: ObjectReference,
  wait: number,
  f: (item: Form) => void
) {
  const A = async () => {
    let i = o.getNumItems()
    while (i > 0) {
      i--
      const item = o.getNthForm(i)
      if (!item) return
      f(item)
      Utility.wait(wait)
    }
  }
  A()
}
