"use strict";
var GameMagicBattleBackground = "Sheet";
var GameMagicBattleTimerDelay = 30;
var GameMagicBattleStatus = "";
var GameMagicBattlePlayer = [];
var GameMagicBattleAction = "";
var GameMagicBattleTurnAdmin = null;
var GameMagicBattleTurnDone = false;
var GameMagicBattleTurnTimer = null;
var GameMagicBattleFocusCharacter = null;
var GameMagicBattleLog = [];
var GameMagicBattleButton = [];

/**
 * Checks if the character is an admin while the game is going.
 * @param {Character} C - Character to check for
 * @returns {boolean} -  Returns TRUE if that character is an admin/the game administrator
 */
function GameMagicBattleIsAdmin(C) {
	return (ChatRoomData.Admin.indexOf(C.MemberNumber) >= 0);
}

/**
 * Draws the Magic Battle house icon of a character
 * @param {Character} C - Character for which to draw the icons
 * @param {number} X - Position on the X axis of the canvas
 * @param {number} Y - Position on the Y axis of the canvas
 * @param {number} Zoom - Zoom factor of the character
 * @returns {void} - Nothing
 */
function GameMagicBattleDrawIcon(C, X, Y, Zoom) {
	if ((C != null) && (C.Game != null) && (C.Game.MagicBattle != null) && (C.Game.MagicBattle.House != null) && (C.Game.MagicBattle.House != "NotPlaying"))
		DrawImageZoomCanvas("Icons/MagicBattle/" + C.Game.MagicBattle.House + ".png", MainCanvas, 0, 0, 100, 100, X, Y, 100 * Zoom, 100 * Zoom);
}

/**
 * Loads the Magic Battle game.
 * @returns {void} - Nothing
 */
function GameMagicBattleLoad() {
	if (Player.Game == null) Player.Game = {};
	if (Player.Game.MagicBattle == null) Player.Game.MagicBattle = {};
	if (Player.Game.MagicBattle.House == null) Player.Game.MagicBattle.House = "NotPlaying";
	if (Player.Game.MagicBattle.TeamType != "FreeForAll") Player.Game.MagicBattle.TeamType = "House";
}

/**
 * Returns the team setup for the online magic battle.
 * @returns {string} - "FreeForAll" or "House", depending on the team setup
 */
function GameMagicBattleGetTeamType() {
	
	// If the game is running, we return the setup from the game admin
	if ((GameMagicBattleStatus == "Running") && (GameMagicBattleTurnAdmin != null))
		for (let C = 0; C < GameMagicBattlePlayer.length; C++)
			if (GameMagicBattlePlayer[C].MemberNumber == GameMagicBattleTurnAdmin)
				if ((GameMagicBattlePlayer[C].Game != null) && (GameMagicBattlePlayer[C].Game.MagicBattle != null) && (GameMagicBattlePlayer[C].Game.MagicBattle.TeamType != null))
					return GameMagicBattlePlayer[C].Game.MagicBattle.TeamType;

	// When the game isn't running, the player team type is returned if admin
	if ((GameMagicBattleStatus == "") && GameMagicBattleIsAdmin(Player))
		if ((Player.Game != null) && (Player.Game.MagicBattle != null) && (Player.Game.MagicBattle.TeamType != null))
			return Player.Game.MagicBattle.TeamType;

	// When the game isn't running, the first admin team type is returned
	if ((GameMagicBattleStatus == "") && !GameMagicBattleIsAdmin(Player))
		for (let C = 0; C < ChatRoomCharacter.length; C++)
			if (GameMagicBattleIsAdmin(ChatRoomCharacter[C]))
				if ((ChatRoomCharacter[C].Game != null) && (ChatRoomCharacter[C].Game.MagicBattle != null) && (ChatRoomCharacter[C].Game.MagicBattle.TeamType != null))
					return ChatRoomCharacter[C].Game.MagicBattle.TeamType;

	// With no setup, we return "House"
	return "House";

}

/**
 * Runs and draws the Magic Battle game.
 * @returns {void} - Nothing
 */
