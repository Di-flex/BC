"use strict";
/* eslint-disable */
var PokerBackground = "White";
var PokerPlayer = [
	{ Type: "Character", Family: "Player", Name: "Player", Chip: 100 },
	{ Type: "Set", Family: "Comic", Name: "Amanda", Chip: 100 },
	{ Type: "Set", Family: "Comic", Name: "Sarah", Chip: 100 },
	{ Type: "Set", Family: "Comic", Name: "Sophie", Chip: 100 }
];
var PokerMode = "";
var PokerGame = "TexasHoldem"
var PokerShowPlayer = true;
var PokerAsset = [
	{
		Family: "None",
		Type: "None",
		Opponent: ["None"]
	},
	{
		Family: "Comic",
		Type: "Set",
		Opponent: ["Amanda", "Sarah", "Sophie"]
	},
	{
		Family: "Drawing",
		Type: "Set",
		Opponent: ["Ann"]
	}
];
var PokerPlayerCount = 4;
var PokerTableCards = [];
var PokerMessage = "";
var PokerResultMessage = "";
var PokerAnte = 2;
var PokerAnteCount = 0;
var PokerPot = 0;

/**
 * Loads the Bondage Poker room
 * @returns {void} - Nothing
 */
function PokerLoad() {
	PokerPlayer[0].Character = Player;
	PokerPlayer[0].Name = Player.Name;
}

/**
 * Draws a poker player behind the table
 * @returns {void} - Nothing
 */
function PokerDrawPlayer(P, X, Y) {
	
	// For set images from the classic Bondage Poker game
	if ((P == null) || (P.Type == null) || (P.Type == "None") || (P.Name == null)) return;
	if (P.Type == "Set") {
		
		// If data isn't loaded yet, we fetch the CSV file
		if (P.Data == null) {
			let FullPath = "Screens/Room/Poker/" + P.Name + "/Data.csv";
			let TextScreenCache = TextAllScreenCache.get(FullPath);
			if (!TextScreenCache) {
				TextScreenCache = new TextCache(FullPath, "MISSING VALUE FOR TAG: ");
				TextAllScreenCache.set(FullPath, TextScreenCache);
			} else P.Data = TextScreenCache;
		}
		else {
			
			// If there's no image loaded, we fetch a possible one based on the chip progress
			if (P.Image == null) PokerGetImage(P);
			
			// If a valid image is loaded, we show it
			if (P.Image != null) {
				let W = 300;
				if (DrawCacheImage.get(P.Image) != null)
					W = DrawCacheImage.get(P.Image).width;
				DrawImageEx(P.Image, X + 210 - W / 2, Y, {Canvas: MainCanvas, Zoom: 1.25});
			}

		}

		// Loads the text single data if needed
		if (P.TextSingle == null) {
			let FullPath = "Screens/Room/Poker/" + P.Name + "/Text_Single.csv";
			let TextScreenCache = TextAllScreenCache.get(FullPath);
			if (!TextScreenCache) {
				TextScreenCache = new TextCache(FullPath, "MISSING VALUE FOR TAG: ");
				TextAllScreenCache.set(FullPath, TextScreenCache);
			} else P.TextSingle = TextScreenCache;
		}

		// Loads the text multiple data if needed
		if (P.TextMultiple == null) {
			let FullPath = "Screens/Room/Poker/" + P.Name + "/Text_Multiple.csv";
			let TextScreenCache = TextAllScreenCache.get(FullPath);
			if (!TextScreenCache) {
				TextScreenCache = new TextCache(FullPath, "MISSING VALUE FOR TAG: ");
				TextAllScreenCache.set(FullPath, TextScreenCache);
			} else P.TextMultiple = TextScreenCache;
		}

	}

	// For regular bondage club characters
	if (P.Type == "Character") DrawCharacter(P.Character, X, Y - 60, 1, false);
	
	// Draw the top text
	if ((PokerMode != "") && (P.Text != "")) {
		if ((P.TextColor == null) && (P.Data != null) && (P.Data.cache != null) && (P.Data.cache["TextColor"] != null))
			P.TextColor = P.Data.cache["TextColor"];
		DrawTextWrap(P.Text, X + 10, Y - 82, 480, 60, (P.TextColor == null) ? "black" : "#" + P.TextColor, null, 2);
	}

}

