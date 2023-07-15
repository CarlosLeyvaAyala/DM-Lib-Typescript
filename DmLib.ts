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
  Input,
  Key,
  Keyword,
  Location,
  MiscObject,
  ObjectReference,
  once,
  Outfit,
  Potion,
  printConsole,
  settings,
  SlotMask,
  SoulGem,
  storage,
  TESModPlatform,
  Utility,
  Weapon,
  WorldSpace,
  writeLogs,
} from "skyrimPlatform"

/** Actor helpers */
export namespace ActorLib {
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

  /** Is an object the player?
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

  /** Returns wether an `Actor` `Race` has the `ActorTypeNPC` `Keyword`.
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
    const ActorTypeNPC = Keyword.from(
      Game.getFormFromFile(0x13794, "Skyrim.esm")
    )
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
    const actor = FormLib.preserveActor(a)
    const f = async () => {
      await Utility.wait(time)
      const act = actor()
      if (!act) return
      DoSomething(act)
    }
    f()
  }

  // ;> ======================
  // ;> ALTERNATE DECLARATIONS
  // ;> ======================

  /** Player FormId. */
  export const PlayerId = playerId

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
  export const player = Player

  /** Is an object the player?
   * @param a Object to be tested.
   * @returns Wether the object is the player.
   */
  export const IsPlayer = isPlayer

  /** Returns the name of the base of an `Actor`.
   * @param a Actor to get name from.
   * @returns Actor name.
   */
  export const GetBaseName = getBaseName

  /** Returns wether an `Actor` `Race` has the `ActorTypeNPC` `Keyword`.
   *
   * @remarks
   * This function is useful to check if an `Actor` is a _humanoid_ type of
   * character. Most of these character types are sentient, playable, use the
   * installed body modifier (CBBE, UNP, etc), are not creatures...
   *
   * @param a `Actor` to check.
   * @returns Wether the `Actor` has the `Keyword`.
   */
  export const IsActorTypeNPC = isActorTypeNPC

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
  export const WaitActor = waitActor
}

/** Animation helpers */
export namespace AnimLib {
  export const enum Animations {
    AttackPowerStartBackLeftHand = "attackPowerStartBackLeftHand",
    AttackPowerStartBackward = "attackPowerStartBackward",
    AttackPowerStartDualWield = "attackPowerStartDualWield",
    AttackPowerStartForward = "attackPowerStartForward",
    AttackPowerStartForwardH2HLeftHand = "attackPowerStartForwardH2HLeftHand",
    AttackPowerStartForwardH2HRightHand = "attackPowerStartForwardH2HRightHand",
    AttackPowerStartForwardLeftHand = "attackPowerStartForwardLeftHand",
    AttackPowerStartH2HCombo = "attackPowerStartH2HCombo",
    AttackPowerStartInPlace = "attackPowerStartInPlace",
    AttackPowerStartInPlaceLeftHand = "attackPowerStartInPlaceLeftHand",
    AttackPowerStartLeft = "attackPowerStartLeft",
    AttackPowerStartLeftLeftHand = "attackPowerStartLeftLeftHand",
    AttackPowerStartRight = "attackPowerStartRight",
    AttackPowerStartRightLeftHand = "attackPowerStartRightLeftHand",
    AttackStart = "attackStart",
    AttackStartDualWield = "attackStartDualWield",
    AttackStartH2HLeft = "AttackStartH2HLeft",
    AttackStartH2HRight = "AttackStartH2HRight",
    AttackStartLeftHand = "attackStartLeftHand",
    BashRelease = "bashRelease",
    BashStart = "bashStart",
    BlockStart = "blockStart",
    BlockStop = "blockStop",
    BowAttackStart = "bowAttackStart",
    ChairDrinkingStart = "ChairDrinkingStart",
    CrossbowAttackStart = "crossbowAttackStart",
    CrossbowDwarvenAttackStart = "crossbowDwarvenAttackStart",
    HorseEnter = "HorseEnter",
    HorseExit = "HorseExit",
    IdleAlchemyEnter = "IdleAlchemyEnter",
    IdleBedExitStart = "IdleBedExitStart",
    IdleBedLeftEnterStart = "IdleBedLeftEnterStart",
    IdleBlacksmithForgeEnter = "IdleBlacksmithForgeEnter",
    IdleBlackSmithingEnterStart = "IdleBlackSmithingEnterStart",
    IdleCarryBucketPourEnter = "IdleCarryBucketPourEnter",
    IdleChairExitStart = "IdleChairExitStart",
    IdleChairFrontEnter = "IdleChairFrontEnter",
    IdleChairShoulderFlex = "idleChairShoulderFlex",
    IdleCounterStart = "IdleCounterStart",
    IdleEnchantingEnter = "IdleEnchantingEnter",
    IdleExamine = "IdleExamine",
    IdleFeedChicken = "IdleFeedChicken",
    IdleFurnitureExitSlow = "IdleFurnitureExitSlow",
    IdleHammerCarpenterTableEnter = "IdleHammerCarpenterTableEnter",
    IdleLeanTableEnter = "IdleLeanTableEnter",
    IdleLooseSweepingStart = "idleLooseSweepingStart",
    IdleSharpeningWheelStart = "IdleSharpeningWheelStart",
    IdleSmelterEnter = "IdleSmelterEnter",
    IdleStop = "IdleStop",
    IdleStopInstant = "IdleStopInstant",
    IdleTanningEnter = "IdleTanningEnter",
    IdleTelvanniTowerFloatDown = "IdleTelvanniTowerFloatDown",
    IdleTelvanniTowerFloatUp = "IdleTelvanniTowerFloatUp",
    IdleWallLeanStart = "IdleWallLeanStart",
    JumpDirectionalStart = "JumpDirectionalStart",
    JumpLand = "JumpLand",
    JumpLandDirectional = "JumpLandDirectional",
    JumpStandingStart = "JumpStandingStart",
    RitualSpellStart = "RitualSpellStart",
    SneakSprintStartRoll = "SneakSprintStartRoll",
    SneakStart = "SneakStart",
    SneakStop = "SneakStop",
    SpellReadyLeftHand = "MLh_SpellReady_event",
    SpellReadyRightHand = "MRh_SpellReady_Event",
    SpellReleaseLeftHand = "MLH_SpellRelease_event",
    SpellReleaseRightHand = "MRh_SpellRelease_Event",
    SprintStart = "SprintStart",
    SprintStop = "SprintStop",
    SwimStart = "SwimStart",
    SwimStop = "SwimStop",
    Unequip = "Unequip",
  }

  /** Adds a hook to react to some animation event.
   * @param  {string} animName Name of the animation to react to.
   * @param  {()=>void} callback Function to call when animation is played.
   * @param  {number | undefined} minFormId Minimum FormId of actors to react to.
   * @param  {number | undefined} maxFormId Maximum FormId of actors to react to.
   */
  export function HookAnim(
    animName: string,
    callback: () => void,
    minFormId: number | undefined,
    maxFormId: number | undefined
  ) {
    hooks.sendAnimationEvent.add(
      {
        enter(_) {},
        leave(c) {
          if (c.animationSucceeded) once("update", () => callback())
        },
      },
      minFormId,
      maxFormId,
      animName
    )
  }

  // ;> ======================
  // ;> ALTERNATE DECLARATIONS
  // ;> ======================

  /** Adds a hook to react to some animation event.
   * @param  {string} animName Name of the animation to react to.
   * @param  {()=>void} callback Function to call when animation is played.
   * @param  {number | undefined} minFormId Minimum FormId of actors to react to.
   * @param  {number | undefined} maxFormId Maximum FormId of actors to react to.
   */
  export const hookAnim = HookAnim
}

/** Functions related to arrays. */
export namespace ArrayLib {
  /** Returns a random element from some array.
   *
   * @param arr Array to get the element from.
   * @returns A random element.
   */
  export function randomElement<T>(arr: T[]) {
    return arr[Math.floor(Math.random() * arr.length)]
  }

  // ;> ======================
  // ;> ALTERNATE DECLARATIONS
  // ;> ======================

  /** Returns a random element from some array.
   *
   * @param arr Array to get the element from.
   * @returns A random element.
   */
  export const RandomElement = randomElement
}

/** Functional programming combinators.
 *
 * @remarks
 * Many of these may be arcane, but they are quite useful nonetheless.
 *
 * Some of them are used in this library and you aren't required to use any
 * of these, ever.\
 * But if you know when to use them, your code will be shorter and your intentions
 * clearer.
 *
 * Highly recommended reading:
 *
 * - https://tgdwyer.github.io/
 * - https://leanpub.com/javascriptallongesix/read#leanpub-auto-making-data-out-of-functions
 */
export namespace Combinators {
  /** Returns whatever it's passed to it.
   *
   * @param x
   * @returns x
   *
   * @remarks
   * **This is NOT STUPID**. It's useful, for example, for feeding it to
   * functions that may transform values, but we don't want to transform
   * something in particular.
   *
   * It's not much useful by itself, but you will soon see its value
   * when you start composing functions.
   *
   * @see {@link K} for other uses.
   *
   * @example
   * const lower = (x: string) => x.toLowerCase()
   * const upper = (x: string) => x.toUpperCase()
   * const f = (x: string, g: (x: string) => string) => g(x)
   *
   * const x = f("LOWER", lower)
   * const y = f("upper", upper)
   * const z = f("sAmE", I)
   */
  export const I = <T>(x: T) => x

  /** Returns a function that accepts one parameter, but ignores it and returns whatever
   * you originally defined it with.
   *
   * @param x
   * @returns `function (y: any) => x`
   *
   * @remarks
   * This can be used to make a function constant; that is, no matter what you
   * pass to it, it will always returns the value you first defined it with.
   * This is useful to plug constants into places that are expecting functions.
   *
   * If combined with {@link I} it can do useful things. `K(I)` will always
   * return the second parameter you pass to it.
   *
   * Combined with {@link O} can be used to make one liners that ensure a calculated value
   * is always returned.
   *
   * @see {@link O} for more uses.
   *
   * @example
   * const first = K
   * const second = k(I)
   * first("primero")("segundo")    // => "primero"
   * second("primero")("segundo")   // => "segundo"
   *
   * const msg = K("You are a moron")
   * const validate = (x: number) => (typeof x !== "number" ? null : x.toString())
   * const intToStr = O(validate, msg)
   * intToStr(null)   // => "You are a moron"
   * intToStr(32)     // => 32
   *
   * const guaranteedActorBase = O((a: Actor) => a.getLeveledActorBase(), K(Game.getPlayer()?.getBaseObject()))
   * guaranteedActorBase(null)              // => player
   * guaranteedActorBase(whiterunGuard)     // => Whiterun Guard
   */
  export const K =
    <T>(x: T) =>
    (y: any): T =>
      x

  /** Creates a function that accepts one parameter `x`. Returns `f1(x)` if not `null`, else `f2(x)`.
   *
   * @param f1 First function to apply.
   * @param f2 Second function to apply.
   * @returns `f1(x)` if not `null`, else `f2(x)`.
   */
  export const O =
    <U>(f1: (...args: any[]) => U | null, f2: (...args: any[]) => U) =>
    (...args: any[]): U =>
      f1(...args) || f2(...args)

  /** Applies function `f` to `x` and returns `x`. Useful for chaining functions that return nothing.
   *
   * @param x
   * @param f
   * @returns x
   */
  export function Tap<K>(x: K, f: (x: K) => void) {
    f(x)
    return x
  }

  /** Returns a value while executing a function.
   *
   * @see {@link DebugLib.Log.R} for a sample usage.
   *
   * @param f Function to execute.
   * @param x Value to return.
   * @returns `x`
   */
  export const Return = <T>(f: void, x: T) => Tap(x, K(f))

  // ;> ======================
  // ;> ALTERNATE DECLARATIONS
  // ;> ======================

