"use strict";

/**
 * @type {Record<string, weapon>}
 */
let KinkyDungeonWeapons = {
	"Knife": {name: "Knife", dmg: 2.5, chance: 0.9, type: "unarmed", unarmed: false, rarity: 0, shop: false, noequip: true, sfx: "Unarmed"},
	"Sword": {name: "Sword", dmg: 3, chance: 1.5, staminacost: 1.0, type: "slash", unarmed: false, rarity: 2, shop: true, cutBonus: 0.1, sfx: "LightSwing"},
	"Flamberge": {name: "Flamberge", dmg: 2.0, chance: 1.0, staminacost: 1.25, type: "slash", unarmed: false, rarity: 3, shop: true, cutBonus: 0.15, sfx: "FireSpell",
		events: [{type: "ElementalEffect", trigger: "playerAttack", power: 2.0, damage: "fire"}]},
	"Feather": {name: "Feather", dmg: 1, chance: 2.0, staminacost: 0.25, type: "tickle", unarmed: false, rarity: 1, shop: true, sfx: "Tickle"},
	"IceCube": {name: "IceCube", dmg: 1, chance: 1.0, staminacost: 0.5, type: "ice", tease: true, unarmed: false, rarity: 1, shop: true, sfx: "Freeze",
		events: [{type: "ElementalEffect", trigger: "playerAttack", power: 0, damage: "ice", time: 3, chance: 0.1}]},
	"Rope": {name: "Rope", dmg: 0.5, bind: 4, chance: 1.0, staminacost: 0.25, type: "chain", unarmed: false, rarity: 1, shop: true, sfx: "Struggle"},
	"VibeWand": {name: "VibeWand", dmg: 1, chance: 1.0, staminacost: 0.15, type: "charm", unarmed: false, rarity: 1, shop: true, sfx: "Vibe",
		playSelfBonus: 4,
		playSelfMsg: "KinkyDungeonPlaySelfVibeWand",
		playSelfSound: "Vibe",
		events: [{type: "ElementalEffect", trigger: "playerAttack", power: 0, damage: "stun", time: 1, chance: 0.5}]},
	"MagicSword": {name: "MagicSword", dmg: 3, chance: 2, staminacost: 1.0, type: "slash", unarmed: false, rarity: 4, shop: false, magic: true, cutBonus: 0.2, sfx: "LightSwing"},

	"Dragonslaver": {name: "Dragonslaver", dmg: 4, chance: 1.25, staminacost: 1.0, type: "slash", unarmed: false, rarity: 10, shop: false, magic: true, cutBonus: 0.2, sfx: "LightSwing",
		events: [{type: "CastSpell", spell: "BeltStrike", trigger: "playerAttack", requireEnergy: true, energyCost: 0.0075}],
		special: {type: "hitorspell", spell: "BeltStrike", requiresEnergy: true, energyCost: 0.0075, range: 2.99}},
	"BondageBuster": {name: "BondageBuster", dmg: 1, chance: 1.0, staminacost: 0.3,  type: "tickle", unarmed: false, rarity: 10, shop: false, magic: true, cutBonus: 0.2, sfx: "Shock",
		events: [
			{type: "ElementalEffect", trigger: "playerAttack", power: 0, time: 6, damage: "tickle"},
			{type: "Charge", trigger: "tick", power: 11, buffType: "BondageBustCharge", color: "#ffff00"},
			{type: "BondageBustBoost", trigger: "spellCast", power: 0.85, sfx: "Shock", energyCost: 0.0025},
		],
		special: {type: "spell", spell: "BondageBust", requiresEnergy: true, energyCost: 0.005, range: 4}},
	"TheEncaser": {name: "TheEncaser", dmg: 4, chance: 1.0, staminacost: 1.0, type: "glue", unarmed: false, rarity: 10, shop: false, magic: true, sfx: "MagicSlash",
		events: [{type: "ElementalEffect", trigger: "playerAttack", power: 0, damage: "glue", time: 2}],
		special: {type: "spell", selfCast: true, spell: "SlimeForm", requiresEnergy: true, energyCost: 0.025}},

	"Slimethrower": {name: "Slimethrower", dmg: 3, chance: 1.0, staminacost: 1.0, type: "crush", unarmed: false, rarity: 10, shop: false, sfx: "HeavySwing",
		special: {type: "spell", spell: "Slimethrower", requiresEnergy: true, energyCost: 0.015}},
	"Axe": {name: "Axe", dmg: 4, chance: 1.0, staminacost: 1.5, type: "slash", unarmed: false, rarity: 2, shop: true, sfx: "HeavySwing",
		events: [{type: "Cleave", trigger: "playerAttack", power: 2, damage: "slash"}]},
	"MagicAxe": {name: "MagicAxe", dmg: 4, chance: 1.0, staminacost: 1.5, type: "cold", unarmed: false, rarity: 4, magic: true, shop: false, cutBonus: 0.2, sfx: "HeavySwing",
		events: [{type: "Cleave", trigger: "playerAttack", power: 2, damage: "cold", time: 3}, {type: "ElementalEffect", trigger: "playerAttack", power: 0, damage: "cold", time: 3}]},
	"Hammer": {name: "Hammer", dmg: 5, chance: 1.0, staminacost: 3, type: "crush", unarmed: false, rarity: 2, shop: true, sfx: "HeavySwing",
		events: [{type: "Knockback", trigger: "playerAttack", dist: 1}]},
	"MagicHammer": {name: "MagicHammer", dmg: 6, chance: 1.0, staminacost: 2.5, type: "crush", unarmed: false, rarity: 4, magic: true, shop: false, cutBonus: 0.2, sfx: "HeavySwing",
		events: [{type: "Knockback", trigger: "playerAttack", dist: 1}]},
	"IceBreaker": {name: "IceBreaker", dmg: 3.5, chance: 1.0, staminacost: 1.0, type: "crush", unarmed: false, rarity: 4, magic: true, shop: false, sfx: "HeavySwing",
		events: [{type: "MultiplyDamageFrozen", trigger: "beforeDamageEnemy", power: 1.25}]},
	"Flail": {name: "Flail", dmg: 2.5, chance: 1.25, staminacost: 1, type: "crush", unarmed: false, rarity: 2, shop: true, sfx: "LightSwing",
		events: [{type: "Cleave", trigger: "playerAttack", power: 1, damage: "crush"}]},
	"MagicFlail": {name: "MagicFlail", dmg: 3, chance: 1.25, staminacost: 1, type: "crush", unarmed: false, rarity: 4, magic: true, shop: false, sfx: "LightSwing",
		events: [{type: "Cleave", trigger: "playerAttack", power: 3, damage: "crush"}]},
	"Spear": {name: "Spear", dmg: 4.0, chance: 1.0, staminacost: 1.5, type: "pierce", unarmed: false, rarity: 2, shop: true, sfx: "LightSwing",
		events: [{type: "Pierce", trigger: "playerAttack", power: 4.0, damage: "pierce"}]},
	"MagicSpear": {name: "MagicSpear", dmg: 4.0, chance: 1.5, staminacost: 1.5, type: "pierce", unarmed: false, rarity: 4, magic: true, shop: true, sfx: "LightSwing",
		events: [{type: "Pierce", trigger: "playerAttack", power: 4.0, damage: "pierce", dist: 2}]},
	"StaffBind": {name: "StaffBind", dmg: 2, chance: 1.0, staminacost: 1.0, type: "chain", unarmed: false, rarity: 3, shop: true, sfx: "MagicSlash",
		events: [{type: "ElementalEffect", trigger: "playerAttack", power: 0, damage: "chain", time: 4}]},
	"StaffFlame": {name: "StaffFlame", dmg: 5, chance: 0.7, staminacost: 2.5, type: "fire", unarmed: false, rarity: 3, shop: true, sfx: "MagicSlash",
		events: [{type: "Buff", trigger: "tick", power: 0.15, buffType: "fireDamageBuff"}]},
	"EscortDrone": {name: "EscortDrone", dmg: 2.5, chance: 1.0, staminacost: 0.8, type: "electric", noHands: true, unarmed: false, magic: true, rarity: 10, shop: false, sfx: "Laser",
		events: [{type: "ElementalEffect", trigger: "playerAttack", power: 0, chance: 0.33, damage: "electric", time: 4}]},
	"StaffStorm": {name: "StaffStorm", dmg: 4.5, chance: 1.0, staminacost: 2.0, type: "electric", unarmed: false, rarity: 3, shop: true, sfx: "MagicSlash",
		events: [{type: "EchoDamage", trigger: "beforeDamageEnemy", aoe: 2.9, power: 1.5, damage: "electric"}]},
	"StaffDoll": {name: "StaffDoll", dmg: 3.0, chance: 1.0, staminacost: 1.0, type: "souldrain", unarmed: false, rarity: 3, shop: true, sfx: "MagicSlash",
		events: [{type: "Dollmaker", trigger: "afterDamageEnemy"}]},
	"StaffFrostbite": {name: "StaffFrostbite", dmg: 4, chance: 1.0, staminacost: 2.5, type: "ice", unarmed: false, rarity: 3, shop: true, sfx: "MagicSlash",
		events: [{type: "ElementalEffect", trigger: "playerAttack", power: 0, damage: "ice", time: 4, chance: 0.25}, {type: "AoEDamageFrozen", trigger: "tick", aoe: 10, power: 0.5, damage: "ice"}]},
	"StaffPermafrost": {name: "StaffPermafrost", dmg: 4, chance: 1.0, staminacost: 2.5, type: "ice", unarmed: false, rarity: 3, shop: true, sfx: "MagicSlash",
		events: [{type: "ElementalEffect", trigger: "playerAttack", power: 0, damage: "ice", time: 4, chance: 0.25}, {type: "MultiplyTime", trigger: "beforeDamageEnemy", power: 1.5, damage: "ice"}]},
	"BoltCutters": {name: "BoltCutters", dmg: 3, staminacost: 1.0, chance: 1.0, type: "crush", unarmed: false, rarity: 3, shop: false, cutBonus: 0.3, sfx: "Unarmed",
		events: [{type: "DamageToTag", trigger: "playerAttack", requiredTag: "lock", power: 7, damage: "slash", chance: 1.0}]},
	"Pickaxe": {name: "Pickaxe", dmg: 3, chance: 1.0, staminacost: 1, type: "pierce", unarmed: false, rarity: 3, shop: true, sfx: "LightSwing",
		events: [{type: "ApplyBuff", trigger: "playerAttack", buff: {id: "ArmorDown", type: "Armor", duration: 6, power: -1.5, player: true, enemies: true, tags: ["debuff", "armor"]}}]},
};
