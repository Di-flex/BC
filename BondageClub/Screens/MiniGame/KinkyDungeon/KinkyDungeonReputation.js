"use strict";

const KDANGER = -19;
const KDRAGE = -31;

/**
 * @type {Record<string, number>}
 */
let KinkyDungeonGoddessRep = {
};

let KinkyDungeonRescued = false;


function KinkyDungeonInitReputation() {
	KinkyDungeonGoddessRep = {"Ghost" : -50, "Prisoner" : -50};
	for (let shrine in KinkyDungeonShrineBaseCosts) {
		KinkyDungeonGoddessRep[shrine] = 0;
	}
}

function KinkyDungeonHandleReputation() {
	let i = 0;
	let maxY = 560;
	let XX = 0;
	let spacing = 60;
	let yPad = 50;
	for (let rep in KinkyDungeonGoddessRep) {
		MainCanvas.textAlign = "left";
		let value = KinkyDungeonGoddessRep[rep];

		if (rep) {
			if (spacing * i > maxY) {
				if (XX == 0) i = 0;
				XX = 600;
			}
			if (KinkyDungeonShrineBaseCosts[rep]) {
				if (MouseIn(canvasOffsetX + 275 + XX + 400, yPad + canvasOffsetY + spacing * i - 20, 100, 40) && value > 10) {
					// Aid
					//KinkyDungeonChangeRep(rep, -3);
				}
				if (MouseIn(canvasOffsetX + 275 + XX + 520, yPad + canvasOffsetY + spacing * i - 20, 150, 40) && value > -1) {
					// Rescue
					KinkyDungeonChangeRep(rep, -10);
					KinkyDungeonEntities = [];
					KinkyDungeonJailTransgressed = false;
					KinkyDungeonJailGuard = undefined;
					KinkyDungeonRescued = true;
					KinkyDungeonSendTextMessage(10, TextGet("KinkyDungeonRescueMe"), "purple", 10);
					for (let T of Object.values(KinkyDungeonTiles)) {
						if (T.Lock) T.Lock = undefined;
						if (T.Type == "Trap") T.Type = undefined;
					}
					KinkyDungeonDrawState = "Game";
					return true;
				}
				if (MouseIn(canvasOffsetX + 275 + XX + 690, yPad + canvasOffsetY + spacing * i - 20, 150, 40)) {
					// Penance
				}
			}

			i++;
		}

	}
	return true;
}

function KinkyDungeonRepName(Amount) {
	let name = "";

	if (Amount > 10) name = "Thankful";
	if (Amount > 30) name = "Pleased";
	if (Amount < KDANGER) name = "Angered";
	if (Amount < KDRAGE) name = "Enraged";
	if (Amount < -45) name = "Cursed";

	return TextGet("KinkyDungeonRepName" + name);
}

function KinkyDungeonChangeRep(Rep, Amount) {
	if (KinkyDungeonGoddessRep[Rep] != undefined) {
		let last = KinkyDungeonGoddessRep[Rep];
		//let target = -50;
		//let interval = 0.02;
		let start = KinkyDungeonGoddessRep[Rep];
		//if (Amount >= 0) target = 50;
		/*for (let i = 0; i < Math.abs(Amount); i++) {
			KinkyDungeonGoddessRep[Rep] += (target - KinkyDungeonGoddessRep[Rep]) * interval;
		}*/
		KinkyDungeonGoddessRep[Rep] += Amount;
		KinkyDungeonGoddessRep[Rep] = Math.min(50, Math.max(-50, KinkyDungeonGoddessRep[Rep]));
		if (Math.abs(KinkyDungeonGoddessRep[Rep] - start) > 0.1) {
			let amount = Math.round((KinkyDungeonGoddessRep[Rep] - start)*10)/10;
			KinkyDungeonSendFloater({x: 1100, y: 800 - KDRecentRepIndex * 40}, `${amount > 0 ? '+' : ''}${amount}% ${TextGet("KinkyDungeonShrine" + Rep)} rep`, "white", 5, true);
			KDRecentRepIndex += 1;
		}
		if (KinkyDungeonGoddessRep[Rep] != last) return true;
		return false;
	}
	return false;
}

