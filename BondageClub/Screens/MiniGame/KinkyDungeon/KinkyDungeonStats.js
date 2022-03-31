"use strict";
// Player entity
let KinkyDungeonPlayerEntity = null; // The current player entity

// Arousal -- It lowers your stamina regen
let KinkyDungeonStatMaxMax = 72; // Maximum any stat can get boosted to


let KinkyDungeonStatArousalMax = 36;
let KinkyDungeonArousalUnlockSuccessMod = 0.5; // Determines how much harder it is to insert a key while aroused. 1.0 is half success chance, 2.0 is one-third, etc.
let KinkyDungeonStatArousal = 0;
let KinkyDungeonCrotchRopeArousal = 0.5;
let KinkyDungeonStatArousalRegen = -0.25;
let KinkyDungeonStatArousalRegenPerUpgrade = -0.05;
let KDNoUnchasteBraMult = 0.9;
let KDNoUnchasteMult = 0.5;
let KDUnchasteMult = 0.25;
let KDPurityAmount = 0.25;
let KDFreeSpiritAmount = 0.2;
let KDDeprivedAmount = 0.05;
let KDDistractedAmount = 0.15;
let KinkyDungeonStatArousalRegenStaminaRegenFactor = -0.1; // Stamina drain per time per 100 arousal
let KinkyDungeonStatArousalMiscastChance = 0.6; // Miscast chance at max arousal
let KinkyDungeonMiscastChance = 0;
let KinkyDungeonVibeLevel = 0;
let KinkyDungeonOrgasmVibeLevel = 0;
let KinkyDungeonArousalPerVibe = 0.5; // How much arousal per turn per vibe energy cost
let KinkyDungeonArousalPerPlug = 0.25; // How much arousal per move per plug level
let KinkyDungeonVibeCostPerIntensity = 0.15;

let KinkyDungeonStatWillpowerExhaustion = 0;
let KinkyDungeonSleepTurnsMax = 41;
let KinkyDungeonSlowMoveTurns = 0;
// Note that things which increase max arousal (aphrodiasic) also increase the max stamina drain. This can end up being very dangerous as being edged at extremely high arousal will drain all your energy completely, forcing you to wait until the torment is over or the drugs wear off

// Stamina -- your MP. Used to cast spells and also struggle
let KinkyDungeonStatStaminaMax = 36;
let KinkyDungeonStatStamina = KinkyDungeonStatStaminaMax;
let KinkyDungeonStatStaminaRegen = 0;
let KDNarcolepticRegen = -0.06;
let KinkyDungeonStatStaminaRegenSleep = 36/40;
let KinkyDungeonStatStaminaRegenSleepBedMultiplier = 1.5;
let KinkyDungeonStatStaminaRegenWait = 0;
let KinkyDungeoNStatStaminaLow = 4;
let KinkyDungeonStatManaMax = 36;
let KinkyDungeonStatMana = KinkyDungeonStatManaMax;
let KinkyDungeonStatManaRate = 0;
let KinkyDungeonStatManaRegen = 0; // How fast stamina that is converted to mana regenerates
let KinkyDungeonStatManaLowRegen = 0; // How fast stamina that is converted to mana regenerates when low
let KDMeditationRegen = 0.25;
let KinkyDungeonStatManaRegenLowThreshold = 4; // Threshold for fast mana regen
let KinkyDungeonStatStaminaRegenPerSlowLevel = -0.03; // It costs stamina to move while bound
let KinkyDungeonStatStaminaCostStruggle = -1; // It costs stamina to struggle
let KinkyDungeonStatStaminaCostRemove = -0.25; // It costs stamina to struggle
let KinkyDungeonStatStaminaCostTool = -0.1; // It costs stamina to cut, but much less
let KinkyDungeonStatStaminaCostPick = -0.0; // It costs stamina to pick, but much less
let KinkyDungeonStatStaminaCostAttack = -1.0; // Cost to attack
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

/**
 * Your inventory contains items that are on you
 * @type {Map<string, Map<string, item>>}
 */
let KinkyDungeonInventory = new Map();
function KDInitInventory() {
	KinkyDungeonInventory = new Map();
	for (const c of [Consumable, Restraint, LooseRestraint, Weapon, Outfit]) {
		KinkyDungeonInventory.set(c, new Map());
	}
}

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

let KinkyDungeonSpellPoints = 3;

