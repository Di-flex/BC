"use strict";


var KinkyDungeonFilters = [
	Consumable,
	Restraint,
	Weapon,
	Outfit,
	LooseRestraint,
	Misc,
];

var KinkyDungeonCurrentFilter = KinkyDungeonFilters[0];
var KinkyDungeonCurrentPageInventory = 0;

let KinkyDungeonShowInventory = false;
let KinkyDungeonInventoryOffset = 0;

function KinkyDungeonHandleInventory() {
	let filteredInventory = KinkyDungeonFilterInventory(KinkyDungeonCurrentFilter);

	if (KinkyDungeonCurrentPageInventory > 0 && MouseIn(canvasOffsetX_ui + 100, canvasOffsetY_ui + 483*KinkyDungeonBookScale, 250, 60)) {
		KinkyDungeonCurrentPageInventory -= 1;
		return true;
	}
	if (KinkyDungeonCurrentPageInventory < filteredInventory.length-1 && MouseIn(canvasOffsetX_ui + 640*KinkyDungeonBookScale - 325, canvasOffsetY_ui + 483*KinkyDungeonBookScale, 250, 60)) {
		KinkyDungeonCurrentPageInventory += 1;
		return true;
	}

	for (let I = 0; I < KinkyDungeonFilters.length; I++)
		if (KinkyDungeonFilterInventory(KinkyDungeonFilters[I]).length > 0 || I == 1)
			if (MouseIn(canvasOffsetX_ui + 640*KinkyDungeonBookScale - 20, canvasOffsetY_ui + 115 + I*65, 225, 60)) {
				KinkyDungeonCurrentFilter = KinkyDungeonFilters[I];
				KinkyDungeonCurrentPageInventory = 0;
				return true;
			}

	if (filteredInventory.length > 0) {
		if (MouseIn(canvasOffsetX_ui + 640*KinkyDungeonBookScale + 400, canvasOffsetY_ui, 90, 40) && KinkyDungeonInventoryOffset > 0) {
			KinkyDungeonInventoryOffset -= 2;
			return true;
		}
		if (MouseIn(canvasOffsetX_ui + 640*KinkyDungeonBookScale + 400, 480*KinkyDungeonBookScale + canvasOffsetY_ui - 15, 90, 40) && KinkyDungeonInventoryOffset + 24 < filteredInventory.length) {
			KinkyDungeonInventoryOffset += 2;
			return true;
		}

		for (let i = 0; i < 24; i++) {
			let xx = i % 2;
			let yy = Math.floor(i / 2);
			let index = i + KinkyDungeonInventoryOffset;
			if (filteredInventory[index] && filteredInventory[index].item) {
				if (MouseIn(canvasOffsetX_ui + xx * 200 + 640*KinkyDungeonBookScale + 250, canvasOffsetY_ui + 50 + 45 * yy, 195, 40)) {
					KinkyDungeonCurrentPageInventory = index;
					return true;
				}
			}
		}
	}

	if (KinkyDungeonDrawInventorySelected(filteredInventory[KinkyDungeonCurrentPageInventory])) {
		if (KinkyDungeonCurrentFilter == Consumable && MouseIn(canvasOffsetX_ui + 640*KinkyDungeonBookScale + 25, canvasOffsetY_ui + 483*KinkyDungeonBookScale, 350, 60)) {
			let item = KinkyDungeonFilterInventory(KinkyDungeonCurrentFilter)[KinkyDungeonCurrentPageInventory];
			if (!item || !item.name) return true;

			KDSendInput("consumable", {item: item.name, quantity: 1});
			//KinkyDungeonAttemptConsumable(item.name, 1);
		} else if (KinkyDungeonCurrentFilter == Weapon) {
			let weapon = ((filteredInventory[KinkyDungeonCurrentPageInventory] != null) ? filteredInventory[KinkyDungeonCurrentPageInventory].name : null);
			if (weapon && weapon != "Unarmed") {
				let equipped = weapon == KinkyDungeonPlayerWeapon;
				if (MouseIn(canvasOffsetX_ui + 640*KinkyDungeonBookScale + 25, canvasOffsetY_ui + 483*KinkyDungeonBookScale, 350, 60) && !equipped) {
					KDSendInput("switchWeapon", {weapon: weapon});
				} else if (MouseIn(canvasOffsetX_ui + 640*KinkyDungeonBookScale + 25, canvasOffsetY_ui + 483*KinkyDungeonBookScale + 70, 350, 60) && equipped) {
					KDSendInput("unequipWeapon", {weapon: weapon});
				}
			}
		} else if (KinkyDungeonCurrentFilter == Outfit && MouseIn(canvasOffsetX_ui + 640*KinkyDungeonBookScale + 25, canvasOffsetY_ui + 483*KinkyDungeonBookScale, 350, 60)) {
			let outfit = ((filteredInventory[KinkyDungeonCurrentPageInventory] != null) ? filteredInventory[KinkyDungeonCurrentPageInventory].name : null);
			let toWear = KinkyDungeonGetOutfit(outfit);
			if (toWear) {
				let dress = toWear.dress;
				if (dress == "JailUniform" && KinkyDungeonMapParams[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]])
					dress = KinkyDungeonMapParams[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]].defeat_outfit;
				KDSendInput("dress", {dress: dress, outfit: outfit});
			}
		} else if (KinkyDungeonCurrentFilter == LooseRestraint && MouseIn(canvasOffsetX_ui + 640*KinkyDungeonBookScale + 25, canvasOffsetY_ui + 483*KinkyDungeonBookScale, 350, 60)) {
			let equipped = false;
			let newItem = null;
			let currentItem = null;

			if (filteredInventory[KinkyDungeonCurrentPageInventory]
				&& filteredInventory[KinkyDungeonCurrentPageInventory].item) {
				newItem = KDRestraint(filteredInventory[KinkyDungeonCurrentPageInventory].item);
				if (newItem) {
					currentItem = KinkyDungeonGetRestraintItem(newItem.Group);
					if (!currentItem
						|| (KinkyDungeonLinkableAndStricter(KDRestraint(currentItem), newItem) &&
							((newItem.linkCategory && KDLinkCategorySize(currentItem, newItem.linkCategory) + KDLinkSize(newItem) <= 1.0)
							|| (!newItem.linkCategory && !KDDynamicLinkList(currentItem, true).some((item) => {return newItem.name == item.name;}))))) {
						equipped = false;
					} else equipped = true;
				}
			}
			if (!equipped && newItem) {
				if (KDSendInput("equip", {name: newItem.name, group: newItem.Group, currentItem: currentItem ? currentItem.name : undefined, events: Object.assign([], filteredInventory[KinkyDungeonCurrentPageInventory].item.events)})) return true;

			}
		}

	}

	return true;
}

