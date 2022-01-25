"use strict";
// Player entity
let KinkyDungeonPlayerEntity = null; // The current player entity

// Arousal -- It lowers your stamina regen
let KinkyDungeonStatMaxMax = 72; // Maximum any stat can get boosted to

let KinkyDungeonStatArousalMax = 36;
let KinkyDungeonArousalUnlockSuccessMod = 0.5; // Determines how much harder it is to insert a key while aroused. 1.0 is half success chance, 2.0 is one-third, etc.
let KinkyDungeonStatArousal = 0;
let KinkyDungeonCrotchRopeArousal = 0.5;
let KinkyDungeonStatArousalRegen = -0.5;
let KinkyDungeonStatArousalRegenPerUpgrade = -0.1;
let KinkyDungeonStatArousalRegenStaminaRegenFactor = -0.1; // Stamina drain per time per 100 arousal
let KinkyDungeonStatArousalMiscastChance = 0.6; // Miscast chance at max arousal
let KinkyDungeonVibeLevel = 0;
let KinkyDungeonArousalPerVibe = 1; // How much arousal per turn per vibe energy cost
let KinkyDungeonArousalPerPlug = 0.25; // How much arousal per move per plug level
let KinkyDungeonVibeCostPerIntensity = 0.15;

let KinkyDungeonStatWillpowerExhaustion = 0;
let KinkyDungeonSleepTurns = 0;
let KinkyDungeonSleepTurnsMax = 41;
let KinkyDungeonSlowMoveTurns = 0;
// Note that things which increase max arousal (aphrodiasic) also increase the max stamina drain. This can end up being very dangerous as being edged at extremely high arousal will drain all your energy completely, forcing you to wait until the torment is over or the drugs wear off

// Stamina -- your MP. Used to cast spells and also struggle
let KinkyDungeonStatStaminaMax = 36;
let KinkyDungeonStatStamina = KinkyDungeonStatStaminaMax;
let KinkyDungeonStatStaminaRegen = 0;
let KinkyDungeonStatStaminaRegenSleep = 36/40;
let KinkyDungeonStatStaminaRegenWait = 0;
let KinkyDungeoNStatStaminaLow = 4;
let KinkyDungeonStatManaMax = 36;
let KinkyDungeonStatMana = KinkyDungeonStatManaMax;
let KinkyDungeonStatManaRate = 0;
let KinkyDungeonStatManaRegen = 0; // How fast stamina that is converted to mana regenerates
let KinkyDungeonStatManaLowRegen = 0; // How fast stamina that is converted to mana regenerates when low
let KinkyDungeonStatManaRegenLowThreshold = 1; // Threshold for fast mana regen
let KinkyDungeonStatStaminaRegenPerSlowLevel = -0.1; // It costs stamina to move while bound
let KinkyDungeonStatStaminaCostStruggle = -1; // It costs stamina to struggle
let KinkyDungeonStatStaminaCostRemove = -0.25; // It costs stamina to struggle
let KinkyDungeonStatStaminaCostTool = -0.1; // It costs stamina to cut, but much less
let KinkyDungeonStatStaminaCostPick = -0.0; // It costs stamina to pick, but much less
let KinkyDungeonStatStaminaCostAttack = -0.5; // Cost to attack
let KinkyDungeonStaminaRate = KinkyDungeonStatStaminaRegen;

// Current Status
let KinkyDungeonStatBeltLevel = 0; // Chastity bra does not add belt level
let KinkyDungeonStatPlugLevel = 0; // Cumulative with front and rear plugs
let KinkyDungeonPlugCount = 0;
let KinkyDungeonStatVibeLevel = 0; // Cumulative with diminishing returns for multiple items
let KinkyDungeonStatEdged = false; // If all vibrating effects are edging, then this will be true

let KinkyDungeonStatArousalGainChaste = -0.1; // Cumulative w/ groin and bra

// Restraint stats

let KinkyDungeonSlowLevel = 0; // Adds to the number of move points you need before you move
let KinkyDungeonMovePoints = 0;