function GameMagicBattleRun() {

	// Draw the character, text and buttons to configure the game, admins can start the game from here
	let TeamType = GameMagicBattleGetTeamType();
	DrawCharacter(Player, 50, 50, 0.9);
	DrawText(TextGet("Title"), 1200, 125, "Black", "Gray");
	if (GameMagicBattleStatus == "") DrawBackNextButton(900, 218, 600, 64, TextGet("PlayType" + Player.Game.MagicBattle.House), "White", "", () => "", () => "");
	else DrawText(TextGet("PlayType" + Player.Game.MagicBattle.House), 1200, 250, "Black", "Gray");
	if ((GameMagicBattleStatus == "") && GameMagicBattleIsAdmin(Player)) DrawBackNextButton(900, 343, 600, 64, TextGet("TeamType") + " " + TextGet(TeamType), "White", "", () => "", () => "");
	else DrawText(TextGet("TeamType") + " " + TextGet(TeamType), 1200, 375, "Black", "Gray");
	if (GameMagicBattleStatus == "") DrawText(TextGet("StartCondition" + TeamType), 1200, 500, "Black", "Gray");
	else DrawText(TextGet("RunningGame"), 1200, 500, "Black", "Gray");
	if (GameMagicBattleCanLaunchGame()) DrawButton(1000, 600, 400, 65, TextGet("StartGame"), "White");
	if (GameMagicBattleIsAdmin(Player) && (GameMagicBattleStatus != "")) DrawButton(1000, 600, 400, 65, TextGet("StopGame"), "White");
	GameMagicBattleDrawIcon(Player, 600, 210, 2);

	// Draw the right side buttons
	DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
	if ((GameMagicBattleStatus == "") && (Player.Game.MagicBattle.House.indexOf("House") == 0) && Player.CanChange()) DrawButton(1815, 190, 90, 90, "", "White", "Icons/Wardrobe.png");

}

/**
 * Runs the game from the chat room
 * @returns {void} - Nothing
 */
function GameMagicBattleRunProcess() {

	// If the player is the game admin, she sends the 30 seconds timer tick to everyone
	if ((GameMagicBattleStatus == "Running") && (TimerGetTime() > GameMagicBattleTurnTimer) && (Player.MemberNumber == GameMagicBattleTurnAdmin)) {
		GameMagicBattleTurnTimer = TimerGetTime() + (GameMagicBattleTimerDelay * 1000);
		ServerSend("ChatRoomGame", { GameProgress: "Next" });
	}

}

/**
 * Handles clicks during the online game.
 * @returns {boolean} - Returns TRUE if the click was handled by this online click handler
 */
function GameMagicBattleClickProcess() {
	if (GameMagicBattleFocusCharacter != null) {
		let Time = (GameMagicBattleTurnTimer - TimerGetTime()) / 1000;
		if (Time >= 6)
			for (let B = 0; B < GameMagicBattleButton.length; B++)
				if (MouseIn(GameMagicBattleButton[B].X, GameMagicBattleButton[B].Y, GameMagicBattleButton[B].W, GameMagicBattleButton[B].H)) {
					document.getElementById("InputChat").style.display = "none";
					document.getElementById("TextAreaChatLog").style.display = "none";
					MagicPuzzleSpell = MagicBattleAvailSpell[B];
					MagicPuzzleAutoExit = true;
					MagicPuzzleBackground = ChatRoomData.Background;
					MiniGameStart("MagicPuzzle", Time - 5, "GameMagicBattlePuzzleEnd");
					return true;
				}
	}
	return false;
}

/**
 * When the magic puzzle ends, we go back to the chat room
 * @returns {boolean} - Returns TRUE if the click was handled by this online click handler
 */
function GameMagicBattlePuzzleEnd() {
	ServerSend("ChatRoomGame", { GameProgress: "Action", Action: (MiniGameVictory ? "SpellSuccess" : "SpellFail"), Spell: MagicPuzzleSpell, Time: MagicPuzzleFinish - MagicPuzzleStart, Target: GameMagicBattleFocusCharacter.MemberNumber });
	GameMagicBattleFocusCharacter = null;
	GameMagicBattleTurnDone = true;
	CommonSetScreen("Online", "ChatRoom");
	document.getElementById("InputChat").style.display = "";
	document.getElementById("TextAreaChatLog").style.display = "";
}

/**
 * Starts a Magic Battle match.
 * @returns {void} - Nothing
 */
