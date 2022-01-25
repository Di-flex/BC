"use strict";

let KinkyDungeonGagMumbleChance = 0.02;
let KinkyDungeonGagMumbleChancePerRestraint = 0.0025;

var MiniGameKinkyDungeonCheckpoint = 0;
var MiniGameKinkyDungeonShortcut = 0;
var MiniGameKinkyDungeonLevel = -1;
var KinkyDungeonMapIndex = [];

var KinkyDungeonLightGrid = "";
var KinkyDungeonUpdateLightGrid = true;
var KinkyDungeonGrid = "";
var KinkyDungeonGrid_Last = "";
var KinkyDungeonGridSize = 50;
var KinkyDungeonGridWidth = 31;
var KinkyDungeonGridHeight = 19;

var KinkyDungeonGridSizeDisplay = 72;
var KinkyDungeonGridWidthDisplay = 17;
var KinkyDungeonGridHeightDisplay = 9;

var KinkyDungeonMoveDirection = KinkyDungeonGetDirection(0, 0);

var KinkyDungeonTextMessagePriority = 0;
var KinkyDungeonTextMessage = "";
var KinkyDungeonTextMessageTime = 0;
var KinkyDungeonTextMessageColor = "white";

var KinkyDungeonActionMessagePriority = 0;
var KinkyDungeonActionMessage = "";
var KinkyDungeonActionMessageTime = 0;
var KinkyDungeonActionMessageColor = "white";

var KinkyDungeonSpriteSize = 72;

var KinkyDungeonCanvas = document.createElement("canvas");
var KinkyDungeonContext = null;
var KinkyDungeonCanvasFow = document.createElement("canvas");
var KinkyDungeonContextFow = null;
var KinkyDungeonCanvasPlayer = document.createElement("canvas");
var KinkyDungeonContextPlayer = null;

var KinkyDungeonEntities = [];
var KinkyDungeonTerrain = [];

var KinkyDungeonMapBrightness = 5;

var KinkyDungeonGroundTiles = "02w";
var KinkyDungeonMovableTilesEnemy = KinkyDungeonGroundTiles + "HBSsRrdTg"; // Objects which can be moved into: floors, debris, open doors, staircases
var KinkyDungeonMovableTilesSmartEnemy = "D" + KinkyDungeonMovableTilesEnemy; //Smart enemies can open doors as well
var KinkyDungeonMovableTiles = "OCAG" + KinkyDungeonMovableTilesSmartEnemy; // Player can open chests
var KinkyDungeonTransparentObjects = KinkyDungeonMovableTiles.replace("D", "").replace("g", "") + "OoAaCcBb"; // Light does not pass thru doors or grates
var KinkyDungeonTransparentMovableObjects = KinkyDungeonMovableTiles.replace("D", "").replace("g", ""); // Light does not pass thru doors or grates


var KinkyDungeonTiles = {};
var KinkyDungeonTargetTile = null;
var KinkyDungeonTargetTileLocation = "";

var KinkyDungeonBaseLockChance = 0.1;
var KinkyDungeonScalingLockChance = 0.1; // Lock chance per 10 floors. Does not affect the guaranteed locked chest each level
var KinkyDungeonGreenLockChance = 0.3;
var KinkyDungeonGreenLockChanceScaling = 0.01;
var KinkyDungeonGreenLockChanceScalingMax = 0.8;
var KinkyDungeonYellowLockChance = 0.15;
var KinkyDungeonYellowLockChanceScaling = 0.008;
var KinkyDungeonYellowLockChanceScalingMax = 0.7;
var KinkyDungeonBlueLockChance = -0.1;
var KinkyDungeonBlueLockChanceScaling = 0.01;
var KinkyDungeonBlueLockChanceScalingMax = 0.4;


var KinkyDungeonEasyLockChance = 0.8;
var KinkyDungeonEasyLockChanceScaling = -0.007;
var KinkyDungeonEasyLockChanceScalingMax = 1.0;
var KinkyDungeonHardLockChance = 0.2;
var KinkyDungeonHardLockChanceScaling = 0.005;
var KinkyDungeonHardLockChanceScalingMax = 0.4;

var KinkyDungeonCurrentMaxEnemies = 1;

var KinkyDungeonNextDataSendTime = 0;
var KinkyDungeonNextDataSendTimeDelay = 500; // Send on moves every 0.5 second
var KinkyDungeonNextDataSendTimeDelayPing = 5000; // temporary ping
var KinkyDungeonNextDataSendStatsTimeDelay = 3000; // Send stats every 3s to save bandwidth
var KinkyDungeonNextDataSendStatsTime = 0;

var KinkyDungeonNextDataLastTimeReceived = 0;
var KinkyDungeonNextDataLastTimeReceivedTimeout = 15000; // Clear data if more than 15 seconds of no data received


var KinkyDungeonDoorCloseTimer = 0;
var KinkyDungeonLastMoveDirection = null;
var KinkyDungeonTargetingSpell = null;

var KinkyDungeonMaxLevel = 30; // Game stops when you reach this level

var KinkyDungeonLastMoveTimer = 0;
var KinkyDungeonLastMoveTimerStart = 0;
var KinkyDungeonLastMoveTimerCooldown = 175;
var KinkyDungeonLastMoveTimerCooldownStart = 50;

let KinkyDungeonPatrolPoints = [];
let KinkyDungeonStartPosition = {x: 1, y: 1};
let KinkyDungeonEndPosition = {x: 1, y: 1};
let KinkyDungeonJailLeash = 3;
let KinkyDungeonJailLeashX = 4;
let KinkyDungeonJailTransgressed = false;
let KinkyDungeonOrbsPlaced = [];
let KinkyDungeonChestsOpened = [];

let KinkyDungeonSaveInterval = 10;

let KinkyDungeonSFX = [];

function KinkyDungeonPlaySound(src) {
	if (KinkyDungeonSound && !KinkyDungeonSFX.includes(src)) {
		AudioPlayInstantSound(src);
		KinkyDungeonSFX.push(src);
	}
}

function KinkyDungeonAddChest(Amount, Floor) {
	if (KinkyDungeonChestsOpened.length < Floor - 1) {
		KinkyDungeonChestsOpened.push(0);
	}
	KinkyDungeonChestsOpened[Floor] += Amount;
}

function KinkyDungeonSetCheckPoint(Checkpoint) {
	let prevCheckpoint = MiniGameKinkyDungeonCheckpoint;
	if (Checkpoint != undefined) MiniGameKinkyDungeonCheckpoint = Checkpoint;
	else if (Math.floor(MiniGameKinkyDungeonLevel / 10) == MiniGameKinkyDungeonLevel / 10)
		MiniGameKinkyDungeonCheckpoint = Math.floor(MiniGameKinkyDungeonLevel / 10);
	if (MiniGameKinkyDungeonCheckpoint != prevCheckpoint) {
		KinkyDungeonSpawnJailers = 0;
		KinkyDungeonSpawnJailersMax = 0;
		KinkyDungeonState = "Save";
		ElementCreateTextArea("saveDataField");
		ElementValue("saveDataField", KinkyDungeonSaveGame(true));
	}
}