let KinkyDungeonBlindLevelBase = 0; // Base, increased by buffs and such, set to 0 after consumed in UpdateStats
let KinkyDungeonBlindLevel = 0; // Blind level 1: -33% vision, blind level 2: -67% vision, Blind level 3: Vision radius = 1
let KinkyDungeonStatBlind = 0; // Used for temporary blindness
let KinkyDungeonStatFreeze = 0; // Used for temporary freeze
let KinkyDungeonStatBind = 0; // Used for temporary bind
let KinkyDungeonDeaf = false; // Deafness reduces your vision radius to 0 if you are fully blind (blind level 3)
let KinkyDungeonSleepiness = 0; // Sleepiness

// Other stats
let KinkyDungeonGold = 0;
let KinkyDungeonLockpicks = 0;
// 3 types of keys, for 4 different types of padlocks. The last type of padlock requires all 3 types of keys to unlock
// The red keys are one-use only as the lock traps the key
// The green keys are multi-use, but jam often
// The blue keys cannot be picked or cut.
// Monsters are not dextrous enough to steal keys from your satchel, although they may spill your satchel on a nearby tile
let KinkyDungeonRedKeys = 0;
let KinkyDungeonBlueKeys = 0;
// Regular blades are used to cut soft restraints. Enchanted blades turn into regular blades after one use, and can cut magic items
// Some items are trapped with a curse, which will destroy the knife when cut, but otherwise still freeing you
let KinkyDungeonNormalBlades = 1;
let KinkyDungeonEnchantedBlades = 0;

let KinkyDungeonHasCrotchRope = false;

// Combat
let KinkyDungeonTorsoGrabChance = 0.4;
let KinkyDungeonWeaponGrabChance = 1.0;

// Your inventory contains items that are on you
let KinkyDungeonInventory = [];
let KinkyDungeonPlayerTags = new Map();

let KinkyDungeonCurrentDress = "Default";
let KinkyDungeonUndress = 0; // Level of undressedness

// Current list of spells
let KinkyDungeonSpells = [];
let KinkyDungeonPlayerBuffs = {};

// Temp - for multiplayer in future
let KinkyDungeonPlayers = [];

// For items like the cursed collar which make more enemies appear
let KinkyDungeonDifficulty = 0;

let KinkyDungeonSubmissiveMult = 0;

function KinkyDungeonDefaultStats() {
	KinkyDungeonFastMove = true;
	KinkyDungeonResetEventVariables();
	KinkyDungeonSetDress("Default");
	KinkyDungeonSpawnJailers = 0;
	KinkyDungeonSpawnJailersMax = 0;
	KinkyDungeonGold = 0;
	KinkyDungeonLockpicks = 1;
	KinkyDungeonRedKeys = 0;
	KinkyDungeonBlueKeys = 0;
	KinkyDungeonNormalBlades = 1;
	KinkyDungeonEnchantedBlades = 0;

	KDOrigStamina = 36;
	KDOrigMana = 36;
	KDOrigArousal = 0;

	KinkyDungeonHasCrotchRope = false;

	KinkyDungeonSubmissiveMult = 0;

	KinkyDungeonOrbsPlaced = [];
	KinkyDungeonChestsOpened = [];

	KinkyDungeonPlayerWeapon = null;
	KinkyDungeonSpellPoints = 3;

	KinkyDungeonStatArousalMax = 36;
	KinkyDungeonStatStaminaMax = 36;
	KinkyDungeonStatManaMax = 36;
	KinkyDungeonStaminaRate = KinkyDungeonStatStaminaRegen;

	KinkyDungeonStatBlind = 0;
	KinkyDungeonSlowMoveTurns = 0;
	KinkyDungeonSleepTurns = 0;
	KinkyDungeonStatBind = 0;
	KinkyDungeonStatFreeze = 0;

	KinkyDungeonStatArousal = 0;
	KinkyDungeonStatStamina = KinkyDungeonStatStaminaMax;
	KinkyDungeonStatMana = KinkyDungeonStatManaMax;

	KinkyDungeonMovePoints = 0;
	KinkyDungeonInventory = [];
	KinkyDungeonChangeConsumable(KinkyDungeonConsumables.PotionMana, 1);
	KinkyDungeonChangeConsumable(KinkyDungeonConsumables.PotionStamina, 1);
	KinkyDungeonChangeConsumable(KinkyDungeonConsumables.PotionFrigid, 1);
	KinkyDungeonInventoryAddWeapon("Knife");
	KinkyDungeonPlayerTags = new Map();

	KinkyDungeonPlayerDamage = KinkyDungeonPlayerDamageDefault;

	// Initialize all the other systems
	KinkyDungeonResetMagic();
	KinkyDungeonInitializeDresses();
	KinkyDungeonDressPlayer();
	KinkyDungeonShrineInit();
}