/**
 * Gets the chip progress of the current player P
 * @returns {number} - The progress as a %
 */
function PokerGetProgress(P) {

	// At 100 chips or less (or 2 players only), we cut the value in half to get the %
	if ((P.Chip <= 100) || (PokerPlayerCount <= 2)) return Math.floor(P.Chip / 2);

	// At more than 100 chips, the % varies based on the number of players
	return 50 + Math.floor((P.Chip - 100) / ((PokerPlayerCount - 1) * 2));

}

/**
 * Gets a possible text for a poker player P
 * @returns {void} - Nothing
 */
function PokerGetText(P, Tag) {
	
	// Exits right away if data is missing
	if ((P.Type == "None") || (P.Family == "Player")) return P.Text = "";
	let T;
	T = (PokerPlayerCount <= 2) ? P.TextSingle : P.TextMultiple;
	if (T == null) return P.Text = "";

	// If there's a tag, we search for it specifically
	let Texts = [];
	let X = 0;
	if (Tag != null) {
		while (T.cache[X] != null) {
			if (T.cache[X].substr(0, Tag.length + 1) == Tag + "=")
				Texts.push(T.cache[X].substr(Tag.length + 1, 500));
			X++;
		}
	} else {

		// Without a tag, we find all values within the player progress
		let Progress = PokerGetProgress(P);
		while (T.cache[X] != null) {
			if (T.cache[X].substr(8, 5) == "Chat=") {
				let From = T.cache[X].substr(0, 3);
				let To = T.cache[X].substr(4, 3);
				if (!isNaN(parseInt(From)) && !isNaN(parseInt(To)))
					if ((Progress >= parseInt(From)) && (Progress <= parseInt(To)))
						Texts.push(T.cache[X].substr(13, 500));
			}
			X++;
		}

	}

	// Sets the final text at random from all possible values
	P.Text = (Texts.length > 0) ? CommonRandomItemFromList("", Texts) : "";

}

/**
 * Gets a possible image for a poker player P
 * @returns {void} - Nothing
 */
function PokerGetImage(P) {
	if ((P.Type == "None") || (P.Family == "Player")) return;
	let X = 0;
	let Images = [];
	let Progress = PokerGetProgress(P);
	while (P.Data.cache[X] != null) {
		if (P.Data.cache[X].substr(8, 9) == "Opponent=") {
			let From = P.Data.cache[X].substr(0, 3);
			let To = P.Data.cache[X].substr(4, 3);
			if (!isNaN(parseInt(From)) && !isNaN(parseInt(To)))
				if ((Progress >= parseInt(From)) && (Progress <= parseInt(To)))
					Images.push(P.Data.cache[X].substr(17, 100));
		}
		X++;
	}
	if (Images.length > 0)
		P.Image = "Screens/Room/Poker/" + CommonRandomItemFromList("", Images);
}

/**
 * Runs & Draws the Bondage Poker room
 * @returns {void} - Nothing
 */
