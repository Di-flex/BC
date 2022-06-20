"use strict";

function KinkyDungeonHandleTilesEnemy(enemy, delta) {
	if (!enemy.Enemy.tags.has("acidimmune") && !enemy.Enemy.tags.has("acidresist") && !enemy.Enemy.tags.has("fire") && !enemy.Enemy.tags.has("nowet")) {
		let tile = KinkyDungeonMapGet(enemy.x, enemy.y);
		if (tile == 'w') {
			if (!enemy.buffs) enemy.buffs = {};
			let b1 = Object.assign({}, KDDrenched);
			b1.duration = 6;
			let b2 = Object.assign({}, KDDrenched2);
			b2.duration = 6;
			let b3 = Object.assign({}, KDDrenched3);
			b3.duration = 6;

			KinkyDungeonApplyBuff(enemy.buffs, b1);
			KinkyDungeonApplyBuff(enemy.buffs, b2);
			KinkyDungeonApplyBuff(enemy.buffs, b3);
		}
	}
}

function KinkyDungeonUpdateTileEffects(delta) {
	let tile = KinkyDungeonMapGet(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y);
	if (tile == "]") { // Happy Gas!
		KinkyDungeonChangeDistraction(3 * delta, false, 0.5);
		KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonHappyGas"), "pink", 1);
	} else if (tile == "[") { // Happy Gas!
		KinkyDungeonSleepiness = Math.max(KinkyDungeonSleepiness + 2, 5);
		KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonSporeGas"), "pink", 1);
	} else if (tile == "L") { // Barrel
		KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {id: "barrel", type: "SlowDetection", duration: 1, power: 9.0, player: true, enemies: true, endSleep: true, maxCount: 1, tags: ["SlowDetection", "move", "cast"]});
		KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {id: "barrel3", type: "Sneak", duration: 1, power: 1.95, player: true, enemies: true, endSleep: true, maxCount: 1, tags: ["Sneak", "darkness", "move", "cast"]});
		KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {id: "barrel2", type: "SlowLevel", duration: 1, power: 1, player: true, enemies: true, endSleep: true, maxCount: 1, tags: ["Slow", "move", "cast"]});
		KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonBarrel"), "lightgreen", 1);
	} else if (tile == "?") { // High hook
		KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonHookHigh"), "lightgreen", 1);
	} else if (tile == "/") { // Low hook
		KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonScrap"), "lightgreen", 1);
	} else if (tile == "w") {
		KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonStepWater"), "lightblue", 1);
		let b1 = Object.assign({}, KDDrenched);
		b1.duration = 6;
		let b2 = Object.assign({}, KDDrenched2);
		b2.duration = 6;
		let b3 = Object.assign({}, KDDrenched3);
		b3.duration = 6;

		KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, b1);
		KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, b2);
		KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, b3);
	} else {
		let tileUp = KinkyDungeonMapGet(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y - 1);
		let tileL = KinkyDungeonMapGet(KinkyDungeonPlayerEntity.x - 1, KinkyDungeonPlayerEntity.y);
		let tileR = KinkyDungeonMapGet(KinkyDungeonPlayerEntity.x + 1, KinkyDungeonPlayerEntity.y);
		let tileD = KinkyDungeonMapGet(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y + 1);
		if (tileUp == ",") {
			// Low hook
			KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonHookLow"), "lightgreen", 1);
		} else if (tileUp == "4" || tileL == '4' || tileR == '4' || tileD == '4') {
			// Crack
			KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonCrack"), "lightgreen", 1);
		}
	}
}

let KinkyDungeonChestConfirm = false;

function KinkyDungeonHandleMoveToTile(toTile) {
	if (toTile == 's' || toTile == 'H') { // Go down the next stairs
		if (KinkyDungeonConfirmStairs && KinkyDungeonLastAction == "Wait") {
			KinkyDungeonConfirmStairs = false;
			KinkyDungeonHandleStairs(toTile);
		} else if (!(KDGameData.SleepTurns > 0)) {
			if (KinkyDungeonLastAction == "Move" || KinkyDungeonLastAction == "Wait")
				KinkyDungeonConfirmStairs = true;
			KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonConfirmStairs"), "white", 1);
		}
	}
}