function KinkyDungeonGetVisionRadius() {
	return (KinkyDungeonSleepTurns > 2) ? 1 : (Math.max((KinkyDungeonDeaf || KinkyDungeonStatBlind > 0) ? 1 : (KinkyDungeonBlindLevel > 2) ? 2 : 3, Math.floor(KinkyDungeonMapBrightness*(1.0 - 0.25 * KinkyDungeonBlindLevel))));
}

function KinkyDungeonDealDamage(Damage) {
	let dmg = Damage.damage;
	let type = Damage.type;
	let armor = KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Armor");
	let arousalTypesWeakNeg = ["pain"];
	let arousalTypesWeak = ["grope"];
	let arousalTypesStrong = ["tickle", "charm", "happygas"];
	let staminaTypesWeak = ["electric", "tickle", "drain"];
	let staminaTypesStrong = ["glue", "ice", "cold", "pain", "crush", "chain", "fire", "grope", "poison", "stun"];
	let manaTypesWeak = ["electric", "poison"];
	let manaTypesString = ["drain"];
	if (armor) dmg = Math.max(0, dmg - armor);
	if (arousalTypesWeak.includes(type)) {
		KinkyDungeonChangeArousal(Math.ceil(dmg/2));
	}
	if (arousalTypesWeakNeg.includes(type)) {
		KinkyDungeonChangeArousal(Math.ceil(-dmg/2));
	}
	if (arousalTypesStrong.includes(type)) {
		KinkyDungeonChangeArousal(dmg);
	}
	if (staminaTypesStrong.includes(type)) {
		KinkyDungeonChangeStamina(-dmg);
	} else if (staminaTypesWeak.includes(type)) {
		KinkyDungeonChangeStamina(-Math.ceil(dmg/2));
	}
	if (manaTypesString.includes(type)) {
		KinkyDungeonChangeMana(-dmg);
	} else if (manaTypesWeak.includes(type)) {
		KinkyDungeonChangeMana(-Math.ceil(dmg/2));
	}
	KinkyDungeonSleepTurns = 0;

	if (KinkyDungeonStatFreeze > 0) {
		KinkyDungeonChangeStamina(-dmg);
		KinkyDungeonStatFreeze = 0;
	}

	return dmg;
}

let KDOrigStamina = 36;
let KDOrigMana = 36;
let KDOrigArousal = 36;

function KinkyDungeonChangeArousal(Amount) {
	KinkyDungeonStatArousal += Amount;
	if (Math.abs(KDOrigArousal - Math.floor(KinkyDungeonStatArousal)) >= 0.99) {
		KinkyDungeonSendFloater(KinkyDungeonPlayerEntity, Math.floor(KinkyDungeonStatArousal) - KDOrigArousal, "#ff00ff", undefined, undefined, " ap");
		KDOrigArousal = Math.floor(KinkyDungeonStatArousal);
	}
}
function KinkyDungeonChangeStamina(Amount) {
	KinkyDungeonStatStamina += Amount;
	if (Math.abs(KDOrigStamina - Math.floor(KinkyDungeonStatStamina)) >= 0.99) {
		KinkyDungeonSendFloater(KinkyDungeonPlayerEntity, Math.floor(KinkyDungeonStatStamina) - KDOrigStamina, "#44ff66", undefined, undefined, " sp");
		KDOrigStamina = Math.floor(KinkyDungeonStatStamina);
	}
}
function KinkyDungeonChangeMana(Amount) {
	KinkyDungeonStatMana += Amount;
	if (Math.abs(KDOrigMana - Math.floor(KinkyDungeonStatMana)) >= 0.99) {
		KinkyDungeonSendFloater(KinkyDungeonPlayerEntity, Math.floor(KinkyDungeonStatMana) - KDOrigMana, "#4499ff", undefined, undefined, " mp");
		KDOrigMana = Math.floor(KinkyDungeonStatMana);
	}
}