function KinkyDungeonDefaultStats() {
	KinkyDungeonPenanceCosts = {};
	KinkyDungeonLostItems = [];
	KinkyDungeonFastMove = true;
	KinkyDungeonResetEventVariables();
	KinkyDungeonSetDress("Default", "OutfitDefault");
	KDGameData.KinkyDungeonSpawnJailers = 0;
	KDGameData.KinkyDungeonSpawnJailersMax = 0;
	KinkyDungeonGold = 0;
	KinkyDungeonLockpicks = 1;
	if (KinkyDungeonDifficultyMode == 2 || KinkyDungeonDifficultyMode == 3) KinkyDungeonLockpicks = 0;
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
	KinkyDungeonCachesPlaced = [];
	KinkyDungeonHeartsPlaced = [];
	KinkyDungeonChestsOpened = [];

	KDSetWeapon(null);
	KinkyDungeonSpellPoints = 3;

	KinkyDungeonStatArousalMax = 36;
	KinkyDungeonStatStaminaMax = 36;
	KinkyDungeonStatManaMax = 36;
	KinkyDungeonStaminaRate = KinkyDungeonStatStaminaRegen;

	KinkyDungeonStatBlind = 0;
	KinkyDungeonSlowMoveTurns = 0;
	KDGameData.SleepTurns = 0;
	KinkyDungeonStatBind = 0;
	KinkyDungeonStatFreeze = 0;

	KinkyDungeonStatArousal = 0;
	KinkyDungeonStatStamina = KinkyDungeonStatStaminaMax;
	KinkyDungeonStatMana = KinkyDungeonStatManaMax;

	KinkyDungeonPlayerBuffs = {};

	KinkyDungeonMovePoints = 0;
	KDInitInventory();
	KinkyDungeonInventoryAdd({name: "OutfitDefault", type: Outfit});
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

	if (KinkyDungeonStatsChoice.get("Submissive")) KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("BasicCollar"), 0, true, "Red");
	if (KinkyDungeonStatsChoice.get("Pacifist")) KinkyDungeonInventoryAddWeapon("Rope");
	if (KinkyDungeonStatsChoice.get("Unchained")) KinkyDungeonRedKeys += 1;
	if (KinkyDungeonStatsChoice.get("Artist")) KinkyDungeonNormalBlades += 1;
}

function KinkyDungeonGetVisionRadius() {
	return (KDGameData.SleepTurns > 2) ? 1 : (Math.max((KinkyDungeonDeaf || KinkyDungeonStatBlind > 0) ? 1 : (KinkyDungeonBlindLevel > 2) ? 2 : 3, Math.floor(KinkyDungeonMapBrightness*(1.0 - 0.25 * KinkyDungeonBlindLevel))));
}

function KinkyDungeonInterruptSleep() {
	KDGameData.SleepTurns = 0;
	KDGameData.PlaySelfTurns = 0;
}