  /** Returns whatever it's passed to it.
   *
   * @param x
   * @returns x
   *
   * @remarks
   * **This is NOT STUPID**. It's useful, for example, for feeding it to
   * functions that may transform values, but we don't want to transform
   * something in particular.
   *
   * It's not much useful by itself, but you will soon see its value
   * when you start composing functions.
   *
   * @see {@link K} for other uses.
   *
   * @example
   * const lower = (x: string) => x.toLowerCase()
   * const upper = (x: string) => x.toUpperCase()
   * const f = (x: string, g: (x: string) => string) => g(x)
   *
   * const x = f("LOWER", lower)
   * const y = f("upper", upper)
   * const z = f("sAmE", I)
   */
  export const i = I

  /** Returns a function that accepts one parameter, but ignores it and returns whatever
   * you originally defined it with.
   *
   * @param x
   * @returns `function (y: any) => x`
   *
   * @remarks
   * This can be used to make a function constant; that is, no matter what you
   * pass to it, it will always returns the value you first defined it with.
   * This is useful to plug constants into places that are expecting functions.
   *
   * If combined with {@link I} it can do useful things. `K(I)` will always
   * return the second parameter you pass to it.
   *
   * Combined with {@link O} can be used to make one liners that ensure a calculated value
   * is always returned.
   *
   * @see {@link O} for more uses.
   *
   * @example
   * const first = K
   * const second = k(I)
   * first("primero")("segundo")    // => "primero"
   * second("primero")("segundo")   // => "segundo"
   *
   * const msg = K("You are a moron")
   * const validate = (x: number) => (typeof x !== "number" ? null : x.toString())
   * const intToStr = O(validate, msg)
   * intToStr(null)   // => "You are a moron"
   * intToStr(32)     // => 32
   *
   * const guaranteedActorBase = O((a: Actor) => a.getLeveledActorBase(), K(Game.getPlayer()?.getBaseObject()))
   * guaranteedActorBase(null)              // => player
   * guaranteedActorBase(whiterunGuard)     // => Whiterun Guard
   */
  export const k = K

  /** Creates a function that accepts one parameter `x`. Returns `f1(x)` if not `null`, else `f2(x)`.
   *
   * @param f1 First function to apply.
   * @param f2 Second function to apply.
   * @returns `f1(x)` if not `null`, else `f2(x)`.
   */
  export const o = O

  /** Applies function `f` to `x` and returns `x`. Useful for chaining functions that return nothing.
   *
   * @param x
   * @param f
   * @returns x
   */
  export const tap = Tap
}

/** Useful functions for debugging. */
export namespace DebugLib {
  export namespace Log {
    /** How much will the console be spammed.
     * - optimization     Meant to only output the times functions take to execute. Used for bottleneck solving.
     * - none       No spam.
     * - error      Just errors and stuff like that.
     * - info       Detailed info so players can know if things are going as expected, but not enough for actual debugging.
     * - verbose    Info meant for developers. Use it for reporting errors or unexpected behavior.
     */
    export enum Level {
      optimization = -1,
      none,
      error,
      info,
      verbose,
    }

    /** Gets the logging level from some configuration file.
     *
     * @param pluginName Name of the plugin to get the value from.
     * @param optionName Name of the variable that carries the value.
     * @returns The logging level from file. `verbose` if value was invalid.
     */
    export function LevelFromSettings(
      pluginName: string,
      optionName: string
    ): Level {
      return LevelFromValue(settings[pluginName][optionName])
    }

    /** Gets a logging {@link Level} from either a string or a number.
     *
     * @param v The string or number to convert to a Level.
     * @returns A logging Level. `Level.verbose` if `v` can not be converted.
     */
    export function LevelFromValue(v: any): Level {
      const l =
        typeof v === "string"
          ? v.toLowerCase()
          : typeof v === "number"
          ? v
          : "verbose"
      let t = (<any>Level)[l]
      if (typeof l === "number") t = Level[t]
      return t === undefined ? Level.verbose : t
    }

    /** A function that accepts a message. Returns nothing. */
    export type LoggingFunction = (msg: string) => void

    /** Signature of a function used for giving format to logging. */
    export type LogFormat = (
      currLogLvl: Level,
      maxLogLvl: Level,
      modName: string,
      date: Date,
      msg: string
    ) => string

    /** Returns a string in the form `"[Mod name]: Message"`.
     * @see {@link FileFmt}.
     *
     * @remarks
     * You can use this function as a guide on how a {@link LogFormat} function
     * used for {@link CreateFunction} can be made.
     *
     * @example
     * const LogI = CreateFunction(userLevel, Level.info, "my-mod", ConsoleFmt, FileFmt)
     * const LogV = CreateFunction(userLevel, Level.verbose, "my-mod", ConsoleFmt, FileFmt)
     *
     * // Console output: "[my-mod]: This is important for the player."
     * // File output: "[info] 4/5/2021 12:32:15 p.m.: This is important for the player."
     * LogI("This is important for the player.")
     *
     * // Console output: "[my-mod]: This is useful for debugging."
     * // File output: "[verbose] 4/5/2021 12:32:15 p.m.: This is useful for debugging."
     * LogV("This is useful for debugging.")
     */
    export const ConsoleFmt: LogFormat = (_, __, n, ___, msg) =>
      `[${n}]: ${msg}`

    /** Returns a string in the form `"[logging level] date-time: Message"`.
     * @see {@link ConsoleFmt}.
     *
     * @remarks
     * You can use this function as a guide on how a {@link LogFormat} function
     * used for {@link CreateFunction} can be made.
     *
     * Format for https://github.com/Scarfsail/AdvancedLogViewer :\
     *    `[{Type}] {Date} {Time}: {Message}`
     *
     * @example
     * const LogI = CreateFunction(userLevel, Level.info, "my-mod", ConsoleFmt, FileFmt)
     * const LogV = CreateFunction(userLevel, Level.verbose, "my-mod", ConsoleFmt, FileFmt)
     *
     * // Console output: "[my-mod]: This is important for the player."
     * // File output: "[info] 4/5/2021 12:32:15 p.m.: This is important for the player."
     * LogI("This is important for the player.")
     *
     * // Console output: "[my-mod]: This is useful for debugging."
     * // File output: "[verbose] 4/5/2021 12:32:15 p.m.: This is useful for debugging."
     * LogV("This is useful for debugging.")
     */
    export const FileFmt: LogFormat = (_, m, __, t, msg) =>
      `[${Level[m]}] ${t.toLocaleString()}: ${msg}`

    /** A function that accepts a message, a variable and an optional function.
     *
     * Returns the variable after logging the message.
     * If a function was passed, it will be applied to the variable before logging.
     *
     * Function `f` must be a function that transforms variables of the same type
     *  of `x` to string.
     */
    export type TappedFunction = <T>(
      msg: string,
      x: T,
      f?: (x: T) => string
    ) => T

    /** Creates a logging function that appends some message before logging.
     *
     * @param f Function to wrap.
     * @param append Message to append each time the result is called.
     * @returns A {@link LoggingFunction}.
     *
     * @example
     * const CMLL = Append(printConsole, "Kemonito: ")
     * CMLL("Kicks")       // => "Kemonito: Kicks"
     * CMLL("Flies!")      // => "Kemonito: Flies!"
     * CMLL("Is love")     // => "Kemonito: Is love"
     * CMLL("Is life")     // => "Kemonito: Is life"
     */
    export function Append(f: LoggingFunction, append: any): LoggingFunction {
      return (msg: any) => f(append + msg)
    }

    /** Creates a logging function that appends some message before logging.
     *
     * @see {@link Append}
     *
     * @param f Function to wrap.
     * @param append Message to append each time the result is called.
     * @returns A {@link TappedFunction}.
     */
    export function AppendT(f: TappedFunction, append: any): TappedFunction {
      return <T>(msg: string, x: T, fmt?: (x: T) => string) =>
        f(append + msg, x, fmt)
    }

    /** Creates a function used for logging. Said function can log to either console or to some file.
     *
     * @see {@link FileFmt}, {@link ConsoleFmt}.
     *
     * @param currLogLvl The log level the user has selected. I.e. how much info they want to get.
     * @param logAt At which level this function will log.
     * @param modName Name of the mod. Will be used to output messages and to name the output file.
     * Output file will be named `"Data\Platform\Plugins\modName-logs.txt"`.
     * @param ConsoleFmt A function of type {@link LogFormat}. If `undefined`, nothing will be output to console.
     * @param FileFmt A function of type {@link LogFormat}. If `undefined`, nothing will be output to file.
     * @returns A function that logs a message as a string.
     *
     * @example
     * // LogI will only log to file
     * const LogI = CreateFunction(Level.info, Level.info, "my-mod", undefined, FileFmt)
     *
     * // LogV won't log anything because player only wants to log at most Level.info type messages
     * const LogV = CreateFunction(Level.info, Level.verbose, "my-mod", ConsoleFmt, FileFmt)
     */
    export function CreateFunction(
      currLogLvl: Level,
      logAt: Level,
      modName: string,
      ConsoleFmt?: LogFormat,
      FileFmt?: LogFormat
    ): LoggingFunction {
      return function (msg: any) {
        const canLog =
          currLogLvl >= logAt || (currLogLvl < 0 && currLogLvl === logAt)
        if (!canLog) return

        const t = new Date()
        if (ConsoleFmt)
          printConsole(ConsoleFmt(currLogLvl, logAt, modName, t, msg))
        if (FileFmt)
          writeLogs(modName, FileFmt(currLogLvl, logAt, modName, t, msg))
      }
    }

    /** Creates all functions at all logging levels with their corresponding Tapped counterparts.
     *
     * @param mod Mod name. This will be saved for each line.
     * @param logLvl Current logging level for the mod.
     * @param Console Console format.
     * @param File File format.
     * @returns An object with all functions.
     */
    export function CreateAll(
      mod: string,
      logLvl: Level,
      Console?: LogFormat,
      File?: LogFormat
    ) {
      const CLF = (logAt: Level) =>
        CreateFunction(logLvl, logAt, mod, Console, File)

      const O = CLF(Level.optimization)
      const N = CLF(Level.none)
      const E = CLF(Level.error)
      const I = CLF(Level.info)
      const V = CLF(Level.verbose)
      return {
        /** Log at special mode: optimization. */
        Optimization: O,
        /** Log at none level. Basically, ignore logging settings, except when using special modes. */
        None: N,
        /** Log at error level. */
        Error: E,
        /** Log at info level. */
        Info: I,
        /** Log at verbose level. */
        Verbose: V,
        /** Log at special mode: optimization. Return value. */
        TapO: Tap(O),
        /** Log at none level and return value. */
        TapN: Tap(N),
        /** Log at error level and return value. */
        TapE: Tap(E),
        /** Log at info level and return value. */
        TapI: Tap(I),
        /** Log at verbose level and return value. */
        TapV: Tap(V),
      }
    }

    /** Makes a logging function to log a value, then returns that value.
     *
     * @param f - The logging function.
     * @returns A {@link TappedFunction}.
     *
     * @remarks
     * This function is intended to be used to initialize variables while logging them,
     * so logging looks cleaner and variables become self documenting in code and
     * "debuggeable" at the same time.
     *
     * @example
     * const IntToHex = (x: number) => x.toString(16)
     * const LogAndInit = Tap(printConsole)
     *
     * // "Value for x: 3". Meanwhile: x === 3.
     * const x = LogAndInit("Value for x", 3)
     *
     * // "Hex: ff". Meanwhile: ff === 255
     * const ff = LogAndInit("Hex", 255, IntToHex)
     *
     * // Don't know what the next call will yield, but we can log it to console to see it!
     * const form = LogAndInit("Found form", Game.getFormFromFile(0x3bba, "Skyrim.esm"))
     */
    export function Tap(f: LoggingFunction): TappedFunction {
      return function <T>(msg: string, x: T, g?: (x: T) => string): T {
        if (g) {
          if (msg) f(`${msg}: ${g(x)}`)
          else f(g(x))
        } else {
          if (msg) f(`${msg}: ${x}`)
          else f(`${x}`)
        }
        return x
      }
    }

