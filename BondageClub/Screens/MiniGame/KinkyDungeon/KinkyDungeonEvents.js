"use strict";

let KinkyDungeonSlimeLevel = 0;
let KinkyDungeonSlimeLevelStart = 0;
let KinkyDungeonSlimeParts = [
	{group: "ItemHead", restraint: "SlimeHead"},
	{group: "ItemArms", restraint: "SlimeArms"},
	{group: "ItemHands", restraint: "SlimeHands"},
	{group: "ItemLegs", restraint: "SlimeLegs"},
	{group: "ItemFeet", restraint: "SlimeFeet"},
	{group: "ItemBoots", restraint: "SlimeBoots"},
];
let KDAlertCD = 5;

function KinkyDungeonSendEvent(Event, data) {
	KinkyDungeonSendMagicEvent(Event, data);
	KinkyDungeonSendWeaponEvent(Event, data);
	KinkyDungeonSendInventoryEvent(Event, data);
	KinkyDungeonSendBulletEvent(Event, data.bullet, data);
	KinkyDungeonSendBuffEvent(Event, data);
}

function KinkyDungeonResetEventVariables() {
	KinkyDungeonSlimeLevel = 0;
}
function KinkyDungeonResetEventVariablesTick(delta) {
	if (KinkyDungeonSlimeLevel < 0)
		KinkyDungeonSlimeLevel = 0;
	KinkyDungeonSlimeLevelStart = KinkyDungeonSlimeLevel;
	if (KDAlertCD > 0) KDAlertCD -= delta;

	if (KinkyDungeonLastTurnAction != "Attack" && KDGameData.WarningLevel > 0) {
		if (KDRandom() < 0.25) KDGameData.WarningLevel -= delta;
		if (KDGameData.WarningLevel > 5) KDGameData.WarningLevel = 5;
	}
}

/**
 * Function mapping
 * @type {Map<string, function(KinkyDungeonEvent, item, *): void>}
 */

/**
 *
 * @param {string} Event
 * @param {KinkyDungeonEvent} e
 * @param {item} item
 * @param {*} data
 */
function KinkyDungeonHandleInventoryEvent(Event, e, item, data) {
	KDEventMap.get(Event)(e,item,data);
}

/**
 *
 * @param {string} Event
 * @param {any} buff
 * @param {any} entity
 * @param {*} data
 */
function KinkyDungeonHandleBuffEvent(Event, buff, entity, data) {

}

/**
 *
 * @param {string} Event
 * @param {KinkyDungeonEvent} e
 * @param {any} spell
 * @param {*} data
 */