function KinkyDungeonDealDamage(Damage) {
	let dmg = Damage.damage;
	let type = Damage.type;
	let armor = Math.max(0, KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Armor"));
	let arousalTypesWeakNeg = ["pain"];
	let arousalTypesWeak = ["grope"];
	let arousalTypesStrong = ["tickle", "charm", "souldrain", "happygas"];
	let staminaTypesWeak = ["electric", "tickle", "drain"];
	let staminaTypesStrong = ["glue", "ice", "frost", "cold", "pain", "crush", "chain", "fire", "grope", "poison", "stun", "pierce", "slash", "unarmed", "souldrain"];
	let manaTypesWeak = ["electric", "poison", "souldrain"];
	let manaTypesString = ["drain"];

	if (KinkyDungeonMapGet(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y) == 'w') {
		staminaTypesWeak.splice(staminaTypesWeak.indexOf("electric"), 1);
		staminaTypesStrong.push("electric");
		manaTypesWeak.splice(manaTypesWeak.indexOf("electric"), 1);
		manaTypesString.push("electric");
	}

	if (armor) dmg = Math.max(0, dmg - armor);

	if (dmg > 0) {
		let buffreduction = KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "DamageReduction");
		if (buffreduction && dmg > 0) {
			dmg = Math.max(dmg - buffreduction, 0);
			KinkyDungeonTickBuffTag(KinkyDungeonPlayerBuffs, "damageTaken", 1);
			KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Shield.ogg");
		}
	}


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
	KinkyDungeonInterruptSleep();

	if (KinkyDungeonStatFreeze > 0 && KinkyDungeonMeleeDamageTypes.includes(type)) {
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
	KinkyDungeonStatArousal = Math.min(Math.max(0, KinkyDungeonStatArousal), KinkyDungeonStatArousalMax);
	if (Math.abs(KDOrigArousal - Math.floor(KinkyDungeonStatArousal)) >= 0.99) {
		KinkyDungeonSendFloater(KinkyDungeonPlayerEntity, Math.floor(KinkyDungeonStatArousal) - KDOrigArousal, "#ff00ff", undefined, undefined, " ap");
		KDOrigArousal = Math.floor(KinkyDungeonStatArousal);
	}
}
function KinkyDungeonChangeStamina(Amount) {
	KinkyDungeonStatStamina += Amount;
	KinkyDungeonStatStamina = Math.min(Math.max(0, KinkyDungeonStatStamina), KinkyDungeonStatStaminaMax);
	if (Math.abs(KDOrigStamina - Math.floor(KinkyDungeonStatStamina)) >= 0.99) {
		KinkyDungeonSendFloater(KinkyDungeonPlayerEntity, Math.floor(KinkyDungeonStatStamina) - KDOrigStamina, "#44ff66", undefined, undefined, " sp");
		KDOrigStamina = Math.floor(KinkyDungeonStatStamina);
	}
}
function KinkyDungeonChangeMana(Amount) {
	KinkyDungeonStatMana += Amount;
	KinkyDungeonStatMana = Math.min(Math.max(0, KinkyDungeonStatMana), KinkyDungeonStatManaMax);
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
		if (s.name == "SPUp1" || s.name == "SPUp2" || s.name == "SPUp3") KinkyDungeonStatStaminaMax += 8;
		if (s.name == "MPUp1" || s.name == "MPUp2" || s.name == "MPUp3") KinkyDungeonStatManaMax += 12;
		if (s.name == "SpellChoiceUp1" || s.name == "SpellChoiceUp2") KinkyDungeonSpellChoiceCount += 1;
		if (s.name == "SummonUp1" || s.name == "SummonUp2") KinkyDungeonSummonCount += 1;
		if (s.name == "APUp1" || s.name == "APUp2" || s.name == "APUp3") {
			KinkyDungeonStatStaminaMax += 4;
			KinkyDungeonStatArousalMax += 12;
			arousalRate += KinkyDungeonStatArousalRegenPerUpgrade;
		}
	}
	return arousalRate;
}

function KinkyDungeonCanUseWeapon(NoOverride, e) {
	let flags = {
		HandsFree: false,
	};
	if (!NoOverride)
		KinkyDungeonSendEvent("getWeapon", {event: e, flags: flags});
	return (flags.HandsFree || !KinkyDungeonIsHandsBound() || KinkyDungeonPlayerDamage.noHands);
}

let KDBlindnessCap = 0;

