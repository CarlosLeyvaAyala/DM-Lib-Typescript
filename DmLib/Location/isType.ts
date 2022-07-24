import { Game, Keyword, Location } from "skyrimPlatform"

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