function KinkyDungeonHandleMagicEvent(Event, e, spell, data) {
	if (Event == "calcEvasion") {
		if (e.type == "HandsFree" && e.trigger == "calcEvasion" && !data.IsSpell && KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell)) && data.flags.KDEvasionHands) {
			data.flags.KDEvasionHands = false;
		}
	} if (Event == "calcStats") {
		if (e.type == "Blindness" && e.trigger == "calcStats" && KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell))) {
			//KDBlindnessCap = Math.min(KDBlindnessCap, e.power);
			KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {id: spell.name+e.type+e.trigger, type: "Blindness", duration: e.time ? e.time : 0, power: -1});
		}
	} else if (Event == "beforeMove") {
		if (e.type == "FleetFooted" && e.trigger == "beforeMove" && !data.IsSpell && !KinkyDungeonNoMoveFlag && KinkyDungeonSlowLevel > 1 && KinkyDungeonHasStamina(1.1) &&  KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell))) {
			let manacost = -KinkyDungeonGetManaCost(spell);
			e.prevSlowLevel = KinkyDungeonSlowLevel;
			KinkyDungeonSlowLevel = Math.max(0, KinkyDungeonSlowLevel - e.power);
			if (KinkyDungeonHasMana(1.5) && KinkyDungeonMovePoints < 0) {
				KinkyDungeonMovePoints = 0;
				manacost -= 1.5;
				KinkyDungeonSendActionMessage(4, TextGet("KinkyDungeonFleetFootedIgnoreSlow"), "lightgreen", 2);
			} else KinkyDungeonSendActionMessage(2, TextGet("KinkyDungeonFleetFooted"), "lightgreen", 2, false, true);
			KinkyDungeonChangeMana(manacost);
		}
	} else if (Event == "afterMove") {
		if (e.type == "FleetFooted" && e.trigger == "afterMove" && e.prevSlowLevel && !data.IsSpell && KinkyDungeonSlowLevel < e.prevSlowLevel) {
			KinkyDungeonSlowLevel = e.prevSlowLevel;
			e.prevSlowLevel = undefined;
		}
	} else if (Event == "beforeTrap") {
		if (e.type == "FleetFooted" && e.trigger == "beforeTrap" && data.flags.AllowTraps && !data.IsSpell && KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell))) {
			if (KDRandom() < e.chance) {
				KinkyDungeonChangeMana(-KinkyDungeonGetManaCost(spell));
				data.flags.AllowTraps = false;
				KinkyDungeonSendTextMessage(7, TextGet("KinkyDungeonFleetFootedIgnoreTrap"), "lightgreen", 2);
			}
		}
	} else if (Event == "beforeDamageEnemy") {
		if (e.type == "MultiplyDamageStealth" && e.trigger == Event && data.dmg > 0 && data.enemy && !data.enemy.Enemy.allied && !data.enemy.aware) {
			if ((!e.humanOnly || data.enemy.Enemy.bound) && (!e.chance || KDRandom() < e.chance)) {
				data.dmg = Math.max(data.dmg * e.power, 0);
			}
		}
	} else if (Event == "calcDamage") {
		if (e.type == "HandsFree" && e.trigger == "calcDamage" && !data.IsSpell && KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell)) && data.flags.KDDamageHands) {
			data.flags.KDDamageHands = false;
		}
	} else if (Event == "getWeapon") {
		if (e.type == "HandsFree" && e.trigger == "getWeapon" && !data.IsSpell && KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell)) && data.flags && !data.flags.HandsFree) {
			data.flags.HandsFree = true;
		}
	} else if (Event == "playerAttack") {
		if (e.type == "FlameBlade" && e.trigger == Event && KinkyDungeonPlayerDamage && (KinkyDungeonPlayerDamage.name || KinkyDungeonStatsChoice.get("Brawler")) && KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell)) && data.targetX && data.targetY && !(data.enemy && data.enemy.Enemy && data.enemy.Enemy.allied)) {
			KinkyDungeonChangeMana(-KinkyDungeonGetManaCost(spell));
			KinkyDungeonCastSpell(data.targetX, data.targetY, KinkyDungeonFindSpell("FlameStrike", true), undefined, undefined, undefined);
		} else if (e.type == "ElementalEffect" && e.trigger == Event && KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell)) && !data.miss && !data.disarm && data.targetX && data.targetY && data.enemy && !(data.enemy.Enemy && data.enemy.Enemy.allied)) {
			KinkyDungeonChangeMana(-KinkyDungeonGetManaCost(spell));
			KinkyDungeonDamageEnemy(data.enemy, {type:e.damage, damage: e.power, time: e.time, bind: e.bind}, false, true, undefined, undefined, undefined);
		} else if (e.type == "FloatingWeapon" && e.trigger == Event && KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell)) && data.targetX && data.targetY && !(data.enemy && data.enemy.Enemy && data.enemy.Enemy.allied)) {
			let chanceWith = KinkyDungeonPlayerDamage.chance;
			let chanceWithout = KinkyDungeonGetPlayerWeaponDamage(KinkyDungeonCanUseWeapon(true), true).chance;
			KinkyDungeonGetPlayerWeaponDamage(KinkyDungeonCanUseWeapon());
			if (KinkyDungeonPlayerDamage && KinkyDungeonPlayerDamage.name && chanceWithout < chanceWith)
				KinkyDungeonChangeMana(-KinkyDungeonGetManaCost(spell));
		}
	} else if (Event == "beforeStruggleCalc") {
		if (e.type == "ModifyStruggle" && e.trigger == Event && KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell)) && data.escapeChance && (!e.StruggleType || data.StruggleType)) {
			KinkyDungeonChangeMana(-KinkyDungeonGetManaCost(spell));
			if (e.mult && data.escapeChance > 0)
				data.escapeChance *= e.mult;
			if (e.power)
				data.escapeChance += e.power;
			if (e.msg) {
				KinkyDungeonSendTextMessage(3, TextGet(e.msg), "yellow", 2);
			}
		}
	} else if (Event == "vision") {
		if (e.type == "TrueSight" && e.trigger == "vision" && KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell)) && data.flags) {
			if (data.update)
				KinkyDungeonChangeMana(-KinkyDungeonGetManaCost(spell) * data.update);
			data.flags.SeeThroughWalls = Math.max(data.flags.SeeThroughWalls, 2);
		}
	} else if (Event == "draw") {
		if (e.type == "EnemySense" && e.trigger == "draw") {
			let activate = false;
			if (KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell)) && !KinkyDungeonPlayerBuffs.EnemySense) {
				KinkyDungeonChangeMana(-KinkyDungeonGetManaCost(spell) * data.update);
				KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {id: "EnemySense", type: "EnemySense", duration: 5});
				activate = true;
			}
			if (KinkyDungeonPlayerBuffs.EnemySense && KinkyDungeonPlayerBuffs.EnemySense.duration > 1)
				for (let enemy of KinkyDungeonEntities) {
					if (!KinkyDungeonLightGet(enemy.x, enemy.y)
						&& Math.sqrt((KinkyDungeonPlayerEntity.x - enemy.x) * (KinkyDungeonPlayerEntity.x - enemy.x) + (KinkyDungeonPlayerEntity.y - enemy.y) * (KinkyDungeonPlayerEntity.y - enemy.y)) < e.dist) {
						let color = "#882222";
						if (enemy.Enemy.stealth > 0 || enemy.Enemy.AI == "ambush") color = "#441111";
						if (color == "#882222" || Math.sqrt((KinkyDungeonPlayerEntity.x - enemy.x) * (KinkyDungeonPlayerEntity.x - enemy.x) + (KinkyDungeonPlayerEntity.y - enemy.y) * (KinkyDungeonPlayerEntity.y - enemy.y)) < e.distStealth)
							DrawImageCanvasColorize(KinkyDungeonRootDirectory + "Aura.png", KinkyDungeonContext,
								(enemy.visual_x - data.CamX - data.CamX_offset)*KinkyDungeonGridSizeDisplay,
								(enemy.visual_y - data.CamY - data.CamY_offset)*KinkyDungeonGridSizeDisplay,
								KinkyDungeonSpriteSize/KinkyDungeonGridSizeDisplay,
								color, true, []);
					}
				}
			else if (!activate) {
				KinkyDungeonDisableSpell("EnemySense");
				KinkyDungeonExpireBuff(KinkyDungeonPlayerBuffs, "EnemySense");
			}
		}
	}
}

