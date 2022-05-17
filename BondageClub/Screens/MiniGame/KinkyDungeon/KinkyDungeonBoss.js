"use strict";

let bosses = {
	"Fuuka": {
		boss: "Fuuka",
		width: 13,
		height: 13,
		setpieces: {
			"GuaranteedCell": 1000,
			"Altar": 10,
			"FuukaAltar": 10,
		},
		chests: false,
		shrines: true,
		chargers: true,
		specialtiles: true,
		shortcut: false,
		enemies: false,
	}
};

function KinkyDungeonBossFloor(Floor) {
	if (Floor == 6) return bosses.Fuuka;
	return null;
}