function KinkyDungeonInitialize(Level, Random) {
	CharacterReleaseTotal(KinkyDungeonPlayer);

	KinkyDungeonRefreshRestraintsCache();
	//KinkyDungeonRefreshEnemyCache();

	KinkyDungeonDressSet();
	if (KinkyDungeonConfigAppearance) {
		localStorage.setItem("kinkydungeonappearance", LZString.compressToBase64(CharacterAppearanceStringify(KinkyDungeonPlayer)));
		KinkyDungeonConfigAppearance = false;
	}

	KinkyDungeonDressPlayer();
	KinkyDungeonDrawState = "Game";



	KinkyDungeonTextMessage = "";
	KinkyDungeonActionMessage = "";
	MiniGameKinkyDungeonLevel = Level;
	KinkyDungeonSetCheckPoint();

	KinkyDungeonMapIndex = [];


	for (let I = 1; I < KinkyDungeonMapParams.length; I++)
		KinkyDungeonMapIndex.push(I);

	// Option to shuffle the dungeon types besides the initial one (graveyard)
	if (Random) {
		/* Randomize array in-place using Durstenfeld shuffle algorithm */
		// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
		for (var i = KinkyDungeonMapIndex.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = KinkyDungeonMapIndex[i];
			KinkyDungeonMapIndex[i] = KinkyDungeonMapIndex[j];
			KinkyDungeonMapIndex[j] = temp;
		}
	}
	KinkyDungeonMapIndex.unshift(0);
	KinkyDungeonMapIndex.push(10);


	KinkyDungeonContextPlayer = KinkyDungeonCanvasPlayer.getContext("2d");
	KinkyDungeonCanvasPlayer.width = KinkyDungeonGridSizeDisplay;
	KinkyDungeonCanvasPlayer.height = KinkyDungeonGridSizeDisplay;

	KinkyDungeonContext = KinkyDungeonCanvas.getContext("2d");
	KinkyDungeonCanvas.height = KinkyDungeonCanvasPlayer.height*KinkyDungeonGridHeightDisplay;

	KinkyDungeonContextFow = KinkyDungeonCanvasFow.getContext("2d");
	KinkyDungeonCanvasFow.width = KinkyDungeonCanvas.width;
	KinkyDungeonCanvasFow.height = KinkyDungeonCanvas.height;

	KinkyDungeonDefaultStats();

	// Set up the first level
	KinkyDungeonCreateMap(KinkyDungeonMapParams[KinkyDungeonMapIndex[0]], 0);
}
// Starts the the game at a specified level
function KinkyDungeonCreateMap(MapParams, Floor) {
	KDRestraintsCache = new Map();
	KinkyDungeonGrid = "";
	KinkyDungeonTiles = {};
	KinkyDungeonTargetTile = "";

	KinkyDungeonTotalSleepTurns = 0;

	KinkyDungeonFastMovePath = [];

	KinkyDungeonGenerateShop(MiniGameKinkyDungeonLevel);

	let height = MapParams.min_height + 2*Math.floor(0.5*Math.random() * (MapParams.max_height - MapParams.min_height));
	let width = MapParams.min_width + 2*Math.floor(0.5*Math.random() * (MapParams.max_width - MapParams.min_width));

	KinkyDungeonCanvas.width = KinkyDungeonCanvasPlayer.width*KinkyDungeonGridWidthDisplay;
	KinkyDungeonGridHeight = height;
	KinkyDungeonGridWidth = width;

	// Generate the grid
	for (let X = 0; X < height; X++) {
		for (let Y = 0; Y < width; Y++)
			KinkyDungeonGrid = KinkyDungeonGrid + '1';
		KinkyDungeonGrid = KinkyDungeonGrid + '\n';
	}

	// We only rerender the map when the grid changes
	KinkyDungeonGrid_Last = "";
	KinkyDungeonUpdateLightGrid = true;

	let InJail = KinkyDungeonSpawnJailers > 0 && KinkyDungeonSpawnJailers == KinkyDungeonSpawnJailersMax;
	// Setup variables
	let startpos = 1 + 2*Math.floor(Math.random()*0.5 * (height - 2));
	if (InJail) startpos = Math.floor(height/2);
	if (startpos % 2 != 1) startpos += 1; // startpos MUST be odd

	// MAP GENERATION

	let VisitedRooms = [];
	KinkyDungeonMapSet(1, startpos, '1', VisitedRooms);

	// Use primm algorithm with modification to spawn random rooms in the maze
	let openness = MapParams.openness;
	let density = MapParams.density;
	let doodadchance = MapParams.doodadchance;
	let barchance = MapParams.barchance;
	let treasurechance = 1.0; // Chance for an extra locked chest
	let treasurecount = MapParams.chestcount; // Max treasure chest count
	if (KinkyDungeonSpawnJailers > 0) treasurecount = 0;
	let shrinechance = MapParams.shrinechance; // Chance for an extra shrine
	let ghostchance = MapParams.ghostchance; // Chance for a ghost
	let shrinecount = MapParams.shrinecount; // Max treasure chest count
	let rubblechance = MapParams.rubblechance; // Chance of lootable rubble
	let doorchance = MapParams.doorchance; // Chance door will be closed
	let nodoorchance = MapParams.nodoorchance; // Chance of there not being a door
	let doorlockchance = MapParams.doorlockchance; // Max treasure chest count
	if (KinkyDungeonGoddessRep.Prisoner && KinkyDungeonSpawnJailers > 0) doorlockchance = doorlockchance + (KinkyDungeonSpawnJailers / KinkyDungeonSpawnJailersMax) * (1.0 - doorlockchance) * (KinkyDungeonGoddessRep.Prisoner + 50)/100;
	let trapChance = MapParams.trapchance; // Chance of a pathway being split between a trap and a door
	let grateChance = MapParams.grateChance;
	let brickchance = MapParams.brickchance; // Chance for brickwork to start being placed
	let shrinefilter = KinkyDungeonGetMapShrines(MapParams.shrines);
	let traptypes = MapParams.traps;
	let cacheInterval = MapParams.cacheInterval;
	KinkyDungeonCreateMaze(VisitedRooms, width, height, openness, density);

	KinkyDungeonGroundItems = []; // Clear items on the ground
	KinkyDungeonBullets = []; // Clear all bullets

	// Place the player!
	KinkyDungeonPlayerEntity = {MemberNumber:Player.MemberNumber, x: 1, y:startpos, player:true};
	KinkyDungeonStartPosition = {x: 1, y: startpos};

	KinkyDungeonJailTransgressed = true;

	KinkyDungeonReplaceDoodads(doodadchance, barchance, width, height); // Replace random internal walls with doodads
	KinkyDungeonPlaceStairs(startpos, width, height); // Place the start and end locations
	if (InJail) KinkyDungeonCreateCell((KinkyDungeonGoddessRep.Prisoner + 50), width, height);
	if (InJail || (MiniGameKinkyDungeonLevel % 10) % cacheInterval == 0) KinkyDungeonCreateCache(width, height);
	KinkyDungeonPlaceShortcut(KinkyDungeonGetShortcut(Floor), width, height);
	KinkyDungeonPlaceChests(treasurechance, treasurecount, rubblechance, Floor, width, height); // Place treasure chests inside dead ends
	let traps = KinkyDungeonPlaceDoors(doorchance, nodoorchance, doorlockchance, trapChance, grateChance, Floor, width, height);
	KinkyDungeonPlaceShrines(shrinechance, shrinecount, shrinefilter, ghostchance, Floor, width, height);
	KinkyDungeonPlaceBrickwork(brickchance, Floor, width, height);
	KinkyDungeonPlaceTraps(traps, traptypes, Floor, width, height);
	KinkyDungeonPlacePatrols(4, width, height);
	KinkyDungeonPlaceLore(width, height);

	KinkyDungeonUpdateStats(0);

	// Place enemies after player
	KinkyDungeonPlaceEnemies(InJail, MapParams.enemytags, Floor, width, height);

	// Set map brightness
	KinkyDungeonMapBrightness = MapParams.brightness;
}
// Checks everything that is accessible to the player
function KinkyDungeonGetAccessible(startX, startY, testX, testY) {
	let tempGrid = [];
	let checkGrid = [(startX + "," + startY)];
	while (checkGrid.length > 0) {
		for (let g of checkGrid) {
			let split = g.split(',');
			let X = parseInt(split[0]);
			let Y = parseInt(split[1]);
			for (let XX = -1; XX <= 1; XX++)
				for (let YY = -1; YY <= 1; YY++) {
					let test = ((X+XX) + "," + (Y+YY));
					let locked = (testX != undefined && testY != undefined && X+XX == testX && Y+YY == testY)
						|| (KinkyDungeonTiles["" + (X+XX) + "," + (Y+YY)] && KinkyDungeonTiles["" + (X+XX) + "," + (Y+YY)].Lock);
					if (!checkGrid.includes(test) && !tempGrid.includes(test) && KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(X+XX, Y+YY)) && !locked) {
						checkGrid.push(test);
						tempGrid.push(test);
					}
				}

			checkGrid.splice(checkGrid.indexOf(g), 1);
		}
	}

	return tempGrid;
}

// Checks everything that is accessible to the player, treating all doors as walls
function KinkyDungeonGetAccessibleRoom(startX, startY) {
	let tempGrid = [];
	let checkGrid = [(startX + "," + startY)];
	while (checkGrid.length > 0) {
		for (let g of checkGrid) {
			let split = g.split(',');
			let X = parseInt(split[0]);
			let Y = parseInt(split[1]);
			for (let XX = -1; XX <= 1; XX++)
				for (let YY = -1; YY <= 1; YY++) {
					let test = ((X+XX) + "," + (Y+YY));
					let Tiles = KinkyDungeonMovableTiles.replace("D", "").replace("d", "");
					if (!checkGrid.includes(test) && !tempGrid.includes(test) && KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(X+XX, Y+YY))) {
						if (Tiles.includes(KinkyDungeonMapGet(X+XX, Y+YY)))
							checkGrid.push(test);
						tempGrid.push(test);
					}
				}

			checkGrid.splice(checkGrid.indexOf(g), 1);
		}
	}

	return tempGrid;
}

// Tests if the player can reach the end stair even if the test spot is blocked
function KinkyDungeonIsAccessible(testX, testY) {
	let accessible = KinkyDungeonGetAccessible(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y, testX, testY);
	for (let a of accessible) {
		let split = a.split(',');
		let X = parseInt(split[0]);
		let Y = parseInt(split[1]);
		if (KinkyDungeonMapGet(X, Y) == 's') return true;
	}
	return false;
}

// Tests if the player can reach the spot from the start point
function KinkyDungeonIsReachable(testX, testY, testLockX, testLockY) {
	let accessible = KinkyDungeonGetAccessible(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y, testLockX, testLockY);
	for (let a of accessible) {
		let split = a.split(',');
		let X = parseInt(split[0]);
		let Y = parseInt(split[1]);
		if (X == testX && Y == testY) return true;
	}
	return false;
}

function KinkyDungeonAddTags(tags, Floor) {
	let security = (KinkyDungeonGoddessRep.Prisoner + 50);

	if (Floor % 10 >= 4 || KinkyDungeonDifficulty >= 20) tags.push("secondhalf");
	if (Floor % 10 >= 7 || KinkyDungeonDifficulty >= 40) tags.push("lastthird");

	if (KinkyDungeonGoddessRep.Rope < KDAnger) tags.push("ropeAnger");
	if (KinkyDungeonGoddessRep.Rope < KDRage) tags.push("ropeRage");
	if (KinkyDungeonGoddessRep.Leather < KDAnger) tags.push("leatherAnger");
	if (KinkyDungeonGoddessRep.Leather < KDRage) tags.push("leatherRage");
	if (KinkyDungeonGoddessRep.Metal < -15) tags.push("metalAnger");
	if (KinkyDungeonGoddessRep.Metal < KDRage) tags.push("metalRage");
	if (KinkyDungeonGoddessRep.Latex < -15) tags.push("latexAnger");
	if (KinkyDungeonGoddessRep.Latex < KDRage) tags.push("latexRage");
	if (KinkyDungeonGoddessRep.Elements < -15) tags.push("elementsAnger");
	if (KinkyDungeonGoddessRep.Elements < KDRage) tags.push("elementsRage");
	if (KinkyDungeonGoddessRep.Conjure < KDAnger) tags.push("conjureAnger");
	if (KinkyDungeonGoddessRep.Conjure < KDRage) tags.push("conjureRage");
	if (KinkyDungeonGoddessRep.Illusion < KDAnger) tags.push("illusionAnger");
	if (KinkyDungeonGoddessRep.Illusion < KDRage) tags.push("illusionRage");
	if (security > 0) tags.push("jailbreak");
	if (security > 40) tags.push("highsecurity");
}

