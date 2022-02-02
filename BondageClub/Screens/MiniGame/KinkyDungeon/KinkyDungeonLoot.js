"use strict";
var KinkyDungeonLootTable = {
	"rubble": [
		{name: "nothing", minLevel: 0, weight:9, message:"LootRubbleFail", messageColor:"#aaaaaa", messageTime: 2, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]},
		{name: "smallgold", minLevel: 0, weight:22, message:"LootRubbleSmallGold", messageColor:"yellow", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]},
		{name: "knife", minLevel: 0, weight:3, message:"LootRubbleKnife", messageColor:"lightgreen", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]},
		{name: "pick", minLevel: 0, weight:2, message:"LootRubbleLockpick", messageColor:"lightgreen", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]},
		{name: "redkey", key: true, minLevel: 1, weight:1, message:"LootRubbleRedKey", messageColor:"lightgreen", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]},
		//{name: "greenkey", minLevel: 2, weight:2, message:"LootRubbleGreenKey", messageColor:"lightgreen", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]},
		{name: "bluekey", key: true, minLevel: 5, weight:0.33, message:"LootRubbleBlueKey", messageColor:"lightgreen", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]},
		{name: "potion_mana", minLevel: 0, weight:4, message:"LootPotionMana", messageColor:"lightblue", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]},
		{name: "potion_stamina", minLevel: 2, weight:6, message:"LootPotionStamina", messageColor:"lightgreen", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]},
		{name: "potion_frigid", minLevel: 2, weight:2, message:"LootPotionFrigid", messageColor:"lightgreen", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]},
	],
	"chest": [
		//{name: "gold", minLevel: 0, weight:4, message:"LootChestGold", messageColor:"yellow", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]},
		//{name: "spell_illusion_low", magic: true, minLevel: 0, weight:1, message:"LootChestSpell", messageColor:"lightblue", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], prerequisites: ["UnlearnedIllusion", "lowlevel"]}, // lowlevel is spell levels 1-7
		//{name: "spell_conjuration_low", magic: true, minLevel: 0, weight:1, message:"LootChestSpell", messageColor:"lightblue", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], prerequisites: ["UnlearnedConjure", "lowlevel"]}, // lowlevel is spell levels 1-7
		//{name: "spell_elemental_low", magic: true, minLevel: 0, weight:1, message:"LootChestSpell", messageColor:"lightblue", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], prerequisites: ["UnlearnedElements", "lowlevel"]}, // lowlevel is spell levels 1-7
		{name: "bluekey", redspecial: 10, key: true, minLevel: 5, weight:0.33, message:"LootChestBlueKey", messageColor:"lightgreen", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]},
		{name: "spell_points", magic: true, redspecial: 1.5, minLevel: 0, weight:1, message:"LootChestSpellPoints", messageColor:"lightblue", messageTime: 3, special:100, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]}, // lowlevel is spell levels 1-7
		{name: "weapon_boltcutters", minLevel: 0, weight:0.7, message:"LootChestWeapon", messageColor:"lightblue", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], noweapon: ["BoltCutters"]},
		{name: "weapon_flail", minLevel: 0, weight:1, message:"LootChestWeapon", messageColor:"lightblue", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], noweapon: ["Flail"]},
		{name: "weapon_spear", minLevel: 0, weight:1, message:"LootChestWeapon", messageColor:"lightblue", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], noweapon: ["Spear"]},
		{name: "trap_armbinder", trap: true, minLevel: 1, weight:2, message:"LootChestTrapMagic", messageColor:"red", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], prerequisites: ["Group_ItemArms"], power: 8},
		{name: "trap_armbinderHeavy", minLevel: 1, weight:4, message:"LootChestTrapMagicHarness", messageColor:"red", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], prerequisites: ["Group_ItemArms"], submissive: 15, power: 8},
		{name: "trap_cuffs", trap: true, minLevel: 1, weight:1, message:"LootChestTrapMagic", messageColor:"red", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], prerequisites: ["Group_ItemArms"], power: 8},
		{name: "trap_harness", trap: true, minLevel: 1, weight:2, message:"LootChestTrapMagic", messageColor:"red", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], prerequisites: ["Group_ItemTorso"], power: 8},
		{name: "trap_gag", trap: true, minLevel: 1, weight:3, message:"LootChestTrapMagic", messageColor:"red", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], prerequisites: ["Group_ItemMouth"], power: 8},
		{name: "trap_blindfold", trap: true, minLevel: 1, weight:2, message:"LootChestTrapMagic", messageColor:"red", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], prerequisites: ["Group_ItemHead"], power: 8},
		{name: "trap_boots", trap: true, minLevel: 1, weight:3, message:"LootChestTrapMagic", messageColor:"red", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], prerequisites: ["Group_ItemBoots"], power: 8},
		{name: "trap_legirons", trap: true, minLevel: 1, weight:1, message:"LootChestTrapMagic", messageColor:"red", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], prerequisites: ["Group_ItemFeet"], power: 8},
		{name: "trap_belt", trap: true, minLevel: 1, weight:2, message:"LootChestTrapMagicVibe", messageColor:"red", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], prerequisites: ["Group_ItemVulvaPiercings"], power: 8},
		{name: "trap_plug", trap: true, minLevel: 1, weight:2, message:"LootChestTrapMagicPlug", messageColor:"red", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], prerequisites: ["Group_ItemVulva"], power: 8},
		{name: "potions_mana", minLevel: 0, weight:1, message:"LootPotionsMana", messageColor:"lightblue", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], prerequisites: ["lowmanapotions"]},
		{name: "potions_many", minLevel: 1, weight:1, message:"LootPotionsMedley", messageColor:"lightblue", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], prerequisites: ["lowpotions"]},
	],
	"cache": [
		{name: "lost_items", minLevel: 0, weight:999999999999, message:"LootCacheLostItems", messageColor:"lightgreen", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], prerequisites: ["LostItems"]}, // lowlevel is spell levels 1-7
		{name: "weapon_boltcutters", minLevel: 0, weight:1, message:"LootChestWeapon", messageColor:"lightblue", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], noweapon: ["BoltCutters"]},
		{name: "potions_many", minLevel: 0, weight:1, message:"LootPotionsMedley", messageColor:"lightblue", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]},
		{name: "staff_flame", minLevel: 0, weight:1, message:"LootChestWeapon", messageColor:"lightblue", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], noweapon: ["StaffFlame"]},
		{name: "staff_bind", minLevel: 0, weight:1, message:"LootChestWeapon", messageColor:"lightblue", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], noweapon: ["StaffBind"]},
	],
	"gold": [
		{name: "MistressKey", minLevel: 0, weight:3, message:"LootChestMistressKey", messageColor:"yellow", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]},
		{name: "AncientCores", minLevel: 0, weight:3, message:"LootChestAncientCores", messageColor:"yellow", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]},
		{name: "potions_many", minLevel: 0, weight:10, message:"LootPotionsMedley", messageColor:"lightblue", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], prerequisites: ["lowpotions"]},
		{name: "EnchantedBelt", minLevel: 0, weight:10, message:"LootChestEnchantedBelt", messageColor:"yellow", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], norestraint: ["EnchantedBelt"]},
		{name: "EnchantedBra", minLevel: 0, weight:10, message:"LootChestEnchantedBra", messageColor:"yellow", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], norestraint: ["EnchantedBra"]},
		{name: "EnchantedHeels", minLevel: 0, weight:10, message:"LootChestEnchantedHeels", messageColor:"yellow", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], norestraint: ["EnchantedHeels"]},
	]


};