function KinkyDungeonInventoryAddWeapon(Name) {
	if (!KinkyDungeonInventoryGetWeapon(Name) && KinkyDungeonWeapons[Name])
		KinkyDungeonInventoryAdd({name:Name, type:Weapon, events: Object.assign([], KinkyDungeonWeapons[Name].events)});
}

function KinkyDungeonInventoryAddOutfit(Name) {
	if (!KinkyDungeonInventoryGetOutfit(Name) && KinkyDungeonOutfitCache.has(Name))
		KinkyDungeonInventoryAdd({name:Name, type:Outfit});
}
/**
 *
 * @param item {item}
 * @return {string}
 */
function KDInventoryType(item) {return item.type;}

function KinkyDungeonFullInventory() {
	let ret = [];
	for (let m of KinkyDungeonInventory.values()) {
		for (let item of m.values()) {
			ret.push(item);
		}
	}
	return ret;
}

function KinkyDungeonInventoryLength() {
	let size = 0;
	for (let m of KinkyDungeonInventory.values()) {
		size += m.size;
	}
	return size;
}

/**
 *
 * @param item {item}
 */
function KinkyDungeonInventoryAdd(item) {
	let type = KDInventoryType(item);
	if (KinkyDungeonInventory.has(type)) {
		KinkyDungeonInventory.get(type).set(item.name, item);
	}
}

/**
 *
 * @param item {item}
 */
function KinkyDungeonInventoryRemove(item) {
	if (item) {
		let type = KDInventoryType(item);
		if (KinkyDungeonInventory.has(type)) {
			KinkyDungeonInventory.get(type).delete(item.name);
		}
	}
}

/**
 *
 * @param Name
 * @return {null|item}
 */
function KinkyDungeonInventoryGet(Name) {
	for (let m of KinkyDungeonInventory.values()) {
		if (m.has(Name)) return m.get(Name);
	}
	return null;
}

/**
 *
 * @param Name
 * @return {null|item}
 */
function KinkyDungeonInventoryGetLoose(Name) {
	return KinkyDungeonInventory.get(LooseRestraint).get(Name);
}

/**
 *
 * @param Name
 * @return {null|item}
 */
function KinkyDungeonInventoryGetConsumable(Name) {
	return KinkyDungeonInventory.get(Consumable).get(Name);
}

/**
 *
 * @param Name
 * @return {null|item}
 */
function KinkyDungeonInventoryGetWeapon(Name) {
	return KinkyDungeonInventory.get(Weapon).get(Name);
}

/**
 *
 * @param Name
 * @return {null|item}
 */
function KinkyDungeonInventoryGetOutfit(Name) {
	return KinkyDungeonInventory.get(Outfit).get(Name);
}

/**
 * Returns list
 * @return {item[]}
 */
function KinkyDungeonAllRestraint() {
	return KinkyDungeonInventory.get(Restraint) ? Array.from(KinkyDungeonInventory.get(Restraint).values()) : [];
}


/**
 * Returns list of tuples of restraints, including dynamics and their hosts
 * @return {{item: item, host: item}[]}
 */
function KinkyDungeonAllRestraintDynamic() {
	let ret = [];
	for (let inv of KinkyDungeonAllRestraint()) {
		ret.push({item: inv, host: null});
		if (inv.dynamicLink) {
			let link = inv.dynamicLink;
			let host = inv;
			while (link) {
				ret.push({item: link, host: host});
				link = link.dynamicLink;
			}
		}
	}
	return ret;
}

/**
 * Returns list
 * @return {item[]}
 */
function KinkyDungeonAllLooseRestraint() {
	return KinkyDungeonInventory.get(LooseRestraint) ? Array.from(KinkyDungeonInventory.get(LooseRestraint).values()) : [];
}
/**
 * Returns list
 * @return {item[]}
 */