// @ts-ignore
// @ts-ignore
function KinkyDungeonPlaceEnemies(InJail, Tags, Floor, width, height) {
	KinkyDungeonEntities = [];

	KinkyDungeonHuntDownPlayer = false;
	KinkyDungeonFirstSpawn = true;
	KinkyDungeonSearchTimer = 0;

	let enemyCount = 4 + Math.floor(Math.sqrt(Floor) + width/20 + height/20 + KinkyDungeonDifficulty/10);
	if (InJail) enemyCount = Math.floor(enemyCount/2);
	let count = 0;
	let tries = 0;
	let miniboss = false;
	let boss = false;
	let jailerCount = 0;

	// Create this number of enemies
	while (count < enemyCount && tries < 1000) {
		let X = 1 + Math.floor(Math.random()*(width - 1));
		let Y = 1 + Math.floor(Math.random()*(height - 1));
		let playerDist = 6;
		let PlayerEntity = KinkyDungeonNearestPlayer({x:X, y:Y});

		if (Math.sqrt((X - PlayerEntity.x) * (X - PlayerEntity.x) + (Y - PlayerEntity.y) * (Y - PlayerEntity.y)) > playerDist && (!InJail || X > KinkyDungeonJailLeashX + 3) && KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(X, Y))
			&& KinkyDungeonNoEnemy(X, Y, true)) {
			let tags = [];
			if (KinkyDungeonSpawnJailers > 0 && jailerCount < KinkyDungeonSpawnJailersMax) tags.push("jailer");
			if (KinkyDungeonMapGet(X, Y) == 'R' || KinkyDungeonMapGet(X, Y) == 'r') tags.push("rubble");
			if (KinkyDungeonMapGet(X, Y) == 'D' || KinkyDungeonMapGet(X, Y) == 'd') tags.push("door");
			if (KinkyDungeonMapGet(X, Y) == 'g') tags.push("grate");
			if (!KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(X, Y+1)) && !KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(X, Y-1))) tags.push("passage");
			else if (!KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(X+1, Y)) && !KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(X-1, Y))) tags.push("passage");
			else if (KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(X+1, Y+1))
					&& KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(X+1, Y-1))
					&& KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(X-1, Y+1))
					&& KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(X-1, Y-1))) tags.push("open");

			for (let XX = X-1; XX <= X+1; XX += 1)
				for (let YY = Y-1; YY <= Y+1; YY += 1)
					if (!(XX == X && YY == Y)) {
						if (KinkyDungeonMapGet(XX, YY) == '1' || KinkyDungeonMapGet(XX, YY) == 'X') tags.push("adjWall");
						if (KinkyDungeonMapGet(XX, YY) == 'D' || KinkyDungeonMapGet(XX, YY) == 'd') tags.push("adjDoor");
						if (KinkyDungeonMapGet(XX, YY) == 'D') tags.push("adjClosedDoor");
						if (KinkyDungeonMapGet(XX, YY) == 'c' || KinkyDungeonMapGet(XX, YY) == 'C') tags.push("adjChest");
						if (KinkyDungeonMapGet(XX, YY) == 'r' || KinkyDungeonMapGet(XX, YY) == 'R') tags.push("adjRubble");

					}

			if (miniboss) tags.push("miniboss");
			if (boss) tags.push("boss");

			KinkyDungeonAddTags(tags, Floor);

			let Enemy = KinkyDungeonGetEnemy(tags, Floor + KinkyDungeonDifficulty/5, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint], KinkyDungeonMapGet(X, Y));
			if (Enemy && (!InJail || (Enemy.tags.has("jailer") || Enemy.tags.has("jail")))) {
				KinkyDungeonEntities.push({Enemy: Enemy, id: KinkyDungeonGetEnemyID(), x:X, y:Y, hp: (Enemy.startinghp) ? Enemy.startinghp : Enemy.maxhp, movePoints: 0, attackPoints: 0});
				if (Enemy.tags.has("minor")) count += 0.2; else count += 1; // Minor enemies count as 1/5th of an enemy
				if (Enemy.tags.has("boss")) {boss = true; count += 3 * Math.max(1, 100/(100 + KinkyDungeonDifficulty));} // Boss enemies count as 4 normal enemies
				else if (Enemy.tags.has("elite")) count += Math.max(1, 100/(100 + KinkyDungeonDifficulty)); // Elite enemies count as 2 normal enemies
				if (Enemy.tags.has("miniboss")) miniboss = true; // Adds miniboss as a tag
				if (Enemy.tags.has("removeDoorSpawn") && KinkyDungeonMapGet(X, Y) == "d") KinkyDungeonMapSet(X, Y, '0');
				if (Enemy.tags.has("jailer")) jailerCount += 1;

				if (Enemy.summon) {
					for (let sum of Enemy.summon) {
						if (!sum.chance || Math.random() < sum.chance)
							KinkyDungeonSummonEnemy(X, Y, sum.enemy, sum.count, sum.range, sum.strict);
					}
				}
				//console.log("Created a " + Enemy.name)
			}
		}
		tries += 1;
	}

	if (KinkyDungeonSpawnJailers > 0) KinkyDungeonSpawnJailers -= 1;
	if (KinkyDungeonSpawnJailers > 3 && KinkyDungeonSpawnJailers < KinkyDungeonSpawnJailersMax - 1) KinkyDungeonSpawnJailers -= 1; // Reduce twice as fast when you are in deep...

	KinkyDungeonCurrentMaxEnemies = KinkyDungeonEntities.length;
}

function KinkyDungeonCreateCache(width, height) {

}

// Type 0: empty border, hollow
// Type 1: hollow, no empty border
// Type 2: only empty space
// Type 3: completely filled
function KinkyDungeonCreateRectangle(Top, Left, Width, Height, Border, Fill, Padding) {
	let pad = Padding ? Padding : 0;
	let borderType = (Border) ? '1' : '0';
	let fillType = (Fill) ? '1' : '0';
	for (let X = -pad; X < Width + pad; X++)
		for (let Y = - pad; Y < Height + pad; Y++) {
			if (X + Left < KinkyDungeonGridWidth-1 && Y + Top < KinkyDungeonGridHeight-1 && X + Left > 0 && Y + Top > 0) {
				let setTo = "";
				if (X < 0 || Y < 0 || X >= Width || Y >= Height) {
					setTo = '0';
				} else {
					if (X == 0 || X == Width - 1 || Y == 0 || Y == Height-1) {
						setTo = borderType;
					} else setTo = fillType;
				}
				if (setTo != "") KinkyDungeonMapSet(Top + X, Left + Y, setTo);
			}


			/*
			if ((X == cellWidth || X == 0) && (Y > KinkyDungeonStartPosition.y - cellHeight && Y < KinkyDungeonStartPosition.y + cellHeight)) {
				wall = true;
				if (Math.random() < barchance) bar = true;
			}
			if (Y == KinkyDungeonStartPosition.y - cellHeight && X <= cellWidth || Y == KinkyDungeonStartPosition.y + cellHeight && X <= cellWidth) {
				wall = true;
				if (Math.random() < grateChance/(grateCount*3) && KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(X, Y+1)) && KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(X, Y-1))) grate = true;
			}
			if (X == cellWidth && Y == KinkyDungeonStartPosition.y) {
				wall = false;
				door = true;
			}
			if (door) {
				KinkyDungeonMapSet(X, Y, 'D');
				KinkyDungeonTiles[X + "," + Y] = {Type: "Door"};
				if (lock) KinkyDungeonTiles[X + "," + Y].Lock = lock;
			} else if (wall) {
				if (bar)
					KinkyDungeonMapSet(X, Y, 'b');
				else if (grate) {
					KinkyDungeonMapSet(X, Y, 'g');
					grateCount += 1;
				} else
					KinkyDungeonMapSet(X, Y, '1');
			} else KinkyDungeonMapSet(X, Y, '0');*/
		}
}

// @ts-ignore
function KinkyDungeonCreateCell(security, width, height) {
	KinkyDungeonJailTransgressed = false;
	let cellWidth = KinkyDungeonJailLeashX;
	KinkyDungeonJailLeash = 5;
	let modsecurity = security - (KinkyDungeonGoddessRep.Ghost + 50);
	if (security > 25) KinkyDungeonJailLeash -= 1;
	if (security > 50) KinkyDungeonJailLeash -= 1;
	if (security > 75) KinkyDungeonJailLeash -= 1;
	let cellHeight = KinkyDungeonJailLeash;
	let barchance = 1.0 - 0.9 * Math.min(1, modsecurity / 100);
	let grateChance = 1.0 - 1.0 * Math.min(1, security / 100);
	let grateCount = 1/3;
	let lock = KinkyDungeonGenerateLock(true, MiniGameKinkyDungeonLevel);

	for (let X = 0; X <= cellWidth + 1; X++)
		for (let Y = KinkyDungeonStartPosition.y - cellHeight - 1; Y <= KinkyDungeonStartPosition.y + cellHeight + 1; Y++) {
			let wall = false;
			let door = false;
			let bar = false;
			let grate = false;
			if ((X == cellWidth || X == 0) && (Y > KinkyDungeonStartPosition.y - cellHeight && Y < KinkyDungeonStartPosition.y + cellHeight)) {
				wall = true;
				if (Math.random() < barchance) bar = true;
			}
			if (Y == KinkyDungeonStartPosition.y - cellHeight && X <= cellWidth || Y == KinkyDungeonStartPosition.y + cellHeight && X <= cellWidth) {
				wall = true;
				if (Math.random() < grateChance/(grateCount*3) && KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(X, Y+1)) && KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(X, Y-1))) grate = true;
			}
			if (X == cellWidth && Y == KinkyDungeonStartPosition.y) {
				wall = false;
				door = true;
			}
			if (door) {
				KinkyDungeonMapSet(X, Y, 'D');
				KinkyDungeonTiles[X + "," + Y] = {Type: "Door"};
				if (lock) KinkyDungeonTiles[X + "," + Y].Lock = lock;
			} else if (wall) {
				if (bar)
					KinkyDungeonMapSet(X, Y, 'b');
				else if (grate) {
					KinkyDungeonMapSet(X, Y, 'g');
					grateCount += 1;
				} else
					KinkyDungeonMapSet(X, Y, '1');
			} else KinkyDungeonMapSet(X, Y, '0');
		}
	KinkyDungeonMapSet(KinkyDungeonStartPosition.x, KinkyDungeonStartPosition.y, 'B');
}

function KinkyDungeonPlaceStairs(startpos, width, height) {
	// Starting stairs are predetermined and guaranteed to be open
	KinkyDungeonMapSet(1, startpos, 'S');

	// Ending stairs are not.
	let placed = false;

	for (let X = width - 2; X > 0.75 * width - 2 && !placed; X--)
		for (let L = 100; L > 0; L -= 1) { // Try up to 100 times
			//let X = width - 2;
			let Y = 1 + 2*Math.floor(Math.random()*0.5 * (height - 2));
			if (KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(X, Y))) {
				// Check the 3x3 area
				let wallcount = 0;
				for (let XX = X-1; XX <= X+1; XX += 1)
					for (let YY = Y-1; YY <= Y+1; YY += 1)
						if (!(XX == X && YY == Y) && (KinkyDungeonMapGet(XX, YY) == '1' || KinkyDungeonMapGet(XX, YY) == 'X'))
							wallcount += 1;
				if (wallcount == 7) {
					placed = true;
					KinkyDungeonMapSet(X, Y, 's');
					KinkyDungeonEndPosition = {x: X, y: Y};
					L = 0;
					break;
				}
			}
		}

	if (!placed) // Loosen the constraints
		for (let L = 100; L > 0; L -= 1) { // Try up to 100 times
			let X = width - 2 - Math.floor(Math.random() * width/4);
			let Y = 1 + Math.floor(Math.random() * (height - 2));
			if (KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(X, Y))) {
				KinkyDungeonMapSet(X, Y, 's');
				KinkyDungeonEndPosition = {x: X, y: Y};
				L = 0;
			}
		}

}

function KinkyDungeonGetShortcut(level) {

	if (level == 3) {
		return 11;
	}
	if (level == 2 && KinkyDungeonRep > 5) {
		return 11;
	}

	return 0;
}

function KinkyDungeonPlaceShortcut(checkpoint, width, height) {

	if (checkpoint > 0) {

		// Ending stairs are not.
		let placed = false;

		for (let L = 1000; L > 0; L -= 1) { // Try up to 1000 times
			let X = Math.floor(width * 0.75) - 2 - Math.floor(Math.random() * width/2);
			let Y = 1 + 2*Math.floor(Math.random()*0.5 * (height - 2));
			if (KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(X, Y))) {
				// Check the 3x3 area
				let wallcount = 0;
				for (let XX = X-1; XX <= X+1; XX += 1)
					for (let YY = Y-1; YY <= Y+1; YY += 1)
						if (!(XX == X && YY == Y) && (KinkyDungeonMapGet(XX, YY) == '1' || KinkyDungeonMapGet(XX, YY) == 'X'))
							wallcount += 1;
				if (wallcount == 7) {
					placed = true;
					KinkyDungeonMapSet(X, Y, 'H');
					L = 0;
					break;
				}
			}
		}

		if (!placed) // Loosen the constraints
			for (let L = 1000; L > 0; L -= 1) { // Try up to 1000 times
				let X = Math.floor(width * 0.75) - 2 - Math.floor(Math.random() * width/2);
				let Y = 1 + Math.floor(Math.random() * (height - 2));
				if (KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(X, Y))) {
					KinkyDungeonMapSet(X, Y, 'H');
					L = 0;
					placed = true;
				}
			}

		if (placed) {
			MiniGameKinkyDungeonShortcut = checkpoint;
		}
	}
}

