"use strict";
let KinkyDungeonEnemies = [
	{name: "Wall", tags: KDMapInit(["construct", "player", "playerinstakill", "melee"]), spellResist: 4, allied: true, lowpriority: true, evasion: -100, armor: 1, followRange: 100, AI: "wander", regen: -2.5,
		visionRadius: 0, maxhp: 25, minLevel:0, weight:0, movePoints: 1000, attackPoints: 0, attack: "", attackRange: 0,
		terrainTags: {}, floors:[]},
	{name: "Decoy", tags: KDMapInit(["construct", "player"]), noblockplayer: true, allied: true, evasion: 2, armor: 0, followRange: 100, AI: "wander",
		visionRadius: 0, maxhp: 12, minLevel:0, weight:0, movePoints: 2, attackPoints: 0, attack: "", attackRange: 0,
		terrainTags: {}, floors:[]},
	{name: "Ally", tags: KDMapInit(["ghost", "player", "melee"]), noblockplayer: true, allied: true, armor: 0, followRange: 1, AI: "hunt", evasion: 0.33, accuracy: 1.5,
		visionRadius: 20, playerBlindSight: 100, maxhp: 8, minLevel:0, weight:0, movePoints: 1, attackPoints: 1, attack: "MeleeWill", attackRange: 1, attackWidth: 3, power: 1,
		terrainTags: {}, floors:[]},
	{name: "ShadowWarrior", tags: KDMapInit(["ghost", "player", "melee", "tickleimmune"]), noblockplayer: true, allied: true, armor: 0, followRange: 1, AI: "hunt", evasion: 1,
		spells: ["AllyShadowStrike"], spellCooldownMult: 1, spellCooldownMod: 0,
		visionRadius: 20, playerBlindSight: 100, maxhp: 11, minLevel:0, weight:0, movePoints: 1, attackPoints: 1, attack: "Spell", attackRange: 0, power: 1,
		terrainTags: {}, floors:[]},
	{name: "FireElemental", tags: KDMapInit(["construct", "player", "ranged", "fireimmune", "electricresist", "coldweakness", "iceweakness"]), noblockplayer: true, allied: true, armor: 0, kite: 1.5, followRange: 3, playerFollowRange: 1, AI: "hunt",
		spells: ["AllyFirebolt"], minSpellRange: 1.5, spellCooldownMult: 1, spellCooldownMod: 0, stopToCast: true,
		visionRadius: 20, playerBlindSight: 100, maxhp: 8, minLevel:0, weight:0, movePoints: 1, attackPoints: 1, attack: "Spell", attackRange: 0, power: 1,
		terrainTags: {}, floors:[]},
	{name: "Golem", tags: KDMapInit(["construct", "player", "melee", "fireresist", "tickleresist", "groperesist", "electricresist", "charmimmune"]), noblockplayer: true, allied: true, armor: 2, followRange: 1, AI: "hunt",
		visionRadius: 20, playerBlindSight: 100, maxhp: 30, minLevel:0, weight:0, movePoints: 2, attackPoints: 2, attack: "MeleeWill", attackRange: 1, attackWidth: 5, power: 6,
		terrainTags: {}, floors:[]},
	{name: "StormCrystal", tags: KDMapInit(["construct", "player", "ranged", "meleeresist", "tickleimmune", "electricimmune"]), noblockplayer: true, allied: true, armor: 2, followRange: 1, AI: "wander", evasion: -10,
		spells: ["AllyCrackle"], spellCooldownMult: 1, spellCooldownMod: 0,
		visionRadius: 6, maxhp: 24, minLevel:0, weight:0, movePoints: 1000, attackPoints: 1, attack: "Spell", attackRange: 0, power: 1,
		terrainTags: {}, floors:[]},

	{name: "BlindZombie", tags: KDMapInit(["ignoreharmless", "zombie", "melee", "ribbonRestraints", "meleeweakness"]), evasion: -1, ignorechance: 0.33, armor: 0, followRange: 1, AI: "wander",
		visionRadius: 1.5, maxhp: 8, minLevel:0, weight:14, movePoints: 3, attackPoints: 3, attack: "MeleeBind", attackWidth: 1, attackRange: 1, power: 1, dmgType: "grope", fullBoundBonus: 2,
		terrainTags: {"increasingWeight":-1.5}, floors:[0], dropTable: [{name: "Gold", amountMin: 5, amountMax: 10, weight: 10}]},
	{name: "FastZombie", tags: KDMapInit(["ignoreharmless", "zombie", "melee", "ribbonRestraints", "slashweakness"]), evasion: -1, ignorechance: 0.33, armor: 1, followRange: 1, AI: "hunt",
		visionRadius: 6, maxhp: 10, minLevel:4, weight:6, movePoints: 3, attackPoints: 3, attack: "MeleeBind", attackWidth: 1, attackRange: 1, power: 1, dmgType: "grope", fullBoundBonus: 3,
		terrainTags: {"secondhalf":10, "lastthird":14}, floors:[0], dropTable: [{name: "Gold", amountMin: 5, amountMax: 10, weight: 10}]},
	{name: "SamuraiZombie", tags: KDMapInit(["leashing", "zombie", "melee", "elite", "ropeRestraints", "ropeRestraints2", "meleeweakness"]), evasion: -1, armor: 2, followRange: 1, AI: "hunt",
		stunTime: 2, specialCD: 6, specialAttack: "Stun", specialRemove: "Bind", specialPower: 5, specialDamage: "pain",
		specialCDonAttack: false, visionRadius: 6, maxhp: 20, minLevel:4, weight:5, movePoints: 3, attackPoints: 3, attack: "MeleeBind", attackWidth: 1, attackRange: 1, power: 1, dmgType: "grope", fullBoundBonus: 4, specialWidth: 5, specialRange: 1,
		terrainTags: {"secondhalf":8, "lastthird":6}, shrines: ["Will"], floors:[0, 11], dropTable: [{name: "Gold", amountMin: 15, amountMax: 20, weight: 10}]},
	{name: "Ninja", color: "#814BB7", tags: KDMapInit(["leashing", "opendoors", "human", "melee", "ropeRestraints", "ropeRestraints2", "meleeweakness", "search"]), followLeashedOnly: true, blindSight: 5, followRange: 1, AI: "hunt", projectileAttack: true,
		stunTime: 4, specialCD: 6, specialCharges: 6, specialAttack: "Stun", specialRemove: "Bind", specialCDonAttack: true, strictAttackLOS: true,
		visionRadius: 10, maxhp: 12, minLevel:4, weight:4, movePoints: 1, attackPoints: 3, attack: "MeleeBind", attackWidth: 1, attackRange: 1, power: 2, dmgType: "crush", fullBoundBonus: 2, specialWidth: 1, specialAttackPoints: 3, specialRange: 4, specialMinrange: 1.5, //specialFollow: 3,
		terrainTags: {"secondhalf":3, "lastthird":7, "ropeAnger": 2}, shrines: ["Illusion"], floors:[1, 11],
		dropTable: [{name: "Gold", amountMin: 5, amountMax: 10, weight: 10}, {name: "Pick", weight: 3}, {name: "SmokeBomb", weight: 1}]},
	{name: "NinjaStalker", color: "#814BB7", tags: KDMapInit(["leashing", "opendoors", "human", "melee", "ropeRestraints", "ropeRestraints2", "meleeweakness", "search"]), blindSight: 5, followRange: 1, AI: "ambush", stealth: 1, noReveal: true,
		ambushRadius: 1.9, wanderTillSees: true, visionRadius: 10, maxhp: 12, minLevel:4, weight:4, movePoints: 1, attackPoints: 3, attack: "MeleeBind", attackWidth: 1, attackRange: 1, power: 2, dmgType: "crush", fullBoundBonus: 2, specialWidth: 1, specialAttackPoints: 3, specialRange: 4, specialMinrange: 1.5, //specialFollow: 3,
		terrainTags: {"secondhalf":3, "lastthird":7, "ropeAnger": 2}, shrines: ["Illusion"], floors:[1, 11],
		dropTable: [{name: "Gold", amountMin: 5, amountMax: 10, weight: 10}, {name: "Pick", weight: 3}, {name: "SmokeBomb", weight: 1}]},

	{name: "Maidforce", color: "#814BB7", tags: KDMapInit(["leashing", "opendoors", "human", "maid", "melee", "ropeRestraints", "ropeRestraints2", "maidVibeRestraintsLimited", "maidRestraintsLight", "jail", "search"]), blindSight: 3, followRange: 1, AI: "hunt",
		stealth: 2, noReveal: true, bindOnKneelSpecial: true, bindOnKneel: true, hitsfx: "Tickle", useLock: "Red",
		specialCD: 3, specialAttack: "Bind", specialCDonAttack: true,
		visionRadius: 10, maxhp: 8, minLevel:0, weight:-2, movePoints: 2, attackPoints: 1, attack: "MeleeWill", attackWidth: 1, attackRange: 1, power: 1, dmgType: "tickle", fullBoundBonus: 1,
		terrainTags: {"secondhalf":1, "lastthird":1, "illusionAnger": 22, "illusionRage": 12, "increasingWeight":-1}, shrines: ["Illusion"], floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
		dropTable: [{name: "Gold", amountMin: 5, amountMax: 10, weight: 10}, {name: "Knife", weight: 3}, {name: "SmokeBomb", weight: 3}]},
	{name: "MaidforcePara", color: "#814BB7", tags: KDMapInit(["leashing", "opendoors", "human", "elite", "maid", "ranged", "meleeweakness", "ropeRestraints", "ropeRestraints2", "maidVibeRestraintsLimited", "maidRestraintsLight", "hunter"]), followLeashedOnly: true, blindSight: 5, followRange: 4, AI: "hunt", projectileAttack: true,
		spells: ["ParasolBuff", "Hairpin"], spellCooldownMult: 1, spellCooldownMod: 0, minSpellRange: 1.5, buffallies: true, kite: 2.5,
		stealth: 2, disarm: 0.5,
		visionRadius: 10, maxhp: 10, minLevel:5, weight:-2, movePoints: 2, attackPoints: 3, attack: "SpellMeleeWillBindLock", attackWidth: 1, attackRange: 1, power: 2, dmgType: "grope",
		terrainTags: {"secondhalf":1, "lastthird":1, "illusionAnger": 17, "illusionRage": 11}, shrines: ["Illusion"], floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
		dropTable: [{name: "Gold", amountMin: 15, amountMax: 20, weight: 10}, {name: "Knife", weight: 4}, {name: "PotionInvisibility", weight: 3}]},
	{name: "MaidforceStalker", color: "#814BB7", tags: KDMapInit(["leashing", "opendoors", "human", "maid", "melee", "maidRestraints", "maidVibeRestraintsLimited", "meleeweakness", "hunter"]), followLeashedOnly: true, blindSight: 5, followRange: 1, AI: "hunt", projectileAttack: true, evasion: 0.33,
		spells: ["FlashBomb", "MirrorImage"], spellCooldownMult: 1, spellCooldownMod: 0, kite: 2, kiteOnlyWhenDisabled: true, castWhileMoving: true,
		stealth: 1, useLock: "Red",
		visionRadius: 10, maxhp: 12, minLevel:8, weight:-2, movePoints: 1, attackPoints: 3, attack: "SpellMeleeWillBindLock", attackWidth: 1, attackRange: 1, tilesMinRange: 1, power: 2, dmgType: "grope", fullBoundBonus: 1,
		terrainTags: {"secondhalf":1, "lastthird":1, "illusionAnger": 15, "illusionRage": 10, "increasingWeight":0.5}, shrines: ["Illusion"], floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
		dropTable: [{name: "Gold", amountMin: 15, amountMax: 20, weight: 10}, {name: "SmokeBomb", weight: 5}, {name: "PotionInvisibility", weight: 3}]},
	{name: "MaidforceStalkerImage", color: "#814BB7", tags: KDMapInit(["ghost", "maid", "melee"]), followLeashedOnly: true, blindSight: 12, followRange: 2, AI: "hunt", projectileAttack: true, evasion: -10,
		kite: 2, kiteOnlyWhenDisabled: true,
		stealth: 1, useLock: "Red",
		visionRadius: 10, maxhp: 1, minLevel:0, weight:-10, movePoints: 1, attackPoints: 2, attack: "MeleeWill", attackWidth: 1, attackRange: 1, tilesMinRange: 1, power: 1, dmgType: "grope",
		terrainTags: {}, shrines: ["Illusion"], floors:[],},
	{name: "MaidforceMafia", color: "#814BB7", tags: KDMapInit(["leashing", "opendoors", "human", "elite", "maid", "ranged", "maidRestraints", "maidVibeRestraintsLimited", "meleeweakness", "hunter"]), followLeashedOnly: true, followRange: 4, AI: "hunt", projectileAttack: true, evasion: -0.25,
		spells: ["RubberBullets"], minSpellRange: 2.5, spellCooldownMult: 1, spellCooldownMod: 0, kite: 3, noKiteWhenHarmless: true, noSpellsWhenHarmless: true,
		useLock: "Red",
		visionRadius: 10, maxhp: 14, minLevel:15, weight:-9, movePoints: 3, attackPoints: 3, attack: "SpellMeleeWillBindLock", attackWidth: 1, attackRange: 1, tilesMinRange: 1, power: 3, dmgType: "pain", fullBoundBonus: 1,
		terrainTags: {"secondhalf":1, "lastthird":1, "open": 6, "illusionAnger": 12, "illusionRage": 5, "latexAnger": 4}, shrines: ["Illusion"], floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
		dropTable: [{name: "Gold", amountMin: 15, amountMax: 20, weight: 10}, {name: "RedKey", weight: 2}, {name: "Pick", weight: 4}]},
	{name: "MaidforceHead", color: "#814BB7", tags: KDMapInit(["leashing", "opendoors", "human", "maid", "elite", "miniboss", "ranged", "maidVibeRestraints", "maidCollar", "meleeweakness", "jail", "hunter"]), followLeashedOnly: true, followRange: 3.5, AI: "hunt", projectileAttack: true,
		spells: ["AmpuleGreen", "Hairpin", "RestrainingDevice"], minSpellRange: 2, spellCooldownMult: 1, spellCooldownMod: 0, hitsfx: "Vibe", disarm: 1,
		useLock: "Red", kite: 2.5, remote: 5, remoteAmount: 4, bypass: true, multiBind: 7, noLeashUnlessExhausted: true, attackWhileMoving: true, evasion: 0.15, //-15 weight
		visionRadius: 10, maxhp: 28, minLevel:20, weight:-14, movePoints: 2, attackPoints: 1, attack: "SpellMeleeWillBindLockAllVibe", attackWidth: 3, attackRange: 1, tilesMinRange: 1, power: 2, dmgType: "grope", fullBoundBonus: 1,
		terrainTags: {"secondhalf":1, "lastthird":1, "open": 4, "illusionAnger": 10, "illusionRage": 4}, shrines: ["Illusion"], floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
		dropTable: [{name: "Gold", amountMin: 30, amountMax: 40, weight: 20}, {name: "RedKey", weight: 10}, {name: "Pick", weight: 6}, {name: "MagicKnife", weight: 1}]},

	{name: "Skeleton", tags: KDMapInit(["leashing", "skeleton", "melee", "ropeRestraints", "leatherRestraints", "clothRestraints", "iceresist", "crushweakness", "search"]), ignorechance: 0, armor: 0, followRange: 1, AI: "hunt",
		visionRadius: 4, maxhp: 5, minLevel:1, weight:8, movePoints: 2, attackPoints: 3, attack: "MeleeBind", attackWidth: 1, attackRange: 1, power: 2, dmgType: "grope", fullBoundBonus: 1,
		terrainTags: {"secondhalf":4, "increasingWeight":-0.5}, shrines: ["Leather"], floors:[1, 11], dropTable: [{name: "Gold", amountMin: 5, amountMax: 10, weight: 10}]},
	{name: "SummonedSkeleton", tags: KDMapInit(["leashing", "skeleton", "melee", "ropeRestraints", "leatherRestraints", "clothRestraints", "crushweakness"]), ignorechance: 0, armor: 0, followRange: 1, AI: "guard",
		visionRadius: 6, maxhp: 5, minLevel:1, weight:8, movePoints: 2, attackPoints: 3, attack: "MeleeBind", attackWidth: 1, attackRange: 1, power: 1, dmgType: "grope", fullBoundBonus: 1,
		terrainTags: {}, shrines: [], floors:[]},
	{name: "LesserSkeleton", tags: KDMapInit(["leashing", "ignorenoSP", "skeleton", "melee", "iceresist", "crushweakness"]), ignorechance: 0, armor: 0, followRange: 1, AI: "wander", evasion: -2,
		visionRadius: 1, maxhp: 2.5, minLevel:0, weight:10, movePoints: 2, attackPoints: 3, attack: "MeleeWillSlow", attackWidth: 1, attackRange: 1, power: 2, dmgType: "grope", fullBoundBonus: 1,
		terrainTags: {"secondhalf":-8, "lastthird":-8, "increasingWeight":-1}, floors:[1, 11]},
	{name: "GreaterSkeleton", tags: KDMapInit(["leashing", "ignoreharmless", "skeleton", "melee", "elite", "iceresist", "crushweakness", "hunter"]), ignorechance: 0, armor: 0, followRange: 1.5, AI: "hunt", disarm: 0.5,
		visionRadius: 4, maxhp: 10, minLevel:12, weight:3, movePoints: 3, attackPoints: 3, attack: "MeleeWillSlow", attackWidth: 3, attackRange: 1, power: 8, dmgType: "crush", fullBoundBonus: 0,
		terrainTags: {"secondhalf":2, "lastthird":3, "increasingWeight":1}, floors:[1, 3, 7, 8], dropTable: [{name: "PotionStamina", weight: 3}, {name: "Gold", amountMin: 15, amountMax: 20, weight: 10}, {name: "Hammer", weight: 50, ignoreInInventory: true}]},

	{name: "Ghost", color: "#FFFFFF", tags: KDMapInit(["ignorenoSP", "ghost", "melee", "glueimmune", "chainimmune"]), ethereal: true, ignorechance: 0, armor: 0, followRange: 1, AI: "hunt", hitsfx: "Tickle",
		visionRadius: 10, blindSight: 3, evasion: 9.0, alwaysEvade: true, maxhp: 1, minLevel:0, weight:0.1, movePoints: 2, attackPoints: 1, attack: "MeleeWill", attackWidth: 3, attackRange: 1, power: 4, dmgType: "tickle", fullBoundBonus: 0,
		terrainTags: {"ghost" : 4.9}, shrines: ["Illusion"], floors:[0, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]},
	{name: "OrbGuardian", tags: KDMapInit(["divine", "melee", "glueimmune", "chainimmune"]), ethereal: true, ignorechance: 0, armor: 0, followRange: 1, AI: "hunt",
		spells: ["ShadowStrike"], spellCooldownMult: 1, spellCooldownMod: 0,
		visionRadius: 100, blindSight: 100, evasion: 0.5, alwaysEvade: true, maxhp: 12, minLevel:0, weight:-10, movePoints: 2, attackPoints: 1, attack: "Spell", attackWidth: 3,
		attackRange: 1, power: 4, dmgType: "cold", fullBoundBonus: 0,
		terrainTags: {}, shrines: [], floors:[]},


	{name: "TickleHand", color: "#FFFFFF", tags: KDMapInit(["ignorenoSP", "ghost", "melee", "glueimmune", "chainimmune"]), ethereal: true, ignorechance: 0, armor: 0, followRange: 1, AI: "hunt", regen: -0.1, noAlert: true, hitsfx: "Tickle",
		visionRadius: 10, blindSight: 3, evasion: 9.0, alwaysEvade: true, maxhp: 1, minLevel:0, weight:-1000, movePoints: 2, attackPoints: 1, attack: "MeleeWill", attackWidth: 3, attackRange: 1, power: 3, dmgType: "tickle", fullBoundBonus: 0,
		terrainTags: {}, shrines: [], floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]},
	{name: "TickleHandSlave", color: "#FFFFFF", tags: KDMapInit(["ignorenoSP", "ghost", "melee", "glueimmune", "chainimmune"]), ethereal: true, ignorechance: 0, armor: 0, followRange: 1, AI: "hunt", master: {type: "ConjurerTickler", range: 3}, noAlert: true, hitsfx: "Tickle",
		visionRadius: 10, blindSight: 3, evasion: 9.0, alwaysEvade: true, maxhp: 1, minLevel:0, weight:-1000, movePoints: 2, attackPoints: 1, attack: "MeleeWill", attackWidth: 3, attackRange: 1, power: 3, dmgType: "tickle", fullBoundBonus: 0,
		terrainTags: {}, shrines: [], floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]},
	{name: "Frog", color: "#00FF44", tags: KDMapInit(["summoned", "beast", "ranged"]), followLeashedOnly: true, armor: 1, followRange: 1, AI: "hunt", pullTowardSelf: true, pullDist: 3, master: {type: "Conjurer", range: 3},
		visionRadius: 10, maxhp: 24, minLevel:0, weight:0, movePoints: 1, attackPoints: 2, attack: "MeleePullWill", attackRange: 4, attackWidth: 1, power: 4, strictAttackLOS: true, damage: "tickle",
		terrainTags: {}, floors:[]},
	{name: "Conjurer", tags: KDMapInit(["leashing", "opendoors", "closedoors", "witch", "ranged", "boss", "elite", "latexRestraints"]), followRange: 1, summon: [{enemy: "Frog", range: 2.5, count: 1, strict: true}],
		spells: ["SummonTickleHand"], spellCooldownMult: 2, spellCooldownMod: 1, AI: "guard", visionRadius: 8, maxhp: 40, minLevel:15, weight:-31, movePoints: 3,
		attackPoints: 4, attack: "MeleeLockAllWillSpellBind", attackWidth: 1, attackRange: 1, power: 3, dmgType: "tickle",
		terrainTags: {"secondhalf":16, "lastthird":5, "boss": -80, "open": 30, "passage": -60, "conjureAnger": 20, "conjureRage": 70, "increasingWeight":0.5},
		floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrines: ["Conjure"], dropTable: [{name: "MagicSword", weight: 1}, {name: "BlueKey", weight: 4}]},
	{name: "ConjurerTickler", tags: KDMapInit(["leashing", "opendoors", "closedoors", "witch", "ranged", "boss", "elite", "latexRestraints"]), followRange: 1, summon: [{enemy: "TickleHandSlave", range: 2.5, count: 3, strict: true}],
		spells: ["SummonBookChain"], spellCooldownMult: 2, spellCooldownMod: 1, AI: "guard", visionRadius: 8, maxhp: 40, minLevel:15, weight:-31, movePoints: 3,
		attackPoints: 4, attack: "MeleeLockAllWillSpellBind", attackWidth: 1, attackRange: 1, power: 3, dmgType: "tickle",
		terrainTags: {"secondhalf":16, "lastthird":5, "boss": -80, "open": 30, "passage": -60, "conjureAnger": 20, "conjureRage": 70, "increasingWeight":0.5},
		floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrines: ["Conjure"], dropTable: [{name: "MagicSword", weight: 1}, {name: "BlueKey", weight: 4}]},

	{name: "BookChain", tags: KDMapInit(["construct", "book", "ranged", "meleesevereweakness"]), followLeashedOnly: true, armor: 0, followRange: 1, AI: "wander", noAlert: true,
		spells: ["MagicChain"], spellCooldownMult: 1, spellCooldownMod: 1, minSpellRange: 1.5,
		visionRadius: 12, maxhp: 6, minLevel:0, weight:0, movePoints: 12, attackPoints: 2, attack: "Spell", attackRange: 1, attackWidth: 1, power: 6,
		terrainTags: {"open": 10, "passage": -1}, floors:[12]},

	{name: "AnimatedArmor", blockVisionWhileStationary: true, tags: KDMapInit(["removeDoorSpawn", "ignoreharmless", "leashing", "construct", "minor", "melee", "shackleRestraints", "shackleGag", "slashresist", "fireresist", "electricresist", "crushweakness"]),
		evasion: -0.5, ignorechance: 1.0, armor: 2, followRange: 1, AI: "ambush",
		visionRadius: 100, ambushRadius: 1.9, blindSight: 100, maxhp: 20, minLevel:1, weight:0, movePoints: 4, attackPoints: 4, attack: "MeleeBind", attackWidth: 1, attackRange: 1, power: 4, dmgType: "crush", fullBoundBonus: 4,
		terrainTags: {"lastthird":10, "passage": 50, "adjChest": 48, "door": 50}, floors:[1], shrines: ["Metal"],
		dropTable: [{name: "RedKey", weight: 2}, {name: "Gold", amountMin: 5, amountMax: 10, weight: 10}, {name: "Sword", weight: 1, ignoreInInventory: true}]},

	{name: "VinePlant", color: "#00FF00", blockVisionWhileStationary: true, tags: KDMapInit(["removeDoorSpawn", "ignorenoSP", "plant", "minor", "melee", "slashsevereweakness", "firesevereweakness", "unarmedresist", "crushresist", "vineRestraints"]),
		ignorechance: 1.0, armor: 2, followRange: 1, AI: "ambush", specialCD: 99, specialAttack: "Stun", specialAttackPoints: 1, specialRemove: "Bind",
		visionRadius: 3, ambushRadius: 1.9, blindSight: 5, maxhp: 10, minLevel:0, weight:10, movePoints: 1, attackPoints: 2, attack: "MeleeWillBind", attackWidth: 1, attackRange: 1, power: 2, dmgType: "crush", fullBoundBonus: 2,
		terrainTags: {"passage": -50, "adjChest": 8, "door": 8}, floors:[2], shrines: ["Rope", "Will"]},
	{name: "Bramble", color: "#00FF00", hitsfx: "DealDamage", tags: KDMapInit(["removeDoorSpawn", "plant", "minor", "melee", "slashsevereweakness", "firesevereweakness", "unarmedresist", "crushresist"]),
		evasion: -9, ignorechance: 1.0, armor: 2, followRange: 1, AI: "wander", specialCD: 2, specialAttack: "Slow", specialAttackPoints: 1,
		visionRadius: 1.5, blindSight: 1.5, maxhp: 16, minLevel:0, weight:-80, movePoints: 99999, attackPoints: 1, attack: "MeleeWill", attackWidth: 8, attackRange: 1, power: 1, dmgType: "pain",
		terrainTags: {"passage": -50, "adjChest": -50, "door": -50, "open": 110}, floors:[2], shrines: ["Rope", "Will"]},

	{name: "AlchemistPet", tags: KDMapInit(["opendoors", "ignorenoSP", "alchemist", "ranged", "glueweakness", "ticklesevereweakness", "search"]), ignorechance: 0, armor: 0, followRange: 2, AI: "hunt",
		master: {type: "Alchemist", range: 2, loose: true, aggressive: true}, sneakThreshold: 1, blindSight: 2, projectileAttack: true,
		specialCD: 8, specialAttack: "DashStun", specialRemove: "Will", specialCDonAttack: true, specialAttackPoints: 2, specialRange: 4, specialMinrange: 1.5, specialsfx: "HeavySwing", stunTime: 4,
		visionRadius: 6, maxhp: 14, minLevel:8, weight:1, movePoints: 1, attackPoints: 2, attack: "MeleeWill", attackWidth: 1, attackRange: 1, power: 3, dmgType: "grope", fullBoundBonus: 2,
		terrainTags: {"latexAnger": 2, "latexRage": 2}, shrines: ["Latex", "Metal"], floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
		dropTable: []},

	{name: "Alchemist", tags: KDMapInit(["opendoors", "leashing", "alchemist", "ranged", "leatherRestraints", "glueresist", "leatherRestraintsHeavy", "search"]), ignorechance: 0, armor: 0, followRange: 2, AI: "hunt",
		spells: ["AmpuleGreen", "AmpuleYellow", "AmpuleRed", "AmpuleBlue"], minSpellRange: 1.5, spellCooldownMult: 1, spellCooldownMod: 4, kite: 1.5, projectileAttack: true,
		visionRadius: 6, maxhp: 8, minLevel:0, weight:0, movePoints: 2, attackPoints: 3, attack: "SpellMeleeBindWill", attackWidth: 1, attackRange: 1, power: 2, dmgType: "grope", fullBoundBonus: 2,
		terrainTags: {"secondhalf":1, "thirdhalf":1, "latexAnger": 12, "latexRage": 5}, shrines: ["Latex"], floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
		dropTable: [{name: "Gold", amountMin: 5, amountMax: 10, weight: 10}, {name: "SmokeBomb", weight: 2}, {name: "PotionStamina", weight: 1}]},
	{name: "Alkahestor", tags: KDMapInit(["opendoors", "leashing", "alchemist", "ranged", "miniboss", "glueresist", "expRestraints", "latexGag", "search"]), ignorechance: 0, armor: 0, followRange: 2, AI: "hunt",
		spells: ["AmpuleBlue", "SummonLatexElemental"], minSpellRange: 1.5, spellCooldownMult: 1, spellCooldownMod: 4, kite: 1.5, projectileAttack: true,
		visionRadius: 6, maxhp: 16, minLevel:0, weight:-1, movePoints: 2, attackPoints: 3, attack: "SpellMeleeBindWill", attackWidth: 1, attackRange: 1, power: 3, dmgType: "grope", fullBoundBonus: 3,
		terrainTags: {"secondhalf":1, "thirdhalf":1, "latexAnger": 4, "latexRage": 4}, shrines: ["Latex"], floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
		dropTable: [{name: "Gold", amountMin: 15, amountMax: 20, weight: 10}, {name: "SmokeBomb", weight: 2}, {name: "PotionMana", weight: 1}]},
	{name: "ElementalLatex", tags: KDMapInit(["opendoors", "elemental", "slashweakness", "melee", "glueimmune", "electricweakness", "iceweakness", "latexRestraints", "leashing", "search"]), armor: 0, followRange: 1, AI: "hunt",
		visionRadius: 8, maxhp: 24, minLevel:0, weight:-3, movePoints: 2, attackPoints: 2, attack: "MeleeWillBind", attackWidth: 3, attackRange: 1, tilesMinRange: 1, power: 3, dmgType: "grope", fullBoundBonus: 3,
		terrainTags: {"secondhalf":2, "thirdhalf":1, "latexAnger": 4, "latexRage": 4}, floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrines: ["Latex", "Elements"],
		dropTable: [{name: "Gold", amountMin: 10, amountMax: 20, weight: 10, noSummon: true}, {name: "EarthRune", weight: 1, noSummon: true}]},
	{name: "SlimeEnthusiast", tags: KDMapInit(["opendoors", "leashing", "alchemist", "ranged", "meleeweakness", "miniboss", "glueresist", "leatherRestraints", "leatherRestraintsHeavy", "hunter"]), ignorechance: 0, armor: 0, followRange: 2, AI: "hunt",
		spells: ["RedSlime"], minSpellRange: 1.5, spellCooldownMult: 1, spellCooldownMod: 1, kite: 1.5, projectileAttack: true,
		visionRadius: 7, maxhp: 20, minLevel:0, weight:0, movePoints: 3, attackPoints: 3, attack: "SpellMeleeBindWill", attackWidth: 1, attackRange: 1, power: 2, dmgType: "grope", fullBoundBonus: 2,
		terrainTags: {"secondhalf":0.5, "thirdhalf":1, "latexAnger": 5, "latexRage": 5}, shrines: ["Latex"], floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
		dropTable: [{name: "Gold", amountMin: 5, amountMax: 10, weight: 10}, {name: "SmokeBomb", weight: 2}, {name: "PotionStamina", weight: 1}]},
	{name: "RedSlime", color: "#FF0000", tags: KDMapInit(["ignoretiedup", "construct", "melee", "minor", "ballGagRestraints", "crushresist", "glueimmune"]), squeeze: true, followRange: 1, AI: "hunt", sneakThreshold: 1, hitsfx: "",
		spells: ["RedSlime"], minSpellRange: 2, spellCooldownMult: 1, spellCooldownMod: 1, evasion: 1,
		visionRadius: 8, maxhp: 4, minLevel: 11, weight:10, movePoints: 2, attackPoints: 3, attack: "SpellMeleeSlowWillBindSuicide", suicideOnSpell: true, suicideOnAdd: true, attackWidth: 1, attackRange: 1, power: 1, dmgType: "crush",
		terrainTags: {}, floors:[], shrines: ["Latex"]},

	{name: "Drone", color: "#ff3367", tags: KDMapInit(["ignoreharmless", "robot", "minor", "ranged", "electricsevereweakness", "coldresist", "iceresist", "slashresist", "hitechCables", "cableGag", "jail", "search"]), AI: "patrol",
		summon: [
			{enemy: "Drone", range: 2, count: 2, chance: 1.0, strict: true},],
		armor: 2, maxhp: 4, movePoints: 3,
		visionRadius: 6, followRange: 1, projectileAttack: true,
		bindOnKneel: true, suicideOnAdd: true,
		specialCD: 30, specialAttack: "Stun", specialRemove: "Bind", specialCDonAttack: true, specialAttackPoints: 3, specialRange: 7, specialWidth: 1.5, specialMinrange: 3, specialsfx: "Laser", stunTime: 8,
		attack: "MeleeBindWillSuicide", attackPoints: 3, attackWidth: 1, attackRange: 1, power: 3, dmgType: "crush", multiBind: 2,
		minLevel:0, weight:-4, terrainTags: {"thirdhalf":1, "increasingWeight":1, "metalAnger": 4, "metalRage": 4}, shrines: ["Metal"], floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
		dropTable: []},
	{name: "WolfgirlPet", tags: KDMapInit(["opendoors", "wolfgirl", "ignorenoSP", "alchemist", "ranged", "glueweakness", "ticklesevereweakness", "search"]), ignorechance: 0, armor: 0, followRange: 2, AI: "hunt", cohesion: 0.9,
		master: {type: "Wolfgirl", range: 2, loose: true, aggressive: true}, sneakThreshold: 1, blindSight: 2, projectileAttack: true,
		specialCD: 8, specialAttack: "DashStun", specialRemove: "Will", specialCDonAttack: true, specialAttackPoints: 2, specialRange: 4, specialMinrange: 1.5, specialsfx: "HeavySwing", stunTime: 4,
		visionRadius: 6, maxhp: 14, minLevel:5, weight:1, movePoints: 1, attackPoints: 2, attack: "MeleeWill", attackWidth: 1, attackRange: 1, power: 3, dmgType: "grope", fullBoundBonus: 2,
		terrainTags: {"metalAnger": 2, "metalRage": 2}, shrines: ["Latex", "Metal"], floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
		dropTable: []},
	{name: "Wolfgirl", color: "#AAAAAA", tags: KDMapInit(["leashing", "wolfgirl", "opendoors", "closedoors", "wolfRestraints", "melee", "elite", "miniboss", "unflinching", "glueweakness", "tickleweakness", "unflinching", "hunter"]), followRange: 1,
		summon: [
			{enemy: "WolfgirlPet", range: 2, count: 1, chance: 0.7, strict: true},],
		spells: ["RestrainingDevice"], minSpellRange: 1.5, spellCooldownMult: 1, spellCooldownMod: 1, AI: "hunt", visionRadius: 10, maxhp: 22, minLevel:14, weight:-6, movePoints: 2, disarm: 0.33,
		attackPoints: 3, attack: "MeleeBindLockAllWillSpell", attackWidth: 3, attackRange: 1, tilesMinRange: 1, power: 4, dmgType: "grope",
		terrainTags: {"secondhalf":3, "lastthird":3, "miniboss": -10, "metalAnger": 7, "metalRage": 2}, floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrines: ["Metal"], dropTable: [{name: "RedKey", weight: 9}, {name: "BlueKey", weight: 1}]},

	{name: "Bandit", tags: KDMapInit(["opendoors", "closedoors", "leashing", "bandit", "melee", "leatherRestraints", "leatherRestraintsHeavy", "clothRestraints", "jail", "search"]), cohesion: 0.9, armor: 0, followRange: 1, AI: "hunt",
		spells: ["BanditBola"], minSpellRange: 1.5, spellCooldownMult: 1, spellCooldownMod: 8, noSpellLeashing: true,
		visionRadius: 6, maxhp: 9, minLevel:0, weight:17, movePoints: 2, attackPoints: 3, attack: "SpellMeleeBindWill", attackWidth: 1, attackRange: 1, power: 2, dmgType: "grope", fullBoundBonus: 2,
		terrainTags: {"thirdhalf":-4, "increasingWeight":-1}, shrines: ["Leather"], floors:[2],
		dropTable: [{name: "Gold", amountMin: 10, amountMax: 20, weight: 24}]},
	{name: "BanditHunter", tags: KDMapInit(["opendoors", "closedoors", "leashing", "bandit", "melee", "elite", "leatherRestraints", "leatherRestraintsHeavy", "clothRestraints", "jail", "hunter"]), ignorechance: 0, armor: 0, followRange: 2, AI: "hunt", stealth: 1,
		spells: ["BanditBola"], minSpellRange: 1.5, spellCooldownMult: 1, spellCooldownMod: 3, noSpellLeashing: true,
		visionRadius: 7, maxhp: 9, minLevel:0, weight:0, movePoints: 2, attackPoints: 2, attack: "SpellMeleeBindWill", attackWidth: 1, attackRange: 1, power: 3, dmgType: "grope", fullBoundBonus: 3,
		terrainTags: {"secondhalf":7, "thirdhalf":5}, shrines: ["Leather"], floors:[2],
		dropTable: [{name: "Gold", amountMin: 15, amountMax: 20, weight: 10}, {name: "Pick", weight: 2}, {name: "PotionStamina", weight: 2}]},




	{name: "SmallSlime", color: "#FF00FF", tags: KDMapInit(["ignoretiedup", "construct", "melee", "slimeRestraints", "meleeresist", "glueimmune", "electricweakness", "iceweakness"]), squeeze: true, ignorechance: 0.75, followRange: 1, AI: "hunt", sneakThreshold: 1,
		visionRadius: 3, maxhp: 3, minLevel: 15, weight:14, movePoints: 1, attackPoints: 2, attack: "MeleeBindSlowSuicide", suicideOnAdd: true, attackWidth: 1, attackRange: 1, power: 1, dmgType: "grope", fullBoundBonus: 5,
		terrainTags: {"increasingWeight":-2}, floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrines: ["Latex"],
		dropTable: [{name: "Nothing", weight: 49}, {name: "Pick", weight: 4}, {name: "Knife", weight: 4}, {name: "MagicSword", weight: 1, ignoreInInventory: true}]},
	{name: "FastSlime", color: "#FF00FF", tags: KDMapInit(["ignoretiedup", "construct", "melee", "slimeRestraints", "meleeresist", "glueimmune", "electricweakness", "iceweakness"]), squeeze: true, evasion: 0.3, followRange: 1, AI: "hunt", sneakThreshold: 1,
		visionRadius: 3, maxhp: 3, minLevel: 22, weight:3, movePoints: 1, attackPoints: 3, attack: "MeleeBindSlowSuicide", suicideOnAdd: true, attackWidth: 1, attackRange: 3, power: 4, dmgType: "grope", fullBoundBonus: 4,
		terrainTags: {"increasingWeight":1}, floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrines: ["Latex"],
		dropTable: [{name: "Nothing", weight: 29}, {name: "Pick", weight: 4}, {name: "RedKey", weight: 2}, {name: "BlueKey", weight: 1}, {name: "Knife", weight: 4}, {name: "MagicSword", weight: 0.1, ignoreInInventory: true}]},
	{name: "BigSlime", color: "#FF00FF", tags: KDMapInit(["ignoretiedup", "construct", "elite", "melee", "slimeRestraints", "meleeresist", "glueimmune", "electricweakness", "iceweakness"]), squeeze: true, evasion: 0.3, followRange: 1, AI: "hunt", sneakThreshold: 1,
		visionRadius: 3, maxhp: 12, minLevel: 23, weight:2, movePoints: 3, attackPoints: 3, attack: "MeleeBind", attackWidth: 8, attackRange: 1, power: 4, dmgType: "grope", fullBoundBonus: 3, disarm: 0.5,
		terrainTags: {}, floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrines: ["Latex"], ondeath: [{type: "summon", enemy: "SmallSlime", range: 2.5, count: 4, strict: true}],
		dropTable: [{name: "Nothing", weight: 9}, {name: "Pick", weight: 4}, {name: "RedKey", weight: 2}, {name: "BlueKey", weight: 1}, {name: "Knife", weight: 4}, {name: "MagicSword", weight: 0.4, ignoreInInventory: true}]},

	{name: "Dragon", color: "#F92900", tags: KDMapInit(["opendoors", "leashing", "dragon", "melee", "dragonRestraints", "leatherRestraints", "fireresist", "jail", "search"]), followLeashedOnly: true, ignorechance: 0, armor: 0, followRange: 1, AI: "hunt", master: {type: "DragonLeader", range: 4, loose: true, aggressive: true},
		visionRadius: 8, maxhp: 10, minLevel:4, weight:-1, movePoints: 2, attackPoints: 2, attack: "MeleeBindWill", attackWidth: 1, attackRange: 1, power: 3, dmgType: "grope", fullBoundBonus: 1,
		terrainTags: {"secondhalf":2, "thirdhalf":-1, "leatherAnger":1}, shrines: ["Leather"], floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
		dropTable: [{name: "Gold", amountMin: 5, amountMax: 10, weight: 10}, {name: "Pick", weight: 3}, {name: "PotionStamina", weight: 1}]},
	{name: "DragonIce", color: "#aaaaff", tags: KDMapInit(["opendoors", "leashing", "dragon", "melee", "elite", "dragonRestraints", "leatherRestraints", "iceimmune", "hunter"]), followLeashedOnly: true, ignorechance: 0, armor: 1, followRange: 1, AI: "hunt", master: {type: "DragonLeader", range: 4, loose: true, aggressive: true},
		spells: ["IceDragonBreathPrepare"], minSpellRange: 1.5, spellCooldownMult: 1, spellCooldownMod: 3,
		visionRadius: 8, maxhp: 14, minLevel:11, weight:-2, movePoints: 2, attackPoints: 2, attack: "SpellMeleeBindWill", attackWidth: 1, attackRange: 1, power: 3, dmgType: "grope", fullBoundBonus: 1,
		terrainTags: {"secondhalf":1, "thirdhalf":2}, shrines: ["Leather", "Elements"], floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
		dropTable: [{name: "Gold", amountMin: 20, amountMax: 30, weight: 12}, {name: "Pick", weight: 4}, {name: "PotionMana", weight: 1}, {name: "IceRune", weight: 3}]},
	{name: "DragonPoison", color: "#44ff77", tags: KDMapInit(["opendoors", "leashing", "dragon", "melee", "elite", "dragonRestraints", "leatherRestraints", "unflinching", "fireresist", "hunter"]), followLeashedOnly: true, ignorechance: 0, armor: 0, followRange: 1, AI: "hunt", master: {type: "DragonLeader", range: 4, loose: true, aggressive: true},
		spells: ["PoisonDragonBlast"], minSpellRange: 1.5, spellCooldownMult: 1, spellCooldownMod: -1, tilesMinRange: 2, stopToCast: true,
		visionRadius: 9, maxhp: 11, minLevel:8, weight:-2, movePoints: 3, attackPoints: 4, attack: "SpellMeleeStunWill", stunTime: 1, attackWidth: 3, attackRange: 2, power: 4, dmgType: "grope", fullBoundBonus: 2,
		terrainTags: {"secondhalf":1, "thirdhalf":2}, shrines: ["Leather", "Will"], floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
		dropTable: [{name: "Gold", amountMin: 20, amountMax: 30, weight: 12}, {name: "Pick", weight: 4}, {name: "PotionStamina", weight: 3}]},
	{name: "DragonCrystal", color: "#ff00aa", tags: KDMapInit(["opendoors", "leashing", "dragon", "melee", "elite", "dragonRestraints", "leatherRestraints", "leatherRestraintsHeavy", "electricresist", "fireresist", "hunter"]), followLeashedOnly: true, ignorechance: 0, armor: 1, followRange: 1, AI: "hunt", master: {type: "DragonLeader", range: 4, loose: true, aggressive: true},
		spells: ["SummonCrystals"], minSpellRange: 0, spellCooldownMult: 1, spellCooldownMod: 2, castWhileMoving: true,
		visionRadius: 8, maxhp: 10, minLevel:25, weight:-1, movePoints: 1, attackPoints: 2, attack: "SpellMeleeBindWill", stunTime: 1, attackWidth: 1, attackRange: 1, power: 3, dmgType: "crush", fullBoundBonus: 2,
		terrainTags: {"secondhalf":1, "thirdhalf":2}, shrines: ["Leather", "Conjure"], floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
		dropTable: [{name: "Gold", amountMin: 20, amountMax: 30, weight: 15}, {name: "BlueKey", weight: 1}, {name: "PotionMana", weight: 2}, {name: "EarthRune", weight: 3}]},
	{name: "DragonShadow", color: "#4400ff", tags: KDMapInit(["opendoors", "leashing", "dragon", "melee", "elite", "dragonRestraints", "shadowRestraints", "coldimmune", "fireresist", "jail", "hunter"]), followLeashedOnly: true, ignorechance: 0, armor: 0, followRange: 1, AI: "hunt", master: {type: "DragonLeader", range: 4, loose: true, aggressive: true},
		spells: ["ShadowOrb"], minSpellRange: 2.5, spellCooldownMult: 1, spellCooldownMod: 0, pullTowardSelf: true, pullDist: 3,
		specialCD: 7, specialAttack: "Pull", specialCDonAttack: true, specialAttackPoints: 2, specialRange: 4, specialsfx: "MagicSlash",
		visionRadius: 8, maxhp: 16, minLevel:18, weight:-1, movePoints: 2, attackPoints: 2, attack: "SpellMeleeWill", stunTime: 3, attackWidth: 1, attackRange: 1, power: 4, dmgType: "grope", fullBoundBonus: 2,
		terrainTags: {"secondhalf":1, "thirdhalf":2}, shrines: ["Leather", "Conjure"], floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
		dropTable: [{name: "Gold", amountMin: 15, amountMax: 20, weight: 10}, {name: "Knife", weight: 4}, {name: "PotionMana", weight: 3}]},
	{name: "DragonLeader", color: "#F92900", tags: KDMapInit(["opendoors", "leashing", "dragon", "melee", "boss", "dragonRestraints", "leatherRestraints", "leatherRestraintsHeavy", "fireimmune"]), ignorechance: 0, armor: 0, followRange: 1, AI: "patrol",
		summon: [
			{enemy: "Dragon", range: 2, count: 2, chance: 0.4, strict: true},
			{enemy: "DragonIce", range: 3, count: 1, chance: 0.25, strict: true},
			{enemy: "DragonPoison", range: 3, count: 1, chance: 0.25, strict: true},
			{enemy: "DragonCrystal", range: 3, count: 1, chance: 0.25, strict: true},
			{enemy: "DragonShadow", range: 3, count: 1, chance: 0.25, strict: true},],
		specialCD: 5, specialAttack: "Dash", specialRemove: "BindWill", specialCDonAttack: true, specialAttackPoints: 1, specialRange: 3, specialMinrange: 1.5, specialsfx: "Miss",
		visionRadius: 8, maxhp: 20, minLevel:20, weight:-11, movePoints: 2, attackPoints: 2, attack: "MeleeBindWill", attackWidth: 1, attackRange: 1, power: 4, dmgType: "crush", fullBoundBonus: 2,
		terrainTags: {"secondhalf":2, "thirdhalf":4, "open": 10, "leatherAnger":6, "leatherRage":30, "boss": -55, "increasingWeight":0.5}, shrines: ["Leather"], floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
		dropTable: [{name: "Gold", amountMin: 30, amountMax: 40, weight: 10}, {name: "Knife", weight: 3}, {name: "Knives", weight: 2}, {name: "EnchKnife", weight: 1}]},


	{name: "ElementalFire", tags: KDMapInit(["opendoors", "elemental", "fireimmune", "ranged", "coldweakness", "iceweakness", "obsidianRestraints", "shackleRestraints", "leashing", "jail", "search"]), armor: 0, kite: 1.5, followRange: 3, AI: "hunt",
		spells: ["HeatBolt"], minSpellRange: 1.5, spellCooldownMult: 1, spellCooldownMod: 1, followLeashedOnly: true, stopToCast: true,
		visionRadius: 8, maxhp: 8, minLevel:0, weight:-1, movePoints: 1, attackPoints: 3, attack: "SpellMeleeWillBindLock", attackWidth: 1, attackRange: 1, power: 2, dmgType: "pain", fullBoundBonus: 2,
		terrainTags: {"secondhalf":2, "thirdhalf":1, "open": 1, "elementsAnger": 12, "elementsRage": 6}, floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrines: ["Elements", "Metal"],
		dropTable: [{name: "Gold", amountMin: 5, amountMax: 10, weight: 10}, {name: "EarthRune", weight: 1}]},
	{name: "ElementalIce", color: "#aaaaff", tags: KDMapInit(["opendoors", "elemental", "ranged", "fireweakness", "coldresist", "iceimmune", "iceRestraints", "leashing", "search"]), armor: 1, kite: 1.5, followRange: 3, AI: "hunt",
		spells: ["IceSlowPrepare"], spellCooldownMult: 1, spellCooldownMod: 1, followLeashedOnly: true, noSpellLeashing: true,
		visionRadius: 8, maxhp: 8, minLevel:4, weight:-2, movePoints: 1, attackPoints: 3, attack: "SpellMeleeWillBindLockAll", attackWidth: 1, attackRange: 1, power: 2, dmgType: "grope", fullBoundBonus: 2, multiBind: 2,
		terrainTags: {"secondhalf":1, "thirdhalf":1, "open": 1, "elementsAnger": 8, "elementsRage": 3,}, floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrines: ["Elements"],
		dropTable: [{name: "Gold", amountMin: 5, amountMax: 10, weight: 10}, {name: "IceRune", weight: 1}]},
	{name: "ElementalWater", color: "#57ff88", tags: KDMapInit(["opendoors", "elemental", "ranged", "fireresist", "electricweakness", "latexRestraints", "elite", "leashing", "hunter"]), armor: 0, kite: 1.5, followRange: 3, AI: "hunt", evasion: 0.25, summon: [{enemy: "ElementalIce", range: 2.5, count: 1, chance: 0.6, strict: true}],
		specialCD: 5, specialAttack: "Pull", specialCDonAttack: true, specialAttackPoints: 4, specialRange: 4, specialWidth: 3, specialMinrange: 1.5, specialsfx: "Song", tilesMinRangeSpecial: 2,
		visionRadius: 8, maxhp: 12, minLevel:4, weight:-2, movePoints: 1, convertTiles: [{from: "0", to: "w"}], followLeashedOnly: true,
		attackPoints: 3,attack: "MeleeWillBind", attackWidth: 3, attackRange: 1, power: 3, dmgType: "charm", fullBoundBonus: 3, pullTowardSelf: true, pullDist: 2, pullMsg: true,
		terrainTags: {"secondhalf":1, "thirdhalf":1, "open": 1, "elementsAnger": 8, "elementsRage": 3, "illusionAnger": 2, "latexAnger": 2}, floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrines: ["Elements"],
		dropTable: [{name: "Gold", amountMin: 15, amountMax: 20, weight: 10}, {name: "Pick", weight: 4}, {name: "IceRune", weight: 2}]},
	{name: "ElementalEarth", tags: KDMapInit(["opendoors", "elemental", "fireresist", "melee", "elite", "electricimmune", "iceweakness", "obsidianRestraints", "shackleRestraints", "leashing", "spellresist", "hunter"]), armor: 1, followRange: 1, AI: "hunt",
		specialCD: 15, specialAttack: "Dash", specialRemove: "WillBind", specialCDonAttack: true, specialAttackPoints: 1, specialRange: 4, specialMinrange: 1.5, specialsfx: "Miss", castWhileMoving: true, dashThruWalls: true,
		spells: ["ArmorUp", "Earthfield"], spellCooldownMult: 1, spellCooldownMod: 14, followLeashedOnly: true,
		visionRadius: 9, maxhp: 12, minLevel:14, weight:-2, movePoints: 2, attackPoints: 3, attack: "SpellMeleeWillBindLock", attackWidth: 3, attackRange: 1, power: 4, dmgType: "grope", fullBoundBonus: 2,
		terrainTags: {"secondhalf":1, "thirdhalf":2, "elementsAnger": 12, "elementsRage": 6}, floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrines: ["Elements", "Metal"],
		dropTable: [{name: "Gold", amountMin: 15, amountMax: 20, weight: 10}, {name: "EarthRune", weight: 3}]},
	{name: "ElementalAir", color: "#88aaff", tags: KDMapInit(["opendoors", "elemental", "melee", "elite", "fireweakness", "electricimmune", "coldweakness", "latexRestraints", "leashing", "hunter"]), armor: -1, followRange: 1, AI: "hunt", evasion: 0.5,
		specialCD: 5, specialAttack: "Dash", specialRemove: "WillBind", specialCDonAttack: true, specialAttackPoints: 1, specialRange: 3, specialMinrange: 1.5, specialsfx: "Miss", castWhileMoving: true, dashThruWalls: true, dashThrough: true,
		spells: ["AreaElectrify"], spellCooldownMult: 1, spellCooldownMod: 3, followLeashedOnly: true, disarm: 1, noSpellLeashing: true,
		visionRadius: 8, maxhp: 12, minLevel:12, weight:-2, movePoints: 1, attackPoints: 2, attack: "SpellMeleeWillBindLock", attackWidth: 1, attackRange: 1, power: 1, dmgType: "grope", fullBoundBonus: 3,
		terrainTags: {"secondhalf":1, "thirdhalf":2, "elementsAnger": 12, "elementsRage": 6}, floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrines: ["Elements", "Latex"],
		dropTable: [{name: "Gold", amountMin: 15, amountMax: 20, weight: 10}]},


	{name: "ChaoticCrystal", color: "#ff00aa55", hitsfx: "DealDamage", tags: KDMapInit(["crystal", "minor", "melee", "crushweakness"]), regen: -1,
		evasion: -9, ignorechance: 1.0, armor: 0, followRange: 1, AI: "wander",
		visionRadius: 1.5, blindSight: 1.5, maxhp: 10, minLevel:0, weight:-99, movePoints: 99999, attackPoints: 2, attack: "MeleeWill", attackWidth: 8, attackRange: 1, power: 1, dmgType: "pain",
		terrainTags: {"passage": -999, "door": -99, "open": 1}, floors:[], shrines: []},

	{name: "Gag", tags: KDMapInit(["ignoreharmless", "construct", "melee", "ballGagRestraints", "minor"]), ignorechance: 0.75, followRange: 1, AI: "wander", ignoreflag: ["ropesnake"], failAttackflag: ["ropesnake"], squeeze: true,
		visionRadius: 3, maxhp: 4, minLevel: 3, weight:2, movePoints: 1, attackPoints: 2, attack: "MeleeBindSuicide", suicideOnAdd: true, attackWidth: 1, attackRange: 1, power: 1, dmgType: "grope", fullBoundBonus: 4,
		terrainTags: {"secondhalf":3, "lastthird":2, "increasingWeight":-1}, floors:[0, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrines: ["Rope"]},
	{name: "RopeSnake", tags: KDMapInit(["ignoreharmless", "construct", "melee", "ropeRestraints", "minor", "fireweakness", "slashweakness"]), ignorechance: 0.75, followRange: 1, AI: "wander", squeeze: true,
		ignoreflag: ["ropesnake"], failAttackflag: ["ropesnake"],
		visionRadius: 3, maxhp: 4, minLevel: 1, weight:3, movePoints: 1, attackPoints: 2, attack: "MeleeBindSuicide", suicideOnAdd: true, attackWidth: 1, attackRange: 1, power: 1, dmgType: "grope", fullBoundBonus: 4,
		terrainTags: {"secondhalf":4, "lastthird":2, "increasingWeight":-3}, floors:[0, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrines: ["Rope"]},
	{name: "UnforseenRope", tags: KDMapInit(["ignoreharmless", "construct", "melee", "ropeRestraints", "ropeRestraints2", "minor", "fireweakness", "slashweakness", "search"]), ignorechance: 0.75, followRange: 1, AI: "hunt", stealth: 2.5, squeeze: true,
		ignoreflag: ["ropesnake"], failAttackflag: ["ropesnake"],
		visionRadius: 10, blindSight: 8, maxhp: 4, minLevel: 1, weight:0, movePoints: 1, attackPoints: 2, attack: "MeleeBindSuicide", suicideOnAdd: true, attackWidth: 1, attackRange: 1, power: 4, dmgType: "grope", fullBoundBonus: 1,
		terrainTags: {"secondhalf":1, "lastthird":3}, floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrines: ["Rope"]},
	{name: "LearnedRope", tags: KDMapInit(["ignoreharmless", "construct", "melee", "ropeRestraints", "ropeRestraints2", "fireweakness", "slashweakness", "search"]), ignorechance: 0.75, followRange: 1, AI: "hunt", squeeze: true, disarm: 0.5,
		ignoreflag: ["ropesnake"], failAttackflag: ["ropesnake"],
		visionRadius: 5, maxhp: 8, minLevel: 3, weight:1, movePoints: 2, attackPoints: 3, attack: "MeleeBindSuicide", suicideOnAdd: true, attackWidth: 1, attackRange: 2, power: 3, multiBind: 2, dmgType: "grope", fullBoundBonus: 5,
		terrainTags: {"secondhalf":4, "lastthird":2}, floors:[0, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrines: ["Rope"]},
	{name: "MonsterRope", tags: KDMapInit(["ignoreharmless", "construct", "melee", "ropeRestraints", "ropeRestraints2", "elite", "fireweakness", "slashweakness", "hunter"]), ignorechance: 0.75, followRange: 1, AI: "guard",
		ignoreflag: ["ropesnake"], failAttackflag: ["ropesnake"], disarm: 0.5,
		visionRadius: 6, maxhp: 20, minLevel: 5, weight:0, movePoints: 3, attackPoints: 2, attack: "MeleeBindSuicide", suicideOnAdd: true, attackWidth: 3, attackRange: 1, power: 5, multiBind: 5, dmgType: "grope", fullBoundBonus: 15,
		terrainTags: {"secondhalf":1, "lastthird":4, "increasingWeight":2}, floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrines: ["Rope"]},

	{name: "RopeKraken", tags: KDMapInit(["construct", "melee", "boss", "elite", "fireweakness", "slashweakness", "hunter"]), ignorechance: 0.75, followRange: 1, AI: "hunt", summon: [{enemy: "RopeMinion", range: 2.5, count: 8, strict: true}],
		spells: ["RopeEngulf"], spellCooldownMult: 1, spellCooldownMod: 1, ignoreflag: ["kraken"], disarm: 0.25,
		visionRadius: 10, maxhp: 60, minLevel: 8, weight:-31, movePoints: 4, attackPoints: 2, attack: "Spell", attackWidth: 1, attackRange: 1, power: 6, dmgType: "grope",
		terrainTags: {"secondhalf":16, "lastthird":5, "boss": -80, "open": 30, "passage": -60, "ropeAnger": 20, "ropeRage": 70, "increasingWeight":0.5}, floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrines: ["Rope"],
		dropTable: [{name: "Knives", weight: 4}, {name: "EnchKnife", weight: 3}]},
	{name: "RopeMinion", tags: KDMapInit(["construct", "melee", "fireweakness", "minor", "slashweakness"]), ignorechance: 0.75, followRange: 1, AI: "hunt", master: {type: "RopeKraken", range: 4}, ignoreflag: ["kraken"], dependent: true,
		visionRadius: 10, maxhp: 8, minLevel: 1, weight:-1000, movePoints: 1, attackPoints: 2, attack: "MeleePullWill", attackWidth: 1, attackRange: 1, power: 3, dmgType: "crush", fullBoundBonus: 1, noAlert: true,
		terrainTags: {}, floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrines: ["Rope"]},

	{name: "Rat", tags: KDMapInit(["ignorenoSP", "beast", "melee", "minor"]), followRange: 1, AI: "guard", squeeze: true,
		visionRadius: 4, maxhp: 1, evasion: 0.5, minLevel:0, weight:8, movePoints: 1.5, attackPoints: 2, attack: "MeleeWill", attackWidth: 1, attackRange: 1, power: 3, dmgType: "pain",
		terrainTags: {"rubble":20, "increasingWeight":-5}, floors:[0]},

	{name: "WitchShock", tags: KDMapInit(["leashing", "opendoors", "closedoors", "witch", "ranged", "elite", "miniboss", "unflinching", "electricimmune", "glueweakness", "iceweakness", "hunter"]), followRange: 2,
		castWhileMoving: true, spells: ["WitchElectrify"], stopToCast: true,
		spellCooldownMult: 1, spellCooldownMod: 0, AI: "hunt", visionRadius: 6, maxhp: 15, minLevel:3, weight:10, movePoints: 2, attackPoints: 2, attack: "Spell", attackWidth: 1, attackRange: 1, power: 1, dmgType: "grope", fullBoundBonus: 1,
		terrainTags: {"secondhalf":2, "lastthird":1, "miniboss": -10}, floors:[0, 1], shrines: ["Elements"], dropTable: [{name: "RedKey", weight: 9}, {name: "BlueKey", weight: 2}]},
	{name: "WitchChain", color: "#AAAAAA", tags: KDMapInit(["leashing", "opendoors", "closedoors", "witch", "melee", "elite", "miniboss", "unflinching", "electricweakness", "meleeresist", "fireresist", "hunter"]), followRange: 1, spells: ["WitchChainBolt"],
		spellCooldownMult: 2, spellCooldownMod: 2, AI: "hunt", visionRadius: 6, maxhp: 15, minLevel:5, weight:6, movePoints: 3, disarm: 0.33,
		attackPoints: 4, attack: "MeleeLockAllWillSpell", attackWidth: 1, attackRange: 1, power: 4, dmgType: "grope",
		terrainTags: {"secondhalf":3, "lastthird":3, "miniboss": -10}, floors:[0, 1], shrines: ["Metal"], dropTable: [{name: "RedKey", weight: 9}, {name: "BlueKey", weight: 1}]},
	{name: "WitchSlime", tags: KDMapInit(["leashing", "opendoors", "closedoors", "witch", "ranged", "elite", "miniboss", "unflinching", "glueimmune", "fireimmune", "meleeresist", "electricweakness", "iceweakness", "hunter"]), squeeze: true,
		followLeashedOnly: true, kite: 1.5, followRange: 4, castWhileMoving: true, spells: ["WitchSlimeBall", "WitchSlimeBall", "WitchSlime"], stopToCast: true,
		spellCooldownMult: 2, spellCooldownMod: 1, AI: "wander", visionRadius: 8, maxhp: 13, minLevel:4, weight:4, movePoints: 3, attackPoints: 2, attack: "Spell", attackWidth: 1, attackRange: 1, power: 1, dmgType: "grope", fullBoundBonus: 1,
		terrainTags: {"secondhalf":2, "lastthird":1, "miniboss": -12, "open": 4}, floors:[0, 1, 2], shrines: [], dropTable: [{name: "RedKey", weight: 8}, {name: "BlueKey", weight: 1}]},
	{name: "Necromancer", tags: KDMapInit(["leashing", "opendoors", "closedoors", "witch", "ranged", "elite", "miniboss", "unflinching", "meleeweakness", "hunter"]), followRange: 1, cohesion: 0.9,
		spells: ["SummonSkeleton", "SummonSkeletons"], spellCooldownMult: 1, spellCooldownMod: 2,
		AI: "hunt", visionRadius: 10, maxhp: 20, minLevel: 1, weight:6, movePoints: 3, attackPoints: 3, attack: "MeleeLockAllWillSpell", attackWidth: 1, attackRange: 1, power: 5, dmgType: "grope",
		terrainTags: {"secondhalf":3, "lastthird":3, "miniboss": -100}, shrines: ["Will"], floors:[1, 2, 3, 11],
		dropTable: [{name: "Gold", amountMin: 30, amountMax: 40, weight: 12}, {name: "BlueKey", weight: 1}]},

	{name: "Mummy", color: "#00FF00", tags: KDMapInit(["leashing", "opendoors", "closedoors", "melee", "witch", "elite", "mummyRestraints", "iceresist", "meleeweakness", "hunter"]), followLeashedOnly: true, followRange: 1,
		spells: ["MummyBolt"], minSpellRange: 1.5, specialCD: 3, specialAttack: "Bind", spellCooldownMult: 1, spellCooldownMod: 5,
		AI: "hunt", visionRadius: 7, maxhp: 8, minLevel:5, weight:11, movePoints: 2, attackPoints: 1, attack: "SpellMeleeWill", attackWidth: 1, attackRange: 1, power: 2, fullBoundBonus: 1, dmgType: "crush",
		terrainTags: {"secondhalf":2, "lastthird":2, "open": 2, "increasingWeight":1}, floors:[11], shrines: ["Will"], dropTable: [{name: "Gold", amountMin: 15, amountMax: 20, weight: 10}, {name: "PotionStamina", weight: 1}, {name: "BlueKey", weight: 1}]},
	{name: "Cleric", color: "#00FF00", tags: KDMapInit(["leashing", "opendoors", "closedoors", "ranged", "search"]), followLeashedOnly: true, followRange: 4, attackThruBars: true,
		AI: "guard", visionRadius: 7, maxhp: 8, minLevel:0, weight:8, movePoints: 1, attackPoints: 3, attack: "MeleeWillStun", attackWidth: 1, attackRange: 6, power: 3, fullBoundBonus: 1, dmgType: "crush", noCancelAttack: true, strictAttackLOS: true,
		terrainTags: {"secondhalf":2, "lastthird":4, "passage": -99, "open": 4}, floors:[11], shrines: ["Will"], dropTable: [{name: "Gold", amountMin: 10, amountMax: 20, weight: 12}, {name: "PotionMana", weight: 1}, {name: "RedKey", weight: 1}]},
	{name: "MeleeCleric", tags: KDMapInit(["leashing", "opendoors", "closedoors", "melee", "kittyRestraints", "search"]), followRange: 1, blindSight: 4, specialCD: 3, specialAttack: "Bind",
		AI: "hunt", visionRadius: 6, maxhp: 8, minLevel:0, weight:10, movePoints: 2, attackPoints: 2, attack: "MeleeWill", attackWidth: 1, attackRange: 1, power: 2, fullBoundBonus: 2, dmgType: "grope",
		terrainTags: {"secondhalf":2, "lastthird":2}, floors:[11], shrines: ["Will"], dropTable: [{name: "Gold", amountMin: 10, amountMax: 20, weight: 12}, {name: "PotionStamina", weight: 1}, {name: "RedKey", weight: 1}]},

	{name: "Jailer", tags: KDMapInit(["leashing", "opendoors", "closedoors", "jailer", "melee", "shackleRestraints"]), keys: true, followRange: 1, AI: "patrol", visionRadius: 7, maxhp: 12, minLevel: -1, weight:0, movePoints: 1, attackPoints: 3, attack: "MeleeBindLockAllWill", attackWidth: 1, attackRange: 1, power: 5, dmgType: "grope", fullBoundBonus: 3,
		terrainTags: {"jailer": 15}, floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], disarm: 0.5, evasion: -0.5,
		dropTable: [{name: "Gold", amountMin: 5, amountMax: 10, weight: 10}, {name: "Pick", weight: 7}, {name: "RedKey", weight: 6}, {name: "BlueKey", weight: 1}, {name: "SmokeBomb", weight: 2}], rep: {"Prisoner": 1}},
	{name: "Guard", tags: KDMapInit(["leashing", "opendoors", "closedoors", "jailer", "melee", "minor", "shackleRestraints"]), keys: true, followRange: 1, AI: "guard", visionRadius: 7, disarm: 0.5,
		maxhp: 12, minLevel: -1, weight:0, movePoints: 1, attackPoints: 3, attack: "MeleeBindLockAllWill", attackWidth: 1, attackRange: 1, power: 5, dmgType: "grope", fullBoundBonus: 3, evasion: -0.5,
		terrainTags: {}, floors:[], dropTable: [{name: "RedKey", weight: 1}], rep: {"Prisoner": 10}},
	{name: "GuardHeavy", tags: KDMapInit(["leashing", "opendoors", "closedoors", "jailer", "melee", "elite", "hunter", "miniboss", "shackleRestraints"]), disarm: 0.5,
		keys: true, followRange: 1, AI: "guard", visionRadius: 7, maxhp: 12, minLevel: 9, weight:-20, movePoints: 1, attackPoints: 2, evasion: -0.5,
		attack: "MeleeBindLockAllWillStun", attackWidth: 3, attackRange: 1, power: 12, dmgType: "electric", stunTime: 1,
		terrainTags: {"jailer": 22, "increasingWeight": 1, "jailbreak": 28}, floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], dropTable: [{name: "RedKey", weight: 1}], rep: {"Prisoner": 1}},

];