function KinkyDungeonAllConsumable() {
	return KinkyDungeonInventory.get(Consumable) ? Array.from(KinkyDungeonInventory.get(Consumable).values()) : [];
}
/**
 * Returns list
 * @return {item[]}
 */
function KinkyDungeonAllOutfit() {
	return KinkyDungeonInventory.get(Outfit) ? Array.from(KinkyDungeonInventory.get(Outfit).values()) : [];
}
/**
 * Returns list
 * @return {item[]}
 */
function KinkyDungeonAllWeapon() {
	return KinkyDungeonInventory.get(Weapon) ? Array.from(KinkyDungeonInventory.get(Weapon).values()) : [];
}

/*for (let item of KinkyDungeonInventory.get(LooseRestraint).values()) {
	if (item.looserestraint && item.looserestraint.name == Name) return item;
}
return null;*/

function KDGetItemPreview(item) {
	let ret = null;
	let Group = "";
	if (item.type == Restraint && KDRestraint(item).Group) Group = KDRestraint(item).Group;
	else if (item.type == LooseRestraint && KDRestraint(item).Group) Group = KDRestraint(item).Group;
	if ((item.type == Restraint || item.type == LooseRestraint) && KDRestraint(item).AssetGroup) Group = KDRestraint(item).AssetGroup;
	if (Group == "ItemMouth2" || Group == "ItemMouth3") Group = "ItemMouth";

	if (item.type == Restraint){
		if (KDRestraint(item).AssetGroup) ret = {name: item.name, item: item, preview: `Assets/Female3DCG/${KDRestraint(item).AssetGroup}/Preview/${KDRestraint(item).Asset}.png`};
		else ret = {name: item.name, item: item, preview: `Assets/Female3DCG/${Group}/Preview/${KDRestraint(item).Asset}.png`};
	}
	else if (item.type == LooseRestraint){
		if (KDRestraint(item).AssetGroup) ret = {name: item.name, item: item, preview: `Assets/Female3DCG/${KDRestraint(item).AssetGroup}/Preview/${KDRestraint(item).Asset}.png`};
		else ret = {name: KDRestraint(item).name, item: item, preview: `Assets/Female3DCG/${Group}/Preview/${KDRestraint(item).Asset}.png`};
	}
	else if (item.type == Consumable) ret = {name: KDConsumable(item).name, item: item, preview: `Screens/MiniGame/KinkyDungeon/Consumables/${KDConsumable(item).name}.png`};
	else if (item.type == Weapon) ret = {name: KDWeapon(item).name, item: item, preview: `Screens/MiniGame/KinkyDungeon/Weapons/${KDWeapon(item).name}.png`};
	else if (item.type == Outfit) ret = {name: KDOutfit(item) ? KDOutfit(item).name : "Prisoner", item: item, preview: `Screens/MiniGame/KinkyDungeon/Outfits/${KDOutfit(item).name}.png`};
	//else if (item && item.name) ret.push({name: item.name, item: item, preview: ``});
	return ret;
}

function KinkyDungeonFilterInventory(Filter, enchanted) {
	let ret = [];
	let category = KinkyDungeonInventory.get(Filter);
	if (category)
		for (let item of category.values()) {
			let preview = KDGetItemPreview(item);
			if (preview && (item.type != LooseRestraint || (!enchanted || KDRestraint(item).enchanted || KDRestraint(item).showInQuickInv)))
				ret.push(preview);
			if (item.dynamicLink) {
				let link = item.dynamicLink;
				for (let I = 0; I < 30; I++) {
					preview = KDGetItemPreview(link);
					if (preview && (link.type == Restraint))
						ret.push(preview);
					if (link.dynamicLink) {
						link = link.dynamicLink;
					} else I = 1000;
				}
			}

		}

	return ret;
}

/**
 *
 * @param {{name: any, item: item, preview: string}} item
 * @param {boolean} [noscroll]
 * @returns {boolean}
 */
