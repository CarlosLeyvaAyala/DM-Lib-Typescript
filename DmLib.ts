import {
  Actor,
  Ammo,
  Armor,
  Book,
  Cell,
  Form,
  FormType,
  Game,
  hooks,
  Ingredient,
  Key,
  Keyword,
  MiscObject,
  ObjectReference,
  Outfit,
  Potion,
  SlotMask,
  SoulGem,
  Utility,
  Weapon,
} from "skyrimPlatform"

/** Functions related to `Forms`. */
export namespace FormLib {
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
  export function ForEachKeywordR(
    o: Form | null,
    f: (keyword: Keyword) => void
  ) {
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
  export function ForEachOutfitItemR(
    o: Outfit | null,
    f: (item: Form) => void
  ) {
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
}

/** Functions related to arrays. */
export namespace ArrayLib {
  /** Returns a random element from some array.
   *
   * @param arr Array to get the element from.
   * @returns A random element.
   */
  export function RandomElement<T>(arr: T[]) {
    return arr[Math.floor(Math.random() * arr.length)]
  }
}

/** Miscelaneous functions that don't belong to other categories. */
export namespace Misc {
  /** Adapts a PapyrusUtil saving function so it can be used with {@link PreserveVar}.
   *
   * @param f Function to adapt.
   * @param obj Object to save values on. Use `null` to save globally.
   * @returns A function that accepts a key and a value.
   *
   * @example
   * const SaveFlt = PapyrusUtilToPreserving(PapyrusUtil.SetFloatValue, null)
   * const SaveInt = PapyrusUtilToPreserving(PapyrusUtil.SetIntValue, null)
   */
  export function PapyrusUtilToPreserving<T>(
    f: (obj: Form | null | undefined, k: string, v: T) => void,
    obj: Form | null | undefined
  ) {
    return (k: string, v: T) => {
      f(obj, k, v)
    }
  }

  /** Returns a function that accepts a function `f` that gets executed each `seconds`.
   *
   * @remarks
   * This is meant to be used as a substitute of sorts to the `OnUpdate` Papyrus event,
   * but it doesn't check if the player has the game paused inside a menu; that's up to
   * `f` to implement.
   *
   * @param seconds Seconds between checks.
   * @returns A function that accepts a function `f`.
   *
   * @example
   * const RTcalc = UpdateEach(3)
   *
   * on("update", () => {
   *    RTcalc(() => { printConsole("Real time calculations") })
   * }
   */
  export function UpdateEach(seconds: number) {
    let lastUpdated = 0
    return (f: () => void) => {
      const t = Utility.getCurrentRealTime()
      if (t - lastUpdated < seconds) return
      lastUpdated = t
      f()
    }
  }
}

/** Functions related to hotkeys. */
export namespace Hotkeys {}
