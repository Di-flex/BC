"use strict";

let KinkyDungeonFactionRelations = {
	"Player": {
		"Enemy": -1.0,
		"Prisoner": -1.0,
	},
	"Enemy": {

	},
	"Prisoner": {

	},
};

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