/**
 *
 * @param {string} Event
 * @param {KinkyDungeonEvent} e
 * @param {weapon} weapon
 * @param {*} data
 */
function KinkyDungeonHandleWeaponEvent(Event, e, weapon, data) {
	if (Event == "tick") {
		if (e.type == "Buff" && e.trigger == "tick") {
			KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {id: weapon.name, type: e.buffType, power: e.power, duration: 2});
		} else if (e.type == "AoEDamageFrozen" && e.trigger == Event) {
			let trigger = false;
			for (let enemy of KinkyDungeonEntities) {
				if (!enemy.Enemy.allied && enemy.freeze && (!e.chance || KDRandom() < e.chance) && enemy.hp > 0 && KDistEuclidean(enemy.x - KinkyDungeonPlayerEntity.x, enemy.y - KinkyDungeonPlayerEntity.y) <= e.aoe) {
					KinkyDungeonDamageEnemy(enemy, {type:e.damage, damage: e.power, time: e.time}, false, true, undefined, undefined, undefined);
					trigger = true;
				}
			}
			if (trigger) {
				if (e.energyCost) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost);
			}
		} else if (e.type == "AoEDamage" && e.trigger == Event) {
			let trigger = false;
			for (let enemy of KinkyDungeonEntities) {
				if (!enemy.Enemy.allied && (!e.chance || KDRandom() < e.chance) && enemy.hp > 0 && KDistEuclidean(enemy.x - KinkyDungeonPlayerEntity.x, enemy.y - KinkyDungeonPlayerEntity.y) <= e.aoe) {
					KinkyDungeonDamageEnemy(enemy, {type:e.damage, damage: e.power, time: e.time}, false, true, undefined, undefined, undefined);
					trigger = true;
				}
			}
			if (trigger) {
				if (e.energyCost) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost);
			}
		}
	} else if (Event == "playerAttack") {
		if (e.type == "ElementalEffect" && e.trigger == Event && data.enemy && !data.miss && !data.disarm) {
			if (data.enemy && (!e.chance || KDRandom() < e.chance) && data.enemy.hp > 0) {
				KinkyDungeonDamageEnemy(data.enemy, {type:e.damage, damage: e.power, time: e.time, bind: e.bind}, false, true, undefined, undefined, undefined);
			}
		} else if (e.type == "ApplyBuff" && e.trigger == Event && data.enemy && !data.miss && !data.disarm) {
			if (data.enemy && (!e.chance || KDRandom() < e.chance)) {
				if (!data.enemy.buffs) data.enemy.buffs = {};
				KinkyDungeonApplyBuff(data.enemy.buffs, e.buff);
			}
		} else if (e.type == "Cleave" && e.trigger == Event && data.enemy && !data.disarm) {
			for (let enemy of KinkyDungeonEntities) {
				if (enemy != data.enemy && !enemy.Enemy.allied) {
					let dist = Math.max(Math.abs(enemy.x - KinkyDungeonPlayerEntity.x), Math.abs(enemy.y - KinkyDungeonPlayerEntity.y));
					if (dist < 1.5 && KinkyDungeonEvasion(enemy) && Math.max(Math.abs(enemy.x - data.enemy.x), Math.abs(enemy.y - data.enemy.y))) {
						KinkyDungeonDamageEnemy(enemy, {type: e.damage, damage: e.power, time: e.time}, false, true, undefined, undefined, undefined);
					}
				}
			}
		} else if (e.type == "CastSpell" && e.trigger == Event && data.enemy && !data.disarm) {
			let spell = KinkyDungeonFindSpell(e.spell, true);
			KinkyDungeonCastSpell(data.enemy.x, data.enemy.y, spell, {x:KinkyDungeonPlayerEntity.x, y:KinkyDungeonPlayerEntity.y}, {x:data.enemy.x, y:data.enemy.y}, undefined);
			if (e.energyCost) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost);
		} else if (e.type == "Pierce" && e.trigger == Event && data.enemy && !data.disarm) {
			let dist = e.dist ? e.dist : 1;
			for (let i = 1; i <= dist; i++) {
				let xx = data.enemy.x + i * (data.enemy.x - KinkyDungeonPlayerEntity.x);
				let yy = data.enemy.y + i * (data.enemy.y - KinkyDungeonPlayerEntity.y);
				for (let enemy of KinkyDungeonEntities) {
					if (enemy != data.enemy && !enemy.Enemy.allied) {
						if (KinkyDungeonEvasion(enemy) && enemy.x == xx && enemy.y == yy) {
							KinkyDungeonDamageEnemy(enemy, {type: e.damage, damage: e.power}, false, true, undefined, undefined, undefined);
						}
					}
				}
			}
		} else if (e.type == "Knockback" && e.trigger == Event && e.dist && data.enemy && data.targetX && data.targetY && !data.miss && !data.disarm) {
			if (data.enemy.Enemy && !data.enemy.Enemy.tags.has("unflinching") && !data.enemy.Enemy.tags.has("stunresist") && !data.enemy.Enemy.tags.has("unstoppable")) {
				let newX = data.targetX + Math.round(e.dist * (data.targetX - KinkyDungeonPlayerEntity.x));
				let newY = data.targetY + Math.round(e.dist * (data.targetY - KinkyDungeonPlayerEntity.y));
				if (KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(newX, newY)) && KinkyDungeonNoEnemy(newX, newY, true)
					&& (e.dist == 1|| KinkyDungeonCheckProjectileClearance(data.enemy.x, data.enemy.y, newX, newY))) {
					data.enemy.x = newX;
					data.enemy.y = newY;
				}
			}
		}
	} else if (Event == "beforeDamageEnemy") {
		if (e.type == "MultiplyTime" && e.trigger == Event && data.time > 0 && (!e.damage || e.damage == data.type)) {
			if (!e.chance || KDRandom() < e.chance) {
				data.time = Math.ceil(data.time * e.power);
				if (e.energyCost) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost);
			}
		} else if (e.type == "MultiplyDamageFrozen" && data.enemy && data.enemy.freeze && e.trigger == Event && data.dmg > 0 && (!e.damage || e.damage == data.type)) {
			if (!e.chance || KDRandom() < e.chance) {
				data.dmg = Math.ceil(data.dmg * e.power);
				if (e.energyCost) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost);
			}
		} else if (e.type == "EchoDamage" && data.enemy && (!data.flags || !data.flags.includes("EchoDamage")) && e.trigger == Event && data.dmg > 0 && (!e.damage || e.damage == data.type)) {
			if (!e.chance || KDRandom() < e.chance) {
				let trigger = false;
				for (let enemy of KinkyDungeonEntities) {
					if ((enemy.rage || (enemy.Enemy.allied && data.enemy.Enemy.allied) || (!enemy.Enemy.allied && !data.enemy.Enemy.allied)) && enemy != data.enemy && enemy.hp > 0 && KDistEuclidean(enemy.x - data.enemy.x, enemy.y - data.enemy.y) <= e.aoe) {
						KinkyDungeonDamageEnemy(enemy, {type:e.damage, damage: e.power, time: e.time, flags: ["EchoDamage"]}, false, true, undefined, undefined, undefined);
						trigger = true;
					}
				}
				if (trigger) {
					if (e.energyCost) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost);
				}
			}
		}
	} else if (Event == "afterDamageEnemy") {
		if (e.type == "Dollmaker" && e.trigger == Event && data.attacker && data.attacker.player && data.enemy && KDBoundEffects(data.enemy) > 3 && data.enemy.hp < 0.01) {
			if (!e.chance || KDRandom() < e.chance) {
				let Enemy = KinkyDungeonEnemies.find(element => element.name == "AllyDoll");
				KinkyDungeonEntities.push({summoned: true, rage: Enemy.summonRage ? 9999 : undefined, Enemy: Enemy, id: KinkyDungeonGetEnemyID(),
					x:data.enemy.x, y:data.enemy.y, hp: (Enemy.startinghp) ? Enemy.startinghp : Enemy.maxhp, movePoints: 0, attackPoints: 0});
				if (e.energyCost) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost);
			}
		}
	}
}