let KinkyDungeonSpawnJailers = 0;
let KinkyDungeonSpawnJailersMax = 5;
let KinkyDungeonLeashedPlayer = 0;
let KinkyDungeonLeashingEnemy = null;
let KinkyDungeonDoorShutTimer = 6;

let KinkyDungeonSummonCount = 2;

function KinkyDungeonNearestPatrolPoint(x, y) {
	let dist = 100000;
	let point = -1;
	for (let p of KinkyDungeonPatrolPoints) {
		let d = Math.max(Math.abs(x - p.x), Math.abs(y - p.y));
		if (d < dist) {
			dist = d;
			point = KinkyDungeonPatrolPoints.indexOf(p);
		}
	}

	return point;
}

let KinkyDungeonFlags = {};

function KinkyDungeonSetFlag(Flag, Duration) {
	if (!KinkyDungeonFlags[Flag] || KinkyDungeonFlags[Flag] > 0) {
		KinkyDungeonFlags[Flag] = Duration;
	}
}

function KinkyDungeonUpdateFlags(delta) {
	for (let f of Object.keys(KinkyDungeonFlags)) {
		if (KinkyDungeonFlags[f] > 0) KinkyDungeonFlags[f] -= delta;
		else KinkyDungeonFlags[f] = undefined;
	}
}