function KinkyDungeonPlaceChests(treasurechance, treasurecount, rubblechance, Floor, width, height) {
	let chestlist = [];

	// Populate the chests
	for (let X = 1; X < width; X += 1)
		for (let Y = 1; Y < height; Y += 1)
			if (KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(X, Y)) && Math.random()) {
				// Check the 3x3 area
				let wallcount = 0;
				for (let XX = X-1; XX <= X+1; XX += 1)
					for (let YY = Y-1; YY <= Y+1; YY += 1)
						if (!(XX == X && YY == Y) && (KinkyDungeonMapGet(XX, YY) == '1' || KinkyDungeonMapGet(XX, YY) == 'X'))
							wallcount += 1;
				if (wallcount == 7) {
					chestlist.push({x:X, y:Y});
				}
			}

	// Truncate down to max chest count in a location-neutral way
	let count = 0;
	let extra = Math.random() < treasurechance;
	treasurecount += (extra ? 1 : 0);
	let alreadyOpened = (KinkyDungeonChestsOpened.length > Floor) ? KinkyDungeonChestsOpened[Floor] : 0;
	treasurecount -= alreadyOpened;
	while (chestlist.length > 0) {
		let N = Math.floor(Math.random()*chestlist.length);
		if (count < treasurecount) {
			let chest = chestlist[N];
			KinkyDungeonMapSet(chest.x, chest.y, 'C');

			// Add a lock on the chest! For testing purposes ATM
			let lock = KinkyDungeonGenerateLock((extra && count == 0) ? true : false , Floor);
			if (lock)
				KinkyDungeonTiles["" + chest.x + "," +chest.y] = {Type: "Lock", Lock: lock};

			count += 1;
		} else {

			let chest = chestlist[N];
			if (Math.random() < rubblechance) KinkyDungeonMapSet(chest.x, chest.y, 'R');
			else KinkyDungeonMapSet(chest.x, chest.y, 'r');
		}
		chestlist.splice(N, 1);
	}
}


function KinkyDungeonPlaceLore(width, height) {
	let loreList = [];

	// Populate the lore
	for (let X = 1; X < width; X += 1)
		for (let Y = 1; Y < height; Y += 1)
			if (KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(X, Y)) && Math.random() < 0.6) loreList.push({x:X, y:Y});

	while (loreList.length > 0) {
		let N = Math.floor(Math.random()*loreList.length);
		KinkyDungeonGroundItems.push({x:loreList[N].x, y:loreList[N].y, name: "Lore"});
		return true;
	}

}


// @ts-ignore
// @ts-ignore
function KinkyDungeonPlaceShrines(shrinechance, shrinecount, shrinefilter, ghostchance, Floor, width, height) {
	let shrinelist = [];
	KinkyDungeonCommercePlaced = 0;
	let shrineTypes = [];

	// Populate the chests
	for (let X = 1; X < width; X += 1)
		for (let Y = 1; Y < height; Y += 1)
			if (KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(X, Y)) && Math.max(Math.abs(X - KinkyDungeonStartPosition.x), Math.abs(Y - KinkyDungeonStartPosition.y)) > KinkyDungeonJailLeash) {
				// Check the 3x3 area
				let freecount = 0;
				let freecount_diag = 0;
				for (let XX = X-1; XX <= X+1; XX += 1)
					for (let YY = Y-1; YY <= Y+1; YY += 1)
						if (!(XX == X && YY == Y) && KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(XX, YY)))
							if (XX == X || YY == Y)
								freecount += 1;
							else
								freecount_diag += 1;

				if (freecount >= 4 && freecount_diag >= 1)
					shrinelist.push({x:X, y:Y});


			} else if (KinkyDungeonMapGet(X, Y) == "R" || KinkyDungeonMapGet(X, Y) == "r")
				shrinelist.push({x:X, y:Y});

	// Truncate down to max chest count in a location-neutral way
	let count = 0;
	while (shrinelist.length > 0) {
		let N = Math.floor(Math.random()*shrinelist.length);
		if (count <= shrinecount) {

			let shrine = shrinelist[N];
			if (count == shrinecount && Math.random() > shrinechance)
				KinkyDungeonMapSet(shrine.x, shrine.y, 'a');
			else {
				let playerTypes = KinkyDungeonRestraintTypes(shrinefilter);
				let type = shrineTypes.length == 0 ? "Orb"
					: (shrineTypes.length == 1 && playerTypes.length > 0 ?
						playerTypes[Math.floor(Math.random() * playerTypes.length)]
						: KinkyDungeonGenerateShrine(Floor));
				let tile = 'A';
				if (shrineTypes.includes(type)) type = "";
				if (type == "Orb") {
					if (!KinkyDungeonOrbsPlaced.includes(Floor) && Floor > 0) {
						tile = 'O';
						KinkyDungeonOrbsPlaced.push(Floor);
					} else tile = 'o';
					shrineTypes.push("Orb");
				} else if (type) {
					KinkyDungeonTiles["" + shrine.x + "," +shrine.y] =  {Type: "Shrine", Name: type};
					shrineTypes.push(type);
				} else if (!shrineTypes.includes("Ghost")) {
					shrineTypes.push("Ghost");
					tile = 'G';
					KinkyDungeonTiles["" + shrine.x + "," +shrine.y] =  {Type: "Ghost"};
				} else tile = 'a';

				KinkyDungeonMapSet(shrine.x, shrine.y, tile);
			}

			count += 1;
		}

		shrinelist.splice(N, 1);
	}
}

let KinkyDungeonCommercePlaced = 0;

// @ts-ignore
// @ts-ignore
function KinkyDungeonGenerateShrine(Floor) {
	let Params = KinkyDungeonMapParams[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]];

	if (Params.shrines) {

		let shrineWeightTotal = 0;
		let shrineWeights = [];

		for (let L = 0; L < Params.shrines.length; L++) {
			let shrine = Params.shrines[L];
			shrineWeights.push({shrine: shrine, weight: shrineWeightTotal});
			shrineWeightTotal += shrine.Weight;
		}

		let selection = Math.random() * shrineWeightTotal;

		for (let L = shrineWeights.length - 1; L >= 0; L--) {
			if (selection > shrineWeights[L].weight) {
				return shrineWeights[L].shrine.Type;
			}
		}
	}

	return "";
}


// @ts-ignore
// @ts-ignore
function KinkyDungeonPlaceBrickwork( brickchance, Floor, width, height) {
	// Populate the chests
	for (let X = 1; X < width; X += 1)
		for (let Y = 1; Y < height; Y += 1)
			if (KinkyDungeonMapGet(X, Y) == '0') {
				let chance = brickchance;
				// Check the 3x3 area
				for (let XX = X-1; XX <= X+1; XX += 1)
					for (let YY = Y-1; YY <= Y+1; YY += 1) {
						if (!(XX == X && YY == Y) && !KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(XX, YY)))
							chance += 0.01;
						if (KinkyDungeonMapGet(XX, YY) == 'A')
							chance += 0.5;
						else if (KinkyDungeonMapGet(XX, YY) == 'a')
							chance += 0.25;
					}

				if (Math.random() < chance)
					KinkyDungeonMapSet(X, Y, '2');
			}
}

// @ts-ignore
// @ts-ignore
function KinkyDungeonPlaceTraps( traps, traptypes, Floor, width, height) {
	for (let trap of traps) {
		KinkyDungeonMapSet(trap.x, trap.y, 'T');
		let t = KinkyDungeonGetTrap(traptypes, Floor, []);
		KinkyDungeonTiles[trap.x + "," + trap.y] = {Type: "Trap", Trap: t.Name, Power: t.Power};
	}
}

// @ts-ignore
function KinkyDungeonPlacePatrols(Count, width, height) {
	KinkyDungeonPatrolPoints = [];
	for (let i = 1; i <= Count; i++) {
		for (let L = 1000; L > 0; L -= 1) { // Try up to 1000 times
			let X = Math.floor(i * width / (Count + 1)) + Math.floor(Math.random() * width/(Count + 1));
			let Y = Math.floor(Math.random()*height);
			if (KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(X, Y))) {
				KinkyDungeonPatrolPoints.push({x: X, y: Y});
				break;
			}
		}
	}
}


function KinkyDungeonGenerateLock(Guaranteed, Floor) {
	let level = (Floor) ? Floor : MiniGameKinkyDungeonLevel;
	//let Params = KinkyDungeonMapParams[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]];

	let chance = (level == 0) ? 0 : KinkyDungeonBaseLockChance;
	chance += KinkyDungeonScalingLockChance * level / 10;

	if (Guaranteed) chance = 1.0;

	if (Math.random() < chance) {
		// Now we get the amount failed by
		// Default: red lock
		let locktype = Math.random();

		let modifiers = "";

		let BlueChance = Math.min(KinkyDungeonBlueLockChance + level * KinkyDungeonBlueLockChanceScaling, KinkyDungeonBlueLockChanceScalingMax);

		if (locktype < BlueChance) return "Blue" + modifiers;
		return "Red" + modifiers;
	}

	return "";
}

