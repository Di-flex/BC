"use strict";

let KDDialogue = {
	"WeaponFound": {
		text: "",
		response: "WeaponFound",
		options: {
			"Accept": {gag: true, text: "WeaponFoundAccept", response: "GoodGirl"},
		}
	}
};

let KDEnemyPersonalities = [
	{name: "", weight: 10},
	{name: "Dom", weight: 1},
	{name: "Sub", weight: 3},
];

function KDDrawDialogue() {
	DrawImageCanvas(KinkyDungeonRootDirectory + "DialogBackground.png", MainCanvas, 500, 250);
}

function KDHandleDialogue() {

	return false;
}