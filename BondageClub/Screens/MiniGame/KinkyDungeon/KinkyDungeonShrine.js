"use strict";

/**
 * Base costs for all the shrines. Starts at this value, increases thereafter
 * @type {Record<string, number>}
 */
let KinkyDungeonShrineBaseCosts = {
	//"Charms": 25,
	"Leather": 40,
	"Metal": 60,
	"Rope": 20,
	"Latex": 40,
	"Will": 20,
	"Elements": 200,
	"Conjure": 200,
	"Illusion": 200,
};

let KinkyDungeonOrbAmount = 0;
let KDShrineRemoveCount = 3;

/**
 * Cost growth, overrides the default amount
 * @type {Record<string, number>}
 */
let KinkyDungeonShrineBaseCostGrowth = {
	"Elements": 2,
	"Conjure": 2,
	"Illusion": 2,
};

/**
 * @type {shopItem[]}
 */
let KinkyDungeonShopItems = [];
let KinkyDungeonShopIndex = 0;

let KinkyDungeonShrinePoolChancePerUse = 0.2;

/**
 * Current costs multipliers for shrines
 * @type {Record<string, number>}
 */
let KinkyDungeonShrineCosts = {};

let KinkyDungeonShrineTypeRemove = ["Charms", "Leather", "Metal", "Rope", "Latex", "Gags", "Blindfolds", "Boots"]; // These shrines will always remove restraints associated with their shrine

function KinkyDungeonShrineInit() {
	KinkyDungeonShrineCosts = {};
	KDGameData.PoolUsesGrace = 3;

	KinkyDungeonInitReputation();

}

function KinkyDungeonShrineAvailable(type) {
	if (type == "Commerce") {
		if (KinkyDungeonShopItems.length > 0) return true;
		else return false;
	}
	if (KinkyDungeonShrineTypeRemove.includes(type) && KinkyDungeonGetRestraintsWithShrine(type).length > 0) return true;
	else if ((type == "Elements" || type == "Illusion" || type == "Conjure")) return true;
	else if (type == "Will" && (KinkyDungeonStatMana < KinkyDungeonStatManaMax || KinkyDungeonStatStamina < KinkyDungeonStatStaminaMax)) return true;

	return false;
}

let KDLevelsPerCheckpoint = 6;

function KinkyDungeonGenerateShop(Level) {
	KDGameData.PoolUses = Math.min(KDGameData.PoolUses, KinkyDungeonStatsChoice.get("Blessed") ? 0 : 1);
	KinkyDungeonShopIndex = 0;
	KinkyDungeonShopItems = [];
	let items_mid = 0;
	let items_high = 0;
	let itemCount = 8 + Math.floor(KDRandom() * 3);
	if (KinkyDungeonStatsChoice.has("Supermarket")) {
		items_mid = -1;
		items_high = -1;
		itemCount += 2;
	}
	for (let I = itemCount; I > 0; I--) {
		let Rarity = 0;
		if (items_high < 3) {Rarity = Math.floor(Level/KDLevelsPerCheckpoint); items_high += 1;}
		else if (items_mid < 5) {Rarity += Math.round(KDRandom() * 3); items_mid += 1;}

		let item = KinkyDungeonGetShopItem(Level, Rarity, true);
		if (item)
			KinkyDungeonShopItems.push({name: item.name, shoptype: item.shoptype, consumable: item.consumable, quantity: item.quantity, rarity: item.rarity, cost: item.cost});
	}
	KinkyDungeonShopItems.sort(function(a, b){return a.rarity-b.rarity;});
}

function KinkyDungeonItemCost(item, noScale, sell) {
	if (item.cost != null) return item.cost;
	if (item.rarity != null) {
		let rarity = item.rarity;
		if (item.costMod) rarity += item.costMod;
		let costt = 5 * Math.round((1 + MiniGameKinkyDungeonLevel/KDLevelsPerCheckpoint/2.5 * (noScale ? 0 : 1))*(30 + 2 * rarity * rarity * 10)/5);
		if (costt > 100) costt = 50 * Math.round(costt / 50);
		if (KinkyDungeonStatsChoice.has("PriceGouging") && !sell) {
			costt *= 5;
		}
		return costt;
	}
	return 15;
}

