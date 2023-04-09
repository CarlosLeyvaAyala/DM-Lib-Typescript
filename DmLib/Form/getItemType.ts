import {
  Ammo,
  Armor,
  Book,
  Form,
  Ingredient,
  Key,
  MiscObject,
  Potion,
  SoulGem,
  Weapon,
} from "skyrimPlatform"
import { ItemType } from "./ItemType"

/** Returns what type of item a `Form` is.
 * @param  {Form|null} item Form to check.
 */

export function getItemType(item: Form | null) {
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