function KDCanEscape() {
	return KDGameData.JailKey || KinkyDungeonFlags.has("BossUnlocked");
}

function KinkyDungeonHandleStairs(toTile, suppressCheckPoint) {
	if (!KDCanEscape()) {
		KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonNeedJailKey"), "#ffffff", 1);
	}
	else {
		if (!KinkyDungeonJailGuard() || !KinkyDungeonTetherLength() || (!(KDistEuclidean(KinkyDungeonJailGuard().x - KinkyDungeonPlayerEntity.x, KinkyDungeonJailGuard().y - KinkyDungeonPlayerEntity.y) <= KinkyDungeonTetherLength() + 2) && !(KinkyDungeonJailGuard().CurrentAction == "jailLeashTour"))) {
			if (MiniGameKinkyDungeonLevel > Math.max(KinkyDungeonRep, ReputationGet("Gaming")) || Math.max(KinkyDungeonRep, ReputationGet("Gaming")) > KinkyDungeonMaxLevel) {
				KinkyDungeonRep = Math.max(KinkyDungeonRep, MiniGameKinkyDungeonLevel);
				DialogSetReputation("Gaming", KinkyDungeonRep);
			}
			MiniGameVictory = false;
			let roomType = "";
			let currCheckpoint = MiniGameKinkyDungeonCheckpoint;
			let altRoom = KinkyDungeonAltFloor(KDGameData.RoomType);

			// We increment the save, etc, after the tunnel
			if (KDGameData.RoomType == "Tunnel" || (altRoom && altRoom.skiptunnel)) {

				MiniGameKinkyDungeonLevel += 1;

				if (KinkyDungeonBossFloor(MiniGameKinkyDungeonLevel)) {
					roomType = ""; // We let the boss spawn naturally
				} else {
					roomType = ""; // TODO add more room types
				}

				if (MiniGameKinkyDungeonLevel >= KinkyDungeonMaxLevel) {
					MiniGameKinkyDungeonLevel = 1;
					MiniGameKinkyDungeonMainPath = "grv";
					KinkyDungeonState = "End";
					MiniGameVictory = true;
					suppressCheckPoint = true;
				}
			} else {
				roomType = "Tunnel"; // We do a tunnel every other room
				KDGameData.MapMod = ""; // Reset the map mod

				// Reduce security level when entering a new area
				if (MiniGameKinkyDungeonCheckpoint != currCheckpoint)
					KinkyDungeonChangeRep("Prisoner", -5);
				else // Otherwise it's just a little bit
					KinkyDungeonChangeRep("Prisoner", -1);

				if (KinkyDungeonStatsChoice.get("Trespasser")) {
					KinkyDungeonChangeRep("Rope", -1);
					KinkyDungeonChangeRep("Metal", -1);
					KinkyDungeonChangeRep("Leather", -1);
					KinkyDungeonChangeRep("Latex", -1);
					KinkyDungeonChangeRep("Will", -1);
					KinkyDungeonChangeRep("Elements", -1);
					KinkyDungeonChangeRep("Conjure", -1);
					KinkyDungeonChangeRep("Illusion", -1);
				}
			}

			KDGameData.RoomType = roomType;
			if (KinkyDungeonTiles.get(KinkyDungeonPlayerEntity.x + "," + KinkyDungeonPlayerEntity.y)) {
				let MapMod = KinkyDungeonTiles.get(KinkyDungeonPlayerEntity.x + "," + KinkyDungeonPlayerEntity.y).MapMod;
				if (MapMod) {
					KDGameData.MapMod = MapMod;
					KDGameData.MapFaction = KDMapMods[KDGameData.MapMod].faction;
				} else {
					KDGameData.MapMod = "";
					KDGameData.MapFaction = "";
				}
				let Journey = KinkyDungeonTiles.get(KinkyDungeonPlayerEntity.x + "," + KinkyDungeonPlayerEntity.y).Journey;
				if (Journey) {
					KDGameData.Journey = Journey;
					KDInitializeJourney(KDGameData.Journey);
				}
				let RoomType = KinkyDungeonTiles.get(KinkyDungeonPlayerEntity.x + "," + KinkyDungeonPlayerEntity.y).RoomType;
				if (RoomType) {
					KDGameData.RoomType = RoomType;
				}
			}


			if (toTile == 's') {
				KinkyDungeonSendActionMessage(10, TextGet("ClimbDown"), "#ffffff", 1);
				KinkyDungeonSetCheckPoint(MiniGameKinkyDungeonMainPath, true, suppressCheckPoint);
			} else if (toTile == 'H') {
				KinkyDungeonSendActionMessage(10, TextGet("ClimbDownShortcut"), "#ffffff", 1);
				KinkyDungeonSetCheckPoint(MiniGameKinkyDungeonShortcut, true, suppressCheckPoint);
			}

			if (KinkyDungeonState != "End") {
				KDGameData.HeartTaken = false;
				KinkyDungeonCreateMap(KinkyDungeonMapParams[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]], MiniGameKinkyDungeonLevel, undefined, undefined);
				let saveData = KinkyDungeonSaveGame(true);
				if (KDGameData.RoomType == "Tunnel" && Math.floor(MiniGameKinkyDungeonLevel / 3) == MiniGameKinkyDungeonLevel / 3 && KDDefaultJourney.includes(MiniGameKinkyDungeonCheckpoint)) {
					if ((!KinkyDungeonStatsChoice.get("saveMode")) && !suppressCheckPoint) {
						KinkyDungeonState = "Save";
						ElementCreateTextArea("saveDataField");
						ElementValue("saveDataField", saveData);
					}
				}
				KinkyDungeonSaveGame();
				KDSendStatus('nextLevel');
			} else {
				KDSendStatus('end');
			}

		} else {
			KinkyDungeonSendActionMessage(10, TextGet("ClimbDownFail"), "#ffffff", 1);
		}
	}
}