/**
 *
 * @param {string} Event
 * @param {KinkyDungeonEvent} e
 * @param {any} b
 * @param {*} data
 */
function KinkyDungeonHandleBulletEvent(Event, e, b, data) {
	if (b.bullet) {
		if (Event == "bulletHit") {
			if (e.type == "DropKnife" && e.trigger == "bulletHit") {
				let point = {x: b.x, y:b.y};
				if (!KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(point.x, point.y))) {
					if (b.vx || b.vy) {
						let speed = KDistEuclidean(b.vx, b.vy);
						if (KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(Math.round(b.x - b.vx/speed), Math.round(b.y - b.vy/speed)))) {
							point = {x: Math.round(b.x - b.vx/speed), y: Math.round(b.y - b.vy/speed)};
						} else if (KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(Math.floor(b.x - b.vx/speed), Math.floor(b.y - b.vy/speed)))) {
							point = {x: Math.floor(b.x - b.vx/speed), y: Math.floor(b.y - b.vy/speed)};
						} else {
							point = {x: Math.ceil(b.x - b.vx/speed), y: Math.ceil(b.y - b.vy/speed)};
						}
					}
				}
				KinkyDungeonDropItem({name: "Knife"}, point, KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(point.x, point.y)), true, true);
			}
		}
	}
}
