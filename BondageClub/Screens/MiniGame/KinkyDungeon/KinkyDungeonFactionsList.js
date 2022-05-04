"use strict";

let KinkyDungeonFactionRelations = {
	"Player": {
	},
	"Enemy": {
		Player: -1.0,
	},
	"Prisoner": {
		Player: 0.1,
	},
	"Jail": {

	},
	"Slime": {
		Jail: -0.25,
		Player: -1.0,
	},
	"Beast": {
		Jail: -0.25,
		Player: -0.6,
	},
	"KinkyConstruct": {
		Jail: -0.25,
		Player: -0.9,
	},
};

function KDFactionRelation(a, b) {
	if (KDFactionRelations.get(a) && KDFactionRelations.get(a).get(b)) {
		return KDFactionRelations.get(a).get(b);
	}
	return 0.0;
}

/**
 * @type {Map<string, Map<string, number>>};
 */
let KDFactionRelations = new Map();

function KDInitFactions() {
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
	if (KinkyDungeonFactionRelations[a])
		KinkyDungeonFactionRelations[a][b] = relation;
	if (KinkyDungeonFactionRelations[b])
		KinkyDungeonFactionRelations[b][a] = relation;
	KDInitFactions();
}