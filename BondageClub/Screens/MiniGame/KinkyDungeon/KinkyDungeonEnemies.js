"use strict";
var KinkyDungeonEnemies = [
	{name: "Wall", tags: ["construct", "player", "playerinstakill"], allied: true, lowpriority: true, evasion: -100, armor: 1, followRange: 100, AI: "wander", regen: -2.5,
		visionRadius: 0, maxhp: 25, minLevel:0, weight:0, movePoints: 1000, attackPoints: 0, attack: "", attackRange: 0,
		terrainTags: {}, floors:[]},
	{name: "Decoy", tags: ["construct", "player"], noblockplayer: true, allied: true, evasion: 4, armor: 0, followRange: 100, AI: "wander", regen: -1,
		visionRadius: 0, maxhp: 15, minLevel:0, weight:0, movePoints: 2, attackPoints: 0, attack: "", attackRange: 0,
		terrainTags: {}, floors:[]},
	{name: "Ally", tags: ["construct", "player"], noblockplayer: true, allied: true, armor: 0, followRange: 1, AI: "hunt",
		visionRadius: 20, playerBlindSight: 10, maxhp: 6, minLevel:0, weight:0, movePoints: 1, attackPoints: 1, attack: "MeleeWill", attackRange: 1, attackWidth: 3, power: 1,
		terrainTags: {}, floors:[]},
	{name: "ShadowWarrior", tags: ["construct", "player", "ghost"], noblockplayer: true, allied: true, armor: 0, followRange: 1, AI: "hunt", regen: -0.5,
		spells: ["AllyShadowStrike"], spellCooldownMult: 1, spellCooldownMod: 0,
		visionRadius: 20, playerBlindSight: 10, maxhp: 8, minLevel:0, weight:0, movePoints: 1, attackPoints: 1, attack: "Spell", attackRange: 0, power: 1,
		terrainTags: {}, floors:[]},
	{name: "FireElemental", tags: ["construct", "player", "fireimmune", "electricimmune", "coldweakness", "iceweakness"], noblockplayer: true, allied: true, armor: 0, kite: 1.5, followRange: 3, playerFollowRange: 1, AI: "hunt",
		spells: ["AllyFirebolt"], minSpellRange: 1.5, spellCooldownMult: 1, spellCooldownMod: 1,
		visionRadius: 20, playerBlindSight: 10, maxhp: 8, minLevel:0, weight:0, movePoints: 1, attackPoints: 1, attack: "Spell", attackRange: 0, power: 1,
		terrainTags: {}, floors:[]},
	{name: "Golem", tags: ["construct", "player"], noblockplayer: true, allied: true, armor: 1, followRange: 1, AI: "hunt",
		visionRadius: 20, playerBlindSight: 10, maxhp: 24, minLevel:0, weight:0, movePoints: 2, attackPoints: 2, attack: "MeleeWill", attackRange: 1, attackWidth: 5, power: 6,
		terrainTags: {}, floors:[]},
	{name: "StormCrystal", tags: ["construct", "player"], noblockplayer: true, allied: true, armor: 2, followRange: 1, AI: "wander", regen: -0.5,
		spells: ["AllyCrackle"], spellCooldownMult: 1, spellCooldownMod: 0,
		visionRadius: 6, maxhp: 16, minLevel:0, weight:0, movePoints: 1000, attackPoints: 1, attack: "Spell", attackRange: 0, power: 1,
		terrainTags: {}, floors:[]},


	{name: "BlindZombie", tags: ["ignoreharmless", "zombie", "melee", "ribbonRestraints", "meleeweakness"], evasion: -1, ignorechance: 0.33, armor: 0, followRange: 1, AI: "wander",
		visionRadius: 1.5, maxhp: 8, minLevel:0, weight:14, movePoints: 3, attackPoints: 3, attack: "MeleeBind", attackWidth: 1, attackRange: 1, power: 1, dmgType: "grope", fullBoundBonus: 2,
		terrainTags: {}, floors:[0], dropTable: [{name: "Gold", amountMin: 20, amountMax: 40, weight: 2}, {name: "Gold", amountMin: 13, amountMax: 23, weight: 5}]},
	{name: "FastZombie", tags: ["ignoreharmless", "zombie", "melee", "ribbonRestraints", "slashweakness"], evasion: -1, ignorechance: 0.33, armor: 1, followRange: 1, AI: "hunt",
		visionRadius: 6, maxhp: 10, minLevel:4, weight:6, movePoints: 3, attackPoints: 2, attack: "MeleeBind", attackWidth: 1, attackRange: 1, power: 1, dmgType: "grope", fullBoundBonus: 3,
		terrainTags: {"secondhalf":10, "lastthird":14}, floors:[0], dropTable: [{name: "Gold", amountMin: 40, amountMax: 60, weight: 1}, {name: "Gold", amountMin: 15, amountMax: 29, weight: 5}]},
	{name: "SamuraiZombie", tags: ["leashing", "zombie", "melee", "elite", "ropeRestraints", "ropeRestraints2", "meleeweakness"], evasion: -1, armor: 2, followRange: 1, AI: "hunt", stunTime: 2, specialCD: 6, specialAttack: "Stun", specialRemove: "Bind",
		specialCDonAttack: false, visionRadius: 6, maxhp: 20, minLevel:4, weight:5, movePoints: 3, attackPoints: 2, attack: "MeleeBind", attackWidth: 1, attackRange: 1, power: 1, dmgType: "grope", fullBoundBonus: 4, specialWidth: 5, specialRange: 1,
		terrainTags: {"secondhalf":8, "lastthird":6}, shrines: [], floors:[0, 11], dropTable: [{name: "Gold", amountMin: 50, amountMax: 80, weight: 2}, {name: "Gold", amountMin: 15, amountMax: 29, weight: 5}]},
	{name: "Ninja", tags: ["leashing", "opendoors", "human", "melee", "ropeRestraints", "ropeRestraints2", "meleeweakness"], blindSight: 5, stealth: 1, evasion: 1, followRange: 1, AI: "hunt", stunTime: 4, specialCD: 8, specialCharges: 2, specialAttack: "Stun", specialRemove: "Bind",
		specialCDonAttack: false, visionRadius: 10, maxhp: 12, minLevel:4, weight:4, movePoints: 1, attackPoints: 2, attack: "MeleeBind", attackWidth: 1, attackRange: 1, power: 2, dmgType: "crush", fullBoundBonus: 2, specialWidth: 1, specialRange: 4, specialMinrange: 1.5, //specialFollow: 3,
		terrainTags: {"secondhalf":3, "lastthird":7}, shrines: ["Illusion"], floors:[1, 11], dropTable: [{name: "Gold", amountMin: 50, amountMax: 80, weight: 1}, {name: "Pick", amountMin: 15, amountMax: 29, weight: 5}]},

	{name: "Skeleton", tags: ["leashing", "skeleton", "melee", "ropeRestraints", "leatherRestraints", "clothRestraints", "iceresist", "crushweakness"], ignorechance: 0, armor: 0, followRange: 1, AI: "hunt",
		visionRadius: 4, maxhp: 5, minLevel:1, weight:8, movePoints: 2, attackPoints: 2, attack: "MeleeBind", attackWidth: 1, attackRange: 1, power: 3, dmgType: "grope", fullBoundBonus: 1,
		terrainTags: {"secondhalf":4}, shrines: ["Leather"], floors:[1, 11], dropTable: [{name: "Gold", amountMin: 25, amountMax: 50, weight: 2}, {name: "Gold", amountMin: 20, amountMax: 35, weight: 5}]},
	{name: "SummonedSkeleton", tags: ["leashing", "skeleton", "melee", "ropeRestraints", "leatherRestraints", "clothRestraints", "crushweakness"], ignorechance: 0, armor: 0, followRange: 1, AI: "guard",
		visionRadius: 6, maxhp: 5, minLevel:1, weight:8, movePoints: 2, attackPoints: 2, attack: "MeleeBind", attackWidth: 1, attackRange: 1, power: 2, dmgType: "grope", fullBoundBonus: 1,
		terrainTags: {}, shrines: [], floors:[]},
	{name: "LesserSkeleton", tags: ["leashing", "ignorenoSP", "skeleton", "melee", "iceresist", "crushweakness"], ignorechance: 0, armor: 0, followRange: 1, AI: "wander", evasion: -2,
		visionRadius: 1, maxhp: 2.5, minLevel:0, weight:10, movePoints: 2, attackPoints: 3, attack: "MeleeWillSlow", attackWidth: 1, attackRange: 1, power: 3, dmgType: "grope", fullBoundBonus: 1,
		terrainTags: {"secondhalf":-8, "lastthird":-8}, floors:[1, 11]},
	{name: "GreaterSkeleton", tags: ["leashing", "ignoreharmless", "skeleton", "melee", "elite", "iceresist", "crushweakness"], ignorechance: 0, armor: 0, followRange: 1.5, AI: "hunt",
		visionRadius: 4, maxhp: 10, minLevel:12, weight:3, movePoints: 3, attackPoints: 3, attack: "MeleeWillSlow", attackWidth: 3, attackRange: 1, power: 10, dmgType: "crush", fullBoundBonus: 0,
		terrainTags: {"secondhalf":2, "lastthird":3, "increasingWeight":1}, floors:[1, 3, 7, 8], dropTable: [{name: "PotionHealth", weight: 3}, {name: "Gold", amountMin: 50, amountMax: 100, weight: 3}, {name: "Hammer", weight: 50, ignoreInInventory: true}]},

	{name: "Ghost", tags: ["ignorenoSP", "ghost", "melee"], ethereal: true, ignorechance: 0, armor: 0, followRange: 1, AI: "hunt",
		visionRadius: 10, blindSight: 3, evasion: 9.0, alwaysEvade: true, maxhp: 1, minLevel:0, weight:0.1, movePoints: 2, attackPoints: 1, attack: "MeleeWill", attackWidth: 3, attackRange: 1, power: 6, dmgType: "tickle", fullBoundBonus: 0,
		terrainTags: {"ghost" : 4.9}, shrines: ["Illusion"], floors:[0, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]},
	{name: "TickleHand", tags: ["ignorenoSP", "ghost", "melee"], ethereal: true, ignorechance: 0, armor: 0, followRange: 1, AI: "hunt", regen: -0.1,
		visionRadius: 10, blindSight: 3, evasion: 9.0, alwaysEvade: true, maxhp: 1, minLevel:0, weight:-1000, movePoints: 2, attackPoints: 1, attack: "MeleeWill", attackWidth: 3, attackRange: 1, power: 4, dmgType: "tickle", fullBoundBonus: 0,
		terrainTags: {}, shrines: [], floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]},
	{name: "Frog", tags: ["construct", "player"], armor: 1, followRange: 1, AI: "hunt", pullTowardSelf: true, pullDist: 3, master: {type: "Conjurer", range: 3},
		visionRadius: 10, maxhp: 24, minLevel:0, weight:0, movePoints: 2, attackPoints: 2, attack: "MeleePullWillSlow", attackRange: 4, attackWidth: 1.5, power: 6,
		terrainTags: {}, floors:[]},
	{name: "Conjurer", tags: ["leashing", "opendoors", "closedoors", "witch", "ranged", "boss", "latexRestraints"], followRange: 1, summon: [{enemy: "Frog", range: 2.5, count: 1, strict: true}],
		spells: ["SummonTickleHand"], spellCooldownMult: 2, spellCooldownMod: 1, AI: "guard", visionRadius: 8, maxhp: 40, minLevel:1, weight:-30, movePoints: 3,
		attackPoints: 2, attack: "MeleeLockAllWillSpellBind", attackWidth: 3, attackRange: 1, power: 3, dmgType: "tickle",
		terrainTags: {"secondhalf":16, "lastthird":5, "boss": -80, "open": 30, "passage": -60, "conjureAnger": 20, "conjureRage": 70}, floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrines: ["Conjure"], dropTable: [{name: "MagicSword", weight: 1}, {name: "BlueKey", weight: 3}]},

	{name: "AnimatedArmor", blockVisionWhileStationary: true, tags: ["removeDoorSpawn", "ignoreharmless", "leashing", "construct", "minor", "melee", "shackleRestraints", "shackleGag", "slashresist", "fireresist", "electricresist", "crushweakness"],
		evasion: -0.5, ignorechance: 1.0, armor: 2, followRange: 1, AI: "ambush",
		visionRadius: 100, ambushRadius: 1.9, blindSight: 100, maxhp: 10, minLevel:1, weight:0, movePoints: 4, attackPoints: 4, attack: "MeleeBind", attackWidth: 1, attackRange: 1, power: 4, dmgType: "crush", fullBoundBonus: 4,
		terrainTags: {"lastthird":8, "passage": 40, "adjChest": 8, "door": 40}, floors:[1], shrines: ["Metal"], dropTable: [{name: "RedKey", weight: 4}, {name: "Gold", amountMin: 75, amountMax: 125, weight: 10}, {name: "Sword", weight: 1, ignoreInInventory: true}]},

	{name: "VinePlant", blockVisionWhileStationary: true, tags: ["removeDoorSpawn", "ignorenoSP", "plant", "minor", "melee", "slashsevereweakness", "firesevereweakness", "unarmedresist", "crushresist", "vineRestraints"],
		ignorechance: 1.0, armor: 2, followRange: 1, AI: "ambush", specialCD: 99, specialAttack: "Stun", specialAttackPoints: 1, specialRemove: "Bind",
		visionRadius: 3, ambushRadius: 1.9, blindSight: 5, maxhp: 10, minLevel:0, weight:10, movePoints: 1, attackPoints: 2, attack: "MeleeWillBind", attackWidth: 1, attackRange: 1, power: 4, dmgType: "crush", fullBoundBonus: 2,
		terrainTags: {"passage": -50, "adjChest": 8, "door": 8}, floors:[2], shrines: ["Rope"]},
	{name: "Bramble", hitsfx: "DealDamage", tags: ["removeDoorSpawn", "plant", "minor", "melee", "slashsevereweakness", "firesevereweakness", "unarmedresist", "crushresist"],
		evasion: -9, ignorechance: 1.0, armor: 2, followRange: 1, AI: "wander", specialCD: 2, specialAttack: "Slow", specialAttackPoints: 1,
		visionRadius: 1.5, blindSight: 1.5, maxhp: 16, minLevel:0, weight:-80, movePoints: 99999, attackPoints: 1, attack: "MeleeWill", attackWidth: 8, attackRange: 1, power: 1, dmgType: "pain",
		terrainTags: {"passage": -50, "adjChest": -50, "door": -50, "open": 110}, floors:[2], shrines: ["Rope"]},
	{name: "Bandit", tags: ["leashing", "bandit", "melee", "leatherRestraints", "leatherRestraintsHeavy", "clothRestraints"], ignorechance: 0, armor: 0, followRange: 1, AI: "patrol",
		spells: ["BanditBola"], minSpellRange: 1.5, spellCooldownMult: 1, spellCooldownMod: 8,
		visionRadius: 6, maxhp: 9, minLevel:0, weight:15, movePoints: 2, attackPoints: 2, attack: "SpellMeleeBindWill", attackWidth: 1, attackRange: 1, power: 3, dmgType: "grope", fullBoundBonus: 3,
		terrainTags: {"thirdhalf":-4}, shrines: ["Leather"], floors:[2],
		dropTable: [{name: "Gold", amountMin: 30, amountMax: 50, weight: 4}, {name: "Gold", amountMin: 25, amountMax: 35, weight: 8}, {name: "Pick", weight: 8}, {name: "PotionStamina", weight: 1}]},
	{name: "BanditHunter", tags: ["leashing", "bandit", "melee", "leatherRestraints", "leatherRestraintsHeavy", "clothRestraints"], ignorechance: 0, armor: 0, followRange: 2, AI: "patrol", stealth: 1,
		spells: ["BanditBola"], minSpellRange: 1.5, spellCooldownMult: 1, spellCooldownMod: 3,
		visionRadius: 7, maxhp: 9, minLevel:4, weight:0, movePoints: 2, attackPoints: 2, attack: "SpellMeleeBindWill", attackWidth: 1, attackRange: 1, power: 3, dmgType: "grope", fullBoundBonus: 5,
		terrainTags: {"secondhalf":7, "thirdhalf":5}, shrines: ["Leather"], floors:[2],
		dropTable: [{name: "Gold", amountMin: 30, amountMax: 50, weight: 4}, {name: "Gold", amountMin: 25, amountMax: 35, weight: 8}, {name: "Pick", weight: 8}, {name: "PotionStamina", weight: 1}]},
	{name: "SmallSlime", tags: ["ignoretiedup", "construct", "melee", "slimeRestraints", "meleeresist"], ignorechance: 0.75, followRange: 1, AI: "hunt", sneakThreshold: 1,
		visionRadius: 3, maxhp: 3, minLevel: 15, weight:10, movePoints: 1, attackPoints: 2, attack: "MeleeBindSlowSuicide", suicideOnAdd: true, attackWidth: 1, attackRange: 1, power: 1, dmgType: "grope", fullBoundBonus: 5,
		terrainTags: {}, floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrines: ["Latex"],
		dropTable: [{name: "Nothing", weight: 49}, {name: "Pick", weight: 4}, {name: "Knife", weight: 2}, {name: "MagicSword", weight: 1, ignoreInInventory: true}]},
	{name: "FastSlime", tags: ["ignoretiedup", "construct", "melee", "slimeRestraints", "meleeresist"], evasion: 0.3, followRange: 1, AI: "hunt", sneakThreshold: 1,
		visionRadius: 3, maxhp: 3, minLevel: 22, weight:5, movePoints: 1, attackPoints: 2, attack: "MeleeBindSlowSuicide", suicideOnAdd: true, attackWidth: 1.5, attackRange: 3, power: 4, dmgType: "grope", fullBoundBonus: 6,
		terrainTags: {}, floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrines: ["Latex"],
		dropTable: [{name: "Nothing", weight: 29}, {name: "Pick", weight: 4}, {name: "RedKey", weight: 1}, {name: "BlueKey", weight: 1}, {name: "Knife", weight: 2}, {name: "MagicSword", weight: 1, ignoreInInventory: true}]},
	{name: "BigSlime", tags: ["ignoretiedup", "construct", "melee", "slimeRestraints", "meleeresist"], evasion: 0.3, followRange: 1, AI: "hunt", sneakThreshold: 1,
		visionRadius: 3, maxhp: 12, minLevel: 23, weight:2, movePoints: 3, attackPoints: 3, attack: "MeleeBind", attackWidth: 8, attackRange: 1, power: 4, dmgType: "grope", fullBoundBonus: 4,
		terrainTags: {}, floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrines: ["Latex"], ondeath: [{type: "summon", enemy: "SmallSlime", range: 2.5, count: 4, strict: true}],
		dropTable: [{name: "Nothing", weight: 9}, {name: "Pick", weight: 4}, {name: "RedKey", weight: 1}, {name: "BlueKey", weight: 1}, {name: "Knife", weight: 2}, {name: "MagicSword", weight: 1, ignoreInInventory: true}]},

	{name: "RopeSnake", tags: ["ignoreharmless", "construct", "melee", "ropeRestraints", "minor", "fireweakness", "slashweakness"], ignorechance: 0.75, followRange: 1, AI: "wander",
		visionRadius: 3, maxhp: 4, minLevel: 1, weight:3, movePoints: 1, attackPoints: 2, attack: "MeleeBindSuicide", suicideOnAdd: true, attackWidth: 1, attackRange: 1, power: 1, dmgType: "grope", fullBoundBonus: 4,
		terrainTags: {"secondhalf":4, "lastthird":2}, floors:[0, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrines: ["Rope"]},
	{name: "LearnedRope", tags: ["ignoreharmless", "construct", "melee", "ropeRestraints", "ropeRestraints2", "fireweakness", "slashweakness"], ignorechance: 0.75, followRange: 1, AI: "hunt",
		visionRadius: 5, maxhp: 8, minLevel: 3, weight:1, movePoints: 2, attackPoints: 2, attack: "MeleeBindSuicide", suicideOnAdd: true, attackWidth: 1.5, attackRange: 2, power: 3, multiBind: 2, dmgType: "grope", fullBoundBonus: 5,
		terrainTags: {"secondhalf":4, "lastthird":2}, floors:[0, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrines: ["Rope"]},
	{name: "MonsterRope", tags: ["ignoreharmless", "construct", "melee", "ropeRestraints", "ropeRestraints2", "elite", "fireweakness", "slashweakness"], ignorechance: 0.75, followRange: 1, AI: "guard",
		visionRadius: 6, maxhp: 20, minLevel: 5, weight:0, movePoints: 3, attackPoints: 2, attack: "MeleeBindSuicide", suicideOnAdd: true, attackWidth: 3, attackRange: 1, power: 5, multiBind: 5, dmgType: "grope", fullBoundBonus: 15,
		terrainTags: {"secondhalf":1, "lastthird":4}, floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrines: ["Rope"]},

	{name: "RopeKraken", tags: ["construct", "melee", "boss", "fireweakness", "slashweakness"], ignorechance: 0.75, followRange: 1, AI: "hunt", summon: [{enemy: "RopeMinion", range: 2.5, count: 8, strict: true}],
		spells: ["RopeEngulf"], spellCooldownMult: 1, spellCooldownMod: 1, ignoreflag: ["kraken"],
		visionRadius: 10, maxhp: 60, minLevel: 5, weight:-30, movePoints: 4, attackPoints: 2, attack: "Spell", attackWidth: 1, attackRange: 1, power: 6, dmgType: "grope",
		terrainTags: {"secondhalf":16, "lastthird":5, "boss": -80, "open": 30, "passage": -60, "ropeAnger": 20, "ropeRage": 70}, floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrines: ["Rope"],
		dropTable: [{name: "Knives", weight: 4}, {name: "EnchKnife", weight: 3}]},
	{name: "RopeMinion", tags: ["construct", "melee", "fireweakness", "slashweakness"], ignorechance: 0.75, followRange: 1, AI: "hunt", master: {type: "RopeKraken", range: 4}, ignoreflag: ["kraken"],
		visionRadius: 10, maxhp: 8, minLevel: 1, weight:-1000, movePoints: 1, attackPoints: 2, attack: "MeleePullWill", attackWidth: 1, attackRange: 1, power: 2, dmgType: "crush", fullBoundBonus: 1,
		terrainTags: {}, floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], shrines: ["Rope"]},

	{name: "Rat", tags: ["ignorenoSP", "beast", "melee", "minor"], followRange: 1, AI: "guard",
		visionRadius: 4, maxhp: 1, evasion: 0.5, minLevel:0, weight:8, movePoints: 1.5, attackPoints: 2, attack: "MeleeWill", attackWidth: 1, attackRange: 1, power: 3, dmgType: "pain",
		terrainTags: {"rubble":20, "increasingWeight":-5}, floors:[0]},

	{name: "WitchShock", tags: ["leashing", "opendoors", "closedoors", "witch", "ranged", "elite", "miniboss", "unflinching", "electricimmune", "glueweakness", "iceweakness"], followRange: 2, castWhileMoving: true, spells: ["WitchElectrify"],
		spellCooldownMult: 1, spellCooldownMod: 0, AI: "hunt", visionRadius: 6, maxhp: 14, minLevel:3, weight:10, movePoints: 2, attackPoints: 2, attack: "Spell", attackWidth: 1, attackRange: 1, power: 1, dmgType: "grope",
		terrainTags: {"secondhalf":2, "lastthird":1, "miniboss": -10}, floors:[0, 1], shrines: ["Elements"], dropTable: [{name: "RedKey", weight: 9}, {name: "BlueKey", weight: 2}]},
	{name: "WitchChain", tags: ["leashing", "opendoors", "closedoors", "witch", "ranged", "elite", "miniboss", "unflinching", "electricweakness", "meleeresist", "fireresist"], followRange: 1, spells: ["WitchChainBolt"],
		spellCooldownMult: 2, spellCooldownMod: 2, AI: "hunt", visionRadius: 6, maxhp: 14, minLevel:5, weight:6, movePoints: 3, attackPoints: 4, attack: "MeleeLockAllWillSpell", attackWidth: 1, attackRange: 1, power: 5, dmgType: "grope",
		terrainTags: {"secondhalf":3, "lastthird":3, "miniboss": -10}, floors:[0, 1], shrines: ["Metal"], dropTable: [{name: "RedKey", weight: 9}, {name: "BlueKey", weight: 1}]},
	{name: "WitchSlime", tags: ["leashing", "opendoors", "closedoors", "witch", "ranged", "elite", "miniboss", "unflinching", "glueimmune", "fireimmune", "meleeresist", "electricweakness", "iceweakness"], kite: 1.5, followRange: 4, castWhileMoving: true, spells: ["WitchSlimeBall", "WitchSlimeBall", "WitchSlime"],
		spellCooldownMult: 2, spellCooldownMod: 1, AI: "wander", visionRadius: 8, maxhp: 10, minLevel:4, weight:4, movePoints: 3, attackPoints: 2, attack: "Spell", attackWidth: 1, attackRange: 1, power: 1, dmgType: "grope",
		terrainTags: {"secondhalf":2, "lastthird":1, "miniboss": -12, "open": 4}, floors:[0, 1, 2], shrines: ["Conjure"], dropTable: [{name: "RedKey", weight: 8}, {name: "BlueKey", weight: 1}]},
	{name: "Mummy", tags: ["leashing", "opendoors", "closedoors", "ranged", "witch", "elite", "mummyRestraints", "iceresist", "meleeweakness"], followRange: 1,
		spells: ["MummyBolt"], minSpellRange: 1.5, specialCD: 3, specialAttack: "Bind", spellCooldownMult: 1, spellCooldownMod: 5,
		AI: "hunt", visionRadius: 7, maxhp: 8, minLevel:5, weight:11, movePoints: 2, attackPoints: 1, attack: "SpellMeleeWill", attackWidth: 1, attackRange: 1, power: 3, fullBoundBonus: 3, dmgType: "crush",
		terrainTags: {"secondhalf":2, "lastthird":2, "open": 2}, floors:[11], shrines: ["Will"], dropTable: [{name: "Gold", amountMin: 30, amountMax: 60, weight: 11}, {name: "PotionStamina", weight: 1}, {name: "BlueKey", weight: 1}]},
	{name: "Cleric", tags: ["leashing", "opendoors", "closedoors", "ranged"], followRange: 4,
		AI: "guard", visionRadius: 7, maxhp: 8, minLevel:0, weight:8, movePoints: 1, attackPoints: 3, attack: "MeleeWillStun", attackWidth: 1, attackRange: 6, power: 3, fullBoundBonus: 1, dmgType: "crush", noCancelAttack: true,
		terrainTags: {"secondhalf":2, "lastthird":4, "passage": -99, "open": 4}, floors:[11], shrines: ["Will"], dropTable: [{name: "Gold", amountMin: 10, amountMax: 30, weight: 11}, {name: "PotionMana", weight: 1}, {name: "RedKey", weight: 1}]},
	{name: "MeleeCleric", tags: ["leashing", "opendoors", "closedoors", "melee", "kittyRestraints"], followRange: 1, blindSight: 4, specialCD: 3, specialAttack: "Bind",
		AI: "hunt", visionRadius: 6, maxhp: 8, minLevel:0, weight:10, movePoints: 2, attackPoints: 2, attack: "MeleeWill", attackWidth: 1, attackRange: 1, power: 3, fullBoundBonus: 1, dmgType: "grope",
		terrainTags: {"secondhalf":2, "lastthird":2}, floors:[11], shrines: ["Will"], dropTable: [{name: "Gold", amountMin: 10, amountMax: 30, weight: 11}, {name: "PotionStamina", weight: 1}, {name: "RedKey", weight: 1}]},

	{name: "Jailer", tags: ["leashing", "opendoors", "closedoors", "jailer", "minor", "shackleRestraints"], keys: true, followRange: 1, AI: "patrol", visionRadius: 7, maxhp: 12, minLevel: -1, weight:0, movePoints: 1, attackPoints: 2, attack: "MeleeBindLockAllWill", attackWidth: 1, attackRange: 1, power: 5, dmgType: "grope", fullBoundBonus: 3,
		terrainTags: {"jailer": 15}, floors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], dropTable: [{name: "Pick", weight: 10}, {name: "RedKey", weight: 7}, {name: "BlueKey", weight: 1}]},
	{name: "Guard", tags: ["leashing", "opendoors", "closedoors", "jailer", "minor", "shackleRestraints"], keys: true, followRange: 1, AI: "guard", visionRadius: 7, maxhp: 12, minLevel: -1, weight:0, movePoints: 1, attackPoints: 2, attack: "MeleeBindLockAllWill", attackWidth: 1, attackRange: 1, power: 5, dmgType: "grope", fullBoundBonus: 3,
		terrainTags: {}, floors:[], dropTable: [{name: "Pick", weight: 4}, {name: "RedKey", weight: 1}, {name: "Knife", weight: 2}]},
	{name: "Necromancer", tags: ["leashing", "opendoors", "closedoors", "witch", "ranged", "elite", "miniboss", "unflinching", "meleeweakness"], followRange: 1,
		spells: ["SummonSkeleton", "SummonSkeletons"], spellCooldownMult: 1, spellCooldownMod: 2,
		AI: "hunt", visionRadius: 10, maxhp: 20, minLevel: 1, weight:6, movePoints: 3, attackPoints: 3, attack: "MeleeLockAllWillSpell", attackWidth: 1, attackRange: 1, power: 5, dmgType: "grope",
		terrainTags: {"secondhalf":3, "lastthird":3, "miniboss": -100}, shrines: ["Will"], floors:[1, 2, 3, 11],
		dropTable: [{name: "Gold", amountMin: 100, amountMax: 150, weight: 4}, {name: "BlueKey", weight: 1}]},

];