function KinkyDungeonDrawReputation() {
	let i = 0;
	let maxY = 560;
	let XX = 0;
	let spacing = 60;
	let yPad = 50;
	for (let rep in KinkyDungeonGoddessRep) {
		MainCanvas.textAlign = "left";
		let value = KinkyDungeonGoddessRep[rep];

		if (rep) {
			if (spacing * i > maxY) {
				if (XX == 0) i = 0;
				XX = 600;
			}
			let color = "#ffff00";
			if (value < -10) {
				if (value < -30) color = "#ff0000";
				else color = "#ff8800";
			} else if (value > 10) {
				if (value > 30) color = "#00ff00";
				else color = "#88ff00";
			}
			let suff = "";
			if (rep != "Ghost" && rep != "Prisoner") suff = "" + KinkyDungeonRepName(value);
			DrawText(TextGet("KinkyDungeonShrine" + rep), canvasOffsetX + XX, yPad + canvasOffsetY + spacing * i, "white", "black");
			if (suff) {
				DrawTextFit(suff, 1+canvasOffsetX + 275 + XX + 250, 1+yPad + canvasOffsetY + spacing * i, 100, "black", "black");
				DrawTextFit(suff, canvasOffsetX + 275 + XX + 250, yPad + canvasOffsetY + spacing * i, 100, "white", "black");
			}
			DrawProgressBar(canvasOffsetX + 275 + XX, yPad + canvasOffsetY + spacing * i - spacing/4, 200, spacing/2, 50 + value, color, "#444444");

			MainCanvas.textAlign = "center";
			DrawText(" " + (Math.round(value)+50) + " ", canvasOffsetX + 275 + XX + 100+1,  1+yPad + canvasOffsetY + spacing * i, "black", "black");
			DrawText(" " + (Math.round(value)+50) + " ", canvasOffsetX + 275 + XX + 100-1,  1+yPad + canvasOffsetY + spacing * i, "black", "black");
			DrawText(" " + (Math.round(value)+50) + " ", canvasOffsetX + 275 + XX + 100+1,  3+yPad + canvasOffsetY + spacing * i, "black", "black");
			DrawText(" " + (Math.round(value)+50) + " ", canvasOffsetX + 275 + XX + 100-1,  3+yPad + canvasOffsetY + spacing * i, "black", "black");
			DrawText(" " + (Math.round(value)+50) + " ", canvasOffsetX + 275 + XX + 100,  2+yPad + canvasOffsetY + spacing * i, "white", "black");

			if (KinkyDungeonShrineBaseCosts[rep]) {
				MainCanvas.textAlign = "center";
				//DrawButton(canvasOffsetX + 275 + XX + 400, yPad + canvasOffsetY + spacing * i - 20, 100, 40, TextGet("KinkyDungeonAid"), value > 10 ? "white" : "pink");
				DrawButton(canvasOffsetX + 275 + XX + 520, yPad + canvasOffsetY + spacing * i - 20, 150, 40, TextGet("KinkyDungeonRescue"), (value > -1 && KinkyDungeonInJail() && !KinkyDungeonRescued) ? "white" : (KinkyDungeonInJail() ? "pink" : "#999999"));
				//DrawButton(canvasOffsetX + 275 + XX + 690, yPad + canvasOffsetY + spacing * i - 20, 150, 40, TextGet("KinkyDungeonPenance"), "white");

				MainCanvas.textAlign = "left";
				if (MouseIn(canvasOffsetX + 275 + XX + 400, yPad + canvasOffsetY + spacing * i - 20, 100, 40)) {
					//DrawTextFit(TextGet("KinkyDungeonAidDesc" + rep), 500, 800, 1250, "white", "black");
				}
				if (MouseIn(canvasOffsetX + 275 + XX + 520, yPad + canvasOffsetY + spacing * i - 20, 150, 40)) {
					DrawTextFit(TextGet("KinkyDungeonRescueDesc"), 500+1, 850+1, 1250, "black", "black");
					DrawTextFit(TextGet("KinkyDungeonRescueDesc"), 500, 850, 1250, "white", "black");
					// Rescue
				}
				if (MouseIn(canvasOffsetX + 275 + XX + 690, yPad + canvasOffsetY + spacing * i - 20, 150, 40)) {
					//DrawTextFit(TextGet("KinkyDungeonPenanceDesc" + rep), 500, 800, 1250, "white", "black");
					// Penance
				}
			}

			i++;
		}

	}
	MainCanvas.textAlign = "center";
}