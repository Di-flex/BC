"use strict";


let KDConduction = {id: "Conduction", type: "event", aura: "#88ffff", aurasprite: "Conduction", power: 7.0, player: true, duration: 5, enemies: true, range: 2.99, events: [
	{type: "RemoveConduction", duration: 1, trigger: "tick"},
	{type: "Conduction", power: 0.5, duration: 5, damage: "electric", aoe: 3.99, trigger: "playerTakeDamage"},
	{type: "Conduction", power: 0.5, duration: 5, damage: "electric", aoe: 3.99, trigger: "beforeDamageEnemy"},
]};

let KDDrenched = {id: "Drenched", type: "fireDamageResist", aura: "#2789cd", aurasprite: "Drenched", power: 0.425, player: true, duration: 20, enemies: true, events: [
	{type: "RemoveDrench", duration: 1, trigger: "tick"},
	{type: "ApplyConduction", duration: 1, trigger: "tick"},
	{type: "ApplyConduction", duration: 1, trigger: "tickAfter"},
]};

let KDBurning = {id: "Burning", type: "event", aura: "#ff8933", aurasprite: "Flaming", power: 0.5, player: true, duration: 6, enemies: true, events: [
	{type: "RemoveBurning", trigger: "tick"},
	{type: "ElementalEffect", power: 0.5, damage: "fire", trigger: "tick"},
	{type: "EchoDamage", power: 1.0, damage: "fire", damageTrigger: "stun", trigger: "beforeDamageEnemy"},
	{type: "EchoDamage", power: 1.0, damage: "fire", damageTrigger: "stun", trigger: "playerTakeDamage"},
]};

let KDVolcanism = {id: "Volcanism", type: "event", aura: "#ff0000", power: 0.5, player: false, duration: 9999, enemies: true, events: [
	{type: "Volcanism", power: 4.0, damage: "fire", trigger: "beforeDamageEnemy"},
]};

let KDDrenched2 = {id: "Drenched2", type: "electricDamageResist", power: -0.35, player: true, duration: 20, enemies: true};
let KDDrenched3 = {id: "Drenched2", type: "iceDamageResist", power: -0.35, player: true, duration: 20, enemies: true};

let KDChilled = {id: "Chilled", aura: "#73efe8", type: "MoveSpeed", power: -1.0, player: true, enemies: true, duration: 2,};
let KDSlimed = {id: "Slimed", aura: "#dc16bc", aurasprite: "Slimed", noAuraColor: true, type: "MoveSpeed", power: -1.0, player: true, enemies: true, duration: 2,};

let KDNoChill = {id: "ChillWalk", aura: "#73efe8", type: "none", power: -1.0, player: true, enemies: true, duration: 2,};