"use strict";

let KDMapMods = {
	"None": {
		name: "None",
		roomType: "",
		weight: 100,
		tags: [],
		bonusTags: {},
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
	},
	"Bandit": {
		name: "Bandit",
		roomType: "",
		weight: 50,
		tags: ["bandit", "bountyhunter", "dragon"],
		bonusTags: {
			"bandit": {bonus: 4, mult: 2.5},
		},
		altRoom: "",
	},
	"Dragon": {
		name: "Dragon",
		roomType: "",
		weight: 50,
		tags: ["witch", "elemental", "dragon"],
		bonusTags: {
			"dragon": {bonus: 7, mult: 1.25},
		},
		altRoom: "",
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