function KinkyDungeonDrawInventorySelected(item, noscroll) {
	if (!noscroll) {
		DrawImageZoomCanvas(KinkyDungeonRootDirectory + "MagicBook.png", MainCanvas, 0, 0, 640, 483, canvasOffsetX_ui, canvasOffsetY_ui, 640*KinkyDungeonBookScale, 483*KinkyDungeonBookScale, false);
	}
	if (!item) return false;
	let name = item.name;
	let prefix = "KinkyDungeonInventoryItem";
	if (item.item.type == Restraint || item.item.type == LooseRestraint) prefix = "Restraint";

	DrawTextFit(TextGet(prefix + name), canvasOffsetX_ui + 640*KinkyDungeonBookScale/3.35, canvasOffsetY_ui + 483*KinkyDungeonBookScale/5, 300, "black", "silver");
	let wrapAmount = TranslationLanguage == 'CN' ? 8 : 17;
	let textSplit = KinkyDungeonWordWrap(TextGet(prefix + name + "Desc"), wrapAmount).split('\n');
	let textSplit2 = KinkyDungeonWordWrap(TextGet(prefix + name + "Desc2"), wrapAmount).split('\n');


	let showpreview =  (item.preview && !MouseIn(canvasOffsetX_ui, canvasOffsetY_ui, 840, 583));


	let i = 2;
	if (showpreview) {
		DrawPreviewBox(canvasOffsetX_ui + 640*KinkyDungeonBookScale/3.35 - 100, canvasOffsetY_ui + 483*KinkyDungeonBookScale/5 + 45, item.preview, "", {Background: "#00000000"});
		if (item.item.type == Restraint || item.item.type == LooseRestraint) {
			let restraint = KDRestraint(item.item);
			DrawText(TextGet("KinkyDungeonRestraintLevel").replace("RestraintLevel", "" + Math.max(1, restraint.power)).replace("Rarity", TextGet("KinkyDungeonRarity" + Math.max(0, Math.min(Math.floor(restraint.power/3),10)))), canvasOffsetX_ui + 640*KinkyDungeonBookScale/3.35, canvasOffsetY_ui + 483*KinkyDungeonBookScale/5 + 330, "black", "silver");
			DrawText(
			restraint.escapeChance ? (item.item.lock ? (TextGet("KinkyLocked") + " " + TextGet("Kinky" + item.item.lock + "LockType")) :
				(restraint.DefaultLock ? (TextGet("KinkyLocked") + " " + TextGet("Kinky" + restraint.DefaultLock + "LockType")) : TextGet("KinkyUnlocked")))
			: (restraint.escapeChance.Pick != null ? TextGet("KinkyLockable") : TextGet("KinkyNonLockable")), canvasOffsetX_ui + 640*KinkyDungeonBookScale/3.35, canvasOffsetY_ui + 483*KinkyDungeonBookScale/5 + 370, "black", "silver");

			let goddesses = "";
			if (restraint.shrine)
				for (let shrine of restraint.shrine) {
					if (KinkyDungeonGoddessRep[shrine] != undefined) {
						if (goddesses) {
							goddesses = goddesses + ", ";
						}
						goddesses = goddesses + TextGet("KinkyDungeonShrine" + shrine);
					}
				}
			if (goddesses)
				DrawTextFit("Goddess: " + goddesses, canvasOffsetX_ui + 640*KinkyDungeonBookScale/3.35, canvasOffsetY_ui + 483*KinkyDungeonBookScale/5 + 425, 300, "black", "silver");
		} else if (item.item.type == Consumable) {
			let consumable = KDConsumable(item.item);
			DrawText(TextGet("KinkyDungeonConsumableQuantity") + item.item.quantity, canvasOffsetX_ui + 640*KinkyDungeonBookScale/3.35, canvasOffsetY_ui + 483*KinkyDungeonBookScale/5 + 330, "black", "silver");
			DrawText(TextGet("KinkyDungeonRarity") + TextGet("KinkyDungeonRarity" + consumable.rarity), canvasOffsetX_ui + 640*KinkyDungeonBookScale/3.35, canvasOffsetY_ui + 483*KinkyDungeonBookScale/5 + 370, "black", "silver");
		} else if (item.item.type == Weapon) {
			let weapon = KDWeapon(item.item);
			DrawText(TextGet("KinkyDungeonWeaponDamage") + (weapon.dmg * 10), canvasOffsetX_ui + 640*KinkyDungeonBookScale/3.35, canvasOffsetY_ui + 483*KinkyDungeonBookScale/5 + 310, "black", "silver");
			DrawText(TextGet("KinkyDungeonWeaponAccuracy") + Math.round(weapon.chance * 100) + "%", canvasOffsetX_ui + 640*KinkyDungeonBookScale/3.35, canvasOffsetY_ui + 483*KinkyDungeonBookScale/5 + 350, "black", "silver");
			let cost = -KinkyDungeonStatStaminaCostAttack;
			if (weapon.staminacost) cost = weapon.staminacost;
			DrawText(TextGet("KinkyDungeonWeaponStamina") + (-1*cost), canvasOffsetX_ui + 640*KinkyDungeonBookScale/3.35, canvasOffsetY_ui + 483*KinkyDungeonBookScale/5 + 390, "black", "silver");
		}

	} else {
		for (let N = 0; N < textSplit.length; N++) {
			DrawText(textSplit[N],
				canvasOffsetX_ui + 640*KinkyDungeonBookScale/3.35, canvasOffsetY_ui + 483*KinkyDungeonBookScale/5 + i * 40, "black", "silver"); i++;}
	}
	i = 0;
	for (let N = 0; N < textSplit2.length; N++) {
		DrawText(textSplit2[N],
			canvasOffsetX_ui + 640*KinkyDungeonBookScale*(1-1/3.35), canvasOffsetY_ui + 483*KinkyDungeonBookScale/5 + i * 40, "black", "silver"); i++;}

	i = 0;

	return true;
}