function KinkyDungeonHasStamina(Cost, AddRate) {
	let s = KinkyDungeonStatStamina;
	if (AddRate) s += KinkyDungeonStaminaRate;

	return s >= Cost;
}
function KinkyDungeonHasMana(Cost, AddRate) {
	let s = KinkyDungeonStatMana;
	if (AddRate) s += KinkyDungeonStatManaRate;

	return s >= Cost;
}

function KinkyDungeonSetMaxStats() {
	// Upgradeable stats
	KinkyDungeonStatStaminaMax = 36;
	KinkyDungeonStatArousalMax = 36;
	KinkyDungeonStatManaMax = 36;
	KinkyDungeonSpellChoiceCount = 3;
	KinkyDungeonSummonCount = 2;
	let arousalRate = 0;

	for (let s of KinkyDungeonSpells) {
		if (s.name == "SPUp1" || s.name == "SPUp2" || s.name == "SPUp3") KinkyDungeonStatStaminaMax += 12;
		if (s.name == "MPUp1" || s.name == "MPUp2" || s.name == "MPUp3") KinkyDungeonStatManaMax += 12;
		if (s.name == "SpellChoiceUp1" || s.name == "SpellChoiceUp2") KinkyDungeonSpellChoiceCount += 1;
		if (s.name == "SummonUp1" || s.name == "SummonUp2") KinkyDungeonSummonCount += 1;
		if (s.name == "APUp1" || s.name == "APUp2" || s.name == "APUp3") {
			KinkyDungeonStatArousalMax += 12;
			arousalRate += KinkyDungeonStatArousalRegenPerUpgrade;
		}
	}
	return arousalRate;
}

function KinkyDungeonCanUseWeapon() {
	return !InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemHands"), "Block", true) && !InventoryGroupIsBlockedForCharacter(KinkyDungeonPlayer, "ItemHands");
}

