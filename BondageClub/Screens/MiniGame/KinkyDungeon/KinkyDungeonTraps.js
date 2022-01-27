"use strict";

let KinkyDungeonTrapMoved = false;

function KinkyDungeonHandleTraps(x, y, Moved) {
	let tile = KinkyDungeonTiles[x + "," + y];
	if (tile && tile.Type == "Trap" && (!KinkyDungeonJailGuard || (KDistEuclidean(KinkyDungeonJailGuard.x - x, KinkyDungeonJailGuard.y - y) < KinkyDungeonTetherLength() + 2 && KinkyDungeonJailGuard.CurrentAction != "jailLeashTour"))) {
		let msg = "";
		let color = "red";
		if (tile.Trap == "Skeletons") {
			let created = KinkyDungeonSummonEnemy(x, y, "SummonedSkeleton", tile.Power, 4);
			if (created > 0) {
				if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Trap.ogg");
				msg = "Default";
				KinkyDungeonTiles[x + "," + y] = undefined;
			}
		} else if (tile.Trap == "Bandits") {
			let created = KinkyDungeonSummonEnemy(x, y, "Bandit", tile.Power, 2);
			if (created > 0) {
				if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Trap.ogg");
				msg = "Default";
				KinkyDungeonTiles[x + "," + y] = undefined;
			}
		}
		if (tile.Trap === "SpawnEnemies") {
			let radius = tile.Power > 4 ? 4 : 2;
			let created = KinkyDungeonSummonEnemy(x, y, tile.Enemy, tile.Power, radius);
			if (created > 0) {
				if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Trap.ogg");
				msg = TextGet("KinkyDungeonTrapSpawn" + tile.Enemy);
				KinkyDungeonTiles[x + "," + y] = undefined;
			}
		}
		if (tile.Trap == "SpecificSpell") {
			let spell = KinkyDungeonFindSpell(tile.Spell, true);
			if (spell) {
				KinkyDungeonCastSpell(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y, spell, undefined, KinkyDungeonPlayerEntity, undefined);
				if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Trap.ogg");
				msg = ""; // The spell will show a message on its own
				KinkyDungeonTiles[x + "," + y] = undefined;
			}
		}
		if (tile.Trap === "CustomSleepDart") {
			let spell = KinkyDungeonFindSpell("TrapSleepDart", true);
			if (spell) {
				// Search any tile 4 tiles up or down that have Line of Sight to the player
				let startX = KinkyDungeonPlayerEntity.x;
				let startY = KinkyDungeonPlayerEntity.y;
				let possible_coords = [
					{x: -4, y: 0}, {x: 4, y: 0}, {x: 0, y: -4}, {x: 0, y: 4},
					{x: -3, y: 0}, {x: 3, y: 0}, {x: 0, y: -3}, {x: 0, y: 3},
					{x: -2, y: 0}, {x: 2, y: 0}, {x: 0, y: -2}, {x: 0, y: 2},
				];
				for (let coord of possible_coords) {
					if (KinkyDungeonCheckProjectileClearance(startX + coord.x, startY + coord.y, startX, startY)) {
						startX += coord.x;
						startY += coord.y;
						break;
					}
				}
				KinkyDungeonCastSpell(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y, spell, { x: startX, y: startY }, KinkyDungeonPlayerEntity, undefined);
				if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Trap.ogg");
				msg = ""; // We don't want to warn the player about what just happened
				KinkyDungeonTiles[x + "," + y] = undefined;
			}
		}
		if (tile.Trap === "CustomVine") {
			let restraint = KinkyDungeonGetRestraintByName("VinePlantFeet");
			if (restraint) {
				KinkyDungeonAddRestraintIfWeaker(restraint, tile.Power, false, false);
			}
			let created = KinkyDungeonSummonEnemy(x, y, "VinePlant", tile.Power, 1);
			if (created > 0) {
				if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Trap.ogg");
				msg = "Default";
				KinkyDungeonTiles[x + "," + y] = undefined;
			}
		}
		if (msg) {
			if (msg == "Default")
				KinkyDungeonSendTextMessage(10, TextGet("KinkyDungeonTrap" + tile.Trap), color, 2);
			else
				KinkyDungeonSendTextMessage(10, msg, color, 2);
		}
	}

	KinkyDungeonTrapMoved = false;
}

function KinkyDungeonGetTrap(trapTypes, Level, tags) {

	var trapWeightTotal = 0;
	var trapWeights = [];

	for (let L = 0; L < trapTypes.length; L++) {
		var trap = trapTypes[L];
		let effLevel = Level;
		let weightMulti = 1.0;
		let weightBonus = 0;

		if (effLevel >= trap.Level) {
			trapWeights.push({trap: trap, weight: trapWeightTotal});
			let weight = trap.Weight + weightBonus;
			if (trap.terrainTags)
				for (let T = 0; T < tags.length; T++)
					if (trap.terrainTags[tags[T]]) weight += trap.terrainTags[tags[T]];

			trapWeightTotal += Math.max(0, weight*weightMulti);

		}
	}

	var selection = Math.random() * trapWeightTotal;

	for (let L = trapWeights.length - 1; L >= 0; L--) {
		if (selection > trapWeights[L].weight) {
			return {
				Name: trapWeights[L].trap.Name,
				Restraint: trapWeights[L].trap.Restraint,
				Enemy: trapWeights[L].trap.Enemy,
				Spell: trapWeights[L].trap.Spell,
				Power: trapWeights[L].trap.Power,
			};
		}
	}

}