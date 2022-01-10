"use strict";
var KinkyDungeonBackground = "BrickWall";
var KinkyDungeonPlayer = null;
var KinkyDungeonState = "Menu";

var KinkyDungeonRep = 0; // Variable to store max level to avoid losing it if the server doesnt take the rep update

var KinkyDungeonKeybindings = null;
var KinkyDungeonKeybindingsTemp = null;
var KinkyDungeonKeybindingCurrentKey = 0;

var KinkyDungeonGameRunning = false;

//var KinkyDungeonKeyLower = [87+32, 65+32, 83+32, 68+32, 81+32, 45+32, 90+32, 43+32]; // WASD
var KinkyDungeonKey = [119, 97, 115, 100, 113, 101, 122, 99]; // WASD
//var KinkyDungeonKeyNumpad = [56, 52, 50, 54, 55, 57, 49, 51]; // Numpad
var KinkyDungeonKeySpell = [49, 50, 51]; // 1 2 3
var KinkyDungeonKeyWait = [120]; // x

var KinkyDungeonRootDirectory = "Screens/MiniGame/KinkyDungeon/";
var KinkyDungeonPlayerCharacter = null; // Other player object
var KinkyDungeonGameData = null; // Data sent by other player
var KinkyDungeonGameDataNullTimer = 4000; // If data is null, we query this often
var KinkyDungeonGameDataNullTimerTime = 0;
var KinkyDungeonStreamingPlayers = []; // List of players to stream to

var KinkyDungeonInitTime = 0;

var KinkyDungeonSleepTime = 0;


/**
 * Loads the kinky dungeon game
 * @returns {void} - Nothing
 */
function KinkyDungeonLoad() {
	CurrentDarkFactor = 0;

	KinkyDungeonInitTime = CommonTime();
	KinkyDungeonGameKey.load();

	if (!KinkyDungeonIsPlayer()) KinkyDungeonGameRunning = false;

	if (!Player.KinkyDungeonExploredLore) Player.KinkyDungeonExploredLore = [];
	//if (!Player.KinkyDungeonSave) Player.KinkyDungeonSave = {};

	if (!KinkyDungeonGameRunning) {
		if (!KinkyDungeonPlayer)
			KinkyDungeonPlayer = CharacterLoadNPC("NPC_Avatar");

		var appearance = CharacterAppearanceStringify(KinkyDungeonPlayerCharacter ? KinkyDungeonPlayerCharacter : Player);
		CharacterAppearanceRestore(KinkyDungeonPlayer, appearance);
		CharacterReleaseTotal(KinkyDungeonPlayer);
		CharacterNaked(KinkyDungeonPlayer);
		KinkyDungeonInitializeDresses();
		KinkyDungeonDressPlayer();

		KinkyDungeonKeybindings = Player.KinkyDungeonKeybindings;

		if (KinkyDungeonIsPlayer()) {
			KinkyDungeonState = "Menu";
			KinkyDungeonGameData = null;

			CharacterAppearancePreviousEmoticon = WardrobeGetExpression(Player).Emoticon;
			ServerSend("ChatRoomCharacterExpressionUpdate", { Name: "Gaming", Group: "Emoticon", Appearance: ServerAppearanceBundle(Player.Appearance) });
		} else {
			KinkyDungeonState = "Game";
			if (!KinkyDungeonGameData) KinkyDungeonInitialize(1);
		}

		for (let G = 0; G < KinkyDungeonStruggleGroupsBase.length; G++) {
			let group = KinkyDungeonStruggleGroupsBase[G];
			if (group == "ItemM") {
				if (InventoryGet(Player, "ItemMouth"))
					KinkyDungeonRestraintsLocked.push("ItemMouth");
				if (InventoryGet(Player, "ItemMouth2"))
					KinkyDungeonRestraintsLocked.push("ItemMouth2");
				if (InventoryGet(Player, "ItemMouth3"))
					KinkyDungeonRestraintsLocked.push("ItemMouth3");
			}

			if (InventoryGet(Player, group))
				KinkyDungeonRestraintsLocked.push(group);
		}
	}
}

