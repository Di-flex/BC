"use strict";

let KinkyDungeonFactionColors = {
	"Jail": ["#8A120C"],
	"Slime": ["#9B49BD"],
};

/** Hidden factions do not auto-rep change when you attack them */
let KinkyDungeonHiddenFactions = [
	"Player",
	"Enemy",
	"Jail",
	"Prisoner",
	"Beast",
	"Slime",
	"KinkyConstruct",
];

let KinkyDungeonFactionRelationsBase = {
	"Player": {
		Enemy: -1.0,
		Jail: -1.0,
		Prisoner: 0.1,

		// Wild factions
		KinkyConstruct: -0.9,
		Slime: -1.0,
		Beast: -0.6,

		// Mainline factions
		Bandit: -0.7,
		Witch: -0.8,
		Apprentice: 0.1,
		Alchemist: -0.3,
		Elemental: -0.6,
		Dragon: 0.0,
		Maidforce: -0.06,
		Nevermere: -0.1,
		Elf: -0.26,
		Bast: -0.6,
		Mushy: -0.64,
		AncientRobot: -0.45,
	},
	"Enemy": {
	},
	"Prisoner": {
	},
	"Jail": {
	},
	"Slime": {
		Jail: -0.25,
	},
	"Beast": {
		Jail: -0.25,
	},
	"KinkyConstruct": {
		Jail: -0.25,
	},
	"Nevermere": {
		"Alchemist": 1.0,
	},
	"Alchemist": {
	},
	"Elf": {
		"Mushy": 1.0,
	},
	"Bast": {
		"Elf": -1.0,
	},
	"Bandit": {
	},
	"Elemental": {
		"Witch": 1.0,
		"Apprentice": 1.0,
	},
	"AncientRobot": {
	},
	"Dragon": {
		"Jail": 1.0,
	},
	"Mushy": {
	},
	"Witch": {
		"Apprentice": 1.0,
	},
	"Apprentice": {
		"Jail": 1.0,
	},
	"Maidforce": {
		"Alchemist": 1.0,
		"Jail": 1.0,
		"Nevermere": 1.0,
		"Dragon": 1.0,
		"Elf": 1.0,
		"Apprentice": 1.0,
	},
};

let KinkyDungeonFactionRelations = Object.assign({}, KinkyDungeonFactionRelationsBase);

function KDFactionRelation(a, b) {
	if (a == "Rage" || b == "Rage") return -1.0;
	if (a == b) return 1.0;
	if (KDFactionRelations.get(a) && KDFactionRelations.get(a).get(b)) {
		return KDFactionRelations.get(a).get(b);
	}
	return 0.0;
}

/**
 * @type {Map<string, Map<string, number>>};
 */
let KDFactionRelations = new Map();

function KDInitFactions(Reset) {
	if (Reset) KinkyDungeonFactionRelations = Object.assign({}, KinkyDungeonFactionRelationsBase);
	KDFactionRelations = new Map();
	// For each faction in faction relations we create all the maps
	for (let f1 of Object.entries(KinkyDungeonFactionRelations)) {
		let fmap = new Map();

		KDFactionRelations.set(f1[0], fmap);
	}
	// Next we create the faction relationships
	for (let f1 of Object.entries(KinkyDungeonFactionRelations)) {
		let fmap = KDFactionRelations.get(f1[0]);
		for (let f2 of Object.entries(f1[1])) {
			// Set mutual opinions
			fmap.set(f2[0], f2[1]);
			KDFactionRelations.get(f2[0]).set(f1[0], f2[1]);
		}
	}
}

/**
 * Sets faction relation and refreshes the map
 * @param {string} a
 * @param {string} b
 * @param {number} relation
 */
function KDSetFactionRelation(a, b, relation) {
	if (a == "Rage" || b == "Rage") return;
	if (KinkyDungeonFactionRelations[a])
		KinkyDungeonFactionRelations[a][b] = Math.max(-1, Math.min(1, relation));
	if (KinkyDungeonFactionRelations[b])
		KinkyDungeonFactionRelations[b][a] = Math.max(-1, Math.min(1, relation));
	KDInitFactions();
}

/**
 * Changes faction relation and refreshes the map
 * @param {string} a
 * @param {string} b
 * @param {number} amount
 */
function KDChangeFactionRelation(a, b, amount) {
	if (a == "Rage" || b == "Rage") return;
	if (!KinkyDungeonFactionRelations[a]) KinkyDungeonFactionRelations[a] = KinkyDungeonFactionRelationsBase[a];
	if (!KinkyDungeonFactionRelations[b]) KinkyDungeonFactionRelations[b] = KinkyDungeonFactionRelationsBase[b];

	if (KinkyDungeonFactionRelations[a]) {
		if (!KinkyDungeonFactionRelations[a][b] && KinkyDungeonFactionRelations[b][a])
			KinkyDungeonFactionRelations[a][b] = KinkyDungeonFactionRelations[b][a];
		else if (!KinkyDungeonFactionRelations[a][b]) KinkyDungeonFactionRelations[a][b] = 0;
		KinkyDungeonFactionRelations[a][b] = Math.max(-1, Math.min(1, KinkyDungeonFactionRelations[a][b] + amount));
	}

	if (KinkyDungeonFactionRelations[b]) {
		if (!KinkyDungeonFactionRelations[b][a] && KinkyDungeonFactionRelations[a][b])
			KinkyDungeonFactionRelations[b][a] = KinkyDungeonFactionRelations[a][b];
		else if (!KinkyDungeonFactionRelations[b][a]) KinkyDungeonFactionRelations[b][a] = 0;
		KinkyDungeonFactionRelations[b][a] = Math.max(-1, Math.min(1, KinkyDungeonFactionRelations[b][a] + amount));
	}
	KDInitFactions();
}