function KinkyDungeonDrawInventory() {
	KinkyDungeonDrawMessages(true);

	let filteredInventory = KinkyDungeonFilterInventory(KinkyDungeonCurrentFilter);

	if (KinkyDungeonCurrentPageInventory >= filteredInventory.length) KinkyDungeonCurrentPageInventory = 0;

	let defaultIndex = 0;
	if (KinkyDungeonFilterInventory(KinkyDungeonFilters[0]).length == 0) defaultIndex = 1;

	for (let I = 0; I < KinkyDungeonFilters.length; I++) {
		let col = "#444444";
		if (KinkyDungeonFilterInventory(KinkyDungeonFilters[I]).length > 0 || I == defaultIndex)
			col = "#888888";
		else if (KinkyDungeonFilters.indexOf(KinkyDungeonCurrentFilter) == I) KinkyDungeonCurrentFilter = KinkyDungeonFilters[defaultIndex];

		DrawButton(canvasOffsetX_ui + 640*KinkyDungeonBookScale - 20, canvasOffsetY_ui + 115 + I*65, 225, 60, TextGet("KinkyDungeonCategoryFilter" + KinkyDungeonFilters[I]), (KinkyDungeonCurrentFilter == KinkyDungeonFilters[I]) ? "White" : col, "", "");
	}


	if (filteredInventory.length > 0) {
		DrawButton(canvasOffsetX_ui + 640*KinkyDungeonBookScale + 400, canvasOffsetY_ui, 90, 40, "", KinkyDungeonInventoryOffset > 0 ? "white" : "#888888", KinkyDungeonRootDirectory + "Up.png");
		DrawButton(canvasOffsetX_ui + 640*KinkyDungeonBookScale + 400, 480*KinkyDungeonBookScale + canvasOffsetY_ui - 15, 90, 40, "", (KinkyDungeonInventoryOffset + 24 < filteredInventory.length) ? "white" : "#888888", KinkyDungeonRootDirectory + "Down.png");

		for (let i = 0; i < 24; i++) {
			let xx = i % 2;
			let yy = Math.floor(i / 2);
			let index = i + KinkyDungeonInventoryOffset;
			if (filteredInventory[index] && filteredInventory[index].item) {
				let text = "KinkyDungeonInventoryItem" + filteredInventory[index].name;
				if (filteredInventory[index].item.type == Restraint || filteredInventory[index].item.type == LooseRestraint)
					text = "Restraint" + filteredInventory[index].name;
				let suff = "";
				if (filteredInventory[index].item.quantity) {
					suff = " x" + filteredInventory[index].item.quantity;
				}
				DrawButton(canvasOffsetX_ui + xx * 200 + 640*KinkyDungeonBookScale + 250, canvasOffsetY_ui + 50 + 45 * yy, 195, 40, TextGet(text) + suff, index == KinkyDungeonCurrentPageInventory ? "white" : "#888888");
			} else {
				if (i + KinkyDungeonInventoryOffset > filteredInventory.length + 2)
					KinkyDungeonInventoryOffset = 0;
				break;
			}
		}
	}

	if (KinkyDungeonDrawInventorySelected(filteredInventory[KinkyDungeonCurrentPageInventory])) {
		if (KinkyDungeonCurrentFilter == Consumable)
			DrawButton(canvasOffsetX_ui + 640*KinkyDungeonBookScale + 25, canvasOffsetY_ui + 483*KinkyDungeonBookScale, 350, 60, TextGet("KinkyDungeonConsume"), "White", "", "");
		if (KinkyDungeonCurrentFilter == Weapon && filteredInventory[KinkyDungeonCurrentPageInventory].name != "Unarmed") {
			let equipped = filteredInventory[KinkyDungeonCurrentPageInventory] && filteredInventory[KinkyDungeonCurrentPageInventory].name == KinkyDungeonPlayerWeapon;
			DrawButton(canvasOffsetX_ui + 640*KinkyDungeonBookScale + 25, canvasOffsetY_ui + 483*KinkyDungeonBookScale, 350, 60, TextGet(equipped ? "KinkyDungeonEquipped" : "KinkyDungeonEquip"), equipped ? "grey" : "White", "", "");
			if (equipped) DrawButton(canvasOffsetX_ui + 640*KinkyDungeonBookScale + 25, canvasOffsetY_ui + 483*KinkyDungeonBookScale + 70, 350, 60, TextGet("KinkyDungeonUnEquip"), "White", "", "");
		}
		if (KinkyDungeonCurrentFilter == Outfit) {
			let outfit = ((filteredInventory[KinkyDungeonCurrentPageInventory] != null) ? filteredInventory[KinkyDungeonCurrentPageInventory].name : "");
			let toWear = KinkyDungeonGetOutfit(outfit);
			if (toWear) {
				DrawButton(canvasOffsetX_ui + 640*KinkyDungeonBookScale + 25, canvasOffsetY_ui + 483*KinkyDungeonBookScale, 350, 60, TextGet("KinkyDungeonEquip"), KDGameData.Outfit == outfit ? "grey" : "White", "", "");
			}
		}
		if (KinkyDungeonCurrentFilter == LooseRestraint) {
			let equipped = false;

			if (filteredInventory[KinkyDungeonCurrentPageInventory]
				&& filteredInventory[KinkyDungeonCurrentPageInventory].item) {
				let newItem = KDRestraint(filteredInventory[KinkyDungeonCurrentPageInventory].item);
				if (newItem) {
					let currentItem = KinkyDungeonGetRestraintItem(newItem.Group);
					if (!currentItem
						|| (KinkyDungeonLinkableAndStricter(KDRestraint(currentItem), newItem) &&
							((newItem.linkCategory && KDLinkCategorySize(currentItem, newItem.linkCategory) + KDLinkSize(newItem) <= 1.0)
							|| (!newItem.linkCategory && !KDDynamicLinkList(currentItem, true).some((item) => {return newItem.name == item.name;}))))) {
						equipped = false;
					} else equipped = true;
				}
			}
			DrawButton(canvasOffsetX_ui + 640*KinkyDungeonBookScale + 25, canvasOffsetY_ui + 483*KinkyDungeonBookScale, 350, 60, TextGet("KinkyDungeonEquip"), equipped ? "grey" : "White", "", "");
		}
	}
	if (KinkyDungeonCurrentPageInventory >= filteredInventory.length) KinkyDungeonCurrentPageInventory = Math.max(0, KinkyDungeonCurrentPageInventory - 1);

	if (KinkyDungeonCurrentPageInventory > 0) {
		DrawButton(canvasOffsetX_ui + 100, canvasOffsetY_ui + 483*KinkyDungeonBookScale, 250, 60, TextGet("KinkyDungeonBookLastPage"), "White", "", "");
	}
	if (KinkyDungeonCurrentPageInventory < filteredInventory.length-1) {
		DrawButton(canvasOffsetX_ui + 640*KinkyDungeonBookScale - 325, canvasOffsetY_ui + 483*KinkyDungeonBookScale, 250, 60, TextGet("KinkyDungeonBookNextPage"), "White", "", "");
	}

}

