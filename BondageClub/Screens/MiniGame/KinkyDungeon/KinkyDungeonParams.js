"use strict";
var KinkyDungeonMapParams = [

	{//DungeonName0,-Graveyard-
		"background" : "RainyForstPathNight",
		"openness" : 3, // Openness of rooms
		"density" : 3, // Density of tunnels (inverse of room spawn chance)
		"doodadchance" : 0.16,
		"brightness" : 8,
		"chestcount" : 1,
		"shrinecount" : 4,
		"shrinechance" : 0.75,
		"ghostchance" : 1,
		"doorchance" : 0.67,
		"nodoorchance" : 0.1,
		"doorlockchance" : -0.1,
		"trapchance" : 0.3,
		"grateChance" : 0.7,
		"rubblechance" : 0.7,
		"brickchance" : 0.1,

		"traps": [
			{Name: "Skeletons", Level: 0, Power: 6, Weight: 100},
			{Name: "Bandits", Level: 0, Power: 1, Weight: 30},
		],

		"min_width" : 25,
		"max_width" : 31,
		"min_height" : 11,
		"max_height" : 19,

		"enemytags": ["zombie"],
		"defeat_restraints": [
			{Name: "HighsecBallGag", Level: 0},
			{Name: "HighsecArmbinder", Level: 0},
			{Name: "HighsecShackles", Level: 0},
			{Name: "PrisonVibe", Level: 1},
			{Name: "PrisonBelt", Level: 1},
		],
		"defeat_outfit": "Prisoner",
		"shrines": [
			//{Type: "Charms", Weight: 5},
			{Type: "Commerce", Weight: 10},
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
		"brightness" : 6,
		"chestcount" : 2,
		"shrinecount" : 5,
		"shrinechance" : 0.6,
		"ghostchance" : 0.5,
		"doorchance" : 0.8,
		"nodoorchance" : 0.05,
		"doorlockchance" : -0.05,
		"trapchance" : 0.4,
		"grateChance" : 0.7,
		"rubblechance" : 0.6,
		"brickchance" : 0.4,

		"traps": [
			{Name: "Skeletons", Level: 0, Power: 6, Weight: 100},
			{Name: "Bandits", Level: 0, Power: 2, Weight: 40},
		],

		"min_width" : 21,
		"max_width" : 27,
		"min_height" : 11,
		"max_height" : 17,

		"enemytags": ["skeleton"],
		"defeat_restraints": [
			{Name: "HighsecBallGag", Level: 0},
			{Name: "HighsecArmbinder", Level: 0},
			{Name: "HighsecShackles", Level: 0},
			{Name: "PrisonBelt2", Level: 1},
			{Name: "PrisonVibe", Level: 1},
		],
		"defeat_outfit": "Dungeon",
		"shrines": [
			{Type: "Commerce", Weight: 10},
			{Type: "Elements", Weight: 5},
			{Type: "Conjure", Weight: 5},
			{Type: "Illusion", Weight: 5},
			{Type: "Leather", Weight: 5},
			{Type: "Metal", Weight: 3},
			{Type: "Rope", Weight: 2},
			{Type: "Will", Weight: 7},]

	},

	{//DungeonName2,-Underground Jungle-
		"openness" : 6,
		"density" : 5,
		"doodadchance" : 0.12,
		"brightness" : 7,
		"chestcount" : 2,
		"shrinecount" : 5,
		"shrinechance" : 0.4,
		"ghostchance" : 0.5,
		"doorchance" : 0.2,
		"nodoorchance" : 0.7,
		"doorlockchance" : -0.05,
		"trapchance" : 0.8,
		"grateChance" : 0.7,
		"rubblechance" : 0.5,
		"brickchance" : 0.25,

		"traps": [
			{Name: "Bandits", Level: 0, Power: 3, Weight: 100},
		],

		"min_width" : 29,
		"max_width" : 39,
		"min_height" : 13,
		"max_height" : 17,

		"enemytags": ["plant"],
		"defeat_restraints": [
			{Name: "HighsecBallGag", Level: 0},
			{Name: "HighsecArmbinder", Level: 0},
			{Name: "HighsecShackles", Level: 0},
			{Name: "HighsecLegbinder", Level: 0},
			{Name: "PrisonVibe", Level: 1},
			{Name: "PrisonBelt", Level: 1},
		],
		"defeat_outfit": "Prisoner",
		"shrines": [
			//{Type: "Charms", Weight: 5},
			{Type: "Commerce", Weight: 10},
			{Type: "Elements", Weight: 5},
			{Type: "Conjure", Weight: 5},
			{Type: "Illusion", Weight: 5},
			{Type: "Leather", Weight: 5},
			{Type: "Metal", Weight: 3},
			{Type: "Rope", Weight: 5},
			{Type: "Will", Weight: 5},]
	},
	{//DungeonName3,-Lost Temple-
		"openness" : 2,
		"density" : 0,
		"doodadchance" : 0.13,
		"brightness" : 8,
		"chestcount" : 2,
		"shrinecount" : 4,
		"shrinechance" : 0.5,
		"ghostchance" : 0.5,
		"doorchance" : 0.9,
		"nodoorchance" : 0.25,
		"doorlockchance" : -0.05,
		"trapchance" : 0.5,
		"rubblechance" : 0.7,
		"brickchance" : 0.1,

		"traps": [
			{Name: "Skeletons", Level: 0, Power: 6, Weight: 100},
		],

		"min_width" : 31,
		"max_width" : 35,
		"min_height" : 13,
		"max_height" : 21,

		"lockmult" : 1.5,
	},
	{//DungeonName4,-Fungal Caverns-
		"openness" : 4,
		"density" : 4,
		"doodadchance" : 0.15,
		"brightness" : 7,
		"chestcount" : 2,
		"shrinecount" : 5,
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
			{Name: "Skeletons", Level: 0, Power: 6, Weight: 100},
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
		"brightness" : 8,
		"chestcount" : 3,
		"shrinecount" : 4,
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
			{Name: "Skeletons", Level: 0, Power: 6, Weight: 100},
		],

		"min_width" : 25,
		"max_width" : 51,
		"min_height" : 9,
		"max_height" : 15,

		"lockmult" : 2.0,
	},
	{//DungeonName6,-Underground Desert-
		"openness" : 4,
		"density" : 2,
		"doodadchance" : 0.13,
		"brightness" : 5,
		"chestcount" : 2,
		"shrinecount" : 6,
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
			{Name: "Skeletons", Level: 0, Power: 6, Weight: 100},
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
		"brightness" : 4,
		"chestcount" : 2,
		"shrinecount" : 5,
		"shrinechance" : 0.8,
		"ghostchance" : 0.5,
		"doorchance" : 0.8,
		"trapchance" : 0.5,
		"grateChance" : 0.7,
		"nodoorchance" : 0.2,
		"rubblechance" : 0.5,
		"brickchance" : 0.7,

		"traps": [
			{Name: "Skeletons", Level: 0, Power: 6, Weight: 100},
		],

		"min_width" : 25,
		"max_width" : 31,
		"min_height" : 11,
		"max_height" : 19,

		"lockmult" : 2.0,
	},
	{//DungeonName8,-Marble Halls-
		"openness" : 4,
		"density" : 0,
		"doodadchance" : 0.12,
		"brightness" : 8,
		"chestcount" : 4,
		"shrinecount" : 4,
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
			{Name: "Skeletons", Level: 0, Power: 6, Weight: 100},
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
		"brightness" : 4,
		"chestcount" : 5,
		"shrinecount" : 3,
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
			{Name: "Skeletons", Level: 0, Power: 6, Weight: 100},
		],

		"min_width" : 25,
		"max_width" : 31,
		"min_height" : 11,
		"max_height" : 19,

		"lockmult" : 4.0,
	},
	{//DungeonName10,-The Mansion-
		"openness" : 10,
		"density" : 0,
		"doodadchance" : 0.05,
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
			{Name: "Skeletons", Level: 0, Power: 6, Weight: 100},
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
		"brightness" : 5,
		"chestcount" : 2,
		"shrinecount" : 4,
		"shrinechance" : 0.5,
		"ghostchance" : 0.5,
		"doorchance" : 0.4,
		"nodoorchance" : 0.25,
		"doorlockchance" : -0.05,
		"trapchance" : 0.7,
		"grateChance" : 0.7,
		"rubblechance" : 0.7,
		"brickchance" : 0.4,

		"traps": [
			{Name: "Skeletons", Level: 0, Power: 8, Weight: 100},
			{Name: "Bandits", Level: 0, Power: 3, Weight: 60},
		],

		"min_width" : 21,
		"max_width" : 27,
		"min_height" : 11,
		"max_height" : 17,

		"enemytags": ["mummy", "ghost"],
		"defeat_restraints": [
			{Name: "HighsecBallGag", Level: 0},
			{Name: "HighsecArmbinder", Level: 0},
			{Name: "HighsecShackles", Level: 0},
			{Name: "LegShackles", Level: 0},
			{Name: "PrisonBelt", Level: 1},
			{Name: "PrisonVibe", Level: 1},
		],
		"defeat_outfit": "Egyptian",
		"shrines": [
			{Type: "Commerce", Weight: 10},
			{Type: "Elements", Weight: 5},
			{Type: "Conjure", Weight: 5},
			{Type: "Illusion", Weight: 5},
			{Type: "Metal", Weight: 3},
			{Type: "Rope", Weight: 4},
			{Type: "Leather", Weight: 6},
			{Type: "Will", Weight: 7},]
	},
];