function KinkyDungeonShrineCost(type) {
	let mult = 1.0;
	let growth = 1.0;
	let noMult = false;

	if (type == "Commerce" && KinkyDungeonShopIndex < KinkyDungeonShopItems.length) {
		let item = KinkyDungeonShopItems[KinkyDungeonShopIndex];
		return Math.round(KinkyDungeonItemCost(item) * (1 + 0.01 * KinkyDungeonDifficulty));
	} else if (KinkyDungeonShrineTypeRemove.includes(type)) {
		let rest = KinkyDungeonGetRestraintsWithShrine(type);
		let maxPower = 1;
		for (let r of rest) {
			if (KDRestraint(r).power > maxPower) maxPower = KDRestraint(r).power;
		}
		mult = Math.sqrt(Math.max(1, Math.min(KDShrineRemoveCount, rest.length)));
		mult *= Math.pow(Math.max(1, maxPower), 0.75);
		noMult = true;
	} else if (type == "Will") {
		let value = 0;
		value += 100 * (1 - KinkyDungeonStatStamina/KinkyDungeonStatStaminaMax);
		value += 100 * (1 - KinkyDungeonStatMana/KinkyDungeonStatManaMax);
		return Math.round(Math.round(value/10)*10 * (1 + 0.01 * KinkyDungeonDifficulty));
	}
	if (KinkyDungeonShrineBaseCostGrowth[type]) growth = KinkyDungeonShrineBaseCostGrowth[type];
	if (KinkyDungeonShrineCosts[type] > 0 && !noMult) mult = Math.pow(growth, KinkyDungeonShrineCosts[type]);

	if (type == "Conjure" || type == "Illusion" || type == "Elements")
		return 100 * (1 + 0.01 * KinkyDungeonDifficulty);

	return Math.round(Math.round(KinkyDungeonShrineBaseCosts[type] * mult/10)*10 * (1 + 0.01 * KinkyDungeonDifficulty));
}

function KDAddBasic(item) {
	if (item.name == "RedKey") {
		KinkyDungeonRedKeys += 1;
	} else if (item.name == "BlueKey") {
		KinkyDungeonBlueKeys += 1;
	} else if (item.name == "Lockpick") {
		KinkyDungeonLockpicks += 1;
	} else if (item.name == "2Lockpick") {
		KinkyDungeonLockpicks += 2;
	} else if (item.name == "4Lockpick") {
		KinkyDungeonLockpicks += 4;
	} else if (item.name == "MaidUniform") {
		KinkyDungeonInventoryAddOutfit("Maid");
	} else if (item.consumable) {
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables[item.consumable], item.quantity);
	}
}