function KinkyDungeonUpdateStats(delta) {
	KinkyDungeonPlayers = [KinkyDungeonPlayerEntity];

	KDBlindnessCap = 3;
	KinkyDungeonSendEvent("calcStats", {});
	// Initialize
	KinkyDungeonCalculateVibeLevel(delta);
	if (KinkyDungeonVibeLevel > 0 && KinkyDungeonCanPlayWithSelf() && KDGameData.SleepTurns > 0) {
		KinkyDungeonInterruptSleep();
		KinkyDungeonSendActionMessage(5, TextGet("KinkyDungeonSleepDeprivation"), "pink", 3);
	}
	KinkyDungeonDifficulty = KinkyDungeonNewGame * 20;

	let arousalRate = (KinkyDungeonVibeLevel == 0) ? (KDGameData.PlaySelfTurns < 1 ? KinkyDungeonStatArousalRegen*((KinkyDungeonStatsChoice.get("Unchaste") && KinkyDungeonChastityMult() > 0.9) ? KDUnchasteMult :
		(KinkyDungeonChastityMult() > 0.9 ? KDNoUnchasteMult : (KinkyDungeonChastityMult() > 0 ? KDNoUnchasteBraMult : 1.0))) : 0) : (KinkyDungeonArousalPerVibe * KinkyDungeonVibeLevel);
	if (KinkyDungeonStatsChoice.get("Purity")) {
		arousalRate -= KDPurityAmount;
	}
	if (KinkyDungeonStatsChoice.get("FreeSpirit")) {
		arousalRate += KDFreeSpiritAmount;
	}
	if (KDGameData.OrgasmStamina > 0) {
		let amount = KDGameData.OrgasmStamina/12;
		KDGameData.OrgasmStamina = Math.max(0, KDGameData.OrgasmStamina*0.98 - delta/70);
		arousalRate += -amount;
	}
	if (KinkyDungeonStatsChoice.get("Deprived") && KinkyDungeonChastityMult() > 0.9) {
		if (arousalRate < 0) arousalRate = KDDeprivedAmount;
	}

	if (KDGameData.OrgasmStage > 0 && KDRandom() < 0.25 && KinkyDungeonStatArousal < KinkyDungeonStatArousalMax * 0.75) KDGameData.OrgasmStage = Math.max(0, KDGameData.OrgasmStage - delta);
	if (KinkyDungeonStatArousal >= KinkyDungeonStatArousalMax * 0.99) KDGameData.OrgasmTurns = Math.min(KDGameData.OrgasmTurns + delta, KinkyDungeonOrgasmTurnsMax);
	else KDGameData.OrgasmTurns = Math.max(KDGameData.OrgasmTurns - delta, 0);

	let arousalBonus = KinkyDungeonSetMaxStats();
	if (KDGameData.PlaySelfTurns < 1) arousalRate += arousalBonus;

	let sleepRegen = KinkyDungeonStatStaminaRegenSleep * KinkyDungeonStatStaminaMax / 36;
	if (KinkyDungeonMapGet(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y) == 'B') sleepRegen *= 2;
	let stamRegen = KinkyDungeonStatsChoice.get("Narcoleptic") ? KDNarcolepticRegen : KinkyDungeonStatStaminaRegen;
	KinkyDungeonStaminaRate = KDGameData.SleepTurns > 0  && KDGameData.SleepTurns < KinkyDungeonSleepTurnsMax - 1? sleepRegen : stamRegen;
	KinkyDungeonStatManaRate = (KinkyDungeonStatMana < KinkyDungeonStatManaRegenLowThreshold && KinkyDungeonStatsChoice.get("Meditation")) ? KDMeditationRegen : 0;

	// Update the player tags based on the player's groups
	KinkyDungeonPlayerTags = KinkyDungeonUpdateRestraints(delta);

	let blind = Math.max(KinkyDungeonBlindLevelBase, KinkyDungeonGetBlindLevel());
	if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Blindness")) blind = Math.max(0, blind + KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Blindness"));
	KinkyDungeonBlindLevel = Math.min(KDBlindnessCap, blind);
	if (KinkyDungeonStatBlind > 0) KinkyDungeonBlindLevel = 3;
	KinkyDungeonDeaf = KinkyDungeonPlayer.IsDeaf();

	// Unarmed damage calc
	KinkyDungeonPlayerDamage = KinkyDungeonGetPlayerWeaponDamage(KinkyDungeonCanUseWeapon());

	KinkyDungeonUpdateStruggleGroups();

	KinkyDungeonDressPlayer();
	// Slowness calculation
	KinkyDungeonCalculateSlowLevel();
	let sleepRate = KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Sleepiness");
	if ((sleepRate && sleepRate > 0) || KinkyDungeonSleepiness > 0) {
		KinkyDungeonSleepiness = Math.min(8, KinkyDungeonSleepiness + sleepRate * delta);
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
	KDOrigArousal = Math.floor(KinkyDungeonStatArousal);
	KinkyDungeonStatStamina += KinkyDungeonStaminaRate*delta;
	KinkyDungeonStatMana += KinkyDungeonStatManaRate;

	if (KDGameData.OrgasmTurns > KinkyDungeonOrgasmTurnsCrave) {
		KinkyDungeonChangeStamina(KinkyDungeonOrgasmExhaustionAmount * (KinkyDungeonStatsChoice.get("Willpower") ? KDWillpowerMultiplier : 1.0));
		let vibe = KinkyDungeonVibeLevel > 0 ? "Vibe" : "";
		KinkyDungeonSendTextMessage(4, TextGet("KinkyDungeonOrgasmExhaustion" + vibe), "red", 2, false, true);
	}

	KinkyDungeonStatBlind = Math.max(0, KinkyDungeonStatBlind - delta);
	KinkyDungeonStatFreeze = Math.max(0, KinkyDungeonStatFreeze - delta);
	KinkyDungeonStatBind = Math.max(0, KinkyDungeonStatBind - delta);

	KinkyDungeonCapStats();

	KinkyDungeonCalculateMiscastChance();

	KinkyDungeonHasCrotchRope = false;

	for (let item of KinkyDungeonFullInventory()) {
		if (item.restraint) {
			if (item.restraint.difficultyBonus) {
				KinkyDungeonDifficulty += item.restraint.difficultyBonus;
			}
			if (item.restraint.crotchrope) KinkyDungeonHasCrotchRope = true;
			if (item.restraint.enchantedDrain) {
				if (KDGameData.AncientEnergyLevel > 0) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - item.restraint.enchantedDrain * delta);
			}
		}
	}
	KinkyDungeonSubmissiveMult = KinkyDungeonCalculateSubmissiveMult();

}

