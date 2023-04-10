import { ObjectReference } from "skyrimPlatform"
import { objRefHasName } from "./objRefHasName"

/** Returns wether an `ObjectReference` is an alchemy lab.
 * @param  {ObjectReference} furniture The furniture to check.
 *
 * @remarks
 * This function is intended to be used with `on("furnitureEnter")`
 * and `on("furnitureExit")` Skyrim Platform events.
 */

export const isAlchemyLab = (furniture: ObjectReference) =>
  objRefHasName(furniture, "alchemy")