    /** Returns `x` while executing a logging function. `R` means _[R]eturn_.
     *
     * @remarks
     * This is useful for uncluttering logging calls when returning values from functions,
     * but can be used to log variable assignments as well.
     *
     * At first this may look like it's doing the same as {@link Tap}, but this function provides much
     * more flexibility at the cost of doing more writing.\
     * Both functions are useful and can be used together for great flexibilty.
     *
     * @param f A function that takes any number of arguments and returns `void`.
     * @param x The value to be returned.
     * @returns `x`
     *
     * @example
     * const Msg = (s: string) => { printConsole(`This is a ${s}`) }
     * const x = R(Msg("number"), 2)       // => "This is a number"; x === 2
     * const s = R(Msg("string"), "noob")  // => "This is a string"; s === "noob"
     */
    export const R = Combinators.Return

    /** Converts an integer to hexadecimal notation.
     *
     * @remarks
     * This function has apparently absurd safeguards because it's intended to be used for logging.\
     * If you want a straight forward conversion, just use `x.toString(16)`.
     *
     * @param x
     * @returns string
     */
    export function IntToHex(x: number) {
      return !x || typeof x !== "number"
        ? "IntToHex: Undefined value"
        : x.toString(16)
    }

    // ;> ======================
    // ;> ALTERNATE DECLARATIONS
    // ;> ======================

    /** Gets the logging level from some configuration file.
     *
     * @param pluginName Name of the plugin to get the value from.
     * @param optionName Name of the variable that carries the value.
     * @returns The logging level from file. `verbose` if value was invalid.
     */
    export const levelFromSettings = LevelFromSettings

    /** Gets a logging {@link Level} from either a string or a number.
     *
     * @param v The string or number to convert to a Level.
     * @returns A logging Level. `Level.verbose` if `v` can not be converted.
     */
    export const levelFromValue = LevelFromValue

    /** Returns a string in the form `"[Mod name]: Message"`.
     * @see {@link FileFmt}.
     *
     * @remarks
     * You can use this function as a guide on how a {@link LogFormat} function
     * used for {@link CreateFunction} can be made.
     *
     * @example
     * const LogI = CreateFunction(userLevel, Level.info, "my-mod", ConsoleFmt, FileFmt)
     * const LogV = CreateFunction(userLevel, Level.verbose, "my-mod", ConsoleFmt, FileFmt)
     *
     * // Console output: "[my-mod]: This is important for the player."
     * // File output: "[info] 4/5/2021 12:32:15 p.m.: This is important for the player."
     * LogI("This is important for the player.")
     *
     * // Console output: "[my-mod]: This is useful for debugging."
     * // File output: "[verbose] 4/5/2021 12:32:15 p.m.: This is useful for debugging."
     * LogV("This is useful for debugging.")
     */
    export const consoleFmt = ConsoleFmt

    /** Returns a string in the form `"[logging level] date-time: Message"`.
     * @see {@link ConsoleFmt}.
     *
     * @remarks
     * You can use this function as a guide on how a {@link LogFormat} function
     * used for {@link CreateFunction} can be made.
     *
     * Format for https://github.com/Scarfsail/AdvancedLogViewer :\
     *    `[{Type}] {Date} {Time}: {Message}`
     *
     * @example
     * const LogI = CreateFunction(userLevel, Level.info, "my-mod", ConsoleFmt, FileFmt)
     * const LogV = CreateFunction(userLevel, Level.verbose, "my-mod", ConsoleFmt, FileFmt)
     *
     * // Console output: "[my-mod]: This is important for the player."
     * // File output: "[info] 4/5/2021 12:32:15 p.m.: This is important for the player."
     * LogI("This is important for the player.")
     *
     * // Console output: "[my-mod]: This is useful for debugging."
     * // File output: "[verbose] 4/5/2021 12:32:15 p.m.: This is useful for debugging."
     * LogV("This is useful for debugging.")
     */
    export const fileFmt = FileFmt

    /** Creates a logging function that appends some message before logging.
     *
     * @param f Function to wrap.
     * @param append Message to append each time the result is called.
     * @returns A {@link LoggingFunction}.
     *
     * @example
     * const CMLL = Append(printConsole, "Kemonito: ")
     * CMLL("Kicks")       // => "Kemonito: Kicks"
     * CMLL("Flies!")      // => "Kemonito: Flies!"
     * CMLL("Is love")     // => "Kemonito: Is love"
     * CMLL("Is life")     // => "Kemonito: Is life"
     */
    export const append = Append

    /** Creates a logging function that appends some message before logging.
     *
     * @see {@link Append}
     *
     * @param f Function to wrap.
     * @param append Message to append each time the result is called.
     * @returns A {@link TappedFunction}.
     */
    export const appendT = AppendT

    /** Creates a function used for logging. Said function can log to either console or to some file.
     *
     * @see {@link FileFmt}, {@link ConsoleFmt}.
     *
     * @param currLogLvl The log level the user has selected. I.e. how much info they want to get.
     * @param logAt At which level this function will log.
     * @param modName Name of the mod. Will be used to output messages and to name the output file.
     * Output file will be named `"Data\Platform\Plugins\modName-logs.txt"`.
     * @param ConsoleFmt A function of type {@link LogFormat}. If `undefined`, nothing will be output to console.
     * @param FileFmt A function of type {@link LogFormat}. If `undefined`, nothing will be output to file.
     * @returns A function that logs a message as a string.
     *
     * @example
     * // LogI will only log to file
     * const LogI = CreateFunction(Level.info, Level.info, "my-mod", undefined, FileFmt)
     *
     * // LogV won't log anything because player only wants to log at most Level.info type messages
     * const LogV = CreateFunction(Level.info, Level.verbose, "my-mod", ConsoleFmt, FileFmt)
     */
    export const createFunction = CreateFunction

    /** Creates all functions at all logging levels with their corresponding Tapped counterparts.
     *
     * @param mod Mod name. This will be saved for each line.
     * @param logLvl Current logging level for the mod.
     * @param Console Console format.
     * @param File File format.
     * @returns An object with all functions.
     */
    export const createAll = CreateAll

    /** Makes a logging function to log a value, then returns that value.
     *
     * @param f - The logging function.
     * @returns A {@link TappedFunction}.
     *
     * @remarks
     * This function is intended to be used to initialize variables while logging them,
     * so logging looks cleaner and variables become self documenting in code and
     * "debuggeable" at the same time.
     *
     * @example
     * const IntToHex = (x: number) => x.toString(16)
     * const LogAndInit = Tap(printConsole)
     *
     * // "Value for x: 3". Meanwhile: x === 3.
     * const x = LogAndInit("Value for x", 3)
     *
     * // "Hex: ff". Meanwhile: ff === 255
     * const ff = LogAndInit("Hex", 255, IntToHex)
     *
     * // Don't know what the next call will yield, but we can log it to console to see it!
     * const form = LogAndInit("Found form", Game.getFormFromFile(0x3bba, "Skyrim.esm"))
     */
    export const tap = Tap

    /** Returns `x` while executing a logging function. `R` means _[R]eturn_.
     *
     * @remarks
     * This is useful for uncluttering logging calls when returning values from functions,
     * but can be used to log variable assignments as well.
     *
     * At first this may look like it's doing the same as {@link Tap}, but this function provides much
     * more flexibility at the cost of doing more writing.\
     * Both functions are useful and can be used together for great flexibilty.
     *
     * @param f A function that takes any number of arguments and returns `void`.
     * @param x The value to be returned.
     * @returns `x`
     *
     * @example
     * const Msg = (s: string) => { printConsole(`This is a ${s}`) }
     * const x = R(Msg("number"), 2)       // => "This is a number"; x === 2
     * const s = R(Msg("string"), "noob")  // => "This is a string"; s === "noob"
     */
    export const r = R

    /** Converts an integer to hexadecimal notation.
     *
     * @remarks
     * This function has apparently absurd safeguards because it's intended to be used for logging.\
     * If you want a straight forward conversion, just use `x.toString(16)`.
     *
     * @param x
     * @returns string
     */
    export const intToHex = IntToHex
  }

  /** @experimental
   * Doesn't work right now. Maybe I need to use promises and whatnot.
   *
   * Measures the time it takes a function to execute and logs that.
   *
   * @remarks
   * `Utility.getCurrentRealTime()` seems to be returning the same value for both
   * times the function starts and ends.\
   * I suspect this is because most functions in Skyrim Platform don't wait for the others to end.
   *
   * @param f - Function to measure.
   * @param Log - Function used for logging the time. You can supply a logging level-aware function.
   */
  export function Benchmark(
    f: () => void,
    Log: Log.LoggingFunction
  ): () => void {
    return () => {
      const t1 = Utility.getCurrentRealTime()
      Log(`${f.name} start time: ${t1}`)

      const ff = new Promise<number>((resolve, _) => {
        f()
        resolve(Utility.getCurrentRealTime())
      })

      ff.then((t2) => {
        Log(`${f.name} end time: ${t2}`)
        Log(`Execution time for ${f.name}: ${t2 - t1}`)
      })
    }
  }
}

/** Error managing */
export namespace ErrorLib {
  type ErrorWithMessage = {
    message: string
  }