function KinkyDungeonCalculateMiscastChance() {
	let flags = {
		miscastChance: Math.max(0, KinkyDungeonStatArousalMiscastChance * Math.min(1, KinkyDungeonStatArousal / KinkyDungeonStatArousalMax)),
	};
	if (KinkyDungeonStatsChoice.get("Distracted")) flags.miscastChance += KDDistractedAmount;
	KinkyDungeonSendEvent("calcMiscast", {flags: flags});
	KinkyDungeonMiscastChance = flags.miscastChance;
}

function KinkyDungeonGetBlindLevel() {
	let blindness = 0;
	for (let inv of KinkyDungeonAllRestraint()) {
		if (inv.restraint && inv.restraint.blindfold) blindness = Math.max(blindness + 1, inv.restraint.blindfold);
	}
	return blindness ? blindness : 0;
}

function KinkyDungeonCapStats() {
	KinkyDungeonStatArousal = Math.max(0, Math.min(KinkyDungeonStatArousal, KinkyDungeonStatArousalMax));
	KinkyDungeonStatStamina = Math.max(0, Math.min(KinkyDungeonStatStamina, KinkyDungeonStatStaminaMax));
	KinkyDungeonStatMana = Math.max(0, Math.min(KinkyDungeonStatMana, KinkyDungeonStatManaMax));
}

/*
 * Gets the average deny chance of restraints
 */
function KinkyDungeonGetDenyChance(chance) {
	let avg = 0;
	let total = 0;
	for (let inv of KinkyDungeonAllRestraint()) {
		if (inv.restraint && inv.restraint.denyChance) {
			total += inv.restraint.power;
			if (chance && inv.restraint.denyChanceLikely)
				avg += inv.restraint.denyChanceLikely * inv.restraint.power;
			else
				avg += inv.restraint.denyChance * inv.restraint.power;
		}
	}
	return avg/Math.max(1, total);
}

function KinkyDungeonVibratorsDeny(chance) {
	let toDeny = false;
	let allowDeny = KDRandom() < KinkyDungeonGetDenyChance(chance);
	if (allowDeny)
		for (let inv of KinkyDungeonAllRestraint()) {
			if (inv.restraint && inv.restraint.vibeType && inv.restraint.vibeType.includes("Deny")) {
				inv.deny = inv.restraint.denyTime ? inv.restraint.denyTime : 3;
				toDeny = true;
			}
		}
	return toDeny;
}

function KinkyDungeonCalculateVibeLevel(delta) {
	let oldVibe = KinkyDungeonVibeLevel;
	KinkyDungeonVibeLevel = 0;
	KinkyDungeonOrgasmVibeLevel = 0;
	KinkyDungeonStatPlugLevel = 0;
	KinkyDungeonPlugCount = 0;
	for (let item of KinkyDungeonAllRestraint()) {
		if (item && item.restraint) {
			if (item.restraint.intensity) {
				let vibe = item.restraint;
				if (!item.battery) item.battery = 0;
				if (!(item.battery < 99999999)) item.battery = 0;
				let drain = item.battery - Math.max(0, item.battery - delta * KinkyDungeonVibeCostPerIntensity * vibe.intensity);
				if (item.deny > 0) {
					item.deny = Math.max(0, item.deny - delta);
					drain = 0;
				}
				if (drain > 0) {
					KinkyDungeonVibeLevel = Math.max(KinkyDungeonVibeLevel + drain/4, drain);
					if (vibe.orgasm) KinkyDungeonOrgasmVibeLevel = Math.max(KinkyDungeonOrgasmVibeLevel + drain/4, drain);
				}

				item.battery = Math.max(0, item.battery - drain);
			}
			if (item.restraint.plugSize) {
				let size = item.restraint.plugSize;
				KinkyDungeonStatPlugLevel = Math.max(KinkyDungeonStatPlugLevel + size/2, size);
				KinkyDungeonPlugCount += 1;
			}
			if (item.cooldown > 0)
				item.cooldown = Math.max(0, item.cooldown - delta);
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
	for (let item of KinkyDungeonAllRestraint()) {
		if (item && item.restraint && item.restraint.orgasm) {
			return true;
		}
	}
	return false;
}

function KinkyDungeonLegsBlocked() {
	if (KinkyDungeonPlayer.Pose.includes("Hogtie")) return true;
	for (let inv of KinkyDungeonAllRestraint()) {
		if (inv.restraint && inv.restraint.blockfeet) return true;
	}
	return false;
}

function KinkyDungeonCalculateSlowLevel() {
	KinkyDungeonSlowLevel = 0;
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
		for (let inv of KinkyDungeonAllRestraint()) {
			if (inv.restraint && (inv.restraint.blockfeet || inv.restraint.hobble)) KinkyDungeonSlowLevel += 1;
		}
		for (let inv of KinkyDungeonAllRestraint()) {
			if (inv.restraint && inv.restraint.blockfeet) {
				KinkyDungeonSlowLevel = Math.max(KinkyDungeonSlowLevel, 2);
				break;
			}
		}
		if (KinkyDungeonStatStamina < 0.5 || KinkyDungeonPlayer.Pose.includes("Kneel")) KinkyDungeonSlowLevel = Math.max(3, KinkyDungeonSlowLevel + 1);
		if (KinkyDungeonPlayer.Pose.includes("Hogtied")) KinkyDungeonSlowLevel = Math.max(4, KinkyDungeonSlowLevel + 1);
		for (let inv of KinkyDungeonAllRestraint()) {
			if (inv.restraint && inv.restraint.freeze) KinkyDungeonSlowLevel = Math.max(2, KinkyDungeonSlowLevel);
		}
	}
	let origSlowLevel = KinkyDungeonSlowLevel;
	if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "SlowLevel")) KinkyDungeonSlowLevel += KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "SlowLevel");
	KinkyDungeonSlowLevel = Math.max(0, KinkyDungeonSlowLevel);
	if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "SlowLevelEnergyDrain")) KDGameData.AncientEnergyLevel =
		Math.max(0, KDGameData.AncientEnergyLevel - Math.max(0, origSlowLevel - KinkyDungeonSlowLevel) * KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "SlowLevelEnergyDrain"));
}
/**
 * Returns the total level of gagging, 1.0 or higher meaning "fully gagged" and 0.0 being able to speak.
 * @param   {boolean} [AllowFlags] - Whether or not flags such as allowPotions and blockPotions should override the final result
 * @return  {number} - The gag level, sum of all gag properties of worn restraints
 */