function KinkyDungeonSendInventoryEvent(Event, data) {
	for (let item of KinkyDungeonAllRestraint()) {
		if (item.dynamicLink)
			for (let d_item of KDDynamicLinkList(item)) {
				let oldEvents = d_item.events;
				if (oldEvents)
					for (let e of oldEvents) {
						if (e.inheritLinked && e.trigger === Event && (!e.requireEnergy || ((!e.energyCost && KDGameData.AncientEnergyLevel > 0) || (e.energyCost && KDGameData.AncientEnergyLevel > e.energyCost)))) {
							KinkyDungeonHandleInventoryEvent(Event, e, d_item, data);
						}
					}
			}
		if (item.events) {
			for (let e of item.events) {
				if (e.trigger === Event && (!e.requireEnergy || ((!e.energyCost && KDGameData.AncientEnergyLevel > 0) || (e.energyCost && KDGameData.AncientEnergyLevel > e.energyCost)))) {
					KinkyDungeonHandleInventoryEvent(Event, e, item, data);
				}
			}
		}
	}
}

let KinkyDungeonInvDraw = [];

function KinkyDungeonQuickGrid(I, Width, Height, Xcount) {
	let i = 0;
	let h = 0;
	let v = 0;
	while (i < I) {
		if (h < Xcount - 1) h++; else {
			h = 0;
			v++;
		}
		i++;
	}
	return {x: Width*h, y: Height*v};
}

let KDScrollOffset = {
	"Consumable": 0,
	"Restraint": 0,
	"Weapon": 0,
};

let KDItemsPerScreen = {
	"Consumable": 18,
	"Restraint": 18,
	"Weapon": 18,
};

let KDScrollAmount = 6;