/**
 * Restricts Devious Dungeon Challenge to only occur when inside the arcade
 * @returns {boolean} - If the player is in the arcade
 */
function KinkyDungeonDeviousDungeonAvailable() {
	return KinkyDungeonIsPlayer() && (DialogGamingPreviousRoom == "Arcade" || MiniGameReturnFunction == "ArcadeKinkyDungeonEnd");
}

/**
 * Returns whether or not the player is the one playing, which determines whether or not to draw the UI and struggle groups
 * @returns {boolean} - If the player is the game player
 */
function KinkyDungeonIsPlayer() {
	return (!KinkyDungeonPlayerCharacter || KinkyDungeonPlayerCharacter == Player) ;
}

/**
 * Runs the kinky dungeon game and draws its components on screen
 * @returns {void} - Nothing
 */
function KinkyDungeonRun() {
	let BG = "BrickWall";
	let params = KinkyDungeonMapParams[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]];
	if (params && params.background) BG = params.background;
	if (KinkyDungeonState == "Lose") BG = "Pandora/Underground/Cell4";
	DrawImage("Backgrounds/" + BG + ".jpg", 0, 0);

	// Draw the characters
	DrawCharacter(KinkyDungeonPlayer, 0, 0, 1);

	if (KinkyDungeonDrawState == "Game" || KinkyDungeonState != "Game")
		DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");

	if (KinkyDungeonState == "Menu") {
		// Draw temp start screen
		DrawText(TextGet("Intro"), 1250, 400, "white", "silver");
		DrawText(TextGet("Intro2"), 1250, 500, "white", "silver");
		DrawText(TextGet("Intro3"), 1250, 600, "white", "silver");
		DrawText(TextGet("Intro4"), 1250, 700, "white", "silver");

		if (ArcadeDeviousChallenge && KinkyDungeonDeviousDungeonAvailable())
			DrawText(TextGet("DeviousChallenge"), 1250, 925, "white", "silver");

		DrawButton(875, 750, 350, 64, TextGet("GameStart"), "White", "");
		DrawButton(1075, 820, 350, 64, TextGet("LoadGame"), "White", "");
		DrawButton(1275, 750, 350, 64, TextGet("GameConfigKeys"), "White", "");
	} else if (KinkyDungeonState == "Load") {
		DrawButton(875, 750, 350, 64, TextGet("KinkyDungeonLoadConfirm"), "White", "");
		DrawButton(1275, 750, 350, 64, TextGet("KinkyDungeonLoadBack"), "White", "");

		ElementPosition("saveInputField", 1250, 550, 1000, 230);
	} else if (KinkyDungeonState == "Save") {
		// Draw temp start screen
		DrawText(TextGet("KinkyDungeonSaveIntro0"), 1250, 350, "white", "silver");
		DrawText(TextGet("KinkyDungeonSaveIntro"), 1250, 475, "white", "silver");
		DrawText(TextGet("KinkyDungeonSaveIntro2"), 1250, 550, "white", "silver");
		DrawText(TextGet("KinkyDungeonSaveIntro3"), 1250, 625, "white", "silver");
		DrawText(TextGet("KinkyDungeonSaveIntro4"), 1250, 700, "white", "silver");

		ElementPosition("saveDataField", 1250, 150, 1000, 230);

		DrawButton(875, 750, 350, 64, TextGet("KinkyDungeonGameSave"), "White", "");
		DrawButton(1275, 750, 350, 64, TextGet("KinkyDungeonGameContinue"), "White", "");
	} else if (KinkyDungeonState == "Lose") {
		// Draw temp start screen
		DrawText(TextGet("End"), 1250, 400, "white", "silver");
		DrawText(TextGet("End2"), 1250, 500, "white", "silver");
		DrawText(TextGet("End3"), 1250, 600, "white", "silver");
		DrawButton(875, 750, 350, 64, TextGet("GameStart"), "White", "");
		DrawButton(1075, 820, 350, 64, TextGet("LoadGame"), "White", "");
		DrawButton(1275, 750, 350, 64, TextGet("GameConfigKeys"), "White", "");
	} else if (KinkyDungeonState == "Game") {
		KinkyDungeonGameRunning = true;
		KinkyDungeonDrawGame();
		if (KinkyDungeonSleepTurns > 0) {
			if (CommonTime() > KinkyDungeonSleepTime) {
				KinkyDungeonSleepTurns -= 1;
				KinkyDungeonAdvanceTime(1);
				KinkyDungeonSleepTime = CommonTime() + 100;
				if (KinkyDungeonStatStamina >= KinkyDungeonStatStaminaMax) KinkyDungeonSleepTurns = 0;
			}
		} else if (KinkyDungeonSlowMoveTurns > 0) {
			if (CommonTime() > KinkyDungeonSleepTime) {
				KinkyDungeonSlowMoveTurns -= 1;
				KinkyDungeonAdvanceTime(1, false, true);
				KinkyDungeonSleepTime = CommonTime() + Math.max(100, 200 - 50 * KinkyDungeonSlowMoveTurns);
			}
		} else KinkyDungeonSleepTime = CommonTime() + 100;
	} else if (KinkyDungeonState == "End") {
		KinkyDungeonGameRunning = false;
		// Draw temp start screen
		DrawText(TextGet("EndWin"), 1250, 400, "white", "silver");
		DrawText(TextGet("EndWin2"), 1250, 500, "white", "silver");
	} else if (KinkyDungeonState == "Keybindings") {
		// Draw temp start screen
		DrawButton(1075, 750, 350, 64, TextGet("GameReturnToMenu"), "White", "");

		// Draw key buttons
		DrawButton(1075, 350, 350, 64, TextGet("KinkyDungeonKeyUp") + ": '" + String.fromCharCode(KinkyDungeonKeybindingsTemp.Up) + "'", "White", "");
		DrawButton(1075, 550, 350, 64, TextGet("KinkyDungeonKeyDown") + ": '" + String.fromCharCode(KinkyDungeonKeybindingsTemp.Down) + "'", "White", "");
		DrawButton(675, 450, 350, 64, TextGet("KinkyDungeonKeyLeft") + ": '" + String.fromCharCode(KinkyDungeonKeybindingsTemp.Left) + "'", "White", "");
		DrawButton(1475, 450, 350, 64, TextGet("KinkyDungeonKeyRight") + ": '" + String.fromCharCode(KinkyDungeonKeybindingsTemp.Right) + "'", "White", "");

		DrawButton(675, 350, 350, 64, TextGet("KinkyDungeonKeyUpLeft") + ": '" + String.fromCharCode(KinkyDungeonKeybindingsTemp.UpLeft) + "'", "White", "");
		DrawButton(1475, 350, 350, 64, TextGet("KinkyDungeonKeyUpRight") + ": '" + String.fromCharCode(KinkyDungeonKeybindingsTemp.UpRight) + "'", "White", "");
		DrawButton(675, 550, 350, 64, TextGet("KinkyDungeonKeyDownLeft") + ": '" + String.fromCharCode(KinkyDungeonKeybindingsTemp.DownLeft) + "'", "White", "");
		DrawButton(1475, 550, 350, 64, TextGet("KinkyDungeonKeyDownRight") + ": '" + String.fromCharCode(KinkyDungeonKeybindingsTemp.DownRight) + "'", "White", "");

		DrawButton(1075, 450, 350, 64, TextGet("KinkyDungeonKeyWait") + ": '" + String.fromCharCode(KinkyDungeonKeybindingsTemp.Wait) + "'", "White", "");

		DrawButton(675, 200, 350, 64, TextGet("KinkyDungeonKeySpell1") + ": '" + String.fromCharCode(KinkyDungeonKeybindingsTemp.Spell1) + "'", "White", "");
		DrawButton(1075, 200, 350, 64, TextGet("KinkyDungeonKeySpell2") + ": '" + String.fromCharCode(KinkyDungeonKeybindingsTemp.Spell2) + "'", "White", "");
		DrawButton(1475, 200, 350, 64, TextGet("KinkyDungeonKeySpell3") + ": '" + String.fromCharCode(KinkyDungeonKeybindingsTemp.Spell3) + "'", "White", "");

		if (KinkyDungeonKeybindingCurrentKey > 0)
			DrawText(TextGet("KinkyDungeonCurrentPress") + ": '" + String.fromCharCode(KinkyDungeonKeybindingCurrentKey) + "'", 1250, 900, "white", "silver");

		DrawText(TextGet("KinkyDungeonCurrentPressInfo"), 1250, 950, "white", "silver");
	}

}

