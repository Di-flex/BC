"use strict";
// Escape chances
// Struggle : How difficult it is to struggle out of the item. Shouldn't be below 0.1 as that would be too tedious. Negative values help protect against spells.
// Cut : How difficult it is to cut with a knife. Metal items should have 0, rope and leather should be low but possible, and stuff like tape should be high
// Remove : How difficult it is to get it off by unbuckling. Most items should have a high chance if they have buckles, medium chance if they have knots, and low chance if they have a difficult mechanism.
// Pick : How hard it is to pick the lock on the item. Higher level items have more powerful locks. The general formula is 0.33 for easy items, 0.1 for medium items, 0.05 for hard items, and 0.01 for super punishing items
// Unlock : How hard it is to reach the lock. Should be higher than the pick chance, and based on accessibility. Items like the

// Note that there is a complex formula for how the chances are manipulated based on whether your arms are bound. Items that bind the arms are generally unaffected, and items that bind the hands are unaffected, but they do affect each other

// Power is a scale of how powerful the restraint is supposed to be. It should roughly match the difficulty of the item, but can be higher for special items. Power 10 or higher might be totally impossible to struggle out of.

// These are groups that the game is not allowed to remove because they were tied at the beginning
let KinkyDungeonRestraintsLocked = [];

let KinkyDungeonMultiplayerInventoryFlag = false;
let KinkyDungeonItemDropChanceArmsBound = 0.2; // Chance to drop item with just bound arms and not bound hands.

//let KinkyDungeonKnifeBreakChance = 0.15;
let KinkyDungeonKeyJamChance = 0.33;
let KinkyDungeonKeyPickBreakAmount = 12; // Number of tries per pick on average 5-11
let KinkyDungeonPickBreakProgress = 0;
let KinkyDungeonKnifeBreakAmount = 10; // Number of tries per knife on average 6-12
let KinkyDungeonKnifeBreakProgress = 0;
let KinkyDungeonEnchKnifeBreakAmount = 24; // Number of tries per knife on average
let KinkyDungeonEnchKnifeBreakProgress = 0;

let KinkyDungeonMaxImpossibleAttempts = 3; // base, more if the item is close to being impossible

let KinkyDungeonEnchantedKnifeBonus = 0.1; // Bonus whenever you have an enchanted knife

let KinkyDungeonRestraintsCache = new Map();

