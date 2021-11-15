import { Form, Game, SendPapyrusEventHook, Utility } from "../skyrimPlatform"

/**
 * Avoids a function to be executed many times at the same time.
 *
 * @param f The function to wrap.
 * @returns A function that will be called only once when the engine
 * tries to spam it.
 *
 * @remarks
 * Sometimes the engine is so fast a function may be called many times
 * in a row. For example, the `OnSleepStart` event may be fired 4 times
 * in a row, thus executing a function those 4 times, even when it was
 * intended to run only once.
 *
 * This function will make a function in that situation to be called
 * only once, as expected.
 *
 * @see {@link ListenPapyrusEvent} for a useful sample usage.
 *
 * @warning
 * Since this function is a "closure" it needs to be used outside loops
 * and things that may redefine the inner variables inside it.
 *
 * If this function doesn't appear to work, try to use it outside the
 * current execution block.
 *
 * @example
 * let f = () => { printConsole("Only once") }
 * f = AvoidRapidFire(f)
 *
 * // The engine is so fast this will actually work
 * f()
 * f()
 * f()
 */
export function AvoidRapidFire(f: () => void) {
  let lastExecuted = 0
  return () => {
    const t = Utility.getCurrentGameTime()
    if (lastExecuted === t) return
    lastExecuted = t
    f()
  }
}

/**
 * @deprecated Papyrus hooks have the `eventPattern` argument, which does what this function
 * does, but way faster.
 * This function will be deleted. Don't use it.
 *
 * Waits for a Papyrus event named `eventName` to be fired.
 *
 * @param eventName
 * @returns A function that accepts a `Context` and the function `f` that will be
 * executed when the `papyrusEventName` inside that context is the same as
 * `eventName`.
 *
 * @remarks
 * Some events fire many times at the same time. It's advisable to wrap `f`
 * with {@link AvoidRapidFire} to avoid executing the same function over and over.
 *
 * @example
 * const SleepStart = ListenPapyrusEvent("OnSleepStart")
 * let OnSleepStart = () => { printConsole("I just started sleeping") }
 * OnSleepStart = AvoidRapidFire(OnSleepStart)
 *
 * hooks.sendPapyrusEvent.add({
 *   enter(ctx) {
 *     SleepStart(ctx, OnSleepStart)
 *     // SleepStart(ctx, AvoidRapidFire(OnSleepStart)) <- DON'T DO THIS. AvoidRapidFire won't work here. It needs to be used outside the event hook.
 *   },
 * })
 */
export function ListenPapyrusEvent(eventName: string) {
  return function (c: SendPapyrusEventHook.Context, f: () => void) {
    if (eventName !== c.papyrusEventName) return
    f()
  }
}

export enum ModType {
  esp,
  esl,
  unknown,
}

/**
 * Gets the esp a form belongs to.
 *
 * @remarks
 * This code was adapted from `GetFormIdentifier` in FileUtils.cpp
 * in SKEE64 (RaceMenu dll); line 177.
 *
 * @param form Form to get the esp from.
 * @returns Name and type of the esp file he form belongs to.
 */
export function GetFormEsp(form: Form | null | undefined) {
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

/**
 * Returns the relative `formId` of some `Form`.
 *
 * @param form The `Form` to get the relative `formId` from.
 * @param modType Does the `Form` belong to an esp or esl file?
 * @returns Fixed `formId`. `-1` if `form` or `modType` are invalid.
 */
export function GetFixedFormId(
  form: Form | null | undefined,
  modType: ModType
) {
  if (!form || modType === ModType.unknown) return -1
  const id = form.getFormID()
  return modType === ModType.esp ? id & 0xffffff : id & 0xfff
}

/**
 * Returns the esp file, type and fixed formId for a `Form`.
 *
 * @param form `Form` to get data from.
 * @returns An object with all data.
 */
export function GetFormEspAndId(form: Form | null | undefined) {
  const esp = GetFormEsp(form)
  const id = GetFixedFormId(form, esp.type)
  return { modName: esp.name, type: esp.type, fixedFormId: id }
}

/**
 * Returns a string that can be used as an unique `Form` identifier.
 *
 * @param form The `Form` to generate data for.
 * @param format The function that will be used to give format to the result of this function.
 * @returns A unique `string` identifier based on fixed formId and esp file data.
 *
 * @example
 * const b = Game.getFormEx(0x03003012)
 * const uId = GetFormUniqueId(b, (e, i) => `${e}|0x${i.toString(16)}`) // => "Hearthfires.esm|0x3012"
 */
export function GetFormUniqueId(
  form: Form | null | undefined,
  format: (name: string, fixedFormId: number, type?: ModType) => string
): string {
  if (!form) return "Undefined form"
  const d = GetFormEspAndId(form)
  return format(d.modName, d.fixedFormId, d.type)
}

/** Returns a random element from some array.
 *
 * @param arr Array to get the element from.
 * @returns A random element.
 */
export function RandomElement<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}