function KinkyDungeonGetPatrolPoint(index, radius, Tiles) {
	let p = KinkyDungeonPatrolPoints[index];
	let t = Tiles ? Tiles : KinkyDungeonMovableTilesEnemy;
	if (p) {
		for (let i = 0; i < 8; i++) {
			let XX = p.x + Math.round(Math.random() * 2 * radius - radius);
			let YY = p.y + Math.round(Math.random() * 2 * radius - radius);
			if (t.includes(KinkyDungeonMapGet(XX, YY))) {
				return {x: XX, y: YY};
			}
		}
	}
	return p;
}

function KinkyDungeonNearestPlayer(enemy, requireVision, decoy) {
	if (decoy) {
		let pdist = Math.sqrt((KinkyDungeonPlayerEntity.x - enemy.x)*(KinkyDungeonPlayerEntity.x - enemy.x)
			+ (KinkyDungeonPlayerEntity.y - enemy.y)*(KinkyDungeonPlayerEntity.y - enemy.y));
		let nearestVisible = undefined;
		let nearestDistance = !enemy.Enemy.allied ? pdist - 0.1 : 100000;

		for (let e of KinkyDungeonEntities) {
			if ((e.Enemy && e.Enemy.allied && (!enemy.Enemy || !enemy.Enemy.allied)) || (enemy.Enemy.allied && !e.Enemy.allied) || (enemy.rage && enemy != e)) {
				let dist = Math.sqrt((e.x - enemy.x)*(e.x - enemy.x)
					+ (e.y - enemy.y)*(e.y - enemy.y));
				if (dist <= nearestDistance) {
					if (KinkyDungeonCheckLOS(enemy, e, dist, enemy.Enemy.visionRadius, true, true)) {
						if (enemy.rage || !e.Enemy.lowpriority
								|| !KinkyDungeonCheckLOS(enemy, KinkyDungeonPlayerEntity, pdist, enemy.Enemy.visionRadius, true, true)
								|| !KinkyDungeonCheckPath(enemy.x, enemy.y, e.x, e.y, false, true)) {
							nearestVisible = e;
							nearestDistance = dist;
						}
					}
				}
			}
		}

		if (nearestVisible) return nearestVisible;
	}
	return KinkyDungeonPlayerEntity;
}