  function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
    return (
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      typeof (error as Record<string, unknown>).message === "string"
    )
  }

  function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
    if (isErrorWithMessage(maybeError)) return maybeError

    try {
      return new Error(JSON.stringify(maybeError))
    } catch {
      // fallback in case there's an error stringifying the maybeError
      // like with circular references for example.
      return new Error(String(maybeError))
    }
  }

  /** Returns the string from an error.
   * @param error Error comming from a catch statement.
   * @returns Error string.
   * @example
   * ```
   * try {
   *   throw new Error('Oh no!')
   * } catch (error) {
   *   printConsole(getErrorMsg(error))
   * }
   * ```
   * @privateRemarks
   * Code got from
   * https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript
   */
  export function getErrorMsg(error: unknown) {
    return toErrorWithMessage(error).message
  }

  // ;> ======================
  // ;> ALTERNATE DECLARATIONS
  // ;> ======================

  /** Returns the string from an error.
   * @param error Error comming from a catch statement.
   * @returns Error string.
   * @example
   * ```
   * try {
   *   throw new Error('Oh no!')
   * } catch (error) {
   *   printConsole(getErrorMsg(error))
   * }
   * ```
   * @privateRemarks
   * Code got from
   * https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript
   */
  export const GetErrorMsg = getErrorMsg
}

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
   * 
   // * Notice how this function doesn't use ForEachEquippedSlotMask.
   // * That's because this function is used quite a lot in real time
   // * and it's better to help it be faster, even if it's only one bit.
   */
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

  /** Creates a function to get a `Form` at a later time.
   * @remarks
   * Form pointers expire in Skyrim Platform quite easily. This
   * function simplyfies the boring task of checking if a pointer
   * is valid anytime we want to use it.
   */
  export function preserveForm(frm: Form | null) {
    if (!frm) return () => null
    const id = frm.getFormID()
    return () => Game.getFormEx(id)
  }

  /** Creates a function to get an `Actor` at a later time.
   * @remarks
   * Form pointers expire in Skyrim Platform quite easily. This
   * function simplyfies the boring task of checking if a pointer
   * is valid anytime we want to use it.
   */
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
   * 
   // * This code was adapted from `GetFormIdentifier` in FileUtils.cpp
   // * in SKEE64 (RaceMenu dll); line 177.
   */
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

  // ;> ======================
  // ;> ALTERNATE DECLARATIONS
  // ;> ======================

  /** Returns what type of item a `Form` is.
   * @param  {Form|null} item Form to check.
   */
  export const getItemType = GetItemType

  /** Tries to do something on an `Actor` on each slot mask.
   * @param  {Actor|null} a Actor to work on.
   * @param  {(slot:number)=>void} DoSomething What to do on each slot mask.
   */
  export const forEachSlotMask = ForEachSlotMask

  /** Does something for each `Armor` an `Actor` has equipped.
   *
   * @param a Actor to check.
   * @param DoSomething What to do when an equipped armor is found.
   * 
   // * Notice how this function doesn't use ForEachEquippedSlotMask.
   // * That's because this function is used quite a lot in real time
   // * and it's better to help it be faster, even if it's only one bit.
   */
  export const forEachEquippedArmor = ForEachEquippedArmor

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
  export const getEquippedArmors = GetEquippedArmors

  /** Iterates over all keywords belonging to some `Form`, from last to first.
   *
   * @param o - The form to iterate over.
   * @param f - Function applied to each keyword.
   */
  export const forEachKeywordR = ForEachKeywordR

  /** Iterates over all items belonging to some `Outfit`, from last to first.
   *
   * @param o - The outfit to iterate over.
   * @param f - Function applied to each item.
   */
  export const forEachOutfitItemR = ForEachOutfitItemR

  /** Iterates over all forms of `formType` in some `cell`.
   *
   * @param cell Cell to search forms for.
   * @param formType {@link FormType}
   * @param f Function applied to each `Form`.
   */
  export const forEachFormInCell = ForEachFormInCell

  /** Returns wether an `ObjectReference` is an alchemy lab.
   * @param  {ObjectReference} furniture The furniture to check.
   *
   * @remarks
   * This function is intended to be used with `on("furnitureEnter")`
   * and `on("furnitureExit")` Skyrim Platform events.
   */
  export const isAlchemyLab = IsAlchemyLab

  /** Creates a function to get a `Form` at a later time.
   * @remarks
   * Form pointers expire in Skyrim Platform quite easily. This
   * function simplyfies the boring task of checking if a pointer
   * is valid anytime we want to use it.
   */
  export const PreserveForm = preserveForm

  /** Creates a function to get an `Actor` at a later time.
   * @remarks
   * Form pointers expire in Skyrim Platform quite easily. This
   * function simplyfies the boring task of checking if a pointer
   * is valid anytime we want to use it.
   */
  export const PreserveActor = preserveActor

  /** Returns the esp file, type and fixed formId for a `Form`.
   *
   * @param form `Form` to get data from.
   * @returns An object with all data.
   */
  export const GetEspAndId = getEspAndId

  /** Returns the relative `formId` of some `Form`.
   *
   * @param form The `Form` to get the relative `formId` from.
   * @param modType Does the `Form` belong to an esp or esl file?
   * @returns Fixed `formId`. `-1` if `form` or `modType` are invalid.
   */
  export const GetFixedFormId = getFixedFormId

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
  export const GetUniqueId = getUniqueId

  /** Gets the esp a form belongs to.
   *
   * @param form Form to get the esp from.
   * @returns Name and type of the esp file he form belongs to.
   * 
   // * This code was adapted from `GetFormIdentifier` in FileUtils.cpp
   // * in SKEE64 (RaceMenu dll); line 177.
   */
  export const GetFormEsp = getFormEsp

  /** Returns a string in the `PluginName|0xHexFormID` format.
   * @param  {string} espName
   * @param  {number} fixedFormId
   *
   * @remarks
   * This is used by default by {@link getUniqueId}.
   */
  export const DefaultUIdFmt = defaultUIdFmt

  /**
   * Iterates over all armors belonging to some `ObjectReference`, from last to first.
   *
   * @param o - The object reference to iterate over.
   * @param f - Function applied to each armor.
   */
  export const ForEachArmorR = forEachArmorR

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
  export const ForEachItemR = forEachItemR

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
  export const ForEachItem = forEachItem

  /**
   * Iterates over all items belonging to some `ObjectReference`, from last to first. Waits
   * some time before each operation.
   *
   * @param o - The object reference to iterate over.
   * @param wait - Time (seconds) to wait.
   * @param f - Function applied to each item.
   */
  export const ForEachItemW = forEachItemW

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
  export const CreatePersistentChest = createPersistentChest

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
  export const GetPersistentChest = getPersistentChest
}

/** Functions related to hotkeys. */
export namespace Hotkeys {
  /** Was copied from skyrimPlatform.ts because definitions in there are exported as a `const enum`,
   * thus making impossible to convert a string `DxScanCode` to number.
   *
   * With that setup it was impossible to make {@link FromSettings} to read scan codes as strings.
   */
  export enum DxScanCode {
    None,
    Escape,
    N1,
    N2,
    N3,
    N4,
    N5,
    N6,
    N7,
    N8,
    N9,
    N0,
    Minus,
    Equals,
    Backspace,
    Tab,
    Q,
    W,
    E,
    R,
    T,
    Y,
    U,
    I,
    O,
    P,
    LeftBracket,
    RightBracket,
    Enter,
    LeftControl,
    A,
    S,
    D,
    F,
    G,
    H,
    J,
    K,
    L,
    Semicolon,
    Apostrophe,
    Console,
    LeftShift,
    BackSlash,
    Z,
    X,
    C,
    V,
    B,
    N,
    M,
    Comma,
    Period,
    ForwardSlash,
    RightShift,
    NumMult,
    LeftAlt,
    Spacebar,
    CapsLock,
    F1,
    F2,
    F3,
    F4,
    F5,
    F6,
    F7,
    F8,
    F9,
    F10,
    NumLock,
    ScrollLock,
    Num7,
    Num8,
    Num9,
    NumMinus,
    Num4,
    Num5,
    Num6,
    NumPlus,
    Num1,
    Num2,
    Num3,
    Num0,
    NumDot,
    F11 = 87,
    F12,
    NumEnter = 156,
    RightControl,
    NumSlash = 181,
    SysRqPtrScr = 183,
    RightAlt,
    Pause = 197,
    Home = 199,
    UpArrow,
    PgUp,
    LeftArrow = 203,
    RightArrow = 205,
    End = 207,
    DownArrow,
    PgDown,
    Insert,
    Delete,
    LeftMouseButton = 256,
    RightMouseButton,
    MiddleMouseButton,
    MouseButton3,
    MouseButton4,
    MouseButton5,
    MouseButton6,
    MouseButton7,
    MouseWheelUp,
    MouseWheelDown,
  }

  export type KeyPressEvt = () => void
  export type KeyHoldEvt = (frames: number) => () => void

  /** A hotkey function that does nothing. */
  export const DoNothing: KeyPressEvt = () => {}

  /** A hotkey function that does nothing. */
  export const DoNothingOnHold: KeyHoldEvt = (_) => () => {}

  /** Creates a function that reads and logs a Hotkey at the same time.
   *
   * @param Log {@link DebugLib.Log.TappedFunction} used to log the hotkey.
   * @param Get A function that gets a hotkey by name.
   * @param appendStr Message to append before the hotkey name and data. `"Hotkey "` by default.
   * @returns A function that accepts a key name and returns a {@link Hotkey}.
   *
   * @example
   * const LH = DebugLib.Log.Tap(printConsole)
   * const GetHotkey = GetAndLog(LH, FromValue)
   *
   * ListenTo(GetHotkey("hk1")) // => "Hotkey hk1: Shift Enter" is printed to console
   */
  export function GetAndLog(
    log: DebugLib.Log.TappedFunction,
    Get: (k: string) => Hotkey,
    appendStr: string = "Hotkey "
  ) {
    const A = appendStr ? DebugLib.Log.AppendT(log, appendStr) : log
    return (k: string) => A(k, Get(k), ToString)
  }

  /** Gets a hotkey from some configuration file.
   *
   * @remarks
   * This function can read both numbers and strings defined in {@link DxScanCode}.
   *
   * @param pluginName Name of the plugin to get the value from.
   * @param optionName Name of the variable that carries the value.
   * @returns The hotkey. `DxScanCode.None` if invalid.
   */
  export const FromSettings = (pluginName: string, optionName: string) =>
    FromValue(settings[pluginName][optionName])

  /** Reads a hotkey from a Json object inside some settings file.
   * @example
   * ```json
   * // Settings file
   * {
   *   "hotkeys": {
   *     "hk1": "Shift Enter"
   *   }
   * }
   * ```
   * ```ts
   *
   * // Typescript
   * const hk = FromObject("plugin", "hotkeys", "hk1") // => Shift + Enter
   * ```
   * @param pluginName Name of the plugin to get the value from.
   * @param objectName Name of the parent object of the wanted key.
   * @param optionName Name of the variable that carries the value.
   * @returns The hotkey. `DxScanCode.None` if invalid.
   */
  export const FromObject = (
    pluginName: string,
    objectName: string,
    optionName: string
    // @ts-ignore
  ) => FromValue(settings[pluginName][objectName][optionName])

  /** Extracts modifiers from a string hotkey. */
  function ExtractHkAndModifiers(s: string) {
    if (!s) return { hk: "None", modifiers: undefined }
    let m: Modifiers | undefined = {}
    const Find = (sub: Modifier) => {
      if (s.indexOf(sub) > -1) {
        s = s.replace(sub, "").trim()
        return true
      } else return false
    }

    m.alt = Find("Alt")
    m.ctrl = Find("Ctrl")
    m.shift = Find("Shift")

    // Undefined if no modifiers were found
    m = !m.alt && !m.ctrl && !m.shift ? undefined : m

    return { hk: s, modifiers: m }
  }

  export type Modifier = "Alt" | "Ctrl" | "Shift"

  /** Returns wether a Modifier is pressed. */
  function IsModifierPressed(m: Modifier) {
    const l =
      m === "Alt"
        ? DxScanCode.LeftAlt
        : m === "Ctrl"
        ? DxScanCode.LeftControl
        : DxScanCode.LeftShift
    const r =
      m === "Alt"
        ? DxScanCode.RightAlt
        : m === "Ctrl"
        ? DxScanCode.RightControl
        : DxScanCode.RightShift
    return () => Input.isKeyPressed(l) || Input.isKeyPressed(r)
  }

  /** Is `Shift` pressed? */
  export const IsShiftPressed = IsModifierPressed("Shift")
  /** Is `Ctrl` pressed? */
  export const IsCtrlPressed = IsModifierPressed("Ctrl")
  /** Is `Alt` pressed? */
  export const IsAltPressed = IsModifierPressed("Alt")

  /** Converts either a `string` or `number` to a hotkey value.
   * @remarks
   * This function is best used in tandem with {@link ListenTo},
   * so that function can execute hotkeys like `"Ctrl Enter"`.
   */
  export function FromValue(l: any): Hotkey {
    let t: number | undefined = undefined
    let m: Modifiers | undefined = undefined

    if (typeof l === "string") {
      const { hk, modifiers } = ExtractHkAndModifiers(l)
      t = (<any>DxScanCode)[hk]
      m = modifiers
    } else if (typeof l === "number") t = l
    return t === undefined ? { hk: DxScanCode.None } : { hk: t, modifiers: m }
  }

  /** Converts a {@link Hotkey} to string.
   * @remarks Used for presenting info to players.
   */
  export function ToString(h: Hotkey) {
    const k = DxScanCode[h.hk]
    const s = h.modifiers?.shift ? "Shift + " : ""
    const c = h.modifiers?.ctrl ? "Ctrl + " : ""
    const a = h.modifiers?.alt ? "Alt + " : ""
    return c + s + a + k
  }

  /** Full hotkey structure. */
  export interface Hotkey {
    hk: DxScanCode
    modifiers?: Modifiers
  }

  /** Possible modifiers a hotkey function can have. */
  export interface Modifiers {
    shift?: boolean
    ctrl?: boolean
    alt?: boolean
  }

  /** Used to contain the function that checks for modifiers.
   * Made like this for optimization purposes.
   */
  namespace Modifiers {
    type TF = () => boolean
    const S = IsShiftPressed
    const A = IsAltPressed
    const C = IsCtrlPressed
    const T = (k: boolean | undefined, P: TF, f: TF) => {
      const p = P()
      if (k) {
        if (!p) return false // Key isn't pressed, but should
        return f() // Check if next sequence is pressed
      } else {
        if (p) return false // Key is pressed, but shouldn't
        return f() // Check if next sequence is pressed
      }
    }

    export function Continue(m: Modifiers) {
      const TC = () => T(m.ctrl, C, () => true)
      const TAC = () => T(m.alt, A, TC)
      const TSAC = () => T(m.shift, S, TAC)
      return TSAC()
    }
  }

  export type ListeningFunction = (
    OnPress?: KeyPressEvt,
    OnRelease?: KeyPressEvt,
    OnHold?: KeyHoldEvt
  ) => void

  /** Listen to {@link Hotkey}. */
  export const ListenTo = (hk: Hotkey, enable: boolean = true) =>
    ListenToS(hk.hk, enable, hk.modifiers)

