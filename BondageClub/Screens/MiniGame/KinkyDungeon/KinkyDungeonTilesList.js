"use strict";

/**
 * @type {Record<string, (moveX, moveY) => boolean>}
 */
let KDMoveObjectFunctions = {
	'D': (moveX, moveY) => { // Open the door
		KinkyDungeonMapSet(moveX, moveY, 'd');

		// For private doors, aggro the faction
		let faction = KinkyDungeonTiles.get(moveX + "," +moveY) && KinkyDungeonTiles.get(moveX + "," +moveY).Faction ? KinkyDungeonTiles.get(moveX + "," +moveY).Faction : undefined;
		if (faction) {
			KinkyDungeonAggroFaction(faction, true);
		}

		if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/DoorOpen.ogg");
		return true;
	},
	'C': (moveX, moveY) => { // Open the chest
		let chestType = KinkyDungeonTiles.get(moveX + "," +moveY) && KinkyDungeonTiles.get(moveX + "," +moveY).Loot ? KinkyDungeonTiles.get(moveX + "," +moveY).Loot : "chest";
		let faction = KinkyDungeonTiles.get(moveX + "," +moveY) && KinkyDungeonTiles.get(moveX + "," +moveY).Faction ? KinkyDungeonTiles.get(moveX + "," +moveY).Faction : undefined;
		let noTrap = KinkyDungeonTiles.get(moveX + "," +moveY) && KinkyDungeonTiles.get(moveX + "," +moveY).NoTrap ? KinkyDungeonTiles.get(moveX + "," +moveY).NoTrap : false;
		let roll = KinkyDungeonTiles.get(moveX + "," +moveY) ? KinkyDungeonTiles.get(moveX + "," +moveY).Roll : KDRandom();
		if (faction && !KinkyDungeonChestConfirm) {
			KinkyDungeonChestConfirm = true;
			KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonChestFaction").replace("FACTION", TextGet("KinkyDungeonFaction" + faction)), "red", 2);
		} else {
			KinkyDungeonLoot(MiniGameKinkyDungeonLevel, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint], chestType, roll, KinkyDungeonTiles.get(moveX + "," +moveY), undefined, noTrap);
			if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/ChestOpen.ogg");
			KinkyDungeonMapSet(moveX, moveY, 'c');
			KDGameData.AlreadyOpened.push({x: moveX, y: moveY});
			KinkyDungeonAggroAction('chest', {faction: faction});
		}
		return true;
	},
	'Y': (moveX, moveY) => { // Open the chest
		let chestType = MiniGameKinkyDungeonCheckpoint == "lib" ? "shelf" : "rubble";
		KinkyDungeonLoot(MiniGameKinkyDungeonLevel, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint], chestType);
		if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Coins.ogg");
		KinkyDungeonMapSet(moveX, moveY, 'X');
		KDGameData.AlreadyOpened.push({x: moveX, y: moveY});
		return true;
	},
	'O': (moveX, moveY) => { // Open the chest
		if (KinkyDungeonIsPlayer())
			KinkyDungeonTakeOrb(1, moveX, moveY); // 1 spell point
		if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Magic.ogg");
		KDGameData.AlreadyOpened.push({x: moveX, y: moveY});
		return true;
	},
	'-': (moveX, moveY) => { // Open the chest
		KinkyDungeonSendActionMessage(4, TextGet("KinkyDungeonObjectChargerDestroyed"), "gray", 2);
		return true;
	},
};



/**
 * Return is whether or not something the player should know about happened
 * @type {Record<string, (delta, entity, tile: effectTile) => boolean>}
 */
let KDEffectTileFunctions = {
	"Ice": (delta, entity, tile) => {
		if (!entity.player || (!KinkyDungeonPlayerBuffs.ChillWalk))
			KinkyDungeonApplyBuffToEntity(entity, KDChilled);
		if (entity.player && KinkyDungeonPlayerBuffs.Slipping)
			KDSlip({x: KinkyDungeonPlayerEntity.x - KinkyDungeonPlayerEntity.lastx, y: KinkyDungeonPlayerEntity.y - KinkyDungeonPlayerEntity.lasty});
		return true;
	}
};

/**
 * Return is whether or not something the player should know about happened
 * @type {Record<string, (newTile: effectTile, existingTile: effectTile) => boolean>}
 */
let KDEffectTileCreateFunctionsCreator = {
	"Ice": (newTile, existingTile) => {
		if (existingTile.tags.includes("freezeover")) {
			existingTile.pauseDuration = newTile.duration;
			existingTile.pauseSprite = existingTile.name + "Frozen";
		}
		return true;
	},
	"Slime": (newTile, existingTile) => {
		if (existingTile.tags.includes("ice")) {
			newTile.pauseDuration = newTile.duration;
			newTile.pauseSprite = newTile.name + "Frozen";
		}
		return true;
	}
};

/**
 * Return is whether or not something the player should know about happened
 * @type {Record<string, (newTile: effectTile, existingTile: effectTile) => boolean>}
 */
let KDEffectTileCreateFunctionsExisting = {

};

/**
 * Return is whether or not the move should be interrupted
 * @type {Record<string, (entity, tile: effectTile, willing, dir, sprint) => {cancelmove: boolean, returnvalue: boolean}>}
 */
let KDEffectTileMoveOnFunctions = {
	"Slime": (entity, tile, willing, dir, sprint) => {
		if (tile.pauseDuration > 0) {
			// Meep
		} else {
			KinkyDungeonApplyBuffToEntity(entity, KDSlimed);
		}
		return {cancelmove: false, returnvalue: false};
	},
	"Ice": (entity, tile, willing, dir, sprint) => {
		if (sprint && entity.player && willing && (dir.x || dir.y)) {
			KDSlip(dir);
			return {cancelmove: true, returnvalue: true};
		}
		return {cancelmove: false, returnvalue: false};
	}
};

/**
 * Return is idk
 * @type {Record<string, (b, tile: effectTile, d) => boolean>}
 */
let KDEffectTileBulletFunctions = {
	"Ice": (b, tile, d) => {
		if (b.bullet.damage) {
			let type = b.bullet.damage.type;
			if (type == "fire" && b.bullet.damage.damage > 0) {
				tile.duration = 0;
			} else if ((type == "ice" || type == "frost") && tile.duration < 4 && tile.duration > 0) {
				tile.duration = 4;
			}
		}
		return true;
	}
};