let KinkyDungeonLostItems = [];

function KinkyDungeonAddLostItems(list, excludeBound) {
	for (let item of list) {
		let unique = true;
		let itemType = "";
		if (item.weapon) itemType = "weapon";
		else if (item.looserestraint) itemType = "looserestraint";
		else if (item.consumable) itemType = "consumable";
		else if (item.outfit) itemType = "outfit";
		if (item.weapon && item.weapon.name == "Knife") unique = false;
		if (itemType && item[itemType]) {
			for (let item2 of KinkyDungeonLostItems) {
				if (item2[itemType] && item2[itemType].name == item[itemType].name) {
					unique = false;
					break;
				}
			}
		}
		if (unique && itemType && (!excludeBound || itemType != "weapon" || (item[itemType].magic))) {
			KinkyDungeonLostItems.push(item);
			if (itemType == "consumable") {
				item.quantity = Math.min(item.quantity, 3 + Math.floor(Math.random() * 3));
			}
		}
	}
}


// Determines if you get a good loot from a blue locked chest
let KinkyDungeonSpecialLoot = false;
let KinkyDungeonLockedLoot = false;

function KinkyDungeonLoot(Level, Index, Type) {
	let lootWeightTotal = 0;
	let lootWeights = [];

	let lootType = KinkyDungeonLootTable[Type];
	for (let L = 0; L < lootType.length; L++) {
		let loot = lootType[L];
		if (Level >= loot.minLevel && loot.floors.includes(Index)) {
			let prereqs = true;

			if (loot.prerequisites) {

				let maxlevel = 999;
				let minlevel = 0;
				let SpellList = null;
				if (loot.prerequisites.includes("lowlevel")) maxlevel = 5;
				if (loot.prerequisites.includes("lowpotions") && (
					KinkyDungeonItemCount("PotionFrigid") + KinkyDungeonItemCount("PotionMana") + KinkyDungeonItemCount("PotionStamina") > 10
				)) prereqs = false;
				if (loot.prerequisites.includes("lowmanapotions") && (
					KinkyDungeonItemCount("PotionMana") > 10
				)) prereqs = false;
				if (loot.prerequisites.includes("UnlearnedElements")) SpellList = KinkyDungeonSpellList.Elements;
				if (loot.prerequisites.includes("UnlearnedConjure")) SpellList = KinkyDungeonSpellList.Conjure;
				if (loot.prerequisites.includes("UnlearnedIllusion")) SpellList = KinkyDungeonSpellList.Illusion;
				if (loot.prerequisites.includes("NoBoltCutters") && KinkyDungeonInventoryGet("BoltCutters")) prereqs = false;
				if (loot.prerequisites.includes("LostItems") && KinkyDungeonLostItems.length < 1) prereqs = false;

				if (prereqs)
					for (let P = 0; P < loot.prerequisites.length; P++) {
						if (loot.prerequisites[P].startsWith("Group_")) {
							let group = loot.prerequisites[P].substring(6);
							let item = KinkyDungeonGetRestraintItem(group);
							if (item && item.restraint && item.restraint.power <= loot.power) {
								prereqs = false;
								break;
							}
						}
					}

				if (SpellList != null && KinkyDungeonGetUnlearnedSpells(minlevel, maxlevel, SpellList).length == 0) {
					prereqs = false;
				}
			}
			if (KinkyDungeonGoddessRep.Ghost && loot.submissive && (KinkyDungeonGoddessRep.Ghost + 50 < loot.submissive)) prereqs = false;
			if (loot.noweapon) {
				for (let w of loot.noweapon) {
					if (KinkyDungeonInventoryGet(w)) {
						prereqs = false;
						break;
					}
				}
			}
			if (loot.norestraint) {
				for (let r of loot.norestraint) {
					if (KinkyDungeonInventoryGet(r)) {
						prereqs = false;
						break;
					}
				}
			}

			if (prereqs) {
				let weightMult = 1.0;
				let weightBonus = 0;
				if (Type == "chest") {
					if (KinkyDungeonSpecialLoot && loot.special) weightBonus += loot.special;
					else if (KinkyDungeonSpecialLoot) weightMult = 0;
					if (KinkyDungeonLockedLoot && loot.redspecial) weightBonus += loot.redspecial;
				}

				let rep = (KinkyDungeonGoddessRep.Ghost + 50)/100;
				if (loot.trap || loot.magic) weightMult *= (1 + rep);
				if (loot.trap && KinkyDungeonCurrentMaxEnemies > 0) {
					let nonSumEnemies = 0;
					for (let e of KinkyDungeonEntities) {if (!e.summoned) nonSumEnemies++;}
					weightMult *= Math.max(0, 1 - 0.5*nonSumEnemies/KinkyDungeonCurrentMaxEnemies);
				}

				lootWeights.push({loot: loot, weight: lootWeightTotal});
				lootWeightTotal += (loot.weight + weightBonus) * weightMult;
			}
		}
	}

	let selection = Math.random() * lootWeightTotal;

	for (let L = lootWeights.length - 1; L >= 0; L--) {
		if (selection > lootWeights[L].weight) {
			let replace = KinkyDungeonLootEvent(lootWeights[L].loot, Level, TextGet(lootWeights[L].loot.message));
			KinkyDungeonSpecialLoot = false;
			KinkyDungeonLockedLoot = false;

			if (!KinkyDungeonSendActionMessage(8, replace, lootWeights[L].loot.messageColor, lootWeights[L].loot.messageTime))
				KinkyDungeonSendTextMessage(8, replace, lootWeights[L].loot.messageColor, lootWeights[L].loot.messageTime);

			break;
		}
	}
}

