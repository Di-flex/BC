"use strict";

function KinkyDungeonFindConsumable(Name) {
	for (let con of Object.values(KinkyDungeonConsumables)) {
		if (con.name == Name) return con;
	}
	return undefined;
}

function KinkyDungeonGetInventoryItem(Name, Filter = Consumable) {
	let Filtered = KinkyDungeonFilterInventory(Filter);
	for (let item of Filtered) {
		if (item.name == Name) return item;
	}
	return null;
}

function KinkyDungeonItemCount(Name) {
	let item = KinkyDungeonGetInventoryItem(Name);
	if (item && item.item && item.item.quantity) {
		return item.item.quantity;
	}
	return 0;
}

function KinkyDungeonGetShopItem(Level, Rarity, Shop) {
	let Table = [];
	let params = KinkyDungeonMapParams[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]];
	if (params.ShopExclusives) {
		for (let exc of params.ShopExclusives) {
			Table.push(exc);
		}
	}
	let Shopable = Object.entries(KinkyDungeonConsumables).filter(([k, v]) => (v.shop));
	for (let S = 0; S < Shopable.length; S++) {
		let s = Shopable[S][1];
		s.shoptype = "Consumable";
		Table.push(s);
	}
	// @ts-ignore
	Shopable = Object.entries(KinkyDungneonBasic).filter(([k, v]) => (v.shop));
	for (let S = 0; S < Shopable.length; S++) {
		let s = Shopable[S][1];
		s.shoptype = "Basic";
		Table.push(s);
	}
	// @ts-ignore
	Shopable = Object.entries(KinkyDungneonShopRestraints).filter(([k, v]) => (v.shop));
	for (let S = 0; S < Shopable.length; S++) {
		let s = Shopable[S][1];
		s.shoptype = "Restraint";
		if (!KinkyDungeonInventoryGet(s.name))
			Table.push(s);
	}
	// @ts-ignore
	Shopable = Object.entries(KinkyDungeonWeapons).filter(([k, v]) => (v.shop));
	for (let S = 0; S < Shopable.length; S++) {
		let s = Shopable[S][1];
		s.shoptype = "Weapon";
		if (!KinkyDungeonInventoryGet(s.name))
			Table.push(s);
	}

	// No duplicates
	for (let R = Rarity; R >= 0; R--) {
		let available = Table.filter((item) => (item.rarity == R && !KinkyDungeonShopItems.some((item2) => {return item2.name == item.name;})));
		if (available.length > 0) return available[Math.floor(KDRandom() * available.length)];
	}
	return null;
}



function KinkyDungeonChangeConsumable(Consumable, Quantity) {
	let item = KinkyDungeonInventoryGetConsumable(Consumable.name);
	if (item) {
		item.quantity += Quantity;
		if (item.quantity <= 0) {
			KinkyDungeonInventoryRemove(item);
		}
		return true;
	}

	if (Quantity >= 0) {
		KinkyDungeonInventoryAdd({consumable: Consumable, quantity: Quantity, events: Consumable.events});
	}

	return false;
}

function KinkyDungeonConsumableEffect(Consumable) {
	if (Consumable.type == "restore") {
		let multi = 1.0;
		if (Consumable.scaleWithMaxSP) {
			multi = Math.max(KinkyDungeonStatStaminaMax / 36);
		}
		let Manamulti = 1.0;
		if (Consumable.scaleWithMaxMP) {
			Manamulti = Math.max(KinkyDungeonStatManaMax / 36);
		}
		let gagMult = Math.max(0, 1 - Math.max(0, KinkyDungeonGagTotal(true)));
		if (gagMult < 0.999) {
			KinkyDungeonSendTextMessage(8, TextGet("KinkyDungeonConsumableLessEffective"), "red", 2);
		}
		if (Consumable.mp_instant) KinkyDungeonChangeMana(Consumable.mp_instant * gagMult);
		if (Consumable.sp_instant) KinkyDungeonChangeStamina(Consumable.sp_instant * multi * gagMult);
		if (Consumable.ap_instant) KinkyDungeonChangeArousal(Consumable.ap_instant * gagMult);

		KinkyDungeonCalculateMiscastChance();

		if (Consumable.mp_gradual) KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {name: "PotionMana", type: "restore_mp", power: Consumable.mp_gradual/Consumable.duration * gagMult * Manamulti, duration: Consumable.duration});
		if (Consumable.sp_gradual) KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {name: "PotionStamina", type: "restore_sp", power: Consumable.sp_gradual/Consumable.duration * gagMult * multi, duration: Consumable.duration});
		if (Consumable.ap_gradual) KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {name: "PotionFrigid", type: "restore_ap", power: Consumable.ap_gradual/Consumable.duration * gagMult, duration: Consumable.duration});
	} else if (Consumable.type == "spell") {
		KinkyDungeonCastSpell(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y, KinkyDungeonFindSpell(Consumable.spell, true), undefined, undefined, undefined);
		KinkyDungeonAdvanceTime(1);
	} else if (Consumable.type == "targetspell") {
		KinkyDungeonTargetingSpell = KinkyDungeonFindSpell(Consumable.spell, true);
		KinkyDungeonTargetingSpellItem = Consumable;
	} else if (Consumable.type == "charge") {
		KDGameData.AncientEnergyLevel = Math.min(Math.max(0, KDGameData.AncientEnergyLevel + Consumable.amount), 1.0);
		if (!KinkyDungeonStatsChoice.get("LostTechnology"))
			KinkyDungeonChangeConsumable(KinkyDungeonConsumables.AncientPowerSourceSpent, 1);
	} else if (Consumable.type == "buff") {
		KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {name: Consumable.name, type: Consumable.buff, power: Consumable.power, duration: Consumable.duration, aura: Consumable.aura});
	} else if (Consumable.type == "recharge") {
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.AncientPowerSource, 1);
		KinkyDungeonAddGold(-Consumable.rechargeCost);
		KinkyDungeonAdvanceTime(1);
	} else if (Consumable.type == "shrineRemove") {
		KinkyDungeonRemoveRestraintsWithShrine(Consumable.shrine);
		KinkyDungeonAdvanceTime(1);
	}
}

