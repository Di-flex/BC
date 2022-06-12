"use strict";

/**
 * @type {Record<string, MapMod>}
 */
let KDMapMods = {
	"None": {
		name: "None",
		roomType: "",
		weight: 100,
		tags: [],
		bonusTags: {},
		bonussetpieces: [
			{Type: "BanditPrison", Weight: 12},
		],
		altRoom: "",
	},
	"Mold": {
		name: "Mold",
		roomType: "",
		weight: 100,
		tags: ["maid", "mold"],
		tagsOverride: ["maid", "mold"],
		bonusTags: {
			"mold": {bonus: 4, mult: 2.5},
			"maid": {bonus: 5, mult: 1.5},
			"construct": {bonus: 0, mult: 0},
		},
		altRoom: "",
		spawnBoxes: [
			{requiredTags: ["mold"], tags: [], currentCount: 0, maxCount: 0.5},
			{requiredTags: ["maid"], tags: [], currentCount: 0, maxCount: 0.25},
		],
	},
	"Bandit": {
		name: "Bandit",
		roomType: "",
		weight: 50,
		tags: ["bandit", "banditleader", "bountyhunter", "dragon"],
		bonusTags: {
			"bandit": {bonus: 4, mult: 2.5},
			"banditleader": {bonus: 40, mult: 0.3},
		},
		altRoom: "",
		spawnBoxes: [
			{requiredTags: ["bandit"], tags: [], currentCount: 0, maxCount: 0.4},
			{requiredTags: ["bountyhunter"], tags: [], currentCount: 0, maxCount: 0.2},
		],
	},
	"Dragon": {
		name: "Dragon",
		roomType: "",
		weight: 50,
		tags: ["witch", "elemental", "dragon"],
		bonusTags: {
			"dragon": {bonus: 7, mult: 1.25},
		},
		bonussetpieces: [
			{Type: "BanditPrison", Weight: 8},
		],
		altRoom: "",
		spawnBoxes: [
			{requiredTags: ["dragon"], tags: [], currentCount: 0, maxCount: 0.33},
			{requiredTags: ["elemental"], tags: [], currentCount: 0, maxCount: 0.33},
		],
	},
	"Witch": {
		name: "Witch",
		roomType: "",
		weight: 50,
		tags: ["witch", "apprentice", "skeleton"],
		bonusTags: {
			"witch": {bonus: 3, mult: 1.2},
			"apprentice": {bonus: 3, mult: 1.4},
		},
		altRoom: "",
		spawnBoxes: [
			{requiredTags: ["witch"], tags: [], currentCount: 0, maxCount: 0.25},
			{requiredTags: ["apprentice"], tags: [], currentCount: 0, maxCount: 0.25},
		],
	},
	"Wolf": {
		name: "Wolf",
		roomType: "",
		weight: 70,
		tags: ["wolfgirl"],
		bonusTags: {
			"wolfgirl": {bonus: 11, mult: 1.5},
			"trainer": {bonus: 11, mult: 0.75},
		},
		altRoom: "",
		spawnBoxes: [
			{requiredTags: ["wolfgirl"], tags: [], currentCount: 0, maxCount: 0.3},
		],
	},
	"Robot": {
		name: "Robot",
		roomType: "",
		weight: 35,
		tags: ["robot"],
		bonusTags: {
			"robot": {bonus: 10, mult: 2},
		},
		altRoom: "",
		spawnBoxes: [
			{requiredTags: ["robot"], tags: [], currentCount: 0, maxCount: 0.3},
		],
	},
	"Plant": {
		name: "Plant",
		roomType: "",
		weight: 50,
		tags: ["plant", "elf"],
		bonusTags: {
			"plant": {bonus: 5, mult: 2},
		},
		altRoom: "",
		spawnBoxes: [
			{requiredTags: ["plant"], tags: [], currentCount: 0, maxCount: 0.35},
		],
	},
	"Slime": {
		name: "Slime",
		roomType: "",
		weight: 50,
		tags: ["slime", "alchemist"],
		bonusTags: {
			"slime": {bonus: 4, mult: 2},
		},
		altRoom: "",
		spawnBoxes: [
			{requiredTags: ["slime"], tags: [], currentCount: 0, maxCount: 0.3},
		],
	},
};

// KDGetMapGenList(3, KDMapMods);
function KDGetMapGenList(count, mods) {
	let ret = [];
	for (let i = 0; i < count; i++) {
		let genWeightTotal = 0;
		let genWeights = [];

		for (let mod of Object.values(mods)) {
			if (!ret.includes(mod)) {
				genWeights.push({mod: mod, weight: genWeightTotal});
				genWeightTotal += mod.weight;
			}
		}

		let selection = KDRandom() * genWeightTotal;

		for (let L = genWeights.length - 1; L >= 0; L--) {
			if (selection > genWeights[L].weight) {
				ret.push(genWeights[L].mod);
				break;
			}
		}
	}
	return ret;
}