function KinkyDungeonPlaceDoors(doorchance, nodoorchance, doorlockchance, trapChance, grateChance, Floor, width, height) {
	let doorlist = [];
	let doorlist_2ndpass = [];
	let trapLocations = [];

	// Populate the doors
	for (let X = 1; X < width; X += 1)
		for (let Y = 1; Y < height; Y += 1)
			if (KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(X, Y)) && KinkyDungeonMapGet(X, Y) != 'D') {
				// Check the 3x3 area
				let wallcount = 0;
				let up = false;
				let down = false;
				let left = false;
				let right = false;
				for (let XX = X-1; XX <= X+1; XX += 1)
					for (let YY = Y-1; YY <= Y+1; YY += 1) {
						let get = KinkyDungeonMapGet(XX, YY);
						if (!(XX == X && YY == Y) && (get == '1' || get == 'X' || get == 'C')) {
							wallcount += 1; // Get number of adjacent walls
							if (XX == X+1 && YY == Y && get == '1') right = true;
							else if (XX == X-1 && YY == Y && get == '1') left = true;
							else if (XX == X && YY == Y+1 && get == '1') down = true;
							else if (XX == X && YY == Y-1 && get == '1') up = true;
						} else if (get == 'D') // No adjacent doors
							wallcount = 100;
					}
				if (wallcount < 5 && ((up && down) != (left && right)) && Math.random() > nodoorchance) { // Requirements: 4 doors and either a set in up/down or left/right but not both
					doorlist.push({x:X, y:Y});
					doorlist_2ndpass.push({x:X, y:Y});
				}
			}

	while (doorlist.length > 0) {
		let N = Math.floor(Math.random()*doorlist.length);

		let door = doorlist[N];
		let X = door.x;
		let Y = door.y;

		let closed = Math.random() < doorchance;
		KinkyDungeonMapSet(X, Y, (closed ? 'D' : 'd'));
		KinkyDungeonTiles["" + X + "," + Y] = {Type: "Door"};
		if (closed && Math.random() < doorlockchance && KinkyDungeonIsAccessible(X, Y)) {
			KinkyDungeonTiles["" + X + "," + Y].Lock = KinkyDungeonGenerateLock(true, Floor);
		}

		doorlist.splice(N, 1);
	}

	while (doorlist_2ndpass.length > 0) {
		let N = Math.floor(Math.random()*doorlist_2ndpass.length);
		let minLockedRoomSize = 5;
		let maxPlayerDist = 4;

		let door = doorlist_2ndpass[N];
		let X = door.x;
		let Y = door.y;

		let roomDoors = [];
		let accessible = KinkyDungeonGetAccessibleRoom(X, Y);
		if (accessible.length > minLockedRoomSize) {
			for (let a of accessible) {
				let split = a.split(',');
				let XX = parseInt(split[0]);
				let YY = parseInt(split[1]);
				let tileType = KinkyDungeonMapGet(XX, YY);
				if ((tileType == "D" || tileType == 'd') && !KinkyDungeonTiles[a].Lock && XX != X && YY != Y) {
					roomDoors.push({x: XX, y: YY});
				}
			}
			let rooms = [];
			for (let ddoor of roomDoors) {
				let room = KinkyDungeonGetAccessibleRoom(X, Y);
				rooms.push({door: ddoor, room: room});
			}
			for (let room of rooms) {
				let success = room.room.length == accessible.length;
				for (let tile of accessible) {
					if (!room.room.includes(tile)) {
						success = false;
						break;
					}
				}
				if (success) {
					if (!KinkyDungeonTiles[room.door.x + "," + room.door.y].Lock && !KinkyDungeonTiles[X + "," + Y].Lock
						&& ((KinkyDungeonGetAccessibleRoom(X+1, Y).length != KinkyDungeonGetAccessibleRoom(X-1, Y).length
							&& KinkyDungeonIsReachable(X+1, Y, X, Y) && KinkyDungeonIsReachable(X-1, Y, X, Y))
						|| (KinkyDungeonGetAccessibleRoom(X, Y+1).length != KinkyDungeonGetAccessibleRoom(X, Y-1).length)
							&& KinkyDungeonIsReachable(X, Y+1, X, Y) && KinkyDungeonIsReachable(X, Y-1, X, Y))
						&& KinkyDungeonIsAccessible(X, Y)) {
						let lock = false;
						//console.log(X + "," + Y + " locked")
						if (Math.random() < trapChance && Math.max(Math.abs(room.door.x - KinkyDungeonPlayerEntity.x), Math.abs(room.door.y - KinkyDungeonPlayerEntity.y)) > maxPlayerDist) {
							// Place a trap or something at the other door if it's far enough from the player
							trapLocations.push({x: room.door.x, y: room.door.y});
							lock = true;
						} else if (((Math.random() < grateChance && (!room.room || room.room.length > minLockedRoomSize))
								|| Math.max(Math.abs(room.door.x - KinkyDungeonPlayerEntity.x), Math.abs(room.door.y - KinkyDungeonPlayerEntity.y)) <= maxPlayerDist)
								&& room.door.y != KinkyDungeonStartPosition.y) {
							// Place a grate instead
							KinkyDungeonMapSet(room.door.x, room.door.y, 'g');
							lock = true;
						}
						if (lock) {
							KinkyDungeonTiles["" + X + "," + Y].Lock = KinkyDungeonGenerateLock(true, Floor);
							KinkyDungeonMapSet(X, Y, 'D');
						}
					}
					break;
				}
			}
		}
		doorlist_2ndpass.splice(N, 1);
	}
	return trapLocations;
}

function KinkyDungeonReplaceDoodads(Chance, barchance, width, height) {
	for (let X = 1; X < width-1; X += 1)
		for (let Y = 1; Y < height-1; Y += 1) {
			if (KinkyDungeonMapGet(X, Y) == '1' && Math.random() < Chance)
				KinkyDungeonMapSet(X, Y, 'X');
			else if (KinkyDungeonMapGet(X, Y) == '1' && Math.random() < barchance
				&& ((KinkyDungeonMapGet(X, Y-1) == '1' && KinkyDungeonMapGet(X, Y+1) == '1' && KinkyDungeonMapGet(X-1, Y) == '0' && KinkyDungeonMapGet(X+1, Y) == '0')
					|| (KinkyDungeonMapGet(X-1, Y) == '1' && KinkyDungeonMapGet(X+1, Y) == '1' && KinkyDungeonMapGet(X, Y-1) == '0' && KinkyDungeonMapGet(X, Y+1) == '0')))
				KinkyDungeonMapSet(X, Y, 'b');
		}
	for (let X = 1; X < width - 1; X += 1)
		for (let Y = 1; Y < height - 1; Y += 1) {
			let tl = KinkyDungeonMapGet(X, Y);
			let tr = KinkyDungeonMapGet(X+1, Y);
			let bl = KinkyDungeonMapGet(X, Y+1);
			let br = KinkyDungeonMapGet(X+1, Y+1);
			if (tl == '1' && br == '1' && KinkyDungeonMovableTilesEnemy.includes(tr) && KinkyDungeonMovableTilesEnemy.includes(bl))
				if (Math.random() < 0.5) KinkyDungeonMapSet(X, Y, 'X');
				else KinkyDungeonMapSet(X+1, Y+1, 'b');
			else if (tr == '1' && bl == '1' && KinkyDungeonMovableTilesEnemy.includes(tl) && KinkyDungeonMovableTilesEnemy.includes(br))
				if (Math.random() < 0.5) KinkyDungeonMapSet(X, Y+1, 'X');
				else KinkyDungeonMapSet(X+1, Y, 'b');
		}
}

function KinkyDungeonCreateMaze(VisitedRooms, width, height, openness, density) {
	// Variable setup

	let Walls = {};
	let WallsList = {};
	let VisitedCells = {};

	// Initialize the first cell in our Visited Cells list

	VisitedCells[VisitedRooms[0].x + "," + VisitedRooms[0].y] = {x:VisitedRooms[0].x, y:VisitedRooms[0].y};

	// Walls are basically even/odd pairs.
	for (let X = 2; X < width; X += 2)
		for (let Y = 1; Y < height; Y += 2)
			if (KinkyDungeonMapGet(X, Y) == '1') {
				Walls[X + "," + Y] = {x:X, y:Y};
			}
	for (let X = 1; X < width; X += 2)
		for (let Y = 2; Y < height; Y += 2)
			if (KinkyDungeonMapGet(X, Y) == '1') {
				Walls[X + "," + Y] = {x:X, y:Y};
			}

	// Setup the wallslist for the first room
	KinkyDungeonMazeWalls(VisitedRooms[0], Walls, WallsList);

	// Per a randomized primm algorithm from Wikipedia, we loop through the list of walls until there are no more walls

	let WallKeys = Object.keys(WallsList);
	//let CellKeys = Object.keys(VisitedCells);

	while (WallKeys.length > 0) {
		let I = Math.floor(Math.random() * WallKeys.length);
		let wall = Walls[WallKeys[I]];
		let unvisitedCell = null;

		// Check if wall is horizontal or vertical and determine if there is a single unvisited cell on the other side of the wall
		if (wall.x % 2 == 0) { //horizontal wall
			if (!VisitedCells[(wall.x-1) + "," + wall.y]) unvisitedCell = {x:wall.x-1, y:wall.y};
			if (!VisitedCells[(wall.x+1) + "," + wall.y]) {
				if (unvisitedCell) unvisitedCell = null;
				else unvisitedCell = {x:wall.x+1, y:wall.y};
			}
		} else { //vertical wall
			if (!VisitedCells[wall.x + "," + (wall.y-1)]) unvisitedCell = {x:wall.x, y:wall.y-1};
			if (!VisitedCells[wall.x + "," + (wall.y+1)]) {
				if (unvisitedCell) unvisitedCell = null;
				else unvisitedCell = {x:wall.x, y:wall.y+1};
			}
		}

		// We only add a new cell if only one of the cells is unvisited
		if (unvisitedCell) {
			delete Walls[wall.x + "," + wall.y];

			KinkyDungeonMapSet(wall.x, wall.y, '0');
			KinkyDungeonMapSet(unvisitedCell.x, unvisitedCell.y, '0');
			VisitedCells[unvisitedCell.x + "," + unvisitedCell.y] = unvisitedCell;

			KinkyDungeonMazeWalls(unvisitedCell, Walls, WallsList);
		}

		// Either way we remove this wall from consideration
		delete WallsList[wall.x + "," + wall.y];

		// Chance of spawning a room!
		if (Math.random() < 0.1 - 0.015*density) {
			let size = 1+Math.ceil(Math.random() * (openness));

			// We open up the tiles
			for (let XX = wall.x; XX < wall.x +size; XX++)
				for (let YY = wall.y; YY < wall.y+size; YY++) {
					KinkyDungeonMapSet(XX, YY, '0');
					VisitedCells[XX + "," + YY] = {x:XX, y:YY};
					KinkyDungeonMazeWalls({x:XX, y:YY}, Walls, WallsList);
					delete Walls[XX + "," + YY];
				}

			// We also remove all walls inside the room from consideration!
			for (let XX = wall.x; XX < wall.x +size; XX++)
				for (let YY = wall.y; YY < wall.y+size; YY++) {
					delete WallsList[XX + "," + YY];
				}
		}

		// Update keys

		WallKeys = Object.keys(WallsList);
		//CellKeys = Object.keys(VisitedCells);
	}
}

function KinkyDungeonMazeWalls(Cell, Walls, WallsList) {
	if (Walls[(Cell.x+1) + "," + Cell.y]) WallsList[(Cell.x+1) + "," + Cell.y] = {x:Cell.x+1, y:Cell.y};
	if (Walls[(Cell.x-1) + "," + Cell.y]) WallsList[(Cell.x-1) + "," + Cell.y] = {x:Cell.x-1, y:Cell.y};
	if (Walls[Cell.x + "," + (Cell.y+1)]) WallsList[Cell.x + "," + (Cell.y+1)] = {x:Cell.x, y:Cell.y+1};
	if (Walls[Cell.x + "," + (Cell.y-1)]) WallsList[Cell.x + "," + (Cell.y-1)] = {x:Cell.x, y:Cell.y-1};
}

function KinkyDungeonMapSet(X, Y, SetTo, VisitedRooms) {
	let height = KinkyDungeonGridHeight;
	let width = KinkyDungeonGridWidth;

	if (X > 0 && X < width-1 && Y > 0 && Y < height-1) {
		KinkyDungeonGrid = KinkyDungeonGrid.replaceAt(X + Y*(width+1), SetTo);
		if (VisitedRooms)
			VisitedRooms.push({x: X, y: Y});
		return true;
	}
	return false;
}

function KinkyDungeonMapGet(X, Y) {
	//let height = KinkyDungeonGrid.split('\n').length;
	let width = KinkyDungeonGrid.split('\n')[0].length;

	return KinkyDungeonGrid[X + Y*(width+1)];
}

function KinkyDungeonLightSet(X, Y, SetTo) {
	let height = KinkyDungeonGridHeight;
	let width = KinkyDungeonGridWidth;

	if (X >= 0 && X <= width-1 && Y >= 0 && Y <= height-1) {
		KinkyDungeonLightGrid = KinkyDungeonLightGrid.replaceAt(X + Y*(width+1), SetTo);
		return true;
	}
	return false;
}

function KinkyDungeonLightGet(X, Y) {
	//let height = KinkyDungeonLightGrid.split('\n').length;
	let width = KinkyDungeonLightGrid.split('\n')[0].length;

	return parseFloat(KinkyDungeonLightGrid[X + Y*(width+1)]);
}