let KinkyDungeonConfirmStairs = false;

function KinkyDungeonHandleMoveObject(moveX, moveY, moveObject) {
	if (KDMoveObjectFunctions[moveObject]) {
		return KDMoveObjectFunctions[moveObject](moveX, moveY);
	}
	return false;
}

function KDCreateEffectTile(x, y, tile, durationMod) {
	if (x < 1 || y < 1 || x >= KinkyDungeonGridWidth || y >= KinkyDungeonGridHeight) return false;
	let existingTile = KinkyDungeonEffectTiles.get(x + "," + y);
	let priority = -1;
	if (existingTile) priority = (existingTile.priority) ? existingTile.priority : 0;
	if (tile.priority > priority) {
		let tt = Object.assign({x: x, y: y}, tile);
		if (durationMod) tt.duration += KDRandom() * durationMod;
		KinkyDungeonEffectTiles.set(x + "," + y, tt);
	}
}


function KDCreateAoEEffectTiles(x, y, tile, durationMod, rad, avoidPoint) {
	for (let X = -Math.ceil(rad); X <= Math.ceil(rad); X++)
		for (let Y = -Math.ceil(rad); Y <= Math.ceil(rad); Y++) {
			if (KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(x + X, Y + y)) && Math.sqrt(X*X+Y*Y) <= rad && (avoidPoint.x != X + x || avoidPoint.y != Y + y)) {
				KDCreateEffectTile(x + X, y + Y, tile, durationMod);
			}
		}
}


