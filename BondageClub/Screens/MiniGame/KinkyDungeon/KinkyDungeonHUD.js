"use strict";
let KinkyDungeonStruggleGroups = [];
let KinkyDungeonStruggleGroupsBase = [
	"ItemHead",
	"ItemHood",
	"ItemM",
	"ItemEars",
	"ItemArms",
	"ItemNeck",
	"ItemHands",
	"ItemNeckRestraints",
	"ItemBreast",
	"ItemNipplesPiercings",
	"ItemTorso",
	"ItemButt",
	"ItemVulva",
	"ItemVulvaPiercings",
	"ItemPelvis",
	"ItemLegs",
	"ItemFeet",
	"ItemBoots",
];
let KinkyDungeonDrawStruggle = true;
let KinkyDungeonDrawState = "Game";
let KinkyDungeonSpellValid = false;
let KinkyDungeonCamX = 0;
let KinkyDungeonCamY = 0;
let KinkyDungeonTargetX = 0;
let KinkyDungeonTargetY = 0;
let KinkyDungeonLastDraw = 0;
let KinkyDungeonDrawDelta = 0;

const KinkyDungeonLastChatTimeout = 10000;

let KinkyDungeonStatBarHeight = 100;
let KinkyDungeonToggleAutoDoor = true;

let KinkyDungeonFastMove = true;
let KinkyDungeonFastMovePath = [];
let KinkyDungeonFastStruggle = false;
let KinkyDungeonFastStruggleType = "";
let KinkyDungeonFastStruggleGroup = "";