let KinkyDungeonRestraints = [
	{removePrison: true, name: "DuctTapeArms", Asset: "DuctTape", Color: "#AA2222", Group: "ItemArms", power: -2, weight: 0, escapeChance: {"Struggle": 0.3, "Cut": 0.9, "Remove": 0},
		enemyTags: {"ribbonRestraints":5}, playerTags: {"ItemArmsFull":8}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Charms"]},
	{removePrison: true, name: "DuctTapeFeet", Asset: "DuctTape", Color: "#AA2222", Group: "ItemFeet", blockfeet: true, power: -2, weight: 0, escapeChance: {"Struggle": 0.3, "Cut": 0.9, "Remove": 0},
		enemyTags: {"ribbonRestraints":5}, playerTags: {"ItemLegsFull":8}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Charms"]},
	{removePrison: true, name: "DuctTapeBoots", Asset: "ToeTape", Type: "Full", Color: "#AA2222", Group: "ItemBoots", blockfeet: true, power: -2, weight: 0, escapeChance: {"Struggle": 0.3, "Cut": 0.9, "Remove": 0},
		enemyTags: {"ribbonRestraints":5}, playerTags: {"ItemFeetFull":8}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Charms", "Wrapping"]},
	{removePrison: true, name: "DuctTapeLegs", Asset: "DuctTape", Color: "#AA2222", Group: "ItemLegs", hobble: true, power: -2, weight: 0, escapeChance: {"Struggle": 0.3, "Cut": 0.9, "Remove": 0},
		enemyTags: {"ribbonRestraints":5}, playerTags: {"ItemFeetFull":8}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Charms"]},
	{removePrison: true, name: "DuctTapeHead", Type: "Wrap", Asset: "DuctTape", Color: "#AA2222", Group: "ItemHead", power: -2, weight: 0, escapeChance: {"Struggle": 0.3, "Cut": 0.9, "Remove": 0},
		enemyTags: {"ribbonRestraints":5}, playerTags: {}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Charms"]},
	{removePrison: true, name: "DuctTapeMouth", Asset: "DuctTape", Color: "#AA2222", Group: "ItemMouth2", power: -2, weight: 0, escapeChance: {"Struggle": 0.3, "Cut": 0.9, "Remove": 0},
		enemyTags: {"ribbonRestraints":5}, playerTags: {"ItemMouth1Full":8}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Charms"]},
	{removePrison: true, name: "DuctTapeHeadMummy", Type: "Mummy", Asset: "DuctTape", Color: "#AA2222", Group: "ItemHead", power: 2, weight: 0,  escapeChance: {"Struggle": 0.15, "Cut": 0.8, "Remove": 0},
		enemyTags: {"ribbonRestraints":1}, playerTags: {"ItemMouth1Full":2, "ItemMouth2Full":1}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Charms", "Wrapping"]},
	{removePrison: true, name: "DuctTapeArmsMummy", Type: "Complete", remove: ["Cloth", "ClothLower"], Asset: "DuctTape", Color: "#AA2222", Group: "ItemArms", power: 2, weight: 0,  escapeChance: {"Struggle": 0.1, "Cut": 0.8, "Remove": 0},
		enemyTags: {"ribbonRestraints":1}, playerTags: {"ItemArmsFull":3}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Charms", "Wrapping"]},
	{removePrison: true, name: "DuctTapeLegsMummy", Type: "CompleteLegs", remove: ["ClothLower"], Asset: "DuctTape", Color: "#AA2222", Group: "ItemLegs", hobble: true, power: 2, weight: 0,  escapeChance: {"Struggle": 0.15, "Cut": 0.8, "Remove": 0},
		enemyTags: {"ribbonRestraints":1}, playerTags: {"ItemLegsFull":3}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Charms", "Hobbleskirts"]},
	{removePrison: true, name: "DuctTapeFeetMummy", Type: "CompleteFeet", Asset: "DuctTape", Color: "#AA2222", Group: "ItemFeet", blockfeet: true, power: 2, weight: 0,  escapeChance: {"Struggle": 0.15, "Cut": 0.8, "Remove": 0},
		enemyTags: {"ribbonRestraints":1}, playerTags: {"ItemFeetFull":3}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Charms", "Wrapping"]},

	{removePrison: true, name: "MysticDuctTapeHead", Type: "Wrap", Asset: "DuctTape", Color: "#55AA22", Group: "ItemHead", power: 1, weight: 0, escapeChance: {"Struggle": 0.2, "Cut": 0.6, "Remove": 0},
		enemyTags: {"mummyRestraints":-399}, playerTags: {"ItemMouth2Full":99, "ItemArmsFull":99, "ItemLegsFull":99, "ItemFeetFull":99, "ItemBootsFull":99}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Charms", "Wrapping"]},
	{removePrison: true, name: "MysticDuctTapeMouth", Asset: "DuctTape", Color: "#55AA22", Group: "ItemMouth2", power: 1, weight: 0, escapeChance: {"Struggle": 0.2, "Cut": 0.6, "Remove": 0},
		enemyTags: {"mummyRestraints":-299}, playerTags: {"ItemArmsFull":99, "ItemLegsFull":99, "ItemFeetFull":99, "ItemBootsFull":99}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Charms"]},
	{removePrison: true, name: "MysticDuctTapeArmsMummy", Type: "Complete", remove: ["Cloth", "ClothLower"], Asset: "DuctTape", Color: "#55AA22", Group: "ItemArms", power: 3, weight: 0,  escapeChance: {"Struggle": 0.05, "Cut": 0.5, "Remove": 0},
		enemyTags: {"mummyRestraints":-199}, playerTags: {"ItemLegsFull":99, "ItemFeetFull":99, "ItemBootsFull":99}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Charms", "Wrapping"]},
	{removePrison: true, name: "MysticDuctTapeLegsMummy", Type: "CompleteLegs", remove: ["ClothLower"], Asset: "DuctTape", Color: "#55AA22", Group: "ItemLegs", hobble: true, power: 3, weight: 0,  escapeChance: {"Struggle": 0.05, "Cut": 0.5, "Remove": 0},
		enemyTags: {"mummyRestraints":-99}, playerTags: {"ItemFeetFull":99, "ItemBootsFull":99}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Charms", "Hobbleskirts"]},
	{removePrison: true, name: "MysticDuctTapeFeetMummy", Type: "CompleteFeet", Asset: "DuctTape", Color: "#55AA22", Group: "ItemFeet", blockfeet: true, power: 3, weight: 0,  escapeChance: {"Struggle": 0.05, "Cut": 0.5, "Remove": 0},
		enemyTags: {"mummyRestraints":-1}, playerTags: {"ItemBootsFull":99}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Charms", "Wrapping"]},
	{removePrison: true, name: "MysticDuctTapeBoots", Asset: "ToeTape", Type: "Full", Color: "#55AA22", Group: "ItemBoots", blockfeet: true, power: 3, weight: 0,  escapeChance: {"Struggle": 0.05, "Cut": 0.5, "Remove": 0},
		enemyTags: {"mummyRestraints":100}, playerTags: {}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Charms", "Wrapping"]},

	{removePrison: true, name: "SlimeBoots", Asset: "ToeTape", Type: "Full", Color: "#9B49BD", Group: "ItemBoots", blockfeet: true, power: 4, weight: 0,  escapeChance: {"Struggle": 0.2, "Cut": 0, "Remove": 0}, events: [{trigger: "tick", type: "slimeSpread", power: 0.04}, {trigger: "remove", type: "slimeStop"}], slimeLevel: 1,
		enemyTags: {"slimeRestraints":100, "slimeRestraintsRandom": 2}, playerTags: {}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Latex", "Wrapping"], addTag: ["slime"]},
	{removePrison: true, name: "SlimeFeet", Asset: "DuctTape", Type: "CompleteFeet", OverridePriority: 24, Color: "#9B49BD", Group: "ItemFeet", blockfeet: true, power: 4, weight: -100,  escapeChance: {"Struggle": 0.2, "Cut": 0, "Remove": 0}, events: [{trigger: "tick", type: "slimeSpread", power: 0.05}, {trigger: "remove", type: "slimeStop"}], slimeLevel: 1,
		enemyTags: {"slimeRestraints":100, "slimeRestraintsRandom": 101}, playerTags: {"ItemBootsFull":15}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Latex", "Wrapping"], addTag: ["slime"]},
	{removePrison: true, name: "SlimeLegs", remove: ["ClothLower"],  Asset: "SeamlessHobbleSkirt", Color: "#9B49BD", Group: "ItemLegs", hobble: true, power: 4, weight: -102,  escapeChance: {"Struggle": 0.15, "Cut": 0, "Remove": 0}, events: [{trigger: "tick", type: "slimeSpread", power: 0.07}, {trigger: "remove", type: "slimeStop"}], slimeLevel: 1,
		enemyTags: {"slimeRestraints":100, "slimeRestraintsRandom": 103}, playerTags: {"ItemFeetFull":2, "ItemBootsFull":2}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Latex", "Hobbleskirts"], addTag: ["slime"]},
	{removePrison: true, name: "SlimeArms", remove: ["Bra"], Asset: "StraitLeotard", Modules: [0, 0, 0, 0], Color: "#9B49BD", Group: "ItemArms", power: 6, weight: -102,  escapeChance: {"Struggle": 0.15, "Cut": 0, "Remove": 0}, events: [{trigger: "tick", type: "slimeSpread", power: 0.1}, {trigger: "remove", type: "slimeStop"}], slimeLevel: 1,
		enemyTags: {"slimeRestraints":100, "slimeRestraintsRandom": 103}, playerTags: {"ItemFeetFull":2, "ItemBootsFull":2, "ItemLegsFull":2}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Latex"], addTag: ["slime"]},
	{removePrison: true, name: "SlimeHands", Asset: "DuctTape", Color: "#9B49BD", Group: "ItemHands", power: 1, weight: -102,  escapeChance: {"Struggle": 0.3, "Cut": 0, "Remove": 0}, events: [{trigger: "tick", type: "slimeSpread", power: 0.05}, {trigger: "remove", type: "slimeStop"}], slimeLevel: 1,
		enemyTags: {"slimeRestraints":100, "slimeRestraintsRandom": 103}, playerTags: {"ItemFeetFull":1, "ItemBootsFull":1, "ItemLegsFull":1, "ItemHeadFull":1}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Latex"], addTag: ["slime"]},
	{removePrison: true, name: "SlimeHead", Asset: "LeatherSlimMask", Color: "#9B49BD", Group: "ItemHead", power: 4, weight: -102,  escapeChance: {"Struggle": 0.15, "Cut": 0, "Remove": 0}, events: [{trigger: "tick", type: "slimeSpread", power: 0.05}, {trigger: "remove", type: "slimeStop"}], slimeLevel: 1,
		enemyTags: {"slimeRestraints":100, "slimeRestraintsRandom": 100}, playerTags: {"ItemFeetFull":1, "ItemBootsFull":1, "ItemLegsFull":1, "ItemHandsFull":1, "ItemArmsFull":1}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Latex", "Wrapping"], addTag: ["slime"]},

	{removePrison: true, name: "HardSlimeBoots", Asset: "ToeTape", Type: "Full", Color: "#9B49BD", Group: "ItemBoots", blockfeet: true, power: 5, weight: 0,  escapeChance: {"Struggle": 0, "Cut": 0.1, "Remove": 0},
		enemyTags: {}, playerTags: {}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Latex", "Wrapping"]},
	{removePrison: true, name: "HardSlimeFeet", Asset: "DuctTape", Type: "CompleteFeet", OverridePriority: 24, Color: "#9B49BD", Group: "ItemFeet", blockfeet: true, power: 6, weight: -100,  escapeChance: {"Struggle": 0, "Cut": 0.1, "Remove": 0},
		enemyTags: {}, playerTags: {}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Latex", "Wrapping"]},
	{removePrison: true, name: "HardSlimeLegs", remove: ["ClothLower"], Asset: "SeamlessHobbleSkirt", Color: "#9B49BD", Group: "ItemLegs", hobble: true, power: 6, weight: -102,  escapeChance: {"Struggle": 0, "Cut": 0.1, "Remove": 0},
		enemyTags: {}, playerTags: {}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Latex", "Legbinders"]},
	{removePrison: true, name: "HardSlimeArms", remove: ["Bra"], Asset: "StraitLeotard", Modules: [0, 0, 0, 0], Color: "#9B49BD", Group: "ItemArms", power: 8, weight: -102,  escapeChance: {"Struggle": 0, "Cut": 0.1, "Remove": 0},
		enemyTags: {}, playerTags: {}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Latex"]},
	{removePrison: true, name: "HardSlimeHands", Asset: "DuctTape", Color: "#9B49BD", Group: "ItemHands", power: 5, weight: -102,  escapeChance: {"Struggle": 0.0, "Cut": 0.1, "Remove": 0},
		enemyTags: {}, playerTags: {}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Latex"]},
	{removePrison: true, name: "HardSlimeHead", Asset: "LeatherSlimMask", Color: "#9B49BD", Group: "ItemHead", power: 6, weight: -102,  escapeChance: {"Struggle": 0.0, "Cut": 0.1, "Remove": 0},
		enemyTags: {}, playerTags: {}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Latex", "Wrapping"]},

	{removePrison: true, name: "GlueBoots", Asset: "ToeTape", Type: "Full", Color: "#f0b541", Group: "ItemBoots", blockfeet: true, power: 3, weight: 0,  escapeChance: {"Struggle": 0.3, "Cut": 0.0, "Remove": 0.05},
		enemyTags: {"glueRestraints":100}, playerTags: {}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Latex"]},
	{removePrison: true, name: "GlueFeet", Asset: "DuctTape", Type: "CompleteFeet", OverridePriority: 24, Color: "#f0b541", Group: "ItemFeet", blockfeet: true, power: 3, weight: -100,  escapeChance: {"Struggle": 0.25, "Cut": 0.0, "Remove": 0.05},
		enemyTags: {"glueRestraints":100}, playerTags: {"ItemBootsFull":15}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Latex"]},
	{removePrison: true, name: "GlueLegs", remove: ["ClothLower"], Asset: "SeamlessHobbleSkirt", Color: "#f0b541", Group: "ItemLegs", blockfeet: true, power: 34, weight: -102,  escapeChance: {"Struggle": 0.2, "Cut": 0.0, "Remove": 0.05},
		enemyTags: {"glueRestraints":100}, playerTags: {"ItemBootsFull":2, "ItemFeetFull":2}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Latex", "Hobbleskirts"]},

	{name: "LatexStraitjacket", remove: ["Bra"], Asset: "StraitLeotard", Modules: [0, 0, 0, 0], Color: "#6A94CC", Group: "ItemArms", power: 8, weight: 0, strictness: 0.2, escapeChance: {"Struggle": 0, "Cut": 0.15, "Remove": 0.1, "Pick": 0.35},
		enemyTags: {"latexRestraintsHeavy" : 2}, playerTags: {}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Latex", "Straitjackets"]},
	{name: "LatexArmbinder", Asset: "SeamlessLatexArmbinder", LinkableBy: ["Wrapping"], Color: "#6A94CC", Group: "ItemArms", power: 7, weight: 0,  escapeChance: {"Struggle": 0.1, "Cut": 0.15, "Remove": 0.1, "Pick": 0.35},
		enemyTags: {"latexRestraints" : 3}, playerTags: {}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Latex", "Armbinders"]},
	{name: "LatexLegbinder", Asset: "SeamlessLegBinder", LinkableBy: ["Hobbleskirts"], Color: "#6A94CC", Group: "ItemLegs", hobble: true, power: 7, weight: 0,  escapeChance: {"Struggle": 0, "Cut": 0.15, "Remove": 0.1, "Pick": 0.35},
		enemyTags: {"latexRestraintsHeavy" : 6}, playerTags: {}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Latex", "Hobbleskirts"]},
	{name: "LatexBoots", Asset: "HighThighBoots", Color: "#6A94CC", Group: "ItemBoots", hobble: true, power: 6, weight: 0, escapeChance: {"Struggle": 0, "Cut": 0.12, "Remove": 0.07, "Pick": 0.25},
		enemyTags: {"latexRestraints" : 8, "latexBoots" : 3}, playerTags: {}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Latex"]},
	{name: "LatexCorset", remove: ["Cloth"], Asset: "HeavyLatexCorset", strictness: 0.1, Color: "#5196EF", Group: "ItemTorso", harness: true, power: 8, weight: 0, escapeChance: {"Struggle": 0, "Cut": 0.2, "Remove": 0.07},
		enemyTags: {"latexRestraints" : 6}, playerTags: {"ItemTorsoFull": -5}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Latex", "Corsets", "HeavyCorsets"]},
	{name: "LatexBallGag", Asset: "BallGag", Color: ["#4EA1FF", "Default"], Type: "Tight", Group: "ItemMouth", power: 7, weight: 0, escapeChance: {"Struggle": 0, "Cut": 0.04, "Remove": 0.4, "Pick": 0.25},
		enemyTags: {"latexGag" : 10}, playerTags: {}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Latex"]},

	{name: "ExpArmbinder", Asset: "BoxTieArmbinder", LinkableBy: ["Wrapping"], Color: ["#415690", "#ffffff"], Group: "ItemArms", power: 7, weight: 0,  escapeChance: {"Struggle": 0.1, "Cut": 0.15, "Remove": 0.1, "Pick": 0.35},
		enemyTags: {"expRestraints" : 4}, playerTags: {}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Latex", "Boxbinders"]},
	{name: "ExpArmbinderHarness", Asset: "Corset4", LinkableBy: ["HeavyCorsets", "Harnesses"], Color: "#383E4D", Group: "ItemTorso", strictness: 0.1, power: 9, weight: -10, escapeChance: {"Struggle": 0.0, "Cut": 0.1, "Remove": 0.15},
		enemyTags: {"expRestraints" : 9}, playerTags: {"Boxbinders": 20, "Armbinders": 20}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Latex", "ArmbinderHarness", "Corset"],
		events: [{trigger: "remove", type: "armbinderHarness"}]},
	{name: "ExpAnkleCuffs", Asset: "SteelAnkleCuffs", Link: "ExpAnkleCuffs2", Type: "Chained", Color: "#333333", Group: "ItemFeet", hobble: true, power: 9, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": -0.4, "Remove": 0.1, "Pick": 0.15},
		enemyTags: {"expRestraints":7}, playerTags: {"ItemFeetFull":-2}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Metal", "Cuffs"],
		events: [{trigger: "hit", type: "linkItem", chance: 0.2, noSub: 0.1, noLeash: true}]},
	{name: "ExpAnkleCuffs2", Asset: "SteelAnkleCuffs", UnLink: "ExpAnkleCuffs", Type: "Closed", Color: "#333333", Group: "ItemFeet", blockfeet: true, power: 9, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": -0.4, "Remove": 0.1, "Pick": 0.15},
		enemyTags: {"expRestraints":7}, playerTags: {"ItemFeetFull":-2}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Metal", "Cuffs"],
		events: [{trigger: "remove", type: "unlinkItem"}]},
	{name: "ExpCollar", Asset: "LatexPostureCollar", Color: "#4E7DFF", Group: "ItemNeck", power: 8, weight: -10, strictness: 0.05, escapeChance: {"Struggle": 0, "Cut": 0.15, "Remove": 0.2, "Pick": 0.25},
		enemyTags: {"expRestraints" : 2}, playerTags: {"ItemMouthFull": 10}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Latex", "Posture", "Collars"]},
	{name: "ExpBoots", Asset: "BalletWedges", Color: "#748395", Group: "ItemBoots", hobble: true, power: 8, weight: 0, escapeChance: {"Struggle": 0, "Cut": 0.0, "Remove": 0.07, "Pick": 0.25},
		enemyTags: {"expRestraints" : 6, "latexBoots" : 3}, playerTags: {}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Latex", "Boots"]},

	{name: "Stuffing", Asset: "ClothStuffing", Group: "ItemMouth", power: -20, weight: 0, escapeChance: {"Struggle": 10, "Cut": 10, "Remove": 10}, enemyTags: {"stuffedGag": 100, "clothRestraints":10, "ribbonRestraints":6}, playerTags: {}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]},

	{name: "WeakMagicRopeArms", Asset: "HempRope", Color: "#ff88AA", LinkableBy: ["Boxbinders"], Group: "ItemArms", power: 5, weight: 1, escapeChance: {"Struggle": 0.3, "Cut": 0.67, "Remove": 0.2}, enemyTags: {"ropeMagicWeak":2}, playerTags: {}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Rope"]},
	{name: "WeakMagicRopeLegs", Asset: "HempRope", Type: "FullBinding", LinkableBy: ["Legbinders", "Hobbleskirts"], Color: "#ff88AA", Group: "ItemLegs", hobble: true, power: 3, weight: 1, escapeChance: {"Struggle": 0.3, "Cut": 0.67, "Remove": 0.15}, enemyTags: {"ropeMagicWeak":2}, playerTags: {}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Rope"]},
	{name: "StrongMagicRopeArms", Asset: "HempRope", Color: "#ff00dd", LinkableBy: ["Boxbinders"], Group: "ItemArms", power: 6, weight: 1, escapeChance: {"Struggle": 0.15, "Cut": 0.2, "Remove": -0.1}, enemyTags: {"ropeMagicStrong":2}, playerTags: {}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Rope"]},
	{name: "StrongMagicRopeHogtie", Asset: "HempRope", Color: "#ff00dd", Type: "Hogtied", Group: "ItemArms", power: 8, weight: 1, escapeChance: {"Struggle": 0, "Cut": 0.15, "Remove": -0.1}, enemyTags: {"ropeMagicHogtie":2}, playerTags: {}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Rope"]},
	{name: "StrongMagicRopeLegs", Asset: "HempRope", Type: "FullBinding", LinkableBy: ["Legbinders", "Hobbleskirts"], Color: "#ff00dd", Group: "ItemLegs", hobble: true, power: 5, weight: 1, escapeChance: {"Struggle": 0.15, "Cut": 0.2, "Remove": -0.1}, enemyTags: {"ropeMagicStrong":2}, playerTags: {}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Rope"]},
	{name: "StrongMagicRopeFeet", Asset: "HempRope", Color: "#ff00dd", LinkableBy: ["Wrapping"], Group: "ItemFeet", blockfeet: true, power: 5, weight: 1, escapeChance: {"Struggle": 0.15, "Cut": 0.2, "Remove": -0.1}, enemyTags: {"ropeMagicStrong":2}, playerTags: {}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Rope"]},
	{name: "StrongMagicRopeCrotch", crotchrope: true, Asset: "HempRope", Type: "OverPanties", OverridePriority: 26, Color: "#ff00dd", Group: "ItemPelvis", power: 5, weight: 1, escapeChance: {"Struggle": 0.15, "Cut": 0.2, "Remove": -0.1}, enemyTags: {"ropeMagicStrong":2}, playerTags: {}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Rope"]},
	{name: "StrongMagicRopeToe", Asset: "ToeTie", OverridePriority: 26, LinkableBy: ["Wrapping"], Color: "#ff00dd", Group: "ItemBoots", blockfeet: true, power: 5, weight: 1, escapeChance: {"Struggle": 0.15, "Cut": 0.2, "Remove": -0.1}, enemyTags: {"ropeMagicStrong":2}, playerTags: {}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Rope"]},

	{name: "DuctTapeHands", Asset: "DuctTape", Color: "Default", LinkableBy: ["Mittens"], Group: "ItemHands", power: 1, weight: 0,  escapeChance: {"Struggle": 0, "Cut": 0.4, "Remove": 0.1},
		enemyTags: {"tapeRestraints":8}, playerTags: {"ItemHandsFull": -4}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: []},


	{removePrison: true, name: "StickySlime", Asset: "Web", Type: "Wrapped", Color: "#ff77ff", Group: "ItemArms", power: 0.1, weight: 1, freeze: true, escapeChance: {"Struggle": 10, "Cut": 10, "Remove": 10}, enemyTags: {"slime":100}, playerTags: {}, minLevel: 0, floors: [], shrine: ["Slime"]},

	{inventory: true, name: "HighsecArmbinder", Asset: "LeatherArmbinder", LinkableBy: ["Wrapping"], Type: "Strap", Group: "ItemArms", Color: "#333333", DefaultLock: "Red", power: 15, weight: 2, escapeChance: {"Struggle": 0.00, "Cut": 0.1, "Remove": 0.35, "Pick": 0.25}, enemyTags: {}, playerTags: {}, minLevel: 0, floors: [], shrine: ["Leather", "Armbinders"]},
	{inventory: true, name: "HighsecShackles", Asset: "AnkleShackles", LinkableBy: ["Wrapping"], Group: "ItemFeet", hobble: true, Color: "Default", DefaultLock: "Red", power: 12, weight: 2, escapeChance: {"Struggle": 0.00, "Cut": -0.5, "Remove": 1.1, "Pick": 0.4}, enemyTags: {}, playerTags: {}, minLevel: 0, floors: [], shrine: ["Metal", "Cuffs"]},
	{inventory: true, name: "HighsecBallGag", Asset: "HarnessBallGag", Type: "Tight", Color: ["Default", "Default"], Group: "ItemMouth", DefaultLock: "Red", power: 8, weight: 2, escapeChance: {"Struggle": 0.00, "Cut": 0.0, "Remove": 0.5, "Pick": 0.25}, enemyTags: {}, playerTags: {}, minLevel: 0, floors: [], shrine: ["Leather", "Gags"]},
	{inventory: true, name: "HighsecLegbinder", Asset: "LegBinder", LinkableBy: ["Hobbleskirts"], Color: "Default", Group: "ItemLegs", hobble: true, DefaultLock: "Red", power: 8, weight: 2, escapeChance: {"Struggle": 0.00, "Cut": 0.1, "Remove": 0.35, "Pick": 0.25}, enemyTags: {}, playerTags: {}, minLevel: 0, floors: [], shrine: ["Leather", "Legbinders"]},
	{inventory: true, name: "PrisonVibe", Asset: "VibratingDildo", Color: "Default", Group: "ItemVulva", plugSize: 1.0, vibeType: "ChargingTeaserRemote", intensity: 2, orgasm: false, power: 4, battery: 0, maxbattery: 12, weight: 2, escapeChance: {"Struggle": 10}, enemyTags: {}, playerTags: {}, minLevel: 0, floors: [], shrine: ["Vibes"]},
	{inventory: true, name: "PrisonBelt", Asset: "PolishedChastityBelt", OverridePriority: 26, Color: "#444444", Group: "ItemPelvis", DefaultLock: "Red", chastity: true, power: 8, weight: 2, escapeChance: {"Struggle": 0.0, "Cut": -0.30, "Remove": 100.0, "Pick": 0.25}, enemyTags: {}, playerTags: {}, minLevel: 0, floors: [], shrine: ["Metal", "Chastity"]},
	{inventory: true, name: "PrisonBelt2", Asset: "OrnateChastityBelt", OverridePriority: 26, Color: ["#272727", "#AA0000"], Group: "ItemPelvis", DefaultLock: "Red", chastity: true, power: 9, weight: 2, escapeChance: {"Struggle": 0.0, "Cut": -0.30, "Remove": 100.0, "Pick": 0.22}, enemyTags: {}, playerTags: {}, minLevel: 0, floors: [], shrine: ["Metal", "Chastity"]},

	{inventory: true, name: "TrapArmbinderHarness", Asset: "LeatherHarness", LinkableBy: ["HeavyCorsets"], Group: "ItemTorso", power: 3, strictness: 0.1, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": 0.25, "Remove": 0.25, "Pick": 0.15}, enemyTags: {}, playerTags: {}, minLevel: 0, floors: [], shrine: ["Leather", "ArmbinderHarness"],
		events: [{trigger: "remove", type: "armbinderHarness"}]},

	{inventory: true, name: "TrapArmbinder", Asset: "LeatherArmbinder", LinkableBy: ["Wrapping"], Type: "WrapStrap", Group: "ItemArms", power: 8, weight: 2,
		escapeChance: {"Struggle": 0.1, "Cut": 0.5, "Remove": 0.35, "Pick": 0.15}, enemyTags: {"trap":100}, playerTags: {}, minLevel: 0, floors: [], shrine: ["Leather", "Armbinders"]},
	{inventory: true, name: "TrapCuffs", Asset: "MetalCuffs", LinkableBy: ["Wrapping", "Armbinders"], Group: "ItemArms", power: 4, weight: 2, DefaultLock: "Red",
		escapeChance: {"Struggle": 0.0, "Cut": -0.1, "Remove": 10, "Pick": 2.5}, enemyTags: {"trap":100}, playerTags: {}, minLevel: 0, floors: [], shrine: ["Metal", "Cuffs"]},
	{inventory: true, name: "TrapHarness", Asset: "LeatherStrapHarness", LinkableBy: ["HeavyCorsets"], OverridePriority: 26, Color: "#222222", Group: "ItemTorso", power: 2, weight: 2, harness: true,
		escapeChance: {"Struggle": 0.0, "Cut": 0.3, "Remove": 0.8, "Pick": 1.0}, enemyTags: {"trap":100}, playerTags: {}, minLevel: 0, floors: [], shrine: ["Leather", "Harnesses"]},
	{inventory: true, name: "TrapGag", Asset: "BallGag", Type: "Tight", Color: ["Default", "Default"], Group: "ItemMouth", power: 4, weight: 2,
		escapeChance: {"Struggle": 0.35, "Cut": 0.45, "Remove": 0.3, "Pick": 0.5}, enemyTags: {"trap":100, "leatherRestraintsHeavy":6}, playerTags: {}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Leather", "Gags"]},
	{inventory: true, name: "TrapBlindfold", Asset: "LeatherBlindfold", LinkableBy: ["Wrapping", "Mask"], Color: "Default", Group: "ItemHead", power: 3, weight: 2,
		escapeChance: {"Struggle": 0.4, "Cut": 0.6, "Remove": 0.3, "Pick": 0.5}, enemyTags: {"trap":100, "leatherRestraintsHeavy":6, "ropeAuxiliary": 4}, playerTags: {}, minLevel: 0, floors: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Leather", "Blindfolds"]},
	{inventory: true, name: "TrapBoots", Asset: "BalletHeels", Color: "Default", Group: "ItemBoots", hobble: true, power: 3, weight: 2,
		escapeChance: {"Struggle": 0.15, "Cut": 0.45, "Remove": 0.4, "Pick": 0.9}, enemyTags: {"trap":100}, playerTags: {}, minLevel: 0, floors: [], shrine: ["Leather", "Boots"]},
	{inventory: true, name: "TrapLegirons", Asset: "Irish8Cuffs", LinkableBy: ["Wrapping"], Color: "Default", Group: "ItemFeet", blockfeet: true, power: 4, weight: 2,
		escapeChance: {"Struggle": 0.0, "Cut": -0.4, "Remove": 10, "Pick": 2.5}, enemyTags: {"trap":100}, playerTags: {}, minLevel: 0, floors: [], shrine: ["Metal", "Cuffs"]},
	{inventory: true, name: "TrapBelt", Asset: "PolishedChastityBelt", OverridePriority: 26, Color: "Default", Group: "ItemPelvis", chastity: true, power: 4, weight: 0,
		escapeChance: {"Struggle": 0.0, "Cut": -0.10, "Remove": 10.0, "Pick": 0.5}, enemyTags: {"trap":100, "maidRestraints": 51, "maidRestraintsLight": 51}, playerTags: {"ItemVulvaEmpty" : -50, "ItemVulvaPiercingsEmpty" : -50}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Metal", "Chastity"]},
	{inventory: true, name: "TrapVibe", Asset: "TapedClitEgg", Color: "Default", Group: "ItemVulvaPiercings", vibeType: "Charging", intensity: 1, orgasm: false, power: 1, battery: 0, maxbattery: 8, weight: 2,
		escapeChance: {"Struggle": 10}, enemyTags: {"trap":100, "maidRestraintsLight": 5}, playerTags: {}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Vibes"]},
	{inventory: true, name: "TrapMittens", Asset: "LeatherMittens", Color: "Default", Group: "ItemHands", power: 8, weight: 0,
		escapeChance: {"Struggle": 0.05, "Cut": 0.8, "Remove": 0.15, "Pick": 1.0}, enemyTags: {"leatherRestraintsHeavy":6}, playerTags: {"ItemHandsFull":-2}, minLevel: 0, floors: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Leather", "Mittens"]},

	{inventory: true, name: "MaidCBelt", Asset: "PolishedChastityBelt", OverridePriority: 26, Color: "Default", Group: "ItemPelvis", chastity: true, power: 9, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": -0.25, "Remove": 0.5, "Pick": 0.12}, enemyTags: {"trap":100, "maidVibeRestraints": 200, "maidVibeRestraintsLimited": 100}, playerTags: {"ItemVulvaEmpty" : -50, "ItemVulvaPiercingsEmpty" : -50}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Metal", "Chastity"]},
	{inventory: true, name: "MaidVibe", Asset: "TapedClitEgg", Color: "Default", Group: "ItemVulvaPiercings", vibeType: "ChargingRemote", intensity: 3, orgasm: true, power: 1, battery: 0, maxbattery: 9, weight: 2, escapeChance: {"Struggle": 10}, enemyTags: {"maidVibeRestraints": 1000, "maidVibeRestraintsLimited": 100}, playerTags: {}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Vibes"]},

	{inventory: true, name: "MagicGag", Asset: "BallGag", Type: "Tight", Color: ["Default", "Default"], Group: "ItemMouth", DefaultLock: "Red", power: 5, weight: 2, escapeChance: {"Struggle": 0.0, "Cut": 0.45, "Remove": 0.65, "Pick": 0.5}, enemyTags: {"ballGagRestraints" : 4}, playerTags: {}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Leather", "Gags"]},
	{inventory: true, name: "PanelGag", Asset: "HarnessPanelGag", Color: "#888888", Group: "ItemMouth2", power: 5, weight: 2, escapeChance: {"Struggle": 0, "Cut": 0.3, "Remove": 0.4, "Pick": 0.5}, enemyTags: {"leatherRestraintsHeavy":8, "ropeAuxiliary": 4}, playerTags: {}, minLevel: 0, floors: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Leather", "Gags"]},

	{inventory: true, name: "ClothGag", Asset: "ClothGag", Type: "OTN", Color: "#888888", Group: "ItemMouth2", power: 0.1, weight: 2, escapeChance: {"Struggle": 0.5, "Cut": 1.0, "Remove": 0.8}, enemyTags: {"clothRestraints":8}, playerTags: {}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Leather", "Gags"]},
	{inventory: true, name: "ClothBlindfold", Asset: "ClothBlindfold", Color: "#888888", Group: "ItemHead", power: 0.1, weight: 2, escapeChance: {"Struggle": 0.5, "Cut": 1.0, "Remove": 0.8}, enemyTags: {"clothRestraints":8}, playerTags: {}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Leather", "Blindfolds"]},

	{name: "KittyGag", Asset: "HarnessPanelGag", Color: "Default", Group: "ItemMouth2", DefaultLock: "Red", power: 5, weight: 2, escapeChance: {"Struggle": 0, "Cut": 0.3, "Remove": 0.4, "Pick": 0.2}, enemyTags: {"kittyRestraints":8}, playerTags: {}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Leather", "Gags"]},
	{name: "KittyPaws", Asset: "PawMittens", Color: ["#444444","#444444","#444444","#B38295"], Group: "ItemHands", power: 5, weight: 2, escapeChance: {"Struggle": 0.1, "Cut": 0.3, "Remove": 0.4, "Pick": 0.2}, enemyTags: {"kittyRestraints":8}, playerTags: {}, minLevel: 6, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Leather", "Mittens"]},

	{inventory: true, name: "WristShackles", Asset: "WristShackles", LinkableBy: ["Wrapping", "Armbinders"], Group: "ItemArms", Type: "Behind", power: 3, weight: 2, DefaultLock: "Red", escapeChance: {"Struggle": 0.1, "Cut": -0.25, "Remove": 10, "Pick": 5}, enemyTags: {"shackleRestraints":2}, playerTags: {"ItemArmsFull":-1}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Metal", "Cuffs"]},
	{inventory: true, name: "AnkleShackles", Asset: "AnkleShackles", LinkableBy: ["Wrapping"], Group: "ItemFeet", hobble: true, power: 2, weight: 2, DefaultLock: "Red", escapeChance: {"Struggle": 0.1, "Cut": -0.3, "Remove": 10, "Pick": 5}, enemyTags: {"shackleRestraints":2}, playerTags: {"ItemFeetFull":-1}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Metal", "Cuffs"]},
	{inventory: true, name: "LegShackles", Asset: "LeatherLegCuffs", LinkableBy: ["Legbinders", "Hobbleskirts"], Group: "ItemLegs", hobble: true, Type: "Chained", Color: ["Default", "#555555", "#AAAAAA"], power: 3, weight: 2, DefaultLock: "Red", escapeChance: {"Struggle": 0.2, "Cut": -0.3, "Remove": 10, "Pick": 5}, enemyTags: {"shackleRestraints":2}, playerTags: {"ItemLegsFull":-1}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Metal", "Cuffs"]},
	{inventory: true, name: "FeetShackles", Asset: "SteelAnkleCuffs", LinkableBy: ["Wrapping"], Link: "FeetShackles2", Group: "ItemFeet", hobble: true, Type: "Chained", Color: ["Default", "Default"], power: 5, weight: 2, DefaultLock: "Red", escapeChance: {"Struggle": 0.15, "Cut": -0.3, "Remove": 10, "Pick": 5}, enemyTags: {"shackleRestraints":2}, playerTags: {"ItemFeetFull":-1}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Metal", "Cuffs"],
		events: [{trigger: "hit", type: "linkItem", chance: 0.2, noSub: 0.1, noLeash: true}]},
	{name: "FeetShackles2", Asset: "SteelAnkleCuffs", LinkableBy: ["Wrapping"], UnLink: "FeetShackles", Group: "ItemFeet", blockfeet: true, Type: "Closed", Color: ["Default", "Default"], power: 5, weight: 2, DefaultLock: "Red", escapeChance: {"Struggle": 0.15, "Cut": -0.3, "Remove": 10, "Pick": 5}, enemyTags: {"shackleRestraints":2}, playerTags: {"ItemFeetFull":-1}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Metal", "Cuffs"],
		events: [{trigger: "remove", type: "unlinkItem"}]},
	{inventory: true, name: "SteelMuzzleGag", Asset: "MuzzleGag", Group: "ItemMouth2", Color: "#999999", power: 3, weight: 2, DefaultLock: "Red", escapeChance: {"Struggle": 0.2, "Cut": -0.25, "Remove": 10, "Pick": 5}, enemyTags: {"shackleGag":1}, playerTags: {"ItemMouthFull":1}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Metal", "Gags"]},

	{curse: "5Keys", name: "GhostCollar", Asset: "OrnateCollar", Group: "ItemNeck", magic: true, Color: ["#555555", "#AAAAAA"], power: 20, weight: 0, difficultyBonus: 30, escapeChance: {"Struggle": -100, "Cut": -0.8, "Remove": -100}, enemyTags: {}, playerTags: {}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: []},

	{name: "SturdyLeatherBeltsArms", Asset: "SturdyLeatherBelts", LinkableBy: ["Wrapping"], Type: "Three", Color: "Default", Group: "ItemArms", power: 2, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": 0.5, "Remove": 0.4}, enemyTags: {"leatherRestraints":6}, playerTags: {"ItemArmsFull":-2}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Leather", "Belts"]},
	{name: "SturdyLeatherBeltsFeet", Asset: "SturdyLeatherBelts", LinkableBy: ["Legbinders", "Hobbleskirts"], Type: "Three", Color: "Default", Group: "ItemFeet", blockfeet: true, power: 2, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": 0.5, "Remove": 0.5}, enemyTags: {"leatherRestraints":6}, playerTags: {"ItemLegsFull":-2}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Leather", "Belts"]},
	{name: "SturdyLeatherBeltsLegs", Asset: "SturdyLeatherBelts", LinkableBy: ["Wrapping"], Type: "Two", Color: "Default", Group: "ItemLegs", hobble: true, power: 2, weight: 0, escapeChance: {"Struggle": 0.2, "Cut": 0.5, "Remove": 0.5}, enemyTags: {"leatherRestraints":6}, playerTags: {"ItemFeetFull":-2}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Leather", "Belts"]},

	{name: "MaidJacket", Asset: "Bolero", Color: ["#191919", "#A3A3A3"], Group: "ItemArms", power: 9, weight: 0, strictness: 0.2, escapeChance: {"Struggle": 0.0, "Cut": 0.1, "Remove": 0.1, "Pick": 0.15},
		enemyTags: {"maidRestraints":5}, playerTags: {"ItemArmsFull":-2}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Latex", "Straitjackets"]},
	{name: "MaidBelt", Asset: "LeatherBelt", Color: "#DBDBDB", Group: "ItemLegs", hobble: true, power: 9, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": 0.05, "Remove": 0.1, "Pick": 0.25},
		enemyTags: {"maidRestraints":10, "maidRestraintsLight":1}, playerTags: {"ItemLegsFull":-2}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Leather", "Belts"]},
	{name: "MaidAnkleCuffs", Asset: "SteelAnkleCuffs", LinkableBy: ["Wrapping"], Link: "MaidAnkleCuffs2", Type: "Chained", Color: "Default", Group: "ItemFeet", hobble: true, power: 9, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": -0.25, "Remove": 0.1, "Pick": 0.15},
		enemyTags: {"maidRestraints":7}, playerTags: {"ItemFeetFull":-2}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Metal", "Cuffs"],
		events: [{trigger: "hit", type: "linkItem", chance: 0.2, noSub: 0.1, noLeash: true}]},
	{name: "MaidAnkleCuffs2", Asset: "SteelAnkleCuffs", LinkableBy: ["Wrapping"], UnLink: "MaidAnkleCuffs", Type: "Closed", Color: "Default", Group: "ItemFeet", blockfeet: true, power: 9, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": -0.25, "Remove": 0.1, "Pick": 0.15},
		enemyTags: {"maidRestraints":7}, playerTags: {"ItemFeetFull":-2}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Metal", "Cuffs"],
		events: [{trigger: "remove", type: "unlinkItem"}]},
	{name: "MaidCollar", Asset: "HighCollar", Color: ["#C9C9C9", "#FFFFFF"], Group: "ItemNeck", power: 11, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": -0.25, "Remove": 0.4, "Pick": 0.0},
		enemyTags: {"maidRestraints":3, "maidCollar":1}, playerTags: {}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Metal", "Collars"]},
	{name: "MaidGag", Asset: "DildoPlugGag", Color: "Default", Type:"Plug", Group: "ItemMouth", power: 9, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": 0.05, "Remove": 0.33, "Pick": 0.15},
		enemyTags: {"maidRestraints":7}, playerTags: {}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Leather", "Gags"]},

	{name: "DragonStraps", Asset: "ThinLeatherStraps", LinkableBy: ["Boxbinders"], Color: "#9B1818", Group: "ItemArms", power: 9, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": -0.05, "Remove": 0.1, "Pick": 0.25}, enemyTags: {"dragonRestraints":6}, playerTags: {"ItemArmsFull":-2}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Leather", "Belts"]},
	{name: "DragonLegCuffs", Asset: "LeatherLegCuffs", LinkableBy: ["Legbinders", "Hobbleskirts"], Type: "Chained", Color: ["Default", "#9B1818", "#675F50"], Group: "ItemLegs", hobble: true, power: 9, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": -0.05, "Remove": 0.3, "Pick": 0.25}, enemyTags: {"dragonRestraints":6}, playerTags: {"ItemLegsFull":-2}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Leather", "Cuffs"]},
	{name: "DragonAnkleCuffs", Asset: "LeatherAnkleCuffs", LinkableBy: ["Wrapping"], Link: "DragonAnkleCuffs2", Type: "Chained", Color: ["Default", "#9B1818", "#675F50"], Group: "ItemFeet", hobble: true, power: 9, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": -0.05, "Remove": 0.3, "Pick": 0.25}, enemyTags: {"dragonRestraints":6}, playerTags: {"ItemFeetFull":-2}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Leather", "Cuffs"],
		events: [{trigger: "hit", type: "linkItem", chance: 0.2, noSub: 0.1, noLeash: true}]},
	{name: "DragonAnkleCuffs2", Asset: "LeatherAnkleCuffs", LinkableBy: ["Wrapping"], UnLink: "DragonAnkleCuffs", Type: "Closed", Color: ["Default", "#9B1818", "#675F50"], Group: "ItemFeet", blockfeet: true, power: 9, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": -0.05, "Remove": 0.3, "Pick": 0.25}, enemyTags: {"dragonRestraints":6}, playerTags: {"ItemFeetFull":-2}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Leather", "Cuffs"],
		events: [{trigger: "remove", type: "unlinkItem"}]},
	{name: "DragonBoots", Asset: "BalletWedges", Color: "#424242", Group: "ItemBoots", hobble: true, power: 9, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": -0.05, "Remove": 0.05, "Pick": 0.25}, enemyTags: {"dragonRestraints":6}, playerTags: {"ItemFeetFull":-2}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Leather", "Boots"]},
	{name: "DragonBallGag", Asset: "FuturisticHarnessBallGag", Color: ['#680000', '#680000', '#680000', '#680000', '#680000'], Group: "ItemMouth", power: 9, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": -0.05, "Remove": 0.05, "Pick": 0.25}, enemyTags: {"dragonRestraints":6}, playerTags: {"ItemFeetFull":-2}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Leather", "Gags"]},
	{name: "DragonMuzzleGag", Asset: "StitchedMuzzleGag", Color: "#9B1818", Group: "ItemMouth3", power: 9, weight: -6, escapeChance: {"Struggle": 0.05, "Cut": 0.0, "Remove": 0.1}, enemyTags: {"dragonRestraints":6}, playerTags: {"ItemMouthFull":4, "ItemMouth2Full":4}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Leather", "Gags"]},
	{name: "DragonCollar", Asset: "LatexCollar2", Color: "#9B1818", Group: "ItemNeck", power: 9, weight: 4, escapeChance: {"Struggle": 0.0, "Cut": -0.1, "Remove": 0.1}, enemyTags: {"dragonRestraints":6}, playerTags: {"ItemNeckFull":-2}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Leather", "Gags"]},

	{inventory: true, name: "ObsidianLegCuffs", Asset: "OrnateLegCuffs", LinkableBy: ["Legbinders", "Hobbleskirts"], Type: "Chained", Color: ["#675F50", "#171222", "#9B63C5"], Group: "ItemLegs", hobble: true, power: 9, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": -0.2, "Remove": 0.2, "Pick": 0.25}, enemyTags: {"obsidianRestraints":6}, playerTags: {"ItemLegsFull":-2}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Metal", "Cuffs"]},
	{inventory: true, name: "ObsidianAnkleCuffs", Asset: "OrnateAnkleCuffs", LinkableBy: ["Wrapping"], Link: "ObsidianAnkleCuffs2", Type: "Chained", Color: ["#675F50", "#171222", "#9B63C5"], Group: "ItemFeet", hobble: true, power: 9, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": -0.2, "Remove": 0.2, "Pick": 0.25}, enemyTags: {"obsidianRestraints":6}, playerTags: {"ItemFeetFull":-2}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Metal", "Cuffs"],
		events: [{trigger: "hit", type: "linkItem", chance: 0.2, noSub: 0.1, noLeash: true}]},
	{inventory: true, name: "ObsidianAnkleCuffs2", Asset: "OrnateAnkleCuffs", LinkableBy: ["Wrapping"], UnLink: "ObsidianAnkleCuffs", Type: "Closed", Color: ["#675F50", "#171222", "#9B63C5"], Group: "ItemFeet", blockfeet: true, power: 9, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": -0.2, "Remove": 0.2, "Pick": 0.25}, enemyTags: {"obsidianRestraints":6}, playerTags: {"ItemFeetFull":-2}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Metal", "Cuffs"],
		events: [{trigger: "remove", type: "unlinkItem"}]},
	{nonbinding: true, inventory: true, name: "ObsidianArmCuffs", Asset: "OrnateCuffs", LinkableBy: ["Armbinders", "Straitjackets", "Boxbinders"], Link: "ObsidianArmCuffs2", Color: ["#171222", "#9B63C5"], Group: "ItemArms", power: 9, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": -0.2, "Remove": 0.4, "Pick": 0.35}, enemyTags: {"obsidianRestraints":24}, playerTags: {"ItemArmsFull":-2}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Metal", "Cuffs"],
		events: [{trigger: "hit", type: "linkItem", chance: 0.33}, {trigger: "defeat", type: "linkItem", chance: 1.0}]},
	{name: "ObsidianArmCuffs2", Asset: "OrnateCuffs", Type: "Wrist", LinkableBy: ["Armbinders", "Boxbinders"], Link: "ObsidianArmCuffs3", UnLink: "ObsidianArmCuffs", Color: ["#171222", "#9B63C5"], Group: "ItemArms", power: 9, weight: 0, escapeChance: {"Struggle": -0.1, "Cut": -0.2, "Remove": 0.2, "Pick": 0.25}, helpChance: {"Remove": 0.4}, enemyTags: {}, playerTags: {}, minLevel: 0, floors: [], shrine: ["Metal", "Cuffs"],
		events: [{trigger: "remove", type: "unlinkItem"}, {trigger: "hit", type: "linkItem", chance: 0.33}]},
	{name: "ObsidianArmCuffs3", Asset: "OrnateCuffs", Type: "Both", LinkableBy: ["Armbinders"], UnLink: "ObsidianArmCuffs4", Color: ["#171222", "#9B63C5"], Group: "ItemArms", power: 9, weight: 0, strictness: 0.1, escapeChance: {"Struggle": -0.1, "Cut": -0.2, "Remove": -0.2, "Pick": 0.25}, helpChance: {"Remove": 0.4}, enemyTags: {}, playerTags: {}, minLevel: 0, floors: [], shrine: ["Metal", "Cuffs"],
		events: [{trigger: "remove", type: "unlinkItem"}]},
	{name: "ObsidianArmCuffs4", Asset: "OrnateCuffs", Type: "Elbow", LinkableBy: ["Armbinders"], Link: "ObsidianArmCuffs3", UnLink: "ObsidianArmCuffs", Color: ["#171222", "#9B63C5"], Group: "ItemArms", power: 9, weight: 0, escapeChance: {"Struggle": -0.1, "Cut": -0.2, "Remove": 0, "Pick": 0.25}, helpChance: {"Remove": 0.4}, enemyTags: {}, playerTags: {}, minLevel: 0, floors: [], shrine: ["Metal", "Cuffs"],
		events: [{trigger: "remove", type: "unlinkItem"}, {trigger: "hit", type: "linkItem", chance: 0.5}]},
	{inventory: true, name: "ObsidianGag", Asset: "MuzzleGag", Color: ["#1C1847", "#1C1847"], Group: "ItemMouth3", power: 9, weight: -7, escapeChance: {"Struggle": -0.1, "Cut": -0.2, "Remove": 0.2, "Pick": 0.25}, enemyTags: {"obsidianRestraints":8}, playerTags: {"ItemMouth3Full":-2, "ItemMouth2Full":2, "ItemMouth1Full":2}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Metal", "Gags"]},
	{inventory: true, name: "ObsidianCollar", Asset: "OrnateCollar", Color: ["#171222", "#9B63C5"], Group: "ItemNeck", power: 9, weight: -7, escapeChance: {"Struggle": -0.1, "Cut": -0.2, "Remove": 0.2, "Pick": 0.25}, enemyTags: {"obsidianRestraints":4}, playerTags: {}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Metal", "Gags"]},

	{removePrison: true, name: "IceArms", sfx: "Freeze", Asset: "Ribbons", Type: "Heavy", Color: "#5DA9E5", Group: "ItemArms", power: 4, weight: 0, magic: true, escapeChance: {"Struggle": 0.15, "Cut": 0.05, "Remove": 0}, enemyTags: {"iceRestraints":4}, playerTags: {"ItemArmsFull":-2}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Rope"],
		events: [{trigger: "tick", type: "iceDrain", power: -0.025}]},
	{removePrison: true, name: "IceLegs", sfx: "Freeze", Asset: "Ribbons", Type: "MessyWrap", Color: "#5DA9E5", Group: "ItemLegs", hobble: true, power: 4, weight: 0, magic: true, escapeChance: {"Struggle": 0.15, "Cut": 0.05, "Remove": 0}, enemyTags: {"iceRestraints":4}, playerTags: {"ItemLegsFull":-2}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Rope"],
		events: [{trigger: "tick", type: "iceDrain", power: -0.025}]},
	{removePrison: true, name: "IceHarness", sfx: "Freeze", Asset: "Ribbons", Type: "Harness2", Color: "#5DA9E5", Group: "ItemTorso", power: 1, harness: true, weight: 0, magic: true, escapeChance: {"Struggle": 0.15, "Cut": 0.05, "Remove": 0}, enemyTags: {"iceRestraints":4}, playerTags: {"ItemTorsoFull":-2}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Rope"],
		events: [{trigger: "tick", type: "iceDrain", power: -0.025}]},
	{removePrison: true, name: "IceGag", sfx: "Freeze", Asset: "Ribbons", Color: "#5DA9E5", Group: "ItemMouth", power: 4, harness: true, weight: 0, magic: true, escapeChance: {"Struggle": 0.15, "Cut": 0.05, "Remove": 0}, enemyTags: {"iceRestraints":4}, playerTags: {"ItemMouthFull":-2}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Rope"],
		events: [{trigger: "tick", type: "iceDrain", power: -0.025}]},

	{removePrison: true, name: "CableArms", sfx: "FutureLock", Asset: "Ribbons", Color: "#7D7D7D", Group: "ItemArms", power: 6, weight: 0, magic: true, escapeChance: {"Struggle": 0.1, "Cut": 0.00, "Remove": 0.1, "Pick": 0.35}, enemyTags: {"hitechCables":4}, playerTags: {"ItemArmsFull":-2}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Metal"]},
	{removePrison: true, name: "CableLegs", sfx: "FutureLock", Asset: "Ribbons", Type: "Cross", Color: "#7D7D7D", Group: "ItemLegs", hobble: true, power: 6, weight: 0, magic: true, escapeChance: {"Struggle": 0.1, "Cut": 0.0, "Remove": 0.1, "Pick": 0.35}, enemyTags: {"hitechCables":4}, playerTags: {"ItemLegsFull":-2}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Metal"]},
	{removePrison: true, name: "CableHarness", sfx: "FutureLock", Asset: "Ribbons", Type: "Harness1", Color: "#7D7D7D", Group: "ItemTorso", power: 2, harness: true, weight: 0, magic: true, escapeChance: {"Struggle": 0.1, "Cut": 0.0, "Remove": 0.1}, enemyTags: {"hitechCables":4}, playerTags: {"ItemTorsoFull":-2}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Metal"]},

	{name: "CableGag", Asset: "DeepthroatGag", sfx: "FutureLock", Color: "Default", Group: "ItemMouth", DefaultLock: "Red", power: 5, weight: 2, escapeChance: {"Struggle": 0.0, "Cut": 0.0, "Remove": 0.5, "Pick": 0.35}, enemyTags: {"cableGag":3}, playerTags: {}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Metal", "Gags"]},

	{name: "RopeSnakeArms", Asset: "HempRope", Color: "Default", LinkableBy: ["Boxbinders"], Group: "ItemArms", power: 1, weight: 0, escapeChance: {"Struggle": 0.3, "Cut": 0.67, "Remove": 0.1}, enemyTags: {"ropeRestraints":4}, playerTags: {"ItemArmsFull":-1}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Rope"]},
	{name: "RopeSnakeArmsWrist", Asset: "HempRope", Type: "WristElbowHarnessTie", LinkableBy: ["Armbinders"], Color: "Default", Group: "ItemArms", power: 1, weight: 0, escapeChance: {"Struggle": 0.3, "Cut": 0.67, "Remove": 0.2}, enemyTags: {"ropeRestraintsWrist":4}, playerTags: {"ItemArmsFull":-1}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Rope"]},
	{name: "RopeSnakeFeet", Asset: "HempRope", Color: "Default", LinkableBy: ["Wrapping"], Group: "ItemFeet", blockfeet: true, power: 1, weight: 0, escapeChance: {"Struggle": 0.3, "Cut": 0.67, "Remove": 0.15}, enemyTags: {"ropeRestraints":4}, playerTags: {"ItemLegsFull":-1}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Rope"]},
	{name: "RopeSnakeLegs", Asset: "HempRope", Type: "FullBinding", LinkableBy: ["Legbinders", "Hobbleskirts"], Color: "Default", Group: "ItemLegs", hobble: true, power: 1, weight: 0, escapeChance: {"Struggle": 0.25, "Cut": 0.67, "Remove": 0.15}, enemyTags: {"ropeRestraints":4}, playerTags: {"ItemFeetFull":-1}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Rope"]},
	{name: "RopeSnakeTorso", Asset: "HempRopeHarness", Type: "Waist", OverridePriority: 26, Color: "Default", Group: "ItemTorso", power: 1, weight: 0, harness: true, escapeChance: {"Struggle": 0.1, "Cut": 0.67, "Remove": 0.3}, enemyTags: {"ropeRestraints2":4}, playerTags: {"ItemTorsoFull":-3}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Rope"]},
	{name: "RopeSnakeCrotch", crotchrope: true, Asset: "HempRope", Type: "OverPanties", OverridePriority: 26, Color: "Default", Group: "ItemPelvis", power: 1, weight: 0, chastity: true, harness: true, escapeChance: {"Struggle": 0.1, "Cut": 0.67, "Remove": 0.15}, enemyTags: {"ropeRestraints2":4}, playerTags: {"ItemPelvisFull":-3}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Rope"]},

	{removePrison: true, name: "VinePlantArms", Asset: "HempRope", Color: "#00FF44", Group: "ItemArms", power: 0.1, weight: 0, escapeChance: {"Struggle": 0.3, "Cut": 0.8, "Remove": 0.2}, enemyTags: {"vineRestraints":4}, playerTags: {"ItemArmsFull":-1}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Rope"]},
	{removePrison: true, name: "VinePlantFeet", Asset: "HempRope", Color: "#00FF44", Group: "ItemFeet", blockfeet: true, power: 0.1, weight: 0, escapeChance: {"Struggle": 0.3, "Cut": 0.8, "Remove": 0.2}, enemyTags: {"vineRestraints":4}, playerTags: {"ItemLegsFull":-1}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Rope"]},
	{removePrison: true, name: "VinePlantLegs", Asset: "HempRope", Color: "#00FF44", Group: "ItemLegs", hobble: true, power: 0.1, weight: 0, escapeChance: {"Struggle": 0.3, "Cut": 0.8, "Remove": 0.2}, enemyTags: {"vineRestraints":4}, playerTags: {"ItemFeetFull":-1}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Rope"]},
	{removePrison: true, name: "VinePlantTorso", Asset: "HempRopeHarness", Type: "Diamond", OverridePriority: 26, Color: "#00FF44", Group: "ItemTorso", power: 0.1, weight: 0, harness: true, escapeChance: {"Struggle": 0.3, "Cut": 0.8, "Remove": 0.2}, enemyTags: {"vineRestraints":4}, playerTags: {"ItemTorsoFull":-3}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Rope"]},

	{name: "ChainArms", Asset: "Chains", Type: "WristElbowHarnessTie", LinkableBy: ["Armbinders"], Color: "Default", Group: "ItemArms", power: 5, weight: 0, escapeChance: {"Struggle": 0.1, "Cut": -0.1, "Remove": 0.3, "Pick": 1.5}, enemyTags: {"chainRestraints":2}, playerTags: {"ItemArmsFull":-1}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Chains", "Metal"]},
	{name: "ChainLegs", Asset: "Chains", Type: "Strict", Color: "Default", LinkableBy: ["Legbinders", "Hobbleskirts"], Group: "ItemLegs", hobble: true, power: 5, weight: 0, escapeChance: {"Struggle": 0.15, "Cut": -0.1, "Remove": 0.3, "Pick": 1.5}, enemyTags: {"chainRestraints":2}, playerTags: {"ItemLegsFull":-1}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Chains", "Metal"]},
	{name: "ChainFeet", Asset: "Chains", Color: "Default", LinkableBy: ["Wrapping"], Group: "ItemFeet", blockfeet: true, power: 5, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": -0.1, "Remove": 0.3, "Pick": 1.5}, enemyTags: {"chainRestraints":2}, playerTags: {"ItemFeetFull":-1}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Chains", "Metal"]},
	{name: "ChainCrotch", Asset: "CrotchChain", crotchrope: true, OverridePriority: 26, Color: "Default", Group: "ItemTorso", power: 3, weight: 0, chastity: true, harness: true, escapeChance: {"Struggle": 0.0, "Cut": -0.1, "Remove": 0.3, "Pick": 1.5}, enemyTags: {"chainRestraints":2}, playerTags: {"ItemPelvisFull":-1}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Chains", "Metal"]},

	{removePrison: true, name: "MagicChainArms", Asset: "Chains", LinkableBy: ["Armbinders"], Type: "WristElbowHarnessTie", Color: "#aa00aa", Group: "ItemArms", power: 4, weight: 0, escapeChance: {"Struggle": 0.3, "Cut": -0.1, "Remove": -0.1}, enemyTags: {"chainRestraintsMagic":2}, playerTags: {"ItemArmsFull":-1}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Chains", "Metal"]},
	{removePrison: true, name: "MagicChainLegs", Asset: "Chains", LinkableBy: ["Legbinders", "Hobbleskirts"], Type: "Strict", Color: "#aa00aa", Group: "ItemLegs", hobble: true, power: 4, weight: 0, escapeChance: {"Struggle": 0.3, "Cut": -0.1, "Remove": -0.1}, enemyTags: {"chainRestraintsMagic":2}, playerTags: {"ItemLegsFull":-1}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Chains", "Metal"]},
	{removePrison: true, name: "MagicChainFeet", Asset: "Chains", LinkableBy: ["Wrapping"], Color: "#aa00aa", Group: "ItemFeet", blockfeet: true, power: 4, weight: 0, escapeChance: {"Struggle": 0.2, "Cut": -0.1, "Remove": -0.1}, enemyTags: {"chainRestraintsMagic":2}, playerTags: {"ItemFeetFull":-1}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Chains", "Metal"]},
	{removePrison: true, name: "MagicChainCrotch", crotchrope: true, Asset: "CrotchChain", OverridePriority: 26, Color: "#aa00aa", Group: "ItemTorso", power: 4, weight: 0, chastity: true, harness: true, escapeChance: {"Struggle": 0.2, "Cut": -0.1, "Remove": -0.1}, enemyTags: {"chainRestraintsMagic":2}, playerTags: {"ItemPelvisFull":-1}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Chains", "Metal"]},

	{removePrison: true, name: "ShadowChainArms", Asset: "Chains", LinkableBy: ["Boxbinders"], Type: "BoxTie", Color: "#000000", Group: "ItemArms", power: 4, weight: 0, escapeChance: {"Struggle": 0.3, "Cut": -0.1, "Remove": -0.1}, enemyTags: {"shadowRestraints":2}, playerTags: {"ItemArmsFull":-1}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Chains", "Metal"]},
	{removePrison: true, name: "ShadowChainLegs", Asset: "Chains", LinkableBy: ["Legbinders", "Hobbleskirts"], Type: "Strict", Color: "#000000", Group: "ItemLegs", hobble: true, power: 4, weight: 0, escapeChance: {"Struggle": 0.3, "Cut": -0.1, "Remove": -0.1}, enemyTags: {"shadowRestraints":2}, playerTags: {"ItemLegsFull":-1}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Chains", "Metal"]},
	{removePrison: true, name: "ShadowChainFeet", Asset: "Chains", LinkableBy: ["Wrapping"], Color: "#000000", Group: "ItemFeet", blockfeet: true, power: 4, weight: 0, escapeChance: {"Struggle": 0.2, "Cut": -0.1, "Remove": -0.1}, enemyTags: {"shadowRestraints":2}, playerTags: {"ItemFeetFull":-1}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Chains", "Metal"]},
	{removePrison: true, name: "ShadowChainCrotch", crotchrope: true, Asset: "CrotchChain", OverridePriority: 26, Color: "#000000", Group: "ItemTorso", power: 4, weight: 0, chastity: true, harness: true, escapeChance: {"Struggle": 0.2, "Cut": -0.1, "Remove": -0.1}, enemyTags: {"shadowRestraints":2}, playerTags: {"ItemPelvisFull":-1}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: ["Chains", "Metal"]},

	{name: "BasicCollar", Asset: "LeatherCollar", Color: ["#000000", "Default"], Group: "ItemNeck", power: 1, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": 0.15, "Remove": 0.5, "Pick": 0.75}, enemyTags: {"leashing":1, "maidCollar":-1}, playerTags: {"ItemNeckFull":-2}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: []},
	{removePrison: true, name: "BasicLeash", Asset: "CollarLeash", Color: "Default", Group: "ItemNeckRestraints", leash: true, power: 1, weight: -99, harness: true, escapeChance: {"Struggle": 0.0, "Cut": -0.1, "Remove": 0.5, "Pick": 1.25}, enemyTags: {"leashing":1}, playerTags: {"ItemNeckRestraintsFull":-2, "ItemNeckFull":99}, minLevel: 0, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrine: []},

];

let KDRestraintsCache = new Map();

function KinkyDungeonKeyGetPickBreakChance(modifier) {
	let mult = (modifier) ? modifier : 1.0;
	let chance = 0;

	KinkyDungeonPickBreakProgress += mult;

	if (KinkyDungeonPickBreakProgress > KinkyDungeonKeyPickBreakAmount/1.5) chance = (KinkyDungeonPickBreakProgress - KinkyDungeonKeyPickBreakAmount/1.5) / (KinkyDungeonKeyPickBreakAmount + 1);

	return chance;
}
function KinkyDungeonGetKnifeBreakChance(modifier) {
	let mult = (modifier) ? modifier : 1.0;
	let chance = 0;

	KinkyDungeonKnifeBreakProgress += mult;

	if (KinkyDungeonKnifeBreakProgress > KinkyDungeonKnifeBreakAmount/1.5) chance = (KinkyDungeonKnifeBreakProgress - KinkyDungeonKnifeBreakAmount/1.5) / (KinkyDungeonKnifeBreakAmount + 1);

	return chance;
}
function KinkyDungeonGetEnchKnifeBreakChance(modifier) {
	let mult = (modifier) ? modifier : 1.0;
	let chance = 0;

	KinkyDungeonEnchKnifeBreakProgress += mult;

	if (KinkyDungeonEnchKnifeBreakProgress > KinkyDungeonEnchKnifeBreakAmount/1.5) chance = (KinkyDungeonEnchKnifeBreakProgress - KinkyDungeonEnchKnifeBreakAmount/1.5) / (KinkyDungeonEnchKnifeBreakAmount + 1);

	return chance;
}

function KinkyDungeonIsLockable(restraint) {
	if (restraint && restraint.escapeChance && (restraint.escapeChance.Pick != undefined || restraint.escapeChance.Unlock != undefined)) return true;
	return false;
}

function KinkyDungeonLock(item, lock) {
	if (item.restraint && InventoryGet(KinkyDungeonPlayer, item.restraint.Group) && lock != "") {
		if (KinkyDungeonIsLockable(item.restraint)) {
			item.lock = lock;
			InventoryLock(KinkyDungeonPlayer, InventoryGet(KinkyDungeonPlayer, item.restraint.Group), "IntricatePadlock", Player.MemberNumber, true);
			item.pickProgress = 0;
			if (!KinkyDungeonRestraintsLocked.includes(item.restraint.Group))
				InventoryLock(Player, InventoryGet(Player, item.restraint.Group), "IntricatePadlock", null, true);
		}
	} else {
		item.lock = lock;
		InventoryUnlock(KinkyDungeonPlayer, item.restraint.Group);
		if (!KinkyDungeonRestraintsLocked.includes(item.restraint.Group))
			InventoryUnlock(Player, item.restraint.Group);
	}

}

function KinkyDungeonGetRestraintsWithShrine(shrine) {
	let ret = [];

	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
		var item = KinkyDungeonInventory[I];
		if (item.restraint && item.restraint.shrine && item.restraint.shrine.includes(shrine)) {
			ret.push(item);
		}
	}

	return ret;
}

function KinkyDungeonRemoveRestraintsWithShrine(shrine) {
	let count = 0;

	for (let item of KinkyDungeonRestraintList()) {
		if (item.restraint && item.restraint.shrine && item.restraint.shrine.includes(shrine)) {
			KinkyDungeonRemoveRestraint(item.restraint.Group, false, false, false, true);
			count++;
		}
	}

	return count;
}

function KinkyDungeonUnlockRestraintsWithShrine(shrine) {
	let count = 0;

	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
		var item = KinkyDungeonInventory[I];
		if (item.restraint && item.lock && item.restraint.shrine && item.restraint.shrine.includes(shrine)) {

			KinkyDungeonLock(item, "");
			count++;
		}
	}

	return count;
}

function KinkyDungeonPlayerGetLockableRestraints() {
	let ret = [];

	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
		var item = KinkyDungeonInventory[I];
		if (!item.lock && item.restraint && item.restraint.escapeChance && item.restraint.escapeChance.Pick != null) {
			ret.push(item);
		}
	}

	return ret;
}

function KinkyDungeonRemoveKeys(lock) {
	if (lock.includes("Red")) KinkyDungeonRedKeys -= 1;
	if (lock.includes("Blue")) KinkyDungeonBlueKeys -= 1;
}

function KinkyDungeonGetKey(lock) {
	if (lock.includes("Red")) return "Red";
	if (lock.includes("Blue")) return "Blue";
	return "";
}

function KinkyDungeonHasGhostHelp() {
	return (KinkyDungeonTargetTile && KinkyDungeonTargetTile.Type == "Ghost" && KinkyDungeonGhostDecision <= 1);
}

function KinkyDungeonIsWearingLeash() {
	for (let restraint of KinkyDungeonRestraintList()) {
		if (restraint.restraint && restraint.restraint.leash) {
			return true;
		}
	}
	return false;
}

function KinkyDungeonHasHook() {
	for (let X = KinkyDungeonPlayerEntity.x - 1; X <= KinkyDungeonPlayerEntity.x + 1; X++) {
		for (let Y = KinkyDungeonPlayerEntity.y - 1; Y <= KinkyDungeonPlayerEntity.y + 1; Y++) {
			let tile = KinkyDungeonMapGet(X, Y);
			if (tile == 'A'
				|| tile == 'a'
				|| tile == 'c'
				|| tile == 'O'
				|| tile == 'o'
				|| tile == 'B') {
				return true;
			} else if (tile == 'C') {
				KinkyDungeonSendTextMessage(10, TextGet("KinkyDungeonNeedOpenChest"), "red", 1);
			}
		}
	}

	return KinkyDungeonHasGhostHelp();
}

function KinkyDungeonIsHandsBound(ApplyGhost) {
	return (!ApplyGhost || !KinkyDungeonHasGhostHelp()) &&
		(InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemHands"), "Block", true) || InventoryGroupIsBlockedForCharacter(KinkyDungeonPlayer, "ItemHands"));
}

function KinkyDungeonIsArmsBound(ApplyGhost) {
	return (!ApplyGhost || !KinkyDungeonHasGhostHelp()) &&
		(InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemArms"), "Block", true) || InventoryGroupIsBlockedForCharacter(KinkyDungeonPlayer, "ItemArms"));
}

function KinkyDungeonStrictness(ApplyGhost) {
	if (ApplyGhost && KinkyDungeonHasGhostHelp()) return 0;
	let strictness = 0;
	for (let inv of KinkyDungeonRestraintList()) {
		if (inv.restraint && inv.restraint.strictness && inv.restraint.strictness > strictness) strictness = inv.restraint.strictness;
	}
	return strictness;
}

function KinkyDungeonGetPickBaseChance() {
	return 0.33 / (1.0 + 0.02 * MiniGameKinkyDungeonLevel);
}

// Note: This is for tiles (doors, chests) only!!!
function KinkyDungeonPickAttempt() {
	let Pass = "Fail";
	let escapeChance = KinkyDungeonGetPickBaseChance();
	var cost = KinkyDungeonStatStaminaCostPick;
	let lock = KinkyDungeonTargetTile.Lock;
	if (!KinkyDungeonTargetTile.pickProgress) KinkyDungeonTargetTile.pickProgress = 0;

	KinkyDungeonSleepTurns = 0;

	if (lock.includes("Blue")) {
		if ((KinkyDungeonPlayer.IsBlind() < 1) || !lock.includes("Blue"))
			KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonStruggleUnlockNo" + ((KinkyDungeonPlayer.IsBlind() > 0) ? "Unknown" : lock) + "Key"), "orange", 2);
		else
			KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonStruggleCantPickBlueLock"), "orange", 2);
		Pass = "Fail";
	}

	let handsBound = KinkyDungeonIsHandsBound();
	let armsBound = KinkyDungeonIsArmsBound();
	let strict = KinkyDungeonStrictness();
	if (!strict) strict = 0;
	if (!KinkyDungeonPlayer.CanInteract()) escapeChance /= 2;
	if (armsBound) escapeChance = Math.max(0.0, escapeChance - 0.25);
	if (handsBound && strict < 0.5) escapeChance = Math.max(0, escapeChance - 0.5);
	else if (strict) escapeChance = Math.max(0, escapeChance - strict);

	escapeChance /= 1.0 + KinkyDungeonStatArousal/KinkyDungeonStatArousalMax*KinkyDungeonArousalUnlockSuccessMod;

	if (!KinkyDungeonHasStamina(-cost, true)) {
		KinkyDungeonWaitMessage(true);
	} else if (KinkyDungeonTargetTile && KinkyDungeonTargetTile.pickProgress >= 1){//Math.random() < escapeChance
		Pass = "Success";
		if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Unlock.ogg");
	} else if (Math.random() < KinkyDungeonKeyGetPickBreakChance() || lock.includes("Blue")) { // Blue locks cannot be picked or cut!
		Pass = "Break";
		KinkyDungeonLockpicks -= 1;
		KinkyDungeonPickBreakProgress = 0;
		if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/PickBreak.ogg");
	} else if (handsBound || (armsBound && Math.random() < KinkyDungeonItemDropChanceArmsBound)) {
		KinkyDungeonDropItem({name: "Pick"});
		KinkyDungeonLockpicks -= 1;
		if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Miss.ogg");
	} else {
		KinkyDungeonTargetTile.pickProgress += escapeChance;
		if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Pick.ogg");
	}
	KinkyDungeonSendActionMessage(2, TextGet("KinkyDungeonAttemptPick" + Pass).replace("TargetRestraint", TextGet("KinkyDungeonObject")), (Pass == "Success") ? "lightgreen" : "red", 1);
	KinkyDungeonChangeStamina(cost);
	return Pass == "Success";
}

function KinkyDungeonUnlockAttempt(lock) {
	let Pass = "Fail";
	let escapeChance = 1.0;

	KinkyDungeonSleepTurns = 0;

	let handsBound = KinkyDungeonIsHandsBound();
	let armsBound = KinkyDungeonIsArmsBound();
	let strict = KinkyDungeonStrictness();
	if (!strict) strict = 0;
	if (!KinkyDungeonPlayer.CanInteract()) escapeChance /= 2;
	if (armsBound) escapeChance = Math.max(0.1, escapeChance - 0.25);
	if (handsBound && strict < 0.5) escapeChance = Math.max(0, escapeChance - 0.5);
	else if (strict) escapeChance = Math.max(0, escapeChance - strict);

	if (Math.random() < escapeChance)
		Pass = "Success";
	KinkyDungeonSendActionMessage(2, TextGet("KinkyDungeonStruggleUnlock" + Pass).replace("TargetRestraint", TextGet("KinkyDungeonObject")), (Pass == "Success") ? "lightgreen" : "red", 1);
	if (Pass == "Success") {
		KinkyDungeonRemoveKeys(lock);
		if (lock == "Blue" && KinkyDungeonTargetTile && KinkyDungeonTargetTile.Loot == "normal") KinkyDungeonSpecialLoot = true;
		if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Unlock.ogg");
		return true;
	} else if (handsBound || (armsBound && Math.random() < KinkyDungeonItemDropChanceArmsBound)) {
		let keytype = KinkyDungeonGetKey(lock);
		KinkyDungeonDropItem({name: keytype+"Key"});
		if (keytype == "Blue") KinkyDungeonBlueKeys -= 1;
		else if (keytype == "Red") KinkyDungeonRedKeys -= 1;
		if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Miss.ogg");
	} else {
		if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Pick.ogg");
	}
	return false;
}

let KinkyDungeonCurrentEscapingItem = null;
let KinkyDungeonCurrentEscapingMethod = null;

// Lockpick = use tool or cut
// Otherwise, just a normal struggle
function KinkyDungeonStruggle(struggleGroup, StruggleType) {
	let restraint = KinkyDungeonGetRestraintItem(struggleGroup.group);
	KinkyDungeonCurrentEscapingItem = restraint;
	KinkyDungeonCurrentEscapingMethod = StruggleType;
	KinkyDungeonStruggleTime = CommonTime() + 750;
	let cost = KinkyDungeonStatStaminaCostStruggle;
	if (StruggleType == "Cut") cost = KinkyDungeonStatStaminaCostTool;
	else if (StruggleType == "Pick") cost = KinkyDungeonStatStaminaCostPick;
	else if (StruggleType == "Remove") cost = KinkyDungeonStatStaminaCostRemove;
	else if (StruggleType == "Unlock") cost = KinkyDungeonStatStaminaCostPick;
	KinkyDungeonSleepTurns = 0;
	if (StruggleType == "Unlock") cost = 0;
	let Pass = "Fail";
	let origEscapeChance = restraint.restraint.escapeChance[StruggleType];
	let restraintEscapeChance = origEscapeChance;
	if (KinkyDungeonHasGhostHelp() && restraint.restraint.helpChance && restraint.restraint.helpChance[StruggleType]) {
		restraintEscapeChance = restraint.restraint.helpChance[StruggleType];
	}
	let escapeChance = (restraintEscapeChance != null) ? restraintEscapeChance : 1.0;
	if (!restraint.removeProgress) restraint.removeProgress = 0;
	if (!restraint.pickProgress) restraint.pickProgress = 0;
	if (!restraint.struggleProgress) restraint.struggleProgress = 0;
	if (!restraint.unlockProgress) restraint.unlockProgress = 0;
	if (!restraint.cutProgress) restraint.cutProgress = 0;

	let increasedAttempts = false;

	let handsBound = KinkyDungeonIsHandsBound(true);

	if (StruggleType == "Cut" && KinkyDungeonPlayerWeapon && KinkyDungeonPlayerWeapon.cutBonus) escapeChance += KinkyDungeonPlayerWeapon.cutBonus;
	if (StruggleType == "Cut" && KinkyDungeonEnchantedBlades > 0) escapeChance += KinkyDungeonEnchantedKnifeBonus;

	// Finger extensions will help if your hands are unbound. Some items cant be removed without them!
	if (StruggleType == "Remove" && !handsBound && (KinkyDungeonNormalBlades > 0 || KinkyDungeonEnchantedBlades > 0 || KinkyDungeonLockpicks > 0))
		escapeChance = Math.min(1, escapeChance + 0.15);

	if (escapeChance <= 0) {
		if (!restraint.attempts) restraint.attempts = 0;
		if (restraint.attempts < KinkyDungeonMaxImpossibleAttempts) {
			increasedAttempts = true;
			restraint.attempts += 0.5;
			if (escapeChance <= -0.5) restraint.attempts += 0.5;
		} else {
			let typesuff = "";
			if (origEscapeChance <= 0 && restraint.restraint.helpChance && restraint.restraint.helpChance[StruggleType] > 0) typesuff = "3";
			else if (restraintEscapeChance < 0) typesuff = "2";
			if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Struggle.ogg");
			if (typesuff == "" && KinkyDungeonStatArousal > KinkyDungeonStatArousalMax*0.1) typesuff = typesuff + "Aroused";
			KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonStruggle" + StruggleType + "Impossible" + typesuff), "red", 1);
			KinkyDungeonSendInventoryEvent("struggle", {
				restraint: restraint,
				group: struggleGroup,
				struggletype: StruggleType,
				result: "Impossible",
			});
			return "Impossible";
		}
	}

	let armsBound = KinkyDungeonIsArmsBound(true);
	let strict = KinkyDungeonStrictness(true);
	let hasEdge = KinkyDungeonHasHook();

	// Struggling is unaffected by having arms bound
	let minAmount = 0.1 - Math.max(0, 0.01*restraint.restraint.power);
	if (StruggleType == "Remove" && !hasEdge) minAmount = 0;
	if (!KinkyDungeonHasGhostHelp() && StruggleType != "Struggle" && (struggleGroup.group != "ItemArms" && struggleGroup.group != "ItemHands" ) && !KinkyDungeonPlayer.CanInteract()) escapeChance /= 1.5;
	if (StruggleType != "Struggle" && struggleGroup.group != "ItemArms" && armsBound) escapeChance = Math.max(minAmount, escapeChance - 0.3);

	// Strict bindings make it harder to escape
	if (strict) escapeChance = Math.max(0, escapeChance - strict);
	// Covered hands makes it harder to unlock, and twice as hard to remove
	if ((StruggleType == "Pick" || StruggleType == "Unlock" || StruggleType == "Remove") && struggleGroup.group != "ItemHands" && handsBound)
		escapeChance = (StruggleType == "Remove" && hasEdge) ? escapeChance / 2 : Math.max(0, escapeChance - 0.5);

	if (StruggleType == "Remove" && escapeChance == 0) {
		let typesuff = "";
		if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Struggle.ogg");
		if (typesuff == "" && KinkyDungeonStatArousal > KinkyDungeonStatArousalMax*0.1) typesuff = typesuff + "Aroused";
		KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonStruggle" + StruggleType + "NeedEdge" + typesuff), "red", 1);
		KinkyDungeonSendInventoryEvent("struggle", {
			restraint: restraint,
			group: struggleGroup,
			struggletype: StruggleType,
			result: "NeedEdge",
		});
		return "NeedEdge";
	}

	if (!KinkyDungeonHasGhostHelp() && (StruggleType == "Pick" || StruggleType == "Unlock" || StruggleType == "Remove")) escapeChance /= 1.0 + KinkyDungeonStatArousal/KinkyDungeonStatArousalMax*KinkyDungeonArousalUnlockSuccessMod;

	// Items which require a knife are much harder to cut without one
	if (StruggleType == "Cut" && KinkyDungeonNormalBlades <= 0 && KinkyDungeonEnchantedBlades <= 0 && restraintEscapeChance > 0.01) escapeChance/= 5;

	if (InventoryGroupIsBlockedForCharacter(KinkyDungeonPlayer, struggleGroup.group)) escapeChance = 0;

	// Blue locks make it harder to escape an item
	if (restraint.lock == "Blue" && (StruggleType == "Cut" || StruggleType == "Remove" || StruggleType == "Struggle")) escapeChance = Math.max(0, escapeChance - 0.15);

	if (StruggleType == "Cut" && struggleGroup.group != "ItemHands" && handsBound)
		escapeChance = escapeChance / 2;

	// Struggling is affected by tightness
	if (escapeChance > 0 && StruggleType == "Struggle") {
		for (let T = 0; T < restraint.tightness; T++) {
			escapeChance *= 0.8; // Tougher for each tightness, however struggling will reduce the tightness
		}
	}

	if (StruggleType == "Pick") escapeChance *= KinkyDungeonGetPickBaseChance();

	let belt = null;
	let bra = null;

	if (struggleGroup.group != "ItemVulva" || struggleGroup.group != "ItemVulvaPiercings" || struggleGroup.group != "ItemButt") belt = KinkyDungeonGetRestraintItem("ItemPelvis");
	if (belt && belt.chastity) escapeChance = 0.0;

	if (struggleGroup.group != "ItemNipples" || struggleGroup.group != "ItemNipplesPiercings") bra = KinkyDungeonGetRestraintItem("ItemBreast");
	if (bra && bra.chastity) escapeChance = 0.0;

	if (escapeChance <= 0) {
		if (!restraint.attempts) restraint.attempts = 0;
		if (restraint.attempts < KinkyDungeonMaxImpossibleAttempts || increasedAttempts) {
			if (!increasedAttempts) {
				restraint.attempts += 0.5;
				if (escapeChance <= -0.5) restraint.attempts += 0.5;
			}
		} else {
			if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Struggle.ogg");
			let suff = "";
			if (KinkyDungeonStatArousal > KinkyDungeonStatArousalMax*0.1) suff = suff + "Aroused";
			KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonStruggle" + StruggleType + "ImpossibleBound" + suff), "red", 1);
			KinkyDungeonSendInventoryEvent("struggle", {
				restraint: restraint,
				group: struggleGroup,
				struggletype: StruggleType,
				result: "Impossible",
			});
			return "Impossible";
		}
	}

	// Handle cases where you can't even attempt to unlock
	if ((StruggleType == "Unlock" && !((restraint.lock == "Red" && KinkyDungeonRedKeys > 0) || (restraint.lock == "Blue" && KinkyDungeonBlueKeys > 0)))
		|| (StruggleType == "Pick" && (restraint.lock == "Blue"))) {
		if ((KinkyDungeonPlayer.IsBlind() < 1) || !restraint.lock.includes("Blue"))
			KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonStruggleUnlockNo" + ((KinkyDungeonPlayer.IsBlind() > 0) ? "Unknown" : restraint.lock) + "Key"), "orange", 2);
		else
			KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonStruggleCantPickBlueLock"), "orange", 2);
	} else {

		// Main struggling block
		if (!KinkyDungeonHasStamina(-cost, true)) {
			if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Struggle.ogg");
			KinkyDungeonWaitMessage(true);
		} else {
			// Pass block
			if (((StruggleType == "Cut" && restraint.cutProgress >= 1 - escapeChance)
					|| (StruggleType == "Pick" && restraint.pickProgress >= 1 - escapeChance)
					|| (StruggleType == "Unlock" && restraint.unlockProgress >= 1 - escapeChance)
					|| (StruggleType == "Remove" && restraint.removeProgress >= 1 - escapeChance)
					|| (restraint.struggleProgress >= 1 - escapeChance))
				&& !(restraint.lock == "Blue" && (StruggleType == "Pick"  || StruggleType == "Cut" ))) {
				Pass = "Success";
				if (StruggleType == "Pick" || StruggleType == "Unlock") {
					if (StruggleType == "Unlock") {
						if ((restraint.lock == "Red" && KinkyDungeonRedKeys > 0) || (restraint.lock == "Blue" && KinkyDungeonBlueKeys > 0)) {
							if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Unlock.ogg");
							KinkyDungeonRemoveKeys(restraint.lock);
							KinkyDungeonLock(restraint, "");
						}
					} else {
						if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Unlock.ogg");
						KinkyDungeonLock(restraint, "");
					}
				} else {
					if (KinkyDungeonSound) {
						if (StruggleType == "Cut") AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Cut.ogg");
						else if (StruggleType == "Remove") AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Unbuckle.ogg");
						else AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Struggle.ogg");
					}
					KinkyDungeonRemoveRestraint(restraint.restraint.Group, StruggleType != "Cut");
				}
			} else {
				// Failure block for the different failure types
				if (StruggleType == "Cut") {
					if (restraint.restraint.magic && KinkyDungeonEnchantedBlades == 0) Pass = "Fail";
					let breakchance = 0;
					if (KinkyDungeonNormalBlades > 0 && !restraint.restraint.magic) breakchance = KinkyDungeonGetKnifeBreakChance();
					else if (KinkyDungeonEnchantedBlades > 0) breakchance = KinkyDungeonGetEnchKnifeBreakChance();
					if (Math.random() < breakchance || restraint.lock == "Blue") { // Blue locks cannot be picked or cut!
						Pass = "Break";
						if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/PickBreak.ogg");
						if (restraint.restraint.magic && KinkyDungeonEnchantedBlades > 0) KinkyDungeonEnchantedBlades -= 1;
						else {
							if (KinkyDungeonNormalBlades > 0) {
								KinkyDungeonNormalBlades -= 1;
								KinkyDungeonKnifeBreakProgress = 0;
							} else if (KinkyDungeonEnchantedBlades > 0) {
								KinkyDungeonEnchantedBlades -= 1;
								KinkyDungeonEnchKnifeBreakProgress = 0;
							}
						}
					} else if ((handsBound && Math.random() < KinkyDungeonItemDropChanceArmsBound) || (armsBound && Math.random() < KinkyDungeonItemDropChanceArmsBound)) {
						if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Miss.ogg");
						Pass = "Drop";
						if (restraint.restraint.magic && KinkyDungeonEnchantedBlades > 0) {
							KinkyDungeonDropItem({name: "EnchKnife"});
							KinkyDungeonEnchantedBlades -= 1;
						} else {
							if (KinkyDungeonNormalBlades > 0) {
								KinkyDungeonDropItem({name: "Knife"});
								KinkyDungeonNormalBlades -= 1;
							} else if (KinkyDungeonEnchantedBlades > 0) {
								KinkyDungeonDropItem({name: "EnchKnife"});
								KinkyDungeonEnchantedBlades -= 1;
							}
						}
					} else {
						if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Cut.ogg");
						restraint.cutProgress += escapeChance * (0.3 + 0.2 * Math.random() + 0.6 * Math.max(0, (KinkyDungeonStatStamina)/KinkyDungeonStatStaminaMax));
					}
				} else if (StruggleType == "Pick") {
					if (Math.random() < KinkyDungeonKeyGetPickBreakChance() || restraint.lock == "Blue") { // Blue locks cannot be picked or cut!
						Pass = "Break";
						if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/PickBreak.ogg");
						KinkyDungeonLockpicks -= 1;
						KinkyDungeonPickBreakProgress = 0;
					} else if (handsBound || (armsBound && Math.random() < KinkyDungeonItemDropChanceArmsBound)) {
						if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Miss.ogg");
						Pass = "Drop";
						KinkyDungeonDropItem({name: "Pick"});
						KinkyDungeonLockpicks -= 1;
					} else {
						if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Pick.ogg");
						if (!restraint.pickProgress) restraint.pickProgress = 0;
						restraint.pickProgress += escapeChance * (0.5 + 1.0 * Math.random());
					}
				} else if (StruggleType == "Unlock") {
					if (handsBound || (armsBound && Math.random() < KinkyDungeonItemDropChanceArmsBound)) {
						if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Miss.ogg");
						Pass = "Drop";
						let keytype = KinkyDungeonGetKey(restraint.lock);
						KinkyDungeonDropItem({name: keytype+"Key"});
						if (keytype == "Blue") KinkyDungeonBlueKeys -= 1;
						else if (keytype == "Red") KinkyDungeonRedKeys -= 1;
					} else {
						if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Pick.ogg");
						restraint.unlockProgress += escapeChance * (0.75 + 0.5 * Math.random());
					}
				} else if (StruggleType == "Remove") {
					if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Struggle.ogg");
					restraint.removeProgress += escapeChance * (0.55 + 0.2 * Math.random() + 0.35 * Math.max(0, (KinkyDungeonStatStamina)/KinkyDungeonStatStaminaMax));
				} else if (StruggleType == "Struggle") {
					if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Struggle.ogg");
					restraint.struggleProgress += escapeChance * (0.4 + 0.3 * Math.random() + 0.4 * Math.max(0, (KinkyDungeonStatStamina)/KinkyDungeonStatStaminaMax));
				}
			}

			// Aftermath
			let suff = "";
			if (Pass == "Fail" && escapeChance > 0 && origEscapeChance <= 0) {
				if (KinkyDungeonHasGhostHelp() && restraint.restraint.helpChance && restraint.restraint.helpChance[StruggleType] > 0) suff = "3";
				else suff = "2";
			}
			if ((suff == "") && (Pass == "Fail" || Pass == "Success") && KinkyDungeonStatArousal > KinkyDungeonStatArousalMax*0.1) suff = suff + "Aroused";
			KinkyDungeonSendActionMessage(9, TextGet("KinkyDungeonStruggle" + StruggleType + Pass + suff).replace("TargetRestraint", TextGet("Restraint" + restraint.restraint.name)), (Pass == "Success") ? "lightgreen" : "red", 2);

			KinkyDungeonChangeStamina(cost);

			if (Pass != "Success") {
				// Reduce the progress
				if (StruggleType == "Struggle") {
					restraint.pickProgress = Math.max(0, restraint.pickProgress - 0.01);
					restraint.removeProgress = Math.max(0, restraint.removeProgress * 0.9 - 0.01);
					restraint.unlockProgress = Math.max(0, restraint.unlockProgress * 0.8 - 0.01);
				} else if (StruggleType == "Pick") {
					restraint.struggleProgress = Math.max(0, restraint.struggleProgress * 0.8 - 0.01);
					restraint.removeProgress = Math.max(0, restraint.removeProgress * 0.8 - 0.01);
					restraint.unlockProgress = Math.max(0, restraint.unlockProgress * 0.9 - 0.01);
				} else if (StruggleType == "Unlock") {
					restraint.pickProgress = Math.max(0, restraint.pickProgress - 0.01);
					restraint.removeProgress = Math.max(0, restraint.removeProgress * 0.8 - 0.01);
					restraint.struggleProgress = Math.max(0, restraint.struggleProgress * 0.8 - 0.01);
				} if (StruggleType == "Remove") {
					restraint.pickProgress = Math.max(0, restraint.pickProgress - 0.01);
					restraint.struggleProgress = Math.max(0, restraint.struggleProgress * 0.8 - 0.01);
					restraint.unlockProgress = Math.max(0, restraint.unlockProgress * 0.9 - 0.01);
				}

				// reduces the tightness of the restraint slightly
				if (StruggleType == "Struggle") {
					var tightness_reduction = 1;

					for (let I = 0; I < KinkyDungeonInventory.length; I++) {
						if (KinkyDungeonInventory[I].restraint) {
							tightness_reduction *= 0.8; // Reduced tightness reduction for each restraint currently worn
						}
					}

					restraint.tightness = Math.max(0, restraint.tightness - tightness_reduction);
				}
			} else if (KinkyDungeonHasGhostHelp())
				KinkyDungeonChangeRep("Ghost", 1);
		}

		KinkyDungeonSendInventoryEvent("struggle", {
			restraint: restraint,
			group: struggleGroup,
			struggletype: StruggleType,
			result: Pass,
		});
		KinkyDungeonLastAction = "Struggle";
		if (StruggleType == "Struggle") KinkyDungeonAlert = 4;
		KinkyDungeonAdvanceTime(1);
		if (Pass == "Success") KinkyDungeonCurrentEscapingItem = null;
		return Pass;
	}
	return "Impossible";
}

function KinkyDungeonGetRestraintItem(group) {
	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
		var item = KinkyDungeonInventory[I];
		if (item.restraint && item.restraint.Group == group) {
			return item;
		}
	}
	return null;
}

function KinkyDungeonRefreshRestraintsCache() {
	KinkyDungeonRestraintsCache = new Map();
	for (let r of KinkyDungeonRestraints) {
		KinkyDungeonRestraintsCache.set(r.name, r);
	}
}


function KinkyDungeonGetRestraintByName(Name) {
	if (KinkyDungeonRestraintsCache.size > 0) {
		return KinkyDungeonRestraintsCache.get(Name);
	} else KinkyDungeonRefreshRestraintsCache();
	/*for (let L = 0; L < KinkyDungeonRestraints.length; L++) {
		var restraint = KinkyDungeonRestraints[L];
		if (restraint.name == Name) return restraint;
	}
	return null;*/
}

function KinkyDungeonGetLockMult(Lock) {
	if (Lock == "Red") return 2.0;
	if (Lock == "Blue") return 3.0;

	return 1;
}

function KinkyDungeonGetRestraint(enemy, Level, Index, Bypass, Lock) {
	let restraintWeightTotal = 0;
	let restraintWeights = [];
	let cache = KDRestraintsCache.get(enemy.name);

	if (!cache || !enemy.name) {
		cache = [];
		let start2 = performance.now();
		for (let L = 0; L < KinkyDungeonRestraints.length; L++) {
			let restraint = KinkyDungeonRestraints[L];
			if (Level >= restraint.minLevel && restraint.floors.includes(Index)) {
				let enabled = false;
				let weight = 0;
				if (enemy.tags.length) {
					for (let t of enemy.tags)
						if (restraint.enemyTags[t] != undefined) {
							weight += restraint.enemyTags[t];
							enabled = true;
						}
				} else {
					for (let t of enemy.tags.keys())
						if (restraint.enemyTags[t] != undefined) {
							weight += restraint.enemyTags[t];
							enabled = true;
						}
				}
				if (enabled) {
					cache.push({r: restraint, w:weight});
				}
			}
		}
		let end2 = performance.now();
		if (KDDebug)
			console.log(`Saved ${end2 - start2} milliseconds by caching`);
		if (enemy.name)
			KDRestraintsCache.set(enemy.name, cache);
	}

	let start = performance.now();
	for (let r of cache) {
		let restraint = r.r;
		let currentRestraint = KinkyDungeonGetRestraintItem(restraint.Group);
		//let lockMult = currentRestraint ? KinkyDungeonGetLockMult(currentRestraint.lock) : 1;
		let newLock = Lock ? Lock : restraint.DefaultLock;
		let power = KinkyDungeonRestraintPower(currentRestraint);
		if ((!currentRestraint || !currentRestraint.restraint ||
			(power <
			(((Lock || restraint.DefaultLock) && KinkyDungeonIsLockable(restraint)) ? restraint.power * KinkyDungeonGetLockMult(newLock) : restraint.power)
				|| (currentRestraint && currentRestraint.restraint && KinkyDungeonLinkableAndStricter(currentRestraint.restraint, restraint, currentRestraint.dynamicLink, currentRestraint.oldLock))))
			&& (!r.dynamicLink || !r.dynamicLink.includes(restraint.name))
			&& (Bypass || !InventoryGroupIsBlockedForCharacter(KinkyDungeonPlayer, restraint.Group))) {

			restraintWeights.push({restraint: restraint, weight: restraintWeightTotal});
			let weight = r.w;
			weight += restraint.weight;
			if (restraint.playerTags)
				for (let tag in restraint.playerTags)
					if (KinkyDungeonPlayerTags.get(tag)) weight += restraint.playerTags[tag];
			restraintWeightTotal += Math.max(0, weight);
		}
	}
	let end = performance.now();
	if (KDDebug)
		console.log(`Took ${end - start} milliseconds to generate restraints for ${enemy.name}`);


	var selection = Math.random() * restraintWeightTotal;

	for (let L = restraintWeights.length - 1; L >= 0; L--) {
		if (selection > restraintWeights[L].weight) {
			return restraintWeights[L].restraint;
		}
	}

}

function KinkyDungeonUpdateRestraints(delta) {
	let playerTags = new Map();
	for (let G = 0; G < KinkyDungeonPlayer.Appearance.length; G++) {
		if (KinkyDungeonPlayer.Appearance[G].Asset) {
			let group = KinkyDungeonPlayer.Appearance[G].Asset.Group;
			if (group) {
				if (InventoryGroupIsBlockedForCharacter(KinkyDungeonPlayer, group.Name)) playerTags.set(group.Name + "Blocked", true);
				if (InventoryGet(KinkyDungeonPlayer, group.Name)) playerTags.set(group.Name + "Full", true);
			}
		}
	}
	for (let sg of KinkyDungeonStruggleGroupsBase) {
		let group = sg;
		if (group == "ItemM") {
			if (!InventoryGet(KinkyDungeonPlayer, "ItemMouth")) playerTags.set("ItemMouth" + "Empty", true);
			if (!InventoryGet(KinkyDungeonPlayer, "ItemMouth2")) playerTags.set("ItemMouth2" + "Empty", true);
			if (!InventoryGet(KinkyDungeonPlayer, "ItemMouth3")) playerTags.set("ItemMouth3" + "Empty", true);
		} else if (!InventoryGet(KinkyDungeonPlayer, group)) playerTags.set(group + "Empty", true);
	}
	for (let inv of KinkyDungeonRestraintList()) {
		if (inv.restraint) {
			if (inv.restraint.addTag)
				for (let tag of inv.restraint.addTag) {
					if (!playerTags.get(tag)) playerTags.set(tag, true);
				}
			if (inv.restraint.shrine)
				for (let tag of inv.restraint.shrine) {
					if (!playerTags.get(tag)) playerTags.set(tag, true);
				}
		}
	}
	return playerTags;
}

function KinkyDungeonRestraintPower(item, NoLink) {
	if (item && item.restraint) {
		let lockMult = item ? KinkyDungeonGetLockMult(item.lock) : 1;
		let power = (item.lock ? item.restraint.power * lockMult : item.restraint.power);

		if (item.dynamicLink && item.dynamicLink.length > 0 && !NoLink) {
			let link = item.dynamicLink[item.dynamicLink.length - 1];
			if (!KinkyDungeonIsLinkable(KinkyDungeonGetRestraintByName(link), item.restraint)) {
				let lock = (item.oldLock && item.oldLock.length > 0) ? item.oldLock[item.oldLock.length - 1] : "";
				let mult = lock ? KinkyDungeonGetLockMult(lock) : 1;
				power = Math.max(power, link.power * mult);
			}
		}
		return power;
	}
	return 0;
}

function KinkyDungeonLinkableAndStricter(oldRestraint, newRestraint, dynamicLink, oldLock, newLock) {
	if (oldRestraint && newRestraint) {
		if ((!oldRestraint.strictness || newRestraint.strictness >= oldRestraint.strictness)
			&& (newRestraint.power >= oldRestraint.power - 3)) {
			let power = 0;
			if (dynamicLink && oldLock) {
				let link = dynamicLink[dynamicLink.length - 1];
				let lock = oldLock[oldLock.length - 1];
				if (link) {
					let r = KinkyDungeonGetRestraintByName(link);
					if (r) {
						let p = KinkyDungeonGetLockMult(lock) * r.power;
						if (p > power) power = p;
					}
				}
			}
			return KinkyDungeonGetLockMult(newLock) * newRestraint.power > power && KinkyDungeonIsLinkable(oldRestraint, newRestraint);
		}
	}
	return false;
}


function KinkyDungeonAddRestraintIfWeaker(restraint, Tightness, Bypass, Lock, Keep) {
	let r = KinkyDungeonGetRestraintItem(restraint.Group);
	let power = KinkyDungeonRestraintPower(r);
	let newLock = (Lock && KinkyDungeonIsLockable(restraint)) ? Lock : restraint.DefaultLock;
	if (!r || (r.restraint && (!r.dynamicLink || !r.dynamicLink.includes(restraint.name))
		&& (power < ((newLock) ? restraint.power * KinkyDungeonGetLockMult(newLock) : restraint.power))
			|| (r && r.restraint && KinkyDungeonLinkableAndStricter(r.restraint, restraint, r.dynamicLink, r.oldLock)))) {
		return KinkyDungeonAddRestraint(restraint, Tightness, Bypass, Lock, Keep);
	}
	return 0;
}

function KinkyDungeonIsLinkable(oldRestraint, newRestraint) {
	if (oldRestraint && newRestraint && oldRestraint && oldRestraint.LinkableBy && newRestraint.shrine) {
		for (let l of oldRestraint.LinkableBy) {
			for (let s of newRestraint.shrine) {
				if (l == s) {
					return true;
				}
			}
		}
	}
	return false;
}

let KinkyDungeonRestraintAdded = false;
let KinkyDungeonCancelFlag = false;

function KinkyDungeonAddRestraint(restraint, Tightness, Bypass, Lock, Keep, Link) {
	let start = performance.now();
	var tight = (Tightness) ? Tightness : 0;
	if (restraint) {
		if (!InventoryGroupIsBlockedForCharacter(KinkyDungeonPlayer, restraint.Group) || Bypass) {
			let r = KinkyDungeonGetRestraintItem(restraint.Group);
			let linkable = (!Link && r && r.restraint && KinkyDungeonIsLinkable(r.restraint, restraint));
			if (linkable) KinkyDungeonCancelFlag = KinkyDungeonLinkItem(restraint, r, Tightness, Lock);

			// Some confusing stuff here to prevent recursion. If Link = true this means we are in the middle of linking, we dont want to do that
			if (!KinkyDungeonCancelFlag && !Link) {
				KinkyDungeonRemoveRestraint(restraint.Group, Keep, false);

				r = KinkyDungeonGetRestraintItem(restraint.Group);
				KinkyDungeonCancelFlag = r != undefined;
			}

			// If we did not link an item (or unlink one) then we proceed as normal
			if (!KinkyDungeonCancelFlag) {
				KinkyDungeonRemoveRestraint(restraint.Group, Keep, false);
				if (restraint.remove)
					for (let remove of restraint.remove) {
						InventoryRemove(KinkyDungeonPlayer, remove);
					}
				InventoryWear(KinkyDungeonPlayer, restraint.Asset, restraint.Group, restraint.power);
				KinkyDungeonSendFloater({x: 1100, y: 800 - KDRecentRepIndex * 40}, `+${TextGet("Restraint" + restraint.name)}!`, "pink", 5, true);
				let placed = InventoryGet(KinkyDungeonPlayer, restraint.Group);
				let placedOnPlayer = false;
				if (!placed) console.log(`Error placing ${restraint.name} on player!!!`);
				if (placed && ArcadeDeviousChallenge && KinkyDungeonDeviousDungeonAvailable() && !KinkyDungeonRestraintsLocked.includes(restraint.Group) && restraint.Group != "ItemHead" && InventoryAllow(
					Player, placed.Asset) &&
					(!InventoryGetLock(InventoryGet(Player, restraint.Group))
					|| (InventoryGetLock(InventoryGet(Player, restraint.Group)).Asset.OwnerOnly == false && InventoryGetLock(InventoryGet(Player, restraint.Group)).Asset.LoverOnly == false))) {
					InventoryWear(Player, restraint.Asset, restraint.Group, restraint.power);
					placedOnPlayer = true;
				}
				if (placed && !placed.Property) placed.Property = {};
				if (restraint.Type) {
					KinkyDungeonPlayer.FocusGroup = AssetGroupGet("Female3DCG", restraint.Group);
					var options = window["Inventory" + ((restraint.Group.includes("ItemMouth")) ? "ItemMouth" : restraint.Group) + restraint.Asset + "Options"];
					if (!options) options = TypedItemDataLookup[`${restraint.Group}${restraint.Asset}`].options; // Try again
					const option = options.find(o => o.Name === restraint.Type);
					ExtendedItemSetType(KinkyDungeonPlayer, options, option);
					if (placedOnPlayer) {
						Player.FocusGroup = AssetGroupGet("Female3DCG", restraint.Group);
						ExtendedItemSetType(Player, options, option);
						Player.FocusGroup = null;
					}
					KinkyDungeonPlayer.FocusGroup = null;
				}
				if (restraint.Modules) {
					let data = ModularItemDataLookup[restraint.Group + restraint.Asset];
					let asset = data.asset;
					let modules = data.modules;
					// @ts-ignore
					InventoryGet(KinkyDungeonPlayer, restraint.Group).Property = ModularItemMergeModuleValues({ asset, modules }, restraint.Modules);
					if (placedOnPlayer) {
						// @ts-ignore
						InventoryGet(Player, restraint.Group).Property = ModularItemMergeModuleValues({ asset, modules }, restraint.Modules);
					}
				}
				if (restraint.OverridePriority) {
					if (!InventoryGet(KinkyDungeonPlayer, restraint.Group).Property) InventoryGet(KinkyDungeonPlayer, restraint.Group).Property = {OverridePriority: restraint.OverridePriority};
					else InventoryGet(KinkyDungeonPlayer, restraint.Group).Property.OverridePriority = restraint.OverridePriority;
				}
				if (restraint.Color) {
					CharacterAppearanceSetColorForGroup(KinkyDungeonPlayer, restraint.Color, restraint.Group);
					if (placedOnPlayer)
						CharacterAppearanceSetColorForGroup(Player, restraint.Color, restraint.Group);
				}
				let item = {restraint: restraint, tightness: tight, lock: "", events: restraint.events};
				KinkyDungeonInventory.push(item);

				if (Lock) KinkyDungeonLock(item, Lock);
				else if (restraint.DefaultLock) KinkyDungeonLock(item, restraint.DefaultLock);
			} else if (!Link) {
				KinkyDungeonCancelFlag = false;
				// Otherwise, if we did unlink an item, and we are not in the process of linking (very important to prevent loops)
				// Then we link the new item to the unlinked item if possible
				r = KinkyDungeonGetRestraintItem(restraint.Group);
				if (r && r.restraint && KinkyDungeonIsLinkable(r.restraint, restraint))
					KinkyDungeonLinkItem(restraint, r, Tightness, Lock);
			}
			KinkyDungeonCancelFlag = false;
		}

		KinkyDungeonUpdateRestraints(0); // We update the restraints but no time drain on batteries, etc
		KinkyDungeonCheckClothesLoss = true; // We signal it is OK to check whether the player should get undressed due to restraints
		KinkyDungeonMultiplayerInventoryFlag = true; // Signal that we can send the inventory now
		KinkyDungeonSleepTime = 0;
		KinkyDungeonUpdateStruggleGroups();
		if (!KinkyDungeonRestraintAdded) {
			KinkyDungeonRestraintAdded = true;
			let sfx = (restraint && restraint.sfx) ? restraint.sfx : "Struggle";
			if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/" + sfx + ".ogg");
		}
		let end = performance.now();
		if (KDDebug)
			console.log(`Took ${end - start} milliseconds to add restraint ${restraint.name}`);
		return Math.max(1, restraint.power);
	}
	return 0;
}

function KinkyDungeonRemoveRestraint(Group, Keep, Add, NoEvent, Shrine) {
	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
		var item = KinkyDungeonInventory[I];
		if ((item.restraint && item.restraint.Group == Group)) {
			if (!NoEvent)
				KinkyDungeonSendInventoryEvent("remove", {item: item, add: Add, keep: Keep, shrine: Shrine});

			if (!KinkyDungeonCancelFlag && !Add && !Shrine) {
				KinkyDungeonCancelFlag = KinkyDungeonUnLinkItem(item);
			}

			if (!KinkyDungeonCancelFlag) {
				if (ArcadeDeviousChallenge && KinkyDungeonDeviousDungeonAvailable() && !KinkyDungeonRestraintsLocked.includes(Group) && InventoryGet(Player, Group) &&
					(!InventoryGetLock(InventoryGet(Player, Group)) || (InventoryGetLock(InventoryGet(Player, Group)).Asset.OwnerOnly == false && InventoryGetLock(InventoryGet(Player, Group)).Asset.LoverOnly == false))
					&& Group != "ItemHead") {
					InventoryRemove(Player, Group);
					if (Group == "ItemNeck") {
						InventoryRemove(Player, "ItemNeckAccessories");
						InventoryRemove(Player, "ItemNeckRestraints");
					}
				}

				KinkyDungeonInventory.splice(I, 1);

				if (item.restraint.inventory && Keep) KinkyDungeonInventory.push({looserestraint: item.restraint, events: item.restraint.looseevents});

				InventoryRemove(KinkyDungeonPlayer, Group);
				if (item.restraint.Group == "ItemNeck" && KinkyDungeonGetRestraintItem("ItemNeckRestraints")) KinkyDungeonRemoveRestraint("ItemNeckRestraints", KinkyDungeonGetRestraintItem("ItemNeckRestraints").restraint.inventory);

				KinkyDungeonCalculateSlowLevel();

				KinkyDungeonMultiplayerInventoryFlag = true;
				KinkyDungeonUpdateStruggleGroups();
			}
			KinkyDungeonCancelFlag = false;
			return true;
		}
	}
	return false;
}

function KinkyDungeonRestraintList() {
	let ret = [];

	for (let inv of KinkyDungeonInventory) {
		if (inv.restraint) {
			ret.push(inv);
		}
	}

	return ret;
}

function KinkyDungeonRestraintTypes(ShrineFilter) {
	let ret = [];

	for (let inv of KinkyDungeonRestraintList()) {
		if (inv.restraint && inv.restraint.shrine) {
			for (let shrine of inv.restraint.shrine) {
				if (ShrineFilter.includes(shrine) && !ret.includes(shrine)) ret.push(shrine);
			}
		}
	}

	return ret;
}



function KinkyDungeonLinkItem(newRestraint, oldItem, tightness, Lock) {
	if (newRestraint && oldItem && oldItem.restraint) {
		let oldLock = [];
		let oldTightness = [];
		let dynamicLink = [];
		if (oldItem.oldLock) oldLock = oldItem.oldLock;
		if (oldItem.oldTightness) oldTightness = oldItem.oldTightness;
		if (oldItem.dynamicLink) dynamicLink = oldItem.dynamicLink;
		let olock = oldItem.lock ? oldItem.lock : "";
		let oldtight = oldItem.tightness ? oldItem.tightness : 0;
		let oldlink = oldItem.restraint.name;
		oldLock.push(olock);
		oldTightness.push(oldtight);
		dynamicLink.push(oldlink);
		if (newRestraint) {
			KinkyDungeonAddRestraint(newRestraint, tightness, true, Lock, false, true);
			let newItem = KinkyDungeonGetRestraintItem(newRestraint.Group);
			if (newItem) newItem.oldLock = oldLock;
			if (newItem) newItem.oldTightness = oldTightness;
			if (newItem) newItem.dynamicLink = dynamicLink;
			if (oldItem.restraint.Link)
				KinkyDungeonSendTextMessage(7, TextGet("KinkyDungeonLink" + oldItem.restraint.name), "red", 2);
			return true;
		}
	}
	return false;
}

function KinkyDungeonUnLinkItem(item) {
	//if (!data.add && !data.shrine)
	if (item.restraint) {
		let UnLink = "";
		let dynamic = false;
		if (item.dynamicLink && item.dynamicLink.length > 0) {
			UnLink = item.dynamicLink[item.dynamicLink.length - 1];
			dynamic = true;
		}
		if (UnLink) {
			let newRestraint = KinkyDungeonGetRestraintByName(UnLink);
			let oldLock = "";
			let oldTightness = 0;
			if (item.oldLock && item.oldLock.length > 0) {
				oldLock = item.oldLock[item.oldLock.length - 1];
			}
			if (item.oldTightness && item.oldTightness.length > 0) {
				oldTightness = item.oldTightness[item.oldTightness.length - 1];
			}
			if (newRestraint) {
				if (item.dynamicLink && dynamic)
					item.dynamicLink.splice(item.dynamicLink.length-1, 1);
				if (item.oldLock)
					item.oldLock.splice(item.oldLock.length-1, 1);
				if (item.oldTightness)
					item.oldTightness.splice(item.oldTightness.length-1, 1);
				KinkyDungeonAddRestraint(newRestraint, oldTightness, true, oldLock ? oldLock : "", false);
				let res = KinkyDungeonGetRestraintItem(newRestraint.Group);
				if (res && res.restraint && item.dynamicLink && item.dynamicLink.length > 0) {
					res.dynamicLink = item.dynamicLink;
				}
				if (res && res.restraint && item.oldLock && item.oldLock.length > 0) {
					res.oldLock = item.oldLock;
				}
				if (res && res.restraint && item.oldTightness && item.oldTightness.length > 0) {
					res.oldTightness = item.oldTightness;
				}
				if (item.restraint.UnLink)
					KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonUnlink" + item.restraint.name), "lightgreen", 2);
				else
					KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonUnLink"), "lightgreen", 2);
				return true;
			}
		}
	}
	return false;
}