function KinkyDungeonPayShrine(type) {
	KinkyDungeonGold -= KinkyDungeonShrineCost(type);
	let ShrineMsg = "";
	let rep = 0;

	// TODO shrine effects
	if (KinkyDungeonShrineTypeRemove.includes(type)) {
		rep = KinkyDungeonRemoveRestraintsWithShrine(type, KDShrineRemoveCount);
		KinkyDungeonChangeRep("Ghost", -rep);

		ShrineMsg = TextGet("KinkyDungeonPayShrineRemoveRestraints");
		KDSendStatus('goddess', type, 'shrineRemove');
	} else if (type == "Elements" || type == "Illusion" || type == "Conjure") {
		ShrineMsg = TextGet("KinkyDungeonPayShrineBuff").replace("SCHOOL", TextGet("KinkyDungeonSpellsSchool" + type));
		if (type == "Elements") {
			KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {id: "ShrineElements", type: "event", maxCount: 10, tags: ["offense", "shrineElements"], aura: "#f1641f", power: 1.5, duration: 9999, events: [
				{trigger: "afterDamageEnemy", type: "ShrineElements", spell: "ArcaneStrike"},
			]});
		} else if (type == "Conjure") {
			KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {id: "ShrineConjure", type: "event", maxCount: 10, tags: ["defense", "shrineConjure"], aura: "#4572e3", power: 1.5, duration: 9999, events: [
				{trigger: "beforeAttack", type: "CounterattackSpell", spell: "ArcaneStrike", requiredTag: "shrineConjure", prereq: "hit"},
			]});
			KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {id: "ShrineConjure2", type: "DamageReduction", maxCount: 10, tags: ["defense", "shrineConjure"], power: 10, duration: 9999});
		} else if (type == "Illusion") {
			KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {id: "ShrineIllusion", type: "event", maxCount: 10, tags: ["defense", "shrineIllusion"], aura: "#9052bc", power: 1.5, duration: 9999, events: [
				{trigger: "playerAttack", type: "ShadowStep", time: 6, requiredTag: "shrineIllusion"},
			]});
		}
		KDSendStatus('goddess', type, 'shrineDonate');
		rep = 1;
	} else if (type == "Will") {
		rep = Math.ceil(5 - KinkyDungeonStatMana * 2.5 / KinkyDungeonStatManaMax - KinkyDungeonStatStamina * 2.5 / KinkyDungeonStatStaminaMax);
		KinkyDungeonStatStamina = KinkyDungeonStatStaminaMax;
		KinkyDungeonStatMana = KinkyDungeonStatManaMax;
		KinkyDungeonStatDistraction = 0;
		KinkyDungeonStatDistractionLower = 0;
		KinkyDungeonChangeStamina(0);
		KinkyDungeonChangeMana(0);
		KinkyDungeonChangeDistraction(0);
		KinkyDungeonNextDataSendStatsTime = 0;

		ShrineMsg = TextGet("KinkyDungeonPayShrineHeal");
		KDSendStatus('goddess', type, 'shrineHeal');
	} else if (type == "Commerce") {
		let item = KinkyDungeonShopItems[KinkyDungeonShopIndex];
		if (item) {
			if (item.shoptype == "Consumable")
				KinkyDungeonChangeConsumable(KinkyDungeonConsumables[item.name], 1);
			else if (item.shoptype == "Weapon")
				KinkyDungeonInventoryAddWeapon(item.name);
			else if (item.shoptype == "Restraint") {
				let restraint = KinkyDungeonGetRestraintByName(item.name);
				KinkyDungeonInventoryAdd({name: item.name, type: LooseRestraint, events:restraint.events});
			}
			else if (item.shoptype == "Basic") {
				KDAddBasic(item);
			}
			ShrineMsg = TextGet("KinkyDungeonPayShrineCommerce").replace("ItemBought", TextGet("KinkyDungeonInventoryItem" + item.name));
			KinkyDungeonShopItems.splice(KinkyDungeonShopIndex, 1);
			if (KinkyDungeonShopIndex > 0) KinkyDungeonShopIndex -= 1;

			rep = item.rarity + 1;
			KDSendStatus('goddess', type, 'shrineBuy');
		}
	}

	if (ShrineMsg) KinkyDungeonSendActionMessage(10, ShrineMsg, "lightblue", 1);

	if (KinkyDungeonShrineCosts[type] > 0) KinkyDungeonShrineCosts[type] = KinkyDungeonShrineCosts[type] + 1;
	else KinkyDungeonShrineCosts[type] = 1;

	if (rep != 0) {
		KinkyDungeonChangeRep(type, rep);
	}
}

function KinkyDungeonHandleShrine() {
	let cost = 0;
	let type = KinkyDungeonTargetTile.Name;

	if (KinkyDungeonShrineAvailable(type)) cost = KinkyDungeonShrineCost(type);

	if (type == "Commerce") {
		if (cost > 0) {
			if (MouseIn(KDModalArea_x + 410, KDModalArea_y + 25, 112-15, 60) && cost <= KinkyDungeonGold) {
				KDSendInput("shrineBuy", {type: type, shopIndex: KinkyDungeonShopIndex});
				return true;
			}
			else if (MouseIn(KDModalArea_x + 613, KDModalArea_y + 25, 112, 60)) {
				KinkyDungeonShopIndex = (KinkyDungeonShopIndex + 1) % KinkyDungeonShopItems.length;

				return true;
			}

		}
	} else {
		if (cost > 0 && MouseIn(KDModalArea_x, KDModalArea_y + 25, 325, 60)) {
			KDSendInput("shrineUse", {type: type, cost: cost, targetTile: KinkyDungeonTargetTileLocation});
			KinkyDungeonTargetTileLocation = "";
			KinkyDungeonTargetTile = null;
			return true;
		} else if (KDGameData.PoolUses <= 1 / KinkyDungeonShrinePoolChancePerUse && (KinkyDungeonStatMana < KinkyDungeonStatManaMax || KinkyDungeonPlayerTags.get("slime")) && ((cost == 0 && MouseIn(KDModalArea_x, KDModalArea_y + 25, 375, 60)) || MouseIn(KDModalArea_x + 350, KDModalArea_y + 25, 100, 60))) {
			KDSendInput("shrineDrink", {type: type, targetTile: KinkyDungeonTargetTileLocation});
			return true;
		}
	}
	return false;
}

