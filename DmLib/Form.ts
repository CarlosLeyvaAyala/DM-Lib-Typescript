import {
  Actor,
  Ammo,
  Armor,
  Book,
  Cell,
  Form,
  FormType,
  Game,
  Ingredient,
  Key,
  Keyword,
  MiscObject,
  ObjectReference,
  Outfit,
  Potion,
  SlotMask,
  SoulGem,
  Weapon,
} from "skyrimPlatform"

export const enum ItemType {
  None,
  Weapon,
  Ammo,
  Armor,
  Potion,
  Poison,
  Scroll,
  Food,
  Ingredient,
  Book,
  Key,
  Misc,
  SoulGem,
}

/** Returns what type of item a `Form` is.
 * @param  {Form|null} item Form to check.
 */
export function GetItemType(item: Form | null) {
  if (!item) return ItemType.None
  if (Weapon.from(item)) return ItemType.Weapon
  if (Ammo.from(item)) return ItemType.Ammo
  if (Armor.from(item)) return ItemType.Armor

  const asP = Potion.from(item)
  if (asP) {
    if (asP.isPoison()) return ItemType.Poison
    if (asP.isFood()) return ItemType.Food
    return ItemType.Potion
  }

  if (Ingredient.from(item)) return ItemType.Ingredient
  if (Book.from(item)) return ItemType.Book
  if (Key.from(item)) return ItemType.Key
  if (SoulGem.from(item)) return ItemType.SoulGem
  if (MiscObject.from(item)) return ItemType.Misc

  return ItemType.None
}

/** Tries to do something on an `Actor` on each slot mask.
 * @param  {Actor|null} a Actor to work on.
 * @param  {(slot:number)=>void} DoSomething What to do on each slot mask.
 */
export function ForEachSlotMask(
  a: Actor | null,
  DoSomething: (slot: number) => void
) {
  if (!a) return
  for (let i = SlotMask.Head; i < SlotMask.FX01; i *= 2) {
    DoSomething(i)
  }
}

/** Does something for each `Armor` an `Actor` has equipped.
 *
 * @param a Actor to check.
 * @param DoSomething What to do when an equipped armor is found.
 */
// * Notice how this function doesn't use ForEachEquippedSlotMask.
// * That's because this function is used quite a lot in real time
// * and it's better to help it be faster, even if it's only one bit.
export function ForEachEquippedArmor(
  a: Actor | null,
  DoSomething: (arm: Armor) => void
) {
  if (!a) return
  for (let i = SlotMask.Head; i < SlotMask.FX01; i *= 2) {
    const x = Armor.from(a.getWornForm(i))
    if (x) DoSomething(x)
  }
}

/** Gets all armors an `Actor` is wearing.
 *
 * @param a Actor to check for.
 * @param nonRepeated Some armors may occupy more than one bodyslot.
 * When this value is `false`, those armors will be returned multiple times: once for each slot.
 * @param playableOnly Return only playeable armors?
 * @param namedOnly Return only named armors?
 * @returns An array with all equipped armors.
 *
 * @remarks
 * ***WARNING***. This function ***may*** be slow (not to Papyrus levels, of course) and
 * it's recommended to be used with caution in real production code.
 *
 * However, it can be safely used sparingly.
 */
export function GetEquippedArmors(
  a: Actor | null,
  nonRepeated: boolean = true,
  playableOnly: boolean = true,
  namedOnly: boolean = true
) {
  if (!a) return []
  const all: Armor[] = []

  ForEachEquippedArmor(a, (x) => {
    const p = playableOnly ? (x.isPlayable() ? x : null) : x
    const n = p && namedOnly ? (p.getName() !== "" ? p : null) : p
    if (n) all.push(n)
  })

  const GetNonRepeated = () => {
    const uIds = [...new Set(all.map((a) => a.getFormID()))]
    return uIds.map((id) => Armor.from(Game.getFormEx(id)) as Armor)
  }

  return nonRepeated ? GetNonRepeated() : all
}

/** Iterates over all keywords belonging to some `Form`, from last to first.
 *
 * @param o - The form to iterate over.
 * @param f - Function applied to each keyword.
 */
export function ForEachKeywordR(o: Form | null, f: (keyword: Keyword) => void) {
  if (!o) return
  let i = o.getNumKeywords()
  while (i > 0) {
    i--
    const k = Keyword.from(o.getNthKeyword(i))
    if (k) f(k)
  }
}

/** Iterates over all items belonging to some `Outfit`, from last to first.
 *
 * @param o - The outfit to iterate over.
 * @param f - Function applied to each item.
 */