function KinkyDungeonGetEnemy(tags, Level, Index, Tile, requireTags) {
	var enemyWeightTotal = 0;
	var enemyWeights = [];

	for (let L = 0; L < KinkyDungeonEnemies.length; L++) {
		var enemy = KinkyDungeonEnemies[L];
		let effLevel = Level + 25 * KinkyDungeonNewGame;
		let weightMulti = 1.0;
		let weightBonus = 0;

		if (enemy.shrines) {
			for (let s = 0; s < enemy.shrines.length; s++) {
				if (KinkyDungeonGoddessRep[enemy.shrines[s]]) {
					let rep = KinkyDungeonGoddessRep[enemy.shrines[s]];
					if (rep > 0) weightMulti *= Math.max(0, 1.0/(rep/50));
					else if (rep < 0) {
						weightMulti *= Math.max(1, 1 + 0.2/(-rep/50));
						weightBonus += Math.min(10, -rep/8);
						effLevel += -rep/2.5;
					}
				}
			}
		}

		let noOverride = ["boss", "miniboss", "elite", "minor"];
		let overrideFloor = false;
		for (let t of tags) {
			if (!noOverride.includes(t))
				if (enemy.tags.has(t)) {
					overrideFloor = true;
					weightMulti *= 1.25;
				}
		}

		if (effLevel >= enemy.minLevel && (overrideFloor || enemy.floors.includes(Index)) && (KinkyDungeonGroundTiles.includes(Tile) || !enemy.tags.has("spawnFloorsOnly"))) {
			let rt = requireTags ? false : true;
			if (requireTags)
				for (let t of requireTags) {
					if (enemy.tags.has(t)) {rt = true; break;}
				}
			if (rt) {
				enemyWeights.push({enemy: enemy, weight: enemyWeightTotal});
				let weight = enemy.weight + weightBonus;
				if (enemy.terrainTags.increasingWeight)
					weight += enemy.terrainTags.increasingWeight * Math.floor(Level/10);
				if (!enemy.terrainTags.grate && tags.includes("grate"))
					weight -= 1000;
				for (let T = 0; T < tags.length; T++)
					if (enemy.terrainTags[tags[T]]) weight += enemy.terrainTags[tags[T]];

				if (weight > 0)
					enemyWeightTotal += Math.max(0, weight*weightMulti);
			}
		}
	}

	var selection = Math.random() * enemyWeightTotal;

	for (let L = enemyWeights.length - 1; L >= 0; L--) {
		if (selection > enemyWeights[L].weight) {
			return enemyWeights[L].enemy;
		}
	}
}
let KinkyDungeonFastMoveSuppress = false;
let KinkyDungeonFastStruggleSuppress = false;
function KinkyDungeonDrawEnemies(canvasOffsetX, canvasOffsetY, CamX, CamY) {
	let reenabled = false;
	let reenabled2 = false;
	if (KinkyDungeonFastMoveSuppress) { //&& !CommonIsMobile
		KinkyDungeonFastMove = true;
		KinkyDungeonFastMovePath = [];
		KinkyDungeonFastMoveSuppress = false;
		reenabled = true;
	}
	if (KinkyDungeonFastStruggleSuppress) {
		KinkyDungeonFastStruggle = true;
		KinkyDungeonFastStruggleType = "";
		KinkyDungeonFastStruggleGroup = "";
		KinkyDungeonFastStruggleSuppress = false;
		reenabled2 = true;
	}
	for (let b of KinkyDungeonBullets) {
		let bdist = 1.5;
		if (b.vx && b.vy) bdist = 2*Math.sqrt(b.vx*b.vx + b.vy*b.vy);
		if (KinkyDungeonLightGet(Math.round(b.x), Math.round(b.y)) > 0 && Math.max(Math.abs(b.x - KinkyDungeonPlayerEntity.x), Math.abs(b.y - KinkyDungeonPlayerEntity.y)) < bdist) {
			if (KinkyDungeonFastStruggle) {
				if (KinkyDungeonFastStruggle && !KinkyDungeonFastStruggleSuppress && !reenabled2)
					KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Click.ogg");
				KinkyDungeonFastStruggle = false;
				KinkyDungeonFastStruggleGroup = "";
				KinkyDungeonFastStruggleType = "";
				reenabled2 = false;
				//if (!CommonIsMobile)
				KinkyDungeonFastStruggleSuppress = true;
			}
			if (KinkyDungeonFastMove) {
				if (KinkyDungeonFastMove && !KinkyDungeonFastMoveSuppress && !reenabled)
					KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Click.ogg");
				KinkyDungeonFastMove = false;
				KinkyDungeonFastMovePath = [];
				reenabled = false;
				//if (!CommonIsMobile)
				KinkyDungeonFastMoveSuppress = true;
			}
		}
	}

	for (let E = 0; E < KinkyDungeonEntities.length; E++) {
		let enemy = KinkyDungeonEntities[E];
		let sprite = enemy.Enemy.name;
		KinkyDungeonUpdateVisualPosition(enemy, KinkyDungeonDrawDelta);
		let tx = enemy.visual_x;
		let ty = enemy.visual_y;
		let playerDist = Math.max(Math.abs(KinkyDungeonEntities[E].x - KinkyDungeonPlayerEntity.x), Math.abs(KinkyDungeonEntities[E].y - KinkyDungeonPlayerEntity.y));
		if (KinkyDungeonEntities[E].x >= CamX && KinkyDungeonEntities[E].y >= CamY && KinkyDungeonEntities[E].x < CamX + KinkyDungeonGridWidthDisplay && KinkyDungeonEntities[E].y < CamY + KinkyDungeonGridHeightDisplay) {
			if (((enemy.revealed && !enemy.Enemy.noReveal) || !enemy.Enemy.stealth || KinkyDungeonSeeAll || playerDist <= enemy.Enemy.stealth + 0.1) && !(KinkyDungeonGetBuffedStat(enemy.buffs, "Sneak") > 0)) {
				enemy.revealed = true;
				if (!enemy.Enemy.allied && KinkyDungeonLightGet(KinkyDungeonEntities[E].x, KinkyDungeonEntities[E].y) > 0 && KinkyDungeonFastMove &&
					(enemy.Enemy.AI != "ambush" || enemy.ambushtrigger)) {
					if (KinkyDungeonFastMove && !KinkyDungeonFastMoveSuppress && !reenabled)
						KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Click.ogg");
					KinkyDungeonFastMove = false;
					KinkyDungeonFastMovePath = [];
					reenabled = false;
					if (!CommonIsMobile)
						KinkyDungeonFastMoveSuppress = true;
				}
				if (!enemy.Enemy.allied && KinkyDungeonLightGet(KinkyDungeonEntities[E].x, KinkyDungeonEntities[E].y) > 0 && KinkyDungeonFastStruggle &&
					(enemy.Enemy.AI != "ambush" || enemy.ambushtrigger)) {
					if (KinkyDungeonFastStruggle && !KinkyDungeonFastStruggleSuppress && !reenabled2)
						KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Click.ogg");
					KinkyDungeonFastStruggle = false;
					KinkyDungeonFastStruggleGroup = "";
					KinkyDungeonFastStruggleType = "";
					reenabled2 = false;
					if (!CommonIsMobile)
						KinkyDungeonFastStruggleSuppress = true;
				}
				DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Enemies/" + sprite + ".png",
					KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
					(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay,
					KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);

				if (enemy.aware && !enemy.Enemy.allied && enemy.vp > 0 && enemy.Enemy && !enemy.Enemy.noAlert && enemy.Enemy.visionRadius > 1.6 && enemy.Enemy.movePoints < 90 && enemy.Enemy.AI != "ambush") {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/Aware.png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay - KinkyDungeonGridSizeDisplay/2,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
				if (enemy.stun > 0) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/Stun.png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
				if (enemy.bind > 0) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/Bind.png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
				if (enemy.slow > 0) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/Slow.png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
				if (KinkyDungeonGetBuffedStat(enemy.buffs, "AttackDmg") > 0) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/Buff.png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
				if (KinkyDungeonGetBuffedStat(enemy.buffs, "AttackDmg") < 0) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/Debuff.png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
				if (KinkyDungeonGetBuffedStat(enemy.buffs, "Armor") < 0) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/ArmorDebuff.png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				} else if (KinkyDungeonGetBuffedStat(enemy.buffs, "Armor") > 0) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/ArmorBuff.png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
			}
			if (enemy.freeze > 0) {
				DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/Freeze.png",
					KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
					(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay,
					KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
			}
		}
	}
	if (reenabled && KinkyDungeonFastMove) {
		KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Click.ogg");
	} else if (reenabled2 && KinkyDungeonFastStruggle) {
		KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Click.ogg");
	}
}


function KinkyDungeonDrawEnemiesWarning(canvasOffsetX, canvasOffsetY, CamX, CamY) {
	for (let E = 0; E < KinkyDungeonEntities.length; E++) {
		var enemy = KinkyDungeonEntities[E];
		if (enemy.warningTiles) {
			for (let T=0; T<enemy.warningTiles.length; T++) {
				var tx = enemy.x + enemy.warningTiles[T].x;
				var ty = enemy.y + enemy.warningTiles[T].y;
				//  && KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(tx, ty))
				if (tx >= CamX && ty >= CamY && tx < CamX + KinkyDungeonGridWidthDisplay && ty < CamY + KinkyDungeonGridHeightDisplay && !(tx == enemy.x && ty == enemy.y)) {
					if (enemy.Enemy.color)
						DrawImageCanvasColorize(KinkyDungeonRootDirectory + "WarningColor.png", KinkyDungeonContext,
							(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay,
							KinkyDungeonSpriteSize/KinkyDungeonGridSizeDisplay,
							enemy.Enemy.color, true, []);
					else
						DrawImageZoomCanvas(KinkyDungeonRootDirectory + ((enemy.Enemy && enemy.Enemy.allied) ? "WarningAlly.png" : "Warning.png"),
							KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
							(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay,
							KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
			}
		}
	}
}

function KinkyDungeonBar(x, y, w, h, value, foreground = "#66FF66", background = "red") {
	if (value < 0) value = 0;
	if (value > 100) value = 100;
	DrawRect(x + 2, y + 2, Math.floor((w - 4) * value / 100), h - 4, foreground);
	DrawRect(Math.floor(x + 2 + (w - 4) * value / 100), y + 2, Math.floor((w - 4) * (100 - value) / 100), h - 4, background);
}

function KinkyDungeonDrawEnemiesHP(canvasOffsetX, canvasOffsetY, CamX, CamY) {
	let tooltip = false;
	for (let E = 0; E < KinkyDungeonEntities.length; E++) {
		var enemy = KinkyDungeonEntities[E];
		let playerDist = Math.max(Math.abs(KinkyDungeonEntities[E].x - KinkyDungeonPlayerEntity.x), Math.abs(KinkyDungeonEntities[E].y - KinkyDungeonPlayerEntity.y));
		if (enemy.x >= CamX && enemy.y >= CamY && enemy.x < CamX + KinkyDungeonGridWidthDisplay && enemy.y < CamY + KinkyDungeonGridHeightDisplay
			&& KinkyDungeonLightGet(enemy.x, enemy.y) > 0) {
			let xx = enemy.visual_x ? enemy.visual_x : enemy.x;
			let yy = enemy.visual_y ? enemy.visual_y : enemy.y;
			if ((!enemy.Enemy.stealth || playerDist <= enemy.Enemy.stealth + 0.1) && !(KinkyDungeonGetBuffedStat(enemy.buffs, "Sneak") > 0)
				&& (enemy.Enemy.allied || ((enemy.lifetime != undefined || enemy.hp < enemy.Enemy.maxhp)))) {
				if (enemy.lifetime != undefined && enemy.maxlifetime > 0 && enemy.maxlifetime < 999) {
					KinkyDungeonBar(canvasOffsetX + (xx - CamX)*KinkyDungeonGridSizeDisplay, canvasOffsetY + (yy - CamY)*KinkyDungeonGridSizeDisplay - 12,
						KinkyDungeonGridSizeDisplay, 12, enemy.lifetime / enemy.maxlifetime * 100, "#cccccc", "#000000");
				}
				KinkyDungeonBar(canvasOffsetX + (xx - CamX)*KinkyDungeonGridSizeDisplay, canvasOffsetY + (yy - CamY)*KinkyDungeonGridSizeDisplay,
					KinkyDungeonGridSizeDisplay, 12, enemy.hp / enemy.Enemy.maxhp * 100, enemy.Enemy.allied ? "#00ff88" : "#ff0000", enemy.Enemy.allied ? "#aa0000" : "#000000");
			}
			if ((((enemy.revealed && !enemy.Enemy.noReveal) || !enemy.Enemy.stealth || KinkyDungeonSeeAll || playerDist <= enemy.Enemy.stealth + 0.1) && !(KinkyDungeonGetBuffedStat(enemy.buffs, "Sneak") > 0)))
				if (!tooltip && (enemy.Enemy.AI != "ambush" || enemy.ambushtrigger) && MouseIn(canvasOffsetX + (xx - CamX)*KinkyDungeonGridSizeDisplay, canvasOffsetY + (yy - CamY)*KinkyDungeonGridSizeDisplay,
					KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay)) {
					let name = TextGet("Name" + enemy.Enemy.name);
					DrawTextFit(name, 1 + canvasOffsetX + (xx - CamX)*KinkyDungeonGridSizeDisplay + KinkyDungeonGridSizeDisplay/2, 1 + canvasOffsetY + (yy - CamY)*KinkyDungeonGridSizeDisplay - KinkyDungeonGridSizeDisplay/7, 10 + name.length * 8, "black", "black");
					DrawTextFit(name, canvasOffsetX + (xx - CamX)*KinkyDungeonGridSizeDisplay + KinkyDungeonGridSizeDisplay/2, canvasOffsetY + (yy - CamY)*KinkyDungeonGridSizeDisplay - KinkyDungeonGridSizeDisplay/7, 10 + name.length * 8, "white", "black");
					tooltip = true;
				}
		}
	}
}

function KinkyDungeonEnemyCheckHP(enemy, E) {
	if (enemy.hp <= 0) {
		KinkyDungeonEntities.splice(E, 1);
		if (enemy == KinkyDungeonKilledEnemy && Math.max(3, enemy.Enemy.maxhp/4) >= KinkyDungeonActionMessagePriority) {

			KinkyDungeonSendActionMessage(1, TextGet("Kill"+enemy.Enemy.name), "orange", 1);

			KinkyDungeonKilledEnemy = null;
		}
		if (enemy.Enemy && enemy.Enemy.tags && enemy.Enemy.tags.has("boss"))
			KinkyDungeonChangeRep("Ghost", -5);
		else if (enemy.Enemy && enemy.Enemy.tags && enemy.Enemy.tags.has("miniboss"))
			KinkyDungeonChangeRep("Ghost", -2);
		else if (enemy.Enemy && enemy.Enemy.tags && enemy.Enemy.tags.has("elite") && Math.random() < 0.33)
			KinkyDungeonChangeRep("Ghost", -1);

		if (enemy.Enemy && enemy.Enemy.rep)
			for (let rep of Object.keys(enemy.Enemy.rep))
				KinkyDungeonChangeRep(rep, enemy.Enemy.rep[rep]);

		if (enemy.Enemy && enemy.Enemy.ondeath) {
			for (let o of enemy.Enemy.ondeath) {
				if (o.type == "summon") {
					KinkyDungeonSummonEnemy(enemy.x, enemy.y, o.enemy, o.count, o.range, o.strict);
				}
			}
		}
		KinkyDungeonItemDrop(enemy.x, enemy.y, enemy.Enemy.dropTable, enemy.summoned);
		return true;
	}
	return false;
}

function KinkyDungeonCheckLOS(enemy, player, distance, maxdistance, allowBlind, allowBars) {
	let bs = (enemy && enemy.Enemy && enemy.Enemy.blindSight) ? enemy.Enemy.blindSight : 0;
	if (player.player && enemy.Enemy && enemy.Enemy.playerBlindSight) bs = enemy.Enemy.playerBlindSight;
	return distance <= maxdistance && ((allowBlind && bs >= distance) || KinkyDungeonCheckPath(enemy.x, enemy.y, player.x, player.y, allowBars));
}

function KinkyDungeonTrackSneak(enemy, delta, player) {
	if (!enemy.vp) enemy.vp = 0;
	let sneakThreshold = enemy.Enemy.sneakThreshold ? enemy.Enemy.sneakThreshold : 2;
	if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Sneak")) sneakThreshold += KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Sneak");
	if (!player.player) return true;
	let deltaMult = 1/Math.max(1, (1 + KinkyDungeonSubmissiveMult));
	enemy.vp = Math.min(sneakThreshold * 2, enemy.vp + delta*deltaMult);
	return (enemy.vp > sneakThreshold);
}

function KinkyDungeonMultiplicativeStat(Stat) {
	if (Stat > 0) {
		return 1 / (1 + Stat);
	}
	if (Stat < 0) {
		return 1 - Stat;
	}

	return 1;
}

function KinkyDungeonGetRandomEnemyPoint(avoidPlayer, onlyPlayer, Enemy) {
	let tries = 0;

	while (tries < 100) {
		let points = Array.from(KinkyDungeonRandomPathablePoints, ([name, value]) => (value));
		let point = points[Math.floor(points.length * Math.random())];
		if (point) {
			let X = point.x;//1 + Math.floor(Math.random()*(KinkyDungeonGridWidth - 1));
			let Y = point.y;//1 + Math.floor(Math.random()*(KinkyDungeonGridHeight - 1));
			let playerDist = 6;
			let PlayerEntity = KinkyDungeonNearestPlayer({x:X, y:Y});

			if (((!avoidPlayer || Math.sqrt((X - PlayerEntity.x) * (X - PlayerEntity.x) + (Y - PlayerEntity.y) * (Y - PlayerEntity.y)) > playerDist)
				&& (!onlyPlayer || Math.sqrt((X - PlayerEntity.x) * (X - PlayerEntity.x) + (Y - PlayerEntity.y) * (Y - PlayerEntity.y)) <= playerDist))
				&& (KinkyDungeonJailTransgressed || X > KinkyDungeonJailLeashX + 3) && KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(X, Y))
				&& KinkyDungeonNoEnemyExceptSub(X, Y, true, Enemy) && (!KinkyDungeonTiles[X + "," + Y] || !KinkyDungeonTiles[X + "," + Y].OffLimits)) {
				return {x: X, y:Y};
			}
		}
		tries += 1;
	}

	return undefined;
}

function KinkyDungeonGetNearbyPoint(x, y, player=false, Enemy) {
	let slots = [];
	for (let X = -Math.ceil(1); X <= Math.ceil(1); X++)
		for (let Y = -Math.ceil(1); Y <= Math.ceil(1); Y++) {
			if ((X != 0 || Y != 0) && KinkyDungeonTransparentObjects.includes(KinkyDungeonMapGet(x + X, y + Y))) {
				// We add the slot and those around it
				slots.push({x:x + X, y:y + Y});
				slots.push({x:x + X, y:y + Y});
				slots.push({x:x + X, y:y + Y});
				for (let XX = -Math.ceil(1); XX <= Math.ceil(1); XX++)
					for (let YY = -Math.ceil(1); YY <= Math.ceil(1); YY++) {
						if ((Math.abs(X + XX) > 1 || Math.abs(Y + YY) > 1) && KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(x + XX + X, y + YY + Y))) {
							slots.push({x:x + XX + X, y:y + YY + Y});
							slots.push({x:x + XX + X, y:y + YY + Y});
							for (let XXX = -Math.ceil(1); XXX <= Math.ceil(1); XXX++)
								for (let YYY = -Math.ceil(1); YYY <= Math.ceil(1); YYY++) {
									if ((Math.abs(X + XX + XXX) > 2 || Math.abs(Y + YY + YYY) > 2) && KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(x + XX + XXX + X, y + YYY + YY + Y))) {
										slots.push({x:x + XXX + XX + X, y:y + YYY + YY + Y});
									}
								}
						}
					}
			}
		}

	let foundslot = undefined;
	for (let C = 0; C < 100; C++) {
		let slot = slots[Math.floor(Math.random() * slots.length)];
		if (slot && KinkyDungeonNoEnemyExceptSub(slot.x, slot.y, false, Enemy)
			&& Math.max(Math.abs(KinkyDungeonPlayerEntity.x - slot.x), Math.abs(KinkyDungeonPlayerEntity.y - slot.y)) > 1.5
			&& KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(slot.x, slot.y))) {
			foundslot = {x: slot.x, y: slot.y};

			C = 100;
		} else slots.splice(C, 1);
	}
	return foundslot;
}

let KinkyDungeonDamageTaken = false;
let KinkyDungeonTorsoGrabCD = 0;
let KinkyDungeonHuntDownPlayer = false;

function KinkyDungeonUpdateEnemies(delta) {
	let KinkyDungeonSummons = 0;

	for (let i = KinkyDungeonEntities.length-1; i >= 0; i--) {
		let enemy = KinkyDungeonEntities[i];
		if (enemy.Enemy.allied && enemy.summoned && (!enemy.lifetime || enemy.lifetime > 999)) {
			KinkyDungeonSummons += 1;
			if (KinkyDungeonSummons > KinkyDungeonSummonCount) {
				enemy.hp -= Math.max(0.1 * enemy.hp) + 1;
			}
		}
	}

	if (KinkyDungeonTorsoGrabCD > 0) KinkyDungeonTorsoGrabCD -= 1;

	if (KinkyDungeonLeashedPlayer > 0) {
		KinkyDungeonLeashedPlayer -= 1;

		let xx = KinkyDungeonStartPosition.x + KinkyDungeonJailLeashX;
		let yy = KinkyDungeonStartPosition.y;
		if (KinkyDungeonTiles[(xx-1) + "," + yy] && KinkyDungeonTiles[(xx-1) + "," + yy].Type == "Door") {
			KinkyDungeonTiles[(xx-1) + "," + yy].Lock = undefined;
		}
	}
	KinkyDungeonUpdateFlags(delta);
	for (let enemy of KinkyDungeonEntities) {
		let master = KinkyDungeonFindMaster(enemy).master;
		if (master && enemy.aware) master.aware = true;
		if (master && master.aware) enemy.aware = true;
		if (enemy.dependent && !master) enemy.hp = 0;
	}
	for (let E = 0; E < KinkyDungeonEntities.length; E++) {
		let enemy = KinkyDungeonEntities[E];
		let player = KinkyDungeonNearestPlayer(enemy, false, true);

		if (enemy.Enemy.convertTiles) {
			let tile = KinkyDungeonMapGet(enemy.x, enemy.y);
			for (let c of enemy.Enemy.convertTiles) {
				if (c.from == tile && c.to) {
					KinkyDungeonMapSet(enemy.x, enemy.y, c.to);
				}
			}
		}

		// Delete the enemy
		if (KinkyDungeonEnemyCheckHP(enemy, E)) { E -= 1; continue;}

		if (!enemy.castCooldown) enemy.castCooldown = 0;
		if (enemy.castCooldown > 0) enemy.castCooldown = Math.max(0, enemy.castCooldown-delta);
		if (!enemy.castCooldownSpecial) enemy.castCooldownSpecial = 0;
		if (enemy.castCooldownSpecial > 0) enemy.castCooldownSpecial = Math.max(0, enemy.castCooldownSpecial-delta);

		let idle = true;

		if (enemy.Enemy.specialCharges && enemy.specialCharges <= 0) enemy.specialCD = 999;
		if (enemy.specialCD > 0)
			enemy.specialCD -= delta;
		if (enemy.slow > 0)
			enemy.slow -= delta;
		if (enemy.bind > 0)
			enemy.bind -= delta;
		if (enemy.disarmflag > 0 && enemy.Enemy.disarm && KinkyDungeonLastAction != "Attack")
			enemy.disarmflag = Math.max(0, enemy.disarmflag - enemy.Enemy.disarm);
		if (enemy.stun > 0 || enemy.freeze > 0) {
			if (enemy.stun > 0) enemy.stun -= delta;
			if (enemy.freeze > 0) enemy.freeze -= delta;
		} else if (enemy.channel > 0) {
			if (enemy.channel > 0) enemy.channel -= delta;
		} else {
			let start = performance.now();
			idle = KinkyDungeonEnemyLoop(enemy, player, delta);
			let end = performance.now();
			if (KDDebug)
				console.log(`Took ${end - start} milliseconds to run loop for enemy ${enemy.Enemy.name}`);
		}

		if (idle) {
			enemy.movePoints = 0;
			enemy.attackPoints = 0;
			enemy.warningTiles = [];
		}

		if (enemy.vp > 0 && !enemy.path) {
			let sneakThreshold = enemy.Enemy.sneakThreshold ? enemy.Enemy.sneakThreshold : 2;
			if (enemy.vp > sneakThreshold * 2 && !enemy.aware) {
				let sneak = KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Sneak");
				if (sneak > 0)
					enemy.vp = Math.max(sneakThreshold * 2, enemy.vp - 0.5);
			}
			enemy.vp = Math.max(0, enemy.vp - 0.1);
		}

		// Delete the enemy
		if (KinkyDungeonEnemyCheckHP(enemy, E)) { E -= 1;}
		if (enemy.Enemy.regen) enemy.hp = Math.min(enemy.Enemy.maxhp, enemy.hp + enemy.Enemy.regen * delta);
		if (enemy.Enemy.lifespan || enemy.lifetime != undefined) {
			if (enemy.lifetime == undefined) enemy.lifetime = enemy.Enemy.lifespan;
			enemy.lifetime -= delta;
			if (enemy.lifetime <= 0) enemy.hp = 0;
		}
	}

	KinkyDungeonHandleJailSpawns(delta);
	KinkyDungeonHandleWanderingSpawns(delta);
	KinkyDungeonAlert = 0;
}