function KinkyDungeonUpdateStats(delta) {
	KinkyDungeonPlayers = [KinkyDungeonPlayerEntity];
	// Initialize
	KinkyDungeonCalculateVibeLevel();
	KinkyDungeonDifficulty = KinkyDungeonNewGame * 20;

	let arousalRate = (KinkyDungeonVibeLevel == 0) ? KinkyDungeonStatArousalRegen : (KinkyDungeonArousalPerVibe * KinkyDungeonVibeLevel);

	arousalRate += KinkyDungeonSetMaxStats();

	// Dont regen while exhausted
	if (KinkyDungeonStatWillpowerExhaustion > 0) {
		KinkyDungeonStatWillpowerExhaustion = Math.max(0, KinkyDungeonStatWillpowerExhaustion - delta);
		KinkyDungeonStaminaRate = 0;
		KinkyDungeonStatManaRate = 0;
	} else {
		let sleepRegen = KinkyDungeonStatStaminaRegenSleep;
		if (KinkyDungeonMapGet(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y) == 'B') sleepRegen *= 2;
		KinkyDungeonStaminaRate = KinkyDungeonSleepTurns > 0  && KinkyDungeonSleepTurns < KinkyDungeonSleepTurnsMax - 1? sleepRegen : KinkyDungeonStatStaminaRegen;
		KinkyDungeonStatManaRate = (KinkyDungeonStatMana < KinkyDungeonStatManaRegenLowThreshold) ? KinkyDungeonStatManaLowRegen : KinkyDungeonStatManaRegen;
	}

	// Arousal reduces staminal regen
	KinkyDungeonStaminaRate += KinkyDungeonStatArousal / 100 * KinkyDungeonStatArousalRegenStaminaRegenFactor;

	// Update the player tags based on the player's groups
	KinkyDungeonPlayerTags = KinkyDungeonUpdateRestraints(delta);

	KinkyDungeonBlindLevel = Math.max(KinkyDungeonBlindLevelBase, KinkyDungeonPlayer.GetBlindLevel());
	if (KinkyDungeonStatBlind > 0) KinkyDungeonBlindLevel = 3;
	KinkyDungeonDeaf = KinkyDungeonPlayer.IsDeaf();

	// Unarmed damage calc
	KinkyDungeonPlayerDamage = KinkyDungeonGetPlayerWeaponDamage(KinkyDungeonCanUseWeapon());

	if (!KinkyDungeonPlayer.CanInteract()) {
		KinkyDungeonPlayerDamage.chance /= 2;
	}
	if (!KinkyDungeonPlayer.CanWalk() && KinkyDungeonPlayerDamage.unarmed) {
		KinkyDungeonPlayerDamage.dmg /= 2;
	}
	if (KinkyDungeonPlayer.Pose.includes("Hogtied") || KinkyDungeonPlayer.Pose.includes("Kneel")) {
		KinkyDungeonPlayerDamage.chance /= 1.5;
	}

	KinkyDungeonUpdateStruggleGroups();

	KinkyDungeonDressPlayer();
	// Slowness calculation
	KinkyDungeonCalculateSlowLevel();
	let sleepRate = KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Sleepiness");
	if ((sleepRate && sleepRate > 0) || KinkyDungeonSleepiness > 0) {
		KinkyDungeonSleepiness = Math.min(5, KinkyDungeonSleepiness + sleepRate * delta);
		if (KinkyDungeonSleepiness > 2.99) {
			KinkyDungeonSlowLevel = Math.max(KinkyDungeonSlowLevel, 2);
			KinkyDungeonBlindLevel = Math.max(KinkyDungeonBlindLevel + 1, 3);
			KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {id: "Sleepy", aura: "#222222", type: "AttackStamina", duration: 3, power: -1, player: true, enemies: false, tags: ["attack", "stamina"]});
		} else if (KinkyDungeonSleepiness > 2) {
			KinkyDungeonBlindLevel = Math.max(KinkyDungeonBlindLevel, 2);
		} else if (KinkyDungeonSleepiness > 1) {
			KinkyDungeonBlindLevel = Math.max(KinkyDungeonBlindLevel, 1);
		}
		if (KinkyDungeonSleepiness > 0) {
			KinkyDungeonSendActionMessage(4, TextGet("KinkyDungeonSleepy"), "red", 1);
		}
	}
	if ((!sleepRate || sleepRate <= 0) && KinkyDungeonSleepiness > 0) KinkyDungeonSleepiness = Math.max(0, KinkyDungeonSleepiness - delta);

	// Cap off the values between 0 and maximum
	KinkyDungeonStatArousal += arousalRate*delta;
	KinkyDungeonStatStamina += KinkyDungeonStaminaRate*delta;
	KinkyDungeonStatMana += KinkyDungeonStatManaRate;
	KinkyDungeonStatBlind = Math.max(0, KinkyDungeonStatBlind - delta);
	KinkyDungeonStatFreeze = Math.max(0, KinkyDungeonStatFreeze - delta);
	KinkyDungeonStatBind = Math.max(0, KinkyDungeonStatBind - delta);

	KinkyDungeonCapStats();

	for (let item of KinkyDungeonInventory) {
		if (item.restraint) {
			if (item.restraint.difficultyBonus) {
				KinkyDungeonDifficulty += item.restraint.difficultyBonus;
			}
			if (item.restraint.crotchrope) KinkyDungeonHasCrotchRope = true;
		}
	}
	KinkyDungeonSubmissiveMult = KinkyDungeonCalculateSubmissiveMult();

}

function KinkyDungeonCapStats() {
	KinkyDungeonStatArousal = Math.max(0, Math.min(KinkyDungeonStatArousal, KinkyDungeonStatArousalMax));
	KinkyDungeonStatStamina = Math.max(0, Math.min(KinkyDungeonStatStamina, KinkyDungeonStatStaminaMax));
	KinkyDungeonStatMana = Math.max(0, Math.min(KinkyDungeonStatMana, KinkyDungeonStatManaMax));
}