  /** "ListenTo - Simple". Listens for some Hotkey press / release / hold.
   *
   * @see {@link https://www.creationkit.com/index.php?title=Input_Script#DXScanCodes | DXScanCodes}
   * for possible hotkey values.
   *
   * @remarks
   * Use functions generated by this function ***only inside an `'update'` event***.
   * But ***DON'T GENERATE functions INSIDE an `'update'` event***.
   *
   * This function is intended to be used for quick prototyping.\
   * For "production" code, use {@link ListenTo}.
   *
   * @param hk The hotkey to listen for.
   * @param enable If `false`, a blank function will be returned.\
   * Use this argument when you need to listen to hotkeys only when you know some condition
   * will be true. This will avoid wasting time doing checks that will never come true.
   *
   * @returns A function that accepts three callbacks:
   * 1. OnKeyPress
   * 1. OnKeyReleased
   * 1. OnKeyHold - This one gets how many frames has the key being held
   *
   * @example
   * const LogPress = () => { printConsole(`Key was pressed`) }
   *
   * const LogRelease = () => { printConsole(`Key was released`) }
   *
   * const LogHold: KeyHoldEvt = n => () => { printConsole(`Key has been held for ${n} frames.`) }
   *
   * const DoStuff = ListenTo(76)           // Listen to num5
   * const OnlyCareForHold = ListenTo(77)   // Listen to num6
   *
   * const specialModeEnabled = settings["mod"]["specialMode"]
   * const SpecialOperation = ListenTo(DxScanCode.F10, specialModeEnabled)
   *
   * on('update', () => {
   *   DoStuff(LogPress, LogRelease, LogHold)
   *   OnlyCareForHold(undefined, undefined, LogHold)
   *
   *   SpecialOperation(LogPress)
   *
   *   // Never generate functions inside an update event.
   *   // The following code won't work.
   *   const NonWorking = ListenTo(78)
   *   NonWorking(LogPress, undefined, LogHold)
   * })
   */
  export function ListenToS(
    hk: number,
    enable: boolean = true,
    modifiers?: Modifiers
  ): ListeningFunction {
    let old = false
    let frames = 0

    return enable && hk > DxScanCode.None
      ? (
          OnPress: KeyPressEvt = DoNothing,
          OnRelease: KeyPressEvt = DoNothing,
          OnHold: KeyHoldEvt = DoNothingOnHold
        ) => {
          if (modifiers && !Modifiers.Continue(modifiers)) return
          const p = Input.isKeyPressed(hk)

          if (old !== p) {
            frames = 0
            if (p) once("update", OnPress)
            else once("update", OnRelease)
          } else if (p) {
            frames++
            once("update", OnHold(frames))
          }

          old = p
        }
      : (
          OnPress: KeyPressEvt = DoNothing,
          OnRelease: KeyPressEvt = DoNothing,
          OnHold: KeyHoldEvt = DoNothingOnHold
        ) => {}
  }

  /** Not an useful function. Use it as a template. @see {@link ListenTo} */
  export const LogPress = () => {
    printConsole(`Key was pressed`)
  }

  /** Not an useful function. Use it as a template. @see {@link ListenTo} */
  export const LogRelease = () => {
    printConsole(`Key was released`)
  }

  /** Not an useful function. Use it as a template. @see {@link ListenTo} */
  export const LogHold: KeyHoldEvt = (n) => () => {
    printConsole(`Key has been held for ${n} frames.`)
  }

  // ;> ======================
  // ;> ALTERNATE DECLARATIONS
  // ;> ======================

  /** A hotkey function that does nothing. */
  export const doNothing = DoNothing

  /** A hotkey function that does nothing. */
  export const doNothingOnHold = DoNothingOnHold

  /** Creates a function that reads and logs a Hotkey at the same time.
   *
   * @param Log {@link DebugLib.Log.TappedFunction} used to log the hotkey.
   * @param Get A function that gets a hotkey by name.
   * @param appendStr Message to append before the hotkey name and data. `"Hotkey "` by default.
   * @returns A function that accepts a key name and returns a {@link Hotkey}.
   *
   * @example
   * const LH = DebugLib.Log.Tap(printConsole)
   * const GetHotkey = GetAndLog(LH, FromValue)
   *
   * ListenTo(GetHotkey("hk1")) // => "Hotkey hk1: Shift Enter" is printed to console
   */
  export const getAndLog = GetAndLog

  /** Gets a hotkey from some configuration file.
   *
   * @remarks
   * This function can read both numbers and strings defined in {@link DxScanCode}.
   *
   * @param pluginName Name of the plugin to get the value from.
   * @param optionName Name of the variable that carries the value.
   * @returns The hotkey. `DxScanCode.None` if invalid.
   */
  export const fromSettings = FromSettings

  /** Reads a hotkey from a Json object inside some settings file.
   * @example
   * ```json
   * // Settings file
   * {
   *   "hotkeys": {
   *     "hk1": "Shift Enter"
   *   }
   * }
   * ```
   * ```ts
   *
   * // Typescript
   * const hk = FromObject("plugin", "hotkeys", "hk1") // => Shift + Enter
   * ```
   * @param pluginName Name of the plugin to get the value from.
   * @param objectName Name of the parent object of the wanted key.
   * @param optionName Name of the variable that carries the value.
   * @returns The hotkey. `DxScanCode.None` if invalid.
   */
  export const fromObject = FromObject

  /** Is `Shift` pressed? */
  export const isShiftPressed = IsShiftPressed

  /** Is `Ctrl` pressed? */
  export const isCtrlPressed = IsCtrlPressed

  /** Is `Alt` pressed? */
  export const isAltPressed = IsAltPressed

  /** Converts either a `string` or `number` to a hotkey value.
   * @remarks
   * This function is best used in tandem with {@link ListenTo},
   * so that function can execute hotkeys like `"Ctrl Enter"`.
   */
  export const fromValue = FromValue

  /** Converts a {@link Hotkey} to string.
   * @remarks Used for presenting info to players.
   */
  export const toString = ToString

  /** Listen to {@link Hotkey}. */
  export const listenTo = ListenTo

  /** "ListenTo - Simple". Listens for some Hotkey press / release / hold.
   *
   * @see {@link https://www.creationkit.com/index.php?title=Input_Script#DXScanCodes | DXScanCodes}
   * for possible hotkey values.
   *
   * @remarks
   * Use functions generated by this function ***only inside an `'update'` event***.
   * But ***DON'T GENERATE functions INSIDE an `'update'` event***.
   *
   * This function is intended to be used for quick prototyping.\
   * For "production" code, use {@link ListenTo}.
   *
   * @param hk The hotkey to listen for.
   * @param enable If `false`, a blank function will be returned.\
   * Use this argument when you need to listen to hotkeys only when you know some condition
   * will be true. This will avoid wasting time doing checks that will never come true.
   *
   * @returns A function that accepts three callbacks:
   * 1. OnKeyPress
   * 1. OnKeyReleased
   * 1. OnKeyHold - This one gets how many frames has the key being held
   *
   * @example
   * const LogPress = () => { printConsole(`Key was pressed`) }
   *
   * const LogRelease = () => { printConsole(`Key was released`) }
   *
   * const LogHold: KeyHoldEvt = n => () => { printConsole(`Key has been held for ${n} frames.`) }
   *
   * const DoStuff = ListenTo(76)           // Listen to num5
   * const OnlyCareForHold = ListenTo(77)   // Listen to num6
   *
   * const specialModeEnabled = settings["mod"]["specialMode"]
   * const SpecialOperation = ListenTo(DxScanCode.F10, specialModeEnabled)
   *
   * on('update', () => {
   *   DoStuff(LogPress, LogRelease, LogHold)
   *   OnlyCareForHold(undefined, undefined, LogHold)
   *
   *   SpecialOperation(LogPress)
   *
   *   // Never generate functions inside an update event.
   *   // The following code won't work.
   *   const NonWorking = ListenTo(78)
   *   NonWorking(LogPress, undefined, LogHold)
   * })
   */
  export const listenToS = ListenToS

  /** Not an useful function. Use it as a template. @see {@link ListenTo} */
  export const logPress = LogPress

  /** Not an useful function. Use it as a template. @see {@link ListenTo} */
  export const logRelease = LogRelease

  /** Not an useful function. Use it as a template. @see {@link ListenTo} */
  export const logHold = LogHold
}