/**
 * Handles clicks during the kinky dungeon game
 * @returns {void} - Nothing
 */
function KinkyDungeonClick() {
	if (MouseIn(1885, 25, 90, 90) && (KinkyDungeonDrawState == "Game" || KinkyDungeonState != "Game")) {
		ElementRemove("saveDataField");
		ElementRemove("saveInputField");
		KinkyDungeonExit();
	}

	if (KinkyDungeonState == "Load"){
		if (MouseIn(875, 750, 350, 64)) {
			KinkyDungeonInitialize(1);
			MiniGameKinkyDungeonCheckpoint = 0;
			if (KinkyDungeonLoadGame(ElementValue("saveInputField"))) {
				ElementRemove("saveInputField");
				KinkyDungeonState = "Game";
			}
		} else if (MouseIn(1275, 750, 350, 64)) {
			KinkyDungeonState = "Menu";
			ElementRemove("saveInputField");
		}
	} else if (KinkyDungeonState == "Menu" || KinkyDungeonState == "Lose") {
		if (MouseIn(875, 750, 350, 64)) {
			KinkyDungeonInitialize(1);
			MiniGameKinkyDungeonCheckpoint = 0;
			KinkyDungeonLoadGame();
			KinkyDungeonState = "Game";

			if (KinkyDungeonKeybindings) {
				KinkyDungeonKey = [KinkyDungeonKeybindings.Up, KinkyDungeonKeybindings.Left, KinkyDungeonKeybindings.Down, KinkyDungeonKeybindings.Right, KinkyDungeonKeybindings.UpLeft, KinkyDungeonKeybindings.UpRight, KinkyDungeonKeybindings.DownLeft, KinkyDungeonKeybindings.DownRight]; // WASD
				KinkyDungeonGameKey.KEY_UP = "Key"+String.fromCharCode(KinkyDungeonKeybindings.Up).toUpperCase();
				KinkyDungeonGameKey.KEY_DOWN = "Key"+String.fromCharCode(KinkyDungeonKeybindings.Down).toUpperCase();
				KinkyDungeonGameKey.KEY_LEFT = "Key"+String.fromCharCode(KinkyDungeonKeybindings.Left).toUpperCase();
				KinkyDungeonGameKey.KEY_RIGHT = "Key"+String.fromCharCode(KinkyDungeonKeybindings.Right).toUpperCase();
				KinkyDungeonGameKey.KEY_UPLEFT = "Key"+String.fromCharCode(KinkyDungeonKeybindings.UpLeft).toUpperCase();
				KinkyDungeonGameKey.KEY_DOWNLEFT = "Key"+String.fromCharCode(KinkyDungeonKeybindings.DownLeft).toUpperCase();
				KinkyDungeonGameKey.KEY_UPRIGHT = "Key"+String.fromCharCode(KinkyDungeonKeybindings.UpRight).toUpperCase();
				KinkyDungeonGameKey.KEY_DOWNRIGHT = "Key"+String.fromCharCode(KinkyDungeonKeybindings.DownRight).toUpperCase();

				//var KinkyDungeonKeyNumpad = [56, 52, 50, 54, 55, 57, 49, 51]; // Numpad
				KinkyDungeonKeySpell = [KinkyDungeonKeybindings.Spell1, KinkyDungeonKeybindings.Spell2, KinkyDungeonKeybindings.Spell3]; // ! @ #
				KinkyDungeonKeyWait = [KinkyDungeonKeybindings.Wait]; // Space and 5 (53)

				KinkyDungeonGameKey.KEY_WAIT = "Key"+String.fromCharCode(KinkyDungeonKeybindings.Wait).toUpperCase();
			}
		} else if (MouseIn(1075, 820, 350, 64)) {
			KinkyDungeonState = "Load";
			ElementCreateTextArea("saveInputField");
		}
		if (MouseIn(1275, 750, 350, 64)) {
			KinkyDungeonState = "Keybindings";

			KinkyDungeonKeybindingsTemp = {
				Down: 115,
				DownLeft: 122,
				DownRight: 99,
				Left: 97,
				Right: 100,
				Spell1: 49,
				Spell2: 50,
				Spell3: 51,
				Up: 119,
				UpLeft: 113,
				UpRight: 101,
				Wait: 120,
			};
		}
	} else if (KinkyDungeonState == "Save") {
		if (MouseIn(875, 750, 350, 64)) {
			KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonSavedGame"), "white", 1);
			KinkyDungeonSaveGame();
			KinkyDungeonState = "Game";
			ElementRemove("saveDataField");
		} else if (MouseIn(1275, 750, 350, 64)) {
			KinkyDungeonState = "Game";
			ElementRemove("saveDataField");
		}
	} else if (KinkyDungeonState == "Game") {
		if (KinkyDungeonIsPlayer()) KinkyDungeonClickGame();
	} else if (KinkyDungeonState == "Keybindings") {
		if (MouseIn(1075, 750, 350, 64)) {
			KinkyDungeonState = "Menu";
			KinkyDungeonKeybindings = KinkyDungeonKeybindingsTemp;
			ServerAccountUpdate.QueueData({ KinkyDungeonKeybindings: KinkyDungeonKeybindings });
		}

		if (KinkyDungeonKeybindingCurrentKey > 0) {
			if (MouseIn(1075, 350, 350, 64))
				KinkyDungeonKeybindingsTemp.Up = KinkyDungeonKeybindingCurrentKey;
			if (MouseIn(1075, 550, 350, 64))
				KinkyDungeonKeybindingsTemp.Down = KinkyDungeonKeybindingCurrentKey;
			if (MouseIn(675, 450, 350, 64))
				KinkyDungeonKeybindingsTemp.Left = KinkyDungeonKeybindingCurrentKey;
			if (MouseIn(1475, 450, 350, 64))
				KinkyDungeonKeybindingsTemp.Right = KinkyDungeonKeybindingCurrentKey;
			if (MouseIn(675, 350, 350, 64))
				KinkyDungeonKeybindingsTemp.UpLeft = KinkyDungeonKeybindingCurrentKey;
			if (MouseIn(1475, 350, 350, 64))
				KinkyDungeonKeybindingsTemp.UpRight = KinkyDungeonKeybindingCurrentKey;
			if (MouseIn(675, 550, 350, 64))
				KinkyDungeonKeybindingsTemp.DownLeft = KinkyDungeonKeybindingCurrentKey;
			if (MouseIn(1475, 550, 350, 64))
				KinkyDungeonKeybindingsTemp.DownRight = KinkyDungeonKeybindingCurrentKey;
			if (MouseIn(1075, 450, 350, 64))
				KinkyDungeonKeybindingsTemp.Wait = KinkyDungeonKeybindingCurrentKey;
			if (MouseIn(675, 200, 350, 64))
				KinkyDungeonKeybindingsTemp.Spell1 = KinkyDungeonKeybindingCurrentKey;
			if (MouseIn(1075, 200, 350, 64))
				KinkyDungeonKeybindingsTemp.Spell2 = KinkyDungeonKeybindingCurrentKey;
			if (MouseIn(1475, 200, 350, 64))
				KinkyDungeonKeybindingsTemp.Spell3 = KinkyDungeonKeybindingCurrentKey;
		}
	}
}