function GameMagicBattleStartProcess() {

	// Gives a delay in seconds, based on the player preference, returns to the chat screen
	CommonSetScreen("Online", "ChatRoom");
	GameMagicBattleTurnTimer = TimerGetTime() + (GameMagicBattleTimerDelay * 1000);

	// Notices everyone in the room that the game starts
	var Dictionary = [];
	Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
	ServerSend("ChatRoomChat", { Content: "MagicBattleGameStart", Type: "Action" , Dictionary: Dictionary});

	// Changes the game status and exits
	ServerSend("ChatRoomGame", { GameProgress: "Start" });
	Player.Game.MagicBattle.Status = "Running";
	ServerAccountUpdate.QueueData({ Game: Player.Game }, true);

}

/**
 * Handles clicks in the Magic Battle chat Admin screen
 * @returns {void} - Nothing
 */
function GameMagicBattleClick() {

	// When the user exits or wants to change clothes
	if (MouseIn(1815, 75, 90, 90)) GameMagicBattleExit();
	if (MouseIn(1815, 190, 90, 90) && (GameMagicBattleStatus == "") && (Player.Game.MagicBattle.House.indexOf("House") == 0) && Player.CanChange()) {
		MagicSchoolLaboratoryPrepareNPC(Player, Player.Game.MagicBattle.House.replace("House", ""));
		ChatRoomCharacterUpdate(Player);
	}

	// When the user changes house/role
	if (MouseIn(900, 218, 600, 64) && (GameMagicBattleStatus == "")) {
		
		// Back button
		if (MouseX < 1200) {
			if (Player.Game.MagicBattle.House == "NotPlaying") {
				if (ReputationGet("HouseMaiestas") > 0) Player.Game.MagicBattle.House = "HouseMaiestas";
				else if (ReputationGet("HouseVincula") > 0) Player.Game.MagicBattle.House = "HouseVincula";
				else if (ReputationGet("HouseAmplector") > 0) Player.Game.MagicBattle.House = "HouseAmplector";
				else if (ReputationGet("HouseCorporis") > 0) Player.Game.MagicBattle.House = "HouseCorporis";
				else Player.Game.MagicBattle.House = "Independent";
			} else Player.Game.MagicBattle.House = (Player.Game.MagicBattle.House == "Independent") ? "NotPlaying" : "Independent";
		}

		// Next button
		if (MouseX >= 1200) {
			if (Player.Game.MagicBattle.House == "Independent") {
				if (ReputationGet("HouseMaiestas") > 0) Player.Game.MagicBattle.House = "HouseMaiestas";
				else if (ReputationGet("HouseVincula") > 0) Player.Game.MagicBattle.House = "HouseVincula";
				else if (ReputationGet("HouseAmplector") > 0) Player.Game.MagicBattle.House = "HouseAmplector";
				else if (ReputationGet("HouseCorporis") > 0) Player.Game.MagicBattle.House = "HouseCorporis";
				else Player.Game.MagicBattle.House = "NotPlaying";
			} else Player.Game.MagicBattle.House = (Player.Game.MagicBattle.House == "NotPlaying") ? "Independent" : "NotPlaying";
		}

	}

	// When the user selects a new team configuration, we update that player for everyone
	if (MouseIn(900, 343, 600, 64) && (GameMagicBattleStatus == "") && GameMagicBattleIsAdmin(Player)) {
		Player.Game.MagicBattle.TeamType = (Player.Game.MagicBattle.TeamType == "House") ? "FreeForAll" : "House";
		ServerAccountUpdate.QueueData({ Game: Player.Game }, true);
	}

	// If the administrator wants to start the game or end the game
	if (MouseIn(1000, 600, 400, 65) && GameMagicBattleCanLaunchGame()) GameMagicBattleStartProcess();
	if (MouseIn(1000, 600, 400, 65) && GameMagicBattleIsAdmin(Player) && (GameMagicBattleStatus != "")) {
		CommonSetScreen("Online", "ChatRoom");
		ServerSend("ChatRoomGame", { GameProgress: "Stop" });
	}

}

/**
 * Triggered when the player exits the Magic Battle info screen.
 * @returns {void} - Nothing
 */
function GameMagicBattleExit() {

	// When the game isn't running, we allow to change the class or team
	if (GameMagicBattleStatus == "") {
		ServerAccountUpdate.QueueData({ Game: Player.Game }, true);
		ChatRoomCharacterUpdate(Player);
	}
	CommonSetScreen("Online", "ChatRoom");

}

