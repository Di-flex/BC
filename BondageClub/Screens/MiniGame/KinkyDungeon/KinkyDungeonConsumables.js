"use strict";

var KinkyDungeonConsumables = {
	"PotionMana" : {name: "PotionMana", potion: true, rarity: 0, shop: true, type: "restore", mp_instant: 12, mp_gradual: 24, duration: 24, sfx: "PotionDrink"},
	"PotionStamina" : {name: "PotionStamina", potion: true, rarity: 1, shop: true, type: "restore", sp_instant: 12, sp_gradual: 24, duration: 12, sfx: "PotionDrink"},
	"PotionFrigid" : {name: "PotionFrigid", potion: true, rarity: 1, shop: true, type: "restore", ap_instant: 0, ap_gradual: -36, duration: 6, sfx: "PotionDrink"},
	"SmokeBomb" : {name: "SmokeBomb", noHands: true, rarity: 2, costMod: -1, shop: true, type: "spell", spell: "Shroud", sfx: "FireSpell"},
	"PotionInvisibility" : {name: "PotionInvisibility", potion: true, rarity: 3, costMod: -1, shop: true, type: "spell", spell: "Invisibility", sfx: "PotionDrink"},
	"EarthRune" : {name: "EarthRune", rarity: 2, costMod: -1, shop: false, type: "spell", spell: "Earthrune", sfx: "HeavySwing"},
	"IceRune" : {name: "IceRune", rarity: 2, costMod: -1, shop: false, type: "spell", spell: "Icerune", sfx: "Freeze"},
};

var KinkyDungneonBasic = {
	"RedKey" : {name: "RedKey", rarity: 0, shop: true},
	"Lockpick" : {name: "Lockpick", rarity: 0, shop: true},
	//"4Lockpick" : {name: "4Lockpick", rarity: 1, shop: true},
	"Knife" : {name: "Knife", rarity: 0, shop: true},
};

function KinkyDungeonFindConsumable(Name) {
	for (let con of Object.values(KinkyDungeonConsumables)) {
		if (con.name == Name) return con;
	}
	return undefined;
}

function KinkyDungeonGetInventoryItem(Name, Filter = "Consumables") {
	let Filtered = KinkyDungeonFilterInventory(Filter);
	for (let I = 0; I < Filtered.length; I++) {
		let item = Filtered[I];
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
		for (let S = 0; S < params.ShopExclusives.length; S++) {
			Table.push(params.ShopExclusives[S]);
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
	Shopable = Object.entries(KinkyDungeonWeapons).filter(([k, v]) => (v.shop));
	for (let S = 0; S < Shopable.length; S++) {
		let s = Shopable[S][1];
		s.shoptype = "Weapon";
		Table.push(s);
	}

	for (let R = Rarity; R >= 0; R--) {
		let available = Table.filter((item) => (item.rarity == R));
		if (available.length > 0) return available[Math.floor(Math.random() * available.length)];
	}
	return null;
}



function KinkyDungeonChangeConsumable(Consumable, Quantity) {
	let consumables = KinkyDungeonFilterInventory("Consumables");
	for (let I = 0; I < consumables.length; I++) {
		let item = consumables[I];
		if (item.name == Consumable.name) {
			item.item.quantity += Quantity;
			if (item.item.quantity <= 0) {
				for (let II = 0; II < KinkyDungeonInventory.length; II++) {
					if (KinkyDungeonInventory[II].consumable && KinkyDungeonInventory[II].consumable.name == Consumable.name) {
						KinkyDungeonInventory.splice(II, 1);
						return true;
					}
				}
			}
			return true;
		}
	}

	if (Quantity >= 0) {
		KinkyDungeonInventory.push({consumable: Consumable, quantity: Quantity, events: Consumable.events});
	}

	return false;
}

function KinkyDungeonConsumableEffect(Consumable) {
	if (Consumable.type == "restore") {
		if (Consumable.mp_instant) KinkyDungeonChangeMana(Consumable.mp_instant);
		if (Consumable.sp_instant) KinkyDungeonChangeStamina(Consumable.sp_instant);
		if (Consumable.ap_instant) KinkyDungeonChangeArousal(Consumable.ap_instant);

		if (Consumable.mp_gradual) KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {name: "PotionMana", type: "restore_mp", power: Consumable.mp_gradual/Consumable.duration, duration: Consumable.duration});
		if (Consumable.sp_gradual) KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {name: "PotionStamina", type: "restore_sp", power: Consumable.sp_gradual/Consumable.duration, duration: Consumable.duration});
		if (Consumable.ap_gradual) KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {name: "PotionFrigid", type: "restore_ap", power: Consumable.ap_gradual/Consumable.duration, duration: Consumable.duration});
	} else if (Consumable.type == "spell") {
		KinkyDungeonCastSpell(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y, KinkyDungeonFindSpell(Consumable.spell, true), undefined, undefined, undefined);
	}
}