const canvasOffsetX = 500;
const canvasOffsetY = 164;

// returns an object containing coordinates of which direction the player will move after a click, plus a time multiplier
function KinkyDungeonGetDirection(dx, dy) {

	let X = 0;
	let Y = 0;

	if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5)
		return {x:0, y:0, delta:1};

	// Cardinal directions first - up down left right
	if (dy > 0 && Math.abs(dx) < Math.abs(dy)/2.61312593) Y = 1;
	else if (dy < 0 && Math.abs(dx) < Math.abs(dy)/2.61312593) Y = -1;
	else if (dx > 0 && Math.abs(dy) < Math.abs(dx)/2.61312593) X = 1;
	else if (dx < 0 && Math.abs(dy) < Math.abs(dx)/2.61312593) X = -1;

	// Diagonals
	else if (dy > 0 && dx > dy/2.61312593) {Y = 1; X = 1;}
	else if (dy > 0 && -dx > dy/2.61312593) {Y = 1; X = -1;}
	else if (dy < 0 && dx > -dy/2.61312593) {Y = -1; X = 1;}
	else if (dy < 0 && -dx > -dy/2.61312593) {Y = -1; X = -1;}

	return {x:X, y:Y, delta:Math.round(Math.sqrt(X*X+Y*Y)*2)/2}; // Delta is always in increments of 0.5
}

// GetDirection, but it also pivots randomly 45 degrees to either side
function KinkyDungeonGetDirectionRandom(dx, dy) {
	let dir = KinkyDungeonGetDirection(dx, dy);
	let pivot = Math.floor(Math.random()*3)-1;

	if (dir.x == 0 && dir.y == 1) dir.x = pivot;
	else if (dir.x == 0 && dir.y == -1) dir.x = -pivot;
	else if (dir.x == 1 && dir.y == 0) dir.y = pivot;
	else if (dir.x == -1 && dir.y == 0) dir.y = -pivot;
	else if (dir.x == 1 && dir.y == 1) {if (pivot == 1) {dir.y = 0;} else if (pivot == -1) {dir.x = 0;}}
	else if (dir.x == 1 && dir.y == -1) {if (pivot == 1) {dir.x = 0;} else if (pivot == -1) {dir.y = 0;}}
	else if (dir.x == -1 && dir.y == 1) {if (pivot == 1) {dir.x = 0;} else if (pivot == -1) {dir.y = 0;}}
	else if (dir.x == -1 && dir.y == -1) {if (pivot == 1) {dir.y = 0;} else if (pivot == -1) {dir.x = 0;}}

	dir.delta = Math.round(Math.sqrt(dir.x*dir.x+dir.y*dir.y)*2)/2;
	return dir; // Delta is always in increments of 0.5
}


// Click function for the game portion
// @ts-ignore
// @ts-ignore
function KinkyDungeonClickGame(Level) {
	// First we handle buttons
	if (KinkyDungeonSlowMoveTurns < 1 && KinkyDungeonStatFreeze < 1 && KinkyDungeonSleepTurns < 1 && KinkyDungeonHandleHUD()) {
		if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Click.ogg");
		KinkyDungeonGameKey.keyPressed = [
			false,
			false,
			false,
			false,
			false,
			false,
			false,
			false,
		];
		return;
	}
	// beep
	else if (KinkyDungeonAutoWait && MouseIn(canvasOffsetX, canvasOffsetY, KinkyDungeonCanvas.width, KinkyDungeonCanvas.height)) {
		KinkyDungeonAutoWait = false;
		if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Damage.ogg");
	}
	// If no buttons are clicked then we handle move
	else if (KinkyDungeonSlowMoveTurns < 1 && KinkyDungeonStatFreeze < 1 && KinkyDungeonSleepTurns < 1) {
		KinkyDungeonSetMoveDirection();

		if (KinkyDungeonTargetingSpell) {
			if (MouseIn(canvasOffsetX, canvasOffsetY, KinkyDungeonCanvas.width, KinkyDungeonCanvas.height)) {
				if (KinkyDungeonSpellValid) {
					if (KinkyDungeonCastSpell(KinkyDungeonTargetX, KinkyDungeonTargetY, KinkyDungeonTargetingSpell, undefined, KinkyDungeonPlayerEntity) && KinkyDungeonTargetingSpell.sfx) {
						KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + KinkyDungeonTargetingSpell.sfx + ".ogg");
					}
					KinkyDungeonAdvanceTime(1);
					KinkyDungeonSleepTurns = 0;
					KinkyDungeonTargetingSpell = null;
				}
			} else KinkyDungeonTargetingSpell = null;
		} else if (MouseIn(canvasOffsetX, canvasOffsetY, KinkyDungeonCanvas.width, KinkyDungeonCanvas.height)) {
			if (KinkyDungeonFastMove && Math.max(Math.abs(KinkyDungeonTargetX - KinkyDungeonPlayerEntity.x), Math.abs(KinkyDungeonTargetY - KinkyDungeonPlayerEntity.y)) > 1 && KinkyDungeonLightGet(KinkyDungeonTargetX, KinkyDungeonTargetY) > 0) {
				let path = KinkyDungeonFindPath(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y, KinkyDungeonTargetX, KinkyDungeonTargetY, false, false, false, KinkyDungeonMovableTilesEnemy, true);
				if (path) {
					KinkyDungeonFastMovePath = path;
					KinkyDungeonSleepTime = 100;
				}
			} else if (!KinkyDungeonFastMove || Math.max(Math.abs(KinkyDungeonTargetX - KinkyDungeonPlayerEntity.x), Math.abs(KinkyDungeonTargetY - KinkyDungeonPlayerEntity.y)) <= 1) {
				KinkyDungeonMove(KinkyDungeonMoveDirection, 1, true);
			}
		}
	}
}

function KinkyDungeonListenKeyMove() {
	if (KinkyDungeonLastMoveTimer < performance.now() && KinkyDungeonSlowMoveTurns < 1 && KinkyDungeonStatFreeze < 1 && KinkyDungeonSleepTurns < 1) {
		let moveDirection = null;
		let moveDirectionDiag = null;

		if ((KinkyDungeonGameKey.keyPressed[0]) && KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(KinkyDungeonPlayerEntity.x,  KinkyDungeonPlayerEntity.y - 1))) moveDirection = KinkyDungeonGetDirection(0, -1);
		else if ((KinkyDungeonGameKey.keyPressed[1]) && KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(KinkyDungeonPlayerEntity.x,  KinkyDungeonPlayerEntity.y + 1))) moveDirection = KinkyDungeonGetDirection(0, 1);
		else if ((KinkyDungeonGameKey.keyPressed[2]) && KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(KinkyDungeonPlayerEntity.x - 1,  KinkyDungeonPlayerEntity.y))) moveDirection = KinkyDungeonGetDirection(-1, 0);
		else if ((KinkyDungeonGameKey.keyPressed[3]) && KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(KinkyDungeonPlayerEntity.x + 1,  KinkyDungeonPlayerEntity.y))) moveDirection = KinkyDungeonGetDirection(1, 0);
		// Diagonal moves
		if ((KinkyDungeonGameKey.keyPressed[4]) || (KinkyDungeonGameKey.keyPressed[2] && KinkyDungeonGameKey.keyPressed[0])) moveDirectionDiag = KinkyDungeonGetDirection(-1, -1);
		else if ((KinkyDungeonGameKey.keyPressed[5]) || (KinkyDungeonGameKey.keyPressed[3] && KinkyDungeonGameKey.keyPressed[0])) moveDirectionDiag = KinkyDungeonGetDirection(1, -1);
		else if ((KinkyDungeonGameKey.keyPressed[6]) || (KinkyDungeonGameKey.keyPressed[2] && KinkyDungeonGameKey.keyPressed[1])) moveDirectionDiag = KinkyDungeonGetDirection(-1, 1);
		else if ((KinkyDungeonGameKey.keyPressed[7]) || (KinkyDungeonGameKey.keyPressed[3] && KinkyDungeonGameKey.keyPressed[1])) moveDirectionDiag = KinkyDungeonGetDirection(1, 1);

		if ((KinkyDungeonGameKey.keyPressed[8])) {moveDirection = KinkyDungeonGetDirection(0, 0); moveDirectionDiag = null;}

		if (moveDirectionDiag && KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(moveDirectionDiag.x + KinkyDungeonPlayerEntity.x,  moveDirectionDiag.y + KinkyDungeonPlayerEntity.y))) {
			moveDirection = moveDirectionDiag;
		}

		if (moveDirection) {
			if (KinkyDungeonLastMoveTimerStart < performance.now() && KinkyDungeonLastMoveTimerStart > 0) {
				KinkyDungeonMove(moveDirection, 1, KinkyDungeonLastMoveTimer == 0);
				KinkyDungeonLastMoveTimer = performance.now() + KinkyDungeonLastMoveTimerCooldown;
			} else if (KinkyDungeonLastMoveTimerStart == 0) {
				KinkyDungeonLastMoveTimerStart = performance.now()+ KinkyDungeonLastMoveTimerCooldownStart;
			}


		}
	}
	if (KinkyDungeonLastMoveTimerStart < performance.now() && KinkyDungeonLastMoveTimer == 0) KinkyDungeonLastMoveTimerStart = 0;
	if (!KinkyDungeonGameKey.keyPressed.some((element)=>{return element;})) { KinkyDungeonLastMoveTimer = 0; KinkyDungeonDoorCloseTimer = 0;}
}