/**
 * Checks if a Magic Battle match can be launched. The player must be an admin and two different houses must be selected.
 * @returns {boolean} - Returns TRUE if the game can be launched
 */
function GameMagicBattleCanLaunchGame() {
	if (GameMagicBattleStatus != "") return false;
	if (!GameMagicBattleIsAdmin(Player)) return false;
	if ((Player.Game.MagicBattle.TeamType != "House") && (Player.Game.MagicBattle.TeamType != "FreeForAll")) return false;
	var House = "";
	for (let C = 0; C < ChatRoomCharacter.length; C++)
		if ((ChatRoomCharacter[C].Game != null) && (ChatRoomCharacter[C].Game.MagicBattle != null) && (ChatRoomCharacter[C].Game.MagicBattle.House != null) && (ChatRoomCharacter[C].Game.MagicBattle.House != "NotPlaying") && ChatRoomCharacter[C].CanTalk()) {
			if (House == "")
				House = ChatRoomCharacter[C].Game.MagicBattle.House;
			else
				if ((House != ChatRoomCharacter[C].Game.MagicBattle.House) || (ChatRoomCharacter[C].Game.MagicBattle.House == "Independent") || (Player.Game.MagicBattle.TeamType == "FreeForAll"))
					return true;
		}
	return false;
}

/**
 * Generates a new turn for the battle.
 * @param {string} Msg - Content of the turn message such as TurnNext or TurnStart
 * @returns {void} - Nothing
 */
function GameMagicBattleNewTurn(Msg) {
	GameMagicBattleLog = [];
	GameMagicBattleTurnDone = false;
	GameMagicBattleFocusCharacter = null;
	GameMagicBattleTurnTimer = TimerGetTime() + (GameMagicBattleTimerDelay * 1000);
	GameMagicBattleAddChatLog(Msg, Player, Player, null, (Msg == "TurnNext") ? "#000000" : "#0000A0");
}

/**
 * Gets a character from the Magic Battle game by member number
 * @param {number} MemberNumber - Member number of the character to get.
 * @returns {Character | null} - The corresponding character, if it exists.
 */
function GameMagicBattleGetPlayer(MemberNumber) {
	for (let C = 0; C < GameMagicBattlePlayer.length; C++)
		if (GameMagicBattlePlayer[C].MemberNumber == MemberNumber)
			return GameMagicBattlePlayer[C];
	return null;
}

/**
 * Processes the Magic Battle game clicks. This method is called from the generic OnlineGameClickCharacter function when the current game is Magic Battle.
 * @param {Character} C - Character clicked on
 * @returns {boolean} - returns TRUE if the code handles the click
 */
function GameMagicBattleCharacterClick(C) {

	// If the turn is already done or the player is gagged, we skip any click
	if ((Player.Game == null) || (Player.Game.MagicBattle == null) || (Player.Game.MagicBattle.House == null) || (Player.Game.MagicBattle.House == "NotPlaying")) return true;
	if (GameMagicBattleTurnDone || !Player.CanTalk()) return true;

	// We allow clicking on a participating room member that's not gagged
	if ((GameMagicBattleStatus == "Running") && (C.Game != null) && (C.Game.MagicBattle != null) && (C.Game.MagicBattle.House != null) && (C.Game.MagicBattle.House != "NotPlaying") && C.CanTalk())
		GameMagicBattleFocusCharacter = (C.MemberNumber == Player.MemberNumber) ? null : C;

	// Cannot target a player from it's own house if playing in teams by houses
	if ((GameMagicBattleFocusCharacter != null) && (GameMagicBattleGetTeamType() == "House") && (GameMagicBattleFocusCharacter.Game.MagicBattle.House != "Independent") && (GameMagicBattleFocusCharacter.Game.MagicBattle.House == Player.Game.MagicBattle.House))
		GameMagicBattleFocusCharacter = null;

	// Gets the spells that are available on that target
	MagicBattleAvailSpell = MagicBattleGetAvailSpells(GameMagicBattleFocusCharacter);

	// Flags that transaction as being handled
	return true;

}

