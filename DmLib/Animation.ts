import { hooks, once } from "skyrimPlatform"

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
  IdlePrayCrouchedEnter = "IdlePrayCrouchedEnter",
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
