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
  TESModPlatform,
  Utility,
  Weapon,
  WorldSpace,
  printConsole,
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

/**
 * Iterates over all armors belonging to some `ObjectReference`, from last to first.
 *
 * @param o - The object reference to iterate over.
 * @param f - Function applied to each armor.
 */
export function forEachArmorR(o: ObjectReference, f: (armor: Armor) => void) {
  forEachItem(o, (i) => {
    const a = Armor.from(i)
    if (!a) return
    f(a)
  })
}

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

/**
 * Creates a persistent chest hidden somewhere in Tamriel.
 *
 * @returns The FormId of the recently created chest. `null` if no chest could be created.
 *
 * @remarks
 * This chest can be used as a permanent storage that never resets.
 *
 * This function expects the "Tamriel" map to exist. The most likely case is that
 * map exists, since it's the map were all cities are located.
 *
 * @privateRemarks
 * Because of the way things are created in Skyrim, we first need to spawn the chest
 * at the player's location.
 */
export function createPersistentChest() {
  // Spawn chest at player's location
  const p = Game.getPlayer() as Actor
  const c = p.placeAtMe(Game.getFormEx(0x70479), 1, true, false)
  if (!c) return null

  // Move the chest to Tamriel
  const world = WorldSpace.from(Game.getFormEx(0x3c))
  TESModPlatform.moveRefrToPosition(c, null, world, 0, 0, -10000, 0, 0, 0)

  return c.getFormID()
}

/**
 * Tries to get a persistent chest defined in some place and creates a new
 * one if it doesn't exist.
 *
 * @param Getter - Function that gets an already existing chest.
 * @param Setter - Function that saves a newly created chest.
 * @param Logger - Function to log an error if a new chest couldn't be created.
 *
 * @remarks
 * This function assumes you want to somehow store and retrieve the chest from
 * some database (most probably, using JContainers or PapyrusUtil).
 *
 * This has to be done this way, since at the moment of creating this function,
 * Skyrim Platform has no means to read and write values directly to the SKSE co-save.
 *
 * @example
 * ```
 * // This uses a JContainers database to know what chest is being created
 * const path = "some.JContainers.path"
 * const h = GetSomeJContainersHandle(path)
 * const someForm = Game.getFormEx(0x14)
 *
 * const Getter = () => {
 *   return JFormMap.getForm(h, someForm)
 * }
 * const Setter = (frm: Form | null) => {
 *   JFormMap.setForm(h, someForm, frm)
 *   SaveSomeJContainersHandle(h, path)
 * }
 *
 * const chest = getPersistentChest(Getter, Setter, printConsole)
 * ```
 */
export function getPersistentChest(
  Getter: () => Form | null,
  Setter: (frm: Form | null) => void,
  Logger?: (msg: string) => void
) {
  let frm = Getter()
  if (!frm) {
    const newChest = createPersistentChest()
    if (!newChest) {
      const msg =
        "Could not create a persistent chest in Tamriel. " +
        "Are you using a mod that substantially changes the game?"
      if (Logger) Logger(msg)
      else printConsole(msg)
      return null
    }
    frm = Game.getFormEx(newChest)
    Setter(frm)
  }
  return frm
}

/**
 * Returns a `Form` from a string.
 * @param uId - Unique FormID to get the `Form` from.
 * @param fmt - Regular expression to get the `Form` from.
 * @param espGroup - In which group from the RegExp the Plugin file is expected to be.
 * @param formIdGroup - In which group from the RegExp the FormID is expected to be.
 * @returns `Form | null`
 *
 * @remarks
 * This function uses `Game.getFormFromFile`, so it expects `uId` to have
 * a relative FormID and a plugin name.
 *
 * With its default parameters, it recognizes unique ids in the format:
 *      `PluginName|0xHexFormID`
 *
 * @example
 * ```
 *  const VendorItemOreIngot = getFormFromUniqueId("Skyrim.esm|0x914ec")
 *  const NullForm = getFormFromUniqueId("Skyrim.esm|595180")  // Not a valid hex id
 *  const OreIngotAgain = getFormFromUniqueId("595180-Skyrim.esm", /(\d+)-(.*)/, 2, 1)
 * ```
 */
export function getFormFromUniqueId(
  uId: string,
  fmt: RegExp = /(.*)\|(0[xX].*)/,
  espGroup: number = 1,
  formIdGroup: number = 2
) {
  const m = uId.match(fmt)
  if (!m) return null
  const esp = m[espGroup]
  const formId = Number(m[formIdGroup])
  return Game.getFormFromFile(formId, esp)
}

/** Removes all the intstances of some item.
 *
 * @param o Who carries the item.
 * @param itemToRemove Item to completely remove.
 * @param silent Show a message?
 * @param otherContainer Move the item to other container?
 * @returns
 */
export function removeAllFromThisItem(
  o: ObjectReference | null,
  itemToRemove: Form | null,
  silent: boolean = true,
  otherContainer: ObjectReference | null = null
) {
  if (!o) return
  o.removeItem(
    itemToRemove,
    o.getItemCount(itemToRemove),
    silent,
    otherContainer
  )
}
