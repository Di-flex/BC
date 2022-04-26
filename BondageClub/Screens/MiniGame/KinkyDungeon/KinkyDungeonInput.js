"use strict";

/**
 * @type {{type: string, data: any}[]}
 */
let KinkyDungeonInputQueue = [];

/**
 * @returns {string}
 * Delegate to KDProcessInputs */
function KDProcessInput(type, data) {
	let Result = null;
	switch (type) {
		case "move":
			KinkyDungeonMove(data.dir, data.delta, data.AllowInteract);
			break;
		case "setMoveDirection":
			KinkyDungeonMoveDirection = data.dir;
			break;
		case "tick":
			KinkyDungeonAdvanceTime(data.delta, data.NoUpdate, data.NoMsgTick);
			break;
		case "tryCastSpell":
			Result = KinkyDungeonCastSpell(data.tx, data.ty, KinkyDungeonFindSpell(data.spell, true), undefined, KinkyDungeonPlayerEntity);
			if (Result == "Cast" && KinkyDungeonTargetingSpell.sfx) {
				KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + KinkyDungeonTargetingSpell.sfx + ".ogg");
			}
			if (Result != "Fail")
				KinkyDungeonAdvanceTime(1);
			KinkyDungeonInterruptSleep();
			return Result;
		case "struggle":
			return KinkyDungeonStruggle(data.group, data.type);
	}
	return "";
}

/**
 *
 * @param {string} type
 * @param {any} data
 * @returns {string}
 */
function KDSendInput(type, data) {
	KinkyDungeonInputQueue.push({type: type, data: data});
	return KDProcessInputs(true);
}

/**
 * Handles inputs once per frame
 * @returns {string}
 */
function KDProcessInputs(ReturnResult) {
	if (KinkyDungeonInputQueue.length > 0) {
		let input = KinkyDungeonInputQueue.splice(0, 1)[0];
		if (input) {
			let res = KDProcessInput(input.type, input.data);
			if (ReturnResult) return res;
		}


	}
	return "";
}