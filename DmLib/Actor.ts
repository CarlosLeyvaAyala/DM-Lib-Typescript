import {
  Actor,
  ActorBase,
  Faction,
  Game,
  HeadPart,
  Keyword,
  ObjectReference,
  Spell,
  Utility,
} from "skyrimPlatform"
import { preserveActor } from "./Form"

/** Player FormId. */
export const playerId = 0x14

/** Gets the player as an `Actor`.
 *
 * @remarks
 * This function is intended to be used as a callback when you are defining functions that
 * need the player, but
 * {@link https://github.com/skyrim-multiplayer/skymp/blob/main/docs/skyrim_platform/native.md#native-functions game functions are not available}
 * when defining them.
 *
 * @privateRemarks
 * `Game.getPlayer()` is guaranteed to get an `Actor` in Skyrim Platform, so it's
 * ok to do `Game.getPlayer() as Actor`.
 */
export const Player = () => Game.getPlayer() as Actor

/**
 * Is an object the player?
 * @param a Object to be tested.
 * @returns Wether the object is the player.
 */
export function isPlayer(a: Actor | ObjectReference | null) {
  if (!a) return false
  return a.getFormID() === playerId
}

/**
 * Returns the name of the base of an `Actor`.
 * @param a Actor to get name from.
 * @returns Actor name.
 */
export function getBaseName(a: Actor | null) {
  const u = "unknown"
  if (!a) return u
  return a.getLeveledActorBase()?.getName() || u
}

export const GetBaseName = getBaseName

/**
 * Returns wether an `Actor` `Race` has the `ActorTypeNPC` `Keyword`.
 *
 * @remarks
 * This function is useful to check if an `Actor` is a _humanoid_ type of
 * character. Most of these character types are sentient, playable, use the
 * installed body modifier (CBBE, UNP, etc), are not creatures...
 *
 * @param a `Actor` to check.
 * @returns Wether the `Actor` has the `Keyword`.
 */
export function isActorTypeNPC(a: Actor | null) {
  if (!a) return false
  const ActorTypeNPC = Keyword.from(Game.getFormFromFile(0x13794, "Skyrim.esm"))
  return a.getRace()?.hasKeyword(ActorTypeNPC) || false
}

/** Does something to an `Actor` after some time has passed.
 *
 * @remarks
 * This was made to hide the tediousness of having to retrieve and check
 * for an `Actor` each time the `Utility.wait` function is used.
 *
 * The Actor `a` is guaranteed to exist at the time `DoSomething` is
 * executed. If the function is not executed it means `a` is no longer
 * available.
 *
 * @param a `Actor` to work on.
 * @param time Time to wait (seconds).
 * @param DoSomething What to do when the time has passed.
 */
export function waitActor(
  a: Actor,
  time: number,
  DoSomething: (act: Actor) => void
) {
  const actor = preserveActor(a)
  const f = async () => {
    await Utility.wait(time)
    const act = actor()
    if (!act) return
    DoSomething(act)
  }
  f()
}

export function waitActorId(
  formId: number,
  time: number,
  DoSomething: (act: Actor) => void
) {
  const f = async () => {
    await Utility.wait(time)
    const act = Actor.from(Game.getFormEx(formId))
    if (!act) return
    DoSomething(act)
  }
  f()
}

export function getHeadPartsB(b: ActorBase | null) {
  if (!b) return null
  const r = new Array(b.getNumHeadParts())

  for (let i = 0; i < r.length; i++) {
    r[i] = b.getNthHeadPart(i)
  }

  return r
}

export function getHeadParts(a: Actor | null) {
  if (!a) return null
  return getHeadPartsB(ActorBase.from(a.getBaseObject()))
}

export function isCurrentFollower(a: Actor | null) {
  //   const playerFollower = Faction.from(Game.getFormEx(0x84d1b))
  const currentFollower = Faction.from(Game.getFormEx(0x5c84e))
  return a?.isInFaction(currentFollower) ?? false
}

export function getSpells(a: Actor | null) {
  if (!a) return null
  const n = a.getSpellCount()
  const r: Spell[] = []
  for (let i = 0; i < n; i++) {
    const spell = a.getNthSpell(i)
    if (spell) r.push(spell)
  }
  return r
}
