"use strict";

function KDPersonalitySpread(Min, Avg, Max) {
	return KDStrictPersonalities.includes(KDGameData.CurrentDialogMsgPersonality) ? Max :
		(!KDLoosePersonalities.includes(KDGameData.CurrentDialogMsgPersonality) ? Avg :
		Min);
}

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
		if (KDGameData.CurrentDialogMsg == "Default") KDGameData.CurrentDialogMsg = KDGameData.CurrentDialog + KDGameData.CurrentDialogStage;

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
			let gagged = KDDialogueGagged();
			for (let i = 0; i < entries.length; i++) {
				if ((!entries[i][1].prerequisiteFunction || entries[i][1].prerequisiteFunction(gagged))
					&& (!entries[i][1].gagRequired || gagged)
					&& (!entries[i][1].gagDisabled || !gagged)) {
					let playertext = entries[i][1].playertext;
					if (playertext == "Default") playertext = KDGameData.CurrentDialog + KDGameData.CurrentDialogStage + "_" + entries[i][0];
					if (entries[i][1].gag && KDDialogueGagged()) playertext = playertext + "Gag";
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
			let gagged = KDDialogueGagged();
			for (let i = 0; i < entries.length; i++) {
				if ((!entries[i][1].prerequisiteFunction || entries[i][1].prerequisiteFunction(gagged))
					&& (!entries[i][1].gagRequired || gagged)
					&& (!entries[i][1].gagDisabled || !gagged)) {
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