function KinkyDungeonDrawShrine() {
	let cost = 0;
	let type = KinkyDungeonTargetTile.Name;
	KDModalArea = true;

	if (KinkyDungeonShrineAvailable(type)) cost = KinkyDungeonShrineCost(type);

	if (type == "Commerce") {
		if (cost == 0) {
			DrawText(TextGet("KinkyDungeonLockedShrine"), KDModalArea_x, KDModalArea_y, "white", "silver");
		} else {
			DrawRect(KDModalArea_x - 25, KDModalArea_y + 80 - KinkyDungeonShopItems.length * 50, 800, KinkyDungeonShopItems.length * 50 + 20, "#00000088");
			// Wrap around shop index to prevent errors
			if (KinkyDungeonShopIndex > KinkyDungeonShopItems.length) {
				KinkyDungeonShopIndex = 0;
			} else if (KinkyDungeonShopItems.length > 0 && KinkyDungeonShopItems[KinkyDungeonShopIndex]) {
				// Draw the item and cost
				//DrawTextFit(TextGet("KinkyDungeonInventoryItem" + KinkyDungeonShopItems[KinkyDungeonShopIndex].name), KDModalArea_x + 175/2, KDModalArea_y + 20, 175, "white", "silver");
				//DrawTextFit(TextGet("KinkyDungeonCommerceCost").replace("ItemCost", "" + cost), KDModalArea_x + 175/2, KDModalArea_y + 65, 130, "white", "silver");
			}

			DrawButton(KDModalArea_x + 410, KDModalArea_y + 25, 112-15, 60, TextGet("KinkyDungeonCommercePurchase").replace("ItemCost", "" + cost), (cost <= KinkyDungeonGold) ? "White" : "Pink", "", "");
			/*if (MouseIn(KDModalArea_x + 410, KDModalArea_y + 25, 112-15, 60) && KinkyDungeonShopItems.length > 0 && KinkyDungeonShopItems[KinkyDungeonShopIndex]) {
				// Draw the shop tooltip
				DrawTextFit(TextGet("KinkyDungeonInventoryItem" + KinkyDungeonShopItems[KinkyDungeonShopIndex].name + "Desc"), MouseX+1, 1+KDModalArea_y - 100, 1000, "black");
				DrawTextFit(TextGet("KinkyDungeonInventoryItem" + KinkyDungeonShopItems[KinkyDungeonShopIndex].name + "Desc"), MouseX, KDModalArea_y - 100, 1000, "white");
				DrawTextFit(TextGet("KinkyDungeonInventoryItem" + KinkyDungeonShopItems[KinkyDungeonShopIndex].name + "Desc2"), MouseX+1, 1+KDModalArea_y - 50, 1000, "black");
				DrawTextFit(TextGet("KinkyDungeonInventoryItem" + KinkyDungeonShopItems[KinkyDungeonShopIndex].name + "Desc2"), MouseX, KDModalArea_y - 50, 1000, "white");
				DrawTextFit(TextGet("KinkyDungeonInventoryItem" + KinkyDungeonShopItems[KinkyDungeonShopIndex].name), KDModalArea_x + 175/2, KDModalArea_y + 20, 175, "white", "silver");
				DrawTextFit(TextGet("KinkyDungeonCommerceCost").replace("ItemCost", "" + cost), KDModalArea_x + 175/2, KDModalArea_y + 65, 130, "white", "silver");
			} else {*/
			// Draw the list of shop items
			let ii = 0;
			for (let l of KinkyDungeonShopItems) {
				DrawTextFit(TextGet("KinkyDungeonInventoryItem" + l.name), KDModalArea_x + 175/2 + 1, KDModalArea_y + 65 - ii * 50 + 1, 175, "black", "black");
				DrawTextFit(TextGet("KinkyDungeonInventoryItem" + l.name), KDModalArea_x + 175/2, KDModalArea_y + 65 - ii * 50, 175, KinkyDungeonShopItems[KinkyDungeonShopIndex].name == l.name ? "white" : "#aaaaaa", "silver");
				DrawTextFit(TextGet("KinkyDungeonCommerceCost").replace("ItemCost", "" + KinkyDungeonItemCost(l)), KDModalArea_x + 300, KDModalArea_y + 65 - ii * 50, 100, KinkyDungeonShopItems[KinkyDungeonShopIndex].name == l.name ? "white" : "#aaaaaa", "silver");
				ii++;
			}
			let wrapAmount = TranslationLanguage == 'CN' ? 15 : 40;
			let textSplit = KinkyDungeonWordWrap(TextGet("KinkyDungeonInventoryItem" + KinkyDungeonShopItems[KinkyDungeonShopIndex].name + "Desc"), wrapAmount).split('\n');
			let textSplit2 = KinkyDungeonWordWrap(TextGet("KinkyDungeonInventoryItem" + KinkyDungeonShopItems[KinkyDungeonShopIndex].name +  "Desc2"), wrapAmount).split('\n');
			let i = 0;
			for (let N = 0; N < textSplit.length; N++) {
				DrawTextFit(textSplit[N],
					KDModalArea_x+565, KDModalArea_y + 120 - KinkyDungeonShopItems.length * 50 + i * 50, 380 * (textSplit[N].length / 40), "white");
				i++;
			}
			i += 1;
			for (let N = 0; N < textSplit2.length; N++) {
				DrawTextFit(textSplit2[N],
					KDModalArea_x+565, KDModalArea_y + 120 - KinkyDungeonShopItems.length * 50 + i * 50, 380 * (textSplit2[N].length / 40), "white");
				i++;
			}
			//DrawTextFit(TextGet("KinkyDungeonInventoryItem" + KinkyDungeonShopItems[KinkyDungeonShopIndex].name + "Desc"), KDModalArea_x+565+1, 1+KDModalArea_y - 200, 380, "black");
			//DrawTextFit(TextGet("KinkyDungeonInventoryItem" + KinkyDungeonShopItems[KinkyDungeonShopIndex].name + "Desc"), KDModalArea_x+565, KDModalArea_y - 200, 380, "white");
			//DrawTextFit(TextGet("KinkyDungeonInventoryItem" + KinkyDungeonShopItems[KinkyDungeonShopIndex].name + "Desc2"), KDModalArea_x+565+1, 1+KDModalArea_y - 120, 380, "black");
			//DrawTextFit(TextGet("KinkyDungeonInventoryItem" + KinkyDungeonShopItems[KinkyDungeonShopIndex].name + "Desc2"), KDModalArea_x+565, KDModalArea_y - 120, 380, "white");
			//}
			// Next button
			DrawButton(KDModalArea_x + 613, KDModalArea_y + 25, 112, 60, TextGet("KinkyDungeonCommerceNext"), "White", "", "");
		}
	} else {
		if (cost == 0) {
			DrawButton(KDModalArea_x, KDModalArea_y + 25, 375, 60, TextGet("KinkyDungeonDrinkShrine"), (KDGameData.PoolUses <= 1 / KinkyDungeonShrinePoolChancePerUse && (KinkyDungeonStatMana < KinkyDungeonStatManaMax || KinkyDungeonPlayerTags.get("slime"))) ? "#AAFFFF" : "#444444", "", "");
		} else {
			DrawButton(KDModalArea_x, KDModalArea_y + 25, 325, 60, TextGet("KinkyDungeonPayShrine").replace("XXX", "" + cost), "White", "", "");
			DrawButton(KDModalArea_x + 350, KDModalArea_y + 25, 100, 60, TextGet("KinkyDungeonDrinkShrine"), (KDGameData.PoolUses <= 1 / KinkyDungeonShrinePoolChancePerUse && KinkyDungeonStatMana < KinkyDungeonStatManaMax || KinkyDungeonPlayerTags.get("slime")) ? "#AAFFFF" : "#444444", "", "");
		}
	}
}