function KinkyDungeonCalculateVibeLevel() {
	let oldVibe = KinkyDungeonVibeLevel;
	KinkyDungeonVibeLevel = 0;
	KinkyDungeonStatPlugLevel = 0;
	KinkyDungeonPlugCount = 0;
	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
		if (KinkyDungeonInventory[I] && KinkyDungeonInventory[I].restraint) {
			if (KinkyDungeonInventory[I].restraint.intensity) {
				let vibe = KinkyDungeonInventory[I].restraint;
				let drain = vibe.battery - Math.max(0, vibe.battery - KinkyDungeonVibeCostPerIntensity * vibe.intensity);
				if (drain > 0)
					KinkyDungeonVibeLevel = Math.max(KinkyDungeonVibeLevel + drain/4, drain);

				vibe.battery = Math.max(0, vibe.battery - drain);
			}
			if (KinkyDungeonInventory[I].restraint.plugSize) {
				let size = KinkyDungeonInventory[I].restraint.plugSize;
				KinkyDungeonStatPlugLevel = Math.max(KinkyDungeonStatPlugLevel + size/2, size);
				KinkyDungeonPlugCount += 1;
			}
		}
	}

	if (oldVibe > 0 && KinkyDungeonVibeLevel == 0) {
		if (!KinkyDungeonSendTextMessage(2, TextGet("KinkyDungeonEndVibe"), "#FFaadd", 2)) KinkyDungeonSendActionMessage(2, TextGet("KinkyDungeonEndVibe"), "#FFaadd", 2);
	}

	if (KinkyDungeonVibeLevel > 0) {
		KinkyDungeonSendTextMessage(0, TextGet("KinkyDungeonVibing" + Math.max(0, Math.min(Math.floor(KinkyDungeonVibeLevel / 0.2), 4))), "#FFaadd", 1, true);
	}
}

function KinkyDungeonCanOrgasm() {
	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
		if (KinkyDungeonInventory[I] && KinkyDungeonInventory[I].restraint && KinkyDungeonInventory[I].restraint.orgasm) {
			return true;
		}
	}
	return false;
}

function KinkyDungeonLegsBlocked() {
	if (KinkyDungeonPlayer.Pose.includes("Hogtie")) return true;
	for (let inv of KinkyDungeonRestraintList()) {
		if (inv.restraint && inv.restraint.blockfeet) return true;
	}
	return false;
}

function KinkyDungeonCalculateSlowLevel() {
	KinkyDungeonSlowLevel = Math.max(0, KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "SlowLevel") ? KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "SlowLevel") : 0);
	if (KinkyDungeonPlayer.IsMounted() || KinkyDungeonPlayer.Effect.indexOf("Tethered") >= 0 || KinkyDungeonPlayer.IsEnclose()) {KinkyDungeonSlowLevel += 100; KinkyDungeonMovePoints = -1;}
	else {
		/*let boots = KinkyDungeonGetRestraintItem("ItemBoots");
		if (InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemLegs"), "Block", true)
			|| InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemLegs"), "KneelFreeze", true)
			|| InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemLegs"), "Freeze", true)
			|| InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemLegs"), "Slow", true)) KinkyDungeonSlowLevel += 1.0;
		if (InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemFeet"), "Block", true)
			|| InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemFeet"), "Freeze", true)
			|| InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemFeet"), "Slow", true)) KinkyDungeonSlowLevel += 1;
		if (boots && boots.restraint && (boots.restraint.slowboots
			|| InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemBoots"), "Block", true)
			|| InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemBoots"), "Freeze", true)
			|| InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemBoots"), "Slow", true))) KinkyDungeonSlowLevel += 1.0;*/
		for (let inv of KinkyDungeonRestraintList()) {
			if (inv.restraint && (inv.restraint.blockfeet || inv.restraint.hobble)) KinkyDungeonSlowLevel += 1;
		}
		if (KinkyDungeonStatStamina < 0.5 || KinkyDungeonPlayer.Pose.includes("Kneel")) KinkyDungeonSlowLevel = Math.max(3, KinkyDungeonSlowLevel + 1);
		if (KinkyDungeonPlayer.Pose.includes("Hogtied")) KinkyDungeonSlowLevel = Math.max(4, KinkyDungeonSlowLevel + 1);
		for (let inv of KinkyDungeonRestraintList()) {
			if (inv.restraint && inv.restraint.freeze) KinkyDungeonSlowLevel = Math.max(2, KinkyDungeonSlowLevel);
		}
	}
}

function KinkyDungeonCalculateSubmissiveMult() {
	let base = 0;
	for (let item of KinkyDungeonRestraintList()) {
		if (item.restraint) {
			let power = Math.sqrt(Math.max(0, KinkyDungeonGetLockMult(item.lock) * item.restraint.power));
			base = Math.max(power, base + power/5);
		}
	}

	base *= 0.28;

	let mult = Math.max(0, 0.1 + 0.9 * (KinkyDungeonGoddessRep.Ghost + 50)/100);
	let amount = Math.max(0, base * mult);
	//console.log(amount);
	return amount;
}