function KinkyDungeonAttemptConsumable(Name, Quantity) {
	let item = KinkyDungeonGetInventoryItem(Name, "Consumables");
	if (!item) return false;

	let needMouth = item.item && item.item.consumable && item.item.consumable.potion;
	let needArms = !(item.item && item.item.consumable && item.item.consumable.noHands);
	let strictness = KinkyDungeonStrictness(false);
	let maxStrictness = (item.item && item.item.consumable && item.item.consumable.maxStrictness) ? item.item.consumable.maxStrictness : 1000;

	if (needMouth && !KinkyDungeonPlayer.CanTalk()) {
		KinkyDungeonSendActionMessage(7, TextGet("KinkyDungeonPotionGagged"), "red", 2);

		if (KinkyDungeonTextMessageTime > 0)
			KinkyDungeonDrawState = "Game";

		return false;
	}
	if (needArms && !KinkyDungeonPlayer.CanInteract() && (KinkyDungeonIsHandsBound())) {
		KinkyDungeonAdvanceTime(1);
		KinkyDungeonSendActionMessage(7, TextGet("KinkyDungeonCantUsePotions"), "red", 2);

		if (KinkyDungeonTextMessageTime > 0)
			KinkyDungeonDrawState = "Game";

		return false;
	}

	if (strictness >= maxStrictness) {
		KinkyDungeonAdvanceTime(1);
		KinkyDungeonSendActionMessage(7, TextGet("KinkyDungeonCantUsePotionsStrict"), "red", 2);

		if (KinkyDungeonTextMessageTime > 0)
			KinkyDungeonDrawState = "Game";
		return false;
	}
	/*if (item && item.item && item.item.consumable && !item.item.consumable.noHands && (!item.item.consumable.potion || item.item.consumable.needHands) && !KinkyDungeonPlayer.CanInteract() && (InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemHands"), "Block", true) || InventoryGroupIsBlockedForCharacter(KinkyDungeonPlayer, "ItemHands"))) {
		KinkyDungeonAdvanceTime(1);
		KinkyDungeonSendActionMessage(7, TextGet("KinkyDungeonCantUsePotions"), "red", 2);

		return true;
	}*/

	KinkyDungeonUseConsumable(Name, Quantity);
	return true;
}

function KinkyDungeonUseConsumable(Name, Quantity) {
	let item = KinkyDungeonGetInventoryItem(Name, "Consumables");
	if (!item || item.item.quantity < Quantity) return false;

	for (let I = 0; I < Quantity; I++) {
		KinkyDungeonConsumableEffect(item.item.consumable);
	}
	KinkyDungeonChangeConsumable(item.item.consumable, -Quantity);

	KinkyDungeonSendActionMessage(9, TextGet("KinkyDungeonInventoryItem" + Name + "Use"), "#88FF88", 1);
	if (item.item.consumable.sfx) {
		if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/" + item.item.consumable.sfx + ".ogg");
	}
	return true;
}