function KinkyDungeonShrineAngerGods(Type) {
	if (Type == "Elements") {
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapGag"), 0, true, KinkyDungeonGenerateLock(true));

		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("ChainArms"), 2, true, KinkyDungeonGenerateLock(true));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("ChainLegs"), 0, true, KinkyDungeonGenerateLock(true));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapVibe"), 0, true);
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("ChainCrotch"), 0, true, KinkyDungeonGenerateLock(true));

	} else if (Type == "Latex") {
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapGag"), 0, true, KinkyDungeonGenerateLock(true));

		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("LatexStraitjacket"), 0, true, KinkyDungeonGenerateLock(true));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("LatexLegbinder"), 0, true, KinkyDungeonGenerateLock(true));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("LatexBoots"), 0, true, KinkyDungeonGenerateLock(true));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("LatexCorset"), 0, true, KinkyDungeonGenerateLock(true));

		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapVibe"), 0, true);
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("ChainCrotch"), 0, true, KinkyDungeonGenerateLock(true));

	} else if (Type == "Conjure" || Type == "Rope") {
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapGag"), 0, true, KinkyDungeonGenerateLock(true));

		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("StrongMagicRopeArms"), 4, true);
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("StrongMagicRopeLegs"), 0, true);
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("StrongMagicRopeCrotch"), 2, true);
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapVibe"), 0, true);
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("StrongMagicRopeFeet"), 0, true);


	} else if (Type == "Illusion") {
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapGag"), 0, true, KinkyDungeonGenerateLock(true));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapBlindfold"), 0, true, KinkyDungeonGenerateLock(true));

		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapMittens"), 0, true, KinkyDungeonGenerateLock(true));

		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapVibe"), 0, true);
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapBelt"), 0, true, KinkyDungeonGenerateLock(true));
	} else if (Type == "Leather") {
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapHarness"), 4, true, KinkyDungeonGenerateLock(true));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapGag"), 0, true, KinkyDungeonGenerateLock(true));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapBlindfold"), 0, true, KinkyDungeonGenerateLock(true));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapBoots"), 0, true, KinkyDungeonGenerateLock(true));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("SturdyLeatherBeltsFeet"), 0, true, KinkyDungeonGenerateLock(true));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("SturdyLeatherBeltsLegs"), 0, true, KinkyDungeonGenerateLock(true));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapArmbinder"), 4, true, KinkyDungeonGenerateLock(true));
	} else if (Type == "Metal") {
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapGag"), 0, true, KinkyDungeonGenerateLock(true));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("WristShackles"), 0, true, KinkyDungeonGenerateLock(true));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("AnkleShackles"), 0, true, KinkyDungeonGenerateLock(true));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("LegShackles"), 0, true, KinkyDungeonGenerateLock(true));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapVibe"), 0, true);
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapBelt"), 0, true, KinkyDungeonGenerateLock(true));
	} else if (Type == "Will") {
		KinkyDungeonStatMana = 0;
		KinkyDungeonStatStamina = 0;
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("GhostCollar"), 0, true);
	}
	if (KinkyDungeonGoddessRep[Type] < -45) {
		KinkyDungeonSummonEnemy(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y, "OrbGuardian", 3 + Math.floor(Math.sqrt(1 + MiniGameKinkyDungeonLevel)), 10, false, 30);
	}
	KinkyDungeonChangeRep(Type, -10);
}

