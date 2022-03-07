"use strict";

function KinkyDungeonUpdateTileEffects(delta) {
	let tile = KinkyDungeonMapGet(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y);
	if (tile == "]") { // Happy Gas!
		KinkyDungeonChangeArousal(3 * delta);
		KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonHappyGas"), "pink", 1);
	} else if (tile == "[") { // Happy Gas!
		KinkyDungeonSleepiness = Math.max(KinkyDungeonSleepiness + 2, 5);
		KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonSporeGas"), "pink", 1);
	}
}

function KinkyDungeonHandleMoveToTile(toTile) {
	if (toTile == 's' || toTile == 'H') { // Go down the next stairs
		if (KinkyDungeonConfirmStairs) {
			KinkyDungeonConfirmStairs = false;
			KinkyDungeonHandleStairs(toTile);
		} else if (!(KDGameData.SleepTurns > 0)) {
			KinkyDungeonConfirmStairs = true;
			KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonConfirmStairs"), "white", 1);
		}
	}
}

function KinkyDungeonHandleStairs(toTile, suppressCheckPoint) {
	if (!KinkyDungeonJailGuard() || (KDistEuclidean(KinkyDungeonJailGuard().x - KinkyDungeonPlayerEntity.x, KinkyDungeonJailGuard().y - KinkyDungeonPlayerEntity.y) > KinkyDungeonTetherLength() + 2 && KinkyDungeonJailGuard().CurrentAction != "jailLeashTour")) {
		if (MiniGameKinkyDungeonLevel > Math.max(KinkyDungeonRep, ReputationGet("Gaming")) || Math.max(KinkyDungeonRep, ReputationGet("Gaming")) > KinkyDungeonMaxLevel) {
			KinkyDungeonRep = Math.max(KinkyDungeonRep, MiniGameKinkyDungeonLevel);
			DialogSetReputation("Gaming", KinkyDungeonRep);
		}
		MiniGameVictory = false;

		MiniGameKinkyDungeonLevel += 1;
		if (MiniGameKinkyDungeonLevel >= KinkyDungeonMaxLevel) {
			MiniGameKinkyDungeonLevel = 1;
			MiniGameKinkyDungeonMainPath = 0;
			KinkyDungeonState = "End";
			MiniGameVictory = true;
			suppressCheckPoint = true;
		}

		let currCheckpoint = MiniGameKinkyDungeonCheckpoint;
		if (toTile == 's') {
			KinkyDungeonSendActionMessage(10, TextGet("ClimbDown"), "#ffffff", 1);
			KinkyDungeonSetCheckPoint(MiniGameKinkyDungeonMainPath, true, suppressCheckPoint);
		} else if (toTile == 'H') {
			KinkyDungeonSendActionMessage(10, TextGet("ClimbDownShortcut"), "#ffffff", 1);
			KinkyDungeonSetCheckPoint(MiniGameKinkyDungeonShortcut, true, suppressCheckPoint);
		}
		// Reduce security level when entering a new area
		if (MiniGameKinkyDungeonCheckpoint != currCheckpoint)
			KinkyDungeonChangeRep("Prisoner", -5);
		else // Otherwise it's just a little bit
			KinkyDungeonChangeRep("Prisoner", -1);

		if (KinkyDungeonState != "End")
			KinkyDungeonCreateMap(KinkyDungeonMapParams[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]], MiniGameKinkyDungeonLevel);
	} else {
		KinkyDungeonSendActionMessage(10, TextGet("ClimbDownFail"), "#ffffff", 1);
	}
}

let KinkyDungeonConfirmStairs = false;

function KinkyDungeonHandleMoveObject(moveX, moveY, moveObject) {
	if (moveObject == 'D') { // Open the door
		KinkyDungeonMapSet(moveX, moveY, 'd');
		if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/DoorOpen.ogg");
		return true;
	} else if (moveObject == 'C') { // Open the chest
		let chestType = KinkyDungeonTiles.get(moveX + "," +moveY) && KinkyDungeonTiles.get(moveX + "," +moveY).Loot ? KinkyDungeonTiles.get(moveX + "," +moveY).Loot : "chest";
		let roll = KinkyDungeonTiles.get(moveX + "," +moveY) ? KinkyDungeonTiles.get(moveX + "," +moveY).Roll : KDRandom();
		KinkyDungeonLoot(MiniGameKinkyDungeonLevel, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint], chestType, roll, KinkyDungeonTiles.get(moveX + "," +moveY));
		if (chestType == "chest") KinkyDungeonAddChest(1, MiniGameKinkyDungeonLevel);
		if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/ChestOpen.ogg");
		KinkyDungeonMapSet(moveX, moveY, 'c');
		return true;
	} else if (moveObject == 'Y') { // Open the chest
		let chestType = MiniGameKinkyDungeonCheckpoint == 12 ? "shelf" : "rubble";
		KinkyDungeonLoot(MiniGameKinkyDungeonLevel, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint], chestType);
		if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Coins.ogg");
		KinkyDungeonMapSet(moveX, moveY, '1');
		return true;
	} else if (moveObject == 'O') { // Open the chest
		KinkyDungeonTakeOrb(1, moveX, moveY); // 1 spell point
		if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Magic.ogg");
		return true;
	}
	return false;
}