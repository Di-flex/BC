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
	let loose = null;
	let msg = "";
	let success = 0;
	let tile = null;
	switch (type) {
		case "move":
			KinkyDungeonToggleAutoDoor = data.AutoDoor;
			KinkyDungeonMove(data.dir, data.delta, data.AllowInteract);
			break;
		case "setMoveDirection":
			KinkyDungeonMoveDirection = data.dir;
			break;
		case "tick":
			KinkyDungeonAdvanceTime(data.delta, data.NoUpdate, data.NoMsgTick);
			break;
		case "tryCastSpell":
			Result = KinkyDungeonCastSpell(data.tx, data.ty, data.spell ? data.spell : KinkyDungeonFindSpell(data.spellname, true), data.enemy, data.player, data.bullet);
			if (Result == "Cast" && KinkyDungeonTargetingSpell.sfx) {
				KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + KinkyDungeonTargetingSpell.sfx + ".ogg");
			}
			if (Result != "Fail")
				KinkyDungeonAdvanceTime(1);
			KinkyDungeonInterruptSleep();
			return Result;
		case "struggle":
			return KinkyDungeonStruggle(data.group, data.type);
		case "struggleCurse":
			KinkyDungeonCurseStruggle(data.group, data.curse);
			break;
		case "curseUnlock":
			KinkyDungeonCurseUnlock(data.group, data.curse);
			break;
		case "toggleSpell":
			KinkyDungeonSpellChoicesToggle[data.i] = !KinkyDungeonSpellChoicesToggle[data.i];
			if (KinkyDungeonSpellChoicesToggle[data.i] && KinkyDungeonSpells[KinkyDungeonSpellChoices[data.i]].costOnToggle) {
				if (KinkyDungeonHasMana(KinkyDungeonGetManaCost(KinkyDungeonSpells[KinkyDungeonSpellChoices[data.i]]))) {
					KinkyDungeonChangeMana(-KinkyDungeonGetManaCost(KinkyDungeonSpells[KinkyDungeonSpellChoices[data.i]]));
				} else KinkyDungeonSpellChoicesToggle[data.i] = false;
			}
			break;
		case "consumable":
			KinkyDungeonAttemptConsumable(data.item, data.quantity);
			break;
		case "switchWeapon":
			KDSetWeapon(data.weapon);
			KinkyDungeonGetPlayerWeaponDamage(KinkyDungeonCanUseWeapon());
			if (KinkyDungeonStatsChoice.has("Disorganized")) {
				KinkyDungeonAdvanceTime(1);
				KinkyDungeonSlowMoveTurns = 2;
			} else if (!KinkyDungeonStatsChoice.has("QuickDraw"))
				KinkyDungeonAdvanceTime(1);
			KinkyDungeonSendActionMessage(7, TextGet("KinkyDungeonEquipWeapon").replace("WEAPONNAME", TextGet("KinkyDungeonInventoryItem" + data.weapon)), "white", 5);
			break;
		case "unequipWeapon":
			KDSetWeapon(null);
			KinkyDungeonGetPlayerWeaponDamage(KinkyDungeonCanUseWeapon());
			KinkyDungeonSendActionMessage(7, TextGet("KinkyDungeonUnEquipWeapon").replace("WEAPONNAME", TextGet("KinkyDungeonInventoryItem" + data.weapon)), "white", 5);
			break;
		case "dress":
			KinkyDungeonSetDress(data.dress, data.outfit);
			KinkyDungeonSlowMoveTurns = 3;
			KinkyDungeonSleepTime = CommonTime() + 200;
			break;
		case "equip":
			success = KinkyDungeonAddRestraintIfWeaker(KinkyDungeonRestraintsCache.get(data.name), 0, true, "", KinkyDungeonGetRestraintItem(data.Group) && !KinkyDungeonLinkableAndStricter(KDRestraint(data.currentItem), KinkyDungeonRestraintsCache.get(data.name)), false, data.events);
			if (success) {
				KDSendStatus('bound', data.name, "self");
				loose = KinkyDungeonInventoryGetLoose(data.name);
				msg = "KinkyDungeonSelfBondage";
				if (KDRestraint(loose).Group == "ItemVulvaPiercings" || KDRestraint(loose).Group == "ItemVulva" || KDRestraint(loose).Group == "ItemButt") {
					if (KinkyDungeonIsChaste(false)) {
						msg = "KinkyDungeonSelfBondagePlug";
					}
				} else if (KDRestraint(loose).Group == "Item") {
					if (KinkyDungeonIsChaste(true)) {
						msg = "KinkyDungeonSelfBondageNipple";
					}
				} else if (KDRestraint(loose).enchanted) {
					msg = "KinkyDungeonSelfBondageEnchanted";
				}
				KinkyDungeonSendTextMessage(10, TextGet(msg).replace("RestraintName", TextGet("Restraint" + KDRestraint(loose).name)), "yellow", 1);
				KinkyDungeonInventoryRemove(loose);
				return msg;
			}
			break;
		case "tryOrgasm":
			KinkyDungeonDoTryOrgasm();
			break;
		case "tryPlay":
			KinkyDungeonDoPlayWithSelf();
			break;
		case "sleep":
			KDGameData.SleepTurns = KinkyDungeonSleepTurnsMax;
			break;
		case "pick":
			tile = KinkyDungeonTiles.get(data.targetTile);
			KinkyDungeonTargetTile = tile;
			KinkyDungeonTargetTileLocation = data.targetTile;
			KinkyDungeonAdvanceTime(1, true);
			if (KinkyDungeonPickAttempt()) {
				KinkyDungeonTargetTile.Lock = undefined;
				if (KinkyDungeonTargetTile.Type == "Lock") delete KinkyDungeonTargetTile.Type;
				KinkyDungeonTargetTile = null;
				KinkyDungeonTargetTileLocation = "";
			}
			KinkyDungeonMultiplayerUpdate(KinkyDungeonNextDataSendTimeDelay);
			break;
		case "unlock":
			tile = KinkyDungeonTiles.get(data.targetTile);
			KinkyDungeonTargetTile = tile;
			KinkyDungeonTargetTileLocation = data.targetTile;
			KinkyDungeonAdvanceTime(1, true);
			if (KinkyDungeonUnlockAttempt(KinkyDungeonTargetTile.Lock)) {
				KinkyDungeonTargetTile.Lock = undefined;
				if (KinkyDungeonTargetTile.Type == "Lock") delete KinkyDungeonTargetTile.Type;
				KinkyDungeonTargetTile = null;
				KinkyDungeonTargetTileLocation = "";
			}
			KinkyDungeonMultiplayerUpdate(KinkyDungeonNextDataSendTimeDelay);
			break;
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