function PokerRun() {
	
	// Shows the players and table
	for (let P = (PokerShowPlayer ? 0 : 1); P < PokerPlayer.length; P++)
		PokerDrawPlayer(PokerPlayer[P], (PokerShowPlayer ? 0 : -250) + P * 500, 100);
	DrawImage("Screens/Room/Poker/Table.png", 0, 650);

	// Draws the control to pick the opponent
	if (PokerMode == "") {
		DrawText(TextGet("IntroTitle"), 950, 45, "black", "gray");
		DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png", TextGet("Exit"));
		DrawButton(1885, 140, 90, 90, "", "White", "Icons/Poker.png", TextGet("Start"));
		DrawButton(100, 790, 64, 64, "", "White", PokerShowPlayer ? "Icons/Checked.png" : "");
		DrawText(TextGet("ShowPlayer"), 300, 822, "white", "gray");
		DrawBackNextButton(50, 880, 400, 60, TextGet("Rules" + PokerGame), "White", "", () => "", () => "");
		DrawBackNextButton(550, 790, 400, 60, TextGet("Family" + PokerPlayer[1].Family), "White", "", () => "", () => "");
		DrawBackNextButton(1050, 790, 400, 60, TextGet("Family" + PokerPlayer[2].Family), "White", "", () => "", () => "");
		DrawBackNextButton(1550, 790, 400, 60, TextGet("Family" + PokerPlayer[3].Family), "White", "", () => "", () => "");
		for (let P = 1; P < PokerPlayer.length; P++)
			if (PokerPlayer[P].Type != "None")
				DrawBackNextButton(50 + P * 500, 880, 400, 60, PokerPlayer[P].Name, "White", "", () => "", () => "");
	}

	// Draws the cards and chips
	if ((PokerMode == "DEAL") || (PokerMode == "FLOP") || (PokerMode == "TURN") || (PokerMode == "RIVER") || (PokerMode == "RESULT")) {
		for (let P = (PokerShowPlayer ? 0 : 1); P < PokerPlayer.length; P++)
			if ((PokerPlayer[P].Type != "None") && (PokerPlayer[P].Hand.length > 0)) {
				DrawText(TextGet("Chip") + ": " + PokerPlayer[P].Chip.toString(), (PokerShowPlayer ? 250 : 0) + P * 500, 682, "white", "gray");
				if ((PokerPlayer[P].Family != "Player") && (PokerMode != "RESULT"))
					DrawImageEx("Screens/Room/Poker/Cards/OpponentCards.gif", (PokerShowPlayer ? 250 : 0) + P * 500 - 75, 720, {Canvas: MainCanvas, Zoom: 1.5});
				else {
					DrawImageEx(PokerCardFileName(PokerPlayer[P].Hand[0]), (PokerShowPlayer ? 250 : 0) + P * 500 - 135, 710, {Canvas: MainCanvas, Zoom: 0.6});
					DrawImageEx(PokerCardFileName(PokerPlayer[P].Hand[1]), (PokerShowPlayer ? 250 : 0) + P * 500 + 20, 710, {Canvas: MainCanvas, Zoom: 0.6});
				}
			}
		if ((!PokerShowPlayer) && (PokerPlayer[0].Hand.length > 0)) {
			DrawText(TextGet("Chip") + ": " + PokerPlayer[0].Chip.toString(), 1887, 970, "white", "gray");
			if (PokerMode == "RESULT") {
				DrawImageEx(PokerCardFileName(PokerPlayer[0].Hand[0]), 50, 825, {Canvas: MainCanvas, Zoom: 0.6});
				DrawImageEx(PokerCardFileName(PokerPlayer[0].Hand[1]), 200, 825, {Canvas: MainCanvas, Zoom: 0.6});
			} else {
				DrawImageEx(PokerCardFileName(PokerPlayer[0].Hand[0]), 25, 800, {Canvas: MainCanvas, Zoom: 1.25});
				DrawImageEx(PokerCardFileName(PokerPlayer[0].Hand[1]), 250, 800, {Canvas: MainCanvas, Zoom: 1.25});
			}
		}
	}
	
	// Draws the table cards
	if ((PokerTableCards.length > 0) && ((PokerMode == "FLOP") || (PokerMode == "TURN") || (PokerMode == "RIVER") || (PokerMode == "RESULT"))) {
		for (let C = 0; C < PokerTableCards.length; C++)
			DrawImageEx(PokerCardFileName(PokerTableCards[C]), C * 150 + 640, 850, {Canvas: MainCanvas, Zoom: 0.6});
	}

	// In deal mode, we allow the regular actions when the player can play
	if (((PokerMode == "DEAL") || (PokerMode == "FLOP") || (PokerMode == "TURN") || (PokerMode == "RIVER")) && (PokerPlayer[0].Hand.length > 0)) {
		DrawText(TextGet("Pot") + " " + PokerPot.toString(), 1487, 970, "white", "gray");
		DrawText(TextGet("Ante") + " " + PokerAnte.toString(), 1687, 970, "white", "gray");
		DrawButton(1400, 875, 175, 60, TextGet("Bet"), "White");
		DrawButton(1600, 875, 175, 60, TextGet("Raise"), "White");
		DrawButton(1800, 875, 175, 60, TextGet("Fold"), "White");
	}

	// In deal mode, we can only watch without a hand
	if ((PokerMode == "DEAL") && (PokerPlayer[0].Hand.length == 0)) {
		DrawText(TextGet("Ante") + " " + PokerAnte.toString(), 1887, 970, "white", "gray");
		DrawButton(1800, 875, 175, 60, TextGet("Watch"), "White");
	}

	// In result mode, we show the winner and allow to deal new cards
	if (PokerMode == "RESULT") {
		DrawText(PokerResultMessage, 1600, 910, "white", "gray");
		DrawText(PokerMessage, 1600, 960, "white", "gray");
		DrawButton(1800, 875, 175, 60, TextGet("Deal"), "White");
	}
	
	// In End mode, we present the winner and allow to restart
	if (PokerMode == "END") {
		DrawText(PokerMessage, 1000, 800, "white", "gray");
		DrawButton(800, 875, 400, 60, TextGet("EndGame"), "White");		
	}

}

