"use strict";

/** @type {Record<string, KinkyDialogue>} */
let KDDialogue = {
	"WeaponFound": {
		response: "WeaponFound",
		personalities: ["Robot"],
		options: {
			"Accept": {gag: true, playertext: "WeaponFoundAccept", response: "GoodGirl", personalities: ["Dom", "Sub", "Robot"],
				clickFunction: () => {
					KinkyDungeonSendTextMessage(10, TextGet("KDWeaponConfiscated"), "red", 2);
					let weapon = KinkyDungeonPlayerDamage.name;
					if (weapon && weapon != "Knife") {
						KinkyDungeonChangeRep("Ghost", 3);
						let item = KinkyDungeonInventoryGetWeapon(weapon);
						KDSetWeapon(null);
						KinkyDungeonAddLostItems([item], false);
						KinkyDungeonInventoryRemove(item);
					}
				},
				options: {"Leave": {playertext: "Leave", exitDialogue: true}}},
			"Bluff": {playertext: "", response: "",
				prerequisiteFunction: (gagged) => {return false;},
				options: {"Leave": {playertext: "Leave", exitDialogue: true}}},
			"Deny": {gag: true, playertext: "WeaponFoundDeny", response: "Punishment", personalities: ["Dom", "Sub", "Robot"],
				clickFunction: () => {KinkyDungeonStartChase(undefined, "Refusal");},
				options: {"Leave": {playertext: "Leave", exitDialogue: true}}},
			"Illusion": {gag: true, playertext: "WeaponFoundIllusion", response: "Disbelief", personalities: ["Dom", "Sub", "Robot"],
				clickFunction: () => {
					let diff = KDStrictPersonalities.includes(KDGameData.CurrentDialogMsgPersonality) ?
						80 :
						(!KDLoosePersonalities.includes(KDGameData.CurrentDialogMsgPersonality) ?
						60 :
						40);
					if (KDBasicCheck(["Illusion", "Ghost"], ["Prisoner"]) > diff) {
						KDGameData.CurrentDialogStage = "Bluff";
						KDGameData.CurrentDialogMsg = "Bluffed";
					}
					KDDialogueApplyPersonality(["Dom", "Sub", "Robot"]);
				},
				options: {"Back": {playertext: "Pause", leadsToStage: ""}}},
		}
	}
};

function KDBasicCheck(PositiveReps, NegativeReps) {
	let value = 0;
	for (let rep of PositiveReps) {
		if (KinkyDungeonGoddessRep[rep] != undefined) value += 50 + KinkyDungeonGoddessRep[rep];
	}
	for (let rep of NegativeReps) {
		if (KinkyDungeonGoddessRep[rep] != undefined) value -= 50 + KinkyDungeonGoddessRep[rep];
	}
	return value;
}

function KDDialogueApplyPersonality(allowed) {
	if (allowed.includes(KDGameData.CurrentDialogMsgPersonality)) KDGameData.CurrentDialogMsg = KDGameData.CurrentDialogMsg + KDGameData.CurrentDialogMsgPersonality;
}

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
				1000, 300 + 50 * i - 25 * text.length, 900, "white", "black");
		}

		// Draw the options
		if (dialogue.options) {
			let entries = Object.entries(dialogue.options);
			let II = 0;
			for (let i = 0; i < entries.length; i++) {
				if (!entries[i][1].prerequisiteFunction || entries[i][1].prerequisiteFunction(KDDialogueGagged())) {
					let playertext = entries[i][1].playertext;
					DrawButton(700, 450 + II * 60, 600, 50, TextGet("d" + playertext), KinkyDungeonDialogueTimer < CommonTime() ? "white" : "#888888");
					II += 1;
				}
			}
		}
	}
}

let KinkyDungeonDialogueTimer = 0;

function KDStartDialog(Dialogue, Speaker, Click, Personality) {
	KinkyDungeonDialogueTimer = CommonTime() + 1000;
	KDSendInput("dialogue", {dialogue: Dialogue, dialogueStage: "", click: Click, speaker: Speaker, personality: Personality});
}

function KDDialogueGagged() {
	let dialogue = KDGetDialogue();
	let threshold = dialogue.gagThreshold ? dialogue.gagThreshold : 0.01;
	if (KinkyDungeonGagTotal() >= threshold) return true;
	return false;
}

function KDHandleDialogue() {
	if (KDGameData.CurrentDialog && KinkyDungeonDialogueTimer < CommonTime()) {
		// Get the current dialogue and traverse down the tree
		let dialogue = KDGetDialogue();

		// Handle the options
		if (dialogue.options) {
			let entries = Object.entries(dialogue.options);
			let II = 0;
			for (let i = 0; i < entries.length; i++) {
				if (!entries[i][1].prerequisiteFunction || entries[i][1].prerequisiteFunction(KDDialogueGagged())) {
					if (MouseIn(700, 450 + II * 60, 600, 50)) {
						KDSendInput("dialogue", {dialogue: KDGameData.CurrentDialog, dialogueStage: KDGameData.CurrentDialogStage + ((KDGameData.CurrentDialogStage) ? "_" : "") + entries[i][0], click: true});
					}
					II += 1;
				}
			}
		}
	}

	return false;
}