function KinkyDungeonEnemyLoop(enemy, player, delta) {
	let idle = true;
	let moved = false;
	let ignore = false;
	let followRange = enemy.Enemy.followRange;
	let chaseRadius = 3 + 2*Math.max(enemy.Enemy.visionRadius ? enemy.Enemy.visionRadius : 0, enemy.Enemy.blindSight ? enemy.Enemy.blindSight : 0);
	let ignoreLocks = enemy.Enemy.keys;
	let harmless = (KinkyDungeonPlayerDamage.dmg <= enemy.Enemy.armor || !KinkyDungeonHasStamina(1.1)) && !KinkyDungeonPlayer.CanTalk() && !KinkyDungeonPlayer.CanInteract() && KinkyDungeonSlowLevel > 1;

	// Check if the enemy ignores the player
	if (player.player) {
		if (enemy.Enemy.tags.has("ignorenoSP") && !KinkyDungeonHasStamina(1.1)) ignore = true;
		if (enemy.Enemy.tags.has("ignoreharmless") && (!enemy.warningTiles || enemy.warningTiles.length == 0)
			&& harmless && (!enemy.Enemy.ignorechance || Math.random() < enemy.Enemy.ignorechance || !KinkyDungeonHasStamina(1.1))) ignore = true;
		if (enemy.Enemy.tags.has("ignoretiedup") && (!enemy.warningTiles || enemy.warningTiles.length == 0)
			&& !KinkyDungeonPlayer.CanInteract() && !KinkyDungeonPlayer.CanTalk() && !KinkyDungeonPlayer.CanInteract() && KinkyDungeonSlowLevel > 1
			&& (!enemy.Enemy.ignorechance || Math.random() < enemy.Enemy.ignorechance || !KinkyDungeonHasStamina(1.1))) ignore = true;
		if (enemy.Enemy.tags.has("ignoreboundhands") && (!enemy.warningTiles || enemy.warningTiles.length == 0)
			&& (KinkyDungeonPlayerDamage.dmg <= enemy.Enemy.armor || !KinkyDungeonHasStamina(1.1)) && !KinkyDungeonPlayer.CanInteract()
			&& (!enemy.Enemy.ignorechance || Math.random() < enemy.Enemy.ignorechance || !KinkyDungeonHasStamina(1.1))) ignore = true;
		if (enemy.Enemy.ignoreflag) {
			for (let f of enemy.Enemy.ignoreflag) {
				if (KinkyDungeonFlags[f]) ignore = true;
			}
		}
		if ((enemy.Enemy.tags.has("jailer") || enemy.Enemy.tags.has("jail")) && !KinkyDungeonJailTransgressed) ignore = true;
	}

	let MovableTiles = KinkyDungeonMovableTilesEnemy;
	let AvoidTiles = "g";
	if (enemy.Enemy.tags && enemy.Enemy.tags.has("opendoors")) MovableTiles = KinkyDungeonMovableTilesSmartEnemy;
	if (enemy.Enemy.ethereal) {
		AvoidTiles = "";
		MovableTiles = MovableTiles + "1X";
	} else if (enemy.Enemy.squeeze && KinkyDungeonLeashingEnemy != enemy) {
		MovableTiles = MovableTiles + 'b';
		AvoidTiles = "";
	}

	let attack = enemy.Enemy.attack;
	let usingSpecial = false;
	let range = enemy.Enemy.attackRange;
	let width = enemy.Enemy.attackWidth;
	let accuracy = enemy.Enemy.accuracy ? enemy.Enemy.accuracy : 1.0;
	let vibe = false;
	let damage = enemy.Enemy.dmgType;
	let power = enemy.Enemy.power;


	if (enemy.Enemy.tags && enemy.Enemy.tags.has("leashing") && !KinkyDungeonHasStamina(1.1)) {
		followRange = 1;
		if (!attack.includes("Bind")) attack = "Bind" + attack;
	}

	let hitsfx = (enemy.Enemy && enemy.Enemy.hitsfx) ? enemy.Enemy.hitsfx : "";
	let playerDist = Math.sqrt((enemy.x - player.x)*(enemy.x - player.x) + (enemy.y - player.y)*(enemy.y - player.y));
	if (KinkyDungeonAlert && playerDist < KinkyDungeonAlert) enemy.aware = true;
	if (enemy.Enemy.specialAttack && (!enemy.specialCD || enemy.specialCD <= 0) && (!enemy.Enemy.specialMinrange || playerDist > enemy.Enemy.specialMinrange)) {
		attack = attack + enemy.Enemy.specialAttack;
		usingSpecial = true;
		if (enemy.Enemy && enemy.Enemy.hitsfxSpecial) hitsfx = enemy.Enemy.hitsfxSpecial;

		if (enemy.Enemy.specialRemove) attack = attack.replace(enemy.Enemy.specialRemove, "");
		if (enemy.Enemy.specialRange && usingSpecial) {
			range = enemy.Enemy.specialRange;
		}
		if (enemy.Enemy.specialWidth && usingSpecial) {
			width = enemy.Enemy.specialWidth;
		}
		if (enemy.Enemy.specialPower && usingSpecial) {
			power = enemy.Enemy.specialPower;
		}
		if (enemy.Enemy.specialDamage && usingSpecial) {
			damage = enemy.Enemy.specialDamage;
		}
	}

	if (!enemy.Enemy.attackWhileMoving && range > followRange) {
		followRange = range;
	}
	if (player.player && enemy.Enemy && enemy.Enemy.playerFollowRange) followRange = enemy.Enemy.playerFollowRange;

	var AI = enemy.Enemy.AI;
	if (!enemy.warningTiles) enemy.warningTiles = [];
	let canSensePlayer = KinkyDungeonCheckLOS(enemy, player, playerDist, enemy.Enemy.visionRadius, true, true);
	let canSeePlayer = KinkyDungeonCheckLOS(enemy, player, playerDist, enemy.Enemy.visionRadius, false, false);
	let canSeePlayerMedium = KinkyDungeonCheckLOS(enemy, player, playerDist, enemy.Enemy.visionRadius/1.5, false, true);
	let canSeePlayerClose = KinkyDungeonCheckLOS(enemy, player, playerDist, enemy.Enemy.visionRadius/2, false, true);
	let canSeePlayerVeryClose = KinkyDungeonCheckLOS(enemy, player, playerDist, enemy.Enemy.visionRadius/3, false, true);
	let canShootPlayer = KinkyDungeonCheckLOS(enemy, player, playerDist, enemy.Enemy.visionRadius, false, true);

	if (enemy.Enemy.projectileAttack && !canShootPlayer) followRange = 1;

	if (!KinkyDungeonJailTransgressed && canSeePlayer && (enemy.Enemy.tags.has("jailer") || enemy.Enemy.tags.has("jail")) && (KinkyDungeonPlayer.CanInteract() || (Math.abs(player.x - KinkyDungeonStartPosition.x) >= KinkyDungeonJailLeashX - 1 || Math.abs(player.y - KinkyDungeonStartPosition.y) > KinkyDungeonJailLeash)) && (!KinkyDungeonJailGuard || KinkyDungeonJailGuard.CurrentAction !== "jailLeashTour" || !KinkyDungeonIsWearingLeash())) {
		KinkyDungeonJailTransgressed = true;
		ignore = false;
	}

	let sneakMult = 0.25;
	if (canSeePlayerMedium) sneakMult += 0.35;
	if (canSeePlayerClose) sneakMult += 0.35;
	if (canSeePlayerVeryClose) sneakMult += 0.5;
	if (KinkyDungeonAlert > 0) sneakMult += 1;
	if ((canSensePlayer || canSeePlayer || canShootPlayer) && KinkyDungeonTrackSneak(enemy, delta * (sneakMult), player)) enemy.aware = true;

	let kite = false;
	if (canSeePlayer && enemy.Enemy && enemy.Enemy.kite && !usingSpecial && (!player.player || KinkyDungeonHasStamina(1.1)) && (enemy.attackPoints <= 0 || enemy.Enemy.attackWhileMoving) && playerDist <= enemy.Enemy.kite && (!enemy.Enemy.allied || !player.player)) {
		if (!enemy.Enemy.kiteOnlyWhenDisabled || !(KinkyDungeonStatBlind < 0 || KinkyDungeonStatBind > 0 || KinkyDungeonStatFreeze > 0 || KinkyDungeonSlowMoveTurns > 0 || KinkyDungeonSleepTurns > 0))
			if (!enemy.Enemy.noKiteWhenHarmless || !harmless)
				kite = true;
	}

	if ((AI == "ambush" && enemy.Enemy.wanderTillSees && !enemy.aware && !enemy.ambushtrigger)) {
		idle = true;
		if (ignore || !KinkyDungeonCheckLOS(enemy, player, playerDist, followRange + 0.5, enemy.attackPoints < 1 || !enemy.Enemy.projectileAttack, false) || kite)
			for (let T = 0; T < 8; T++) { // try 8 times
				let dir = KinkyDungeonGetDirection(10*(Math.random()-0.5), 10*(Math.random()-0.5));
				if (MovableTiles.includes(KinkyDungeonMapGet(enemy.x + dir.x, enemy.y + dir.y)) && (T > 5 || !AvoidTiles.includes(KinkyDungeonMapGet(enemy.x + dir.x, enemy.y + dir.y)))
					&& KinkyDungeonNoEnemy(enemy.x + dir.x, enemy.y + dir.y, true)) {
					if (KinkyDungeonEnemyTryMove(enemy, dir, delta, enemy.x + dir.x, enemy.y + dir.y)) moved = true;
					idle = false;
					break;
				}
			}
	} else if ((AI == "guard" || AI == "patrol" || AI == "wander" || AI == "hunt" || (AI == "ambush" && !enemy.ambushtrigger)) && (enemy.Enemy.attackWhileMoving || ignore || !KinkyDungeonCheckLOS(enemy, player, playerDist, followRange + 0.5, enemy.attackPoints < 1 || !enemy.Enemy.projectileAttack, false) || kite)) {
		if (!enemy.gx) enemy.gx = enemy.x;
		if (!enemy.gy) enemy.gy = enemy.y;

		idle = true;
		let patrolChange = false;

		// try 12 times to find a moveable tile, with some random variance
		if (AI != "wander" && !ignore && (playerDist <= enemy.Enemy.visionRadius || (enemy.aware && playerDist <= chaseRadius)) && AI != "ambush" && (enemy.aware || canSensePlayer)) {
			if (!enemy.aware) enemy.path = undefined;
			//enemy.aware = true;
			for (let T = 0; T < 12; T++) {
				let dir = kite ? KinkyDungeonGetDirectionRandom(enemy.x - player.x, enemy.y - player.y) : KinkyDungeonGetDirectionRandom(player.x - enemy.x, player.y - enemy.y);
				let splice = false;
				if (T > 2 && T < 8) dir = KinkyDungeonGetDirectionRandom(dir.x * 10, dir.y * 10); // Fan out a bit
				if (T >= 8 || enemy.path || (!canSeePlayer && !(enemy.Enemy.stopToCast && canShootPlayer))) {
					if (!enemy.path && (KinkyDungeonAlert || enemy.aware || canSeePlayer))
						enemy.path = KinkyDungeonFindPath(enemy.x, enemy.y, player.x, player.y, true, false, ignoreLocks, MovableTiles); // Give up and pathfind
					if (enemy.path && enemy.path.length > 0 && Math.max(Math.abs(enemy.path[0].x - enemy.x),Math.abs(enemy.path[0].y - enemy.y)) < 1.5) {
						dir = {x: enemy.path[0].x - enemy.x, y: enemy.path[0].y - enemy.y, delta: 1};
						if (!KinkyDungeonNoEnemyExceptSub(enemy.x + dir.x, enemy.y + dir.y, false, enemy)) enemy.path = undefined;
						splice = true;
					} else {
						enemy.path = undefined;
						if (!canSensePlayer)
							enemy.aware = false;
						//dir = KinkyDungeonGetDirectionRandom(0, 0); // Random...
					}
				}
				if (KinkyDungeonEnemyCanMove(enemy, dir, MovableTiles, AvoidTiles, ignoreLocks, T)) {
					if (KinkyDungeonEnemyTryMove(enemy, dir, delta, enemy.x + dir.x, enemy.y + dir.y)) moved = true;
					if (moved && splice && enemy.path) enemy.path.splice(0, 1);
					idle = false;
					break;
				}
			}
		} else if (Math.abs(enemy.x - enemy.gx) > 0 || Math.abs(enemy.y - enemy.gy) > 0)  {
			if (enemy.aware) enemy.path = undefined;
			enemy.aware = false;
			for (let T = 0; T < 8; T++) {
				let dir = KinkyDungeonGetDirectionRandom(enemy.gx - enemy.x, enemy.gy - enemy.y);
				let splice = false;
				if (T > 2 && T < 8) dir = KinkyDungeonGetDirectionRandom(dir.x * 10, dir.y * 10); // Fan out a bit
				if (T >= 8 || enemy.path || !KinkyDungeonCheckPath(enemy.x, enemy.y, enemy.gx, enemy.gy)) {
					if (!enemy.path) enemy.path = KinkyDungeonFindPath(enemy.x, enemy.y, enemy.gx, enemy.gy, true, false, ignoreLocks, MovableTiles); // Give up and pathfind
					if (enemy.path && enemy.path.length > 0) {
						dir = {x: enemy.path[0].x - enemy.x, y: enemy.path[0].y - enemy.y, delta: 1};
						if (!KinkyDungeonNoEnemyExceptSub(enemy.x + dir.x, enemy.y + dir.y, false, enemy)) enemy.path = undefined;
						splice = true;
					} else {
						enemy.path = undefined;
					}
				}
				if (KinkyDungeonEnemyCanMove(enemy, dir, MovableTiles, AvoidTiles, ignoreLocks, T)) {
					if (KinkyDungeonEnemyTryMove(enemy, dir, delta, enemy.x + dir.x, enemy.y + dir.y)) moved = true;
					if (moved && splice && enemy.path) enemy.path.splice(0, 1);
					idle = false;
					break;
				}
			}
		} else if (Math.abs(enemy.x - enemy.gx) < 2 || Math.abs(enemy.y - enemy.gy) < 2) patrolChange = true;

		if (AI == "patrol") {
			let patrolChance = patrolChange ? 0.2 : 0.04;
			if (!enemy.patrolIndex) enemy.patrolIndex = KinkyDungeonNearestPatrolPoint(enemy.x, enemy.y);
			if (KinkyDungeonPatrolPoints[enemy.patrolIndex] && Math.random() < patrolChance) {
				if (enemy.patrolIndex < KinkyDungeonPatrolPoints.length - 1) enemy.patrolIndex += 1;
				else enemy.patrolIndex = 0;

				let newPoint = KinkyDungeonGetPatrolPoint(enemy.patrolIndex, 1.4, MovableTiles);
				enemy.gx = newPoint.x;
				enemy.gy = newPoint.y;
			}

		}
		if ((AI == "wander" || AI == "hunt") && enemy.movePoints < 1) {
			if (Math.max(Math.abs(enemy.x - enemy.gx), Math.abs(enemy.y - enemy.gy)) < 1.5 || (!enemy.path || Math.random() < 0.1)) {
				let master = KinkyDungeonFindMaster(enemy).master;
				if (Math.random() < 0.1 && !master) {
					// long distance hunt
					let newPoint = KinkyDungeonGetRandomEnemyPoint(false, enemy.tracking && KinkyDungeonHuntDownPlayer);
					if (newPoint) {
						enemy.gx = newPoint.x;
						enemy.gy = newPoint.y;
					}
				} else {
					// Short distance
					let ex = enemy.x;
					let ey = enemy.y;
					let cohesion = enemy.Enemy.cohesion ? enemy.Enemy.cohesion : 0.3;
					let masterCloseness = enemy.Enemy.cohesion ? enemy.Enemy.cohesion : 0.7;
					if (master && Math.random() < masterCloseness) {
						ex = master.x;
						ey = master.y;
					} else if (Math.random() < cohesion) {
						let minDist = enemy.Enemy.visionRadius / 2;
						for (let e of KinkyDungeonEntities) {
							let dist = KDistEuclidean(e.x - enemy.x, e.y - enemy.y);
							if (dist < minDist) {
								minDist = dist;
								let ePoint = KinkyDungeonGetNearbyPoint(ex, ey, false);
								if (ePoint) {
									ex = ePoint.x;
									ey = ePoint.y;
								}
							}
						}
					}
					let newPoint = KinkyDungeonGetNearbyPoint(ex, ey, false);
					if (newPoint && (KinkyDungeonJailTransgressed || newPoint.x > KinkyDungeonJailLeashX + 3)) {
						enemy.gx = newPoint.x;
						enemy.gy = newPoint.y;
					}
				}
			}
		}
	}

	playerDist = Math.sqrt((enemy.x - player.x)*(enemy.x - player.x) + (enemy.y - player.y)*(enemy.y - player.y));
	if ((!enemy.Enemy.followLeashedOnly || KinkyDungeonLeashedPlayer < 1 || KinkyDungeonLeashingEnemy == enemy) && (!enemy.Enemy.allied || (!player.player && (!player.Enemy || !player.Enemy.allied))) && ((enemy.aware && KinkyDungeonTrackSneak(enemy, 0, player)) || playerDist < Math.max(1.5, enemy.Enemy.blindSight))
		&& (AI != "ambush" || enemy.ambushtrigger) && !ignore && (!moved || enemy.Enemy.attackWhileMoving)
		&& (attack.includes("Melee") || (enemy.Enemy.tags && enemy.Enemy.tags.has("leashing") && !KinkyDungeonHasStamina(1.1)))
		&& KinkyDungeonCheckLOS(enemy, player, playerDist, range + 0.5, !enemy.Enemy.projectileAttack, !enemy.Enemy.projectileAttack)) {//Player is adjacent
		idle = false;
		enemy.revealed = true;

		let dir = KinkyDungeonGetDirection(player.x - enemy.x, player.y - enemy.y);

		let attackTiles = enemy.warningTiles ? enemy.warningTiles : [dir];
		let ap = (KinkyDungeonMovePoints < 0 && !KinkyDungeonHasStamina(1.1) && KinkyDungeonLeashingEnemy == enemy) ? enemy.Enemy.movePoints+1 : enemy.Enemy.attackPoints;
		if (!KinkyDungeonEnemyTryAttack(enemy, player, attackTiles, delta, enemy.x + dir.x, enemy.y + dir.y, (usingSpecial && enemy.Enemy.specialAttackPoints) ? enemy.Enemy.specialAttackPoints : ap, undefined, undefined, usingSpecial)) {
			if (enemy.warningTiles.length == 0) {
				let minrange = enemy.Enemy.tilesMinRange ? enemy.Enemy.tilesMinRange : 1;
				if (usingSpecial && enemy.Enemy.tilesMinRangeSpecial) minrange = enemy.Enemy.tilesMinRangeSpecial;
				enemy.warningTiles = KinkyDungeonGetWarningTiles(player.x - enemy.x, player.y - enemy.y, range, width, minrange);
			} else {
				let playerIn = false;
				for (let tile of enemy.warningTiles) {
					if (player.x == enemy.x + tile.x && player.y == enemy.y + tile.y) {playerIn = true; break;}
				}
				if (!playerIn) {
					if (enemy.Enemy.specialRange && usingSpecial && enemy.Enemy.specialCDonAttack) {
						enemy.specialCD = enemy.Enemy.specialCD;
					}
					if (enemy.Enemy.specialWidth && usingSpecial && enemy.Enemy.specialCDonAttack) {
						enemy.specialCD = enemy.Enemy.specialCD;
					}
				}
			}

			let playerEvasion = (player.player) ? KinkyDungeonMultiplicativeStat(KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Evasion"))
				: KinkyDungeonMultiplicativeStat(((player.Enemy && player.Enemy.evasion) ? player.Enemy.evasion : 0)) * KinkyDungeonMultiplicativeStat(KinkyDungeonGetBuffedStat(player.buffs, "Evasion"));
			if (playerDist < 1.5 && player.player && attack.includes("Bind") && Math.random() * accuracy <= playerEvasion && KinkyDungeonMovePoints > -1 && KinkyDungeonTorsoGrabCD < 1 && KinkyDungeonLastAction == "Move") {
				let caught = false;
				for (let W = 0; W < enemy.warningTiles.length; W++) {
					let tile = enemy.warningTiles[W];
					if (enemy.x + tile.x == player.x && enemy.y + tile.y == player.y) {
						caught = true;
						break;
					}
				}
				if (caught) {
					let harnessChance = 0;
					for (let restraint of KinkyDungeonRestraintList()) {
						if (restraint.restraint && restraint.restraint.harness) harnessChance += 1;
					}

					if (harnessChance > 0) {
						let roll = Math.random();
						for (let T = 0; T < harnessChance; T++) {
							roll = Math.min(roll, Math.random());
						}
						if (roll < KinkyDungeonTorsoGrabChance) {
							KinkyDungeonMovePoints = -1;

							if (!KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonTorsoGrab").replace("EnemyName", TextGet("Name" + enemy.Enemy.name)), "yellow", 1))
								KinkyDungeonSendActionMessage(5, TextGet("KinkyDungeonTorsoGrab").replace("EnemyName", TextGet("Name" + enemy.Enemy.name)), "yellow", 1);

							KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Grab.ogg");
							KinkyDungeonTorsoGrabCD = 2;
						}
					}
				}
			}
		} else { // Attack lands!
			enemy.revealed = true;
			let hit = ((usingSpecial && enemy.Enemy.specialAttackPoints) ? enemy.Enemy.specialAttackPoints : ap) <= 1;
			for (let W = 0; W < enemy.warningTiles.length; W++) {
				let tile = enemy.warningTiles[W];
				if (enemy.x + tile.x == player.x && enemy.y + tile.y == player.y) {
					hit = true;
					break;
				}
			}

			let playerEvasion = (player.player) ? KinkyDungeonMultiplicativeStat(KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Evasion"))
				: KinkyDungeonMultiplicativeStat(((player.Enemy && player.Enemy.evasion) ? player.Enemy.evasion : 0)) * KinkyDungeonMultiplicativeStat(KinkyDungeonGetBuffedStat(player.buffs, "Evasion"));
			if (hit && Math.random() > playerEvasion) {
				if (player.player)
					KinkyDungeonSendTextMessage(2, TextGet("KinkyDungeonAttackMiss").replace("EnemyName", TextGet("Name" + enemy.Enemy.name)), "lightgreen", 1);
				hit = false;
			}
			if (hit) {
				let replace = [];
				let restraintAdd = [];
				let willpowerDamage = 0;
				let msgColor = "yellow";
				let Locked = false;
				let Stun = false;
				let priorityBonus = 0;
				let addedRestraint = false;

				let happened = 0;
				let bound = 0;

				if (player.player) {
					if (attack.includes("Lock") && KinkyDungeonPlayerGetLockableRestraints().length > 0) {
						let Lockable = KinkyDungeonPlayerGetLockableRestraints();
						let Lstart = 0;
						let Lmax = Lockable.length-1;
						if (!enemy.Enemy.attack.includes("LockAll")) {
							Lstart = Math.floor(Lmax*Math.random()); // Lock one at random
						}
						for (let L = Lstart; L <= Lmax; L++) {
							KinkyDungeonLock(Lockable[L], KinkyDungeonGenerateLock(true)); // Lock it!
							priorityBonus += Lockable[L].restraint.power;
						}
						Locked = true;
						if (usingSpecial && Locked && enemy.Enemy.specialAttack && enemy.Enemy.specialAttack.includes("Lock")) enemy.specialCD = enemy.Enemy.specialCD;
					} else if (attack.includes("Bind") && ((!usingSpecial && !enemy.Enemy.bindOnKneel) || (usingSpecial && !enemy.Enemy.bindOnKneelSpecial) || KinkyDungeonPlayer.Pose.includes("Kneel") || KinkyDungeonPlayer.Pose.includes("Hogtie"))) {
						let numTimes = 1;
						if (enemy.Enemy.multiBind) numTimes = enemy.Enemy.multiBind;
						for (let times = 0; times < numTimes; times++) {
							// Note that higher power enemies get a bonus to the floor restraints appear on
							let rest = KinkyDungeonGetRestraint(enemy.Enemy, MiniGameKinkyDungeonCheckpoint + power, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint], enemy.Enemy.bypass, enemy.Enemy.useLock ? enemy.Enemy.useLock : "");
							if (rest) {
								replace.push({keyword:"RestraintAdded", value: TextGet("Restraint" + rest.name)});
								restraintAdd.push(rest);
								addedRestraint = true;
							}
						}
						if (usingSpecial && addedRestraint && enemy.Enemy.specialAttack && enemy.Enemy.specialAttack.includes("Bind")) enemy.specialCD = enemy.Enemy.specialCD;
						if (!addedRestraint && enemy.Enemy.fullBoundBonus) {
							willpowerDamage += enemy.Enemy.fullBoundBonus; // Some enemies deal bonus damage if they cannot put a binding on you
						}
					}
				}

				if (attack.includes("Suicide")) {
					if (!enemy.Enemy.suicideOnAdd || addedRestraint || (!player.player && attack.includes("Bind"))) {
						enemy.hp = 0;
					} else if (!KinkyDungeonHasStamina(1.1) && enemy.Enemy.failAttackflag) {
						for (let f of enemy.Enemy.failAttackflag) {
							KinkyDungeonSetFlag(f, 12);
						}
					}
				}
				if (attack.includes("Vibe")) {
					vibe = true;
				}
				if (player.player && playerDist < range + 0.5 && (((!enemy.Enemy.noLeashUnlessExhausted || !KinkyDungeonHasStamina(1.1)) && enemy.Enemy.tags && enemy.Enemy.tags.has("leashing")) || attack.includes("Pull")) && (KinkyDungeonLeashedPlayer < 1 || KinkyDungeonLeashingEnemy == enemy)) {
					let wearingLeash = false;
					if (!wearingLeash && !attack.includes("Pull"))
						wearingLeash = KinkyDungeonIsWearingLeash();
					let leashToExit = enemy.Enemy.tags.has("leashing") && !KinkyDungeonHasStamina(1.1) && playerDist < 1.5;
					let leashed = wearingLeash || attack.includes("Pull");
					if (leashed) {
						let leashPos = KinkyDungeonStartPosition;
						let findMaster = undefined;
						if (!leashToExit && enemy.Enemy.pullTowardSelf && (Math.abs(player.x - enemy.x) > 1.5 || Math.abs(player.y - enemy.y) > 1.5)) {
							findMaster = enemy;
							if (findMaster) leashPos = {x: findMaster.x, y: findMaster.y};
						} else {
							if (attack.includes("Pull") && enemy.Enemy.master) {
								/*let masterDist = 1000;
								for (let e of KinkyDungeonEntities) {
									let dist = Math.sqrt((e.x - enemy.x) * (e.x - enemy.x) + (e.y - enemy.y)*(e.y - enemy.y));
									if ((!enemy.Enemy.master.maxDist || dist < enemy.Enemy.master.maxDist)
										&& dist < masterDist
										&& (!enemy.Enemy.master.loose || KinkyDungeonCheckLOS(enemy, e, dist, 100, false))) {
										masterDist = Math.sqrt((e.x - enemy.x) * (e.x - enemy.x) + (e.y - enemy.y)*(e.y - enemy.y));
										findMaster = e;
									}
								}*/
								let fm = KinkyDungeonFindMaster(enemy);
								findMaster = fm.master;
								if (findMaster) leashPos = {x: findMaster.x, y: findMaster.y};
							}
						}
						if (leashPos == KinkyDungeonStartPosition && !KinkyDungeonHasStamina(1.1) && Math.abs(KinkyDungeonPlayerEntity.x - leashPos.x) <= 1 && Math.abs(KinkyDungeonPlayerEntity.y - leashPos.y) <= 1) {
							KinkyDungeonDefeat();
							KinkyDungeonLeashedPlayer = 3 + ap * 2;
							KinkyDungeonLeashingEnemy = enemy;
						}
						else if (Math.abs(KinkyDungeonPlayerEntity.x - leashPos.x) > 1.5 || Math.abs(KinkyDungeonPlayerEntity.y - leashPos.y) > 1.5) {
							if (!KinkyDungeonHasStamina(1.1)) KinkyDungeonMovePoints = -2;
							// Leash pullback
							if (playerDist < 1.5) {
								let path = KinkyDungeonFindPath(enemy.x, enemy.y, leashPos.x, leashPos.y, false, false, ignoreLocks, KinkyDungeonMovableTiles);
								if (path && path.length > 0) {
									let leashPoint = path[0];
									let enemySwap = KinkyDungeonEnemyAt(leashPoint.x, leashPoint.y);
									if ((!enemySwap || !enemySwap.Enemy.noDisplace) && Math.max(Math.abs(leashPoint.x - enemy.x), Math.abs(leashPoint.y - enemy.y)) <= 1.5) {
										KinkyDungeonLeashedPlayer = 3 + ap * 2;
										KinkyDungeonLeashingEnemy = enemy;
										if (enemySwap) {
											enemySwap.x = KinkyDungeonPlayerEntity.x;
											enemySwap.y = KinkyDungeonPlayerEntity.y;
										}
										KinkyDungeonPlayerEntity.x = enemy.x;
										KinkyDungeonPlayerEntity.y = enemy.y;
										enemy.x = leashPoint.x;
										enemy.y = leashPoint.y;
										hitsfx = "Struggle";
										if (!KinkyDungeonHasStamina(1.1)) {
											KinkyDungeonSlowMoveTurns = enemy.Enemy.movePoints+1;
											KinkyDungeonSleepTime = CommonTime() + 200;
										}
										if (usingSpecial && enemy.Enemy.specialAttack && enemy.Enemy.specialAttack.includes("Pull")) enemy.specialCD = enemy.Enemy.specialCD;
										if (KinkyDungeonMapGet(enemy.x, enemy.y) == 'D')  {
											KinkyDungeonMapSet(enemy.x, enemy.y, 'd');
											if (KinkyDungeonTiles[enemy.x + ',' +enemy.y] && KinkyDungeonTiles[enemy.x + ',' +enemy.y].Type == "Door")
												KinkyDungeonTiles[enemy.x + ',' +enemy.y].Lock = undefined;
										}
										if (!KinkyDungeonSendTextMessage(6, TextGet("KinkyDungeonLeashGrab").replace("EnemyName", TextGet("Name" + enemy.Enemy.name)), "yellow", 1))
											KinkyDungeonSendActionMessage(1, TextGet("KinkyDungeonLeashGrab").replace("EnemyName", TextGet("Name" + enemy.Enemy.name)), "yellow", 1);
									}
								}
							} else {
								// Simple pull
								let path = KinkyDungeonFindPath(player.x, player.y, leashPos.x, leashPos.y, true, false, false, KinkyDungeonMovableTilesEnemy);
								let pullDist = enemy.Enemy.pullDist ? enemy.Enemy.pullDist : 1;
								if (path && path.length > 0) {
									let leashPoint = path[Math.min(Math.max(0,path.length-2), Math.floor(Math.max(0, pullDist-1)))];
									if (!KinkyDungeonEnemyAt(leashPoint.x, leashPoint.y)
										&& Math.sqrt((leashPoint.x - enemy.x) * (leashPoint.x - enemy.x) + (leashPoint.y - enemy.y) * (leashPoint.y - enemy.y)) < playerDist
										&& Math.sqrt((leashPoint.x - player.x) * (leashPoint.x - player.x) + (leashPoint.y - player.y) * (leashPoint.y - player.y)) <= pullDist * 1.45) {
										if (usingSpecial && enemy.Enemy.specialAttack && enemy.Enemy.specialAttack.includes("Pull")) enemy.specialCD = enemy.Enemy.specialCD;
										KinkyDungeonLeashedPlayer = 2;
										KinkyDungeonLeashingEnemy = enemy;
										player.x = leashPoint.x;
										player.y = leashPoint.y;
										let msg = "KinkyDungeonLeashGrab";
										if (enemy.Enemy.pullMsg) msg = "Attack" + enemy.Enemy.name + "Pull";
										if (!KinkyDungeonSendTextMessage(8, TextGet(msg).replace("EnemyName", TextGet("Name" + enemy.Enemy.name)), "yellow", 1))
											KinkyDungeonSendActionMessage(3, TextGet(msg).replace("EnemyName", TextGet("Name" + enemy.Enemy.name)), "yellow", 1);
									}
								}
							}
						}
					}
				}
				let Dash = false;
				if (attack.includes("Dash") && (enemy.Enemy.dashThruWalls || canSeePlayer)) {
					// Check player neighbor tiles
					let tiles = [];
					for (let X = player.x-1; X <= player.x+1; X++)
						for (let Y = player.y-1; Y <= player.y+1; Y++) {
							let tile = KinkyDungeonMapGet(X, Y);
							if ((X != 0 || Y != 0) && !(!KinkyDungeonNoEnemy(X, Y, true) || !MovableTiles.includes(tile) || (tile == 'D' && !enemy.Enemy.ethereal))) {
								tiles.push({x:X, y:Y});
							}
						}
					if (tiles.length > 0) {
						let tile = tiles[Math.floor(Math.random()*tiles.length)];
						if (enemy.Enemy.dashThrough) {
							let tiled = 0;
							for (let t of tiles) {
								let dist = Math.sqrt((enemy.x - t.x)*(enemy.x - t.x) + (enemy.y - t.y)*(enemy.y - t.y));
								if (dist > tiled) {
									tile = t;
									tiled = dist;
								}
							}
						} else {
							let tiled = Math.sqrt((enemy.x - tile.x)*(enemy.x - tile.x) + (enemy.y - tile.y)*(enemy.y - tile.y));
							for (let t of tiles) {
								let dist = Math.sqrt((enemy.x - t.x)*(enemy.x - t.x) + (enemy.y - t.y)*(enemy.y - t.y));
								if (dist < tiled) {
									tile = t;
									tiled = dist;
								}
							}
						}
						if (tile && (tile.x != player.x || tile.y != player.y) && MovableTiles.includes(KinkyDungeonMapGet(tile.x, tile.y))) {
							Dash = true;
							enemy.x = tile.x;
							enemy.y = tile.y;
							enemy.path = undefined;
							happened += 1;
							if (usingSpecial && enemy.Enemy.specialAttack && enemy.Enemy.specialAttack.includes("Dash")) enemy.specialCD = enemy.Enemy.specialCD;
						}
					}
				}
				if (attack.includes("Will") || willpowerDamage > 0) {
					if (willpowerDamage == 0)
						willpowerDamage += power;
					let buffdmg = KinkyDungeonGetBuffedStat(enemy.buffs, "AttackDmg");
					if (buffdmg) willpowerDamage = Math.max(0, willpowerDamage + buffdmg);
					replace.push({keyword:"DamageTaken", value: willpowerDamage});
					msgColor = "#ff8888";
					if (usingSpecial && willpowerDamage > 0 && enemy.Enemy.specialAttack && enemy.Enemy.specialAttack.includes("Will")) enemy.specialCD = enemy.Enemy.specialCD;
				}
				if (player.player) {
					happened += KinkyDungeonDealDamage({damage: willpowerDamage, type: damage});
					KinkyDungeonTickBuffTag(enemy.buffs, "hit", 1);
					for (let r of restraintAdd) {
						bound += KinkyDungeonAddRestraintIfWeaker(r, power, enemy.Enemy.bypass, enemy.Enemy.useLock ? enemy.Enemy.useLock : undefined) * 2;
					}
					if (attack.includes("Slow")) {
						KinkyDungeonMovePoints = Math.max(KinkyDungeonMovePoints - 2, -1);
						if (usingSpecial && enemy.Enemy.specialAttack && enemy.Enemy.specialAttack.includes("Slow")) enemy.specialCD = enemy.Enemy.specialCD;
						happened += 1;
					}
					if (attack.includes("Effect") && enemy.Enemy.effect) {
						let affected = KinkyDungeonPlayerEffect(enemy.Enemy.effect.damage, enemy.Enemy.effect.effect, enemy.Enemy.effect.spell);
						if (affected && usingSpecial && enemy.Enemy.specialAttack && enemy.Enemy.specialAttack.includes("Effect")) enemy.specialCD = enemy.Enemy.specialCD;
						happened += 1;
					}
					if (attack.includes("Stun")) {
						let time = enemy.Enemy.stunTime ? enemy.Enemy.stunTime : 1;
						KinkyDungeonStatBlind = Math.max(KinkyDungeonStatBlind, time);
						KinkyDungeonMovePoints = Math.max(Math.min(-1, -time+1), KinkyDungeonMovePoints-time); // This is to prevent stunlock while slowed heavily
						if (usingSpecial && enemy.Enemy.specialAttack && enemy.Enemy.specialAttack.includes("Stun")) enemy.specialCD = enemy.Enemy.specialCD;
						happened += 1;
						priorityBonus += 3*time;
						Stun = true;
					}
					happened += bound;
				} else { // if (Math.random() <= playerEvasion)
					let dmg = power;
					let buffdmg = KinkyDungeonGetBuffedStat(enemy.buffs, "AttackDmg");
					if (buffdmg) dmg = Math.max(0, dmg + buffdmg);
					if (enemy.Enemy.fullBoundBonus) {
						dmg += enemy.Enemy.fullBoundBonus; // Some enemies deal bonus damage if they cannot put a binding on you
					}
					happened += KinkyDungeonDamageEnemy(player, {type: enemy.Enemy.damage, damage: dmg}, false, true, undefined, undefined, enemy);
					KinkyDungeonTickBuffTag(enemy.buffs, "hit", 1);
					if (happened > 0) {
						let sfx = (hitsfx) ? hitsfx : "DealDamage";
						KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + sfx + ".ogg");
					}
				}

				if (usingSpecial && enemy.specialCD > 0 && enemy.Enemy.specialCharges) {
					if (enemy.specialCharges == undefined) enemy.specialCharges = enemy.Enemy.specialCharges-1;
					else enemy.specialCharges -= 1;
				}

				if (happened > 0 && player.player) {
					let suffix = "";
					if (Stun) suffix = "Stun";
					else if (Locked) suffix = "Lock";
					else if (bound > 0) suffix = "Bind";
					if (Dash) suffix = "Dash";

					let sfx = (hitsfx) ? hitsfx : (willpowerDamage > 1 ? "Damage" : "DamageWeak");
					if (usingSpecial && enemy.Enemy.specialsfx) sfx = enemy.Enemy.specialsfx;
					KinkyDungeonSendInventoryEvent("hit", {
						happened: happened,
						attack: attack,
						enemy: enemy,
						bound: bound,
						damage: willpowerDamage,
						damagetype: damage,
					});
					KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + sfx + ".ogg");
					let text = TextGet("Attack"+enemy.Enemy.name + suffix);
					if (replace)
						for (let R = 0; R < replace.length; R++)
							text = text.replace(replace[R].keyword, "" + replace[R].value);
					KinkyDungeonSendTextMessage(happened+priorityBonus, text, msgColor, 1);
				}
			} else {
				let sfx = (enemy.Enemy && enemy.Enemy.misssfx) ? enemy.Enemy.misssfx : "Miss";
				KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + sfx + ".ogg");
			}

			KinkyDungeonTickBuffTag(enemy.buffs, "damage", 1);

			enemy.warningTiles = [];
		}
	} else {
		enemy.warningTiles = [];
		enemy.attackPoints = 0;
	}

	enemy.moved = (moved || enemy.movePoints > 0);
	enemy.idle = idle && !(moved || enemy.attackPoints > 0);

	if (!ignore && AI == "ambush" && playerDist <= enemy.Enemy.ambushRadius) {
		enemy.ambushtrigger = true;
	} else if (AI == "ambush" && ignore) enemy.ambushtrigger = false;


	if ((!enemy.Enemy.noSpellsWhenHarmless || !harmless) && (!enemy.Enemy.noSpellLeashing || KinkyDungeonLeashingEnemy != enemy || KinkyDungeonLeashedPlayer < 1) && (!enemy.Enemy.followLeashedOnly || KinkyDungeonLeashedPlayer < 1 || KinkyDungeonLeashingEnemy == enemy) && (!enemy.Enemy.allied || (!player.player && (!player.Enemy || !player.Enemy.allied))) && ((enemy.aware && KinkyDungeonTrackSneak(enemy, 0, player)) || playerDist < Math.max(1.5, enemy.Enemy.blindSight))
		&& !ignore && (!moved || enemy.Enemy.castWhileMoving) && enemy.Enemy.attack.includes("Spell") && KinkyDungeonCheckLOS(enemy, player, playerDist, enemy.Enemy.visionRadius, false, true) && enemy.castCooldown <= 0) {
		idle = false;
		let spellchoice = null;
		let spell = null;
		let spelltarget = undefined;

		for (let tries = 0; tries < 6; tries++) {
			spelltarget = false;
			spellchoice = enemy.Enemy.spells[Math.floor(Math.random()*enemy.Enemy.spells.length)];
			spell = KinkyDungeonFindSpell(spellchoice, true);
			if ((!spell.castRange && playerDist > spell.range) || (spell.castRange && playerDist > spell.castRange)) spell = null;
			if (spell && spell.specialCD && enemy.castCooldownSpecial > 0) spell = null;
			if (spell && spell.noFirstChoice && tries <= 2) spell = null;
			if (spell && spell.projectileTargeting && !KinkyDungeonCheckProjectileClearance(enemy.x, enemy.y, player.x, player.y)) spell = null;
			if (spell && spell.buff) {
				if (enemy.Enemy.buffallies) {
					// Select a random nearby ally of the enemy
					let nearAllies = [];
					for (let e of KinkyDungeonEntities) {
						if ((e != enemy) && e.aware && !KinkyDungeonHasBuff(e.buffs, spell.name) && ((enemy.Enemy.allied && e.Enemy.allied) || (!enemy.Enemy.allied && !e.Enemy.allied))
							&& Math.sqrt((enemy.x - e.x)*(enemy.x - e.x) + (enemy.y - e.y)*(enemy.y - e.y)) < spell.range) {
							nearAllies.push(e);
						}
					}
					if (nearAllies.length > 0) {
						let e = nearAllies[Math.floor(Math.random() * nearAllies.length)];
						if (e) {
							spelltarget = e;
							KinkyDungeonSendTextMessage(4, TextGet("KinkyDungeonSpellCast" + spell.name).replace("EnemyName", TextGet("Name" + enemy.Enemy.name)), "white", 2);
							break;
						}
					} else spell = null;
				} else {
					spelltarget = enemy;
				}
			}
			if (spell && !(!enemy.Enemy.minSpellRange || (playerDist > enemy.Enemy.minSpellRange))) spell = null;
			if (spell && !(!spell.minRange || (playerDist > spell.minRange))) spell = null;
			if (spell) break;
		}

		if (spell) {
			if (spell.channel) enemy.channel = spell.channel;
			enemy.castCooldown = spell.manacost*enemy.Enemy.spellCooldownMult + enemy.Enemy.spellCooldownMod + 1;
			if (spell.specialCD)
				enemy.castCooldownSpecial = spell.specialCD;
			let xx = player.x;
			let yy = player.y;
			if (spelltarget) {
				xx = spelltarget.x;
				yy = spelltarget.y;
			}
			if (spell && spell.selfcast) {
				xx = enemy.x;
				yy = enemy.y;
				KinkyDungeonSendTextMessage(4, TextGet("KinkyDungeonSpellCast" + spell.name).replace("EnemyName", TextGet("Name" + enemy.Enemy.name)), "white", 2);
			} else if (spell && spell.msg) {
				KinkyDungeonSendTextMessage(4, TextGet("KinkyDungeonSpellCast" + spell.name).replace("EnemyName", TextGet("Name" + enemy.Enemy.name)), "white", 2);
			}

			if (spell && KinkyDungeonCastSpell(xx, yy, spell, enemy, player) && spell.sfx) {
				if (enemy.Enemy.suicideOnSpell) enemy.hp = 0;
				KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + spell.sfx + ".ogg");
			}

			//console.log("casted "+ spell.name);
		}
	}
	if (vibe || (enemy.Enemy.remote && playerDist < enemy.Enemy.remote)) {
		KinkyDungeonChargeRemoteVibrators(enemy.Enemy.name, enemy.Enemy.remoteAmount ? enemy.Enemy.remoteAmount : 5, vibe, vibe);
	}
	return idle;
}