function KinkyDungeonDrawInputs() {

	DrawButton(1880, 120, 100, 40, TextGet("KinkyDungeonRestart"), "White");
	DrawButton(1885, 900, 90, 90, "", "White", KinkyDungeonRootDirectory + (KinkyDungeonFastMove ? "FastMove" : "FastMoveOff") + ".png");
	DrawButton(1785, 900, 90, 90, "", "White", KinkyDungeonRootDirectory + (KinkyDungeonFastStruggle ? "AutoStruggle" : "AutoStruggleOff") + ".png");
	if (KinkyDungeonPlayerWeapon) {
		DrawTextFit(TextGet("KinkyDungeonInventoryItem" + KinkyDungeonPlayerWeapon), 1875, 830, 190, "white", "black");
	} else if (KinkyDungeonPlayerDamage && KinkyDungeonPlayerDamage.name == "Knife") {
		DrawTextFit(TextGet("KinkyDungeonNoWeaponKnife"), 1875, 830, 190, "white", "black");
	} else DrawTextFit(TextGet("KinkyDungeonNoWeapon"), 1875, 830, 190, "white", "black");
	if (KinkyDungeonPlayerDamage) {
		DrawTextFit(TextGet("KinkyDungeonAccuracy") + Math.round(KinkyDungeonGetEvasion() * 100) + "%", 1875, 875, 190,
			(KinkyDungeonGetEvasion() < KinkyDungeonPlayerDamage.chance * 0.99) ? "pink" :
			(KinkyDungeonGetEvasion() > KinkyDungeonPlayerDamage.chance * 1.01) ? "lightgreen" : "white", "black");
	}

	// Draw the struggle buttons if applicable
	if (!KinkyDungeonShowInventory && ((KinkyDungeonDrawStruggle || MouseIn(0, 0, 500, 1000)) && KinkyDungeonStruggleGroups))
		for (let S = 0; S < KinkyDungeonStruggleGroups.length; S++) {
			let sg = KinkyDungeonStruggleGroups[S];
			let ButtonWidth = 60;
			let x = 5 + ((!sg.left) ? (490 - ButtonWidth) : 0);
			let y = 42 + sg.y * (ButtonWidth + 46);

			if (sg.left) {
				MainCanvas.textAlign = "left";
			} else {
				MainCanvas.textAlign = "right";
			}

			let color = "white";
			let locktext = "";
			if (KinkyDungeonPlayer.IsBlind() < 1) {
				if (sg.lock == "Red") {color = "#ff8888"; locktext = TextGet("KinkyRedLockAbr");}
				if (sg.lock == "Blue") {color = "#8888FF"; locktext = TextGet("KinkyBlueLockAbr");}
			} else color = "#888888";

			let GroupText = sg.name ? ("Restraint" + sg.name) : ("KinkyDungeonGroup"+ sg.group); // The name of the group to draw.

			DrawText(TextGet(GroupText) + locktext, x + ((!sg.left) ? ButtonWidth : 0), y-24, color, "black");
			MainCanvas.textAlign = "center";

			let i = 1;
			DrawButton(x, y, ButtonWidth, ButtonWidth, "", "White", KinkyDungeonRootDirectory + "Struggle.png", "");
			if (sg.curse) {
				DrawButton(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth, "", "White", KinkyDungeonRootDirectory + "CurseInfo.png", ""); i++;
				if (KinkyDungeonCurseAvailable(sg, sg.curse))
					DrawButton(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth, "", "White", KinkyDungeonRootDirectory + "CurseUnlock.png", ""); i++;
			} else if (!sg.blocked) {
				let toolSprite = (sg.lock != "") ? ((sg.lock != "Jammed") ? "Key" : "LockJam") : "Buckle";
				if (KinkyDungeonNormalBlades > 0 || KinkyDungeonWeaponCanCut(true) || KinkyDungeonEnchantedBlades > 0) {DrawButton(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth, "", "White", KinkyDungeonRootDirectory + "Cut.png", ""); i++;}
				DrawButton(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth, "", "White", KinkyDungeonRootDirectory + toolSprite + ".png", ""); i++;
				if (KinkyDungeonLockpicks > 0 && sg.lock != "") {DrawButton(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth, "", "White", KinkyDungeonRootDirectory + "UseTool.png", ""); i++;}
			}
		}

	if (KinkyDungeonDrawStruggle) DrawButton(510, 925, 120, 60, "", KinkyDungeonStruggleGroups.length > 0 ? "White" : "grey", KinkyDungeonRootDirectory + "HideTrue.png", "");
	else DrawButton(510, 925, 120, 60, "", KinkyDungeonStruggleGroups.length > 0 ? "White" : "grey", KinkyDungeonRootDirectory + "HideFalse.png", "");

	DrawButton(510, 825, 60, 90, "", "White", KinkyDungeonRootDirectory + (KinkyDungeonShowInventory ? "BackpackOpen.png" : "Backpack.png"), "");

	if (KinkyDungeonTargetTile) {
		if (KinkyDungeonTargetTile.Type == "Lock") {
			let action = false;
			if (KinkyDungeonLockpicks > 0) {
				DrawButton(963, 825, 112, 60, TextGet("KinkyDungeonPickDoor"), "White", "", "");
				action = true;
			}

			if ((KinkyDungeonTargetTile.Lock.includes("Red") && KinkyDungeonRedKeys > 0) || (KinkyDungeonTargetTile.Lock.includes("Blue") && KinkyDungeonBlueKeys > 0)) {
				DrawButton(825, 825, 112, 60, TextGet("KinkyDungeonUnlockDoor"), "White", "", "");
				action = true;
			}

			if (!action) DrawText(TextGet("KinkyDungeonLockedDoor"), 950, 850, "white", "black");

			if (KinkyDungeonTargetTile.Lock.includes("Red"))
				DrawText(TextGet("KinkyRedLock"), 700, 850, "white", "black");
			else if (KinkyDungeonTargetTile.Lock.includes("Blue"))
				DrawText(TextGet("KinkyBlueLock"), 700, 850, "white", "black");
		} else if (KinkyDungeonTargetTile.Type == "Shrine") {
			KinkyDungeonDrawShrine();
		} else if (KinkyDungeonTargetTile.Type == "Ghost") {
			KinkyDungeonDrawGhost();
		} else if (KinkyDungeonTargetTile.Type == "Door") {
			if (KinkyDungeonTargetTile.Lock) {
				let action = false;
				if (KinkyDungeonLockpicks > 0) {
					DrawButton(963, 825, 112, 60, TextGet("KinkyDungeonPickDoor"), "White", "", "");
					action = true;
				}

				if ((KinkyDungeonTargetTile.Lock.includes("Red") && KinkyDungeonRedKeys > 0) || (KinkyDungeonTargetTile.Lock.includes("Blue") && KinkyDungeonBlueKeys > 0)) {
					DrawButton(825, 825, 112, 60, TextGet("KinkyDungeonUnlockDoor"), "White", "", "");
					action = true;
				}

				if (!action) DrawText(TextGet("KinkyDungeonLockedDoor"), 950, 850, "white", "black");

				if (KinkyDungeonTargetTile.Lock.includes("Red"))
					DrawText(TextGet("KinkyRedLock"), 675, 850, "white", "black");
				else if (KinkyDungeonTargetTile.Lock.includes("Blue"))
					DrawText(TextGet("KinkyBlueLock"), 675, 850, "white", "black");
			} else
				DrawButton(675, 825, 350, 60, TextGet("KinkyDungeonCloseDoor"), "White");
		}
	} else {
		DrawButton(675, 825, 250, 60, TextGet("KinkyDungeonAutoDoor" + (KinkyDungeonToggleAutoDoor ? "On" : "Off")), "#AAAAAA");
	}

	DrawButton(650, 925, 165, 60, TextGet("KinkyDungeonInventory"), "White", "", "");
	DrawButton(840, 925, 165, 60, TextGet("KinkyDungeonReputation"), "White", "", "");
	DrawButton(1030, 925, 165, 60, TextGet("KinkyDungeonMagic"), "White", "", "");

	for (let i = 0; i < KinkyDungeonSpellChoiceCount; i++) {
		if (KinkyDungeonSpells[KinkyDungeonSpellChoices[i]] && !KinkyDungeonSpells[KinkyDungeonSpellChoices[i]].passive) {
			let spell = KinkyDungeonSpells[KinkyDungeonSpellChoices[i]];
			let components = KinkyDungeonGetCompList(spell);
			DrawTextFit(TextGet("KinkyDungeonSpell"+ spell.name), 1275 + i*KinkyDungeonSpellChoiceOffset, 835, KinkyDungeonSpellChoiceOffset * 0.95, "white", "black");
			DrawTextFit(spell.manacost+ TextGet("KinkyDungeonManaCost").replace("COMPONENTS", components), 1275 + i*KinkyDungeonSpellChoiceOffset, 880, KinkyDungeonSpellChoiceOffset * 0.95, "#ccddFF", "black");
			DrawButton(1230 + i*KinkyDungeonSpellChoiceOffset, 895, 90, 90, "", "White", KinkyDungeonRootDirectory + "Spell" + (i+1) + ".png", "");
		}
	}
	/*if (KinkyDungeonSpells[KinkyDungeonSpellChoices[1]] && !KinkyDungeonSpells[KinkyDungeonSpellChoices[1]].passive) {
		let spell = KinkyDungeonSpells[KinkyDungeonSpellChoices[1]];
		let components = KinkyDungeonGetCompList(spell);
		DrawTextFit(TextGet("KinkyDungeonSpell"+ spell.name), 1275 + 1*KinkyDungeonSpellChoiceOffset, 835, KinkyDungeonSpellChoiceOffset * 0.95, "white", "black");
		DrawTextFit(spell.manacost+ TextGet("KinkyDungeonManaCost").replace("COMPONENTS", components), 1275 + 1*KinkyDungeonSpellChoiceOffset, 870, KinkyDungeonSpellChoiceOffset * 0.9, "#55AAFF", "black");
		DrawButton(1230 + 1*KinkyDungeonSpellChoiceOffset, 895, 90, 90, "", "White", KinkyDungeonRootDirectory + "Spell2.png", "");
	}
	if (KinkyDungeonSpells[KinkyDungeonSpellChoices[2]] && !KinkyDungeonSpells[KinkyDungeonSpellChoices[2]].passive) {
		let spell = KinkyDungeonSpells[KinkyDungeonSpellChoices[2]];
		let components = KinkyDungeonGetCompList(spell);
		DrawTextFit(TextGet("KinkyDungeonSpell"+ spell.name), 1275 + 2*KinkyDungeonSpellChoiceOffset, 835, KinkyDungeonSpellChoiceOffset * 0.95, "white", "black");
		DrawTextFit(spell.manacost+ TextGet("KinkyDungeonManaCost").replace("COMPONENTS", components), 1275 + 2*KinkyDungeonSpellChoiceOffset, 870, KinkyDungeonSpellChoiceOffset * 0.9, "#55AAFF", "black");
		DrawButton(1230 + 2*KinkyDungeonSpellChoiceOffset, 895, 90, 90, "", "White", KinkyDungeonRootDirectory + "Spell3.png", "");
	}*/

	KinkyDungeonMultiplayerUpdate(KinkyDungeonNextDataSendTimeDelayPing);

}