/**
 * Picks the next/previous opponent family for a player P
 * @returns {void} - Nothing
 */
function PokerChangeOpponentFamily(P, Next) {
	for (let A = (Next ? 0 : 1); A < PokerAsset.length + (Next ? -1 : 0); A++)
		if (PokerAsset[A].Family == P.Family) {
			P.Family = PokerAsset[A + (Next ? 1 : -1)].Family;
			P.Type = PokerAsset[A + (Next ? 1 : -1)].Type;
			P.Name = PokerAsset[A + (Next ? 1 : -1)].Opponent[0];
			P.Difficulty = null;
			P.Data = null;
			P.Image = null;
			P.TextColor = null;
			P.TextSingle = null;
			P.TextMultiple = null;
			return;
		}
	P.Family = PokerAsset[(Next ? 0 : PokerAsset.length - 1)].Family;
	P.Type = PokerAsset[(Next ? 0 : PokerAsset.length - 1)].Type;
	P.Name = PokerAsset[(Next ? 0 : PokerAsset.length - 1)].Opponent[0];
	P.Difficulty = null;
	P.Data = null;
	P.Image = null;
	P.TextColor = null;
	P.TextSingle = null;
	P.TextMultiple = null;
}

/**
 * Picks the next/previous opponent for a player P
 * @returns {void} - Nothing
 */
function PokerChangeOpponent(P, Next) {
	for (let A = 0; A < PokerAsset.length; A++)
		if (PokerAsset[A].Family == P.Family) {
			let Pos = PokerAsset[A].Opponent.indexOf(P.Name);
			Pos = Pos + (Next ? 1 : -1);
			if (Pos < 0) Pos = PokerAsset[A].Opponent.length - 1;
			if (Pos > PokerAsset[A].Opponent.length - 1) Pos = 0;
			P.Name = PokerAsset[A].Opponent[Pos];
			P.Difficulty = null;
			P.Data = null;
			P.Image = null;
			P.TextColor = null;
			P.TextSingle = null;
			P.TextMultiple = null;
			return;
		}
}

/**
 * Handles the click events.  Called from CommonClick()
 * @returns {void} - Nothing
 */