// Unique ID for enemies, to prevent bullets from hitting them
// Dont want to pass object handles around in case we ever allow saving a room
function KinkyDungeonGetEnemyID() {
	if (KinkyDungeonEnemyID > 100000000) KinkyDungeonEnemyID = 0;
	return KinkyDungeonEnemyID++;
}

let KinkyDungeonJailGuard = undefined;
let KinkyDungeonGuardTimer = 0;
let KinkyDungeonGuardTimerMax = 22;
let KinkyDungeonGuardSpawnTimer = 0;
let KinkyDungeonGuardSpawnTimerMax = 20;
let KinkyDungeonGuardSpawnTimerMin = 6;
let KinkyDungeonMaxPrisonReduction = 10;
let KinkyDungeonPrisonReduction = 0;
let KinkyDungeonPrisonExtraGhostRep = 0;

let KinkyDungeonJailTourTimer = 0;
let KinkyDungeonJailTourTimerMin = 20;
let KinkyDungeonJailTourTimerMax = 40;

let KinkyDungeonEnemyID = 0;

function KinkyDungeonCallGuard(x, y, noTransgress) {
	if (!noTransgress)
		KinkyDungeonJailTransgressed = true;
	if (!KinkyDungeonJailGuard) {
		let Enemy = KinkyDungeonEnemies.find(element => element.name == "Guard");
		let guard = {summoned: true, Enemy: Enemy, id: KinkyDungeonGetEnemyID(),
			x:KinkyDungeonStartPosition.x, y:KinkyDungeonStartPosition.y, gx: x, gy: y,
			hp: (Enemy && Enemy.startinghp) ? Enemy.startinghp : Enemy.maxhp, movePoints: 0, attackPoints: 0};
		KinkyDungeonJailGuard = guard;
		KinkyDungeonEntities.push(guard);
	} else {
		KinkyDungeonJailGuard.gx = x;
		KinkyDungeonJailGuard.gy = y;
	}
}

let KinkyDungeonTotalSleepTurns = 0;
let KinkyDungeonSearchTimer = 0;
let KinkyDungeonSearchTimerMin = 60;
let KinkyDungeonFirstSpawn = false;