function KinkyDungeonDrawProgress(x, y, amount, totalIcons, maxWidth, sprite) {
	let iconCount = 6;
	let scale = maxWidth / (72 * iconCount);
	let interval = 1/iconCount;
	let numIcons = amount / interval;
	let xOffset = (6 - totalIcons) * maxWidth / 6 / 2;
	for (let icon = 0; icon < totalIcons; icon += 1) {
		DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Icons/" + sprite +"Empty.png", MainCanvas, 0, 0, 72, 72, xOffset + x + 72 * scale * icon, y, 72*scale, 72*scale, false);
	}
	for (let icon = 0; icon < numIcons && numIcons > 0; icon += 1) {
		DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Icons/" + sprite + ((icon + 0.5 <= numIcons) ? "Full.png" : "Half.png"), MainCanvas, 0, 0, 72, 72, xOffset + x + 72 * scale * icon, y, 72*scale, 72*scale, false);
	}
}

function KinkyDungeonDrawStats(x, y, width, heightPerBar) {
	// Draw labels
	let buttonWidth = 48;
	let suff = (!KinkyDungeonPlayer.CanTalk()) ? "Unavailable" : "";
	if (KinkyDungeonStatArousal > 0) {
		DrawTextFit(TextGet("StatArousal").replace("MAX", KinkyDungeonStatArousalMax + "").replace("CURRENT", Math.floor(KinkyDungeonStatArousal) + ""), x+width/2 + buttonWidth, y + 25, width - 2*buttonWidth, (KinkyDungeonStatArousal < 100) ? "white" : "pink", "black");
		DrawButton(x, y, buttonWidth, buttonWidth, "", KinkyDungeonItemCount("PotionFrigid") ? "Pink" : "#444444", KinkyDungeonRootDirectory + "UsePotion" + suff + ".png", "");
		MainCanvas.textAlign = "left";
		DrawTextFit("x" + KinkyDungeonItemCount("PotionFrigid"), x + buttonWidth, y+buttonWidth/2, buttonWidth/2, "white", "black");
		MainCanvas.textAlign = "center";
	}
	DrawTextFit(TextGet("StatStamina").replace("MAX", KinkyDungeonStatStaminaMax + "").replace("CURRENT", Math.floor(KinkyDungeonStatStamina) + ""), x+width/2 + buttonWidth, y + 25 + heightPerBar, width - 2*buttonWidth, (KinkyDungeonStatStamina > 0.5) ? "white" : "pink", "black");
	DrawButton(x, y+heightPerBar, buttonWidth, buttonWidth, "", (KinkyDungeonStatStamina < KinkyDungeonStatStaminaMax && KinkyDungeonItemCount("PotionStamina")) ? "#AAFFAA" : "#444444", KinkyDungeonRootDirectory + "UsePotion" + suff + ".png", "");
	MainCanvas.textAlign = "left";
	DrawTextFit("x" + KinkyDungeonItemCount("PotionFrigid"), x + buttonWidth, y+1*heightPerBar+buttonWidth/2, buttonWidth/2, "white", "black");
	MainCanvas.textAlign = "center";DrawTextFit(TextGet("StatMana").replace("MAX", KinkyDungeonStatManaMax + "").replace("CURRENT", Math.floor(KinkyDungeonStatMana) + ""), x+width/2 + buttonWidth, y + 25 + heightPerBar * 2, width - 2*buttonWidth, (KinkyDungeonStatMana > 0.5) ? "white" : "pink", "black");
	DrawButton(x, y+2*heightPerBar, buttonWidth, buttonWidth, "", (KinkyDungeonStatMana < KinkyDungeonStatManaMax && KinkyDungeonItemCount("PotionMana")) ? "#AAAAFF" : "#444444", KinkyDungeonRootDirectory + "UsePotion" + suff + ".png", "");
	MainCanvas.textAlign = "left";
	DrawTextFit("x" + KinkyDungeonItemCount("PotionFrigid"), x + buttonWidth, y+2*heightPerBar+buttonWidth/2, buttonWidth/2, "white", "black");
	MainCanvas.textAlign = "center";
	let maxVisual = KinkyDungeonStatMaxMax;
	// Draw arousal
	if (KinkyDungeonStatArousal > 0)
		KinkyDungeonDrawProgress(x, y + heightPerBar*0.5, KinkyDungeonStatArousal/maxVisual, Math.floor(KinkyDungeonStatArousalMax/12), width, "Heart");

	// Draw Stamina/Mana
	KinkyDungeonDrawProgress(x, y + heightPerBar*1.5, KinkyDungeonStatStamina/maxVisual, Math.floor(KinkyDungeonStatStaminaMax/12), width, "Stamina");
	KinkyDungeonDrawProgress(x, y + heightPerBar*2.5, KinkyDungeonStatMana/maxVisual, Math.floor(KinkyDungeonStatManaMax/12), width, "Mana");

	let sleepColor = "#444444";
	if (KinkyDungeonStatStamina < KinkyDungeonStatStaminaMax * 0.25) sleepColor = "#ffffff";
	else if (KinkyDungeonStatStamina < KinkyDungeonStatStaminaMax * 0.5) sleepColor = "#bbbbbb";
	else if (KinkyDungeonStatStamina < KinkyDungeonStatStaminaMax * 0.75) sleepColor = "#999999";
	else if (KinkyDungeonStatStamina < KinkyDungeonStatStaminaMax) sleepColor = "#777777";
	DrawButton(x, y+3*heightPerBar, 250, 50, TextGet("KinkyDungeonSleep"), sleepColor);

	let i = 3.5;
	DrawText(TextGet("CurrentGold") + KinkyDungeonGold, x+width/2, y + 25 + i * heightPerBar, "white", "black"); i+= 0.5;
	DrawText(TextGet("CurrentLockpicks") + KinkyDungeonLockpicks, x+width/2, y + 25 + i * heightPerBar, "white", "black"); i+= 0.5;
	DrawText(TextGet("CurrentKnife") + KinkyDungeonNormalBlades, x+width/2, y + 25 + i * heightPerBar, "white", "black"); i+= 0.5;

	if (KinkyDungeonEnchantedBlades > 0) {DrawText(TextGet("CurrentKnifeMagic") + KinkyDungeonEnchantedBlades, x+width/2, y + 25 + i * heightPerBar, "white", "black"); i+= 0.5;}
	if (KinkyDungeonRedKeys > 0) {DrawText(TextGet("CurrentKeyRed") + KinkyDungeonRedKeys, x+width/2, y + 25 + i * heightPerBar, "white", "black"); i+= 0.5;}
	if (KinkyDungeonBlueKeys > 0) {DrawText(TextGet("CurrentKeyBlue") + KinkyDungeonBlueKeys, x+width/2, y + 25 + i * heightPerBar, "white", "black"); i+= 0.5;}
}