/**
 * Adds a game message to the chat log.
 * @param {string} Msg - Message tag
 * @param {Character} Source - Source character of the message
 * @param {Character} Target - Character targetted by the message
 * @param {string} Data - The data linked to the packet
 * @param {string} [Color] - Color of the message to add.
 * @returns {void} - Nothing
 */
function GameMagicBattleAddChatLog(Msg, Source, Target, Data, Color) {

	// Gets the message from the dictionary
	Msg = OnlineGameDictionaryText(Msg);
	Msg = Msg.replace("SourceName", Source.Name);
	Msg = Msg.replace("SourceNumber", Source.MemberNumber.toString());
	Msg = Msg.replace("TargetName", Target.Name);
	Msg = Msg.replace("TargetNumber", Target.MemberNumber.toString());
	if ((Data != null) && (Data.Spell != null)) Msg = Msg.replace("SpellDesc", OnlineGameDictionaryText("Spell" + Data.Spell.toString() + "Name"));
	if ((Data != null) && (Data.Time != null)) Msg = Msg.replace("SpellTime", (Data.Time / 1000).toString());

	// Adds the message and scrolls down unless the user has scrolled up
	var div = document.createElement("div");
	div.setAttribute('class', 'ChatMessage ChatMessageServerMessage');
	div.setAttribute('data-time', ChatRoomCurrentTime());
	if ((Color != null) && (Color != "")) div.style.color = Color;
	div.innerHTML = Msg;
	var Refocus = document.activeElement.id == "InputChat";
	var ShouldScrollDown = ElementIsScrolledToEnd("TextAreaChatLog");
	if (document.getElementById("TextAreaChatLog") != null) {
		document.getElementById("TextAreaChatLog").appendChild(div);
		if (ShouldScrollDown) ElementScrollToEnd("TextAreaChatLog");
		if (Refocus) ElementFocus("InputChat");
	}

}

/**
 * Builds the game player list.
 * @returns {void} - Nothing
 */
function GameMagicBattleBuildPlayerList() {
	GameMagicBattlePlayer = [];
	for (let C = 0; C < ChatRoomCharacter.length; C++)
		if ((ChatRoomCharacter[C].Game != null) && (ChatRoomCharacter[C].Game.MagicBattle != null) && (ChatRoomCharacter[C].Game.MagicBattle.House != null) && (ChatRoomCharacter[C].Game.MagicBattle.House != "NotPlaying"))
			GameMagicBattlePlayer.push(ChatRoomCharacter[C]);
}

/**
 * Calculates the turn winner and applies the consequences.
 * @returns {void} - Nothing
 */
function GameMagicBattleCalculateTurnWinner() {
	
	// Fetches the best time and the round winner
	let WinTime = 999999;
	let WinNum = null;
	let TieRound = false;
	for (let L = 0; L < GameMagicBattleLog.length; L++)
		if ((GameMagicBattleLog[L] != null) && (GameMagicBattleLog[L].Data != null) && (GameMagicBattleLog[L].Data.Action == "SpellSuccess"))
			if ((GameMagicBattleLog[L].Data.Spell != null) && (GameMagicBattleLog[L].Data.Time != null) && (GameMagicBattleLog[L].Data.Time <= WinTime)) {
				if (WinTime == GameMagicBattleLog[L].Data.Time) TieRound = true;
				WinTime = GameMagicBattleLog[L].Data.Time;
				WinNum = L;
			}

	// If there's no winner, we show a chat log, if there's one, we apply the effects on the loser
	if (WinNum == null)
		GameMagicBattleAddChatLog("NoWinner", Player, Player, null, "#000000");
	else
		if (TieRound)
			GameMagicBattleAddChatLog("TieRound", Player, Player, null, "#000000");
		else {
			let Source = GameMagicBattleGetPlayer(GameMagicBattleLog[WinNum].Sender);
			let Target = GameMagicBattleGetPlayer(GameMagicBattleLog[WinNum].Data.Target);
			if ((Source != null) && (Target != null)) {
				GameMagicBattleAddChatLog("RoundWinner", Source, Target, GameMagicBattleLog[WinNum].Data, "#000000");
				MagicSpellEffect(Target, GameMagicBattleLog[WinNum].Data.Spell);
				if (Target.MemberNumber == Player.MemberNumber) ChatRoomCharacterUpdate(Player);
			}
		}

	// Checks if there is a winning team/player, based on the team type setup
	let TeamType = GameMagicBattleGetTeamType();
	let House = "";
	let HouseCount = 0;
	for (let C = 0; C < GameMagicBattlePlayer.length; C++)
		if (GameMagicBattlePlayer[C].CanTalk()) {
			if (House == "") {
				House = GameMagicBattlePlayer[C].Game.MagicBattle.House;
				HouseCount++;
			} else {
				if ((GameMagicBattlePlayer[C].Game.MagicBattle.House != House) || (GameMagicBattlePlayer[C].Game.MagicBattle.House == "Independent") || (TeamType == "FreeForAll"))
					HouseCount++;
			}
		}

	// If there's a winner, we announce it, if the player was representing a house, she can rain reputation
	if (HouseCount <= 1) {
		GameMagicBattleAddChatLog("GameOver", Player, Player, null, "#0000A0");
		GameMagicBattleStatus = "";
		if (Player.CanTalk() && (Player.Game != null) && (Player.Game.MagicBattle != null) && (Player.Game.MagicBattle.House != null) && (Player.Game.MagicBattle.House.indexOf("House") == 0))
			DialogChangeReputation(Player.Game.MagicBattle.House, 3);
	}

	// Returns the game status for the next round
	return GameMagicBattleStatus;
}