function KinkyDungeonGagTotal(AllowFlags) {
	let total = 0;
	let allow = false;
	let prevent = false;
	for (let inv of KinkyDungeonAllRestraint()) {
		if (inv.restraint && (inv.restraint.gag)) total += inv.restraint.gag;
		if (inv.restraint.allowPotions) allow = true;
	}
	if (AllowFlags) {
		if (prevent) return 1.00;
		else if (allow) return 0.0;
	}
	return total;
}

function KinkyDungeonCanTalk(Loose) {
	for (let inv of KinkyDungeonAllRestraint()) {
		if (inv.restraint && (Loose ? KinkyDungeonGagTotal() >= 0.99 : inv.restraint.gag)) return false;
	}
	return true;
}

function KinkyDungeonCalculateSubmissiveMult() {
	let base = 0;
	for (let item of KinkyDungeonAllRestraint()) {
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

function KinkyDungeonCanPlayWithSelf() {
	return KinkyDungeonStatArousal > KinkyDungeonArousalSleepDeprivationThreshold * KinkyDungeonStatArousalMax && KinkyDungeonHasStamina(-KinkyDungeonOrgasmCost);
}

function KinkyDungeonCanTryOrgasm() {
	return KinkyDungeonStatArousal >= KinkyDungeonStatArousalMax - 0.01 && (KinkyDungeonHasStamina(-KinkyDungeonOrgasmCost) || KDGameData.OrgasmStage > 3) && KDGameData.OrgasmStamina < 1;
}

function KinkyDungeonDoPlayWithSelf() {
	let OrigAmount = KinkyDungeonPlayWithSelfPowerMin + (KinkyDungeonPlayWithSelfPowerMax - KinkyDungeonPlayWithSelfPowerMin)*KDRandom();
	let amount = Math.max(0, OrigAmount - KinkyDungeonChastityMult() * KinkyDungeonPlayWithSelfChastityPenalty);
	if (KinkyDungeonStatsChoice.get("Purity")) {
		KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonPlaySelfPurity"), "#FF5BE9", 4);
		return 0;
	}
	if (KinkyDungeonIsArmsBound()) amount = Math.max(0, Math.min(amount, OrigAmount - KinkyDungeonPlayWithSelfBoundPenalty));
	KinkyDungeonChangeArousal(amount);
	KinkyDungeonChangeStamina(KinkyDungeonPlayCost);
	if (KinkyDungeonIsArmsBound()) {
		KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonPlaySelfBound"), "#FF5BE9", 4);
	} else if (KinkyDungeonChastityMult() > 0.9) {
		KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonChastityDeny"), "#FF5BE9", 4);
	} else KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonPlaySelf"), "#FF5BE9", 4);
	KDGameData.PlaySelfTurns = 3;
	return amount;
}

let KinkyDungeonOrgasmVibeLevelMult = 5;
let KinkyDungeonOrgasmChanceBase = -0.1;
let KinkyDungeonOrgasmChanceScaling = 1.1;
let KinkyDungeonMaxOrgasmStage = 7;
let KinkyDungeonOrgasmStageVariation = 4; // determines the text message variation

let KinkyDungeonArousalSleepDeprivationThreshold = 0.25;
let KinkyDungeonPlaySelfOrgasmThreshold = 3; // Note that it is impossible if you have a belt on, but possible if you only have a bra on

let KinkyDungeonOrgasmTurnsMax = 10;
let KinkyDungeonOrgasmTurnsCrave = 8;
let KinkyDungeonPlayWithSelfPowerMin = 3;
let KinkyDungeonPlayWithSelfPowerMax = 6;
let KinkyDungeonPlayWithSelfChastityPenalty = 5;
let KinkyDungeonPlayWithSelfBoundPenalty = 3;
let KinkyDungeonOrgasmExhaustionAmount = -0.5;

let KDWillpowerMultiplier = 0.5;

let KinkyDungeonOrgasmCost = -8;
let KinkyDungeonEdgeCost = -1;
let KinkyDungeonPlayCost = -0.05;

function KinkyDungeonDoTryOrgasm() {
	let amount = KinkyDungeonOrgasmVibeLevel * KinkyDungeonOrgasmVibeLevelMult;
	let playSelfAmount = KinkyDungeonDoPlayWithSelf();
	//if (playSelfAmount > KinkyDungeonOrgasmVibeLevel) {
	amount += playSelfAmount;
	//}
	let chance = KinkyDungeonOrgasmChanceBase + KinkyDungeonOrgasmChanceScaling*(KDGameData.OrgasmTurns/KinkyDungeonOrgasmTurnsMax);
	let msg = "KinkyDungeonOrgasm";
	let msgTime = 4;

	let denied = KinkyDungeonVibratorsDeny(chance);
	if (!denied && amount > KinkyDungeonPlaySelfOrgasmThreshold && KDRandom() < chance) {
		// You finally shudder and tremble as a wave of pleasure washes over you...
		KinkyDungeonStatBlind = 6;
		KinkyDungeonSlowMoveTurns = 4;
		KDGameData.OrgasmStamina = KinkyDungeonStatArousal;
		KinkyDungeonChangeStamina(KinkyDungeonOrgasmCost);
	} else {
		KinkyDungeonChangeStamina(KinkyDungeonEdgeCost);
		// You close your eyes and breath rapidly in anticipation...
		// You feel frustrated as the stimulation isn't quite enough...
		// You groan with pleasure as you keep close to the edge...
		// You whimper as you rub your legs together furiously...
		// You tilt your head back and moan as your heart beats faster...
		// Your whole body shakes, but you don't quite go over the edge...
		// This is starting to feel like torture...
		// You let out a frustrated scream as the torment continues...
		// You simmer just under the edge, heart racing, breathing quickly...
		// You let out an anguished moan as release dances just out of reach...
		// You squirm helplessly as your futile struggles simply arouse you more...
		KDGameData.OrgasmTurns = Math.min(KDGameData.OrgasmTurns + amount, KinkyDungeonOrgasmTurnsMax); // Progress the meter if you're not ready yet...
		KDGameData.OrgasmStage = Math.min(KinkyDungeonMaxOrgasmStage, KDGameData.OrgasmStage + 1); // Stage of denial
		if (denied && KinkyDungeonVibeLevel > 0) msg = "KinkyDungeonDeny";
		else msg = "KinkyDungeonEdge";
	}

	let msgIndex = Math.min(KinkyDungeonMaxOrgasmStage, KDGameData.OrgasmStage) + Math.floor(Math.random() * KinkyDungeonOrgasmStageVariation);
	KinkyDungeonSendActionMessage(10, TextGet(msg + ("" + msgIndex)), "#FF5BE9", msgTime);
}

function KinkyDungeonIsChaste(Breast) {
	for (let inv of KinkyDungeonAllRestraint()) {
		if (inv.restraint && (!Breast && inv.restraint.chastity) || (Breast && inv.restraint.chastitybra)) return true;
	}
}

function KinkyDungeonChastityMult() {
	let chaste = 0.0;
	for (let inv of KinkyDungeonAllRestraint()) {
		if (inv.restraint && inv.restraint.chastity) chaste += 1;
		else if (inv.restraint && inv.restraint.chastitybra) chaste += 0.2;
	}
	return chaste;
}

let KinkyDungeonStatsPresets = {
	"Strong": {id: 0, cost: 2, block: "Weak"},
	"Weak": {id: 1, cost: -1, block: "Strong"},
	"Flexible": {id: 2, cost: 2, block: "Inflexible"},
	"Inflexible": {id: 3, cost: -1, block: "Flexible"},
	"Locksmith": {id: 4, cost: 2, block: "Clueless"},
	"Clueless": {id: 5, cost: -1, block: "Locksmith"},
	"Psychic": {id: 6, cost: 4},
	"Novice": {id: 7, cost: -1},
	"Blessed": {id: 8, cost: 3},
	"Cursed": {id: 9, cost: -2},
	"Submissive": {id: 10, cost: 0},
	"Wanted": {id: 11, cost: -1},
	"Studious": {id: 12, cost: 1},
	"Meditation": {id: 13, cost: 2},
	"Willpower": {id: 14, cost: 2},
	"BondageLover": {id: 15, cost: -1},
	"Purity": {id: 16, cost: 2, block: "Deprived"},
	"Unchaste": {id: 17, cost: -1, block: "FreeSpirit"},
	"Dodge": {id: 18, cost: 3, block: "Distracted"},
	"Distracted": {id: 19, cost: -1, block: "Dodge"},
	"Brawler": {id: 20, cost: 1},
	"Clumsy": {id: 21, cost: -1},
	"Pristine": {id: 22, cost: -1},
	"LostTechnology": {id: 23, cost: -1},
	"Rigger": {id: 24, cost: 1},
	"Pacifist": {id: 25, cost: -2},
	"Unchained": {id: 26, cost: 2, block: "Damsel"},
	"Damsel": {id: 27, cost: -1, block: "Unchained"},
	"Artist": {id: 28, cost: 2, block: "Bunny"},
	"Bunny": {id: 29, cost: -1, block: "Artist"},
	"Slippery": {id: 30, cost: 2, block: "Doll"},
	"Doll": {id: 31, cost: -1, block: "Slippery"},
	"Escapee": {id: 32, cost: 2, block: "Dragon"},
	"Dragon": {id: 33, cost: -1, block: "Escapee"},
	"Stealthy": {id: 38, cost: 0},
	"Conspicuous": {id: 39, cost: -1, block: "KillSquad"},
	"Slayer": {id: 34, cost: 5},
	"Conjurer": {id: 35, cost: 5},
	"Magician": {id: 36, cost: 5},
	"Narcoleptic": {id: 37, cost: -4},
	"BoundPower": {id: 40, cost: 3},
	"KillSquad": {id: 41, cost: -3, block: "Conspicuous"},
	"Supermarket": {id: 42, cost: 1},
	"PriceGouging": {id: 43, cost: -2},
	"FreeSpirit": {id: 44, cost: 0, block: "Unchaste"},
	"Deprived": {id: 45, cost: 0, block: "Purity"},
};

function KinkyDungeonGetStatPoints(Stats) {
	let total = 0;
	for (let k of Stats.keys()) {
		if (Stats.get(k)) {
			if (KinkyDungeonStatsPresets[k]) {
				total -= KinkyDungeonStatsPresets[k].cost;
			}
		}
	}
	return total;
}

function KinkyDungeonCanPickStat(Stat) {
	let stat = KinkyDungeonStatsPresets[Stat];
	if (!stat) return false;
	if (stat.cost > 0 && KinkyDungeonGetStatPoints(KinkyDungeonStatsChoice) < stat.cost) return false;
	for (let k of KinkyDungeonStatsChoice.keys()) {
		if (KinkyDungeonStatsChoice.get(k)) {
			if (KinkyDungeonStatsPresets[k] && KinkyDungeonStatsPresets[k].block == Stat) {
				return false;
			}
		}
	}
	return true;
}
function KinkyDungeonCanUnPickStat(Stat) {
	let stat = KinkyDungeonStatsPresets[Stat];
	if (!stat) return false;
	if (stat.cost < 0 && KinkyDungeonGetStatPoints(KinkyDungeonStatsChoice) < -stat.cost) return false;
	for (let k of KinkyDungeonStatsChoice.keys()) {
		if (KinkyDungeonStatsChoice.get(k)) {
			if (KinkyDungeonStatsPresets[k] && KinkyDungeonStatsPresets[k].require == Stat) {
				return false;
			}
		}
	}
	return true;
}
