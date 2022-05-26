"use strict";
let KinkyDungeonLootTable = {
	"rubble": [
		{name: "nothing", minLevel: 0, weight:9, message:"LootRubbleFail", messageColor:"#aaaaaa", messageTime: 2, allFloors: true},
		{name: "smallgold", minLevel: 0, weight:22, message:"LootRubbleSmallGold", messageColor:"yellow", messageTime: 3, allFloors: true},
		{name: "knife", minLevel: 0, weight:3, message:"LootRubbleKnife", messageColor:"lightgreen", messageTime: 3, allFloors: true, prerequisites: ["fewknife"],},
		{name: "pick", minLevel: 0, weight:2, message:"LootRubbleLockpick", messageColor:"lightgreen", messageTime: 3, allFloors: true, prerequisites: ["fewpick"],},
		{name: "redkey", key: true, minLevel: 1, weight:1, message:"LootRubbleRedKey", messageColor:"lightgreen", messageTime: 3, allFloors: true},
		//{name: "greenkey", minLevel: 2, weight:2, message:"LootRubbleGreenKey", messageColor:"lightgreen", messageTime: 3, allFloors: true},
		{name: "bluekey", key: true, minLevel: 2, weight:0.33, message:"LootRubbleBlueKey", messageColor:"lightgreen", messageTime: 3, allFloors: true},
		{name: "potion_mana", minLevel: 0, weight:4, message:"LootPotionMana", messageColor:"lightblue", messageTime: 3, allFloors: true},
		{name: "potion_stamina", minLevel: 2, weight:6, message:"LootPotionStamina", messageColor:"lightgreen", messageTime: 3, allFloors: true},
		{name: "potion_frigid", minLevel: 3, weight:2, message:"LootPotionFrigid", messageColor:"lightgreen", messageTime: 3, allFloors: true},
	],
	"shelf": [
		{name: "redkey", key: true, minLevel: 1, weight:1, message:"LootBookshelfKey", messageColor:"lightgreen", messageTime: 3, allFloors: true},
		{name: "scroll_arms", minLevel: 0, weight:1, message:"LootBookshelfScroll", messageColor:"lightblue", messageTime: 3, allFloors: true},
		{name: "scroll_legs", minLevel: 0, weight:1, message:"LootBookshelfScroll", messageColor:"lightblue", messageTime: 3, allFloors: true},
		{name: "scroll_verbal", minLevel: 0, weight:1, message:"LootBookshelfScroll", messageColor:"lightblue", messageTime: 3, allFloors: true},
		{name: "trap_book", minLevel: 1, weight:5, message:"LootBookshelfTrap", messageColor:"red", messageTime: 3, allFloors: true},
	],
	"pearl": [
		{name: "pearlReward", minLevel: 0, weight:1, message:"LootPearlChest", messageColor:"lightblue", messageTime: 3, allFloors: true, prerequisites: ["pearlChest"],},
	],
	"lesserpearl": [
		{name: "slimeThrower", minLevel: 0, weapon: "Slimethrower", goddess: "Latex", goddessWeight: 3.3, weight:0, message:"LootChestWeapon", messageColor:"lightblue", messageTime: 3, allFloors: true, noweapon: ["Slimethrower"]},
		{name: "StaffDoll", minLevel: 0, weapon: "StaffDoll", goddess: "Latex", goddessWeight: 6.7, weight:0, message:"LootChestWeapon", messageColor:"lightblue", messageTime: 3, allFloors: true, noweapon: ["StaffDoll"]},
		{name: "staff_flame", minLevel: 0, weight:0, goddess: "Elements", goddessWeight: 2.5, weapon: "StaffFlame", message:"LootChestWeapon", messageColor:"lightblue", messageTime: 3, allFloors: true, noweapon: ["StaffFlame"]},
		{name: "staff_storms", minLevel: 0, weight:0, goddess: "Elements", goddessWeight: 2.5, weapon: "StaffStorm", message:"LootChestWeapon", messageColor:"lightblue", messageTime: 3, allFloors: true, noweapon: ["StaffStorm"]},
		{name: "staff_perma", minLevel: 0, weight:0, goddess: "Elements", goddessWeight: 2.5, weapon: "StaffPermafrost", message:"LootChestWeapon", messageColor:"lightblue", messageTime: 3, allFloors: true, noweapon: ["StaffPermafrost"]},
		{name: "staff_frostbite", minLevel: 0, weight:0, goddess: "Elements", goddessWeight: 2.5, weapon: "StaffFrostbite", message:"LootChestWeapon", messageColor:"lightblue", messageTime: 3, allFloors: true, noweapon: ["StaffFrostbite"]},
		{name: "staff_bind", minLevel: 0, weight:0, goddess: "Rope", goddessWeight: 5.0, weapon: "StaffBind", message:"LootChestWeapon", messageColor:"lightblue", messageTime: 3, allFloors: true, noweapon: ["StaffBind"]},
		{name: "AncientCores", minLevel: 0, weight:3, message:"LootChestAncientCores", messageColor:"yellow", messageTime: 3, allFloors: true},
		{name: "magicknife", minLevel: 0, weight:2.5, message:"LootChestMagicKnife", messageColor:"lightblue", messageTime: 3, allFloors: true},
		{name: "bluekey", minLevel: 0, weight:2.5, message:"LootChestBlueKey", messageColor:"lightblue", messageTime: 3, allFloors: true},
		{name: "spell_points", magic: true, minLevel: 0, weight:2, message:"LootChestSpellPoints", messageColor:"lightblue", messageTime: 3, allFloors: true}, // lowlevel is spell levels 1-7
	],
	"storage": [
		{name: "redkey", key: true, minLevel: 0, weight:1, message:"LootChestRedKey", messageColor:"lightgreen", messageTime: 3, allFloors: true},
		{name: "bola", minLevel: 0, weight:3, message:"LootChestBola", messageColor:"lightgreen", messageTime: 3, allFloors: true},
		{name: "bomb", minLevel: 0, weight:2, message:"LootChestBomb", messageColor:"lightgreen", messageTime: 3, allFloors: true},
		{name: "rope", minLevel: 0, weight:1, weapon: "Rope", message:"LootChestWeapon", messageColor:"lightblue", messageTime: 3, allFloors: true, noweapon: ["Rope"]},
	],
	"blue": [
		{name: "spell_points", magic: true, minLevel: 0, weight:1, message:"LootChestSpellPoints", messageColor:"lightblue", messageTime: 3, allFloors: true}, // lowlevel is spell levels 1-7
	],
	"chest": [
		{name: "bluekey", redspecial: 8.5, key: true, minLevel: 3, weight:0.65, message:"LootChestBlueKey", messageColor:"lightgreen", messageTime: 3, allFloors: true},
		{name: "weapon_boltcutters", minLevel: 6, weight:0.7, message:"LootChestWeapon", messageColor:"lightblue", messageTime: 3, allFloors: true, noweapon: ["BoltCutters"]},
		{name: "weapon_flail", minLevel: 0, weight:1, message:"LootChestWeapon", messageColor:"lightblue", messageTime: 3, allFloors: true, noweapon: ["Flail"]},
		{name: "weapon_spear", minLevel: 0, weight:1, message:"LootChestWeapon", messageColor:"lightblue", messageTime: 3, allFloors: true, noweapon: ["Spear"]},
		{name: "trap_armbinder", trap: true, minLevel: 1, weight:2, message:"LootChestTrapMagic", messageColor:"red", messageTime: 3, allFloors: true, prerequisites: ["Group_ItemArms", "ModerateRestraint"], power: 6},
		{name: "trap_armbinderHeavy", minLevel: 1, weight:4, message:"LootChestTrapMagicHarness", messageColor:"red", messageTime: 3, allFloors: true, prerequisites: ["Group_ItemArms", "ModerateRestraint"], submissive: 15, power: 8},
		{name: "trap_cuffs", trap: true, minLevel: 1, weight:1, message:"LootChestTrapMagic", messageColor:"red", messageTime: 3, allFloors: true, prerequisites: ["Group_ItemArms"], power: 2},
		{name: "trap_harness", trap: true, minLevel: 1, weight:2, message:"LootChestTrapMagic", messageColor:"red", messageTime: 3, allFloors: true, prerequisites: ["Group_ItemTorso"], power: 4},
		{name: "trap_gag", trap: true, minLevel: 1, weight:3, message:"LootChestTrapMagic", messageColor:"red", messageTime: 3, allFloors: true, prerequisites: ["Group_ItemMouth"], power: 6},
		{name: "trap_blindfold", trap: true, minLevel: 1, weight:2, message:"LootChestTrapMagic", messageColor:"red", messageTime: 3, allFloors: true, prerequisites: ["Group_ItemHead"], power: 6},
		{name: "trap_boots", trap: true, minLevel: 1, weight:3, message:"LootChestTrapMagic", messageColor:"red", messageTime: 3, allFloors: true, prerequisites: ["Group_ItemBoots"], power: 6},
		{name: "trap_legirons", trap: true, minLevel: 1, weight:1, message:"LootChestTrapMagic", messageColor:"red", messageTime: 3, allFloors: true, prerequisites: ["Group_ItemFeet"], power: 8},
		{name: "trap_beltonly", arousalMode: true, trap: true, minLevel: 1, weight:4, message:"LootChestTrapMagicBelt", messageColor:"red", messageTime: 3, allFloors: true, prerequisites: ["Group_ItemPelvis"], power: 5},
		{name: "trap_belt", arousalMode: true, trap: true, minLevel: 1, weight:1.5, message:"LootChestTrapMagicVibe", messageColor:"red", messageTime: 3, allFloors: true, prerequisites: ["Group_ItemVulvaPiercings", "alreadyBelted", "vibe"], power: 1},
		{name: "trap_plug", arousalMode: true, trap: true, minLevel: 1, weight:1.5, message:"LootChestTrapMagicPlug", messageColor:"red", messageTime: 3, allFloors: true, prerequisites: ["Group_ItemVulva", "alreadyBelted", "vibe"], power: 3},
		{name: "trap_nipple", arousalMode: true, trap: true, minLevel: 1, weight:2, message:"LootChestTrapMagicNipple", messageColor:"red", messageTime: 3, allFloors: true, prerequisites: ["Group_ItemNipples", "alreadyBelted", "vibe"], power: 3},
		{name: "trap_mitts", trap: true, minLevel: 10, weight:2, message:"LootChestTrapMagic", messageColor:"red", messageTime: 3, allFloors: true, prerequisites: ["Group_ItemHands", "LightRestraint"], power: 10},
		{name: "potions_mana", minLevel: 0, weight:1.5, message:"LootPotionsMana", messageColor:"lightblue", messageTime: 3, allFloors: true, prerequisites: ["lowmanapotions"]},
		{name: "potions_many", minLevel: 1, weight:1.5, message:"LootPotionsMedley", messageColor:"lightblue", messageTime: 3, allFloors: true, prerequisites: ["lowpotions"]},
	],
	"cache": [
		{name: "lost_items", minLevel: 0, weight:999999999999, message:"LootCacheLostItems", messageColor:"lightgreen", messageTime: 3, allFloors: true, prerequisites: ["LostItems"]}, // lowlevel is spell levels 1-7
		{name: "weapon_boltcutters", minLevel: 3, weight:1, message:"LootChestWeapon", messageColor:"lightblue", messageTime: 3, allFloors: true, noweapon: ["BoltCutters"]},
		{name: "potions_many", minLevel: 0, weight:1, message:"LootPotionsMedley", messageColor:"lightblue", messageTime: 3, allFloors: true},
		{name: "flamberge", minLevel: 3, weight:0.8, weapon: "Flamberge", noweapon: ["Flamberge"], message:"LootChestWeapon", messageColor:"lightblue", messageTime: 3, allFloors: true},
		{name: "axe", minLevel: 0, weight:1, weapon: "Axe", noweapon: ["Axe"], message:"LootChestWeapon", messageColor:"lightblue", messageTime: 3, allFloors: true},
		{name: "spear", minLevel: 0, weight:1, weapon: "Spear", noweapon: ["Spear"], message:"LootChestWeapon", messageColor:"lightblue", messageTime: 3, allFloors: true},
		{name: "hammer", minLevel: 0, weight:1, weapon: "Hammer", noweapon: ["Hammer"], message:"LootChestWeapon", messageColor:"lightblue", messageTime: 3, allFloors: true},
		{name: "sword", minLevel: 0, weight:1, weapon: "Sword", noweapon: ["Sword"], message:"LootChestWeapon", messageColor:"lightblue", messageTime: 3, allFloors: true},
		{name: "flail", minLevel: 0, weight:1, weapon: "Flail", noweapon: ["Flail"], message:"LootChestWeapon", messageColor:"lightblue", messageTime: 3, allFloors: true},
	],
	"gold": [
		{name: "MistressKey", minLevel: 0, weight:3, message:"LootChestMistressKey", messageColor:"yellow", messageTime: 3, allFloors: true},
		{name: "AncientCores", minLevel: 0, weight:7, count: 3, message:"LootChestAncientCores", messageColor:"yellow", messageTime: 3, allFloors: true, submissive: 50},
		{name: "EnchantedBelt", arousalMode: true, minLevel: 0, weight:4, message:"LootChestEnchantedBelt", messageColor:"yellow", messageTime: 3, allFloors: true, norestraint: ["EnchantedBelt"]},
		{name: "EnchantedBra", arousalMode: true, minLevel: 0, weight:4, message:"LootChestEnchantedBra", messageColor:"yellow", messageTime: 3, allFloors: true, norestraint: ["EnchantedBra"]},
		{name: "EnchantedHeels", minLevel: 0, weight:4, message:"LootChestEnchantedHeels", messageColor:"yellow", messageTime: 3, allFloors: true, norestraint: ["EnchantedHeels"]},
		{name: "EnchantedAnkleCuffs", minLevel: 0, weight:4, message:"LootChestEnchantedAnkleCuffs", messageColor:"yellow", messageTime: 3, allFloors: true, norestraint: ["EnchantedAnkleCuffs", "EnchantedAnkleCuffs2"]},
		{name: "EnchantedBlindfold", minLevel: 3, weight:4, message:"LootChestEnchantedBlindfold", messageColor:"yellow", messageTime: 3, allFloors: true, norestraint: ["EnchantedBlindfold"]},
		{name: "EnchantedMuzzle", minLevel: 0, weight:4, message:"LootChestEnchantedMuzzle", messageColor:"yellow", messageTime: 3, allFloors: true, norestraint: ["EnchantedMuzzle"]},
		{name: "EnchantedMittens", minLevel: 3, weight:4, message:"LootChestEnchantedMittens", messageColor:"yellow", messageTime: 3, allFloors: true, norestraint: ["EnchantedMittens"]},
		{name: "EnchantedArmbinder", minLevel: 6, weight:4, message:"LootChestEnchantedArmbinder", messageColor:"yellow", messageTime: 3, allFloors: true, norestraint: ["EnchantedArmbinder"], submissive: 5},
		{name: "EnchantedBallGag", minLevel: 0, weight:4, message:"LootChestEnchantedBallGag", messageColor:"yellow", messageTime: 3, allFloors: true, norestraint: ["EnchantedBallGag"]},
		{name: "PotionCollar", minLevel: 1, weight:10, message:"LootPotionCollar", messageColor:"yellow", messageTime: 3, allFloors: true, norestraint: ["PotionCollar"]},
	],
	"lessergold": [
		{name: "scrolls_purity", minLevel: 0, weight: 1, message:"LootChestScrollsPurity", messageColor:"yellow", messageTime: 3, allFloors: true},
		{name: "MistressKey", minLevel: 0, weight:1, message:"LootChestMistressKey", messageColor:"yellow", messageTime: 3, allFloors: true},
		{name: "AncientCores", minLevel: 0, weight:3, message:"LootChestAncientCores", messageColor:"yellow", messageTime: 3, allFloors: true},
		{name: "magicknife", minLevel: 0, weight:1, message:"LootChestMagicKnife", messageColor:"lightblue", messageTime: 3, allFloors: true},
		{name: "Scrolls", minLevel: 0, weight:2, message:"LootChestScrolls", messageColor:"yellow", messageTime: 3, allFloors: true},
		{name: "spell_points", magic: true, minLevel: 3, weight: 3, message:"LootChestSpellPoints", messageColor:"lightblue", messageTime: 3, special:100, allFloors: true},
		{name: "AncientCores", minLevel: 4, weight:5, message:"LootChestAncientCores", messageColor:"yellow", messageTime: 3, allFloors: true},
		{name: "potions_many", minLevel: 0, weight:4, message:"LootPotionsMedley", messageColor:"lightblue", messageTime: 3, allFloors: true, prerequisites: ["lowpotions"]},
		{name: "MagicSword", minLevel: 3, weight:0.33, weapon: "MagicSword", message:"LootChestWeapon", messageColor:"lightblue", messageTime: 3,
			allFloors: true, noweapon: ["MagicSword"]},
		{name: "MagicAxe", minLevel: 3, weight:0.33, weapon: "MagicSword", message:"LootChestWeapon", messageColor:"lightblue", messageTime: 3,
			allFloors: true, noweapon: ["MagicAxe"]},
		{name: "MagicSpear", minLevel: 3, weight:0.33, weapon: "MagicSpear", message:"LootChestWeapon", messageColor:"lightblue", messageTime: 3,
			allFloors: true, noweapon: ["MagicSpear"]},
		{name: "MagicFlail", minLevel: 3, weight:0.33, weapon: "MagicFlail", message:"LootChestWeapon", messageColor:"lightblue", messageTime: 3,
			allFloors: true, noweapon: ["MagicFlail"]},
		{name: "MagicHammer", minLevel: 3, weight:0.33, weapon: "MagicHammer", message:"LootChestWeapon", messageColor:"lightblue", messageTime: 3,
			allFloors: true, noweapon: ["MagicHammer"]},
		{name: "trap_protobelt", arousalMode: true, trap: true, minLevel: 10, goddess: "Metal", goddessWeight: 4, weight:0, message:"LootChestTrapMagicVibe", messageColor:"red", messageTime: 3, allFloors: true, prerequisites: ["Group_ItemVulvaPiercings"], power: 15},
		{name: "trap_plug2", arousalMode: true, trap: true, minLevel: 7, weight:1.5, message:"LootChestTrapMagicPlug", messageColor:"red", messageTime: 3, allFloors: true, prerequisites: ["Group_ItemVulva", "alreadyBelted", "vibe"], power: 3},
		{name: "trap_plug2_torment", arousalMode: true, trap: true, lock: "Gold", minLevel: 15, weight:1, message:"LootChestTrapMagicPlug", messageColor:"red", messageTime: 3, allFloors: true, prerequisites: ["Group_ItemVulva", "alreadyBelted", "vibe"], power: 5},
		{name: "trap_nipple2", arousalMode: true, trap: true, minLevel: 8, weight:4, message:"LootChestTrapMagicNipple", messageColor:"red", messageTime: 3, allFloors: true, prerequisites: ["Group_ItemNipples", "vibe"], power: 3},
		{name: "PotionCollar", minLevel: 1, weight:1.5, message:"LootPotionCollar", messageColor:"yellow", messageTime: 3, allFloors: true, norestraint: ["PotionCollar"]},
	],
	"silver": [
		{name: "scrolls_basic", minLevel: 0, weight: 1.5, message:"LootChestScrollsBasic", messageColor:"yellow", messageTime: 3, allFloors: true},
		{name: "scrolls_purity", minLevel: 0, weight: 0.5, message:"LootChestScrollsPurity", messageColor:"yellow", messageTime: 3, allFloors: true},
		{name: "gold", minLevel: 0, weight:5, message:"LootChestGold", messageColor:"yellow", messageTime: 3, allFloors: true},
		{name: "spell_illusion_low", magic: true, minLevel: 0, weight: 0.75, message:"LootChestSpell", messageColor:"lightblue", messageTime: 3, allFloors: true, prerequisites: ["UnlearnedIllusion", "lowlevel"]}, // lowlevel is spell levels 1-2
		{name: "spell_conjuration_low", magic: true, minLevel: 0, weight: 0.75, message:"LootChestSpell", messageColor:"lightblue", messageTime: 3, allFloors: true, prerequisites: ["UnlearnedConjure", "lowlevel"]}, // lowlevel is spell levels 1-2
		{name: "spell_elemental_low", magic: true, minLevel: 0, weight: 0.75, message:"LootChestSpell", messageColor:"lightblue", messageTime: 3, allFloors: true, prerequisites: ["UnlearnedElements", "lowlevel"]}, // lowlevel is spell levels 1-2
		{name: "trap_armbinderHeavy", trap:true, minLevel: 6, weight:2, message:"LootChestTrapMagicHarness", messageColor:"red", messageTime: 3, allFloors: true, prerequisites: ["Group_ItemArms", "ModerateRestraint"], power: 6},
		{name: "trap_harness", trap: true, minLevel: 1, weight:2, message:"LootChestTrapMagic", messageColor:"red", messageTime: 3, allFloors: true, prerequisites: ["Group_ItemTorso"], power: 4},
		{name: "trap_gagHeavy", trap:true, minLevel: 3, weight:3, message:"LootChestTrapMagic", messageColor:"red", messageTime: 3, allFloors: true, prerequisites: ["Group_ItemMouth2"], power: 10},
		{name: "trap_mithrilankle", trap:true, minLevel: 5, weight:3, message:"LootChestTrapMagic", messageColor:"red", messageTime: 3, allFloors: true, prerequisites: ["Group_ItemFeet"], power: 18},
		{name: "trap_beltonly", arousalMode: true, trap: true, minLevel: 1, weight:2, message:"LootChestTrapMagicBelt", messageColor:"red", messageTime: 3, allFloors: true, prerequisites: ["Group_ItemPelvis"], power: 5},
		{name: "trap_belt", arousalMode: true, trap: true, minLevel: 3, weight:2, message:"LootChestTrapMagicVibe", messageColor:"red", messageTime: 3, allFloors: true, prerequisites: ["Group_ItemVulvaPiercings", "alreadyBelted"], power: 1},
		{name: "trap_plug", arousalMode: true, trap: true, minLevel: 6, weight:1.5, message:"LootChestTrapMagicPlug", messageColor:"red", messageTime: 3, allFloors: true, prerequisites: ["Group_ItemVulva", "alreadyBelted", "vibe"], power: 3},
		{name: "trap_plug_tease", arousalMode: true, trap: true, minLevel: 15, weight:1, message:"LootChestTrapMagicPlug", messageColor:"red", messageTime: 3, allFloors: true, prerequisites: ["Group_ItemVulva", "alreadyBelted", "vibe"], power: 4},
		{name: "trap_plug_torment", arousalMode: true, trap: true, minLevel: 20, weight:0.5, message:"LootChestTrapMagicPlug", messageColor:"red", messageTime: 3, allFloors: true, prerequisites: ["Group_ItemVulva", "alreadyBelted", "vibe"], power: 5},
		{name: "trap_nipple", arousalMode: true, trap: true, minLevel: 2, weight:2, message:"LootChestTrapMagicNipple", messageColor:"red", messageTime: 3, allFloors: true, prerequisites: ["Group_ItemNipples", "vibe"], power: 3},
		{name: "trap_mitts", trap: true, minLevel: 6, weight:2, message:"LootChestTrapMagic", messageColor:"red", messageTime: 3, allFloors: true, prerequisites: ["Group_ItemHands", "LightRestraint"], power: 10},
		{name: "potions_mana", minLevel: 0, weight:3, message:"LootPotionsMana", messageColor:"lightblue", messageTime: 3, allFloors: true, prerequisites: ["lowmanapotions"]},
		{name: "potions_many", minLevel: 1, weight:2, message:"LootPotionsMedley", messageColor:"lightblue", messageTime: 3, allFloors: true, prerequisites: ["lowpotions"]},
		{name: "grinder", minLevel: 1, weight:2, message:"LootChestGrinder", messageColor:"yellow", messageTime: 3, allFloors: true},
		{name: "PotionCollar", minLevel: 1, weight:0.5, message:"LootPotionCollar", messageColor:"yellow", messageTime: 3, allFloors: true, norestraint: ["PotionCollar"]},
	],

};