function KinkyDungeonGetSetPieces(Dict) {
	let ret = [];
	for (let sh of Dict) {
		if (sh.Type) {
			ret.push(sh.Type);
		}
	}
	return ret;
}

function KinkyDungeonGetMapShrines(Dict) {
	let ret = [];
	for (let sh of Dict) {
		if (sh.Type) {
			ret.push(sh.Type);
		}
	}
	return ret;
}

function KinkyDungeonTakeOrb(Amount, X, Y) {
	KinkyDungeonSetFlag("NoDialogue", 3);
	KinkyDungeonDrawState = "Orb";
	KinkyDungeonOrbAmount = Amount;
	KDOrbX = X;
	KDOrbY = Y;
}
function KinkyDungeonDrawOrb() {

	MainCanvas.textAlign = "center";
	DrawText(TextGet("KinkyDungeonOrbIntro" + (KinkyDungeonStatsChoice.get("randomMode") ? "Kinky" : "")), 1250, 200, "white", "silver");
	DrawText(TextGet("KinkyDungeonOrbIntro2"), 1250, 250, "white", "silver");
	let i = 0;
	let maxY = 560;
	let XX = 500;
	let spacing = 60;
	let yPad = 150;
	MainCanvas.textAlign = "center";
	for (let shrine in KinkyDungeonShrineBaseCosts) {
		let value = KinkyDungeonGoddessRep[shrine];

		if (value != undefined) {
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
			DrawButton(canvasOffsetX_ui + XX, yPad + canvasOffsetY_ui + spacing * i - 27, 250, 55, TextGet("KinkyDungeonShrine" + shrine), "white");
			DrawProgressBar(canvasOffsetX_ui + 275 + XX, yPad + canvasOffsetY_ui + spacing * i - spacing/4, 200, spacing/2, 50 + value, color, "#444444");

			i++;
		}

	}

	DrawButton(canvasOffsetX_ui + 525, yPad + canvasOffsetY_ui + spacing * i, 425, 55, TextGet("KinkyDungeonSurpriseMe"), "white");

	MainCanvas.textAlign = "center";
}