function KinkyDungeonDrawQuickInv() {
	let H = 80;
	let V = 80;
	let fC = KinkyDungeonFilterInventory(Consumable);
	let consumables = fC.slice(KDScrollOffset.Consumable, KDScrollOffset.Consumable + KDItemsPerScreen.Consumable);
	let fW = KinkyDungeonFilterInventory(Weapon);
	let weapons = fW.slice(KDScrollOffset.Weapon, KDScrollOffset.Weapon + KDItemsPerScreen.Weapon);
	let fR = KinkyDungeonFilterInventory(LooseRestraint, true);
	let restraints = fR.slice(KDScrollOffset.Restraint, KDScrollOffset.Restraint + KDItemsPerScreen.Restraint);
	let Wheight = KinkyDungeonQuickGrid(weapons.length-1, H, V, 6).y;
	let Rheight = 480;

	KDScrollOffset.Consumable = Math.max(0, Math.min(Math.ceil((fC.length - KDItemsPerScreen.Consumable)/KDScrollAmount) * KDScrollAmount, KDScrollOffset.Consumable));
	KDScrollOffset.Restraint = Math.max(0, Math.min(Math.ceil((fR.length - KDItemsPerScreen.Consumable)/KDScrollAmount) * KDScrollAmount, KDScrollOffset.Restraint));
	KDScrollOffset.Weapon = Math.max(0, Math.min(Math.ceil((fW.length - KDItemsPerScreen.Consumable)/KDScrollAmount) * KDScrollAmount, KDScrollOffset.Weapon));

	if (fC.length > KDItemsPerScreen.Consumable) {
		DrawButton(510, 5, 90, 40, "", "white", KinkyDungeonRootDirectory + "Up.png");
		DrawButton(510, 50, 90, 40, "", "white", KinkyDungeonRootDirectory + "Down.png");
	}
	if (fW.length > KDItemsPerScreen.Weapon) {
		DrawButton(510, 705, 90, 40, "", "white", KinkyDungeonRootDirectory + "Up.png");
		DrawButton(510, 750, 90, 40, "", "white", KinkyDungeonRootDirectory + "Down.png");
	}
	if (fR.length > KDItemsPerScreen.Restraint) {
		DrawButton(510, 455, 90, 40, "", "white", KinkyDungeonRootDirectory + "Up.png");
		DrawButton(510, 500, 90, 40, "", "white", KinkyDungeonRootDirectory + "Down.png");
	}


	for (let c = 0; c < consumables.length; c++) {
		let item = consumables[c];
		if (item.preview) {
			let point = KinkyDungeonQuickGrid(c, H, V, 6);
			if (MouseIn(point.x, point.y + 30, H, V)) {
				DrawRect(point.x, point.y + 30, H, V, "white");
				/*MainCanvas.textAlign = "left";
				DrawText(TextGet("KinkyDungeonInventoryItem" + item.name), ToolTipX, point.y+1 + 30 + V/2, "black");
				DrawText(TextGet("KinkyDungeonInventoryItem" + item.name), ToolTipX, point.y + 30 + V/2, "white");

				DrawTextFit(TextGet("KinkyDungeonInventoryItem" + item.name + "Desc"), ToolTipX, point.y+1 + 30 + 50 + V/2, 1000, "black");
				DrawTextFit(TextGet("KinkyDungeonInventoryItem" + item.name + "Desc"), ToolTipX, point.y + 30 + 50 + V/2, 1000, "white");
				DrawTextFit(TextGet("KinkyDungeonInventoryItem" + item.name + "Desc2"), ToolTipX, point.y+1 + 30 + 100 + V/2, 1000, "black");
				DrawTextFit(TextGet("KinkyDungeonInventoryItem" + item.name + "Desc2"), ToolTipX, point.y + 30 + 100 + V/2, 1000, "white");
				MainCanvas.textAlign = "center";*/
				KinkyDungeonDrawInventorySelected(item);
			}
			DrawImageEx(item.preview, point.x, point.y + 30, {Width: 80, Height: 80});

			MainCanvas.textAlign = "left";
			DrawText("" + item.item.quantity, point.x+1, point.y+1 + 30, "black");
			DrawText("" + item.item.quantity, point.x, point.y + 30, "white");
			MainCanvas.textAlign = "center";
		}
	}

	for (let w = 0; w < weapons.length; w++) {
		let item = weapons[w];
		if (item.preview) {
			let point = KinkyDungeonQuickGrid(w, H, V, 6);
			if (MouseIn(point.x, 1000 - V - Wheight + point.y, H, V)) {
				DrawRect(point.x, 1000 - V - Wheight + point.y, H, V, "white");
				/*MainCanvas.textAlign = "left";
				DrawText(TextGet("KinkyDungeonInventoryItem" + item.name), ToolTipX, Math.min(800, 1000 - V - Wheight + point.y + V/2)-100+1, "black");
				DrawText(TextGet("KinkyDungeonInventoryItem" + item.name), ToolTipX, Math.min(800, 1000 - V - Wheight + point.y + V/2)-100, "white");

				DrawTextFit(TextGet("KinkyDungeonInventoryItem" + item.name + "Desc"), ToolTipX, Math.min(800, 1000 - V - Wheight + point.y + V/2)-50+1, 1000, "black");
				DrawTextFit(TextGet("KinkyDungeonInventoryItem" + item.name + "Desc"), ToolTipX, Math.min(800, 1000 - V - Wheight + point.y + V/2)-50, 1000, "white");
				DrawTextFit(TextGet("KinkyDungeonInventoryItem" + item.name + "Desc2"), ToolTipX, Math.min(800, 1000 - V - Wheight + point.y + V/2)+1, 1000, "black");
				DrawTextFit(TextGet("KinkyDungeonInventoryItem" + item.name + "Desc2"), ToolTipX, Math.min(800, 1000 - V - Wheight + point.y + V/2), 1000, "white");
				MainCanvas.textAlign = "center";*/

				KinkyDungeonDrawInventorySelected(item);
			}
			DrawImageEx(item.preview, point.x, 1000 - V - Wheight + point.y, {Width: 80, Height: 80});
		}
	}

	for (let w = 0; w < restraints.length; w++) {
		let item = restraints[w];
		if (item.preview) {
			let point = KinkyDungeonQuickGrid(w, H, V, 6);
			if (MouseIn(point.x, 1000 - V - Rheight + point.y, H, V)) {
				DrawRect(point.x, 1000 - V - Rheight + point.y, H, V, "white");
				/*MainCanvas.textAlign = "left";
				DrawText(TextGet("Restraint" + item.name), ToolTipX, Math.min(800, 1000 - V - Rheight + point.y + V/2)-100 + 1, "black");
				DrawText(TextGet("Restraint" + item.name), ToolTipX, Math.min(800, 1000 - V - Rheight + point.y + V/2)-100, "white");

				DrawTextFit(TextGet("Restraint" + item.name + "Desc"), ToolTipX, Math.min(800, 1000 - V - Rheight + point.y + V/2)-50+1, 1000, "black");
				DrawTextFit(TextGet("Restraint" + item.name + "Desc"), ToolTipX, Math.min(800, 1000 - V - Rheight + point.y + V/2)-50, 1000, "white");
				DrawTextFit(TextGet("Restraint" + item.name + "Desc2"), ToolTipX, Math.min(800, 1000 - V - Rheight + point.y + V/2)+1, 1000, "black");
				DrawTextFit(TextGet("Restraint" + item.name + "Desc2"), ToolTipX, Math.min(800, 1000 - V - Rheight + point.y + V/2), 1000, "white");
				MainCanvas.textAlign = "center";*/
				KinkyDungeonDrawInventorySelected(item);
			}
			DrawImageEx(item.preview, point.x, 1000 - V - Rheight + point.y, {Width: 80, Height: 80});
		}
	}
}