export function ForEachOutfitItemR(o: Outfit | null, f: (item: Form) => void) {
  if (!o) return
  let i = o.getNumParts()
  while (i > 0) {
    i--
    const ii = o.getNthPart(i)
    if (ii) f(ii)
  }
}

/** Iterates over all forms of `formType` in some `cell`.
 *
 * @param cell Cell to search forms for.
 * @param formType {@link FormType}
 * @param f Function applied to each `Form`.
 */
export function ForEachFormInCell(
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

/** Returns wether an `ObjectReference` is an alchemy lab.
 * @param  {ObjectReference} furniture The furniture to check.
 *
 * @remarks
 * This function is intended to be used with `on("furnitureEnter")`
 * and `on("furnitureExit")` Skyrim Platform events.
 */
export const IsAlchemyLab = (furniture: ObjectReference) =>
  ObjRefHasName(furniture, "alchemy")

/** Tests if an object reference contains some name */
const ObjRefHasName = (f: ObjectReference, name: string) =>
  f.getBaseObject()?.getName().toLowerCase().includes(name)

export function preserveForm(frm: Form | null) {
  if (!frm) return () => null
  const id = frm.getFormID()
  return () => Game.getFormEx(id)
}

export function preserveActor(a: Actor | null) {
  const f = preserveForm(a)
  return () => Actor.from(f())
}

/** In what space is the mod loaded in? */
export const enum ModType {
  esp,
  esl,
  unknown,
}

/** Info a `Form` gets about its esp. */
export interface FormEspInfo {
  name: string
  type: ModType
}

/** Returns the esp file, type and fixed formId for a `Form`.
 *
 * @param form `Form` to get data from.
 * @returns An object with all data.
 */

export function getEspAndId(form: Form | null) {
  const esp = getFormEsp(form)
  const id = getFixedFormId(form, esp.type)
  return { modName: esp.name, type: esp.type, fixedFormId: id }
}

/** Returns the relative `formId` of some `Form`.
 *
 * @param form The `Form` to get the relative `formId` from.
 * @param modType Does the `Form` belong to an esp or esl file?
 * @returns Fixed `formId`. `-1` if `form` or `modType` are invalid.
 */

export function getFixedFormId(form: Form | null, modType: ModType) {
  if (!form || modType === ModType.unknown) return -1
  const id = form.getFormID()
  return modType === ModType.esp ? id & 0xffffff : id & 0xfff
}

/** Returns a string that can be used as an unique `Form` identifier.
 *
 * @param form The `Form` to generate data for.
 * @param format The function that will be used to give format to the result of this function.
 * @returns A unique `string` identifier based on fixed formId and esp file data.
 *
 * @example
 * const b = Game.getFormEx(0x03003012)
 * const uId = GetFormUniqueId(b) // => "Hearthfires.esm|0x3012"
 * const uId2 = GetFormUniqueId(b, (e, i) => `${e}|0x${i.toString(16)}`) // => "Hearthfires.esm|0x3012"
 */

export function getUniqueId(
  form: Form | null,
  format: (
    espName: string,
    fixedFormId: number,
    type?: ModType
  ) => string = defaultUIdFmt
): string {
  if (!form) return "Null form"
  const d = getEspAndId(form)
  return format(d.modName, d.fixedFormId, d.type)
}

/** Gets the esp a form belongs to.
 *
 * @param form Form to get the esp from.
 * @returns Name and type of the esp file he form belongs to.
 */
// * This code was adapted from `GetFormIdentifier` in FileUtils.cpp
// * in SKEE64 (RaceMenu dll); line 177.
export function getFormEsp(form: Form | null): FormEspInfo {
  const nil = { name: "", type: ModType.unknown }
  if (!form) return nil

  const formId = form.getFormID()
  const modIndex = formId >>> 24

  if (modIndex == 0xfe) {
    const lightIndex = (formId >>> 12) & 0xfff
    if (lightIndex < Game.getLightModCount())
      return { name: Game.getLightModName(lightIndex), type: ModType.esl }
  } else return { name: Game.getModName(modIndex), type: ModType.esp }

  return nil
}

/** Returns a string in the `PluginName|0xHexFormID` format.
 * @param  {string} espName
 * @param  {number} fixedFormId
 *
 * @remarks
 * This is used by default by {@link getUniqueId}.
 */

export const defaultUIdFmt = (espName: string, fixedFormId: number) =>
  `${espName}|0x${fixedFormId.toString(16)}`