function KinkyDungeonHandleHUD() {
	let buttonWidth = 48;
	if (KinkyDungeonDrawState == "Game") {
		if (KinkyDungeonShowInventory) {
			KinkyDungeonhandleQuickInv();
			return true;
		}
		if (MouseIn(1750, 82, 100, 50)) {
			KinkyDungeonMessageToggle = !KinkyDungeonMessageToggle;
			return true;
		} else if (MouseIn(1885, 900, 90, 90)) {
			if (!KinkyDungeonFastMoveSuppress)
				KinkyDungeonFastMove = !KinkyDungeonFastMove;
			KinkyDungeonFastMoveSuppress = false;
			KinkyDungeonFastMovePath = [];
			return true;
		}
		if (MouseIn(1785, 900, 90, 90)) {
			if (!KinkyDungeonFastStruggleSuppress)
				KinkyDungeonFastStruggle = !KinkyDungeonFastStruggle;
			KinkyDungeonFastStruggleSuppress = false;
			KinkyDungeonFastStruggleGroup = "";
			KinkyDungeonFastStruggleType = "";
			return true;
		}


		if (MouseIn(canvasOffsetX, canvasOffsetY, KinkyDungeonCanvas.width, KinkyDungeonCanvas.height))
			KinkyDungeonSetTargetLocation();

		if (MouseIn(650, 925, 165, 60)) { KinkyDungeonDrawState = "Inventory"; return true;}
		else
		if (MouseIn(840, 925, 165, 60)) { KinkyDungeonDrawState = "Reputation"; return true;}
		else
		if (MouseIn(1030, 925, 165, 60)) {
			//KinkyDungeonDrawState = "Magic";
			KinkyDungeonDrawState = "MagicSpells";
			return true;}
		else if (MouseIn(510, 925, 120, 60)) { KinkyDungeonDrawStruggle = !KinkyDungeonDrawStruggle; return true;}
		else if (MouseIn(510, 825, 60, 90)) {
			KinkyDungeonShowInventory = !KinkyDungeonShowInventory;
		}

		if (MouseIn(1880, 120, 100, 40)) {
			KinkyDungeonDrawState = "Restart";
			return true;
		}

		if (!KinkyDungeonTargetingSpell) {
			if (KinkyDungeonHandleSpell()) return true;
			KinkyDungeonSpellPress = 0;
		} else {
			KinkyDungeonSpellPress = 0;
		}

		if (KinkyDungeonTargetTile) {
			if (KinkyDungeonTargetTile.Type &&
				((KinkyDungeonTargetTile.Type == "Lock") || (KinkyDungeonTargetTile.Type == "Door" && KinkyDungeonTargetTile.Lock))) {
				if (KinkyDungeonLockpicks > 0 && MouseIn(963, 825, 112, 60)) {
					KinkyDungeonAdvanceTime(1, true);
					if (KinkyDungeonPickAttempt()) {
						if (KinkyDungeonTargetTile.Type == "Door") KinkyDungeonTargetTile.Lock = undefined;
						else delete KinkyDungeonTiles[KinkyDungeonTargetTileLocation];
						KinkyDungeonTargetTile = null;
					}
					KinkyDungeonMultiplayerUpdate(KinkyDungeonNextDataSendTimeDelay);
					return true;
				}

				if (((KinkyDungeonTargetTile.Lock.includes("Red") && KinkyDungeonRedKeys > 0) || (KinkyDungeonTargetTile.Lock.includes("Yellow") && (KinkyDungeonRedKeys > 0)
					|| (KinkyDungeonTargetTile.Lock.includes("Blue") && KinkyDungeonBlueKeys > 0) )) && MouseIn(825, 825, 112, 60)) {
					KinkyDungeonAdvanceTime(1, true);
					if (KinkyDungeonUnlockAttempt(KinkyDungeonTargetTile.Lock)) {
						if (KinkyDungeonTargetTile.Type == "Door") KinkyDungeonTargetTile.Lock = undefined;
						else delete KinkyDungeonTiles[KinkyDungeonTargetTileLocation];
						KinkyDungeonTargetTile = null;
					}
					KinkyDungeonMultiplayerUpdate(KinkyDungeonNextDataSendTimeDelay);
					return true;
				}
			} else if (KinkyDungeonTargetTile.Type == "Shrine") {
				if (KinkyDungeonHandleShrine())
					AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Click.ogg");
			} else if (KinkyDungeonTargetTile.Type == "Door") {
				if (MouseIn(675, 825, 350, 60)) {
					KinkyDungeonAdvanceTime(1, true);
					KinkyDungeonTargetTile = null;
					let x = KinkyDungeonTargetTileLocation.split(',')[0];
					let y = KinkyDungeonTargetTileLocation.split(',')[1];
					KinkyDungeonMapSet(parseInt(x), parseInt(y), "D");
					AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/DoorClose.ogg");
					KinkyDungeonSendActionMessage(3, TextGet("KinkyDungeonCloseDoorDone"), "white", 1);
					KinkyDungeonMultiplayerUpdate(KinkyDungeonNextDataSendTimeDelay);
					return true;
				}
			}
		} else {
			if (MouseIn(675, 825, 250, 60)) {
				KinkyDungeonToggleAutoDoor = !KinkyDungeonToggleAutoDoor;
				if (!KinkyDungeonToggleAutoDoor) KinkyDungeonDoorCloseTimer = 0;
				return true;
			}
		}

		if (KinkyDungeonStruggleGroups)
			for (let S = 0; S < KinkyDungeonStruggleGroups.length; S++) {
				let sg = KinkyDungeonStruggleGroups[S];
				let ButtonWidth = 60;
				let x = 5 + ((!sg.left) ? (490 - ButtonWidth) : 0);
				let y = 42 + sg.y * (ButtonWidth + 46);

				let i = 0;
				if (MouseIn(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth)) {
					if (sg.curse) KinkyDungeonSendActionMessage(4, TextGet("KinkyDungeonCurseStruggle" + sg.curse), "White", 2);
					else {
						if (KinkyDungeonFastStruggle) {
							KinkyDungeonFastStruggleGroup = sg;
							KinkyDungeonFastStruggleType = "Struggle";
						} else
							KinkyDungeonStruggle(sg, "Struggle");
					} return true;
				} i++;
				if (sg.curse) {
					if (MouseIn(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth)) {KinkyDungeonCurseInfo(sg, sg.curse); return true;} i++;
					if (MouseIn(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth) && KinkyDungeonCurseAvailable(sg, sg.curse)) {KinkyDungeonCurseUnlock(sg, sg.curse); return true;} i++;
				} else if (!sg.blocked) {
					if (KinkyDungeonNormalBlades > 0 || KinkyDungeonWeaponCanCut(true) || KinkyDungeonEnchantedBlades > 0)
					{
						if (MouseIn(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth)) {
							if (KinkyDungeonFastStruggle) {
								KinkyDungeonFastStruggleGroup = sg;
								KinkyDungeonFastStruggleType = "Cut";
							} else
								KinkyDungeonStruggle(sg, "Cut");
							return true;
						} i++;
					}
					if (MouseIn(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth) && sg.lock != "Jammed") {
						if (KinkyDungeonFastStruggle) {
							KinkyDungeonFastStruggleGroup = sg;
							KinkyDungeonFastStruggleType = (sg.lock != "") ? "Unlock" : "Remove";
						} else
							KinkyDungeonStruggle(sg, (sg.lock != "") ? "Unlock" : "Remove");
						return true;
					} i++;
					if (KinkyDungeonLockpicks > 0 && sg.lock != "")
					{
						if (MouseIn(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth)) {
							if (KinkyDungeonFastStruggle) {
								KinkyDungeonFastStruggleGroup = sg;
								KinkyDungeonFastStruggleType = "Pick";
							} else
								KinkyDungeonStruggle(sg, "Pick");
							return true;
						} i++;
					}
				}
			}

		let xxx = canvasOffsetX + KinkyDungeonCanvas.width+10;
		let yyy = canvasOffsetY;
		if (MouseIn(xxx, yyy + 0 * KinkyDungeonStatBarHeight, buttonWidth, buttonWidth) && KinkyDungeonItemCount("PotionFrigid") && KinkyDungeonStatArousal > 0) {
			if (KinkyDungeonPlayer.CanTalk())
				KinkyDungeonAttemptConsumable("PotionFrigid", 1);
			else KinkyDungeonSendActionMessage(7, TextGet("KinkyDungeonPotionGagged"), "orange", 1);
		} else if (MouseIn(xxx, yyy + 1 * KinkyDungeonStatBarHeight, buttonWidth, buttonWidth) && KinkyDungeonItemCount("PotionStamina") && KinkyDungeonStatStamina < KinkyDungeonStatStaminaMax) {
			if (KinkyDungeonPlayer.CanTalk())
				KinkyDungeonAttemptConsumable("PotionStamina", 1);
			else KinkyDungeonSendActionMessage(7, TextGet("KinkyDungeonPotionGagged"), "orange", 1);
		} else if (MouseIn(xxx, yyy + 2 * KinkyDungeonStatBarHeight, buttonWidth, buttonWidth) && KinkyDungeonItemCount("PotionMana") && KinkyDungeonStatMana < KinkyDungeonStatManaMax) {
			if (KinkyDungeonPlayer.CanTalk())
				KinkyDungeonAttemptConsumable("PotionMana", 1);
			else KinkyDungeonSendActionMessage(7, TextGet("KinkyDungeonPotionGagged"), "orange", 1);
		} else if (MouseIn(xxx, yyy + 3 * KinkyDungeonStatBarHeight, 250, 50)) {
			KinkyDungeonSleepTurns = KinkyDungeonSleepTurnsMax;
			KinkyDungeonAlert = 4; // Alerts nearby enemies; intent is that the enemies are searching while you sleep;
			return true;
		}
	} else if (KinkyDungeonDrawState == "Orb") {
		return KinkyDungeonHandleOrb();
	} else if (KinkyDungeonDrawState == "Magic") {
		if (MouseIn(1030, 925, 165, 60)) { KinkyDungeonDrawState = "Game"; return true;}
		else return KinkyDungeonHandleMagic();
	} else if (KinkyDungeonDrawState == "MagicSpells") {
		if (MouseIn(1030, 925, 165, 60)) { KinkyDungeonDrawState = "Game"; return true;}
		else return KinkyDungeonHandleMagicSpells();
	} else if (KinkyDungeonDrawState == "Inventory") {
		if (MouseIn(650, 925, 165, 60)) { KinkyDungeonDrawState = "Game"; return true;}
		else return KinkyDungeonHandleInventory();
	} else if (KinkyDungeonDrawState == "Reputation") {
		if (MouseIn(840, 925, 165, 60)) { KinkyDungeonDrawState = "Game"; return true;}
		else return KinkyDungeonHandleReputation();
	} else if (KinkyDungeonDrawState == "Lore") {
		if (MouseIn(650, 925, 250, 60)) { KinkyDungeonDrawState = "Game"; return true;}
		else return KinkyDungeonHandleLore();
	} else if (KinkyDungeonDrawState == "Restart") {
		if (MouseIn(975, 850, 550, 64) && !(KinkyDungeonSpawnJailers + 1 == KinkyDungeonSpawnJailersMax && !KinkyDungeonJailTransgressed)) {
			KinkyDungeonDefeat();
			KinkyDungeonChangeRep("Ghost", 4);
			KinkyDungeonDrawState = "Game";
			return true;
		}
		if (MouseIn(1075, 650, 350, 64)) {
			KinkyDungeonState = "Keybindings";
			if (!KinkyDungeonKeybindings)
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
			else {
				KinkyDungeonKeybindingsTemp = {};
				Object.assign(KinkyDungeonKeybindingsTemp, KinkyDungeonKeybindings);
			}
			return true;
		}
		if (MouseIn(875, 750, 350, 64)) {
			KinkyDungeonState = "Lose";
			//Player.KinkyDungeonSave = {};
			//ServerAccountUpdate.QueueData({KinkyDungeonSave : Player.KinkyDungeonSave});
			localStorage.setItem('KinkyDungeonSave', "");
			MiniGameKinkyDungeonLevel = -1;
			return true;
		} else if (MouseIn(1275, 750, 350, 64)) {
			KinkyDungeonDrawState = "Game";
			return true;
		}
	}

	return false;
}


function KinkyDungeonUpdateStruggleGroups() {
	let struggleGroups = KinkyDungeonStruggleGroupsBase;
	KinkyDungeonStruggleGroups = [];

	for (let S = 0; S < struggleGroups.length; S++) {
		let sg = struggleGroups[S];
		let Group = sg;
		if (sg == "ItemM") {
			if (InventoryGet(KinkyDungeonPlayer, "ItemMouth3")) Group = "ItemMouth3";
			else if (InventoryGet(KinkyDungeonPlayer, "ItemMouth2")) Group = "ItemMouth2";
			else Group = "ItemMouth";
		}

		let restraint = KinkyDungeonGetRestraintItem(Group);

		if (restraint) {
			KinkyDungeonStruggleGroups.push(
				{
					group:Group,
					left: S % 2 == 0,
					y: Math.floor(S/2),
					icon:sg,
					name:(restraint.restraint) ? restraint.restraint.name : "",
					lock:restraint.lock,
					curse:restraint.restraint? restraint.restraint.curse : undefined,
					blocked: InventoryGroupIsBlockedForCharacter(KinkyDungeonPlayer, Group)});
		}
	}
}