function KinkyDungeonhandleQuickInv(NoUse) {


	let H = 80;
	let V = 80;
	let fC = KinkyDungeonFilterInventory(Consumable);
	let consumables = fC.slice(KDScrollOffset.Consumable, KDScrollOffset.Consumable + KDItemsPerScreen.Consumable);
	let fW = KinkyDungeonFilterInventory(Weapon);
	let weapons = fW.slice(KDScrollOffset.Weapon, KDScrollOffset.Weapon + KDItemsPerScreen.Weapon);
	let fR = KinkyDungeonFilterInventory(LooseRestraint, true);
	let restraints = fR.slice(KDScrollOffset.Restraint, KDScrollOffset.Restraint + KDItemsPerScreen.Restraint);
	let Wheight = KinkyDungeonQuickGrid(weapons.length-1, H, V, 6).y;
	let Rheight = 480;

	if (fC.length > KDItemsPerScreen.Consumable) {
		if (MouseIn(510, 5, 90, 40)) {
			KDScrollOffset.Consumable = Math.min(Math.ceil((fC.length - KDItemsPerScreen.Consumable)/KDScrollAmount) * KDScrollAmount, KDScrollOffset.Consumable + KDScrollAmount);
			return true;
		}
		if (MouseIn(510, 50, 90, 40)) {
			KDScrollOffset.Consumable = Math.max(0, KDScrollOffset.Consumable - KDScrollAmount);
			return true;
		}
	}
	if (fW.length > KDItemsPerScreen.Weapon) {
		if (MouseIn(510, 705, 90, 40)) {
			KDScrollOffset.Weapon = Math.min(Math.ceil((fW.length - KDItemsPerScreen.Consumable)/KDScrollAmount) * KDScrollAmount, KDScrollOffset.Weapon + KDScrollAmount);
			return true;
		}
		if (MouseIn(510, 750, 90, 40)) {
			KDScrollOffset.Weapon = Math.max(0, KDScrollOffset.Weapon - KDScrollAmount);
			return true;
		}
	}
	if (fR.length > KDItemsPerScreen.Restraint) {
		if (MouseIn(510, 455, 90, 40)) {
			KDScrollOffset.Restraint = Math.min(Math.ceil((fR.length - KDItemsPerScreen.Consumable)/KDScrollAmount) * KDScrollAmount, KDScrollOffset.Restraint + KDScrollAmount);
			return true;
		}
		if (MouseIn(510, 500, 90, 40)) {
			KDScrollOffset.Restraint = Math.max(0, KDScrollOffset.Restraint - KDScrollAmount);
			return true;
		}
	}

	if (NoUse) return false;

	KinkyDungeonShowInventory = false;

	for (let c = 0; c < consumables.length; c++) {
		let item = consumables[c];
		if (item.preview) {
			let point = KinkyDungeonQuickGrid(c, H, V, 6);
			if (MouseIn(point.x, point.y + 30, H, V))
				//KinkyDungeonAttemptConsumable(item.name, 1);
				KDSendInput("consumable", {item: item.name, quantity: 1});
				//DrawRect(point.x, point.y + 30, H, V, "white");
			//DrawImageEx(item.preview, point.x, point.y + 30, {Width: 80, Height: 80});
		}
	}

	for (let w = 0; w < weapons.length; w++) {
		let item = weapons[w];
		if (item.preview) {
			let point = KinkyDungeonQuickGrid(w, H, V, 6);
			if (MouseIn(point.x, 1000 - V - Wheight + point.y, H, V)) {
				let weapon = item.name != "Unarmed" ? item.name : null;
				KDSendInput("switchWeapon", {weapon: weapon});
			}
			//DrawRect(point.x, 1000 - V - Wheight + point.y, H, V, "white");
			//DrawImageEx(item.preview, point.x, 1000 - V - Wheight + point.y, {Width: 80, Height: 80});
		}
	}

	for (let w = 0; w < restraints.length; w++) {
		let item = restraints[w];
		if (item.preview) {
			let point = KinkyDungeonQuickGrid(w, H, V, 6);
			if (MouseIn(point.x, 1000 - V - Rheight + point.y, H, V)) {
				let equipped = false;
				let newItem = null;
				let currentItem = null;

				if (item
					&& item.item) {
					newItem = KDRestraint(item.item);
					if (newItem) {
						currentItem = KinkyDungeonGetRestraintItem(newItem.Group);
						if (!currentItem
							|| (KinkyDungeonLinkableAndStricter(KDRestraint(currentItem), newItem) &&
								((newItem.linkCategory && KDLinkCategorySize(currentItem, newItem.linkCategory) + KDLinkSize(newItem) <= 1.0)
								|| (!newItem.linkCategory && !KDDynamicLinkList(currentItem, true).some((ii) => {return newItem.name == ii.name;}))))) {
							equipped = false;
						} else equipped = true;
					}
				}
				if (!equipped && newItem) {
					if (KDSendInput("equip", {name: newItem.name, group: newItem.Group, currentItem: currentItem ? currentItem.name : undefined, events: Object.assign([], item.item.events)})) return true;
				}
			}
			//DrawRect(point.x, 1000 - V - Wheight + point.y, H, V, "white");
			//DrawImageEx(item.preview, point.x, 1000 - V - Wheight + point.y, {Width: 80, Height: 80});
		}
	}


	return false;
}