function KDDrawEffectTiles(canvasOffsetX, canvasOffsetY, CamX, CamY) {
	let tiles = KinkyDungeonEffectTiles.values();
	for (let tile of tiles) {
		let sprite = tile.name;
		if (tile.x >= CamX && tile.y >= CamY && tile.x < CamX + KinkyDungeonGridWidthDisplay && tile.y < CamY + KinkyDungeonGridHeightDisplay && KinkyDungeonLightGet(tile.x, tile.y) > 0) {
			DrawImageZoomCanvas(KinkyDungeonRootDirectory + "EffectTiles/" + sprite + ".png",
				KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
				(tile.x - CamX)*KinkyDungeonGridSizeDisplay, (tile.y - CamY)*KinkyDungeonGridSizeDisplay,
				KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
		}
	}
}


function KDUpdateEffectTiles(delta) {
	// Update enemies and the player
	let examinedTile = KinkyDungeonEffectTiles.get(KinkyDungeonPlayerEntity.x + ',' + KinkyDungeonPlayerEntity.y);
	if (examinedTile) KinkyDungeonUpdateSingleEffectTile(delta, KinkyDungeonPlayerEntity, examinedTile);
	for (let enemy of  KinkyDungeonEntities) {
		examinedTile = KinkyDungeonEffectTiles.get(enemy.x + ',' + enemy.y);
		if (examinedTile) KinkyDungeonUpdateSingleEffectTile(delta, enemy, examinedTile);
	}

	// Tick them down
	let tiles = KinkyDungeonEffectTiles.entries();
	for (let t of tiles) {
		if (t[1].duration > 0) t[1].duration -= delta;
		if (t[1].duration <= 0.001) KinkyDungeonEffectTiles.delete(t[0]);
	}
}

function KinkyDungeonUpdateSingleEffectTile(delta, entity, tile,) {
	if (tile.duration > 0 && KDEffectTileFunctions[tile.name]) {
		KDEffectTileFunctions[tile.name](delta, entity, tile);
	}
}

function KinkyDungeonBulletInteractionSingleEffectTile(b, tile, d) {
	if (tile.duration > 0 && KDEffectTileBulletFunctions[tile.name]) {
		KDEffectTileBulletFunctions[tile.name](b, tile, d);
	}
}

function KDSlip(dir) {
	let maxSlip = 2;
	let maxReached = 0;
	for (let i = 0; i < maxSlip; i++) {
		if (((KinkyDungeonEffectTiles.get(KinkyDungeonPlayerEntity.x + "," + KinkyDungeonPlayerEntity.y)
			&& KinkyDungeonEffectTiles.get(KinkyDungeonPlayerEntity.x + "," + KinkyDungeonPlayerEntity.y).name == "Ice")
			|| (KinkyDungeonEffectTiles.get((KinkyDungeonPlayerEntity.x + dir.x) + "," + (KinkyDungeonPlayerEntity.y + dir.y))
			&& KinkyDungeonEffectTiles.get((KinkyDungeonPlayerEntity.x + dir.x) + "," + (KinkyDungeonPlayerEntity.y + dir.y))))
			&& KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(KinkyDungeonPlayerEntity.x + dir.x, KinkyDungeonPlayerEntity.y + dir.y))
			&& !KinkyDungeonEnemyAt(KinkyDungeonPlayerEntity.x + dir.x, KinkyDungeonPlayerEntity.y + dir.y)) {
			KDMovePlayer(KinkyDungeonPlayerEntity.x + dir.x, KinkyDungeonPlayerEntity.y + dir.y, false, true);
			KinkyDungeonHandleStepOffTraps(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y, KinkyDungeonPlayerEntity.x + dir.x, KinkyDungeonPlayerEntity.y + dir.y);
			KinkyDungeonHandleTraps(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y, true);
			maxReached = i;
		} else {
			i = maxSlip;
		}

	}
	if (maxReached) {
		KinkyDungeonSendActionMessage(10, TextGet("KDSlipIce"), "yellow", maxReached + 1);
		KinkyDungeonSlowMoveTurns = Math.max(KinkyDungeonSlowMoveTurns, 1);
		KinkyDungeonApplyBuffToEntity(KinkyDungeonPlayerEntity, {id: "Slipping", type: "none", power: 1.0, duration: 2,});
		return true;
	}
	return false;
}