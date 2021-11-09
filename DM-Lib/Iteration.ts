import { Cell, Form, ObjectReference, printConsole } from "../skyrimPlatform"

// Aliases for people preferring names starting in lowercase.
// These names are more in line with skyrymPlatform naming conventions.
export const forEachItemR = ForEachItemR
export const forEachFormInCell = ForEachFormInCell

/**
 * Iterates over all items belonging to some `ObjectReference`, from last to first.
 *
 * @param o - The object reference to iterate over.
 * @param f - Function applied to each item.
 */
export function ForEachItemR(
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
 * Values were taken from.
 * {@link https://www.creationkit.com/index.php?title=GetType_-_Form}
 */
export const enum FormType {
  ANIO = 83,
  ARMA = 102,
  AcousticSpace = 16,
  Action = 6,
  Activator = 24,
  ActorValueInfo = 95,
  AddonNode = 94,
  Ammo = 42,
  Apparatus = 33,
  Armor = 26,
  ArrowProjectile = 64,
  Art = 125,
  AssociationType = 123,
  BarrierProjectile = 69,
  BeamProjectile = 66,
  BodyPartData = 93,
  Book = 27,
  CameraPath = 97,
  CameraShot = 96,
  Cell = 60,
  Character = 62,
  Class = 10,
  Climate = 55,
  CollisionLayer = 132,
  ColorForm = 133,
  CombatStyle = 80,
  ConeProjectile = 68,
  ConstructibleObject = 49,
  Container = 28,
  DLVW = 117,
  Debris = 88,
  DefaultObject = 107,
  DialogueBranch = 115,
  Door = 29,
  DualCastData = 129,
  EffectSetting = 18,
  EffectShader = 85,
  Enchantment = 21,
  EncounterZone = 103,
  EquipSlot = 120,
  Explosion = 87,
  Eyes = 13,
  Faction = 11,
  FlameProjectile = 67,
  Flora = 39,
  Footstep = 110,
  FootstepSet = 111,
  Furniture = 40,
  GMST = 3,
  Global = 9,
  Grass = 37,
  GrenadeProjectile = 65,
  Group = 2,
  Hazard = 51,
  HeadPart = 12,
  Idle = 78,
  IdleMarker = 47,
  ImageSpace = 89,
  ImageSpaceModifier = 90,
  ImpactData = 100,
  ImpactDataSet = 101,
  Ingredient = 30,
  Key = 45,
  Keyword = 4,
  Land = 72,
  LandTexture = 20,
  LeveledCharacter = 44,
  LeveledItem = 53,
  LeveledSpell = 82,
  Light = 31,
  LightingTemplate = 108,
  List = 91,
  LoadScreen = 81,
  Location = 104,
  LocationRef = 5,
  Material = 126,
  MaterialType = 99,
  MenuIcon = 8,
  Message = 105,
  Misc = 32,
  MissileProjectile = 63,
  MovableStatic = 36,
  MovementType = 127,
  MusicTrack = 116,
  MusicType = 109,
  NAVI = 59,
  NPC = 43,
  NavMesh = 73,
  None = 0,
  Note = 48,
  Outfit = 124,
  PHZD = 70,
  Package = 79,
  Perk = 92,
  Potion = 46,
  Projectile = 50,
  Quest = 77,
  Race = 14,
  Ragdoll = 106,
  Reference = 61,
  ReferenceEffect = 57,
  Region = 58,
  Relationship = 121,
  ReverbParam = 134,
  Scene = 122,
  Script = 19,
  ScrollItem = 23,
  ShaderParticleGeometryData = 56,
  Shout = 119,
  Skill = 17,
  SoulGem = 52,
  Sound = 15,
  SoundCategory = 130,
  SoundDescriptor = 128,
  SoundOutput = 131,
  Spell = 22,
  Static = 34,
  StaticCollection = 35,
  StoryBranchNode = 112,
  StoryEventNode = 114,
  StoryQuestNode = 113,
  TES4 = 1,
  TLOD = 74,
  TOFT = 86,
  TalkingActivator = 25,
  TextureSet = 7,
  Topic = 75,
  TopicInfo = 76,
  Tree = 38,
  VoiceType = 98,
  Water = 84,
  Weapon = 41,
  Weather = 54,
  WordOfPower = 118,
  WorldSpace = 71,
}

/**
 * Iterates over all forms of `formType` in some `cell`.
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