function PokerClick() {

	// The main buttons to select the game options
	if (PokerMode == "") {
		if (MouseIn(100, 790, 64, 64)) PokerShowPlayer = !PokerShowPlayer;
		if (MouseIn(50, 880, 400, 60)) PokerGame = (PokerGame == "TexasHoldem") ? "TwoCards" : "TexasHoldem";
		if (MouseIn(1885, 25, 90, 90)) PokerExit();
		for (let P = 1; P < PokerPlayer.length; P++) {
			if (MouseIn(50 + P * 500, 790, 400, 60))
				PokerChangeOpponentFamily(PokerPlayer[P], (MouseX >= 250 + P * 500));
			if ((PokerPlayer[P].Type != "None") && MouseIn(50 + P * 500, 880, 400, 60))
				PokerChangeOpponent(PokerPlayer[P], (MouseX >= 250 + P * 500));
		}
	}

	// If we must start a new game
	if (MouseIn(1885, 140, 90, 90) && (PokerMode == "")) {
		PokerPlayerCount = 0;
		for (let P = 0; P < PokerPlayer.length; P++) {
			PokerPlayer[P].Chip = (PokerPlayer[P].Type != "None") ? 100 : 0;
			PokerGetText(PokerPlayer[P], "Intro");
			if (PokerPlayer[P].Type != "None") PokerPlayerCount++;
		}
		if (PokerPlayerCount >= 2) {
			PokerAnte = (PokerGame == "TwoCards") ? 2 : 1;
			PokerAnteCount = 0;
			PokerDealHands();
		}
	}

	// If we can process to the next step
	if (MouseIn(1400, 875, 175, 60) && ((PokerMode == "DEAL") || (PokerMode == "FLOP") || (PokerMode == "TURN") || (PokerMode == "RIVER")) && (PokerPlayer[0].Hand.length > 0)) return PokerProcess("Bet");
	if (MouseIn(1600, 875, 175, 60) && ((PokerMode == "DEAL") || (PokerMode == "FLOP") || (PokerMode == "TURN") || (PokerMode == "RIVER")) && (PokerPlayer[0].Hand.length > 0)) return PokerProcess("Raise");
	if (MouseIn(1800, 875, 175, 60) && ((PokerMode == "DEAL") || (PokerMode == "FLOP") || (PokerMode == "TURN") || (PokerMode == "RIVER")) && (PokerPlayer[0].Hand.length > 0)) return PokerProcess("Fold");
	if (MouseIn(1800, 875, 175, 60) && ((PokerMode == "DEAL") || (PokerMode == "FLOP") || (PokerMode == "TURN") || (PokerMode == "RIVER")) && (PokerPlayer[0].Hand.length <= 0)) return PokerProcess("Watch");
	if (MouseIn(1800, 875, 175, 60) && (PokerMode == "RESULT")) return PokerDealHands();
	if (MouseIn(800, 875, 400, 60) && (PokerMode == "END")) {
		PokerMode = "";
		for (let P = 0; P < PokerPlayer.length; P++) {
			PokerPlayer[P].Chip = 100;
			PokerGetImage(PokerPlayer[P]);
		}
	}

}

/**
 * Handles key presses during the bondage poker game
 * @returns {void} - Nothing
 */
function PokerKeyDown() {
	if (((KeyPress == 66) || (KeyPress == 98)) && ((PokerMode == "DEAL") || (PokerMode == "FLOP") || (PokerMode == "TURN") || (PokerMode == "RIVER")) && (PokerPlayer[0].Hand.length > 0)) return PokerProcess("Bet"); // B to bet
	if (((KeyPress == 82) || (KeyPress == 114)) && ((PokerMode == "DEAL") || (PokerMode == "FLOP") || (PokerMode == "TURN") || (PokerMode == "RIVER")) && (PokerPlayer[0].Hand.length > 0)) return PokerProcess("Raise"); // R to raise
	if (((KeyPress == 70) || (KeyPress == 102)) && ((PokerMode == "DEAL") || (PokerMode == "FLOP") || (PokerMode == "TURN") || (PokerMode == "RIVER")) && (PokerPlayer[0].Hand.length > 0)) return PokerProcess("Fold"); // F to fold
	if (((KeyPress == 87) || (KeyPress == 119)) && ((PokerMode == "DEAL") || (PokerMode == "FLOP") || (PokerMode == "TURN") || (PokerMode == "RIVER")) && (PokerPlayer[0].Hand.length <= 0)) return PokerProcess("Watch"); // W to watch
	if (((KeyPress == 68) || (KeyPress == 100)) && (PokerMode == "RESULT")) return PokerDealHands(); // D to deal
}

/**
 * When the player exits from Bondage Poker
 * @returns {void} - Nothing
 */
function PokerExit() {
	if (PokerMode == "") CommonSetScreen("Room", "MainHall");
}

/**
 * Draws a card for a poker player PP
 * @returns {void} - Nothing
 */
