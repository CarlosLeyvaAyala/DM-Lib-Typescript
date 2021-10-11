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

/**
 * Gets the esp a form belongs to.
 *
 * @remarks
 * This code was adapted from `GetFormIdentifier` in FileUtils.cpp
 * in SKEE64 (RaceMenu dll); line 177.
 *
 * @param form
 * @returns string
 */
export function GetFormEsp(form: Form | null | undefined) {
  if (!form) return ""

  const formId = form.getFormID()
  const modIndex = formId >>> 24

  if (modIndex == 0xfe) {
    const lightIndex = (formId >>> 12) & 0xfff
    if (lightIndex < Game.getLightModCount())
      return Game.getLightModName(lightIndex)
  } else return Game.getModName(modIndex)

  return ""
}