/** Functions dealing with locations. */
export namespace LocationLib {
  /** Checks if a location is of type "animal den". */
  export const isAnimalDen = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x130de, "Skyrim.esm")))

  /** Checks if a location is of type "bandit camp". */
  export const isBanditCamp = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x130df, "Skyrim.esm")))

  /** Checks if a location is of type "barracks". */
  export const isBarracks = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x1cd55, "Skyrim.esm")))

  /** Checks if a location is of type "castle". */
  export const isCastle = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x1cd57, "Skyrim.esm")))

  /** Checks if a location is of type "cemetery". */
  export const isCemetery = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x1cd58, "Skyrim.esm")))

  /** Checks if a location is of type "city". */
  export const isCity = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x13168, "Skyrim.esm")))

  /** Checks if a location is of type "clearable". */
  export const isClearable = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0xf5e80, "Skyrim.esm")))

  /** Checks if a location is of type "dragon lair". */
  export const isDragonLair = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x130e0, "Skyrim.esm")))

  /** Checks if a location is of type "dragon priest lair". */
  export const isDragonPriestLair = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x130e1, "Skyrim.esm")))

  /** Checks if a location is of type "draugr crypt". */
  export const isDraugrCrypt = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x130e2, "Skyrim.esm")))

  /** Checks if a location is of type "dungeon". */
  export const isDungeon = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x130db, "Skyrim.esm")))

  /** Checks if a location is of type "dwarven automatons". */
  export const isDwarvenAutomatons = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x130e3, "Skyrim.esm")))

  /** Checks if a location is of type "dwelling". */
  export const isDwelling = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x130dc, "Skyrim.esm")))

  /** Checks if a location is of type "falmer hive". */
  export const isFalmerHive = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x130e4, "Skyrim.esm")))

  /** Checks if a location is of type "farm". */
  export const isFarm = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x18ef0, "Skyrim.esm")))

  /** Checks if a location is of type "forsworn camp". */
  export const isForswornCamp = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x130ee, "Skyrim.esm")))

  /** Checks if a location is of type "giant camp". */
  export const isGiantCamp = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x130e5, "Skyrim.esm")))

  /** Checks if a location is of type "guild". */
  export const isGuild = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x1cd5a, "Skyrim.esm")))

  /** Checks if a location is of type "habitation". */
  export const isHabitation = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x39793, "Skyrim.esm")))

  /** Checks if a location is of type "habitation has inn". */
  export const isHabitationHasInn = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0xa6e84, "Skyrim.esm")))

  /** Checks if a location is of type "hagraven nest". */
  export const isHagravenNest = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x130e6, "Skyrim.esm")))

  /** Checks if a location is of type "hold". */
  export const isHold = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x16771, "Skyrim.esm")))

  /** Checks if a location is of type "hold capital". */
  export const isHoldCapital = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x868e2, "Skyrim.esm")))

  /** Checks if a location is of type "hold major". */
  export const isHoldMajor = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x868e1, "Skyrim.esm")))

  /** Checks if a location is of type "hold minor". */
  export const isHoldMinor = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x868e3, "Skyrim.esm")))

  /** Checks if a location is of type "house". */
  export const isHouse = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x1cb85, "Skyrim.esm")))

  /** Checks if a location is of type "inn". */
  export const isInn = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x1cb87, "Skyrim.esm")))

  /** Checks if a location is of type "jail". */
  export const isJail = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x1cd59, "Skyrim.esm")))

  /** Checks if a location is of type "lumber mill". */
  export const isLumberMill = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x18ef2, "Skyrim.esm")))

  /** Checks if a location is of type "military camp". */
  export const isMilitaryCamp = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x130e8, "Skyrim.esm")))

  /** Checks if a location is of type "military fort". */
  export const isMilitaryFort = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x130e7, "Skyrim.esm")))

  /** Checks if a location is of type "mine". */
  export const isMine = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x18ef1, "Skyrim.esm")))

  /** Checks if a location is of type "orc stronghold". */
  export const isOrcStronghold = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x130e9, "Skyrim.esm")))

  /** Checks if a location is of type "player house". */
  export const isPlayerHouse = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0xfc1a3, "Skyrim.esm")))

  /** Checks if a location is of type "settlement". */
  export const isSettlement = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x13167, "Skyrim.esm")))

  /** Checks if a location is of type "ship". */
  export const isShip = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x1cd5b, "Skyrim.esm")))

  /** Checks if a location is of type "shipwreck". */
  export const isShipwreck = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x1929f, "Skyrim.esm")))

  /** Checks if a location is of type "spriggan grove". */
  export const isSprigganGrove = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x130ea, "Skyrim.esm")))

  /** Checks if a location is of type "stewards dwelling". */
  export const isStewardsDwelling = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x504f9, "Skyrim.esm")))

  /** Checks if a location is of type "store". */
  export const isStore = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x1cb86, "Skyrim.esm")))

  /** Checks if a location is of type "temple". */
  export const isTemple = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x1cd56, "Skyrim.esm")))

  /** Checks if a location is of type "town". */
  export const isTown = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x13166, "Skyrim.esm")))

  /** Checks if a location is of type "vampire lair". */
  export const isVampireLair = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x130eb, "Skyrim.esm")))

  /** Checks if a location is of type "warlock lair". */
  export const isWarlockLair = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x130ec, "Skyrim.esm")))

  /** Checks if a location is of type "werewolf lair". */
  export const isWerewolfLair = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x130ed, "Skyrim.esm")))

  /** Checks if a location is of type "set cave". */
  export const isSetCave = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x130ef, "Skyrim.esm")))

  /** Checks if a location is of type "set cave ice". */
  export const isSetCaveIce = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x100819, "Skyrim.esm")))

  /** Checks if a location is of type "set dwarven ruin". */
  export const isSetDwarvenRuin = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x130f0, "Skyrim.esm")))

  /** Checks if a location is of type "set military camp". */
  export const isSetMilitaryCamp = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x1926a, "Skyrim.esm")))

  /** Checks if a location is of type "set military fort". */
  export const isSetMilitaryFort = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x130f1, "Skyrim.esm")))

  /** Checks if a location is of type "set nordic ruin". */
  export const isSetNordicRuin = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x130f2, "Skyrim.esm")))

  /** Checks if a location is of type "set outdoor". */
  export const isSetOutdoor = (l: Location) =>
    l.hasKeyword(Keyword.from(Game.getFormFromFile(0x130f3, "Skyrim.esm")))

  // ;> ======================
  // ;> ALTERNATE DECLARATIONS
  // ;> ======================

  /** Checks if a location is of type "animal den". */
  export const IsAnimalDen = isAnimalDen

  /** Checks if a location is of type "bandit camp". */
  export const IsBanditCamp = isBanditCamp

  /** Checks if a location is of type "barracks". */
  export const IsBarracks = isBarracks

  /** Checks if a location is of type "castle". */
  export const IsCastle = isCastle

  /** Checks if a location is of type "cemetery". */
  export const IsCemetery = isCemetery

  /** Checks if a location is of type "city". */
  export const IsCity = isCity

  /** Checks if a location is of type "clearable". */
  export const IsClearable = isClearable

  /** Checks if a location is of type "dragon lair". */
  export const IsDragonLair = isDragonLair

  /** Checks if a location is of type "dragon priest lair". */
  export const IsDragonPriestLair = isDragonPriestLair

  /** Checks if a location is of type "draugr crypt". */
  export const IsDraugrCrypt = isDraugrCrypt

  /** Checks if a location is of type "dungeon". */
  export const IsDungeon = isDungeon

  /** Checks if a location is of type "dwarven automatons". */
  export const IsDwarvenAutomatons = isDwarvenAutomatons

  /** Checks if a location is of type "dwelling". */
  export const IsDwelling = isDwelling

  /** Checks if a location is of type "falmer hive". */
  export const IsFalmerHive = isFalmerHive

  /** Checks if a location is of type "farm". */
  export const IsFarm = isFarm

  /** Checks if a location is of type "forsworn camp". */
  export const IsForswornCamp = isForswornCamp

  /** Checks if a location is of type "giant camp". */
  export const IsGiantCamp = isGiantCamp

  /** Checks if a location is of type "guild". */
  export const IsGuild = isGuild

  /** Checks if a location is of type "habitation". */
  export const IsHabitation = isHabitation

  /** Checks if a location is of type "habitation has inn". */
  export const IsHabitationHasInn = isHabitationHasInn

  /** Checks if a location is of type "hagraven nest". */
  export const IsHagravenNest = isHagravenNest

  /** Checks if a location is of type "hold". */
  export const IsHold = isHold

  /** Checks if a location is of type "hold capital". */
  export const IsHoldCapital = isHoldCapital

  /** Checks if a location is of type "hold major". */
  export const IsHoldMajor = isHoldMajor

  /** Checks if a location is of type "hold minor". */
  export const IsHoldMinor = isHoldMinor

  /** Checks if a location is of type "house". */
  export const IsHouse = isHouse

  /** Checks if a location is of type "inn". */
  export const IsInn = isInn

  /** Checks if a location is of type "jail". */
  export const IsJail = isJail

  /** Checks if a location is of type "lumber mill". */
  export const IsLumberMill = isLumberMill

  /** Checks if a location is of type "military camp". */
  export const IsMilitaryCamp = isMilitaryCamp

  /** Checks if a location is of type "military fort". */
  export const IsMilitaryFort = isMilitaryFort

  /** Checks if a location is of type "mine". */
  export const IsMine = isMine

  /** Checks if a location is of type "orc stronghold". */
  export const IsOrcStronghold = isOrcStronghold

  /** Checks if a location is of type "player house". */
  export const IsPlayerHouse = isPlayerHouse

  /** Checks if a location is of type "settlement". */
  export const IsSettlement = isSettlement

  /** Checks if a location is of type "ship". */
  export const IsShip = isShip

  /** Checks if a location is of type "shipwreck". */
  export const IsShipwreck = isShipwreck

  /** Checks if a location is of type "spriggan grove". */
  export const IsSprigganGrove = isSprigganGrove

  /** Checks if a location is of type "stewards dwelling". */
  export const IsStewardsDwelling = isStewardsDwelling

  /** Checks if a location is of type "store". */
  export const IsStore = isStore

  /** Checks if a location is of type "temple". */
  export const IsTemple = isTemple

  /** Checks if a location is of type "town". */
  export const IsTown = isTown

  /** Checks if a location is of type "vampire lair". */
  export const IsVampireLair = isVampireLair

  /** Checks if a location is of type "warlock lair". */
  export const IsWarlockLair = isWarlockLair

  /** Checks if a location is of type "werewolf lair". */
  export const IsWerewolfLair = isWerewolfLair

  /** Checks if a location is of type "set cave". */
  export const IsSetCave = isSetCave

  /** Checks if a location is of type "set cave ice". */
  export const IsSetCaveIce = isSetCaveIce

  /** Checks if a location is of type "set dwarven ruin". */
  export const IsSetDwarvenRuin = isSetDwarvenRuin

  /** Checks if a location is of type "set military camp". */
  export const IsSetMilitaryCamp = isSetMilitaryCamp

  /** Checks if a location is of type "set military fort". */
  export const IsSetMilitaryFort = isSetMilitaryFort

  /** Checks if a location is of type "set nordic ruin". */
  export const IsSetNordicRuin = isSetNordicRuin

  /** Checks if a location is of type "set outdoor". */
  export const IsSetOutdoor = isSetOutdoor
}

/** Functions related to maps. */
export namespace MapLib {
  /** Joins two maps, applying a function when keys collide.
   *
   * @param m1 First map.
   * @param m2 Second map.
   * @param OnExistingKey Function for solving collisions.
   * @returns
   */
  export function JoinMaps<K, V>(
    m1: Map<K, V>,
    m2: Map<K, V> | null | undefined,
    OnExistingKey: (v1: V, v2: V, k?: K) => V
  ) {
    if (!m2) return m1
    const o = new Map<K, V>(m1)
    m2.forEach((v2, k) => {
      if (o.has(k)) o.set(k, OnExistingKey(o.get(k) as V, v2, k))
      else o.set(k, v2)
    })
    return o
  }

  /** Joins two maps, applying a function when keys collide.
   *
   * @param m1 First map.
   * @param m2 Second map.
   * @param OnExistingKey Function for solving collisions.
   * @returns
   */
  export const Join = JoinMaps

  /** Converts a map into a tuple array.
   * @param m1 Map to convert.
   * @returns A tuple array in the form `[key, value]`.
   */
  export function mapToArray<K, V>(m1: Map<K, V>) {
    const r: [K, V][] = []
    for (const k of m1) r.push(k)
    return r
  }

  // ;> ======================
  // ;> ALTERNATE DECLARATIONS
  // ;> ======================

  /** Joins two maps, applying a function when keys collide.
   *
   * @param m1 First map.
   * @param m2 Second map.
   * @param OnExistingKey Function for solving collisions.
   * @returns
   */
  export const joinMaps = JoinMaps

  /** Joins two maps, applying a function when keys collide.
   *
   * @param m1 First map.
   * @param m2 Second map.
   * @param OnExistingKey Function for solving collisions.
   * @returns
   */
  export const join = Join

  /** Converts a map into a tuple array.
   * @param m1 Map to convert.
   * @returns A tuple array in the form `[key, value]`.
   */
  export const MapToArray = mapToArray
}

/** Math related functions. */
export namespace MathLib {
  /** Math related functions. */
  /** A point in 2D space. */
  export interface Point {
    x: number
    y: number
  }

  /** Creates a linear function adjusted to two points.
   *
   * @param p1 Initial point.
   * @param p2 Ending point.
   * @returns A linear function that accepts an `x` argument.
   *
   * @example
   * const f = LinCurve({ x: 24, y: 2 }, { x: 96, y: 16 })
   * f(24) // => 2
   * f(96) // => 16
   * f(0)  // => -2.6666666666667
   */
  export function LinCurve(p1: Point, p2: Point) {
    const x1 = p1.x
    const y1 = p1.y
    const m = (p2.y - y1) / (p2.x - x1)

    return (x: number) => m * (x - x1) + y1
  }

  /** Creates an exponential function that adjusts a curve of some `shape` to two points.
   *
   * @remarks
   * Some `shape` values, like `0`, may lead to linear functions instead of exponential ones.
   * For those cases, this function returns a {@link LinCurve}.
   *
   * @param shape
   * @param p1 Initial point.
   * @param p2 Ending point.
   * @returns An exponential function that accepets an `x` argument.
   *
   * @example
   * const f = ExpCurve(-2.3, { x: 0, y: 3 }, { x: 1, y: 0.5 })
   * f(0)       // => 3
   * f(0.1)     // => 2.4290958125478785
   * f(0.5)     // => 1.1012227076272225
   * f(0.9)     // => 0.572039991172326
   * f(1)       // => 0.5
   */
  export function ExpCurve(shape: number, p1: Point, p2: Point) {
    const e = Math.exp
    const b = shape
    const ebx1 = e(b * p1.x)
    const divisor = e(b * p2.x) - ebx1

    // Shape is actually a line, not an exponential curve.
    if (divisor === 0) return LinCurve(p1, p2)

    const a = (p2.y - p1.y) / divisor
    const c = p1.y - a * ebx1

    return (x: number) => a * e(b * x) + c
  }