function PokerDrawCard(PP) {

	// Tries to assign the difficulty
	if ((PP.Difficulty == null) && (PP.Data != null) && (PP.Data.cache != null) && (PP.Data.cache["Difficulty"] != null))
		PP.Difficulty = parseInt(PP.Data.cache["Difficulty"]);

	// Draw until we find a valid card
	let Draw = true;
	let Card = -1;
	while (Draw) {

		// Finds a card that's not already picked
		Draw = false;
		Card = Math.floor(Math.random() * 52) + 1;
		for (let P = 0; P < PokerPlayer.length; P++)
			if (PokerPlayer[P].Hand.indexOf(Card) >= 0)
				Draw = true;

		// On low difficulty, cannot draw a high card, on high, cannot draw a low card
		let Value = ((Card - 1) % 13) + 2;
		if ((PP.Difficulty < 0) && (Value >= 15 + PP.Difficulty)) Draw = true;
		if ((PP.Difficulty > 0) && (Value <= 1 + PP.Difficulty)) Draw = true;

	}

	// Add that card to the player hand
	PP.Hand.push(Card);

}

/**
 * Returns the file name associated with the card
 * @returns {String} - The file name of the card image
 */
function PokerCardFileName(Card) {
	if (Card <= 13) return "Screens/Room/Poker/Cards/" + (Card + 1) + "C.png";
	else if (Card <= 26) return "Screens/Room/Poker/Cards/" + (Card - 12) + "D.png";
	else if (Card <= 39) return "Screens/Room/Poker/Cards/" + (Card - 25) + "H.png";
	else if (Card <= 52) return "Screens/Room/Poker/Cards/" + (Card - 38) + "S.png";
	return "";
}

/**
 * Draw one card on the poker table, only used in Texas Hold'em
 * @returns {void} - Nothing
 */
function PokerTableDraw() {

	// Draw until we find a card that's not picked yet
	let Draw = true;
	let Card = -1;
	while (Draw) {
		Draw = false;
		Card = Math.floor(Math.random() * 52) + 1;
		for (let P = 0; P < PokerPlayer.length; P++)
			if (PokerPlayer[P].Hand.indexOf(Card) >= 0)
				Draw = true;
		if (PokerTableCards.indexOf(Card) >= 0)
			Draw = true;
	}

	// Add that card to the player hand
	PokerTableCards.push(Card);

}

/**
 * When all players chip in the pot
 * @returns {void} - Nothing
 */
function PokerAddPot(Multiplier, StartPos) {
	for (let P = StartPos; P < PokerPlayer.length; P++)
		if ((PokerPlayer[P].Type != "None") && (PokerPlayer[P].Chip > 0)) {
			let Bet = PokerAnte * Multiplier;
			if (PokerPlayer[P].Chip < Bet) Bet = PokerPlayer[P].Chip;
			PokerPot = PokerPot + Bet;
			PokerPlayer[P].Chip = PokerPlayer[P].Chip - Bet;
		}
}

/**
 * When we must process an action to advance the poker game, the action can be Bet, Raise, Fold or Watch
 * @returns {String} - The file name of the card image
 */