/**
 * Processes the Magic Battle game messages for turns and actions.
 * @param {object} P - Data object containing the message data.
 * @returns {void} - Nothing
 */
function GameMagicBattleProcess(P) {
	if ((P != null) && (typeof P === "object") && (P.Data != null) && (typeof P.Data === "object") && (P.Sender != null) && (typeof P.Sender === "number") && (P.RNG != null) && (typeof P.RNG === "number")) {

		// An administrator can start the Magic Battle game, he becomes the turn admin in the process
		if ((ChatRoomData.Admin.indexOf(P.Sender) >= 0) && (P.Data.GameProgress == "Start")) {
			GameMagicBattleStatus = "Running";
			GameMagicBattleTurnAdmin = P.Sender;
			GameMagicBattleBuildPlayerList();
			GameMagicBattleNewTurn("GameStart" + GameMagicBattleGetTeamType());
		}

		// An administrator can stop the game
		if ((ChatRoomData.Admin.indexOf(P.Sender) >= 0) && (P.Data.GameProgress == "Stop")) {
			let Source = GameMagicBattleGetPlayer(P.Sender);
			if (Source != null) {
				GameMagicBattleAddChatLog("GameStop", Source, Source, null, "#0000A0");
				GameMagicBattleStatus = "";
				Player.Game.MagicBattle.Status = "";
				ServerAccountUpdate.QueueData({ Game: Player.Game }, true);
			}
		}
		
		// When the turn administrator sends the message to end the turn, we calculate the outcome
		if ((GameMagicBattleStatus == "Running") && (GameMagicBattleTurnAdmin == P.Sender) && (P.Data.GameProgress == "Next"))
			if (GameMagicBattleCalculateTurnWinner() == "Running")
				GameMagicBattleNewTurn("TurnNext");

		// The current turn player can trigger an action, a spell cast by a user
		if ((GameMagicBattleStatus == "Running") && (P.Data.GameProgress == "Action") && (P.Data.Action != null) && (P.Data.Target != null)) {

			// Keep the data in the game log for that turn
			GameMagicBattleLog.push({ Sender: P.Sender, Data: P.Data });

			// Before we process it, we make sure the action is valid by checking all possible options
			let Source = GameMagicBattleGetPlayer(P.Sender);
			let Target = GameMagicBattleGetPlayer(P.Data.Target);
			if ((Source != null) && (Target != null))
				GameMagicBattleAddChatLog(P.Data.Action, Source, Target, P.Data, (P.Data.Action == "SpellFail") ? "#A00000" : "#00A000");

		}

	}
}

/**
 * Resets the Magic Battle game so a new game might be started
 * @returns {void} - Nothing
 */
function GameMagicBattleReset() {
	GameMagicBattleStatus = "";
	if ((Player.Game != null) && (Player.Game.MagicBattle != null) && (Player.Game.MagicBattle.Status != null) && (Player.Game.MagicBattle.Status != "")) {
		Player.Game.MagicBattle.Status = "";
		ServerAccountUpdate.QueueData({ Game: Player.Game }, true);
	}
}