/**
 * Handles exit during the kinky dungeon game
 * @returns {void} - Nothing
 */
function KinkyDungeonExit() {
	CommonDynamicFunction(MiniGameReturnFunction + "()");

	if (CharacterAppearancePreviousEmoticon) {
		CharacterSetFacialExpression(Player, "Emoticon", CharacterAppearancePreviousEmoticon);
		CharacterAppearancePreviousEmoticon = "";
	}

	if (MiniGameKinkyDungeonLevel > Math.max(KinkyDungeonRep, ReputationGet("Gaming")) || Math.max(KinkyDungeonRep, ReputationGet("Gaming")) > KinkyDungeonMaxLevel) {
		KinkyDungeonRep = Math.max(KinkyDungeonRep, MiniGameKinkyDungeonLevel);
		DialogSetReputation("Gaming", KinkyDungeonRep);
	}

	if (CurrentScreen == "ChatRoom" && KinkyDungeonState != "Menu" && KinkyDungeonState == "Lose") {
		let Dictionary = [
			{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
			{ Tag: "KinkyDungeonLevel", Text: String(MiniGameKinkyDungeonLevel)},
		];
		// @ts-ignore
		ChatRoomPublishCustomAction("KinkyDungeonLose", false, Dictionary);
	}
}




/**
 * Handles key presses during the mini game. (Both keyboard and mobile)
 * @returns {void} - Nothing
 */
function KinkyDungeonKeyDown() {
	if (KinkyDungeonState == "Game") {
		if (KinkyDungeonIsPlayer())
			KinkyDungeonGameKeyDown();
	} else if (KinkyDungeonState == "Keybindings")
		// @ts-ignore
		KinkyDungeonKeybindingCurrentKey = KeyPress;

}


/**
 * Game keyboard input handler object: Handles keyboard inputs.
 * @constant
 * @type {object} - The game keyboard input handler object. Contains the functions and properties required to handle key press events.
 */
let KinkyDungeonGameKey = {
	keyPressed : [false, false, false, false, false, false, false, false],

	KEY_UP : 'KeyB',
	KEY_DOWN : 'KeyV',
	KEY_LEFT : 'KeyC',
	KEY_RIGHT : 'KeyX',
	KEY_UPLEFT : 'KeyC',
	KEY_UPRIGHT : 'KeyB',
	KEY_DOWNLEFT : 'KeyX',
	KEY_DOWNRIGHT : 'KeyV',
	KEY_WAIT : 'KeyV',

	load : function(){
		KinkyDungeonGameKey.keyPressed = [false, false, false, false, false, false, false, false];
		KinkyDungeonGameKey.addKeyListener();
	},

	addKeyListener : function () {
		window.addEventListener('keydown', KinkyDungeonGameKey.keyDownEvent);
		window.addEventListener('keyup', KinkyDungeonGameKey.keyUpEvent);
	},
	removeKeyListener : function () {
		window.removeEventListener('keydown', KinkyDungeonGameKey.keyDownEvent);
		window.removeEventListener('keyup', KinkyDungeonGameKey.keyUpEvent);
	},
	keyDownEvent : {
		handleEvent : function (event) {
			switch(event.code){
				case KinkyDungeonGameKey.KEY_UP:
					if(!KinkyDungeonGameKey.keyPressed[0]){
						KinkyDungeonGameKey.keyPressed[0] = true;
					}
					break;
				case KinkyDungeonGameKey.KEY_DOWN:
					if(!KinkyDungeonGameKey.keyPressed[1]){
						KinkyDungeonGameKey.keyPressed[1] = true;
					}
					break;
				case KinkyDungeonGameKey.KEY_LEFT:
					if(!KinkyDungeonGameKey.keyPressed[2]){
						KinkyDungeonGameKey.keyPressed[2] = true;
					}
					break;
				case KinkyDungeonGameKey.KEY_RIGHT:
					if(!KinkyDungeonGameKey.keyPressed[3]){
						KinkyDungeonGameKey.keyPressed[3] = true;
					}
					break;
				case KinkyDungeonGameKey.KEY_UPLEFT:
					if(!KinkyDungeonGameKey.keyPressed[4]){
						KinkyDungeonGameKey.keyPressed[4] = true;
					}
					break;
				case KinkyDungeonGameKey.KEY_UPRIGHT:
					if(!KinkyDungeonGameKey.keyPressed[5]){
						KinkyDungeonGameKey.keyPressed[5] = true;
					}
					break;
				case KinkyDungeonGameKey.KEY_DOWNLEFT:
					if(!KinkyDungeonGameKey.keyPressed[6]){
						KinkyDungeonGameKey.keyPressed[6] = true;
					}
					break;
				case KinkyDungeonGameKey.KEY_DOWNRIGHT:
					if(!KinkyDungeonGameKey.keyPressed[7]){
						KinkyDungeonGameKey.keyPressed[7] = true;
					}
					break;
				case KinkyDungeonGameKey.KEY_WAIT:
					if(!KinkyDungeonGameKey.keyPressed[8]){
						KinkyDungeonGameKey.keyPressed[8] = true;
					}
					break;
			}
		}
	},
	keyUpEvent : {
		handleEvent : function (event) {
			switch(event.code){
				case KinkyDungeonGameKey.KEY_UP:
					if (KinkyDungeonGameKey.keyPressed[0]) KinkyDungeonLastMoveTimerStart = 0;
					KinkyDungeonGameKey.keyPressed[0] = false;
					break;
				case KinkyDungeonGameKey.KEY_DOWN:
					if (KinkyDungeonGameKey.keyPressed[1]) KinkyDungeonLastMoveTimerStart = 0;
					KinkyDungeonGameKey.keyPressed[1] = false;
					break;
				case KinkyDungeonGameKey.KEY_LEFT:
					if (KinkyDungeonGameKey.keyPressed[2]) KinkyDungeonLastMoveTimerStart = 0;
					KinkyDungeonGameKey.keyPressed[2] = false;
					break;
				case KinkyDungeonGameKey.KEY_RIGHT:
					if (KinkyDungeonGameKey.keyPressed[3]) KinkyDungeonLastMoveTimerStart = 0;
					KinkyDungeonGameKey.keyPressed[3] = false;
					break;
				case KinkyDungeonGameKey.KEY_UPLEFT:
					if (KinkyDungeonGameKey.keyPressed[4]) KinkyDungeonLastMoveTimerStart = 0;
					KinkyDungeonGameKey.keyPressed[4] = false;
					break;
				case KinkyDungeonGameKey.KEY_UPRIGHT:
					if (KinkyDungeonGameKey.keyPressed[5]) KinkyDungeonLastMoveTimerStart = 0;
					KinkyDungeonGameKey.keyPressed[5] = false;
					break;
				case KinkyDungeonGameKey.KEY_DOWNLEFT:
					if (KinkyDungeonGameKey.keyPressed[6]) KinkyDungeonLastMoveTimerStart = 0;
					KinkyDungeonGameKey.keyPressed[6] = false;
					break;
				case KinkyDungeonGameKey.KEY_DOWNRIGHT:
					if (KinkyDungeonGameKey.keyPressed[7]) KinkyDungeonLastMoveTimerStart = 0;
					KinkyDungeonGameKey.keyPressed[7] = false;
					break;
				case KinkyDungeonGameKey.KEY_WAIT:
					if (KinkyDungeonGameKey.keyPressed[8]) KinkyDungeonLastMoveTimerStart = 0;
					KinkyDungeonGameKey.keyPressed[8] = false;
					break;
			}

		}
	},
};

function KinkyDungeonSaveGame(ToString) {
	let saveData = {KinkyDungeonSave: {}};
	let save = saveData.KinkyDungeonSave;
	save.level = MiniGameKinkyDungeonLevel;
	save.checkpoint = MiniGameKinkyDungeonCheckpoint;
	save.rep = KinkyDungeonGoddessRep;
	save.costs = KinkyDungeonShrineCosts;
	save.orbs = KinkyDungeonOrbsPlaced;
	save.chests = KinkyDungeonChestsOpened;
	save.dress = KinkyDungeonCurrentDress;
	save.gold = KinkyDungeonGold;
	save.points = KinkyDungeonSpellPoints;
	save.levels = KinkyDungeonSpellLevel;

	let spells = [];
	let inv = [];
	Object.assign(inv, KinkyDungeonInventory);

	for (let item of inv) {
		if (item.restraint) item.restraint = {name: item.restraint.name};
		if (item.looserestraint) item.looserestraint = {name: item.looserestraint.name};
		if (item.weapon) item.weapon = {name: item.weapon.name};
		if (item.consumable) item.consumable = {name: item.consumable.name};
	}

	for (let spell of KinkyDungeonSpells) {
		spells.push(spell.name);
	}

	save.spells = spells;
	save.inventory = inv;

	let data = LZString.compressToBase64(JSON.stringify(save));
	if (!ToString) {
		//Player.KinkyDungeonSave = saveData.KinkyDungeonSave;
		//ServerAccountUpdate.QueueData(saveData);
		localStorage.setItem('KinkyDungeonSave', data);
	}
	return data;
}

// N4IgNgpgbhYgXARgDQgMYAsJoNYAcB7ASwDsAXBABlQCcI8FQBxDAgZwvgFoBWakAAo0ibAiQg0EvfgBkIAQzJZJ8fgFkIZeXFWoASgTwQqqAOpEwO/gFFIAWwjk2JkAGExAKwCudFwElLLzYiMSoAX1Q0djJneGAIkAIaACNYgG0AXUisDnSskAATOjZYkAARCAAzeS8wClQAcwIwApdCUhiEAGZUSBgwWNBbCAcnBBQ3Tx9jJFQAsCCQknGEtiNLPNRSGHIkgE8ENNAokjYvO3lkyEYQEnkHBEECMiW1eTuQBIBHL3eXsgOSAixzEZwuVxmoDuD3gTxeYgAylo7KR5J9UD8/kQAStkCDTudLtc4rd7jM4UsAGLCBpEVrfX7kbGAxDAkAAdwUhGWJOh5IA0iQiJVjGE2cUyDR5B0bnzHmUvGgyAAVeRGOQNZwJF4NDBkcQlca9Ai4R7o0ASqUy3lk+WKlVqiCUiCaNTnOwHbVEXX6iCG2bgE04M1hDJhIA=
function KinkyDungeonLoadGame(String) {
	let str = String ? LZString.decompressFromBase64(String) : (localStorage.getItem('KinkyDungeonSave') ? LZString.decompressFromBase64(localStorage.getItem('KinkyDungeonSave')) : "");
	if (str) {
		let saveData = JSON.parse(str);
		if (saveData
			&& saveData.spells != undefined
			&& saveData.level != undefined
			&& saveData.checkpoint != undefined
			&& saveData.inventory != undefined
			&& saveData.costs != undefined
			&& saveData.rep != undefined
			&& saveData.orbs != undefined
			&& saveData.chests != undefined
			&& saveData.dress != undefined) {
			MiniGameKinkyDungeonLevel = saveData.level;
			MiniGameKinkyDungeonCheckpoint = saveData.checkpoint;
			KinkyDungeonShrineCosts = saveData.costs;
			KinkyDungeonGoddessRep = saveData.rep;
			KinkyDungeonOrbsPlaced = saveData.orbs;
			KinkyDungeonChestsOpened = saveData.chests;
			KinkyDungeonCurrentDress = saveData.dress;
			if (saveData.gold) KinkyDungeonGold = saveData.gold;
			if (saveData.points) KinkyDungeonSpellPoints = saveData.poinnts;
			if (saveData.levels) KinkyDungeonSpellLevel = saveData.levels;


			for (let item of saveData.inventory) {
				if (item.restraint) {
					let restraint = KinkyDungeonGetRestraintByName(item.restraint.name);
					if (restraint) {
						KinkyDungeonAddRestraint(restraint, 0, true, item.lock); // Add the item
						let createdrestraint = KinkyDungeonGetRestraintItem(restraint.Group);
						if (createdrestraint)
							createdrestraint.lock = item.lock; // Lock if applicable
					}
				}
			}
			Object.assign(KinkyDungeonInventory, saveData.inventory);
			for (let item of KinkyDungeonInventory) {
				if (item.restraint) item.restraint = KinkyDungeonGetRestraintByName(item.restraint.name);
				if (item.looserestraint) item.looserestraint = KinkyDungeonGetRestraintByName(item.looserestraint.name);
				if (item.consumable) item.consumable = KinkyDungeonFindConsumable(item.consumable.name);
				if (item.weapon) item.weapon = KinkyDungeonFindWeapon(item.weapon.name);
			}

			KinkyDungeonSpells = [];
			for (let spell of saveData.spells) {
				let sp = KinkyDungeonFindSpell(spell);
				if (sp) KinkyDungeonSpells.push(sp);
			}

			localStorage.setItem('KinkyDungeonSave', String);
			return true;
		}
	}
	return false;
}