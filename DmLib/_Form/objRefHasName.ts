import { ObjectReference } from "skyrimPlatform"

/** Tests if an object reference contains some name */
export const objRefHasName = (f: ObjectReference, name: string) =>
  f.getBaseObject()?.getName().toLowerCase().includes(name)
