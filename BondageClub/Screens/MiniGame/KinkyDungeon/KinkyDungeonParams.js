"use strict";
let KinkyDungeonMapParams = [

	{//DungeonName0,-Graveyard-
		"background" : "RainyForstPathNight",
		"openness" : 3, // Openness of rooms
		"density" : 3, // Density of tunnels (inverse of room spawn chance)
		"doodadchance" : 0.16,
		"barchance" : 0.2,
		"brightness" : 8,
		"chestcount" : 3,
		"shrinecount" : 8,
		"shrinechance" : 0.75,
		"ghostchance" : 1,
		"doorchance" : 0.67,
		"nodoorchance" : 0.1,
		"doorlockchance" : -0.1,
		"trapchance" : 0.5,
		"grateChance" : 0.4,
		"rubblechance" : 0.7,
		"brickchance" : 0.1,
		"cacheInterval" : 3,
		"forbiddenChance" : 0.35, // If a forbidden gold chance is generated. Otherwise a silver chest will appear
		"forbiddenGreaterChance" : 0.33, // Chance after a forbidden area is generated with a restraint, otherwise its a lesser gold chest

		"shortcuts": [
			{Level: 1, checkpoint: 11, chance: 0.5},
			{Level: 3, checkpoint: 11, chance: 1.0},
		],
		"mainpath": [
			{Level: 5, checkpoint: 1},
		],

		"traps": [
			{Name: "CustomSleepDart", Level: 0, Power: 1, Weight: 30},
			{Name: "SpecificSpell", Spell: "TrapCharmWeak", Level: 0, Power: 1, Weight: 30},
			{Name: "SpecificSpell", Spell: "TrapRopeWeak", Level: 0, Power: 3, Weight: 30},
			{Name: "SpecificSpell", Spell: "TrapLeatherWeak", Level: 0, Power: 3, Weight: 30},
			{Name: "SpecificSpell", Spell: "TrapLustCloud", Level: 0, Power: 3, Weight: 30},
			{Name: "SpawnEnemies", Enemy: "SummonedSkeleton", strict: true, Level: 0, Power: 4, Weight: 10},
			{Name: "SpawnEnemies", Enemy: "Bandit", strict: true, Level: 0, Power: 1, Weight: 10},
		],

		"min_width" : 25,
		"max_width" : 31,
		"min_height" : 13,
		"max_height" : 19,

		"enemytags": ["zombie"],
		"defeat_restraints": [
			{Name: "Stuffing", Level: 20},
			{Name: "TrapGag", Level: 20},
			{Name: "HighsecBallGag", Level: 50},
			{Name: "DragonMuzzleGag", Level: 100},
			{Name: "FeetShackles", Level: 5},
			{Name: "HighsecShackles", Level: 40},
			{Name: "LegShackles", Level: 15},
			{Name: "HighsecLegbinder", Level: 25},
			{Name: "WristShackles", Level: 0},
			{Name: "TrapArmbinder", Level: 40},
			{Name: "HighsecArmbinder", Level: 70},
			{Name: "PrisonBelt", Level: 30},
			{Name: "PrisonVibe", Level: 30},
			{Name: "TrapBlindfold", Level: 90},
			{Name: "TrapBoots", Level: 60},
		],
		"defeat_outfit": "Prisoner",
		"shrines": [
			//{Type: "Charms", Weight: 5},
			{Type: "Latex", Weight: 3},
			{Type: "Commerce", Weight: 14},
			{Type: "Elements", Weight: 5},
			{Type: "Conjure", Weight: 5},
			{Type: "Illusion", Weight: 5},
			{Type: "Leather", Weight: 5},
			{Type: "Metal", Weight: 3},
			{Type: "Rope", Weight: 2},
			{Type: "Will", Weight: 7},]

	},

	{// DungeonName1,-Catacombs-
		"background" : "Dungeon",
		"openness" : 0,
		"density" : 2,
		"doodadchance" : 0.11,
		"barchance" : 0.2,
		"brightness" : 6,
		"chestcount" : 4,
		"shrinecount" : 10,
		"shrinechance" : 0.6,
		"ghostchance" : 0.5,
		"doorchance" : 0.8,
		"nodoorchance" : 0.05,
		"doorlockchance" : -0.05,
		"trapchance" : 0.65,
		"grateChance" : 0.1,
		"rubblechance" : 0.6,
		"brickchance" : 0.4,
		"cacheInterval" : 3,
		"forbiddenChance" : 0.4,
		"forbiddenGreaterChance" : 0.33,

		"shortcuts": [
			{Level: 6, checkpoint: 12, chance: 0.5},
			{Level: 7, checkpoint: 12, chance: 1.0},
			{Level: 8, checkpoint: 12, chance: 0.25},
			{Level: 9, checkpoint: 12, chance: 0.25},
			{Level: 10, checkpoint: 12, chance: 1.0},
		],
		"mainpath": [
			{Level: 11, checkpoint: 2},
		],

		"traps": [
			{Name: "CustomSleepDart", Level: 0, Power: 1, Weight: 30},
			{Name: "SpecificSpell", Spell: "TrapCharmWeak", Level: 0, Power: 1, Weight: 30},
			{Name: "SpecificSpell", Spell: "TrapShackleWeak", Level: 0, Power: 1, Weight: 30},
			{Name: "SpecificSpell", Spell: "TrapRopeWeak", Level: 0, Power: 3, Weight: 30},
			{Name: "SpecificSpell", Spell: "TrapLeatherWeak", Level: 0, Power: 3, Weight: 30},
			{Name: "SpecificSpell", Spell: "TrapLustCloud", Level: 0, Power: 3, Weight: 30},
			{Name: "SpawnEnemies", Enemy: "SummonedSkeleton", strict: true, Level: 0, Power: 4, Weight: 10},
			{Name: "SpawnEnemies", Enemy: "Bandit", strict: true, Level: 0, Power: 2, Weight: 10},
		],

		"min_width" : 21,
		"max_width" : 27,
		"min_height" : 13,
		"max_height" : 17,

		"enemytags": ["skeleton"],
		"defeat_restraints": [
			{Name: "Stuffing", Level: 20},
			{Name: "TrapGag", Level: 20},
			{Name: "HighsecBallGag", Level: 50},
			{Name: "DragonMuzzleGag", Level: 100},
			{Name: "FeetShackles", Level: 5},
			{Name: "HighsecShackles", Level: 40},
			{Name: "LegShackles", Level: 15},
			{Name: "HighsecLegbinder", Level: 25},
			{Name: "WristShackles", Level: 0},
			{Name: "TrapArmbinder", Level: 40},
			{Name: "HighsecArmbinder", Level: 70},
			{Name: "PrisonBelt", Level: 30},
			{Name: "PrisonVibe", Level: 30},
			{Name: "TrapBlindfold", Level: 90},
			{Name: "TrapBoots", Level: 60},
		],
		"defeat_outfit": "Dungeon",
		"shrines": [
			{Type: "Latex", Weight: 3},
			{Type: "Commerce", Weight: 14},
			{Type: "Elements", Weight: 5},
			{Type: "Conjure", Weight: 5},
			{Type: "Illusion", Weight: 5},
			{Type: "Leather", Weight: 5},
			{Type: "Metal", Weight: 3},
			{Type: "Rope", Weight: 2},
			{Type: "Will", Weight: 7},]

	},

	{//DungeonName2,-Underground Jungle-
		"background" : "DeepForest",
		"openness" : 6,
		"density" : 5,
		"doodadchance" : 0.12,
		"barchance" : 0.05,
		"brightness" : 8,
		"chestcount" : 5,
		"shrinecount" : 10,
		"shrinechance" : 0.4,
		"ghostchance" : 0.5,
		"doorchance" : 0.2,
		"nodoorchance" : 0.7,
		"doorlockchance" : -0.05,
		"trapchance" : 0.4,
		"grateChance" : 0.1,
		"rubblechance" : 0.5,
		"brickchance" : 0.25,
		"cacheInterval" : 3,
		"forbiddenChance" : 0.4,
		"forbiddenGreaterChance" : 0.33,

		"shortcuts": [
			{Level: 13, checkpoint: 13, chance: 1.0},
			{Level: 15, checkpoint: 13, chance: 1.0},
		],
		"mainpath": [
			{Level: 17, checkpoint: 3},
		],

		"traps": [
			{Name: "CustomVine", Level: 0, Power: 1, Weight: 30},
			{Name: "CustomSleepDart", Level: 0, Power: 1, Weight: 10},
			{Name: "SpecificSpell", Spell: "TrapSlimeWeak", Level: 0, Power: 3, Weight: 30},
			{Name: "SpecificSpell", Spell: "TrapRopeWeak", Level: 0, Power: 3, Weight: 10},
			{Name: "SpecificSpell", Spell: "TrapLeatherWeak", Level: 0, Power: 3, Weight: 10},
			{Name: "SpecificSpell", Spell: "TrapLustCloud", Level: 0, Power: 3, Weight: 30},
			{Name: "SpawnEnemies", Enemy: "Bandit", strict: true, Level: 0, Power: 3, Weight: 10},
		],

		"min_width" : 29,
		"max_width" : 39,
		"min_height" : 13,
		"max_height" : 17,

		"enemytags": ["plant"],
		"defeat_restraints": [
			{Name: "Stuffing", Level: 20},
			{Name: "TrapGag", Level: 20},
			{Name: "HighsecBallGag", Level: 50},
			{Name: "DragonMuzzleGag", Level: 100},
			{Name: "FeetShackles", Level: 5},
			{Name: "HighsecShackles", Level: 40},
			{Name: "LegShackles", Level: 15},
			{Name: "HighsecLegbinder", Level: 25},
			{Name: "WristShackles", Level: 0},
			{Name: "TrapArmbinder", Level: 40},
			{Name: "HighsecArmbinder", Level: 70},
			{Name: "PrisonBelt", Level: 30},
			{Name: "PrisonVibe", Level: 30},
			{Name: "TrapBlindfold", Level: 90},
			{Name: "TrapBoots", Level: 60},
		],
		"defeat_outfit": "LatexPrisoner",
		"shrines": [
			{Type: "Latex", Weight: 5},
			{Type: "Commerce", Weight: 14},
			{Type: "Elements", Weight: 5},
			{Type: "Conjure", Weight: 5},
			{Type: "Illusion", Weight: 5},
			{Type: "Leather", Weight: 5},
			{Type: "Metal", Weight: 3},
			{Type: "Rope", Weight: 5},
			{Type: "Will", Weight: 5},]
	},
	{//DungeonName3,-Lost Temple-
		"background" : "SpookyForest",
		"openness" : 2,
		"density" : 0,
		"doodadchance" : 0.13,
		"barchance" : 0.1,
		"brightness" : 5,
		"chestcount" : 4,
		"shrinecount" : 8,
		"shrinechance" : 0.5,
		"ghostchance" : 0.5,
		"doorchance" : 0.9,
		"nodoorchance" : 0.25,
		"doorlockchance" : -0.05,
		"trapchance" : 0.5,
		"rubblechance" : 0.7,
		"brickchance" : 0.1,
		"floodchance" : 0.33,
		"gaschance" : 0.5, // Chance for gas to appear on the level
		"gasdensity" : 0.1, // Chance for a passage to be filled with happy gas
		"gastype" : ']', // Gas type
		"cacheInterval" : 3,
		"forbiddenChance" : 0.5,
		"forbiddenGreaterChance" : 0.4,

		"shortcuts": [

		],
		"mainpath": [
			{Level: 23, checkpoint: 3},
		],

		"traps": [
			{Name: "CustomSleepDart", Level: 0, Power: 1, Weight: 20},
			{Name: "SpecificSpell", Spell: "TrapSlimeWeak", Level: 0, Power: 3, Weight: 30},
			{Name: "SpecificSpell", Spell: "TrapRopeWeak", Level: 0, Power: 3, Weight: 10},
			{Name: "SpecificSpell", Spell: "TrapShackleWeak", Level: 0, Power: 3, Weight: 10},
			{Name: "SpecificSpell", Spell: "TrapLustCloud", Level: 0, Power: 3, Weight: 30},
			{Name: "SpawnEnemies", Enemy: "GreaterSkeleton", strict: true, Level: 0, Power: 3, Weight: 10},
			{Name: "SpawnEnemies", Enemy: "HeavySkeleton", strict: true, Level: 0, Power: 1, Weight: 10},
		],

		"min_width" : 29,
		"max_width" : 39,
		"min_height" : 13,
		"max_height" : 17,

		"enemytags": ["skeleton", "temple", "ghost"],
		"defeat_restraints": [
			{Name: "Stuffing", Level: 20},
			{Name: "TrapGag", Level: 20},
			{Name: "HighsecBallGag", Level: 50},
			{Name: "DragonMuzzleGag", Level: 100},
			{Name: "FeetShackles", Level: 5},
			{Name: "HighsecShackles", Level: 40},
			{Name: "LegShackles", Level: 15},
			{Name: "HighsecLegbinder", Level: 25},
			{Name: "WristShackles", Level: 0},
			{Name: "TrapArmbinder", Level: 40},
			{Name: "HighsecArmbinder", Level: 70},
			{Name: "PrisonBelt", Level: 30},
			{Name: "PrisonVibe", Level: 30},
			{Name: "TrapBlindfold", Level: 90},
			{Name: "TrapBoots", Level: 60},
		],
		"defeat_outfit": "LatexPrisoner",
		"shrines": [
			{Type: "Latex", Weight: 5},
			{Type: "Commerce", Weight: 12},
			{Type: "Elements", Weight: 5},
			{Type: "Conjure", Weight: 5},
			{Type: "Illusion", Weight: 5},
			{Type: "Leather", Weight: 3},
			{Type: "Metal", Weight: 5},
			{Type: "Rope", Weight: 3},
			{Type: "Will", Weight: 7},],

		"lockmult" : 1.5,
	},
	{//DungeonName4,-Fungal Caverns-
		"openness" : 4,
		"density" : 4,
		"doodadchance" : 0.15,
		"barchance" : 0.15,
		"brightness" : 7,
		"chestcount" : 5,
		"shrinecount" : 10,
		"shrinechance" : 0.8,
		"ghostchance" : 0.5,
		"doorchance" : 0.05,
		"nodoorchance" : 0.5,
		"doorlockchance" : -0.05,
		"trapchance" : 0.5,
		"grateChance" : 0.7,
		"rubblechance" : 0.9,
		"brickchance" : 0.2,

		"traps": [
			{Name: "SpawnEnemies", strict: true, Enemy: "SummonedSkeleton", Level: 0, Power: 4, Weight: 100},
		],

		"min_width" : 15,
		"max_width" : 25,
		"min_height" : 15,
		"max_height" : 25,
	},
	{//DungeonName5,-The Bellows-
		"openness" : 1,
		"density" : 1,
		"doodadchance" : 0.05,
		"barchance" : 0.03,
		"brightness" : 8,
		"chestcount" : 6,
		"shrinecount" : 8,
		"shrinechance" : 0.75,
		"ghostchance" : 0.5,
		"doorchance" : 0.67,
		"nodoorchance" : 0.1,
		"doorlockchance" : -0.05,
		"trapchance" : 0.5,
		"grateChance" : 0.7,
		"rubblechance" : 0.7,
		"brickchance" : 0.3,

		"traps": [
			{Name: "SpawnEnemies", strict: true, Enemy: "SummonedSkeleton", Level: 0, Power: 4, Weight: 100},
		],

		"min_width" : 25,
		"max_width" : 51,
		"min_height" : 13,
		"max_height" : 15,

		"lockmult" : 2.0,
	},
	{//DungeonName6,-Underground Desert-
		"openness" : 4,
		"density" : 2,
		"doodadchance" : 0.13,
		"barchance" : 0.03,
		"brightness" : 5,
		"chestcount" : 4,
		"shrinecount" : 12,
		"shrinechance" : 0.5,
		"ghostchance" : 0.5,
		"doorchance" : 0.0,
		"nodoorchance" : 0.3,
		"doorlockchance" : -0.05,
		"trapchance" : 0.5,
		"grateChance" : 0.7,
		"rubblechance" : 0.3,
		"brickchance" : 0.3,

		"traps": [
			{Name: "SpawnEnemies", strict: true, Enemy: "SummonedSkeleton", Level: 0, Power: 4, Weight: 100},
		],

		"min_width" : 25,
		"max_width" : 31,
		"min_height" : 17,
		"max_height" : 25,
	},
	{//DungeonName7,-Kingdom of Ice-
		"openness" : 2,
		"density" : 1,
		"doodadchance" : 0.12,
		"barchance" : 0.03,
		"brightness" : 4,
		"chestcount" : 4,
		"shrinecount" : 10,
		"shrinechance" : 0.8,
		"ghostchance" : 0.5,
		"doorchance" : 0.8,
		"trapchance" : 0.5,
		"grateChance" : 0.7,
		"nodoorchance" : 0.2,
		"rubblechance" : 0.5,
		"brickchance" : 0.7,

		"traps": [
			{Name: "SpawnEnemies", strict: true, Enemy: "SummonedSkeleton", Level: 0, Power: 4, Weight: 100},
		],

		"min_width" : 25,
		"max_width" : 31,
		"min_height" : 13,
		"max_height" : 19,

		"lockmult" : 2.0,
	},
	{//DungeonName8,-Marble Halls-
		"openness" : 4,
		"density" : 0,
		"doodadchance" : 0.12,
		"barchance" : 0.03,
		"brightness" : 8,
		"chestcount" : 8,
		"shrinecount" : 8,
		"shrinechance" : 0.75,
		"ghostchance" : 0.5,
		"doorchance" : 1.0,
		"nodoorchance" : 0.0,
		"doorlockchance" : -0.05,
		"trapchance" : 0.5,
		"grateChance" : 0.7,
		"rubblechance" : 0.7,
		"brickchance" : 0.5,

		"traps": [
			{Name: "SpawnEnemies", strict: true, Enemy: "SummonedSkeleton", Level: 0, Power: 4, Weight: 100},
		],

		"min_width" : 15,
		"max_width" : 21,
		"min_height" : 25,
		"max_height" : 37,

		"lockmult" : 1.5,
	},
	{//DungeonName9,-Ancient Laboratory-
		"openness" : 2,
		"density" : 1,
		"doodadchance" : 0.08,
		"barchance" : 0.03,
		"brightness" : 4,
		"chestcount" : 10,
		"shrinecount" : 6,
		"shrinechance" : 0.75,
		"ghostchance" : 0.5,
		"doorchance" : 1.0,
		"nodoorchance" : 0.0,
		"doorlockchance" : -0.05,
		"trapchance" : 0.5,
		"grateChance" : 0.7,
		"rubblechance" : 0.6,
		"brickchance" : 0.9,

		"traps": [
			{Name: "SpawnEnemies", strict: true, Enemy: "SummonedSkeleton", Level: 0, Power: 4, Weight: 100},
		],

		"min_width" : 25,
		"max_width" : 31,
		"min_height" : 13,
		"max_height" : 19,

		"lockmult" : 4.0,
	},
	{//DungeonName10,-The Mansion-
		"openness" : 10,
		"density" : 0,
		"doodadchance" : 0.05,
		"barchance" : 0.03,
		"brightness" : 100,
		"chestcount" : 0,
		"shrinecount" : 0,
		"shrinechance" : 0.25,
		"ghostchance" : 0.5,
		"doorchance" : 1.0,
		"nodoorchance" : 0.0,
		"doorlockchance" : -0.05,
		"trapchance" : 0.5,
		"grateChance" : 0.7,
		"rubblechance" : 1.0,
		"brickchance" : 0.7,

		"traps": [
			{Name: "SpawnEnemies", strict: true, Enemy: "SummonedSkeleton", Level: 0, Power: 4, Weight: 100},
		],

		"min_width" : 31,
		"max_width" : 31,
		"min_height" : 19,
		"max_height" : 19,

		"lockmult" : 0.0,
	},
	{//DungeonName11,-Ancient Tombs-
		"background" : "EgyptianTomb",
		"openness" : 1,
		"density" : 3,
		"doodadchance" : 0.25,
		"barchance" : 0.05,
		"brightness" : 5,
		"chestcount" : 6,
		"shrinecount" : 12,
		"shrinechance" : 0.5,
		"ghostchance" : 0.5,
		"doorchance" : 0.4,
		"nodoorchance" : 0.25,
		"doorlockchance" : -0.05,
		"trapchance" : 0.65,
		"grateChance" : 0.3,
		"rubblechance" : 0.7,
		"brickchance" : 0.4,
		"cacheInterval" : 3,
		// Side routes have more high-value loot
		"forbiddenChance" : 0.75,
		"forbiddenGreaterChance" : 0.45,

		"shortcuts": [
			{Level: 4, checkpoint: 13, chance: 1.0},
		],
		"mainpath": [
			{Level: 5, checkpoint: 1},
		],

		"traps": [
			{Name: "CustomSleepDart", Level: 0, Power: 1, Weight: 20},
			{Name: "SpecificSpell", Spell: "TrapMummyWeak", Level: 0, Power: 1, Weight: 30},
			{Name: "SpecificSpell", Spell: "TrapRopeWeak", Level: 0, Power: 3, Weight: 30},
			{Name: "SpecificSpell", Spell: "TrapLeatherWeak", Level: 0, Power: 3, Weight: 30},
			{Name: "SpecificSpell", Spell: "TrapLustCloud", Level: 0, Power: 3, Weight: 30},
			{Name: "SpawnEnemies", Enemy: "SummonedSkeleton", strict: true, Level: 0, Power: 5, Weight: 10},
			{Name: "SpawnEnemies", Enemy: "Bandit", strict: true, Level: 0, Power: 3, Weight: 10},
		],

		"min_width" : 21,
		"max_width" : 27,
		"min_height" : 13,
		"max_height" : 17,

		"enemytags": ["mummy", "ghost"],
		"defeat_restraints": [
			{Name: "Stuffing", Level: 20},
			{Name: "TrapGag", Level: 20},
			{Name: "HighsecBallGag", Level: 50},
			{Name: "DragonMuzzleGag", Level: 100},
			{Name: "FeetShackles", Level: 5},
			{Name: "HighsecShackles", Level: 40},
			{Name: "LegShackles", Level: 15},
			{Name: "HighsecLegbinder", Level: 25},
			{Name: "WristShackles", Level: 0},
			{Name: "TrapArmbinder", Level: 40},
			{Name: "HighsecArmbinder", Level: 70},
			{Name: "PrisonBelt", Level: 30},
			{Name: "PrisonVibe", Level: 30},
			{Name: "TrapBlindfold", Level: 90},
			{Name: "TrapBoots", Level: 60},
		],
		"defeat_outfit": "Egyptian",
		"shrines": [
			{Type: "Latex", Weight: 3},
			{Type: "Commerce", Weight: 14},
			{Type: "Elements", Weight: 5},
			{Type: "Conjure", Weight: 5},
			{Type: "Illusion", Weight: 5},
			{Type: "Metal", Weight: 3},
			{Type: "Rope", Weight: 4},
			{Type: "Leather", Weight: 6},
			{Type: "Will", Weight: 7},]
	},
	{//DungeonName12,-Magic Library-
		"background" : "Cell",
		"openness" : 5,
		"density" : 6,
		"doodadchance" : 0.15,
		"wallRubblechance" : 0.035,
		"barchance" : 0.1,
		"brightness" : 8,
		"chestcount" : 6,
		"shrinecount" : 12,
		"shrinechance" : 0.5,
		"ghostchance" : 0.5,
		"doorchance" : 0.0,
		"nodoorchance" : 1.0,
		"doorlockchance" : -0.05,
		"trapchance" : 0.3,
		"grateChance" : 0.7,
		"rubblechance" : 0.7,
		"brickchance" : 0.03,
		"cacheInterval" : 3,
		// Side routes have more high-value loot
		"forbiddenChance" : 0.75,
		"forbiddenGreaterChance" : 0.45,

		"shortcuts": [
			{Level: 9, checkpoint: 1, chance: 1.0},
		],
		"mainpath": [
			{Level: 11, checkpoint: 2},
		],

		"traps": [
			{Name: "CustomSleepDart", Level: 0, Power: 1, Weight: 20},
			{Name: "SpecificSpell", Spell: "TrapRopeWeak", Level: 0, Power: 3, Weight: 30},
			{Name: "SpecificSpell", Spell: "TrapLeatherWeak", Level: 0, Power: 3, Weight: 30},
			{Name: "SpecificSpell", Spell: "TrapLustCloud", Level: 0, Power: 3, Weight: 30},
			{Name: "SpawnEnemies", Enemy: "Bandit", strict: true, Level: 0, Power: 3, Weight: 10},
		],

		"min_width" : 25,
		"max_width" : 25,
		"min_height" : 25,
		"max_height" : 25,

		"enemytags": ["book", "witch", "dressmaker"],
		"defeat_restraints": [
			{Name: "Stuffing", Level: 20},
			{Name: "TrapGag", Level: 20},
			{Name: "HighsecBallGag", Level: 50},
			{Name: "DragonMuzzleGag", Level: 100},
			{Name: "FeetShackles", Level: 5},
			{Name: "HighsecShackles", Level: 40},
			{Name: "LegShackles", Level: 15},
			{Name: "HighsecLegbinder", Level: 25},
			{Name: "WristShackles", Level: 0},
			{Name: "TrapArmbinder", Level: 40},
			{Name: "HighsecArmbinder", Level: 70},
			{Name: "PrisonBelt", Level: 30},
			{Name: "PrisonVibe", Level: 30},
			{Name: "TrapBlindfold", Level: 90},
			{Name: "TrapBoots", Level: 60},
		],
		"defeat_outfit": "Prisoner",
		"shrines": [
			{Type: "Latex", Weight: 3},
			{Type: "Commerce", Weight: 14},
			{Type: "Elements", Weight: 5},
			{Type: "Conjure", Weight: 5},
			{Type: "Illusion", Weight: 5},
			{Type: "Metal", Weight: 3},
			{Type: "Rope", Weight: 4},
			{Type: "Leather", Weight: 6},
			{Type: "Will", Weight: 7},]
	},
	{//DungeonName13,-Crystal Cave-
		"background" : "ForestCave",
		"openness" : 6,
		"density" : 2,
		"doodadchance" : 0.15,
		"barchance" : 0.03,
		"brightness" : 7,
		"chestcount" : 4,
		"shrinecount" : 10,
		"shrinechance" : 0.8,
		"ghostchance" : 0.5,
		"doorchance" : 0.05,
		"nodoorchance" : 0.5,
		"doorlockchance" : -0.05,
		"trapchance" : 0.5,
		"grateChance" : 0.7,
		"rubblechance" : 0.9,
		"brickchance" : 0.2,

		"gaschance" : 0.33, // Chance for gas to appear on the level
		"gasdensity" : 0.05, // Chance for a passage to be filled with happy gas
		"gastype" : '[', // Gas type

		"floodchance" : 0.25,
		"cacheInterval" : 3,
		// Side routes have more high-value loot
		"forbiddenChance" : 0.75,
		"forbiddenGreaterChance" : 0.45,

		"shortcuts": [
			{Level: 14, checkpoint: 2, chance: 0.33},
			{Level: 15, checkpoint: 2, chance: 0.4},
			{Level: 16, checkpoint: 2, chance: 1.0},
		],
		"mainpath": [
			{Level: 5, checkpoint: 13},
			{Level: 7, checkpoint: 1},
			{Level: 17, checkpoint: 3},
		],

		"traps": [
			{Name: "CustomSleepDart", Level: 0, Power: 1, Weight: 20},
			{Name: "SpecificSpell", Spell: "TrapRopeWeak", Level: 0, Power: 3, Weight: 30},
			{Name: "SpecificSpell", Spell: "TrapLeatherWeak", Level: 0, Power: 3, Weight: 30},
			{Name: "SpecificSpell", Spell: "TrapLustCloud", Level: 0, Power: 3, Weight: 30},
			{Name: "SpawnEnemies", Enemy: "Bandit", strict: true, Level: 0, Power: 3, Weight: 10},
		],

		"min_width" : 15,
		"max_width" : 25,
		"min_height" : 15,
		"max_height" : 25,

		"enemytags": ["mushroom", "slimeBonus", "crystalline"],
		"defeat_restraints": [
			{Name: "Stuffing", Level: 20},
			{Name: "TrapGag", Level: 20},
			{Name: "HighsecBallGag", Level: 50},
			{Name: "DragonMuzzleGag", Level: 100},
			{Name: "FeetShackles", Level: 5},
			{Name: "HighsecShackles", Level: 40},
			{Name: "LegShackles", Level: 15},
			{Name: "HighsecLegbinder", Level: 25},
			{Name: "WristShackles", Level: 0},
			{Name: "TrapArmbinder", Level: 40},
			{Name: "HighsecArmbinder", Level: 70},
			{Name: "PrisonBelt", Level: 30},
			{Name: "PrisonVibe", Level: 30},
			{Name: "TrapBlindfold", Level: 90},
			{Name: "TrapBoots", Level: 60},
		],
		"defeat_outfit": "Prisoner",
		"shrines": [
			{Type: "Latex", Weight: 3},
			{Type: "Commerce", Weight: 14},
			{Type: "Elements", Weight: 5},
			{Type: "Conjure", Weight: 5},
			{Type: "Illusion", Weight: 5},
			{Type: "Metal", Weight: 3},
			{Type: "Rope", Weight: 4},
			{Type: "Leather", Weight: 6},
			{Type: "Will", Weight: 7},]
	},



];