function KinkyDungeonGameKeyDown() {
	let moveDirection = null;



	/*
	// Cardinal moves
	if ((KeyPress == KinkyDungeonKey[0])) moveDirection = KinkyDungeonGetDirection(0, -1);
	else if ((KeyPress == KinkyDungeonKey[1])) moveDirection = KinkyDungeonGetDirection(-1, 0);
	else if ((KeyPress == KinkyDungeonKey[2])) moveDirection = KinkyDungeonGetDirection(0, 1);
	else if ((KeyPress == KinkyDungeonKey[3])) moveDirection = KinkyDungeonGetDirection(1, 0);
	// Diagonal moves
	else if ((KeyPress == KinkyDungeonKey[4])) moveDirection = KinkyDungeonGetDirection(-1, -1);
	else if ((KeyPress == KinkyDungeonKey[5])) moveDirection = KinkyDungeonGetDirection(1, -1);
	else if ((KeyPress == KinkyDungeonKey[6])) moveDirection = KinkyDungeonGetDirection(-1, 1);
	else if ((KeyPress == KinkyDungeonKey[7])) moveDirection = KinkyDungeonGetDirection(1, 1);

	else if (KinkyDungeonKeyWait.includes(KeyPress)) moveDirection = KinkyDungeonGetDirection(0, 0);
	*/

	/*
	if ((KeyPress == KinkyDungeonKey[0]) || (KeyPress == KinkyDungeonKeyLower[0]) || (KeyPress == KinkyDungeonKeyNumpad[0])) moveDirection = KinkyDungeonGetDirection(0, -1);
	else if ((KeyPress == KinkyDungeonKey[1]) || (KeyPress == KinkyDungeonKeyLower[1]) || (KeyPress == KinkyDungeonKeyNumpad[1])) moveDirection = KinkyDungeonGetDirection(-1, 0);
	else if ((KeyPress == KinkyDungeonKey[2]) || (KeyPress == KinkyDungeonKeyLower[2]) || (KeyPress == KinkyDungeonKeyNumpad[2])) moveDirection = KinkyDungeonGetDirection(0, 1);
	else if ((KeyPress == KinkyDungeonKey[3]) || (KeyPress == KinkyDungeonKeyLower[3]) || (KeyPress == KinkyDungeonKeyNumpad[3])) moveDirection = KinkyDungeonGetDirection(1, 0);
	// Diagonal moves
	else if ((KeyPress == KinkyDungeonKey[4]) || (KeyPress == KinkyDungeonKeyLower[4]) || (KeyPress == KinkyDungeonKeyNumpad[4])) moveDirection = KinkyDungeonGetDirection(-1, -1);
	else if ((KeyPress == KinkyDungeonKey[5]) || (KeyPress == KinkyDungeonKeyLower[5]) || (KeyPress == KinkyDungeonKeyNumpad[5])) moveDirection = KinkyDungeonGetDirection(1, -1);
	else if ((KeyPress == KinkyDungeonKey[6]) || (KeyPress == KinkyDungeonKeyLower[6]) || (KeyPress == KinkyDungeonKeyNumpad[6])) moveDirection = KinkyDungeonGetDirection(-1, 1);
	else if ((KeyPress == KinkyDungeonKey[7]) || (KeyPress == KinkyDungeonKeyLower[7]) || (KeyPress == KinkyDungeonKeyNumpad[7])) moveDirection = KinkyDungeonGetDirection(1, 1);
	*/

	if (moveDirection) {
		KinkyDungeonMove(moveDirection, 1);
	// @ts-ignore
	} else if (KinkyDungeonKeySpell.includes(KeyPress)) {
		// @ts-ignore
		KinkyDungeonSpellPress = KeyPress;
		KinkyDungeonHandleSpell();
	}
}

function KinkyDungeonSendTextMessage(priority, text, color, time, noPush, noDupe) {
	if (text) {
		if (!noPush)
			if (!noDupe || KinkyDungeonMessageLog.length == 0 || !KinkyDungeonMessageLog[KinkyDungeonMessageLog.length-1] || text != KinkyDungeonMessageLog[KinkyDungeonMessageLog.length-1].text)
				KinkyDungeonMessageLog.push({text: text, color: color});
		if ( priority >= KinkyDungeonTextMessagePriority || KinkyDungeonActionMessageTime < 0.5) {
			KinkyDungeonTextMessageTime = time;
			KinkyDungeonTextMessage = text;
			KinkyDungeonTextMessageColor = color;
			KinkyDungeonTextMessagePriority = priority;
			return true;
		}
	}
	return false;
}


function KinkyDungeonSendActionMessage(priority, text, color, time, noPush, noDupe) {
	if (text) {
		if (!noPush)
			if (!noDupe || KinkyDungeonMessageLog.length == 0 || !KinkyDungeonMessageLog[KinkyDungeonMessageLog.length-1] || text != KinkyDungeonMessageLog[KinkyDungeonMessageLog.length-1].text)
				KinkyDungeonMessageLog.push({text: text, color: color});
		if ( priority >= KinkyDungeonActionMessagePriority || KinkyDungeonActionMessageTime < 0.5) {
			KinkyDungeonActionMessageTime = time;
			KinkyDungeonActionMessage = text;
			KinkyDungeonActionMessageColor = color;
			KinkyDungeonActionMessagePriority = priority;
			return true;
		}
	}
	return false;
}


function KinkyDungeonMove(moveDirection, delta, AllowInteract) {
	let moveX = moveDirection.x + KinkyDungeonPlayerEntity.x;
	let moveY = moveDirection.y + KinkyDungeonPlayerEntity.y;
	let moved = false;
	let Enemy = KinkyDungeonEnemyAt(moveX, moveY);
	if (Enemy && (!Enemy.Enemy || !Enemy.Enemy.noblockplayer)) {
		if (AllowInteract) {
			let attackCost = KinkyDungeonStatStaminaCostAttack;
			if (KinkyDungeonPlayerDamage && KinkyDungeonPlayerDamage.staminacost) attackCost = -KinkyDungeonPlayerDamage.staminacost;
			if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "AttackStamina")) {
				attackCost = Math.min(0, attackCost * KinkyDungeonMultiplicativeStat(KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "AttackStamina")));
			}
			if (KinkyDungeonHasStamina(Math.abs(attackCost), true)) {
				KinkyDungeonAttackEnemy(Enemy, {damage: KinkyDungeonPlayerDamage.dmg, type: KinkyDungeonPlayerDamage.type});
				KinkyDungeonLastAction = "Attack";

				KinkyDungeonChangeStamina(attackCost);

			} else {
				KinkyDungeonWaitMessage();
			}

			KinkyDungeonSleepTurns = 0;
			KinkyDungeonAdvanceTime(1);
		}
	} else {
		if (moveDirection.x == 0 && moveDirection.y == 0) KinkyDungeonDoorCloseTimer = 0; // Allow manually waiting to turn around and be able to slam a door
		else if (KinkyDungeonLastMoveDirection && !(KinkyDungeonLastMoveDirection.x == 0 && KinkyDungeonLastMoveDirection.y == 0) && (Math.abs(KinkyDungeonLastMoveDirection.x - moveDirection.x) + Math.abs(KinkyDungeonLastMoveDirection.y - moveDirection.y)) <= 1) {
			KinkyDungeonDoorCloseTimer = Math.max(KinkyDungeonDoorCloseTimer, 1); // if you are running in the same direction you cant close the door without turning around. this also helps speed up the game
		}

		let moveObject = KinkyDungeonMapGet(moveX, moveY);
		if (KinkyDungeonMovableTiles.includes(moveObject) && (KinkyDungeonNoEnemy(moveX, moveY) || (Enemy.Enemy && Enemy.Enemy.noblockplayer))) { // If the player can move to an empy space or a door
			if (!KinkyDungeonToggleAutoDoor) KinkyDungeonDoorCloseTimer = 1;
			if (KinkyDungeonTiles["" + moveX + "," + moveY] && ((moveObject == 'd' && KinkyDungeonTargetTile == null && KinkyDungeonNoEnemy(moveX, moveY, true) && KinkyDungeonDoorCloseTimer <= 0)
				|| (KinkyDungeonTiles["" + moveX + "," + moveY].Type != "Trap" && (KinkyDungeonTiles["" + moveX + "," + moveY].Type != "Door" || (KinkyDungeonTiles["" + moveX + "," + moveY].Lock && KinkyDungeonTiles["" + moveX + "," + moveY].Type == "Door"))))) {
				if (AllowInteract) {
					KinkyDungeonTargetTileLocation = "" + moveX + "," + moveY;
					KinkyDungeonTargetTile = KinkyDungeonTiles[KinkyDungeonTargetTileLocation];
					KinkyDungeonTargetTileMsg();
					KinkyDungeonDoorCloseTimer = 2; // To avoid cases with severe annoyance while walking through halls with lots of doors
				}
			} else if (moveX != KinkyDungeonPlayerEntity.x || moveY != KinkyDungeonPlayerEntity.y) {
				let newDelta = 1;
				if (KinkyDungeonDoorCloseTimer > 0) KinkyDungeonDoorCloseTimer -= 1;
				KinkyDungeonTargetTile = null;
				KinkyDungeonTargetTileLocation = "";
				if (moveObject == 'D') { // Open the door
					KinkyDungeonMapSet(moveX, moveY, 'd');
					if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/DoorOpen.ogg");
					KinkyDungeonDoorCloseTimer = 1;
				} else if (moveObject == 'C') { // Open the chest
					KinkyDungeonLoot(MiniGameKinkyDungeonLevel, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint], "chest");
					KinkyDungeonAddChest(1, MiniGameKinkyDungeonLevel);
					if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/ChestOpen.ogg");
					KinkyDungeonMapSet(moveX, moveY, 'c');
				} else if (moveObject == 'O') { // Open the chest
					KinkyDungeonTakeOrb(1); // 1 spell point
					if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Magic.ogg");
					KinkyDungeonMapSet(moveX, moveY, 'o');
				} else {// Move
					//if (KinkyDungeonHasStamina(0)) { // You can only move if your stamina is > 0
					KinkyDungeonMovePoints = Math.min(Math.ceil(KinkyDungeonSlowLevel + 1), KinkyDungeonMovePoints + delta); // Can't store extra move points

					if (KinkyDungeonStatBind) KinkyDungeonMovePoints = 0;

					if (KinkyDungeonMovePoints >= 1) {// Math.max(1, KinkyDungeonSlowLevel) // You need more move points than your slow level, unless your slow level is 1
						newDelta = Math.max(newDelta, KinkyDungeonMoveTo(moveX, moveY));
						KinkyDungeonLastAction = "Move";
						moved = true;
						if (KinkyDungeonSound) {
							if (moveObject == 'w')
								AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/FootstepWater.ogg");
							else AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Footstep.ogg");
						}

						if (moveObject == 'g') {
							KinkyDungeonSendActionMessage(2, TextGet("KinkyDungeonGrateEnter"), "white", 3);
							KinkyDungeonSlowMoveTurns = Math.max(KinkyDungeonSlowMoveTurns, 1);
							KinkyDungeonSleepTurns = CommonTime() + 250;
						}
					}

					// Messages to inform player they are slowed
					if (KinkyDungeonSlowLevel > 0) {
						let plugLevel = Math.round(Math.min(3, KinkyDungeonStatPlugLevel));
						let dict = KinkyDungeonPlugCount > 1 ? "plugs" : "plug";
						let dicts = KinkyDungeonPlugCount > 1 ? "" : "s";
						if (KinkyDungeonSlowLevel == 0 && KinkyDungeonPlugCount > 0) KinkyDungeonSendTextMessage(0, TextGet("KinkyDungeonPlugWalk" + plugLevel).replace("plugs", dict).replace("(s)", dicts), "yellow", 2, true);
						if (KinkyDungeonSlowLevel == 1) KinkyDungeonSendTextMessage(1, TextGet("KinkyDungeonSlowed" + plugLevel).replace("plugs", dict).replace("(s)", dicts), "yellow", 2, true);
						else if (KinkyDungeonSlowLevel == 2) KinkyDungeonSendTextMessage(1, TextGet("KinkyDungeonHopping" + plugLevel).replace("plugs", dict).replace("(s)", dicts), "orange", 2, true);
						else if (KinkyDungeonSlowLevel == 3) KinkyDungeonSendTextMessage(1, TextGet("KinkyDungeonInching" + plugLevel).replace("plugs", dict).replace("(s)", dicts), "red", 2, true);
						else if (KinkyDungeonSlowLevel < 10) KinkyDungeonSendTextMessage(1, TextGet("KinkyDungeonCrawling" + plugLevel).replace("plugs", dict).replace("(s)", dicts), "red", 2, true);
						else KinkyDungeonSendTextMessage(1, TextGet("KinkyDungeonCantMove" + plugLevel).replace("plugs", dict).replace("(s)", dicts), "red", 2, true);

						let moveMult = Math.max(1, KinkyDungeonSlowLevel);
						if (KinkyDungeonSlowLevel > 9) moveMult = 1;
						if ((moveDirection.x != 0 || moveDirection.y != 0)) {
							KinkyDungeonChangeStamina(moveMult * (KinkyDungeonStatStaminaRegenPerSlowLevel * KinkyDungeonSlowLevel) * delta);
							KinkyDungeonStatWillpowerExhaustion = Math.max(1, KinkyDungeonStatWillpowerExhaustion);
							KinkyDungeonStatArousal += (KinkyDungeonStatPlugLevel * KinkyDungeonArousalPerPlug * moveMult);
							if (KinkyDungeonHasCrotchRope) {
								if (KinkyDungeonStatPlugLevel == 0) KinkyDungeonSendTextMessage(1, TextGet("KinkyDungeonCrotchRope"), "pink", 2);
								KinkyDungeonStatArousal += (KinkyDungeonCrotchRopeArousal * moveMult);
							}
							if (KinkyDungeonVibeLevel == 0 && KinkyDungeonStatPlugLevel > 0 && !KinkyDungeonHasCrotchRope) KinkyDungeonStatArousal -= KinkyDungeonStatArousalRegen;
						} else if (KinkyDungeonStatStamina < KinkyDungeonStatStaminaMax) {
							KinkyDungeonMovePoints = 0;
							KinkyDungeonWaitMessage();
						}
					}

					if (moveObject == 'R') {
						if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Coins.ogg");
						KinkyDungeonLoot(MiniGameKinkyDungeonLevel, MiniGameKinkyDungeonCheckpoint, "rubble");

						KinkyDungeonMapSet(moveX, moveY, 'r');
					}
					KinkyDungeonTrapMoved = true;
					//}
				}
				KinkyDungeonSleepTurns = 0;
				//for (let d = 0; d < newDelta; d++)
				// KinkyDungeonAdvanceTime(1, false, d != 0); // was moveDirection.delta, but became too confusing
				if (newDelta > 1 && newDelta < 10) {
					KinkyDungeonSlowMoveTurns = newDelta -1;
					KinkyDungeonSleepTime = CommonTime() + 200;
				}
				KinkyDungeonAdvanceTime(1);
			} else {
				KinkyDungeonWaitMessage();
				KinkyDungeonAdvanceTime(1); // was moveDirection.delta, but became too confusing
			}
		} else { // If we are blind we can bump into walls!
			if (KinkyDungeonGetVisionRadius() <= 1) {
				if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Footstep.ogg");
				KinkyDungeonSleepTurns = 0;
				KinkyDungeonAdvanceTime(1);
			}
		}
	}

	KinkyDungeonLastMoveDirection = moveDirection;

	return moved;
}