function KinkyDungeonHandleWanderingSpawns(delta) {
	let effLevel = MiniGameKinkyDungeonLevel + KinkyDungeonDifficulty;
	let HunterAdjust = KinkyDungeonDifficulty;
	let EntranceAdjust = KinkyDungeonDifficulty/2;
	let BaseAdjust = KinkyDungeonDifficulty/10;
	let sleepTurnsSpeedMult = 100;
	let sleepTurnsPerExtraSpawnLevel = 25;
	let baseChance = ((KinkyDungeonSleepTurns > 0 && (KinkyDungeonStatStamina > KinkyDungeonStatStaminaMax - 10 * KinkyDungeonStatStaminaRegenSleep || KinkyDungeonSleepTurns < 11)) ? 0.05 : 0.0005) * Math.sqrt(Math.max(1, effLevel)) * (1 + KinkyDungeonTotalSleepTurns / sleepTurnsSpeedMult);
	// Chance of bothering with random spawns this turn
	if (delta > 0 && Math.random() < baseChance && KinkyDungeonSearchTimer > KinkyDungeonSearchTimerMin) {
		let hunters = false;
		let spawnLocation = KinkyDungeonMapGet(KinkyDungeonStartPosition.x, KinkyDungeonStartPosition.y) == 'S' ? KinkyDungeonStartPosition : KinkyDungeonEndPosition;
		if (KinkyDungeonTotalSleepTurns > 30 - BaseAdjust && KinkyDungeonEntities.length < Math.min(100, (KinkyDungeonInJail()) ? (5 + effLevel/15) : (20 + effLevel/10))) {
			if (KinkyDungeonTotalSleepTurns > 90 - HunterAdjust) hunters = true;
			if (KinkyDungeonTotalSleepTurns > 130 - EntranceAdjust && Math.random() < 0.5) spawnLocation = KinkyDungeonEndPosition;

			if (KinkyDungeonLightGet(spawnLocation.x, spawnLocation.y) < 1 || KinkyDungeonSeeAll) {
				KinkyDungeonSearchTimer = 0;
				let count = 0;
				let maxCount = (2 + Math.min(5, Math.round(MiniGameKinkyDungeonLevel/10))) * Math.sqrt(1 + KinkyDungeonTotalSleepTurns / sleepTurnsSpeedMult);

				// Spawn a killsquad!
				let tags = [];
				KinkyDungeonAddTags(tags, MiniGameKinkyDungeonLevel);
				tags.push("boss");

				let miniboss = false;
				let requireTags = ["search"];
				if (hunters) {
					requireTags.push("hunter");
					tags.push("secondhalf");
					if (KinkyDungeonTotalSleepTurns > 200)
						tags.push("thirdhalf");
				}

				tags.push("bandit");

				let Enemy = KinkyDungeonGetEnemy(
					tags, MiniGameKinkyDungeonLevel + KinkyDungeonDifficulty/5 + Math.round(KinkyDungeonTotalSleepTurns / sleepTurnsPerExtraSpawnLevel),
					KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint],
					KinkyDungeonMapGet(spawnLocation.x, spawnLocation.y), requireTags);
				let EnemiesSummoned = [];
				while (Enemy && count < maxCount) {
					let point = KinkyDungeonGetNearbyPoint(spawnLocation.x, spawnLocation.y, true);
					if (point && (KinkyDungeonJailTransgressed || Enemy.tags.has("jail") || Enemy.tags.has("jailer"))) {
						let X = point.x;
						let Y = point.y;
						EnemiesSummoned.push(Enemy.name);
						KinkyDungeonEntities.push({tracking: true, summoned: true, Enemy: Enemy, id: KinkyDungeonGetEnemyID(), x:X, y:Y, hp: (Enemy.startinghp) ? Enemy.startinghp : Enemy.maxhp, movePoints: 0, attackPoints: 0});
						if (Enemy.tags.has("minor")) count += 0.2; else count += 1; // Minor enemies count as 1/5th of an enemy
						if (Enemy.tags.has("boss")) {
							count += 3 * Math.max(1, 100/(100 + KinkyDungeonDifficulty));
							tags.push("boss");
						} // Boss enemies count as 4 normal enemies
						else if (Enemy.tags.has("elite")) count += Math.max(1, 1000/(2000 + 20*KinkyDungeonDifficulty + KinkyDungeonTotalSleepTurns)); // Elite enemies count as 1.5 normal enemies
						if (Enemy.tags.has("miniboss")) {
							if (!miniboss) tags.push("boss");
							miniboss = true; // Adds miniboss as a tag
						}

						if (Enemy.summon) {
							for (let sum of Enemy.summon) {
								if (!sum.chance || Math.random() < sum.chance)
									KinkyDungeonSummonEnemy(X, Y, sum.enemy, sum.count, sum.range, sum.strict);
							}
						}
					} else count += 0.1;

					Enemy = KinkyDungeonGetEnemy(tags, MiniGameKinkyDungeonLevel + KinkyDungeonDifficulty/5, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint], KinkyDungeonMapGet(spawnLocation.x, spawnLocation.y), requireTags);
				}
				if (EnemiesSummoned.length > 0 && KinkyDungeonFirstSpawn) {
					KinkyDungeonFirstSpawn = false;
					KinkyDungeonSendTextMessage(4, TextGet("KinkyDungeonFirstSpawn"), "white", KinkyDungeonSleepTurns + 5);
				}
				if (KinkyDungeonTotalSleepTurns > 200 && !KinkyDungeonHuntDownPlayer && KinkyDungeonSleepTurns < 3) {
					KinkyDungeonHuntDownPlayer = true;
					KinkyDungeonSendTextMessage(10, TextGet("KinkyDungeonHuntDownPlayer"), "red", KinkyDungeonSleepTurns + 10);
				}
				console.log(EnemiesSummoned);
			}
		}

	} else if (KinkyDungeonJailTransgressed) KinkyDungeonSearchTimer += delta;
}

function KinkyDungeonGetJailRestraintForGroup(Group) {
	let params = KinkyDungeonMapParams[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]];
	for (let r of params.defeat_restraints) {
		let level = 0;
		if (KinkyDungeonGoddessRep.Prisoner) level = Math.max(0, KinkyDungeonGoddessRep.Prisoner + 50);
		if (!r.Level || level >= r.Level) {
			let candidate = KinkyDungeonGetRestraintByName(r.Name);
			if (candidate.Group == Group && !candidate.nonbinding) {
				return candidate;
			}
		}
	}
	return null;
}

function KinkyDungeonGetJailRestraintLevelFor(Name) {
	let params = KinkyDungeonMapParams[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]];
	for (let r of params.defeat_restraints) {
		if (r.Name === Name) {
			return r.Level;
		}
	}
	return -1;
}

function KinkyDungeonAttachTetherToGuard(dist) {
	let inv = KinkyDungeonGetRestraintItem("ItemNeckRestraints");
	if (inv && inv.restraint && inv.restraint.tether) {
		inv.tetherToGuard = true;
		if (dist) inv.tetherLength = dist;
	}
}
function KinkyDungeonAttachTetherToLeasher(dist) {
	let inv = KinkyDungeonGetRestraintItem("ItemNeckRestraints");
	if (inv && inv.restraint && inv.restraint.tether) {
		inv.tetherToLeasher = true;
		if (dist) inv.tetherLength = dist;
	}
}

function KinkyDungeonInJail() {
	return KinkyDungeonSpawnJailers > 0 && KinkyDungeonSpawnJailers + 1 >= KinkyDungeonSpawnJailersMax;
}

function KinkyDungeonHandleJailSpawns(delta) {
	let xx = KinkyDungeonStartPosition.x + KinkyDungeonJailLeashX;
	let yy = KinkyDungeonStartPosition.y;
	let playerInCell = (Math.abs(KinkyDungeonPlayerEntity.x - KinkyDungeonStartPosition.x) < KinkyDungeonJailLeashX - 1 && Math.abs(KinkyDungeonPlayerEntity.y - KinkyDungeonStartPosition.y) <= KinkyDungeonJailLeash);
	if (KinkyDungeonInJail() && (KinkyDungeonGuardSpawnTimer <= 1 || KinkyDungeonSleepTurns == 3) && !KinkyDungeonJailGuard && playerInCell) {
		KinkyDungeonGuardSpawnTimer = KinkyDungeonGuardSpawnTimerMin + Math.floor(Math.random() * (KinkyDungeonGuardSpawnTimerMax - KinkyDungeonGuardSpawnTimerMin));
		let Enemy = KinkyDungeonEnemies.find(element => element.name == (KinkyDungeonGoddessRep.Prisoner < 0 ? "Guard" : "GuardHeavy"));
		let guard = {summoned: true, Enemy: Enemy, id: KinkyDungeonGetEnemyID(),
			x:xx, y:yy, gx: xx - 2, gy: yy, CurrentAction: "jailWander",
			hp: (Enemy && Enemy.startinghp) ? Enemy.startinghp : Enemy.maxhp, movePoints: 0, attackPoints: 0};


		if (KinkyDungeonTiles[(xx-1) + "," + yy] && KinkyDungeonTiles[(xx-1) + "," + yy].Type == "Door") {
			KinkyDungeonTiles[(xx-1) + "," + yy].Lock = undefined;
		}
		KinkyDungeonJailGuard = guard;
		KinkyDungeonEntities.push(guard);
		KinkyDungeonSendTextMessage(10, TextGet("KinkyDungeonGuardAppear"), "white", 6);

		KinkyDungeonGuardTimer = KinkyDungeonGuardTimerMax;
	} else if (KinkyDungeonGuardSpawnTimer > 0 && KinkyDungeonSleepTurns < 1) KinkyDungeonGuardSpawnTimer -= delta;

	if (KinkyDungeonJailTourTimer > 0) {
		KinkyDungeonJailTourTimer = Math.max(0, KinkyDungeonJailTourTimer - delta);
	}

	if (KinkyDungeonJailGuard && KinkyDungeonGuardTimer > 0 && KinkyDungeonGuardTimerMax - KinkyDungeonGuardTimer > 6) {
		let securityLevel = 0;
		if (KinkyDungeonGoddessRep.Prisoner) securityLevel = Math.max(0, KinkyDungeonGoddessRep.Prisoner + 50);

		if (KinkyDungeonJailGuard.CurrentAction === "jailWander" && KinkyDungeonJailGuard.gx == KinkyDungeonJailGuard.x && KinkyDungeonJailGuard.gy == KinkyDungeonJailGuard.y) {
			if (Math.random() < 0.2) {
				KinkyDungeonJailGuard.gx = xx - 2;
				if (Math.random() < 0.5)
					KinkyDungeonJailGuard.gy = yy + Math.round(Math.random() * KinkyDungeonJailLeash * 2 - KinkyDungeonJailLeash);
				else
					KinkyDungeonJailGuard.gy = KinkyDungeonPlayerEntity.y;
			}

			if (Math.random() < 0.05 + securityLevel * 0.4 / 100) {
				KinkyDungeonJailGuard.CurrentAction = "jailTease";
			} else if (Math.random() < 0.08 && KinkyDungeonSleepTurns < 1 && KinkyDungeonJailTourTimer < 1) {
				KinkyDungeonJailGuard.RemainingJailLeashTourWaypoints = 2 + Math.ceil(Math.random() * 4);
				KinkyDungeonJailGuard.CurrentAction = "jailLeashTour";
				KinkyDungeonJailGuard.KinkyDungeonJailTourInfractions = 0;
				let msg = TextGet("KinkyDungeonRemindJailTourStart").replace("EnemyName", TextGet("Name" + KinkyDungeonJailGuard.Enemy.name));
				KinkyDungeonSendTextMessage(9, msg, "yellow", 4);
			} else {
				let possibleGroup = KinkyDungeonStruggleGroupsBase[Math.floor(Math.random() * KinkyDungeonStruggleGroupsBase.length)];
				let oldRestraintItem = KinkyDungeonGetRestraintItem(possibleGroup);
				let newRestraint = KinkyDungeonGetJailRestraintForGroup(possibleGroup);
				if (newRestraint && (!oldRestraintItem || (oldRestraintItem.restraint && oldRestraintItem.restraint.name != newRestraint.name))) {
					KinkyDungeonJailGuard.CurrentAction = "jailAddRestraints";
					KinkyDungeonJailGuard.CurrentRestraintSwapGroup = possibleGroup;
				}
				if (oldRestraintItem && !newRestraint && KinkyDungeonGetJailRestraintLevelFor(oldRestraintItem.restraint.name) > 0) {
					KinkyDungeonJailGuard.CurrentAction = "jailRemoveRestraints";
					KinkyDungeonJailGuard.CurrentRestraintSwapGroup = possibleGroup;
				}
			}
		}

		if (KinkyDungeonJailGuard.CurrentAction === "jailLeashTour" && !KinkyDungeonJailTransgressed) {
			if (!KinkyDungeonJailGuard.RemainingJailLeashTourWaypoints && KinkyDungeonJailGuard.x === KinkyDungeonJailGuard.NextJailLeashTourWaypointX && KinkyDungeonJailGuard.y === KinkyDungeonJailGuard.NextJailLeashTourWaypointY) {
				let leashItemToRemove = KinkyDungeonGetRestraintItem("ItemNeckRestraints");
				if (leashItemToRemove) {
					KinkyDungeonRemoveRestraint("ItemNeckRestraints", false);
					let msg = TextGet("KinkyDungeonRemoveRestraints").replace("EnemyName", TextGet("Name" + KinkyDungeonJailGuard.Enemy.name));
					msg = msg.replace("OldRestraintName", TextGet("Restraint"+leashItemToRemove.restraint.name));
					KinkyDungeonSendTextMessage(5, msg, "yellow", 1);
				}
				KinkyDungeonPrisonExtraGhostRep += 2;
				KinkyDungeonJailGuard.CurrentAction = "jailWander";
				KinkyDungeonJailTourTimer = KinkyDungeonJailTourTimerMin + Math.floor((KinkyDungeonJailTourTimerMax - KinkyDungeonJailTourTimerMin) * Math.random());
				KinkyDungeonJailGuard.gx = KinkyDungeonJailGuard.x;
				KinkyDungeonJailGuard.gy = KinkyDungeonJailGuard.y;
			} else {
				let playerDist = KDistChebyshev(KinkyDungeonJailGuard.x - KinkyDungeonPlayerEntity.x, KinkyDungeonJailGuard.y - KinkyDungeonPlayerEntity.y);//Math.sqrt((KinkyDungeonJailGuard.x - KinkyDungeonPlayerEntity.x)*(KinkyDungeonJailGuard.x - KinkyDungeonPlayerEntity.x) + (KinkyDungeonJailGuard.y - KinkyDungeonPlayerEntity.y)*(KinkyDungeonJailGuard.y - KinkyDungeonPlayerEntity.y));
				let wearingLeash = KinkyDungeonIsWearingLeash();
				if (!wearingLeash) {
					let touchesPlayer = KinkyDungeonCheckLOS(KinkyDungeonJailGuard, KinkyDungeonPlayerEntity, playerDist, 1.5, false, false);
					if (touchesPlayer) {
						if (!KinkyDungeonGetRestraintItem("ItemNeck")) {
							let collar = KinkyDungeonGetRestraintByName("BasicCollar");
							KinkyDungeonAddRestraintIfWeaker(collar, KinkyDungeonJailGuard.Enemy.power, true, false);
							let msg = TextGet("KinkyDungeonAddRestraints").replace("EnemyName", TextGet("Name" + KinkyDungeonJailGuard.Enemy.name));
							msg = msg.replace("NewRestraintName", TextGet("Restraint"+collar.name));
							KinkyDungeonSendTextMessage(5, msg, "yellow", 1);
							KinkyDungeonJailGuard.NextJailLeashTourWaypointX = KinkyDungeonJailGuard.x;
							KinkyDungeonJailGuard.NextJailLeashTourWaypointY = KinkyDungeonJailGuard.y;
							KinkyDungeonJailGuard.gx = KinkyDungeonJailGuard.x;
							KinkyDungeonJailGuard.gy = KinkyDungeonJailGuard.y;
						} else {
							let leash = KinkyDungeonGetRestraintByName("BasicLeash");
							KinkyDungeonAddRestraintIfWeaker(leash, KinkyDungeonJailGuard.Enemy.power, true, false);
							let msg = TextGet("KinkyDungeonAddRestraints").replace("EnemyName", TextGet("Name" + KinkyDungeonJailGuard.Enemy.name));
							msg = msg.replace("NewRestraintName", TextGet("Restraint"+leash.name));
							KinkyDungeonSendTextMessage(5, msg, "yellow", 1);
							KinkyDungeonJailGuard.NextJailLeashTourWaypointX = KinkyDungeonJailGuard.x;
							KinkyDungeonJailGuard.NextJailLeashTourWaypointY = KinkyDungeonJailGuard.y;
							KinkyDungeonJailGuard.gx = KinkyDungeonJailGuard.x;
							KinkyDungeonJailGuard.gy = KinkyDungeonJailGuard.y;
						}
						KinkyDungeonAttachTetherToGuard(2);
					} else {
						KinkyDungeonJailGuard.gx = KinkyDungeonPlayerEntity.x;
						KinkyDungeonJailGuard.gy = KinkyDungeonPlayerEntity.y;
					}
				} else if (!KinkyDungeonTetherLength()) {
					KinkyDungeonJailGuard.gx = KinkyDungeonPlayerEntity.x;
					KinkyDungeonJailGuard.gy = KinkyDungeonPlayerEntity.y;
					if (playerDist < 1.5) {
						KinkyDungeonAttachTetherToGuard(2);
					}
				} else if (KinkyDungeonJailGuard.RemainingJailLeashTourWaypoints > 0
					&& (KinkyDungeonJailGuard.x - KinkyDungeonJailGuard.NextJailLeashTourWaypointX) * (KinkyDungeonJailGuard.x - KinkyDungeonJailGuard.NextJailLeashTourWaypointX)
						+ (KinkyDungeonJailGuard.y - KinkyDungeonJailGuard.NextJailLeashTourWaypointY) * (KinkyDungeonJailGuard.y - KinkyDungeonJailGuard.NextJailLeashTourWaypointY) < 2) {
					KinkyDungeonJailGuard.RemainingJailLeashTourWaypoints--;
					KinkyDungeonJailGuardGetLeashWaypoint(xx, yy);
				} else {
					let pullDist = 2.5;//KinkyDungeonTetherLength() - 1;//KinkyDungeonJailGuard.Enemy.pullDist ? KinkyDungeonJailGuard.Enemy.pullDist : 1;
					if (playerDist < 1.5) {
						KinkyDungeonAttachTetherToGuard(2);
					}
					if (playerDist > pullDist && KinkyDungeonSlowLevel < 2 && KinkyDungeonCheckProjectileClearance(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y, KinkyDungeonJailGuard.x, KinkyDungeonJailGuard.y)) {
						// Guard goes back towards the player and reminds them
						let msg = TextGet("KinkyDungeonRemindJailTour" + KinkyDungeonJailGuard.KinkyDungeonJailTourInfractions).replace("EnemyName", TextGet("Name" + KinkyDungeonJailGuard.Enemy.name));
						let msgPrev = TextGet("KinkyDungeonRemindJailTour" + Math.max(0, KinkyDungeonJailGuard.KinkyDungeonJailTourInfractions-1)).replace("EnemyName", TextGet("Name" + KinkyDungeonJailGuard.Enemy.name));
						KinkyDungeonSendTextMessage(7 + KinkyDungeonJailGuard.KinkyDungeonJailTourInfractions, msg, "yellow", 3);
						if (KinkyDungeonJailGuard.gx != KinkyDungeonPlayerEntity.x || KinkyDungeonJailGuard.gy != KinkyDungeonPlayerEntity.y && KinkyDungeonTextMessage != msgPrev) {
							KinkyDungeonJailGuard.KinkyDungeonJailTourInfractions = Math.min(3, KinkyDungeonJailGuard.KinkyDungeonJailTourInfractions + 1);
						}
						if (KinkyDungeonJailGuard.KinkyDungeonJailTourInfractions == 3 && KinkyDungeonJailGuard.RemainingJailLeashTourWaypoints > 1) KinkyDungeonJailGuard.RemainingJailLeashTourWaypoints = 1;
						KinkyDungeonJailGuard.gx = KinkyDungeonPlayerEntity.x;
						KinkyDungeonJailGuard.gy = KinkyDungeonPlayerEntity.y;
						KinkyDungeonUpdateTether(true, KinkyDungeonPlayerEntity);
					} else {
						KinkyDungeonLeashedPlayer = 2;
						KinkyDungeonLeashingEnemy = KinkyDungeonJailGuard;
						KinkyDungeonJailGuard.gx = KinkyDungeonJailGuard.NextJailLeashTourWaypointX;
						KinkyDungeonJailGuard.gy = KinkyDungeonJailGuard.NextJailLeashTourWaypointY;
						let guardPath = KinkyDungeonFindPath(KinkyDungeonJailGuard.x, KinkyDungeonJailGuard.y, KinkyDungeonJailGuard.gx, KinkyDungeonJailGuard.gy, true, false, true, KinkyDungeonMovableTiles);
						if (guardPath && guardPath.length > 0) {
							if (guardPath[0].x === KinkyDungeonPlayerEntity.x && guardPath[0].y === KinkyDungeonPlayerEntity.y) {
								// Swap the player and the guard
								KinkyDungeonPlayerEntity.x = KinkyDungeonJailGuard.x;
								KinkyDungeonPlayerEntity.y = KinkyDungeonJailGuard.y;
								KinkyDungeonJailGuard.x = guardPath[0].x;
								KinkyDungeonJailGuard.y = guardPath[0].y;
							}
							let enemy = KinkyDungeonEnemyAt(guardPath[0].x, guardPath[0].y);
							if (enemy) {
								enemy.x = KinkyDungeonJailGuard.x;
								enemy.y = KinkyDungeonJailGuard.y;
								KinkyDungeonJailGuard.x = guardPath[0].x;
								KinkyDungeonJailGuard.y = guardPath[0].y;
							}
						} else KinkyDungeonJailGuardGetLeashWaypoint(xx, yy);
					}
				}
			}
		} else if (KinkyDungeonJailTransgressed) {
			KinkyDungeonJailGuard.CurrentAction = "jailWander";
			KinkyDungeonJailGuard.gx = KinkyDungeonJailGuard.x;
			KinkyDungeonJailGuard.gy = KinkyDungeonJailGuard.y;
		}

		if (KinkyDungeonJailGuard.CurrentAction === "jailTease" || KinkyDungeonJailGuard.CurrentAction === "jailAddRestraints" || KinkyDungeonJailGuard.CurrentAction === "jailRemoveRestraints") {
			KinkyDungeonJailHandleCellActions(xx, yy, securityLevel);
		}
	}

	if (KinkyDungeonJailGuard) {
		if (KinkyDungeonGuardTimer > 0) {
			// Decrease timer when not on a tour
			if (KinkyDungeonJailGuard.CurrentAction !== "jailLeashTour") {
				KinkyDungeonGuardTimer -= 1;
				if (KinkyDungeonGuardTimer <= 0) {
					KinkyDungeonJailGuard.gx = xx;
					KinkyDungeonJailGuard.gy = yy;
				}
			}
		} else {
			// Leave the cell and lock the door
			if (KinkyDungeonJailGuard && KinkyDungeonJailGuard.x == xx && KinkyDungeonJailGuard.y == yy && !KinkyDungeonJailTransgressed) {
				KinkyDungeonEntities.splice(KinkyDungeonEntities.indexOf(KinkyDungeonJailGuard), 1);
				if (KinkyDungeonTiles[(xx-1) + "," + yy] && KinkyDungeonTiles[(xx-1) + "," + yy].Type == "Door") {
					KinkyDungeonMapSet(xx-1, yy, 'D');
					KinkyDungeonTiles[(xx-1) + "," + yy].Lock = KinkyDungeonGenerateLock(true, MiniGameKinkyDungeonLevel);
					KinkyDungeonSendTextMessage(10, TextGet("KinkyDungeonGuardDisappear"), "red", 6);
					if (KinkyDungeonPrisonReduction < KinkyDungeonMaxPrisonReduction) {
						KinkyDungeonPrisonReduction += 1;
						KinkyDungeonChangeRep("Prisoner", -1);
					}
					KinkyDungeonChangeRep("Ghost", 1 + KinkyDungeonPrisonExtraGhostRep);
					KinkyDungeonPrisonExtraGhostRep = 0;
				}
			}
		}
	}

	if (!KinkyDungeonJailGuard) {
		KinkyDungeonGuardTimer = 0;
	}
	if (!KinkyDungeonEntities.includes(KinkyDungeonJailGuard)) {
		if (KinkyDungeonGuardSpawnTimer == 0)
			KinkyDungeonGuardSpawnTimer = 4 + Math.floor(Math.random() * (KinkyDungeonGuardSpawnTimerMax - KinkyDungeonGuardSpawnTimerMin));
		KinkyDungeonJailGuard = undefined;
	}
}