function KinkyDungeonGetUnlearnedSpells(minlevel, maxlevel, SpellList) {
	let SpellsUnlearned = [];

	for (let S = 0; S < SpellList.length; S++) {
		if (SpellList[S].level >= minlevel && SpellList[S].level <= maxlevel) {
			SpellsUnlearned.push(SpellList[S]);
		}
	}

	for (let SS = 0; SS < KinkyDungeonSpells.length; SS++) {
		for (let S = 0; S < SpellsUnlearned.length; S++) {
			if (KinkyDungeonSpells[SS].name == SpellsUnlearned[S].name) {
				SpellsUnlearned.splice(S, 1);
			}
		}
	}

	return SpellsUnlearned;
}

/*
You find a scrap of a journal! (pg. 24)
From the journal of Catherine Edgar Willows, well-known explorer (who vanished in the dungeon 30 years ago)

"Many who trowel the upper levels of the Mistress' tomb often ask rhetorically: 'Why are there weird kinky traps guarding treasure chests? Why not have real, deadly traps if the purpose is to dissuade intruders?'

They make a crucial mistake: The treasure chests aren't trapped. Rather, they are full of gold. And we know that gold is pleasing to the gods: our economy runs on it, and the gods only make interventions in our day-to-day affairs because we give them gold.
Lesser gods, known as spirits, also love gold, but unlike the gods we know, these lesser spirits cannot consume gold on an altar in one fell swoop like the gods can. Therefore, they need to physically inhabit the place where the gold sits, slowly draining it of its pleasing essence.

So the question is not "why did somebody lay these traps." The answer is that they are not traps at all. I surmise that the upper floors were once a place of offering for the dead. And when the old civilization perished and the entire complex sank into the ground, there was no longer anyone to drive the spirits away and keep them from inhabiting the upstairs.

As for why there are so many restraints in general rather than your typical sort of spirits... well we know what the Mistress surrounded herself with."
*/