  /** Creates a spline function given a list of points.
   *
   * @remarks
   * This function:
   *  - Was adapted from https://www.developpez.net/forums/d331608-3/general-developpement/algorithme-mathematiques/contribuez/image-interpolation-spline-cubique/#post3513925
   *  - Is not optimized for plotting charts. Will be slow when used in that context.
   *  - Acts like Photoshop curves. I.e. if the first and/or last point isn't at
   *    the edge of the valid range [`0`..`1`] it will consider outlier `y` values
   *    to be a straight line from the edge `points`.
   *
   * @param points Points used to create the spline.
   * `x` range ***MUST BE [`0`..`1`]***.
   * `points` ***MUST BE*** ordered by x.
   *
   * @returns A function that accepts a `x` (ranging at [`0`..`1`]) and evaluates the
   * spline value at that point.
   */
  export function CubicSpline(points: Point[]) {
    const n = points.length - 1

    // Avoid invalid number of points.
    if (n == -1) return (x: number) => 0
    if (n == 0) return (x: number) => points[0].y
    const sd = SecondDerivative(points)

    return (x: number) => {
      // Start as a flat line
      const p1 = points[0]
      if (p1.x > 0 && x <= p1.x) return p1.y

      // End as a flat line
      const pn = points[n]
      if (pn.x < 1 && x >= pn.x) return pn.y

      // Make sure the last point is always returned
      if (x === pn.x) return pn.y

      for (let i = 0; i < n; i++) {
        const cur = points[i]
        const next = points[i + 1]

        if (x >= cur.x && x < next.x) {
          const t = (x - cur.x) / (next.x - cur.x)

          const a = 1 - t
          const b = t
          const h = next.x - cur.x

          return (
            a * cur.y +
            b * next.y +
            ((h * h) / 6) *
              ((a * a * a - a) * sd[i] + (b * b * b - b) * sd[i + 1])
          )
        }
      }

      // Should never return this. Used for debugging purposes.
      return -999999
    }
  }

  /** Helper function for {@link CubicSpline}. Calculates f'' for a list of points. */
  function SecondDerivative(p: Point[]) {
    const n = p.length

    // build the tridiagonal system
    // (assume 0 boundary conditions: y2[0]=y2[-1]=0)
    let matrix: number[][] = Array.from({ length: n }, (_) => [0, 0, 0])
    let result = Array.from({ length: n }, (_) => 0)

    matrix[0][1] = 1
    for (let i = 1; i < n - 1; i++) {
      matrix[i][0] = (p[i].x - p[i - 1].x) / 6
      matrix[i][1] = (p[i + 1].x - p[i - 1].x) / 3
      matrix[i][2] = (p[i + 1].x - p[i].x) / 6
      result[i] =
        (p[i + 1].y - p[i].y) / (p[i + 1].x - p[i].x) -
        (p[i].y - p[i - 1].y) / (p[i].x - p[i - 1].x)
    }
    matrix[n - 1][1] = 1

    // solving pass1 (up->down)
    for (let i = 1; i < n; i++) {
      const k = matrix[i][0] / matrix[i - 1][1]
      matrix[i][1] -= k * matrix[i - 1][2]
      matrix[i][0] = 0
      result[i] -= k * result[i - 1]
    }

    // solving pass2 (down->up)
    for (let i = n - 2; i >= 0; i--) {
      const k = matrix[i][2] / matrix[i + 1][1]
      matrix[i][1] -= k * matrix[i + 1][0]
      matrix[i][2] = 0
      result[i] -= k * result[i + 1]
    }

    // return second derivative value for each point P
    let y2: number[] = new Array(n)
    for (let i = 0; i < n; i++) y2[i] = result[i] / matrix[i][1]
    return y2
  }

  /** Returns a function that ensures some value is at least `min`.
   *
   * @param min The minimum value a number can be.
   * @returns A function that accepts a number `x` and returns `x` or `min`.
   *
   * @example
   * const LowestHp = ForceMin(10)
   * LowestHp(-1)     // => 10
   * LowestHp(255)    // => 255
   */
  export const ForceMin = (min: number) => (x: number) => Math.max(min, x)

  /** Returns a function that ensures some value is at most `max`.
   *
   * @param max The maximum value a number can be.
   * @returns A function that accepts a number `x` and returns `x` or `max`.
   *
   * @example
   * let MaxSpeed = ForceMax(1.7)
   * MaxSpeed(2)     // => 1.7
   * MaxSpeed(1.7)   // => 1.7
   * MaxSpeed(0.5)   // => 0.5
   *
   * MaxSpeed = ForceMax(1)
   * MaxSpeed(1.1)   // => 1
   */
  export const ForceMax = (max: number) => (x: number) => Math.min(max, x)

  /** Returns a function that ensures some value is between the (inclusive) range [`min`..`max`].
   *
   * @param min The minimum value a number can be.
   * @param max The maximum value a number can be.
   * @returns A function that accepts a number `x` and makes sure it stays within `min` and `max`.
   *
   * @example
   * const itemCount = 42
   * let Take = ForceRange(0, itemCount)
   * Take(-100)     // => 0
   * Take(255)      // => 42
   * Take(3)        // => 3
   *
   * // Redefine Take function to reflect new data
   * Take = ForceRange(0, itemCount - Take(3))
   */
  export const ForceRange = (min: number, max: number) => (x: number) =>
    ForceMin(min)(ForceMax(max)(x))

  /** Ensures some value is always positive.
   *
   * @param x A number.
   * @returns `0` if `x` is negative, else `x`.
   *
   * @example
   * ForcePositive(-100)     // => 0
   * ForcePositive(255)      // => 255
   * ForcePositive(0)        // => 0
   */
  export const ForcePositive = (x: number) => ForceMin(0)(x)

  /** Ensures some value always stays within the (inclusive) range [`0`..`1`].
   *
   * @param x A number.
   * @returns A number between [`0`..`1`].
   *
   * @example
   * ForcePercent(-0.1)       // => 0
   * ForcePercent(10)         // => 1
   * ForcePercent(0.5)        // => 0.5
   */
  export const ForcePercent = (x: number) => ForceRange(0, 1)(x)

  /**
   * Returns whether a number in the [`min`, `max`] range.
   * @param x Value to check.
   * @param min Minimum value.
   * @param max Maximum value.
   * @returns A `bool`.
   */
  export const isInRange = (x: number, min: number, max: number) =>
    x >= min && x <= max

  /**
   * Returns a random number in the [`min`, `max`] range.
   * @param min Minimum value.
   * @param max Maximum value.
   * @returns A random number.
   */
  export const randomRange = (min: number, max: number) =>
    Math.random() * (max - min) + min

  // ;> ======================
  // ;> ALTERNATE DECLARATIONS
  // ;> ======================

  /** Creates a linear function adjusted to two points.
   *
   * @param p1 Initial point.
   * @param p2 Ending point.
   * @returns A linear function that accepts an `x` argument.
   *
   * @example
   * const f = LinCurve({ x: 24, y: 2 }, { x: 96, y: 16 })
   * f(24) // => 2
   * f(96) // => 16
   * f(0)  // => -2.6666666666667
   */
  export const linCurve = LinCurve

  /** Creates an exponential function that adjusts a curve of some `shape` to two points.
   *
   * @remarks
   * Some `shape` values, like `0`, may lead to linear functions instead of exponential ones.
   * For those cases, this function returns a {@link LinCurve}.
   *
   * @param shape
   * @param p1 Initial point.
   * @param p2 Ending point.
   * @returns An exponential function that accepets an `x` argument.
   *
   * @example
   * const f = ExpCurve(-2.3, { x: 0, y: 3 }, { x: 1, y: 0.5 })
   * f(0)       // => 3
   * f(0.1)     // => 2.4290958125478785
   * f(0.5)     // => 1.1012227076272225
   * f(0.9)     // => 0.572039991172326
   * f(1)       // => 0.5
   */
  export const expCurve = ExpCurve

  /** Creates a spline function given a list of points.
   *
   * @remarks
   * This function:
   *  - Was adapted from https://www.developpez.net/forums/d331608-3/general-developpement/algorithme-mathematiques/contribuez/image-interpolation-spline-cubique/#post3513925
   *  - Is not optimized for plotting charts. Will be slow when used in that context.
   *  - Acts like Photoshop curves. I.e. if the first and/or last point isn't at
   *    the edge of the valid range [`0`..`1`] it will consider outlier `y` values
   *    to be a straight line from the edge `points`.
   *
   * @param points Points used to create the spline.
   * `x` range ***MUST BE [`0`..`1`]***.
   * `points` ***MUST BE*** ordered by x.
   *
   * @returns A function that accepts a `x` (ranging at [`0`..`1`]) and evaluates the
   * spline value at that point.
   */
  export const cubicSpline = CubicSpline

  /** Returns a function that ensures some value is at least `min`.
   *
   * @param min The minimum value a number can be.
   * @returns A function that accepts a number `x` and returns `x` or `min`.
   *
   * @example
   * const LowestHp = ForceMin(10)
   * LowestHp(-1)     // => 10
   * LowestHp(255)    // => 255
   */
  export const forceMin = ForceMin

  /** Returns a function that ensures some value is at most `max`.
   *
   * @param max The maximum value a number can be.
   * @returns A function that accepts a number `x` and returns `x` or `max`.
   *
   * @example
   * let MaxSpeed = ForceMax(1.7)
   * MaxSpeed(2)     // => 1.7
   * MaxSpeed(1.7)   // => 1.7
   * MaxSpeed(0.5)   // => 0.5
   *
   * MaxSpeed = ForceMax(1)
   * MaxSpeed(1.1)   // => 1
   */
  export const forceMax = ForceMax

  /** Returns a function that ensures some value is between the (inclusive) range [`min`..`max`].
   *
   * @param min The minimum value a number can be.
   * @param max The maximum value a number can be.
   * @returns A function that accepts a number `x` and makes sure it stays within `min` and `max`.
   *
   * @example
   * const itemCount = 42
   * let Take = ForceRange(0, itemCount)
   * Take(-100)     // => 0
   * Take(255)      // => 42
   * Take(3)        // => 3
   *
   * // Redefine Take function to reflect new data
   * Take = ForceRange(0, itemCount - Take(3))
   */
  export const forceRange = ForceRange

  /** Ensures some value is always positive.
   *
   * @param x A number.
   * @returns `0` if `x` is negative, else `x`.
   *
   * @example
   * ForcePositive(-100)     // => 0
   * ForcePositive(255)      // => 255
   * ForcePositive(0)        // => 0
   */
  export const forcePositive = ForcePositive

  /** Ensures some value always stays within the (inclusive) range [`0`..`1`].
   *
   * @param x A number.
   * @returns A number between [`0`..`1`].
   *
   * @example
   * ForcePercent(-0.1)       // => 0
   * ForcePercent(10)         // => 1
   * ForcePercent(0.5)        // => 0.5
   */
  export const forcePercent = ForcePercent

  /**
   * Returns whether a number in the [`min`, `max`] range.
   * @param x Value to check.
   * @param min Minimum value.
   * @param max Maximum value.
   * @returns A `bool`.
   */
  export const IsInRange = isInRange

  /**
   * Returns a random number in the [`min`, `max`] range.
   * @param min Minimum value.
   * @param max Maximum value.
   * @returns A random number.
   */
  export const RandomRange = randomRange
}

/** Miscelaneous functions that don't belong to other categories. */
export namespace Misc {
  /** Avoids a function to be executed many times at the same time.
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
      const t = TimeLib.Now()
      if (lastExecuted === t) return
      lastExecuted = t
      f()
    }
  }

  /** Adapts a JContainers saving function so it can be used with {@link PreserveVar}.
   *
   * @param f Function to adapt.
   * @returns A function that accepts a key and a value.
   *
   * @example
   * const SaveFlt = JContainersToPreserving(JDB.solveFltSetter)
   * const SaveInt = JContainersToPreserving(JDB.solveIntSetter)
   */
  export function JContainersToPreserving<T>(
    f: (k: string, v: T, b?: boolean) => void
  ) {
    return (k: string, v: T) => {
      f(k, v, true)
    }
  }
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

