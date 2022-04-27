"use strict";

/** @type {Record<string, KinkyDialogue>} */
let KDDialogue = {
	"WeaponFound": {
		response: "WeaponFound",
		options: {
			"Accept": {gag: true, playertext: "WeaponFoundAccept", response: "GoodGirl",
				clickFunction: () => {
					KinkyDungeonSendTextMessage(10, TextGet("KDWeaponConfiscated"), "red", 2);
					let weapon = KinkyDungeonPlayerDamage.name;
					if (weapon && weapon != "Knife") {
						let item = KinkyDungeonInventoryGetWeapon(weapon);
						KDSetWeapon(null);
						KinkyDungeonAddLostItems([item], false);
						KinkyDungeonInventoryRemove(item);
					}
				},
				options: {"Leave": {playertext: "Leave", exitDialogue: true}}},
			"Deny": {gag: true, playertext: "WeaponFoundDeny", response: "Punishment",
				clickFunction: () => {KinkyDungeonStartChase(undefined, "Refusal");},
				options: {"Leave": {playertext: "Leave", exitDialogue: true}}},
		}
	}
};

let KDEnemyPersonalities = [
	{name: "", weight: 10},
	{name: "Dom", weight: 1},
	{name: "Sub", weight: 3},
];

function KDGetDialogue() {
	let dialogue = KDDialogue[KDGameData.CurrentDialog];
	if (KDGameData.CurrentDialogStage && dialogue.options) {
		let stages = KDGameData.CurrentDialogStage.split("_");
		for (let i = 0; i < stages.length; i++) {
			if (dialogue.options[stages[i]])
				dialogue = dialogue.options[stages[i]];
			else {
				// Break the dialogue
				console.log("Error in dialogue " + KDGameData.CurrentDialog + ", stage = " + KDGameData.CurrentDialogStage);
				KDGameData.CurrentDialog = "";
				break;
			}
		}
	}
	return dialogue;
}

function KDDrawDialogue() {
	DrawImageCanvas(KinkyDungeonRootDirectory + "DialogBackground.png", MainCanvas, 500, 250);
	if (KDGameData.CurrentDialog) {
		// Get the current dialogue and traverse down the tree
		let dialogue = KDGetDialogue();
		// Now that we have the dialogue, we check if we have a message
		if (dialogue.response && !KDGameData.CurrentDialogMsg) KDGameData.CurrentDialogMsg = dialogue.response;

		// Type the message
		let text = TextGet("r" + KDGameData.CurrentDialogMsg).split("|");
		for (let i = 0; i < text.length; i++) {
			DrawTextFit(text[i].replace("SPEAKER", TextGet("Name" + KDGameData.CurrentDialogMsgSpeaker)),
				1000, 400 + 50 * i - 25 * text.length, 900, "white", "black");
		}

		// Draw the options
		if (dialogue.options) {
			let entries = Object.entries(dialogue.options);
			for (let i = 0; i < entries.length; i++) {
				let playertext = entries[i][1].playertext;
				DrawButton(700, 550 + i * 80, 600, 60, TextGet("d" + playertext), "white");
			}
		}
	}
}

function KDStartDialog(Dialogue, Speaker, Click) {
	KDSendInput("dialogue", {dialogue: Dialogue, dialogueStage: "", click: Click, speaker: Speaker});
}

function KDDialogueGagged() {
	let dialogue = KDGetDialogue();
	let threshold = dialogue.gagThreshold ? dialogue.gagThreshold : 0.01;
	if (KinkyDungeonGagTotal() >= threshold) return true;
	return false;
}

function KDHandleDialogue() {
	if (KDGameData.CurrentDialog) {
		// Get the current dialogue and traverse down the tree
		let dialogue = KDGetDialogue();

		// Handle the options
		if (dialogue.options) {
			let entries = Object.entries(dialogue.options);
			for (let i = 0; i < entries.length; i++) {
				if (MouseIn(700, 550 + i * 80, 600, 60)) {
					KDSendInput("dialogue", {dialogue: KDGameData.CurrentDialog, dialogueStage: KDGameData.CurrentDialogStage + ((KDGameData.CurrentDialogStage) ? "_" : "") + entries[i][0], click: true});
				}
			}
		}
	}

	return false;
}