let KinkyDungeonSpawnJailers = 0;
let KinkyDungeonSpawnJailersMax = 5;
let KinkyDungeonLeashedPlayer = 0;
let KinkyDungeonLeashingEnemy = null;
let KinkyDungeonDoorShutTimer = 6;

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
		let nearestDistance = !enemy.Enemy.allied ? pdist + 1 : 100000;

		for (let e of KinkyDungeonEntities) {
			if ((e.Enemy && e.Enemy.allied && (!enemy.Enemy || !enemy.Enemy.allied)) || (enemy.Enemy.allied && !e.Enemy.allied) || (enemy.rage && enemy != e)) {
				let dist = Math.sqrt((e.x - enemy.x)*(e.x - enemy.x)
					+ (e.y - enemy.y)*(e.y - enemy.y));
				if (dist <= nearestDistance) {
					if (KinkyDungeonCheckLOS(enemy, e, dist, enemy.Enemy.visionRadius, true)) {
						if (enemy.rage || !e.Enemy.lowpriority
								|| !KinkyDungeonCheckLOS(enemy, KinkyDungeonPlayerEntity, pdist, enemy.Enemy.visionRadius, true)
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

function KinkyDungeonGetEnemy(tags, Level, Index, Tile) {
	var enemyWeightTotal = 0;
	var enemyWeights = [];

	for (let L = 0; L < KinkyDungeonEnemies.length; L++) {
		var enemy = KinkyDungeonEnemies[L];
		let effLevel = Level;
		let weightMulti = 1.0;
		let weightBonus = 0;

		if (enemy.shrines) {
			for (let s = 0; s < enemy.shrines.length; s++) {
				if (KinkyDungeonGoddessRep[enemy.shrines[s]]) {
					let rep = KinkyDungeonGoddessRep[enemy.shrines[s]];
					if (rep > 0) weightMulti *= Math.max(0, 1.0/(rep/50));
					else if (rep < 0) {
						weightMulti *= Math.max(1, 1 + 1.0/(-rep/50));
						weightBonus += Math.min(10, -rep/8);
						effLevel += -rep/2;
					}
				}
			}
		}

		if (effLevel >= enemy.minLevel && enemy.floors.includes(Index) && (KinkyDungeonGroundTiles.includes(Tile) || !enemy.tags.includes("spawnFloorsOnly"))) {
			enemyWeights.push({enemy: enemy, weight: enemyWeightTotal});
			let weight = enemy.weight + weightBonus;
			if (enemy.terrainTags.increasingWeight)
				weight += enemy.terrainTags.increasingWeight * MiniGameKinkyDungeonCheckpoint;
			if (!enemy.terrainTags.grate && tags.includes("grate"))
				weight -= 1000;
			for (let T = 0; T < tags.length; T++)
				if (enemy.terrainTags[tags[T]]) weight += enemy.terrainTags[tags[T]];

			if (weight > 0)
				enemyWeightTotal += Math.max(0, weight*weightMulti);

		}
	}

	var selection = Math.random() * enemyWeightTotal;

	for (let L = enemyWeights.length - 1; L >= 0; L--) {
		if (selection > enemyWeights[L].weight) {
			return enemyWeights[L].enemy;
		}
	}
}

function KinkyDungeonDrawEnemies(canvasOffsetX, canvasOffsetY, CamX, CamY) {
	for (let E = 0; E < KinkyDungeonEntities.length; E++) {
		let enemy = KinkyDungeonEntities[E];
		let sprite = enemy.Enemy.name;
		KinkyDungeonUpdateVisualPosition(enemy, KinkyDungeonDrawDelta);
		let tx = enemy.visual_x;
		let ty = enemy.visual_y;
		let playerDist = Math.max(Math.abs(KinkyDungeonEntities[E].x - KinkyDungeonPlayerEntity.x), Math.abs(KinkyDungeonEntities[E].y - KinkyDungeonPlayerEntity.y));
		if (KinkyDungeonEntities[E].x >= CamX && KinkyDungeonEntities[E].y >= CamY && KinkyDungeonEntities[E].x < CamX + KinkyDungeonGridWidthDisplay && KinkyDungeonEntities[E].y < CamY + KinkyDungeonGridHeightDisplay) {
			if ((!enemy.Enemy.stealth || playerDist <= enemy.Enemy.stealth + 0.1) && !(KinkyDungeonGetBuffedStat(enemy.buffs, "Sneak") > 0)) {
				DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Enemies/" + sprite + ".png",
					KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
					(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay,
					KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);

				if (enemy.aware && enemy.vp > 0 && enemy.Enemy && enemy.Enemy.visionRadius > 1.6 && enemy.Enemy.movePoints < 90 && enemy.Enemy.AI != "ambush") {
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
			}
			if (enemy.freeze > 0) {
				DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/Freeze.png",
					KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
					(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay,
					KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
			}
		}
	}
}


function KinkyDungeonDrawEnemiesWarning(canvasOffsetX, canvasOffsetY, CamX, CamY) {
	for (let E = 0; E < KinkyDungeonEntities.length; E++) {
		var enemy = KinkyDungeonEntities[E];
		if (enemy.warningTiles) {
			for (let T=0; T<enemy.warningTiles.length; T++) {
				var tx = enemy.x + enemy.warningTiles[T].x;
				var ty = enemy.y + enemy.warningTiles[T].y;
				if (tx >= CamX && ty >= CamY && tx < CamX + KinkyDungeonGridWidthDisplay && ty < CamY + KinkyDungeonGridHeightDisplay && !(tx == enemy.x && ty == enemy.y) && KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(tx, ty))) {
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
	for (let E = 0; E < KinkyDungeonEntities.length; E++) {
		var enemy = KinkyDungeonEntities[E];
		let playerDist = Math.max(Math.abs(KinkyDungeonEntities[E].x - KinkyDungeonPlayerEntity.x), Math.abs(KinkyDungeonEntities[E].y - KinkyDungeonPlayerEntity.y));
		if ((!enemy.Enemy.stealth || playerDist <= enemy.Enemy.stealth + 0.1) && !(KinkyDungeonGetBuffedStat(enemy.buffs, "Sneak") > 0)
			&& (enemy.Enemy.allied || (enemy.hp < enemy.Enemy.maxhp && KinkyDungeonLightGet(enemy.x, enemy.y) > 0))) {
			let xx = enemy.visual_x ? enemy.visual_x : enemy.x;
			let yy = enemy.visual_y ? enemy.visual_y : enemy.y;
			KinkyDungeonBar(canvasOffsetX + (xx - CamX)*KinkyDungeonGridSizeDisplay, canvasOffsetY + (yy - CamY)*KinkyDungeonGridSizeDisplay,
				KinkyDungeonGridSizeDisplay, 12, enemy.hp / enemy.Enemy.maxhp * 100, enemy.Enemy.allied ? "#00ff88" : "#ff0000", enemy.Enemy.allied ? "#aa0000" : "#000000");
		}
	}
}

function KinkyDungeonEnemyCheckHP(enemy, E) {
	if (enemy.hp <= 0) {
		KinkyDungeonEntities.splice(E, 1);
		if (enemy == KinkyDungeonKilledEnemy && Math.max(3, enemy.Enemy.maxhp/4) >= KinkyDungeonActionMessagePriority) {

			KinkyDungeonActionMessageTime = 1;
			KinkyDungeonActionMessage = TextGet("Kill"+enemy.Enemy.name);
			KinkyDungeonActionMessageColor = "orange";
			KinkyDungeonActionMessagePriority = 1;

			KinkyDungeonKilledEnemy = null;
		}
		if (enemy.Enemy && enemy.Enemy.maxhp)
			KinkyDungeonChangeRep("Ghost", -Math.max(5, 0.05 * enemy.Enemy.maxhp));

		if (enemy.Enemy && enemy.Enemy.ondeath) {
			for (let o of enemy.Enemy.ondeath) {
				if (o.type == "summon") {
					KinkyDungeonSummonEnemy(enemy.x, enemy.y, o.enemy, o.count, o.range, o.strict);
				}
			}
		}
		KinkyDungeonItemDrop(enemy.x, enemy.y, enemy.Enemy.dropTable);
		return true;
	}
	return false;
}

function KinkyDungeonCheckLOS(enemy, player, distance, maxdistance, allowBlind) {
	let bs = (enemy && enemy.Enemy && enemy.Enemy.blindSight) ? enemy.Enemy.blindSight : 0;
	if (player.player && enemy.Enemy && enemy.Enemy.playerBlindSight) bs = enemy.Enemy.playerBlindSight;
	return distance <= maxdistance && ((allowBlind && bs >= distance) || KinkyDungeonCheckPath(enemy.x, enemy.y, player.x, player.y, allowBlind));
}

function KinkyDungeonTrackSneak(enemy, delta, player) {
	if (!enemy.vp) enemy.vp = 0;
	let sneakThreshold = enemy.Enemy.sneakThreshold ? enemy.Enemy.sneakThreshold : 2;
	if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Sneak")) sneakThreshold += KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Sneak");
	if (!player.player) return true;
	enemy.vp = Math.min(sneakThreshold * 2, enemy.vp + delta);
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

let KinkyDungeonDamageTaken = false;

function KinkyDungeonUpdateEnemies(delta) {
	if (KinkyDungeonLeashedPlayer > 0) {
		KinkyDungeonLeashedPlayer -= 1;

		let xx = KinkyDungeonStartPosition.x + KinkyDungeonJailLeashX;
		let yy = KinkyDungeonStartPosition.y;
		if (KinkyDungeonTiles[(xx-1) + "," + yy] && KinkyDungeonTiles[(xx-1) + "," + yy].Type == "Door") {
			KinkyDungeonTiles[(xx-1) + "," + yy].Lock = undefined;
		}
	}
	KinkyDungeonUpdateFlags(delta);
	for (let E = 0; E < KinkyDungeonEntities.length; E++) {
		let enemy = KinkyDungeonEntities[E];
		let player = KinkyDungeonNearestPlayer(enemy, false, true);

		// Delete the enemy
		if (KinkyDungeonEnemyCheckHP(enemy, E)) { E -= 1; continue;}

		if (!enemy.castCooldown) enemy.castCooldown = 0;
		if (enemy.castCooldown > 0) enemy.castCooldown = Math.max(0, enemy.castCooldown-delta);

		let idle = true;
		let moved = false;
		let ignore = false;
		let followRange = enemy.Enemy.followRange;
		let chaseRadius = Math.max(enemy.Enemy.visionRange * 2, enemy.Enemy.blindSight * 2);
		let ignoreLocks = enemy.Enemy.keys;

		// Check if the enemy ignores the player
		if (player.player) {
			if (enemy.Enemy.tags.includes("ignorenoSP") && !KinkyDungeonHasStamina(1.1)) ignore = true;
			if (enemy.Enemy.tags.includes("ignoreharmless") && (!enemy.warningTiles || enemy.warningTiles.length == 0)
				&& (KinkyDungeonPlayerDamage.dmg <= enemy.Enemy.armor || !KinkyDungeonHasStamina(1.1)) && !KinkyDungeonPlayer.CanTalk() && !KinkyDungeonPlayer.CanInteract() && KinkyDungeonSlowLevel > 1
				&& (!enemy.Enemy.ignorechance || Math.random() < enemy.Enemy.ignorechance || !KinkyDungeonHasStamina(1.1))) ignore = true;
			if (enemy.Enemy.tags.includes("ignoretiedup") && (!enemy.warningTiles || enemy.warningTiles.length == 0)
				&& !KinkyDungeonPlayer.CanInteract() && !KinkyDungeonPlayer.CanTalk() && !KinkyDungeonPlayer.CanInteract() && KinkyDungeonSlowLevel > 1
				&& (!enemy.Enemy.ignorechance || Math.random() < enemy.Enemy.ignorechance || !KinkyDungeonHasStamina(1.1))) ignore = true;
			if (enemy.Enemy.tags.includes("ignoreboundhands") && (!enemy.warningTiles || enemy.warningTiles.length == 0)
				&& (KinkyDungeonPlayerDamage.dmg <= enemy.Enemy.armor || !KinkyDungeonHasStamina(1.1)) && !KinkyDungeonPlayer.CanInteract()
				&& (!enemy.Enemy.ignorechance || Math.random() < enemy.Enemy.ignorechance || !KinkyDungeonHasStamina(1.1))) ignore = true;
			if (enemy.Enemy.ignoreflag) {
				for (let f of enemy.Enemy.ignoreflag) {
					if (KinkyDungeonFlags[f]) ignore = true;
				}
			}
			if (enemy.Enemy.tags.includes("jailer") && !KinkyDungeonJailTransgressed) ignore = true;
		}

		let MovableTiles = KinkyDungeonMovableTilesEnemy;
		let AvoidTiles = "g";
		if (enemy.Enemy.tags && enemy.Enemy.tags.includes("opendoors")) MovableTiles = KinkyDungeonMovableTilesSmartEnemy;
		if (enemy.Enemy.ethereal) {
			AvoidTiles = "";
			MovableTiles = MovableTiles + "1X";
		}



		if (enemy.Enemy.specialCharges && enemy.specialCharges <= 0) enemy.specialCD = 999;
		if (enemy.specialCD > 0)
			enemy.specialCD -= delta;
		if (enemy.slow > 0)
			enemy.slow -= delta;
		if (enemy.bind > 0)
			enemy.bind -= delta;
		if (enemy.stun > 0 || enemy.freeze > 0) {
			if (enemy.stun > 0) enemy.stun -= delta;
			if (enemy.freeze > 0) enemy.freeze -= delta;
		} else {
			let attack = enemy.Enemy.attack;
			let usingSpecial = false;
			let range = enemy.Enemy.attackRange;
			let width = enemy.Enemy.attackWidth;


			if (enemy.Enemy.tags && enemy.Enemy.tags.includes("leashing") && !KinkyDungeonHasStamina(1.1)) {
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
			}

			if (!enemy.Enemy.attackWhileMoving && range > followRange) {
				followRange = range;
			}
			if (player.player && enemy.Enemy && enemy.Enemy.playerFollowRange) followRange = enemy.Enemy.playerFollowRange;

			var AI = enemy.Enemy.AI;
			if (!enemy.warningTiles) enemy.warningTiles = [];
			let canSensePlayer = KinkyDungeonCheckLOS(enemy, player, playerDist, enemy.Enemy.visionRadius, true);
			let canSeePlayer = KinkyDungeonCheckLOS(enemy, player, playerDist, enemy.Enemy.visionRadius, false);

			if (canSeePlayer && enemy.Enemy.tags.includes("jailer") && (KinkyDungeonPlayer.CanInteract() || (Math.abs(player.x - KinkyDungeonStartPosition.x) >= KinkyDungeonJailLeashX - 1 || Math.abs(player.y - KinkyDungeonStartPosition.y) > KinkyDungeonJailLeash))) {
				KinkyDungeonJailTransgressed = true;
				ignore = false;
			}

			if ((canSensePlayer || canSeePlayer) && KinkyDungeonTrackSneak(enemy, delta, player)) enemy.aware = true;

			let kite = false;
			if (canSeePlayer && enemy.Enemy && enemy.Enemy.kite && !usingSpecial && (enemy.attackPoints <= 0 || enemy.Enemy.attackWhileMoving) && playerDist <= enemy.Enemy.kite && (!enemy.Enemy.allied || !player.player)) {
				kite = true;
			}

			if (AI == "wander") {
				idle = true;
				if (ignore || !KinkyDungeonCheckLOS(enemy, player, playerDist, followRange + 0.5, true || kite))
					for (let T = 0; T < 8; T++) { // try 8 times
						let dir = KinkyDungeonGetDirection(10*(Math.random()-0.5), 10*(Math.random()-0.5));
						if (MovableTiles.includes(KinkyDungeonMapGet(enemy.x + dir.x, enemy.y + dir.y)) && (T > 5 || !AvoidTiles.includes(KinkyDungeonMapGet(enemy.x + dir.x, enemy.y + dir.y))) && KinkyDungeonNoEnemy(enemy.x + dir.x, enemy.y + dir.y, true)) {
							if (KinkyDungeonEnemyTryMove(enemy, dir, delta, enemy.x + dir.x, enemy.y + dir.y)) moved = true;
							idle = false;
							break;
						}
					}
			} else if ((AI == "guard" || AI == "patrol" || (AI == "ambush" && !enemy.ambushtrigger)) && (enemy.Enemy.attackWhileMoving || ignore || !KinkyDungeonCheckLOS(enemy, player, playerDist, followRange + 0.5, true) || kite)) {
				if (!enemy.gx) enemy.gx = enemy.x;
				if (!enemy.gy) enemy.gy = enemy.y;

				idle = true;
				let patrolChange = false;

				// try 12 times to find a moveable tile, with some random variance
				if (!ignore && (playerDist <= enemy.Enemy.visionRadius || (enemy.aware && playerDist <= chaseRadius*2)) && AI != "ambush" && (enemy.aware || canSensePlayer)) {
					if (!enemy.aware) enemy.path = undefined;
					enemy.aware = true;
					for (let T = 0; T < 12; T++) {
						let dir = kite ? KinkyDungeonGetDirectionRandom(enemy.x - player.x, enemy.y - player.y) : KinkyDungeonGetDirectionRandom(player.x - enemy.x, player.y - enemy.y);
						let splice = false;
						if (T > 2 && T < 8) dir = KinkyDungeonGetDirectionRandom(dir.x * 10, dir.y * 10); // Fan out a bit
						if (T >= 8 || enemy.path || !canSeePlayer) {
							if (!enemy.path && (KinkyDungeonAlert || enemy.aware || canSeePlayer))
								enemy.path = KinkyDungeonFindPath(enemy.x, enemy.y, player.x, player.y, true, false, ignoreLocks, MovableTiles); // Give up and pathfind
							if (enemy.path && enemy.path.length > 0) {
								dir = {x: enemy.path[0].x - enemy.x, y: enemy.path[0].y - enemy.y, delta: 1};
								if (!KinkyDungeonNoEnemy(enemy.x + dir.x, enemy.y + dir.y, false)) enemy.path = undefined;
								splice = true;
							} else {
								enemy.path = undefined;
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
								if (!KinkyDungeonNoEnemy(enemy.x + dir.x, enemy.y + dir.y, false)) enemy.path = undefined;
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
				} else patrolChange = true;

				if (AI == "patrol") {
					let patrolChance = patrolChange ? 0.2 : 0.02;
					if (!enemy.patrolIndex) enemy.patrolIndex = KinkyDungeonNearestPatrolPoint(enemy.x, enemy.y);
					if (KinkyDungeonPatrolPoints[enemy.patrolIndex] && Math.random() < patrolChance) {
						if (enemy.patrolIndex < KinkyDungeonPatrolPoints.length - 1) enemy.patrolIndex += 1;
						else enemy.patrolIndex = 0;

						let newPoint = KinkyDungeonGetPatrolPoint(enemy.patrolIndex, 1.4, MovableTiles);
						enemy.gx = newPoint.x;
						enemy.gy = newPoint.y;
					}

				}

			} else if ((AI == "hunt" || (AI == "ambush" && enemy.ambushtrigger)) && (enemy.Enemy.attackWhileMoving || ignore || !KinkyDungeonCheckLOS(enemy, player, playerDist, followRange + 0.5, true) || kite)) {

				idle = true;
				// try 12 times to find a moveable tile, with some random variance
				if (!ignore && (playerDist <= enemy.Enemy.visionRadius || (enemy.aware && playerDist <= chaseRadius*2)) && (enemy.aware || canSensePlayer)) {
					if (!enemy.aware) enemy.path = undefined;
					enemy.aware = true;
					for (let T = 0; T < 12; T++) {
						let dir = kite ? KinkyDungeonGetDirectionRandom(enemy.x - player.x, enemy.y - player.y) : KinkyDungeonGetDirectionRandom(player.x - enemy.x, player.y - enemy.y);
						let splice = false;
						if (T > 2 && T < 8) dir = KinkyDungeonGetDirectionRandom(dir.x * 10, dir.y * 10); // Fan out a bit
						if (T >= 8 || enemy.path || !canSeePlayer) {
							if (!enemy.path && (KinkyDungeonAlert || enemy.aware || canSeePlayer))
								enemy.path = KinkyDungeonFindPath(enemy.x, enemy.y, player.x, player.y, true, false, ignoreLocks, MovableTiles); // Give up and pathfind
							if (enemy.path && enemy.path.length > 0) {
								dir = {x: enemy.path[0].x - enemy.x, y: enemy.path[0].y - enemy.y, delta: 1};
								if (!KinkyDungeonNoEnemy(enemy.x + dir.x, enemy.y + dir.y, false)) enemy.path = undefined;
								splice = true;
							} else {
								enemy.path = undefined;
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
				} else {
					if (enemy.aware) enemy.path = undefined;
					enemy.aware = false;
					for (let T = 0; T < 8; T++) { // try 8 times
						let dir = KinkyDungeonGetDirection(10*(Math.random()-0.5), 10*(Math.random()-0.5));
						if (KinkyDungeonEnemyCanMove(enemy, dir, MovableTiles, AvoidTiles, ignoreLocks, T)) {
							if (KinkyDungeonEnemyTryMove(enemy, dir, delta, enemy.x + dir.x, enemy.y + dir.y)) moved = true;
							idle = false;
							break;
						}
					}
				}
			}

			playerDist = Math.sqrt((enemy.x - player.x)*(enemy.x - player.x) + (enemy.y - player.y)*(enemy.y - player.y));
			if ((!enemy.Enemy.allied || (!player.player && (!player.Enemy || !player.Enemy.allied))) && ((enemy.aware && KinkyDungeonTrackSneak(enemy, 0, player)) || playerDist < Math.max(1.5, enemy.Enemy.blindSight))
				&& (AI != "ambush" || enemy.ambushtrigger) && !ignore && (!moved || enemy.Enemy.attackWhileMoving)
				&& (attack.includes("Melee") || (enemy.Enemy.tags && enemy.Enemy.tags.includes("leashing") && !KinkyDungeonHasStamina(1.1)))
				&& KinkyDungeonCheckLOS(enemy, player, playerDist, range + 0.5, true)) {//Player is adjacent
				idle = false;

				let dir = KinkyDungeonGetDirection(player.x - enemy.x, player.y - enemy.y);

				let attackTiles = enemy.warningTiles ? enemy.warningTiles : [dir];

				if (!KinkyDungeonEnemyTryAttack(enemy, player, attackTiles, delta, enemy.x + dir.x, enemy.y + dir.y, (usingSpecial && enemy.Enemy.specialAttackPoints) ? enemy.Enemy.specialAttackPoints : enemy.Enemy.attackPoints)) {
					if (enemy.warningTiles.length == 0) {
						enemy.warningTiles = KinkyDungeonGetWarningTiles(player.x - enemy.x, player.y - enemy.y, range, width);
						if (enemy.Enemy.specialRange && usingSpecial && enemy.Enemy.specialCDonAttack) {
							enemy.specialCD = enemy.Enemy.specialCD;
						}
						if (enemy.Enemy.specialWidth && usingSpecial && enemy.Enemy.specialCDonAttack) {
							enemy.specialCD = enemy.Enemy.specialCD;
						}
					}

					let playerEvasion = (player.player) ? KinkyDungeonMultiplicativeStat(KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Evasion"))
						: KinkyDungeonMultiplicativeStat(((player.Enemy && player.Enemy.evasion) ? player.Enemy.evasion : 0)) * KinkyDungeonMultiplicativeStat(KinkyDungeonGetBuffedStat(player.buffs, "Evasion"));
					if (attack.includes("Bind") && Math.random() <= playerEvasion) {
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
									roll = Math.max(roll, Math.random());
								}
								if (roll > KinkyDungeonTorsoGrabChance) {
									KinkyDungeonMovePoints = -1;

									if (!KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonTorsoGrab").replace("EnemyName", TextGet("Name" + enemy.Enemy.name)), "yellow", 1))
										KinkyDungeonSendActionMessage(1, TextGet("KinkyDungeonTorsoGrab").replace("EnemyName", TextGet("Name" + enemy.Enemy.name)), "yellow", 1);
								}
							}
						}
					}
				} else { // Attack lands!
					let hit = ((usingSpecial && enemy.Enemy.specialAttackPoints) ? enemy.Enemy.specialAttackPoints : enemy.Enemy.attackPoints) <= 1;
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
						} else if (attack.includes("Bind")) {
							let numTimes = 1;
							if (enemy.Enemy.multiBind) numTimes = enemy.Enemy.multiBind;
							for (let times = 0; times < numTimes; times++) {
								// Note that higher power enemies get a bonus to the floor restraints appear on
								let rest = KinkyDungeonGetRestraint(enemy.Enemy, MiniGameKinkyDungeonCheckpoint + enemy.Enemy.power, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
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

						if (attack.includes("Suicide") && (!enemy.Enemy.suicideOnAdd || addedRestraint)) {
							enemy.hp = 0;
						}
						if (player.player && playerDist < range + 0.5 && (enemy.Enemy.tags && enemy.Enemy.tags.includes("leashing") || attack.includes("Pull")) && (KinkyDungeonLeashedPlayer < 1 || KinkyDungeonLeashingEnemy == enemy)) {
							let leashed = attack.includes("Pull");
							if (!leashed)
								for (let restraint of KinkyDungeonRestraintList()) {
									if (restraint.restraint && restraint.restraint.leash) {
										leashed = true;
										break;
									}
								}
							if (leashed) {
								let leashPos = KinkyDungeonStartPosition;
								let findMaster = undefined;
								if (enemy.Enemy.pullTowardSelf) {
									findMaster = enemy;
									if (findMaster) leashPos = {x: findMaster.x, y: findMaster.y};
								} else {
									if (attack.includes("Pull") && enemy.Enemy.master) {
										let masterDist = 1000;
										for (let e of KinkyDungeonEntities) {
											if (e.Enemy.name == enemy.Enemy.master.type && Math.sqrt((e.x - enemy.x) * (e.x - enemy.x) + (e.y - enemy.y)*(e.y - enemy.y)) < masterDist) {
												masterDist = Math.sqrt((e.x - enemy.x) * (e.x - enemy.x) + (e.y - enemy.y)*(e.y - enemy.y));
												findMaster = e;
											}
										}
										if (findMaster) leashPos = {x: findMaster.x, y: findMaster.y};
									}
								}
								if (leashPos == KinkyDungeonStartPosition && !KinkyDungeonHasStamina(1.1) && Math.abs(KinkyDungeonPlayerEntity.x - leashPos.x) <= 1 && Math.abs(KinkyDungeonPlayerEntity.y - leashPos.y) <= 1) {
									KinkyDungeonDefeat();
									KinkyDungeonLeashedPlayer = 3 + enemy.Enemy.attackPoints * 2;
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
											if (!enemySwap || !enemySwap.Enemy.noDisplace) {
												KinkyDungeonLeashedPlayer = 3 + enemy.Enemy.attackPoints * 2;
												KinkyDungeonLeashingEnemy = enemy;
												if (enemySwap) {
													enemySwap.x = KinkyDungeonPlayerEntity.x;
													enemySwap.y = KinkyDungeonPlayerEntity.y;
												}
												KinkyDungeonPlayerEntity.x = enemy.x;
												KinkyDungeonPlayerEntity.y = enemy.y;
												enemy.x = leashPoint.x;
												enemy.y = leashPoint.y;
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
											let leashPoint = path[Math.min(Math.max(0,path.length-2), pullDist)];
											if (!KinkyDungeonEnemyAt(leashPoint.x, leashPoint.y)) {
												KinkyDungeonLeashedPlayer = 3 + enemy.Enemy.attackPoints * 2;
												KinkyDungeonLeashingEnemy = enemy;
												KinkyDungeonPlayerEntity.x = leashPoint.x;
												KinkyDungeonPlayerEntity.y = leashPoint.y;
												if (!KinkyDungeonSendTextMessage(8, TextGet("KinkyDungeonLeashGrab").replace("EnemyName", TextGet("Name" + enemy.Enemy.name)), "yellow", 1))
													KinkyDungeonSendActionMessage(3, TextGet("KinkyDungeonLeashGrab").replace("EnemyName", TextGet("Name" + enemy.Enemy.name)), "yellow", 1);
											}
										}
									}
								}
							}
						}
						if (attack.includes("Will") || willpowerDamage > 0) {
							if (willpowerDamage == 0)
								willpowerDamage += enemy.Enemy.power;
							let buffdmg = KinkyDungeonGetBuffedStat(enemy.buffs, "AttackDmg");
							if (buffdmg) willpowerDamage = Math.max(0, willpowerDamage + buffdmg);
							replace.push({keyword:"DamageTaken", value: willpowerDamage});
							msgColor = "#ff8888";
							if (usingSpecial && willpowerDamage > 0 && enemy.Enemy.specialAttack && enemy.Enemy.specialAttack.includes("Will")) enemy.specialCD = enemy.Enemy.specialCD;
						}
						var happened = 0;
						var bound = 0;
						if (player.player) {
							happened += KinkyDungeonDealDamage({damage: willpowerDamage, type: enemy.Enemy.dmgType});
							for (let r of restraintAdd) {
								bound += KinkyDungeonAddRestraint(r, enemy.Enemy.power) * 2;
							}
							if (attack.includes("Slow")) {
								KinkyDungeonMovePoints = Math.max(KinkyDungeonMovePoints - 2, -1);
								if (usingSpecial && enemy.Enemy.specialAttack && enemy.Enemy.specialAttack.includes("Slow")) enemy.specialCD = enemy.Enemy.specialCD;
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
						} else if (Math.random() <= playerEvasion) {
							let dmg = enemy.Enemy.power;
							let buffdmg = KinkyDungeonGetBuffedStat(enemy.buffs, "AttackDmg");
							if (buffdmg) dmg = Math.max(0, dmg + buffdmg);
							if (enemy.Enemy.fullBoundBonus) {
								dmg += enemy.Enemy.fullBoundBonus; // Some enemies deal bonus damage if they cannot put a binding on you
							}
							happened += KinkyDungeonDamageEnemy(player, {type: enemy.Enemy.damage, damage: dmg}, false, true);
							if (happened > 0) {
								let sfx = (hitsfx) ? hitsfx : "DealDamage";
								KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + sfx + ".ogg");
							}
						} else {
							let sfx = (enemy.Enemy && enemy.Enemy.misssfx) ? enemy.Enemy.misssfx : "Miss";
							KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + sfx + ".ogg");
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

							let sfx = (hitsfx) ? hitsfx : "Damage";
							KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + sfx + ".ogg");
							KinkyDungeonSendTextMessage(happened+priorityBonus, TextGet("Attack"+enemy.Enemy.name + suffix), msgColor, 1);
							if (replace)
								for (let R = 0; R < replace.length; R++)
									KinkyDungeonTextMessage = KinkyDungeonTextMessage.replace(replace[R].keyword, "" + replace[R].value);
						}
					}


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


			if ((!enemy.Enemy.allied || (!player.player && (!player.Enemy || !player.Enemy.allied))) && ((enemy.aware && KinkyDungeonTrackSneak(enemy, 0, player)) || playerDist < Math.max(1.5, enemy.Enemy.blindSight))
				&& !ignore && (!moved || enemy.Enemy.castWhileMoving) && enemy.Enemy.attack.includes("Spell") && KinkyDungeonCheckLOS(enemy, player, playerDist, enemy.Enemy.visionRadius, false) && enemy.castCooldown <= 0
				&& (!enemy.Enemy.minSpellRange || (playerDist > enemy.Enemy.minSpellRange))) {
				idle = false;
				let spellchoice = null;
				let spell = null;

				for (let tries = 0; tries < 5; tries++) {
					spellchoice = enemy.Enemy.spells[Math.floor(Math.random()*enemy.Enemy.spells.length)];
					spell = KinkyDungeonFindSpell(spellchoice, true);
					if ((!spell.castRange && playerDist > spell.range) || (spell.castRange && playerDist > spell.castRange)) spell = null;
					else break;
				}

				if (spell) {
					enemy.castCooldown = spell.manacost*enemy.Enemy.spellCooldownMult + enemy.Enemy.spellCooldownMod + 1;
					if (KinkyDungeonCastSpell(player.x, player.y, spell, enemy, player) && spell.sfx) {
						KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + spell.sfx + ".ogg");
					}

					//console.log("casted "+ spell.name);
				}
			}
		}

		if (idle) {
			enemy.movePoints = 0;
			enemy.attackPoints = 0;
			enemy.warningTiles = [];
		}

		if (enemy.vp > 0 && !enemy.path) enemy.vp = Math.max(0, enemy.vp - 0.1);

		// Delete the enemy
		if (KinkyDungeonEnemyCheckHP(enemy, E)) { E -= 1;}
		if (enemy.Enemy.regen) enemy.hp = Math.min(enemy.Enemy.maxhp, enemy.hp + enemy.Enemy.regen * delta);
		if (enemy.Enemy.lifespan || enemy.lifetime != undefined) {
			if (enemy.lifetime == undefined) enemy.lifetime = enemy.Enemy.lifespan;
			enemy.lifetime -= delta;
			if (enemy.lifetime <= 0) enemy.hp = 0;
		}
	}
	KinkyDungeonAlert = 0;

	KinkyDungeonHandleJailSpawns();
}

let KinkyDungeonJailGuard = undefined;
let KinkyDungeonGuardTimer = 0;
let KinkyDungeonGuardTimerMax = 22;
let KinkyDungeonGuardSpawnTimer = 0;
let KinkyDungeonGuardSpawnTimerMax = 74;
let KinkyDungeonGuardSpawnTimerMin = 52;
let KinkyDungeonMaxPrisonReduction = 10;
let KinkyDungeonPrisonReduction = 0;

function KinkyDungeonHandleJailSpawns() {
	let xx = KinkyDungeonStartPosition.x + KinkyDungeonJailLeashX;
	let yy = KinkyDungeonStartPosition.y;
	let playerInCell = (Math.abs(KinkyDungeonPlayerEntity.x - KinkyDungeonStartPosition.x) < KinkyDungeonJailLeashX - 1 && Math.abs(KinkyDungeonPlayerEntity.y - KinkyDungeonStartPosition.y) <= KinkyDungeonJailLeash);
	if (KinkyDungeonSpawnJailers + 1 == KinkyDungeonSpawnJailersMax && (KinkyDungeonGuardSpawnTimer == 1 || KinkyDungeonSleepTurns == 3) && !KinkyDungeonJailGuard && playerInCell) {
		KinkyDungeonGuardSpawnTimer = KinkyDungeonGuardSpawnTimerMin + Math.floor(Math.random() * (KinkyDungeonGuardSpawnTimerMax - KinkyDungeonGuardSpawnTimerMin));
		let Enemy = KinkyDungeonEnemies.find(element => element.name == "Guard");
		let guard = {summoned: true, Enemy: Enemy,
			x:xx, y:yy, gx: xx - 2, gy: yy,
			hp: (Enemy && Enemy.startinghp) ? Enemy.startinghp : Enemy.maxhp, movePoints: 0, attackPoints: 0};


		if (KinkyDungeonTiles[(xx-1) + "," + yy] && KinkyDungeonTiles[(xx-1) + "," + yy].Type == "Door") {
			KinkyDungeonTiles[(xx-1) + "," + yy].Lock = undefined;
		}
		KinkyDungeonJailGuard = guard;
		KinkyDungeonEntities.push(guard);
		KinkyDungeonSendTextMessage(10, TextGet("KinkyDungeonGuardAppear"), "white", 6);

		KinkyDungeonGuardTimer = KinkyDungeonGuardTimerMax;
	} else if (KinkyDungeonGuardSpawnTimer > 0) KinkyDungeonGuardSpawnTimer -= 1;
	if (KinkyDungeonJailGuard && KinkyDungeonGuardTimer > 0 && KinkyDungeonGuardTimerMax - KinkyDungeonGuardTimer > 6 && Math.random() < 0.2) {
		if (Math.random() < 0.5)
			KinkyDungeonJailGuard.gy = yy + Math.round(Math.random() * KinkyDungeonJailLeash * 2 - KinkyDungeonJailLeash);
		else
			KinkyDungeonJailGuard.gy = KinkyDungeonPlayerEntity.y;
	}

	if (KinkyDungeonGuardTimer > 0) {
		KinkyDungeonGuardTimer -= 1;
		if (KinkyDungeonGuardTimer <= 0) {
			KinkyDungeonJailGuard.gx = xx;
			KinkyDungeonJailGuard.gy = yy;
		}
	} else {
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
				KinkyDungeonChangeRep("Ghost", 1);
			}
		}
	}

	if (!KinkyDungeonJailGuard) {
		KinkyDungeonGuardTimer = 0;
	}
	if (!KinkyDungeonEntities.includes(KinkyDungeonJailGuard)) KinkyDungeonJailGuard = undefined;
}

function KinkyDungeonNoEnemy(x, y, Player) {

	if (KinkyDungeonEnemyAt(x, y)) return false;
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

		if (KinkyDungeonMapGet(enemy.x, enemy.y) == 'd' && enemy.Enemy && enemy.Enemy.tags.includes("closedoors") && Math.random() < 0.8 && dist > 5) {
			KinkyDungeonMapSet(enemy.x, enemy.y, 'D');
			if (dist < 10) {
				KinkyDungeonSendTextMessage(4, TextGet("KinkyDungeonHearDoorCloseNear"), "#dddddd", 4);
			} else if (dist < 20)
				KinkyDungeonSendTextMessage(2, TextGet("KinkyDungeonHearDoorCloseFar"), "#999999", 4);
		}

		enemy.x += Direction.x;
		enemy.y += Direction.y;

		if (KinkyDungeonMapGet(x, y) == 'D' && enemy.Enemy && enemy.Enemy.tags.includes("opendoors")) {
			KinkyDungeonMapSet(x, y, 'd');
			if (KinkyDungeonTiles[x + ',' +y] && KinkyDungeonTiles[x + ',' +y].Type == "Door")
				KinkyDungeonTiles[x + ',' +y].Lock = undefined;
			if (dist < 5) {
				KinkyDungeonSendTextMessage(4, TextGet("KinkyDungeonHearDoorOpenNear"), "#dddddd", 4);
			} else if (dist < 15)
				KinkyDungeonSendTextMessage(2, TextGet("KinkyDungeonHearDoorOpenFar"), "#999999", 4);
		}

		return true;
	}
	return false;
}

function KinkyDungeonEnemyTryAttack(enemy, player, Tiles, delta, x, y, points, replace, msgColor) {
	enemy.attackPoints += delta;

	if (enemy.attackPoints >= points) {
		enemy.attackPoints = 0;
		if (points > 1)
			for (let T = 0; T < Tiles.length; T++) {
				let ax = enemy.x + Tiles[T].x;
				let ay = enemy.y + Tiles[T].y;

				if (player.x == ax && player.y == ay) {
					return true;
				}
			}
		else return true;
		enemy.warningTiles = [];
	} else if (!enemy.Enemy.noCancelAttack) { // Verify player is in warningtiles and reset otherwise
		let playerIn = false;
		for (let T = 0; T < Tiles.length; T++) {
			let ax = enemy.x + Tiles[T].x;
			let ay = enemy.y + Tiles[T].y;

			if (player.x == ax && player.y == ay) {
				playerIn = true;
				break;
			}
		}
		if (!playerIn) {
			enemy.attackPoints = 0;
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


function KinkyDungeonGetWarningTiles(dx, dy, range, width) {
	if (range == 1 && width == 8) return KinkyDungeonGetWarningTilesAdj();

	var arr = [];
	var cone = 0.78539816 * (width-0.9)/2;
	var angle_player = Math.atan2(dx, dy) + ((width % 2 == 0) ? ((Math.random() > 0.5) ? -0.39269908 : 39269908) : 0);
	if (angle_player > Math.PI) angle_player -= Math.PI;
	if (angle_player < -Math.PI) angle_player += Math.PI;

	for (let X = -range; X <= range; X++)
		for (let Y = -range; Y <= range; Y++) {
			var angle = Math.atan2(X, Y);

			var angleDiff = angle - angle_player;
			angleDiff += (angleDiff>Math.PI) ? -2*Math.PI : (angleDiff<-Math.PI) ? 2*Math.PI : 0;

			if (Math.abs(angleDiff) < cone + 0.15 && Math.sqrt(X*X + Y*Y) < range + 0.5) arr.push({x:X, y:Y});
		}

	return arr;
}


function KinkyDungeonDefeat() {
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

	MiniGameKinkyDungeonLevel = Math.floor(MiniGameKinkyDungeonLevel/10)*10;
	KinkyDungeonSendTextMessage(10, TextGet("KinkyDungeonLeashed"), "#ff0000", 3);
	let params = KinkyDungeonMapParams[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]];
	KinkyDungeonSpawnJailers = KinkyDungeonSpawnJailersMax;
	KinkyDungeonCreateMap(params, MiniGameKinkyDungeonLevel);

	KinkyDungeonSetDress(params.defeat_outfit);
	KinkyDungeonDressPlayer();
	for (let r of params.defeat_restraints) {
		let level = 0;
		if (KinkyDungeonGoddessRep.Prisoner) level = Math.max(0, KinkyDungeonGoddessRep.Prisoner + 50);
		if (!r.Level || level >= r.Level)
			KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName(r.Name), 0, true);
	}
	KinkyDungeonSetDress(params.defeat_outfit);
	KinkyDungeonRedKeys = 0;
	KinkyDungeonBlueKeys = 0;
	KinkyDungeonLockpicks = Math.min(Math.max(0, Math.round(3 * (1 - (KinkyDungeonGoddessRep.Prisoner + 50)/100))), KinkyDungeonLockpicks);
	KinkyDungeonNormalBlades = 0;

	let newInv = KinkyDungeonRestraintList();
	KinkyDungeonInventory = newInv;
	KinkyDungeonInventoryAddWeapon("Knife");

	KinkyDungeonChangeRep("Ghost", 1 + Math.round(KinkyDungeonSpawnJailers/2));
	KinkyDungeonChangeRep("Prisoner", securityBoost); // Each time you get caught, security increases...

	KinkyDungeonDressPlayer();
	AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/StoneDoor_Close.ogg");
}

function KinkyDungeonEnemyCanMove(enemy, dir, MovableTiles, AvoidTiles, ignoreLocks, Tries) {
	let master = enemy.Enemy.master;
	let xx = enemy.x + dir.x;
	let yy = enemy.y + dir.y;
	if (master) {
		let findMaster = undefined;
		let masterDist = 1000;
		for (let e of KinkyDungeonEntities) {
			if (e.Enemy.name == master.type && Math.sqrt((e.x - enemy.x) * (e.x - enemy.x) + (e.y - enemy.y)*(e.y - enemy.y)) < masterDist) {
				masterDist = Math.sqrt((e.x - enemy.x) * (e.x - enemy.x) + (e.y - enemy.y)*(e.y - enemy.y));
				findMaster = e;
			}
		}
		if (findMaster) {
			if (Math.sqrt((xx - findMaster.x) * (xx - findMaster.x) + (yy - findMaster.y) * (yy - findMaster.y)) > master.range
				&& Math.sqrt((xx - findMaster.x) * (xx - findMaster.x) + (yy - findMaster.y) * (yy - findMaster.y)) > masterDist) return false;
		}
	}
	return MovableTiles.includes(KinkyDungeonMapGet(xx, yy)) && ((Tries && Tries > 5) || !AvoidTiles.includes(KinkyDungeonMapGet(enemy.x + dir.x, enemy.y + dir.y)))
		&& (ignoreLocks || !KinkyDungeonTiles[(xx) + "," + (yy)] || !KinkyDungeonTiles[(xx) + "," + (yy)].Lock)
		&& KinkyDungeonNoEnemy(xx, yy, true);
}