  /** Saves a variable to both storage and wherever the `Store` function saves it.
   *
   * @remarks
   * The `storage` variable saves values across hot reloads, but not game sessions.
   *
   * At the time of creating this function, Skyrim Platform doesn't implement any
   * way of saving variables to the SKSE co-save, so values aren't preserved across
   * save game saves.
   *
   * This function lets us save variables using wrapped functions from either
   * **JContainers** or **PapyursUtil**.
   *
   * @param Store A function that saves a variable somewhere.
   * @param k `string` key to identify where the variable will be saved.
   * @returns A fuction that saves a value and returns it.
   *
   * @example
   * const SaveFlt = JContainersToPreserving(JDB.solveFltSetter)
   * const SaveInt = JContainersToPreserving(JDB.solveIntSetter)
   * const SFloat = PreserveVar(SaveFlt, "floatKey")
   * const SInt = PreserveVar(SaveInt, "intKey")
   *
   * // Use SFloat each time we want to make sure a value won't get lost when reloading the game.
   * let x = SFloat(10)   // => x === 10
   * x = SFloat(53.78)    // => x === 53.78
   */
  export function PreserveVar<T>(Store: (k: string, v: T) => void, k: string) {
    return (x: T) => {
      storage[k] = x
      Store(k, x)
      return x
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

  /** Generates a random unique identifier.
   * @returns A version 4 RFC 4122/DCE 1.1 UUID.
   */
  export function uuidV4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === "x" ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  /** Generates a random unique identifier.
   * @returns A version 4 RFC 4122/DCE 1.1 UUID.
   */
  export const guid = uuidV4

  /**
   * Waits some time, then does something.
   * @remark
   * This function was made to avoid all the clutter that requires to call an `async` function.
   *
   * @param time Time to wait (seconds).
   * @param DoSomething What to do after `time` has passed.
   */
  export function wait(time: number, DoSomething: () => void) {
    const F = async () => {
      await Utility.wait(time)
      DoSomething()
    }
    F()
  }

  /**
   * Tries to do something. Logs an error if an exception happens.
   * @param DoSomething Thing to do.
   * @param Logger Logger function.
   */
  export function tryE(DoSomething: () => void, Logger: (msg: string) => void) {
    try {
      DoSomething()
    } catch (error) {
      Logger(ErrorLib.getErrorMsg(error))
    }
  }

  // ;> ======================
  // ;> ALTERNATE DECLARATIONS
  // ;> ======================

  /** Avoids a function to be executed many times at the same time.
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
  export const avoidRapidFire = AvoidRapidFire

  /** Adapts a JContainers saving function so it can be used with {@link PreserveVar}.
   *
   * @param f Function to adapt.
   * @returns A function that accepts a key and a value.
   *
   * @example
   * const SaveFlt = JContainersToPreserving(JDB.solveFltSetter)
   * const SaveInt = JContainersToPreserving(JDB.solveIntSetter)
   */
  export const jContainersToPreserving = JContainersToPreserving

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
  export const papyrusUtilToPreserving = PapyrusUtilToPreserving

  /** Saves a variable to both storage and wherever the `Store` function saves it.
   *
   * @remarks
   * The `storage` variable saves values across hot reloads, but not game sessions.
   *
   * At the time of creating this function, Skyrim Platform doesn't implement any
   * way of saving variables to the SKSE co-save, so values aren't preserved across
   * save game saves.
   *
   * This function lets us save variables using wrapped functions from either
   * **JContainers** or **PapyursUtil**.
   *
   * @param Store A function that saves a variable somewhere.
   * @param k `string` key to identify where the variable will be saved.
   * @returns A fuction that saves a value and returns it.
   *
   * @example
   * const SaveFlt = JContainersToPreserving(JDB.solveFltSetter)
   * const SaveInt = JContainersToPreserving(JDB.solveIntSetter)
   * const SFloat = PreserveVar(SaveFlt, "floatKey")
   * const SInt = PreserveVar(SaveInt, "intKey")
   *
   * // Use SFloat each time we want to make sure a value won't get lost when reloading the game.
   * let x = SFloat(10)   // => x === 10
   * x = SFloat(53.78)    // => x === 53.78
   */
  export const preserveVar = PreserveVar

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
  export const updateEach = UpdateEach

  /** Generates a random unique identifier.
   * @returns A version 4 RFC 4122/DCE 1.1 UUID.
   */
  export const UuidV4 = uuidV4

  /** Generates a random unique identifier.
   * @returns A version 4 RFC 4122/DCE 1.1 UUID.
   */
  export const Guid = guid

  /**
   * Waits some time, then does something.
   * @remark
   * This function was made to avoid all the clutter that requires to call an `async` function.
   *
   * @param time Time to wait (seconds).
   * @param DoSomething What to do after `time` has passed.
   */
  export const Wait = wait

  /**
   * Tries to do something. Logs an error if an exception happens.
   * @param DoSomething Thing to do.
   * @param Logger Logger function.
   */
  export const TryE = tryE
}

/** Javascript Object helpers. */
export namespace ObjectLib {
  /** Iterates all entries in an object. */
  export function iterateEntries<T>(
    o: { [key: string]: T },
    action: (key: string, v: T) => void
  ) {
    for (const [k, v] of Object.entries(o)) action(k, v)
  }

  /** Returns the object entries as an array of tuple `[key, value]`. */
  export function entriesToArray<T>(o: { [key: string]: T }) {
    const r: [string, T][] = []
    iterateEntries(o, (k, v) => r.push([k, v]))
    return r
  }

  // ;> ======================
  // ;> ALTERNATE DECLARATIONS
  // ;> ======================

  /** Iterates all entries in an object. */
  export const IterateEntries = iterateEntries

  /** Returns the object entries as an array of tuple `[key, value]`. */
  export const EntriesToArray = entriesToArray
}

/** Javascript Set helpers. */
export namespace SetLib {
  /** Calculates the intersection of two sets.
   * @see
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
   */
  export function intersection<T>(setA: Set<T>, setB: Set<T>) {
    const _intersection = new Set<T>()
    for (const elem of setB) {
      if (setA.has(elem)) {
        _intersection.add(elem)
      }
    }
    return _intersection
  }
  // ;> ======================
  // ;> ALTERNATE DECLARATIONS
  // ;> ======================

  /** Calculates the intersection of two sets.
   * @see
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
   */
  export const Intersection = intersection
}

/** Time related functions. */
export namespace TimeLib {
  /** Ratio to convert Skyrim hours to human hours. */
  const gameHourRatio = 1.0 / 24.0

  /** Current time in {@link SkyrimHours}. */
  export const Now: () => SkyrimHours = Utility.getCurrentGameTime

  /** Hours as a fraction of a day; where 1.0 == 24 hours. */
  export type SkyrimHours = number

  /** Hours as humans use them; where 24 == 1.0 days. */
  export type HumanHours = number

  /** Minutes as humans use them; where `1 == 0.00069444` Skyrim days. */
  export type HumanMinutes = number

  /** Changes {@link SkyrimHours} to {@link HumanHours}.
   *
   * @param x Time in {@link SkyrimHours}.
   * @returns Time in human readable hours.
   *
   * @example
   * ToHumanHours(2.0)   // => 48. Two full days
   * ToHumanHours(0.5)   // => 12. Half a day
   */
  export const ToHumanHours = (x: SkyrimHours): HumanHours => x / gameHourRatio

  /** Converts a {@link SkyrimHours} to a `string` in {@link HumanHours}. */
  export const ToHumanHoursStr = (x: SkyrimHours) => ToHumanHours(x).toString()

  /** Converts a time in minutes to hours. */
  export const MinutesToHours = (x: number) => x / 60

  /** Converts a time in hours to minutes. */
  export const HoursToMinutes = (x: number) => x * 60

  /** Converts {@link HumanHours} to {@link SkyrimHours}.
   *
   * @param x Time in human readable hours.
   * @returns Time in {@link SkyrimHours}.
   *
   * @example
   * ToHumanHours(48)   // => 2.0. Two full days
   * ToHumanHours(12)   // => 0.5. Half a day
   */
  export const ToSkyrimHours = (x: HumanHours): SkyrimHours => x * gameHourRatio

  /** Returns in human hours how much time has passed between `Now` and some hour given
   * in {@link SkyrimHours}.
   * @param then {@link SkyrimHours}
   * @returns Hour span in {@link HumanHours}
   */
  export const HourSpan = (then: SkyrimHours): HumanHours =>
    ToHumanHours(Now() - then)

  /** Converts {@link HumanMinutes} to {@link SkyrimHours}.
   * @param  {number} x Minutes to convert.
   */
  export const MinutesToSkyrimHours = (x: HumanMinutes) =>
    ToSkyrimHours(MinutesToHours(x))

  /** Converts {@link SkyrimHours} to {@link HumanMinutes}.
   * @param  {number} x Minutes to convert.
   */
  export const SkyrimHoursToHumanMinutes = (x: SkyrimHours) =>
    HoursToMinutes(ToHumanHours(x))

  // ;> ======================
  // ;> ALTERNATE DECLARATIONS
  // ;> ======================

  /** Current time in {@link SkyrimHours}. */
  export const now = Now

  /** Changes {@link SkyrimHours} to {@link HumanHours}.
   *
   * @param x Time in {@link SkyrimHours}.
   * @returns Time in human readable hours.
   *
   * @example
   * ToHumanHours(2.0)   // => 48. Two full days
   * ToHumanHours(0.5)   // => 12. Half a day
   */
  export const toHumanHours = ToHumanHours

  /** Converts a {@link SkyrimHours} to a `string` in {@link HumanHours}. */
  export const toHumanHoursStr = ToHumanHoursStr

  /** Converts a time in minutes to hours. */
  export const minutesToHours = MinutesToHours

  /** Converts a time in hours to minutes. */
  export const hoursToMinutes = HoursToMinutes

  /** Converts {@link HumanHours} to {@link SkyrimHours}.
   *
   * @param x Time in human readable hours.
   * @returns Time in {@link SkyrimHours}.
   *
   * @example
   * ToHumanHours(48)   // => 2.0. Two full days
   * ToHumanHours(12)   // => 0.5. Half a day
   */
  export const toSkyrimHours = ToSkyrimHours

  /** Returns in human hours how much time has passed between `Now` and some hour given
   * in {@link SkyrimHours}.
   * @param then {@link SkyrimHours}
   * @returns Hour span in {@link HumanHours}
   */
  export const hourSpan = HourSpan

  /** Converts {@link HumanMinutes} to {@link SkyrimHours}.
   * @param  {number} x Minutes to convert.
   */
  export const minutesToSkyrimHours = MinutesToSkyrimHours

  /** Converts {@link SkyrimHours} to {@link HumanMinutes}.
   * @param  {number} x Minutes to convert.
   */
  export const skyrimHoursToHumanMinutes = SkyrimHoursToHumanMinutes
}

/** Deals with missing values.
 * @remarks
 * Static functions are performance oriented, while instance methods are pipe oriented.
 */
export class Maybe<T> {
  private readonly _value: T | null | undefined
  constructor(value: T | null | undefined) {
    this._value = value
  }

  get value() {
    return this._value
  }

  public static map<T, U>(value: T | null | undefined, mapper: (v: T) => U) {
    if (value === null) return null
    if (value === undefined) return undefined
    return mapper(value)
  }

  public map<U>(mapper: (v: T) => U | null | undefined): Maybe<U> {
    return new Maybe(Maybe.map(this._value, mapper))
  }

  public static mapNone<T, U>(value: T | null | undefined, none: U) {
    if (value === null || value === undefined) return none
    return value as T
  }

  public mapNone<U>(none: U) {
    return Maybe.mapNone(this._value, none)
  }

  public static noneToNull<T>(value: T | null | undefined) {
    if (value === null || value === undefined) return null
    return value as T
  }

  public noneToNull() {
    return Maybe.noneToNull(this._value)
  }

  get noneAsNull() {
    return this.noneToNull()
  }

  public static noneToUndefined<T>(value: T | null | undefined) {
    if (value === null || value === undefined) return undefined
    return value as T
  }

  public noneToUndefined() {
    return Maybe.noneToUndefined(this._value)
  }

  get noneAsUndefined() {
    return this.noneToUndefined()
  }
  public static isNone<T>(value: T | null | undefined) {
    return value === null || value === undefined
  }

  public isNone() {
    return Maybe.isNone(this._value)
  }

  public static hasValue<T>(value: T | null | undefined) {
    return value !== null && value !== undefined
  }

  public hasValue() {
    return Maybe.hasValue(this._value)
  }
}

/** Extend array */
declare global {
  interface Array<T> {
    iter(action: (i: T) => void): Array<T>
    // randomElement(): T
  }
}

Array.prototype.iter = function <T>(action: (i: T) => void) {
  for (const item of this) action(item)
  return this
}