function KinkyDungeonJailHandleCellActions(xx, yy, level) {
	let playerDist = Math.sqrt((KinkyDungeonJailGuard.x - KinkyDungeonPlayerEntity.x)*(KinkyDungeonJailGuard.x - KinkyDungeonPlayerEntity.x) + (KinkyDungeonJailGuard.y - KinkyDungeonPlayerEntity.y)*(KinkyDungeonJailGuard.y - KinkyDungeonPlayerEntity.y));
	let touchesPlayer = KinkyDungeonCheckLOS(KinkyDungeonJailGuard, KinkyDungeonPlayerEntity, playerDist, 1.5, false, false);
	if (touchesPlayer) {
		if (KinkyDungeonJailGuard.CurrentAction === "jailTease") {
			let playerHasVibrator = KinkyDungeonInventory.some(i => i.restraint && i.restraint.vibeType && i.restraint.vibeType.includes("Charging"));
			if (playerHasVibrator) {
				let extraCharge = Math.round(2 + level * Math.random() * 0.2);
				KinkyDungeonChargeRemoteVibrators(KinkyDungeonJailGuard.Enemy.name, extraCharge, true, false);
			} else if (KinkyDungeonJailGuard.Enemy.dmgType === "grope" || KinkyDungeonJailGuard.Enemy.dmgType === "tickle") {
				KinkyDungeonDealDamage({damage: KinkyDungeonJailGuard.Enemy.power, type: KinkyDungeonJailGuard.Enemy.dmgType});
				KinkyDungeonSendTextMessage(5, TextGet("Attack" + KinkyDungeonJailGuard.Enemy.name), "yellow", 3);
			}
			if (Math.random() < 0.02 || (KinkyDungeonStatStamina < 10 && Math.random() < 0.1))
				KinkyDungeonJailGuard.CurrentAction = "jailWander";
			KinkyDungeonJailGuard.gx = KinkyDungeonJailGuard.x;
			KinkyDungeonJailGuard.gy = KinkyDungeonJailGuard.y;
		}

		if (KinkyDungeonJailGuard.CurrentAction === "jailAddRestraints") {
			let newRestraint = KinkyDungeonGetJailRestraintForGroup(KinkyDungeonJailGuard.CurrentRestraintSwapGroup);
			if (newRestraint) {
				let oldRestraintItem = KinkyDungeonGetRestraintItem(KinkyDungeonJailGuard.CurrentRestraintSwapGroup);
				let added = KinkyDungeonAddRestraintIfWeaker(newRestraint, 0, true);
				if (added) {
					let restraintModification = oldRestraintItem ? "ChangeRestraints" : "AddRestraints";
					let msg = TextGet("KinkyDungeon" + restraintModification).replace("EnemyName", TextGet("Name" + KinkyDungeonJailGuard.Enemy.name));
					if (oldRestraintItem) msg = msg.replace("OldRestraintName", TextGet("Restraint"+oldRestraintItem.restraint.name));
					msg = msg.replace("NewRestraintName", TextGet("Restraint"+newRestraint.name));
					KinkyDungeonSendTextMessage(5, msg, "yellow", 3);
				} else
					KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonJailerCheck"), "yellow", 3);
			}
			KinkyDungeonJailGuard.CurrentAction = "jailWander";
			KinkyDungeonJailGuard.gx = KinkyDungeonJailGuard.x;
			KinkyDungeonJailGuard.gy = KinkyDungeonJailGuard.y;
		}

		if (KinkyDungeonJailGuard.CurrentAction === "jailRemoveRestraints") {
			let oldRestraintItem = KinkyDungeonGetRestraintItem(KinkyDungeonJailGuard.CurrentRestraintSwapGroup);
			if (oldRestraintItem && oldRestraintItem.restraint && !oldRestraintItem.noJailRemove) {
				KinkyDungeonRemoveRestraint(oldRestraintItem.restraint.Group, false, false, true);
				let msg = TextGet("KinkyDungeonRemoveRestraints").replace("EnemyName", TextGet("Name" + KinkyDungeonJailGuard.Enemy.name));
				//let msg = TextGet("Attack" + KinkyDungeonJailGuard.Enemy.name + "RemoveRestraints");
				if (oldRestraintItem) msg = msg.replace("OldRestraintName", TextGet("Restraint"+oldRestraintItem.restraint.name));
				KinkyDungeonSendTextMessage(5, msg, "yellow", 3);
			}
			KinkyDungeonJailGuard.CurrentAction = "jailWander";
			KinkyDungeonJailGuard.gx = KinkyDungeonJailGuard.x;
			KinkyDungeonJailGuard.gy = KinkyDungeonJailGuard.y;
		}

	} else {
		KinkyDungeonJailGuard.gx = KinkyDungeonPlayerEntity.x;
		KinkyDungeonJailGuard.gy = KinkyDungeonPlayerEntity.y;
	}
}

function KinkyDungeonJailGuardGetLeashWaypoint(xx, yy) {
	if (KinkyDungeonJailGuard.RemainingJailLeashTourWaypoints === 0) {
		// Go back to the cell's bed
		KinkyDungeonJailGuard.NextJailLeashTourWaypointX = KinkyDungeonStartPosition.x;
		KinkyDungeonJailGuard.NextJailLeashTourWaypointY = KinkyDungeonStartPosition.y;
		KinkyDungeonJailGuard.gx = KinkyDungeonJailGuard.NextJailLeashTourWaypointX;
		KinkyDungeonJailGuard.gy = KinkyDungeonJailGuard.NextJailLeashTourWaypointY;
	} else {
		// Get a random next waypoint in an acceptable range outside of the cell
		let randomPoint = KinkyDungeonJailGetLeashPoint(xx, yy, KinkyDungeonJailGuard);
		KinkyDungeonJailGuard.NextJailLeashTourWaypointX = randomPoint.x;
		KinkyDungeonJailGuard.NextJailLeashTourWaypointY = randomPoint.y;
		KinkyDungeonJailGuard.gx = KinkyDungeonJailGuard.NextJailLeashTourWaypointX;
		KinkyDungeonJailGuard.gy = KinkyDungeonJailGuard.NextJailLeashTourWaypointY;
	}
}

function KinkyDungeonJailGetLeashPoint(xx, yy, enemy) {
	let randomPoint = { x: xx, y: yy };
	for(let i = 0; i < 40; ++i) {
		randomPoint = KinkyDungeonGetRandomEnemyPoint(true, false, enemy);
		if (randomPoint) {
			let distanceFromCell = Math.ceil((xx - randomPoint.x) * (xx - randomPoint.x) + (yy - randomPoint.y) * (yy - randomPoint.y));
			if (distanceFromCell > KinkyDungeonJailLeash * 3 && distanceFromCell < KinkyDungeonJailLeash * 6) {
				break;
			}
		}
	}
	return randomPoint;
}

function KinkyDungeonNoEnemy(x, y, Player) {

	if (KinkyDungeonEnemyAt(x, y)) return false;
	if (Player)
		for (let P = 0; P < KinkyDungeonPlayers.length; P++)
			if ((KinkyDungeonPlayers[P].x == x && KinkyDungeonPlayers[P].y == y)) return false;
	return true;
}

// e = potential sub
// Enemy = leader
function KinkyDungeonHasSeniority(e, Enemy) {
	if (Enemy && Enemy.Enemy && Enemy.Enemy.ethereal) return false; // Ethereal enemies NEVER have seniority, this can teleport other enemies into walls
	if (!e.Enemy.tags || e.Enemy.tags.has("minor"))
		return true;
	else if (Enemy && Enemy.Enemy && Enemy.Enemy.tags && Enemy.Enemy.tags.has("elite")) {
		if (!e.Enemy.tags || (!e.Enemy.tags.has("elite") && !e.Enemy.tags.has("miniboss") && !e.Enemy.tags.has("boss")))
			return true;
	} else if (Enemy && Enemy.Enemy && Enemy.Enemy.tags && Enemy.Enemy.tags.has("miniboss")) {
		if (!e.Enemy.tags || (!e.Enemy.tags.has("miniboss") && !e.Enemy.tags.has("boss")))
			return true;
	} else if (Enemy && Enemy.Enemy && Enemy.Enemy.tags && Enemy.Enemy.tags.has("boss")) {
		if (!e.Enemy.tags || (!e.Enemy.tags.has("boss")))
			return true;
	}
	return false;
}

function KinkyDungeonNoEnemyExceptSub(x, y, Player, Enemy) {
	let e = KinkyDungeonEnemyAt(x, y);
	if (e && e.Enemy) {
		if (e.Enemy.master && Enemy && Enemy.Enemy && e.Enemy.master.type == Enemy.Enemy.name) return true;
		let seniority = Enemy ? KinkyDungeonHasSeniority(e, Enemy) : false;
		return seniority;
	}
	if (Player)
		for (let P = 0; P < KinkyDungeonPlayers.length; P++)
			if ((KinkyDungeonPlayers[P].x == x && KinkyDungeonPlayers[P].y == y)) return false;
	return true;
}

function KinkyDungeonEnemyAt(x, y) {
	for (let E = 0; E < KinkyDungeonEntities.length; E++) {
		if (KinkyDungeonEntities[E].x == x && KinkyDungeonEntities[E].y == y)
			return KinkyDungeonEntities[E];
	}
	return null;
}

function KinkyDungeonEnemyTryMove(enemy, Direction, delta, x, y) {
	if (enemy.bind > 0) enemy.movePoints += delta/10;
	else if (enemy.slow > 0) enemy.movePoints += delta/2;
	else enemy.movePoints += KinkyDungeonSleepTurns > 0 ? 4*delta : delta;

	if (enemy.movePoints >= enemy.Enemy.movePoints) {
		enemy.movePoints = 0;
		let dist = Math.abs(x - KinkyDungeonPlayerEntity.x) + Math.abs(y - KinkyDungeonPlayerEntity.y);

		if (KinkyDungeonMapGet(enemy.x, enemy.y) == 'd' && enemy.Enemy && enemy.Enemy.tags.has("closedoors")
			&& ((Math.random() < 0.8 && dist > 5) ||
				(KinkyDungeonTiles[enemy.x + "," + enemy.y] && (KinkyDungeonTiles[enemy.x + "," + enemy.y].Jail || KinkyDungeonTiles[enemy.x + "," + enemy.y].ReLock) && (!KinkyDungeonJailGuard || KinkyDungeonJailGuard.CurrentAction != "jailLeashTour")))) {
			KinkyDungeonMapSet(enemy.x, enemy.y, 'D');
			if (KinkyDungeonTiles[enemy.x + "," + enemy.y] && KinkyDungeonTiles[enemy.x + "," + enemy.y].Jail
				&& (!KinkyDungeonJailGuard || KinkyDungeonJailGuard.CurrentAction != "jailLeashTour")) {
				KinkyDungeonTiles[enemy.x + "," + enemy.y].Lock = "Red";
			}
			if (dist < 10) {
				KinkyDungeonSendTextMessage(2, TextGet("KinkyDungeonHearDoorCloseNear"), "#dddddd", 4);
			} else if (dist < 20)
				KinkyDungeonSendTextMessage(1, TextGet("KinkyDungeonHearDoorCloseFar"), "#999999", 4);
		}

		let ee = KinkyDungeonEnemyAt(enemy.x + Direction.x, enemy.y + Direction.y);
		if (ee && KinkyDungeonHasSeniority(ee, enemy)) {
			ee.x = enemy.x;
			ee.y = enemy.y;
		}
		enemy.x += Direction.x;
		enemy.y += Direction.y;

		if (KinkyDungeonMapGet(x, y) == 'D' && enemy.Enemy && enemy.Enemy.tags.has("opendoors")) {
			KinkyDungeonMapSet(x, y, 'd');
			if (KinkyDungeonTiles[x + ',' +y] && KinkyDungeonTiles[x + ',' +y].Type == "Door")
				KinkyDungeonTiles[x + ',' +y].Lock = undefined;
			if (dist < 5) {
				KinkyDungeonSendTextMessage(2, TextGet("KinkyDungeonHearDoorOpenNear"), "#dddddd", 4);
			} else if (dist < 15)
				KinkyDungeonSendTextMessage(1, TextGet("KinkyDungeonHearDoorOpenFar"), "#999999", 4);
		}

		return true;
	}
	return false;
}

function KinkyDungeonEnemyTryAttack(enemy, player, Tiles, delta, x, y, points, replace, msgColor, usingSpecial) {
	enemy.attackPoints += delta;

	if (enemy.attackPoints >= points) {
		enemy.attackPoints = 0;
		if (points > 1) {
			for (let T = 0; T < Tiles.length; T++) {
				let ax = enemy.x + Tiles[T].x;
				let ay = enemy.y + Tiles[T].y;

				if (player.x == ax && player.y == ay && (!enemy.Enemy.strictAttackLOS || KinkyDungeonCheckProjectileClearance(enemy.x, enemy.y, player.x, player.y))) {
					return true;
				}
			}
			if (enemy.Enemy.specialRange && usingSpecial && enemy.Enemy.specialCDonAttack) {
				enemy.specialCD = enemy.Enemy.specialCD;
			}
			if (enemy.Enemy.specialWidth && usingSpecial && enemy.Enemy.specialCDonAttack) {
				enemy.specialCD = enemy.Enemy.specialCD;
			}
		} else return true;
		enemy.warningTiles = [];
	} else if (!enemy.Enemy.noCancelAttack) { // Verify player is in warningtiles and reset otherwise
		let playerIn = false;
		for (let T = 0; T < Tiles.length; T++) {
			let ax = enemy.x + Tiles[T].x;
			let ay = enemy.y + Tiles[T].y;

			if (player.x == ax && player.y == ay && (!enemy.Enemy.strictAttackLOS || KinkyDungeonCheckProjectileClearance(enemy.x, enemy.y, player.x, player.y))) {
				playerIn = true;
				break;
			}
		}
		if (!playerIn) {
			enemy.attackPoints = Math.min(KinkyDungeonMovePoints >= 0 ? 1 : 0, enemy.attackPoints);
			enemy.warningTiles = [];
		}
	}
	return false;
}

function KinkyDungeonGetWarningTilesAdj() {
	var arr = [];

	arr.push({x:1, y:1});
	arr.push({x:0, y:1});
	arr.push({x:1, y:0});
	arr.push({x:-1, y:-1});
	arr.push({x:-1, y:1});
	arr.push({x:1, y:-1});
	arr.push({x:-1, y:0});
	arr.push({x:0, y:-1});

	return arr;
}


function KinkyDungeonGetWarningTiles(dx, dy, range, width, forwardOffset = 1) {
	if (range == 1 && width == 8) return KinkyDungeonGetWarningTilesAdj();

	var arr = [];
	/*
	var cone = 0.78539816 * (width-0.9)/2;
	var angle_player = Math.atan2(dx, dy) + ((width % 2 == 0) ? ((Math.random() > 0.5) ? -0.39269908 : 39269908) : 0);
	if (angle_player > Math.PI) angle_player -= Math.PI;
	if (angle_player < -Math.PI) angle_player += Math.PI;

	for (let X = -range; X <= range; X++)
		for (let Y = -range; Y <= range; Y++) {
			var angle = Math.atan2(X, Y);

			var angleDiff = angle - angle_player;
			angleDiff += (angleDiff>Math.PI) ? -2*Math.PI : (angleDiff<-Math.PI) ? 2*Math.PI : 0;

			if (Math.abs(angleDiff) < cone + 0.22/Math.max(Math.abs(X), Math.abs(Y)) && Math.sqrt(X*X + Y*Y) < range + 0.5) arr.push({x:X, y:Y});
		}
	*/
	let dist = Math.sqrt(dx*dx + dy*dy);
	let radius = Math.ceil(width/2);
	if (dist > 0) {
		let x_step = dx/dist;
		let y_step = dy/dist;

		for (let d = forwardOffset; d <= range; d++) {
			let xx = x_step * d;
			let yy = y_step * d;
			for (let X = Math.floor(xx-radius); X <= Math.ceil(xx+radius); X++)
				for (let Y = Math.floor(yy-radius); Y <= Math.ceil(yy+radius); Y++) {
					let dd = Math.sqrt((X - xx)*(X - xx) + (Y - yy)*(Y - yy));
					let dd2 = Math.sqrt(X*X+Y*Y);
					if (dd < width*0.49 && dd2 < range + 0.5) {
						let dupe = false;
						for (let a of arr) {
							if (a.x == X && a.y == Y) {dupe = true; break;}
						}
						if (!dupe) arr.push({x:X, y:Y});
					}
				}
		}
	}

	return arr;
}


function KinkyDungeonDefeat() {
	//MiniGameKinkyDungeonLevel = Math.min(MiniGameKinkyDungeonLevel, Math.max(Math.floor(MiniGameKinkyDungeonLevel/10)*10, MiniGameKinkyDungeonLevel - KinkyDungeonSpawnJailers + KinkyDungeonSpawnJailersMax - 1));
	KinkyDungeonSendInventoryEvent("defeat", {});

	for (let inv of KinkyDungeonRestraintList()) {
		if (inv.restraint && inv.restraint.removePrison) {
			KinkyDungeonRemoveRestraint(inv.restraint.Group, false);
		}
	}
	KinkyDungeonPrisonReduction = 0;
	let firstTime = KinkyDungeonSpawnJailersMax == 0;
	KinkyDungeonGuardSpawnTimer = 4 + Math.floor(Math.random() * (KinkyDungeonGuardSpawnTimerMax - KinkyDungeonGuardSpawnTimerMin));
	KinkyDungeonSpawnJailersMax = 2;
	if (KinkyDungeonGoddessRep.Prisoner) KinkyDungeonSpawnJailersMax += Math.round(6 * (KinkyDungeonGoddessRep.Prisoner + 50)/100);
	let securityBoost = (firstTime) ? 0 : Math.max(2, Math.ceil(4 * (KinkyDungeonSpawnJailersMax - KinkyDungeonSpawnJailers + 1)/KinkyDungeonSpawnJailersMax));

	KinkyDungeonStatBlind = 3;

	//MiniGameKinkyDungeonLevel = Math.floor((MiniGameKinkyDungeonLevel + Math.max(0, KinkyDungeonSpawnJailersMax - KinkyDungeonSpawnJailers))/5)*5;
	MiniGameKinkyDungeonLevel = Math.floor(MiniGameKinkyDungeonLevel/2)*2;
	KinkyDungeonSendTextMessage(10, TextGet("KinkyDungeonLeashed"), "#ff0000", 3);
	let params = KinkyDungeonMapParams[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]];
	KinkyDungeonSpawnJailers = KinkyDungeonSpawnJailersMax;
	if (KinkyDungeonMapGet(KinkyDungeonStartPosition.x, KinkyDungeonStartPosition.y) != "B") {
		KinkyDungeonCreateMap(params, MiniGameKinkyDungeonLevel);
	} else {
		KinkyDungeonPlayerEntity.x = KinkyDungeonStartPosition.x;
		KinkyDungeonPlayerEntity.y = KinkyDungeonStartPosition.y;
		let leash = KinkyDungeonGetRestraintItem("ItemNeckRestraints");
		if (leash && (leash.tx || leash.ty)) {
			leash.tx = undefined;
			leash.ty = undefined;
		}
		KinkyDungeonSpawnJailers = KinkyDungeonSpawnJailersMax - 1;
	}

	let defeat_outfit = params.defeat_outfit;
	// Handle special cases
	let collar = KinkyDungeonGetRestraintItem("ItemNeck");
	if (collar && collar.restraint) {
		if (collar.restraint.name == "DragonCollar") defeat_outfit = "Dragon";
		if (collar.restraint.name == "MaidCollar") defeat_outfit = "Maid";
		if (collar.restraint.name == "ExpCollar") defeat_outfit = "BlueSuitPrison";
		if (collar.restraint.name == "WolfCollar") defeat_outfit = "Wolfgirl";
	}

	KinkyDungeonSetDress(defeat_outfit);
	KinkyDungeonDressPlayer();
	for (let r of params.defeat_restraints) {
		let level = 0;
		if (KinkyDungeonGoddessRep.Prisoner) level = Math.max(0, KinkyDungeonGoddessRep.Prisoner + 50);
		if (!r.Level || level >= r.Level)
			KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName(r.Name), 0, true);
	}
	KinkyDungeonSetDress(defeat_outfit);
	KinkyDungeonRedKeys = 0;
	KinkyDungeonBlueKeys = 0;
	KinkyDungeonLockpicks = Math.min(Math.max(0, Math.round(3 * (1 - (KinkyDungeonGoddessRep.Prisoner + 50)/100))), KinkyDungeonLockpicks);
	KinkyDungeonNormalBlades = 0;

	let newInv = KinkyDungeonRestraintList();
	let HasBound = false;
	let boundWeapons = [];
	if (HasBound) {
		// TODO add bound weapons here
	}
	KinkyDungeonAddLostItems(KinkyDungeonInventory, HasBound);
	KinkyDungeonInventory = newInv;
	KinkyDungeonInventoryAddWeapon("Knife");
	KinkyDungeonPlayerWeapon = "";
	for (let b of boundWeapons) {
		KinkyDungeonInventoryAddWeapon(b);
	}

	//KinkyDungeonChangeRep("Ghost", 1 + Math.round(KinkyDungeonSpawnJailers/2));
	KinkyDungeonChangeRep("Prisoner", securityBoost); // Each time you get caught, security increases...

	KinkyDungeonDressPlayer();
	if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/StoneDoor_Close.ogg");
	KinkyDungeonJailTransgressed = false;
}

function KinkyDungeonFindMaster(enemy) {
	let findMaster = undefined;
	let masterDist = 1000;
	if (enemy.Enemy.master) {
		for (let e of KinkyDungeonEntities) {
			if (e.Enemy.name == enemy.Enemy.master.type) {
				let dist = Math.sqrt((e.x - enemy.x) * (e.x - enemy.x) + (e.y - enemy.y)*(e.y - enemy.y));
				if ((!enemy.Enemy.master.maxDist || dist < enemy.Enemy.master.maxDist)
					&& dist < masterDist
					&& (!enemy.Enemy.master.loose || KinkyDungeonCheckLOS(enemy, e, dist, 100, false, false))) {
					masterDist = Math.sqrt((e.x - enemy.x) * (e.x - enemy.x) + (e.y - enemy.y)*(e.y - enemy.y));
					findMaster = e;
				}
			}
		}
	}
	return {master: findMaster, dist: masterDist};
}

function KinkyDungeonEnemyCanMove(enemy, dir, MovableTiles, AvoidTiles, ignoreLocks, Tries) {
	let master = enemy.Enemy.master;
	let xx = enemy.x + dir.x;
	let yy = enemy.y + dir.y;
	if (master && (!enemy.Enemy.master.aggressive || !enemy.aware)) {
		let fm = KinkyDungeonFindMaster(enemy);
		let findMaster = fm.master;
		let masterDist = fm.dist;
		if (findMaster) {
			if (Math.sqrt((xx - findMaster.x) * (xx - findMaster.x) + (yy - findMaster.y) * (yy - findMaster.y)) > master.range
				&& Math.sqrt((xx - findMaster.x) * (xx - findMaster.x) + (yy - findMaster.y) * (yy - findMaster.y)) > masterDist) return false;
		}
	}
	return MovableTiles.includes(KinkyDungeonMapGet(xx, yy)) && ((Tries && Tries > 5) || !AvoidTiles.includes(KinkyDungeonMapGet(enemy.x + dir.x, enemy.y + dir.y)))
		&& (ignoreLocks || !KinkyDungeonTiles[(xx) + "," + (yy)] || !KinkyDungeonTiles[(xx) + "," + (yy)].Lock)
		&& KinkyDungeonNoEnemyExceptSub(xx, yy, true, enemy);
}