let KDOrbX = 0;
let KDOrbY = 0;

function KinkyDungeonHandleOrb() {
	let Amount = KinkyDungeonOrbAmount;
	let i = 0;
	let maxY = 560;
	let XX = 500;
	let spacing = 60;
	let yPad = 150;
	for (let shrine in KinkyDungeonShrineBaseCosts) {
		let value = KinkyDungeonGoddessRep[shrine];

		if (value != undefined) {
			if (spacing * i > maxY) {
				if (XX == 0) i = 0;
				XX = 600;
			}
			if (MouseIn(canvasOffsetX_ui + XX, yPad + canvasOffsetY_ui + spacing * i - 27, 250, 55)) {
				KDSendInput("orb", {shrine: shrine, Amount: Amount, x: KDOrbX, y: KDOrbY});
				KinkyDungeonDrawState = "Game";
				return true;
			}
			i++;
		}

	}

	if (MouseIn(canvasOffsetX_ui + 525, yPad + canvasOffsetY_ui + spacing * i, 425, 55)) {
		let shrine = Object.keys(KinkyDungeonShrineBaseCosts)[Math.floor(KDRandom() * Object.keys(KinkyDungeonShrineBaseCosts).length)];
		if (KinkyDungeonMapGet(KDOrbX, KDOrbY) == 'O') {
			if (KinkyDungeonGoddessRep[shrine] < -45) {
				KinkyDungeonSummonEnemy(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y, "OrbGuardian", 3 + Math.floor(Math.sqrt(1 + MiniGameKinkyDungeonLevel)), 10, false, 30);
			}
			KinkyDungeonChangeRep(shrine, Amount * -9);
			if (KinkyDungeonStatsChoice.get("randomMode")) {
				let spell = null;
				let spellList = [];
				let maxSpellLevel = 4;
				for (let sp of KinkyDungeonSpellList.Conjure) {
					if (KinkyDungeonCheckSpellPrerequisite(sp) && sp.school == "Conjure" && !sp.secret) {
						for (let iii = 0; iii < maxSpellLevel - sp.level; iii++)
						{
							if (sp.level == 1 && KinkyDungeonStatsChoice.get("Novice"))
								spellList.push(sp);
							spellList.push(sp);
						}

					}
				}
				for (let sp of KinkyDungeonSpellList.Elements) {
					if (KinkyDungeonCheckSpellPrerequisite(sp) && sp.school == "Elements" && !sp.secret) {
						for (let iii = 0; iii < maxSpellLevel - sp.level; iii++)
						{
							if (sp.level == 1 && KinkyDungeonStatsChoice.get("Novice"))
								spellList.push(sp);
							spellList.push(sp);
						}
					}
				}
				for (let sp of KinkyDungeonSpellList.Illusion) {
					if (KinkyDungeonCheckSpellPrerequisite(sp) && sp.school == "Illusion" && !sp.secret) {
						for (let iii = 0; iii < maxSpellLevel - sp.level; iii++)
						{
							if (sp.level == 1 && KinkyDungeonStatsChoice.get("Novice"))
								spellList.push(sp);
							spellList.push(sp);
						}
					}
				}

				for (let sp of KinkyDungeonSpells) {
					for (let S = 0; S < spellList.length; S++) {
						if (sp.name == spellList[S].name) {
							spellList.splice(S, 1);
							S--;
						}
					}
				}

				spell = spellList[Math.floor(KDRandom() * spellList.length)];

				if (spell) {
					KinkyDungeonSpells.push(spell);
					KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonOrbSpell").replace("SPELL", TextGet("KinkyDungeonSpell" + spell.name)), "lightblue", 2);
				}
			} else {
				KinkyDungeonSpellPoints += Amount;
			}
			KinkyDungeonMapSet(KDOrbX, KDOrbY, 'o');
		}

		KinkyDungeonDrawState = "Game";
		return true;
	}


	return true;
}