function KinkyDungeonPotionCollar() {
	let minCost = 0;
	for (let r of KinkyDungeonAllRestraint()) {
		if (r.restraint.potionAncientCost && (r.restraint.potionAncientCost < minCost || minCost == 0)) minCost = r.restraint.potionAncientCost;
	}
	return minCost;
}

function KinkyDungeonCanDrink() {
	for (let inv of KinkyDungeonAllRestraint()) {
		if (inv.restraint && inv.restraint.allowPotions) return true;
	}
	return KinkyDungeonCanTalk(true);
}

function KinkyDungeonAttemptConsumable(Name, Quantity) {
	if (KDGameData.SleepTurns > 0 || KinkyDungeonSlowMoveTurns > 0) return false;
	let item = KinkyDungeonGetInventoryItem(Name, Consumable);
	if (!item) return false;
	if (item.item && item.item.consumable && item.item.consumable.type == "unusuable") {
		KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonUnusable"), "red", 1);
		return false;
	}
	if (item.item && item.item.consumable && item.item.consumable.type == "charge" && KDGameData.AncientEnergyLevel >= 1) {
		KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonFullpower"), "red", 1);
		return false;
	}
	if (item.item && item.item.consumable && item.item.consumable.type == "recharge" && KinkyDungeonGold < item.item.consumable.rechargeCost) {
		KinkyDungeonSendActionMessage(8, TextGet("KinkyDungeonInventoryItemAncientPowerSourceSpentUseFail"), "red", 1);
		return false;
	}

	if (item.item && item.item.consumable && item.item.consumable.type == "shrineRemove" && KinkyDungeonGetRestraintsWithShrine(item.item.consumable.shrine).length < 1) {
		KinkyDungeonSendActionMessage(8, TextGet("KinkyDungeonNoItemToRemove"), "pink", 1);
		return false;
	}

	let needMouth = item.item && item.item.consumable && (item.item.consumable.potion || item.item.consumable.needMouth);
	let needArms = !(item.item && item.item.consumable && item.item.consumable.noHands);
	let strictness = KinkyDungeonStrictness(false);
	let maxStrictness = (item.item && item.item.consumable && item.item.consumable.maxStrictness) ? item.item.consumable.maxStrictness : 1000;

	if (needMouth && ((!item.item.consumable.potion && !KinkyDungeonCanTalk(true)) || (item.item.consumable.potion && !KinkyDungeonCanDrink()))) {
		let energyCost = KinkyDungeonPotionCollar();
		if (item.item.consumable.potion && energyCost && KDGameData.AncientEnergyLevel > energyCost) {
			KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - energyCost);
		} else {
			KinkyDungeonSendActionMessage(7, TextGet("KinkyDungeonPotionGagged"), "red", 1);

			if (KinkyDungeonTextMessageTime > 0)
				KinkyDungeonDrawState = "Game";

			return false;
		}
	}
	if (!KinkyDungeonHasGhostHelp() && needArms && !(item.item && item.item.consumable.potion && !KinkyDungeonIsArmsBound()) && KinkyDungeonIsHandsBound()) {
		let energyCost = KinkyDungeonPotionCollar();
		if (item.item.consumable.potion && energyCost && KDGameData.AncientEnergyLevel > energyCost) {
			KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - energyCost);
		} else {
			//KinkyDungeonAdvanceTime(1);
			KinkyDungeonSendActionMessage(7, TextGet("KinkyDungeonCantUsePotions"), "red", 1);

			if (KinkyDungeonTextMessageTime > 0)
				KinkyDungeonDrawState = "Game";

			return false;
		}
	}

	if (strictness >= maxStrictness) {
		//KinkyDungeonAdvanceTime(1);
		KinkyDungeonSendActionMessage(7, TextGet("KinkyDungeonCantUsePotionsStrict"), "red", 1);

		if (KinkyDungeonTextMessageTime > 0)
			KinkyDungeonDrawState = "Game";
		return false;
	}

	KinkyDungeonUseConsumable(Name, Quantity);
	return true;
}

function KinkyDungeonUseConsumable(Name, Quantity) {
	let item = KinkyDungeonGetInventoryItem(Name, Consumable);
	if (!item || item.item.quantity < Quantity) return false;

	for (let I = 0; I < Quantity; I++) {
		KinkyDungeonConsumableEffect(item.item.consumable);
	}
	if (!item.item.consumable.noConsumeOnUse)
		KinkyDungeonChangeConsumable(item.item.consumable, -(item.item.consumable.useQuantity ? item.item.consumable.useQuantity : 1) * Quantity);

	KinkyDungeonSendActionMessage(9, TextGet("KinkyDungeonInventoryItem" + Name + "Use"), "#88FF88", 1);
	if (item.item.consumable.sfx) {
		if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/" + item.item.consumable.sfx + ".ogg");
	}
	return true;
}