function KinkyDungeonWaitMessage(NoTime) {
	if (KinkyDungeonStatWillpowerExhaustion > 1) KinkyDungeonSendActionMessage(3, TextGet("WaitSpellExhaustion"), "orange", 2);
	else if (!KinkyDungeonHasStamina(5, false)) KinkyDungeonSendActionMessage(1, TextGet("WaitExhaustion"
		+ (KinkyDungeonStatArousal > KinkyDungeonStatArousalMax*0.33 ?
			((KinkyDungeonStatArousal > KinkyDungeonStatArousalMax*0.67 ?
				"ArousedHeavy"
				: "Aroused"))
				: "")), "yellow", 2);
	else KinkyDungeonSendActionMessage(1, TextGet("Wait" + (KinkyDungeonStatArousal > 12 ? "Aroused" : "")), "silver", 2);

	if (!NoTime && KinkyDungeonStatStamina < KinkyDungeoNStatStaminaLow)
		KinkyDungeonStatStamina += KinkyDungeonStatStaminaRegenWait;
}

// Returns th number of turns that must elapse
function KinkyDungeonMoveTo(moveX, moveY) {
	//if (KinkyDungeonNoEnemy(moveX, moveY, true)) {
	KinkyDungeonPlayerEntity.x = moveX;
	KinkyDungeonPlayerEntity.y = moveY;

	KinkyDungeonMovePoints = 0;
	return Math.max(1, KinkyDungeonSlowLevel);
	//}
	//return 0;
}

let KinkyDungeonLastAction = "";
let KinkyDungeonLastTurnAction = "";

function KinkyDungeonAdvanceTime(delta, NoUpdate, NoMsgTick) {
	KDRecentRepIndex = 0;
	let start = performance.now();
	KinkyDungeonRestraintAdded = false;
	KinkyDungeonSFX = [];

	//if (KinkyDungeonMovePoints < 0 && KinkyDungeonStatBind < 1) KinkyDungeonMovePoints = 0;

	KinkyDungeonResetEventVariablesTick();
	KinkyDungeonSendInventoryEvent("tick", {delta: delta});

	if (delta >= 1) {
		KinkyDungeonHandleTraps(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y, KinkyDungeonTrapMoved);
	}

	KinkyDungeonHandleVibrators();
	// Here we move enemies and such
	KinkyDungeonUpdateLightGrid = true;
	if (!NoMsgTick) {
		if (KinkyDungeonTextMessageTime > 0) KinkyDungeonTextMessageTime -= 1;
		if (KinkyDungeonTextMessageTime <= 0) KinkyDungeonTextMessagePriority = 0;
		if (KinkyDungeonActionMessageTime > 0) KinkyDungeonActionMessageTime -= 1;
		if (KinkyDungeonActionMessageTime <= 0) KinkyDungeonActionMessagePriority = 0;
	}

	// Updates the character's stats
	KinkyDungeonCurrentTick += 1;
	if (KinkyDungeonCurrentTick > 100000) KinkyDungeonCurrentTick = 0;
	KinkyDungeonItemCheck(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y, MiniGameKinkyDungeonLevel); //console.log("Item Check " + (performance.now() - now));
	KinkyDungeonUpdateBuffs(delta);
	KinkyDungeonUpdateBulletsCollisions(delta); //console.log("Bullet Check " + (performance.now() - now));
	KinkyDungeonUpdateEnemies(delta); //console.log("Enemy Check " + (performance.now() - now));
	KinkyDungeonUpdateBullets(delta); //console.log("Bullets Check " + (performance.now() - now));
	KinkyDungeonUpdateBulletsCollisions(delta, true); //"catchup" phase for explosions!
	KinkyDungeonUpdateStats(delta);

	let toTile = KinkyDungeonMapGet(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y);
	if (toTile == 's' || toTile == 'H') { // Go down the next stairs

		if (MiniGameKinkyDungeonLevel > Math.max(KinkyDungeonRep, ReputationGet("Gaming")) || Math.max(KinkyDungeonRep, ReputationGet("Gaming")) > KinkyDungeonMaxLevel) {
			KinkyDungeonRep = Math.max(KinkyDungeonRep, MiniGameKinkyDungeonLevel);
			DialogSetReputation("Gaming", KinkyDungeonRep);
		}

		MiniGameKinkyDungeonLevel += 1;

		let currCheckpoint = MiniGameKinkyDungeonCheckpoint;
		if (toTile == 's') {
			KinkyDungeonSendActionMessage(10, TextGet("ClimbDown"), "#ffffff", 1);
			KinkyDungeonSetCheckPoint();
		} else if (toTile == 'H') {
			KinkyDungeonSendActionMessage(10, TextGet("ClimbDownShortcut"), "#ffffff", 1);
			KinkyDungeonSetCheckPoint(MiniGameKinkyDungeonShortcut);
		}
		// Reduce security level when entering a new area
		if (MiniGameKinkyDungeonCheckpoint != currCheckpoint)
			KinkyDungeonChangeRep("Prisoner", -5);
		else // Otherwise it's just a little bit
			KinkyDungeonChangeRep("Prisoner", -1);

		if (MiniGameKinkyDungeonLevel >= KinkyDungeonMaxLevel) {
			KinkyDungeonState = "End";
			MiniGameVictory = true;
		} else
			KinkyDungeonCreateMap(KinkyDungeonMapParams[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]], MiniGameKinkyDungeonLevel);
	}
	// else if (KinkyDungeonStatWillpower == 0) {
	// KinkyDungeonState = "Lose";
	//}

	if (!NoUpdate)
		KinkyDungeonMultiplayerUpdate(KinkyDungeonNextDataSendTimeDelay);

	if (KinkyDungeonStatStamina < KinkyDungeonStatStaminaMax * 0.5) {
		let msg = "KinkyDungeonStaminaWarningMed";
		if (KinkyDungeonStatStamina < 12) msg = "KinkyDungeonStaminaWarningLow";
		if (KinkyDungeonStatStamina < 4) msg = "KinkyDungeonStaminaWarningNone";
		if (!KinkyDungeonSendActionMessage(1, TextGet(msg), "#ff8800", 1, true))
			KinkyDungeonSendTextMessage(1, TextGet(msg), "#ff8800", 1, true);
	}
	let gagchance = KinkyDungeonGagMumbleChance;
	for (let inv of KinkyDungeonRestraintList()) {
		if (inv.restraint)
			gagchance += KinkyDungeonGagMumbleChancePerRestraint;
	}
	if (!KinkyDungeonPlayer.CanTalk() && Math.random() < gagchance) {
		let msg = "KinkyDungeonGagMumble";
		let gagMsg = Math.floor(Math.random() * 5);
		let GagEffect = -2;
		GagEffect += SpeechGetGagLevel(KinkyDungeonPlayer, "ItemMouth");
		GagEffect += SpeechGetGagLevel(KinkyDungeonPlayer, "ItemMouth2");
		GagEffect += SpeechGetGagLevel(KinkyDungeonPlayer, "ItemMouth3");
		gagMsg += GagEffect/3;
		gagMsg = Math.max(0, Math.min(7, Math.floor(gagMsg)));

		if (Math.random() < KinkyDungeonStatArousal / KinkyDungeonStatArousalMax) msg = "KinkyDungeonGagMumbleAroused";

		msg = msg + gagMsg;

		if (!KinkyDungeonSendActionMessage(1, TextGet(msg), "#ffffff", 1, true))
			KinkyDungeonSendTextMessage(1, TextGet(msg), "#ffffff", 1, true);
	}
	let end = performance.now();
	if (KDDebug) console.log(`Tick ${KinkyDungeonCurrentTick} took ${(end - start)} milliseconds.`);

	KinkyDungeonLastTurnAction = KinkyDungeonLastAction;
	KinkyDungeonLastAction = "";
}


function KinkyDungeonTargetTileMsg() {
	if (KinkyDungeonTargetTile.Type == "Ghost") {
		KinkyDungeonGhostMessage();
	} else if (KinkyDungeonTargetTile.Lock) {
		if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Locked.ogg");
		KinkyDungeonSendTextMessage(2, TextGet("KinkyDungeonObjectLock").replace("TYPE", TextGet("KinkyDungeonShrine" + KinkyDungeonTargetTile.Name)), "white", 1, false, true);
	} else {
		let suff = "";
		if (KinkyDungeonTargetTile.Name == "Commerce") suff = "Commerce";
		KinkyDungeonSendTextMessage(2, TextGet("KinkyDungeonObject" + KinkyDungeonTargetTile.Type + suff).replace("TYPE", TextGet("KinkyDungeonShrine" + KinkyDungeonTargetTile.Name)), "white", 1);
	}
}