function PokerProcess(Action) {
	
	// In Texas, watching the game resolves it fully
	if ((PokerGame == "TexasHoldem") && ((Action == "Watch") || (Action == "Fold"))) {
		PokerMode = "RIVER";
		if (PokerTableCards.length == 0) {
			PokerAddPot(1, 1);
			PokerTableDraw();
			PokerTableDraw();
			PokerTableDraw();
		}
		if (PokerTableCards.length == 3) {
			PokerAddPot(1, 1);
			PokerTableDraw();
		}
		if (PokerTableCards.length == 4) {
			PokerAddPot(1, 1);
			PokerTableDraw();
		}
	}

	// In Texas Hold'em, we go: deal, flop, turn, river, result
	if ((PokerGame == "TexasHoldem") && (PokerMode != "RIVER")) {
		if (PokerMode == "TURN") {
			PokerMode = "RIVER";
			PokerTableDraw();
		}
		if (PokerMode == "FLOP") {
			PokerMode = "TURN";
			PokerTableDraw();
		}
		if (PokerMode == "DEAL") {
			PokerMode = "FLOP";
			PokerTableDraw();
			PokerTableDraw();
			PokerTableDraw();
		}
		PokerAddPot((Action == "Raise") ? 2 : 1, (Action == "Fold") ? 1 : 0);
		return;
	}

	// Gets the hand values and round winner
	PokerAddPot((Action == "Raise") ? 2 : 1, (Action == "Fold") ? 1 : 0);
	let Winner = 0;
	let MaxValue = -1;
	for (let P = 0; P < PokerPlayer.length; P++)
		if ((PokerPlayer[P].Type != "None") && (PokerPlayer[P].Hand.length > 0)) {
			PokerPlayer[P].HandValue = PokerHandValueCalcHandValue(PokerPlayer[P].Hand[0], PokerPlayer[P].Hand[1], PokerGame, PokerMode, PokerTableCards);
			if ((P == 0) && (Action == "Fold")) PokerPlayer[P].HandValue = -1;
			//console.log(P.toString() + " " + PokerPlayer[P].HandValue.toString());
			if (PokerPlayer[P].HandValue > MaxValue) {
				MaxValue = PokerPlayer[P].HandValue;
				Winner = P;
			}
		}

	// Gets the number of winners and split the chips between them
	let WinnerCount = 0;
	for (let P = 0; P < PokerPlayer.length; P++)
		if ((PokerPlayer[P].Type != "None") && (PokerPlayer[P].Hand.length > 0) && (PokerPlayer[P].HandValue == MaxValue))
			WinnerCount++;
	for (let P = 0; P < PokerPlayer.length; P++)
		if ((PokerPlayer[P].Type != "None") && (PokerPlayer[P].Hand.length > 0) && (PokerPlayer[P].HandValue == MaxValue))
			PokerPlayer[P].Chip = PokerPlayer[P].Chip + Math.floor(PokerPot / WinnerCount);
	PokerMessage = (WinnerCount > 1) ? TextGet("SplitPot") : (PokerPlayer[Winner].Name + " " + TextGet("Win"));

	// Gets the final result
	console.log(PokerHandValueTextHandValue(MaxValue));
	PokerResultMessage = TextGet("Hand" + PokerHandValueTextHandValue(MaxValue));
	PokerMode = "RESULT";

	// Raises the ante after 5 rounds
	PokerAnteCount++;
	if (PokerAnteCount >= 5) {
		PokerAnte = PokerAnte + ((PokerGame == "TwoCards") ? 2 : 1);
		PokerAnteCount = 0;
	}

	// Reloads the opponents text and images
	for (let P = 1; P < PokerPlayer.length; P++) {
		PokerGetImage(PokerPlayer[P]);
		PokerGetText(PokerPlayer[P]);
	}

	// If there's only 1 active player, we stop the game
	let PlayerCount = 0;
	for (let P = 0; P < PokerPlayer.length; P++)
		if ((PokerPlayer[P].Type != "None") && (PokerPlayer[P].Chip > 0))
			PlayerCount++;
	if (PlayerCount <= 1) {
		for (let P = 1; P < PokerPlayer.length; P++)
			if (PokerPlayer[P].Type != "None") {
				let TextType = "Win";
				if (PokerPlayer[P].Chip == 0) TextType = "Lose";
				if ((PokerPlayer[P].Chip == 0) && (PokerPlayer[0].Chip == 0)) TextType = "LoseOther";
				PokerGetText(PokerPlayer[P], TextType);
			}
		PokerMessage = PokerPlayer[Winner].Name + " " + TextGet("WinGame");
		PokerMode = "END";
	}

}

/**
 * Deals a fresh new hand for all poker players
 * @returns {void} - Nothing
 */
function PokerDealHands() {
	PokerTableCards = [];
	for (let P = 0; P < PokerPlayer.length; P++)
		PokerPlayer[P].Hand = [];
	for (let P = 0; P < PokerPlayer.length; P++)
		if ((PokerPlayer[P].Type != "None") && (PokerPlayer[P].Chip > 0)) {
			PokerDrawCard(PokerPlayer[P]);
			PokerDrawCard(PokerPlayer[P]);
		}
	PokerMode = "DEAL";
	PokerPot = 0;
	PokerAddPot(1, 0);
}