import {
  Actor,
  Form,
  Game,
  printConsole,
  TESModPlatform,
  WorldSpace,
} from "skyrimPlatform"

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
 * const Setter = (frm: Form | null | undefined) => {
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