function KinkyDungeonLootEvent(Loot, Floor, Replacemsg) {
	let value = 0;
	if (Loot.name == "spell_points") {
		let amount = 1;
		KinkyDungeonSpellPoints += amount;
		KinkyDungeonSendFloater({x: 1100, y: 800 - KDRecentRepIndex * 40}, `+${amount} Spell Points!!!`, "#8888ff", 5, true);
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("AMOUNT", "" + amount);
	} else if (Loot.name == "spell_illusion_low") {
		let SpellsUnlearned = KinkyDungeonGetUnlearnedSpells(0, 5, KinkyDungeonSpellList.Illusion);
		let spellIndex = Math.floor(Math.random()*SpellsUnlearned.length);

		let spell = SpellsUnlearned[spellIndex];
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("SpellLearned", TextGet("KinkyDungeonSpell" + spell.name));
		KinkyDungeonSpells.push(spell);
	} else if (Loot.name == "spell_conjuration_low") {
		let SpellsUnlearned = KinkyDungeonGetUnlearnedSpells(0, 5, KinkyDungeonSpellList.Conjure);
		let spellIndex = Math.floor(Math.random()*SpellsUnlearned.length);

		let spell = SpellsUnlearned[spellIndex];
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("SpellLearned", TextGet("KinkyDungeonSpell" + spell.name));
		KinkyDungeonSpells.push(spell);
	} else if (Loot.name == "spell_elemental_low") {
		let SpellsUnlearned = KinkyDungeonGetUnlearnedSpells(0, 5, KinkyDungeonSpellList.Elements);
		let spellIndex = Math.floor(Math.random()*SpellsUnlearned.length);

		let spell = SpellsUnlearned[spellIndex];
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("SpellLearned", TextGet("KinkyDungeonSpell" + spell.name));
		KinkyDungeonSpells.push(spell);
	} else if (Loot.name == "gold") {
		value = Math.ceil((25 + 25 * Math.random()) * (1 + Floor/40));
	} else if (Loot.name == "smallgold") {
		value = Math.ceil((20 + 10 * Math.random()) * (1 + Floor/35));
	} else if (Loot.name == "knife") {
		KinkyDungeonNormalBlades += 1;
	} else if (Loot.name == "magicknife") {
		KinkyDungeonEnchantedBlades += 1;
	}  else if (Loot.name == "pick") {
		KinkyDungeonLockpicks += 1;
	}  else if (Loot.name == "redkey") {
		KinkyDungeonRedKeys += 1;
	} else if (Loot.name == "bluekey") {
		KinkyDungeonBlueKeys += 1;
	} else if (Loot.name == "MistressKey") {
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.MistressKey, 1);
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.AncientPowerSource, 3);
	} else if (Loot.name == "AncientCores") {
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.AncientPowerSource, 3);
	} else if (Loot.name == "EnchantedBelt") {
		let restraint = KinkyDungeonGetRestraintByName("EnchantedBelt");
		KinkyDungeonInventory.push({looserestraint: restraint, events: restraint.looseevents});
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.AncientPowerSource, 1);
	} else if (Loot.name == "EnchantedBra") {
		let restraint = KinkyDungeonGetRestraintByName("EnchantedBra");
		KinkyDungeonInventory.push({looserestraint: restraint, events: restraint.looseevents});
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.AncientPowerSource, 1);
	} else if (Loot.name == "EnchantedHeels") {
		let restraint = KinkyDungeonGetRestraintByName("EnchantedHeels");
		KinkyDungeonInventory.push({looserestraint: restraint, events: restraint.looseevents});
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.AncientPowerSource, 1);
	} else if (Loot.name == "weapon_boltcutters") {
		KinkyDungeonInventoryAddWeapon("BoltCutters");
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("WeaponAcquired", TextGet("KinkyDungeonInventoryItemBoltCutters"));
	} else if (Loot.name == "weapon_spear") {
		KinkyDungeonInventoryAddWeapon("Spear");
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("WeaponAcquired", TextGet("KinkyDungeonInventoryItemSpear"));
	} else if (Loot.name == "weapon_flail") {
		KinkyDungeonInventoryAddWeapon("Flail");
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("WeaponAcquired", TextGet("KinkyDungeonInventoryItemFlail"));
	} else if (Loot.name == "staff_flame") {
		KinkyDungeonInventoryAddWeapon("StaffFlame");
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("WeaponAcquired", TextGet("KinkyDungeonInventoryItemStaffFlame"));
	} else if (Loot.name == "staff_bind") {
		KinkyDungeonInventoryAddWeapon("StaffBind");
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("WeaponAcquired", TextGet("KinkyDungeonInventoryItemStaffBind"));
	} else if (Loot.name == "potions_mana") {
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.PotionMana, 2+Math.floor(Math.random()*2));
	} else if (Loot.name == "potions_many") {
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.PotionMana, 1+Math.floor(Math.random()*2));
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.PotionStamina, 2+Math.floor(Math.random()*3));
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.PotionFrigid, Math.floor(Math.random()*3));
	} else if (Loot.name == "potion_mana") {
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.PotionMana, 1);
	} else if (Loot.name == "potion_stamina") {
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.PotionStamina, 1);
	} else if (Loot.name == "potion_frigid") {
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.PotionFrigid, 1);
	} else if (Loot.name == "trap_armbinder") {
		value = Math.ceil((70 + 80 * Math.random()) * (1 + Floor/40));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapArmbinder"), MiniGameKinkyDungeonCheckpoint, true, false);
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("RestraintType", TextGet("RestraintTrapArmbinder"));
	} else if (Loot.name == "trap_armbinderHeavy") {
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapArmbinder"), MiniGameKinkyDungeonCheckpoint, true, KinkyDungeonGenerateLock(true));
		let harness = KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapArmbinderHarness"), MiniGameKinkyDungeonCheckpoint, true, KinkyDungeonGenerateLock(true));
		if (Replacemsg)
			if (!harness)
				Replacemsg = Replacemsg.replace("RestraintType", TextGet("RestraintTrapArmbinder"));
			else Replacemsg = Replacemsg.replace("RestraintType", TextGet("RestraintTrapArmbinderHarness"));
	} else if (Loot.name == "trap_cuffs") {
		value = Math.ceil((70 + 80 * Math.random()) * (1 + Floor/40));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapCuffs"), MiniGameKinkyDungeonCheckpoint, true, KinkyDungeonGenerateLock(true));
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("RestraintType", TextGet("RestraintTrapCuffs"));
	} else if (Loot.name == "trap_harness") {
		value = Math.ceil((70 + 80 * Math.random()) * (1 + Floor/40));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapHarness"), MiniGameKinkyDungeonCheckpoint, true, KinkyDungeonGenerateLock(true));
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("RestraintType", TextGet("RestraintTrapHarness"));
	} else if (Loot.name == "trap_gag") {
		value = Math.ceil((70 + 80 * Math.random()) * (1 + Floor/40));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapGag"), MiniGameKinkyDungeonCheckpoint, true, KinkyDungeonGenerateLock(true));
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("RestraintType", TextGet("RestraintTrapGag"));
	} else if (Loot.name == "trap_blindfold") {
		value = Math.ceil((70 + 80 * Math.random()) * (1 + Floor/40));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapBlindfold"), MiniGameKinkyDungeonCheckpoint, true, KinkyDungeonGenerateLock(true));
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("RestraintType", TextGet("RestraintTrapBlindfold"));
	} else if (Loot.name == "trap_boots") {
		value = Math.ceil((70 + 80 * Math.random()) * (1 + Floor/40));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapBoots"), MiniGameKinkyDungeonCheckpoint, true, KinkyDungeonGenerateLock(true));
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("RestraintType", TextGet("RestraintTrapBoots"));
	} else if (Loot.name == "trap_legirons") {
		value = Math.ceil((70 + 80 * Math.random()) * (1 + Floor/40));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapLegirons"), MiniGameKinkyDungeonCheckpoint, true, KinkyDungeonGenerateLock(true));
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("RestraintType", TextGet("RestraintTrapLegirons"));
	} else if (Loot.name == "trap_belt") {
		value = Math.ceil((70 + 80 * Math.random()) * (1 + Floor/40));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapVibe"), MiniGameKinkyDungeonCheckpoint, true, false);
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapBelt"), MiniGameKinkyDungeonCheckpoint, true, KinkyDungeonGenerateLock(true));
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("RestraintType", TextGet("RestraintTrapBelt"));
	} else if (Loot.name == "trap_plug") {
		value = Math.ceil((70 + 80 * Math.random()) * (1 + Floor/40));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapPlug"), MiniGameKinkyDungeonCheckpoint, true, false);
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapBelt"), MiniGameKinkyDungeonCheckpoint, true, KinkyDungeonGenerateLock(true));
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("RestraintType", TextGet("RestraintTrapPlug"));
	}

	else if (Loot.name == "lost_items") {
		for (let I = 0; I < KinkyDungeonLostItems.length; I++) {
			let lostitem = KinkyDungeonLostItems[I];
			if (lostitem) {
				let itemType = "";
				if (lostitem.weapon) itemType = "weapon";
				else if (lostitem.looserestraint) itemType = "looserestraint";
				else if (lostitem.consumable) itemType = "consumable";
				else if (lostitem.outfit) itemType = "outfit";
				let remove = false;
				if (lostitem[itemType]) {
					let existingitem = KinkyDungeonGetInventoryItem(lostitem[itemType].name, itemType);
					if (existingitem && existingitem.item) {
						if (existingitem.item.consumable) {
							if (lostitem.consumable.name != "MistressKey") {
								if (!existingitem.item.quantity) existingitem.item.quantity = lostitem.quantity;
								else existingitem.item.quantity += lostitem.quantity;
								KinkyDungeonSendFloater({x: KinkyDungeonPlayerEntity.x - 1 + 2 * Math.random(), y: KinkyDungeonPlayerEntity.y - 1 + 2 * Math.random()},
									`+${lostitem.quantity} ${TextGet("KinkyDungeonInventoryItem" + lostitem[itemType].name)}`, "white", 5);
							} else
								KinkyDungeonSendTextMessage(4, TextGet("KinkyDungeonMistressKeysTakenAway"), "orange", 2);
						}
					} else {
						if (lostitem.consumable) {
							if (lostitem.consumable.name != "MistressKey")
								KinkyDungeonSendFloater({x: KinkyDungeonPlayerEntity.x - 1 + 2 * Math.random(), y: KinkyDungeonPlayerEntity.y - 1 + 2 * Math.random()},
									`+${lostitem.quantity} ${TextGet("KinkyDungeonInventoryItem" + lostitem[itemType].name)}`, "white", 4);
							else
								KinkyDungeonSendTextMessage(4, TextGet("KinkyDungeonMistressKeysTakenAway"), "orange", 2);
							remove = true;
						} if (lostitem.weapon) {
							KinkyDungeonSendFloater({x: KinkyDungeonPlayerEntity.x - 1 + 2 * Math.random(), y: KinkyDungeonPlayerEntity.y - 1 + 2 * Math.random()},
								`+${TextGet("KinkyDungeonInventoryItem" + lostitem[itemType].name)}`, "white", 6);
							remove = true;
						} else if (lostitem.outfit) {
							KinkyDungeonSendFloater({x: KinkyDungeonPlayerEntity.x - 1 + 2 * Math.random(), y: KinkyDungeonPlayerEntity.y - 1 + 2 * Math.random()},
								`+${TextGet("KinkyDungeonInventoryItem" + lostitem[itemType].name)}`, "white", 7);
							remove = true;
						} else if (lostitem.looserestraint) {
							KinkyDungeonSendFloater({x: KinkyDungeonPlayerEntity.x - 1 + 2 * Math.random(), y: KinkyDungeonPlayerEntity.y - 1 + 2 * Math.random()},
								`+ (loose) ${TextGet("Restraint" + lostitem[itemType].name)}`, "white", 5);
							remove = true;
						}
					}
					if (remove) {
						if (!lostitem.consumable || lostitem.consumable.name != "MistressKey")
							KinkyDungeonInventory.push(lostitem);
						//KinkyDungeonLostItems.splice(I, 1);
						//I -= 1;
					}
				}
			}
		}
		KinkyDungeonLostItems = [];
	}

	if (value > 0) {
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("XXX", "" + value);
		KinkyDungeonAddGold(value);
	}
	return Replacemsg;
}


function KinkyDungeonAddGold(value) {
	KinkyDungeonGold += value;
	if (ArcadeDeviousChallenge && KinkyDungeonDeviousDungeonAvailable()) CharacterChangeMoney(Player, Math.round(value/10));
	let pre = value >= 0 ? "+" : "";
	KinkyDungeonSendFloater(KinkyDungeonPlayerEntity, pre + `${value} GP`, "white", 3.5);
}