"use strict";

let KinkyDungeonSlimeLevel = 0;
let KinkyDungeonSlimeLevelStart = 0;
let KinkyDungeonAttackTwiceFlag = false;
let KinkyDungeonSlimeParts = [
	{group: "ItemHead", restraint: "SlimeHead", noUnmasked: true},
	{group: "ItemMouth3", restraint: "SlimeMouth"},
	{group: "ItemArms", restraint: "SlimeArms"},
	{group: "ItemHands", restraint: "SlimeHands"},
	{group: "ItemLegs", restraint: "SlimeLegs"},
	{group: "ItemFeet", restraint: "SlimeFeet"},
	{group: "ItemBoots", restraint: "SlimeBoots"},
];
let KDAlertCD = 5;

let KDEventDataReset = {

};

function KinkyDungeonSendEvent(Event, data) {
	KinkyDungeonSendMagicEvent(Event, data);
	KinkyDungeonSendWeaponEvent(Event, data);
	KinkyDungeonSendInventoryEvent(Event, data);
	KinkyDungeonSendBulletEvent(Event, data.bullet, data);
	KinkyDungeonSendBuffEvent(Event, data);
	KinkyDungeonSendOutfitEvent(Event, data);
	KinkyDungeonSendEnemyEvent(Event, data);
}
/** Called during initialization */
function KinkyDungeonResetEventVariables() {
	KinkyDungeonSlimeLevel = 0;
}
/** Called every tick */
function KinkyDungeonResetEventVariablesTick(delta) {
	KDEventDataReset = {};
	KinkyDungeonAttackTwiceFlag = false;

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
 * to expand, keep (e, item, data) => {...} as a constant API call
 * @type {Object.<string, Object.<string, function(KinkyDungeonEvent, item, *): void>>}
 */
let KDEventMapInventory = {
	"kill": {
		"MikoGhost": (e, item, data) => {
			if (!e.chance || KDRandom() < e.chance) {
				if (data.enemy && data.enemy.lifetime == undefined && data.enemy.playerdmg && !data.enemy.Enemy.tags.has("ghost") && !data.enemy.Enemy.tags.has("construct")) {
					KinkyDungeonSummonEnemy(data.enemy.x, data.enemy.y, "MikoGhost", 1, 1.5, true);
					KinkyDungeonSendTextMessage(5, TextGet("KDMikoCollarSummmon"), "purple", 2);
				}
			}
		},
	},
	"tick": {
		"PeriodicTeasing": (e, item, data) => {
			if (!data.delta) return;
			if (!e.chance || KDRandom() < e.chance) {
				if (!KDGameData.CurrentVibration && KDIsVibeCD(e.cooldown)) {
					KinkyDungeonStartVibration(item.name, "normal", KDGetVibeLocation(item), e.power, e.time, undefined, undefined, undefined, undefined, e.edgeOnly);
					if (e.sfx) KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + e.sfx + ".ogg");
				}
			}
		},
		"PeriodicDenial": (e, item, data) => {
			if (!data.delta) return;
			if (!e.chance || KDRandom() < e.chance) {
				if (!KDGameData.CurrentVibration && KDIsVibeCD(e.cooldown)) {
					KinkyDungeonStartVibration(item.name, "normal", KDGetVibeLocation(item), e.power, e.time, undefined, 12, undefined, undefined, undefined, false, 0.1, 1.0);
					if (e.sfx) KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + e.sfx + ".ogg");
				} else {
					KinkyDungeonAddVibeModifier(item.name, "tease", KDRestraint(item).Group, 0, 9, e.power, false, true, false, false, true, 0.1, 1.0);
				}
			}
		},
		"AccuracyBuff": (e, item, data) => {
			KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {
				id: item.name + e.type + e.trigger,
				type: "Accuracy",
				duration: 1,
				power: e.power
			});
		},
		"spellRange": (e, item, data) => {
			KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {
				id: item.name + e.type + e.trigger,
				type: "spellRange",
				duration: 1,
				power: e.power
			});
		},
		"SneakBuff": (e, item, data) => {
			KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {
				id: item.name + e.type + e.trigger,
				type: "Sneak",
				duration: 1,
				power: e.power
			});
		},
		"EvasionBuff": (e, item, data) => {
			KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {
				id: item.name + e.type + e.trigger,
				type: "Evasion",
				duration: 1,
				power: e.power
			});
		},
		"AllyHealingAura": (e, item, data) => {
			if (!data.delta) return;
			let healed = false;
			for (let enemy of KinkyDungeonEntities) {
				if (KDAllied(enemy) && KDistEuclidean(enemy.x - KinkyDungeonPlayerEntity.x, enemy.y - KinkyDungeonPlayerEntity.y) <= e.aoe) {
					let origHP = enemy.hp;
					enemy.hp = Math.min(enemy.hp + e.power, enemy.Enemy.maxhp);
					if (enemy.hp - origHP > 0) {
						KinkyDungeonSendFloater(enemy, `+${Math.round((enemy.hp - origHP) * 10)}`, "#44ff77", 3);
						healed = true;
					}
				}
			}
			if (healed) {
				if (e.energyCost) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost);
			}
		},
		"EnchantedAnkleCuffs2": (e, item, data) => {
			KinkyDungeonRemoveRestraint(KDRestraint(item).Group);
			KinkyDungeonAddRestraint(KinkyDungeonGetRestraintByName("EnchantedAnkleCuffs"), 0, true, undefined, undefined, undefined, undefined, undefined, item.faction);
		},
		"EnchantedAnkleCuffs": (e, item, data) => {
			if (KDGameData.AncientEnergyLevel <= 0.0000001) {
				KinkyDungeonRemoveRestraint(KDRestraint(item).Group);
				KinkyDungeonAddRestraint(KinkyDungeonGetRestraintByName("EnchantedAnkleCuffs2"), 0, true, undefined, undefined, undefined, undefined, undefined, item.faction);
			}
		},
		"RegenMana": (e, item, data) => {
			if (!e.limit || KinkyDungeonStatMana / KinkyDungeonStatManaMax < e.limit) {
				if (e.energyCost && KinkyDungeonStatMana < KinkyDungeonStatManaMax - 0.01) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost);
				KinkyDungeonChangeMana(e.power);
			}
		},
		"RegenStamina": (e, item, data) => {
			if (!e.limit || KinkyDungeonStatStamina / KinkyDungeonStatStaminaMax < e.limit) {
				if (e.energyCost && KinkyDungeonStatStamina < KinkyDungeonStatStaminaMax - 0.01) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost);
				KinkyDungeonChangeStamina(e.power);
			}
		},
		"ApplySlowLevelBuff": (e, item, data) => {
			if (item.type === Restraint) {
				KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {
					id: item.name + e.type + e.trigger,
					type: "SlowLevel",
					duration: 1,
					power: e.power
				});
				if (e.energyCost) KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {
					id: item.name + e.type + e.trigger + "2",
					type: "SlowLevelEnergyDrain",
					duration: 1,
					power: e.energyCost
				});
			}
		},
		"AlertEnemies": (e, item, data) => {
			if (!data.delta) return;
			if (!e.chance || KDRandom() < e.chance) {
				KinkyDungeonAlert = Math.max(KinkyDungeonAlert, e.power);
				KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonAlertEnemies").replace("RestraintName", TextGet("Restraint" + item.name)), "red", 2);
				if (e.sfx) KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + e.sfx + ".ogg");
			}
		},
		"iceDrain": (e, item, data) => {
			if (!data.delta) return;
			if (e.power) {
				KinkyDungeonChangeMana(e.power);
				KinkyDungeonChangeStamina(e.power);
				KinkyDungeonSendTextMessage(1, TextGet("KinkyDungeonIceDrain"), "lightblue", 2);
			}
		},
		"crystalDrain": (e, item, data) => {
			if (!data.delta) return;
			if (e.power) {
				KinkyDungeonChangeMana(e.power);
				KinkyDungeonChangeDistraction(-e.power * 3, false, 0.1);
				KinkyDungeonSendTextMessage(1, TextGet("KinkyDungeonCrystalDrain"), "lightblue", 2);
			}
		},
		"slimeSpread": (e, item, data) => {
			if (!data.delta) return;
			KinkyDungeonSlimeLevel = Math.max(KinkyDungeonSlimeLevel, KinkyDungeonSlimeLevelStart + e.power);
			if (KinkyDungeonSlimeLevel >= 0.99999) {
				KinkyDungeonSlimeLevel = 0;
				KinkyDungeonSlimeLevelStart = -100;
				let slimedParts = [];
				let potentialSlimeParts = [];
				for (let inv of KinkyDungeonAllRestraint()) {
					if (KDRestraint(inv).slimeLevel > 0) {
						slimedParts.push({
							name: KDRestraint(inv).name,
							group: KDRestraint(inv).Group,
							level: KDRestraint(inv).slimeLevel
						});
					}
				}
				for (let slime of slimedParts) {
					let index = -1;
					for (let i = 0; i < KinkyDungeonSlimeParts.length; i++) if (KinkyDungeonSlimeParts[i].group === slime.group) {
						index = i;
						break;
					}
					if (index >= 0) {
						let slime2 = undefined;
						let slime3 = undefined;
						if (index > 0) {
							for (let s of potentialSlimeParts) if (s.group === KinkyDungeonSlimeParts[index - 1].group && !(s.level > slime.level)) {
								slime2 = s;
								break;
							}
							if (!slime2 && (!KinkyDungeonStatsChoice.has("Unmasked") || !KinkyDungeonSlimeParts[index - 1].noUnmasked)) potentialSlimeParts.push({
								group: KinkyDungeonSlimeParts[index - 1].group,
								restraint: (e.restraint ? e.restraint : "") + KinkyDungeonSlimeParts[index - 1].restraint,
								level: slime.level
							});
						}
						if (index < KinkyDungeonSlimeParts.length - 1) {
							for (let s of potentialSlimeParts) if (s.group === KinkyDungeonSlimeParts[index + 1].group && !(s.level > slime.level)) {
								slime3 = s;
								break;
							}
							if (!slime3 && (!KinkyDungeonStatsChoice.has("Unmasked") || !KinkyDungeonSlimeParts[index + 1].noUnmasked)) potentialSlimeParts.push({
								group: KinkyDungeonSlimeParts[index + 1].group,
								restraint: (e.restraint ? e.restraint : "") + KinkyDungeonSlimeParts[index + 1].restraint,
								level: slime.level
							});
						}
					}
				}
				let slimed = false;
				if (potentialSlimeParts.length === 0) {
					KinkyDungeonSlimeLevel = Math.min(KinkyDungeonSlimeLevel, 0.5);
					KinkyDungeonSlimeLevelStart = Math.min(KinkyDungeonSlimeLevelStart, 0.5);
				}
				else while (potentialSlimeParts.length > 0) {
					let newSlime = potentialSlimeParts[Math.floor(KDRandom() * potentialSlimeParts.length)];
					if (newSlime) {
						let added = KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName(newSlime.restraint), 0, true);
						if (added) {
							KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonSlimeSpread"), "#ff44ff", 3);
							potentialSlimeParts = [];
							KinkyDungeonSlimeLevel = -100;
							slimed = true;
						}
					}
					potentialSlimeParts.splice(potentialSlimeParts.indexOf(newSlime), 1);
				}
				if (!slimed && potentialSlimeParts.length === 0) {
					let slime = slimedParts[Math.floor(KDRandom() * slimedParts.length)];
					if (KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("Hard" + slime.name), 0, true)) {
						KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonSlimeHarden"), "#ff44ff", 3);
						if (KinkyDungeonCurrentDress !== "SlimeSuit") {
							KinkyDungeonSetDress("SlimeSuit", "");
							KinkyDungeonDressPlayer();
							KinkyDungeonSendTextMessage(6, TextGet("KinkyDungeonSlimeSpread"), "#ff44ff", 3);
						}
					}
					KinkyDungeonSlimeLevel = -100;
				}
			}
		}
	},
	"remove": {
		"slimeStop": (e, item, data) => {
			if (data.item === item) KinkyDungeonSlimeLevel = 0;
		},
		"unlinkItem": (e, item, data) => {
			if (data.item === item && !data.add && !data.shrine) {
				console.log("Deprecated function");
				console.log(Event, e, item, data);
				console.trace();
			}
		},
	},
	"postRemoval": {
		"replaceItem": (e, item, data) => {
			if (data.item === item && !data.add && !data.shrine && e.list) {
				for (let restraint of e.list) {
					KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName(restraint), e.power, true, e.lock, data.keep);
				}
			}
		},
		"RequireBaseArmCuffs": (e, item, data) => {
			if (data.item !== item && KDRestraint(item).Group) {
				let cuffsbase = false;
				for (let inv of KinkyDungeonAllRestraint()) {
					if (KDRestraint(inv).shrine && (KDRestraint(inv).shrine.includes("ArmCuffsBase"))) {
						cuffsbase = true;
						break;
					} else if (inv.dynamicLink) {
						let link = inv.dynamicLink;
						// Recursion thru to make sure we have an armbinder buried in there... somewhere
						for (let i = 0; i < 20; i++) {
							if (link && KDRestraint(link).shrine && (KDRestraint(link).shrine.includes("ArmCuffsBase"))) {
								cuffsbase = true;
								break;
							}
							if (link.dynamicLink) link = link.dynamicLink;
							else i = 200;
						}
					}
				}
				if (!cuffsbase) {
					KinkyDungeonRemoveRestraint(KDRestraint(item).Group, false, false, false);
					KinkyDungeonSendTextMessage(4, TextGet("KinkyDungeonRemoveCuffs"), "lightgreen", 2);
				}
			}
		},
		"RequireBaseAnkleCuffs": (e, item, data) => {
			if (data.item !== item && KDRestraint(item).Group) {
				let cuffsbase = false;
				for (let inv of KinkyDungeonAllRestraint()) {
					if (KDRestraint(inv).shrine && (KDRestraint(inv).shrine.includes("AnkleCuffsBase"))) {
						cuffsbase = true;
						break;
					} else if (inv.dynamicLink) {
						let link = inv.dynamicLink;
						// Recursion thru to make sure we have an armbinder buried in there... somewhere
						for (let i = 0; i < 20; i++) {
							if (link && KDRestraint(link).shrine && (KDRestraint(link).shrine.includes("AnkleCuffsBase"))) {
								cuffsbase = true;
								break;
							}
							if (link.dynamicLink) link = link.dynamicLink;
							else i = 200;
						}
					}
				}
				if (!cuffsbase) {
					KinkyDungeonRemoveRestraint(KDRestraint(item).Group, false, false, false);
					KinkyDungeonSendTextMessage(4, TextGet("KinkyDungeonRemoveCuffs"), "lightgreen", 2);
				}
			}
		},
		"armbinderHarness": (e, item, data) => {
			if (data.item !== item && KDRestraint(item).Group) {
				let armbinder = false;
				for (let inv of KinkyDungeonAllRestraint()) {
					if (KDRestraint(inv).shrine && (KDRestraint(inv).shrine.includes("Armbinders") || KDRestraint(inv).shrine.includes("Boxbinders"))) {
						armbinder = true;
						break;
					} else if (inv.dynamicLink) {
						let link = inv.dynamicLink;
						// Recursion thru to make sure we have an armbinder buried in there... somewhere
						for (let i = 0; i < 10; i++) {
							if (link && KDRestraint(link).shrine && (KDRestraint(link).shrine.includes("Armbinders") || KDRestraint(link).shrine.includes("Boxbinders"))) {
								armbinder = true;
								break;
							}
							if (link.dynamicLink) link = link.dynamicLink;
							else i = 10;
						}
					}
				}
				if (!armbinder) {
					KinkyDungeonRemoveRestraint(KDRestraint(item).Group, false, false, false);
					KinkyDungeonSendTextMessage(4, TextGet("KinkyDungeonRemoveArmbinderHarness"), "lightgreen", 2);
				}
			}
		}
	},
	"hit": {
		"linkItem": (e, item, data) => {
			if ((data.attack && data.attack.includes("Bind") && (!data.enemy || data.enemy.Enemy.bound) && !data.attack.includes("Suicide"))) {
				let added = false;
				if (data.restraintsAdded) {
					for (let r of data.restraintsAdded) {
						if (r.name === item.name) {
							added = true;
							break;
						}
					}
				}
				if (!added) {
					let subMult = 1;
					let chance = e.chance ? e.chance : 1.0;
					if (e.subMult !== undefined) {
						let rep = (KinkyDungeonGoddessRep.Ghost + 50) / 100;
						subMult = 1.0 + e.subMult * rep;
					}
					if (item && KDRestraint(item).Link && (KDRandom() < chance * subMult) && (!e.noLeash || KDGameData.KinkyDungeonLeashedPlayer < 1)) {
						let newRestraint = KinkyDungeonGetRestraintByName(KDRestraint(item).Link);
						//KinkyDungeonLinkItem(newRestraint, item, item.tightness, "");
						if (KinkyDungeonSound && e.sfx) KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + e.sfx + ".ogg");
						KinkyDungeonAddRestraint(newRestraint, item.tightness, true, "", false, undefined, undefined, undefined, item.faction);
					}
				}
			}
		}
	},
	"playerTakeDamage": {
		"linkItemOnDamageType": (e, item, data) => {
			if (data.type && data.type == e.damage && data.dmg) {
				let subMult = 1;
				let chance = e.chance ? e.chance : 1.0;
				if (item && KDRestraint(item).Link && KDRandom() < chance * subMult) {
					let prereq = KDEventPrereq(e.requiredTag);
					if (prereq) {
						let newRestraint = KinkyDungeonGetRestraintByName(KDRestraint(item).Link);
						//KinkyDungeonLinkItem(newRestraint, item, item.tightness, "");
						if (KinkyDungeonSound && e.sfx) KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + e.sfx + ".ogg");
						KinkyDungeonAddRestraint(newRestraint, item.tightness, true, "", false, undefined, undefined, undefined, item.faction);
					}
				}
			}
		},
		"lockItemOnDamageType": (e, item, data) => {
			if (data.type && data.type == e.damage && data.dmg) {
				let subMult = 1;
				let chance = e.chance ? e.chance : 1.0;
				if (item && KinkyDungeonGetLockMult(e.lock) > KinkyDungeonGetLockMult(item.lock) && KDRandom() < chance * subMult) {
					let prereq = KDEventPrereq(e.requiredTag);
					if (prereq) {
						KinkyDungeonLock(item, e.lock);
					}
				}
			}
		},
	},
	"miss": {
		"EnergyCost": (e, item, data) => {
			if (e.energyCost && KinkyDungeonStatMana < KinkyDungeonStatManaMax - 0.01) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost);
		}
	},
	"calcEvasion": {
		"HandsFree": (e, item, data) => {
			if (data.flags.KDEvasionHands) {
				data.flags.KDEvasionHands = false;
				if (data.cost && e.energyCost && KinkyDungeonStatMana < KinkyDungeonStatManaMax - 0.01) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost);
			}
		},
		"BlindFighting": (e, item, data) => {
			if (data.flags.KDEvasionSight) {
				data.flags.KDEvasionSight = false;
				if (data.cost && e.energyCost && KinkyDungeonStatMana < KinkyDungeonStatManaMax - 0.01) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost);
			}
		}
	},
	"beforePlayerAttack": {
		"BoostDamage": (e, item, data) => {
			data.buffdmg = Math.max(0, data.buffdmg + e.power);
			if (e.energyCost && KinkyDungeonStatMana < KinkyDungeonStatManaMax - 0.01) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost);
		}
	},
	"beforeDamage": {
		"ModifyDamageFlat": (e, item, data) => {
			if (data.damage > 0) {
				if (!e.chance || KDRandom() < e.chance) {
					data.damage = Math.max(data.damage + e.power, 0);
					if (e.energyCost) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost);
				}
			}
		},
	},
	"beforeDamageEnemy": {
		"MultiplyDamageStealth": (e, item, data) => {
			if (data.dmg > 0 && data.enemy && KDHostile(data.enemy) && !data.enemy.aware) {
				if (!e.chance || KDRandom() < e.chance) {
					let dmg = Math.max(0, Math.min(data.enemy.hp, data.dmg));
					if (e.energyCost && e.power > 1) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost * dmg * (e.power - 1));
					data.dmg = Math.max(data.dmg * e.power, 0);
				}
			}
		},
		"MultiplyDamageStatus": (e, item, data) => {
			if (data.dmg > 0 && data.enemy && KDHostile(data.enemy) && (KinkyDungeonHasStatus(data.enemy))) {
				if (!e.chance || KDRandom() < e.chance) {
					let dmg = Math.max(0, Math.min(data.enemy.hp, data.dmg));
					if (e.energyCost && e.power > 1) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost * dmg * (e.power - 1));
					data.dmg = Math.max(data.dmg * e.power, 0);
				}
			}
		},
		"MultiplyDamageMagic": (e, item, data) => {
			if (data.dmg > 0 && data.incomingDamage && !KinkyDungeonMeleeDamageTypes.includes(data.incomingDamage.type)) {
				if (!e.chance || KDRandom() < e.chance) {
					let dmg = Math.max(0, Math.min(data.enemy.hp, data.dmg));
					if (e.energyCost && e.power > 1) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost * dmg * (e.power - 1));
					data.dmg = Math.max(data.dmg * e.power, 0);
				}
			}
		}
	},
	"defeat": {
		"linkItem": (e, item, data) => {
			if (item && KDRestraint(item).Link && (KDRandom() < e.chance)) {
				let newRestraint = KinkyDungeonGetRestraintByName(KDRestraint(item).Link);
				KinkyDungeonAddRestraint(newRestraint, item.tightness, true, "", false, undefined, undefined, undefined, item.faction);
				//KinkyDungeonLinkItem(newRestraint, item, item.tightness, "");
			}
		},
		"Kittify": (e, item, data) => {
			// get defeat, upgrade suit
			KinkyDungeonRemoveRestraint("ItemArms",false,false,true,false);
			KinkyDungeonAddRestraint(KinkyDungeonGetRestraintByName("KittyPetSuit"), 15, undefined, undefined, undefined, undefined, undefined, undefined, item.faction);
			// leash if collared
			let collared = InventoryGet(KinkyDungeonPlayer, "ItemNeck");
			if(collared != null){
				KinkyDungeonAddRestraint(KinkyDungeonGetRestraintByName("BasicLeash"), 1, false, "Red", undefined, undefined, undefined, undefined, item.faction);
			}
		},
	},
	"struggle": {
		"crotchrope": (e, item, data) => {
			if (data.restraint && data.restraint.type === Restraint && KDRestraint(data.restraint).crotchrope && data.struggletype === "Struggle" && data.struggletype === "Remove") {
				KinkyDungeonChangeDistraction(1, false, 0.5);
				KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonCrotchRope").replace("RestraintName", TextGet("Restraint" + data.restraint.name)), "pink", 3);
			}
		},
		"celestialRopePunish": (e, item, data) => {
			if (data.restraint && item === data.restraint) {
				KinkyDungeonChangeDistraction(3);
				KinkyDungeonChangeMana(-1);
				KinkyDungeonStatBlind = Math.max(KinkyDungeonStatBlind + 1, 2);

				for (let A = 0; A < KinkyDungeonPlayer.Appearance.length; A++) {
					if (KinkyDungeonPlayer.Appearance[A].Asset.Group.Name === "Eyes" || KinkyDungeonPlayer.Appearance[A].Asset.Group.Name === "Eyes2") {
						let property = KinkyDungeonPlayer.Appearance[A].Property;
						if (!property || property.Expression !== "Surprised") {
							KinkyDungeonPlayer.Appearance[A].Property = {Expression: "Surprised"};
							KDRefresh = true;
						}
					}
				}
				KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonCelestialPunish" + Math.floor(KDRandom() * 3)), "red", 2);
			}
		},
		"crystalPunish": (e, item, data) => {
			if (data.restraint && item === data.restraint) {
				KinkyDungeonChangeDistraction(1, false, 0.1);
				KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonCrystalPunish" + Math.floor(KDRandom() * 3)), "red", 2);
			}
		},
		"PunishPlayer": (e, item, data) => {
			if (data.restraint && item === data.restraint) {
				if (KDRandom() < e.chance || (KDGameData.WarningLevel > 2 && KDRandom() < e.warningchance)) {
					if (e.stun && KDGameData.WarningLevel > 2) {
						KinkyDungeonStatBlind = Math.max(KinkyDungeonStatBlind, e.stun);
						KinkyDungeonMovePoints = Math.max(-1, KinkyDungeonMovePoints - 1); // This is to prevent stunlock while slowed heavily
					}
					KDGameData.WarningLevel += 1;
					KinkyDungeonDealDamage({damage: e.power, type: e.damage});
					KinkyDungeonSendTextMessage(5, TextGet((e.msg ? e.msg : "KinkyDungeonPunishPlayer") + (KDGameData.WarningLevel > 2 ? "Harsh" : "")).replace("RestraintName", TextGet("Restraint" + item.name)), "red", 2);
					if (e.sfx) KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + e.sfx + ".ogg");
				}
			}
		}
	},
	"beforeStruggleCalc": {
		"elbowCuffsBlock": (e, item, data) => {
			if (data.restraint && item != data.restraint && !(KinkyDungeonHasGhostHelp() || KinkyDungeonHasAllyHelp()) && KDRestraint(data.restraint).shrine.includes("ArmCuffsBase")) {
				data.escapePenalty += e.power ? e.power : 1.0;
				KinkyDungeonSendTextMessage(10, TextGet("KDElbowCuffsBlock" + Math.floor(KDRandom() * 3)), "red", 2);
			}
		},
		"wristCuffsBlock": (e, item, data) => {
			if (data.restraint && item != data.restraint && !(KinkyDungeonHasGhostHelp() || KinkyDungeonHasAllyHelp()) && KDRestraint(data.restraint).shrine.includes("ArmCuffsBase")) {
				data.escapePenalty += e.power ? e.power : 0.075;
				KinkyDungeonSendTextMessage(5, TextGet("KDWristCuffsBlock" + Math.floor(KDRandom() * 3)), "red", 2);
			}
		},
	},
	"playerAttack": {
		"ShadowHeel": (e, item, data) => {
			if (data.targetX && data.targetY && !(data.enemy && data.enemy.Enemy && KDAllied(data.enemy))) {
				KinkyDungeonCastSpell(data.targetX, data.targetY, KinkyDungeonFindSpell("HeelShadowStrike", true), undefined, undefined, undefined);
				if (e.energyCost) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost);
			}
		},
		"AlertEnemies": (e, item, data) => {
			if (KDAlertCD < 1 && data.enemy && (!e.chance || KDRandom() < e.chance)) { // (data.damage && data.damage.damage && data.enemy.hp > data.enemy.Enemy.maxhp - data.damage.damage*2 - 1)
				KinkyDungeonAlert = Math.max(KinkyDungeonAlert, e.power);
				KDAlertCD = 5;
				KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonAlertEnemies").replace("RestraintName", TextGet("Restraint" + item.name)), "red", 2);
				if (e.sfx) KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + e.sfx + ".ogg");
			}
		},
		"PunishPlayer": (e, item, data) => {
			if (item.type === Restraint && data.targetX && data.targetY && data.enemy && !(data.enemy && data.enemy.Enemy && KDAllied(data.enemy)) && (!KinkyDungeonHiddenFactions.includes(KDGetFaction(data.enemy)) || KDGetFaction(data.enemy) == "Enemy")) {
				if (KDRandom() < e.chance || (KDGameData.WarningLevel > 2 && KDRandom() < e.warningchance)) {
					if (e.stun && KDGameData.WarningLevel > 2) {
						KinkyDungeonStatBlind = Math.max(KinkyDungeonStatBlind, e.stun);
						KinkyDungeonMovePoints = Math.max(-1, KinkyDungeonMovePoints - 1); // This is to prevent stunlock while slowed heavily
					}
					KDGameData.WarningLevel += 1;
					KinkyDungeonDealDamage({damage: e.power, type: e.damage});
					KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonPunishPlayer" + (KDGameData.WarningLevel > 2 ? "Harsh" : "")).replace("RestraintName", TextGet("Restraint" + item.name)), "red", 2);
					if (e.sfx) KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + e.sfx + ".ogg");
				}
			}
		}
	},
	"calcMiscast": {
		"ReduceMiscastFlat": (e, item, data) => {
			if (data.flags.miscastChance > 0) {
				data.flags.miscastChance -= e.power;
			}
		}
	},
	"remoteVibe": {
		"RemoveActivatedVibe": (e, item, data) => {
			if (!KDGameData.CurrentVibration) {
				KinkyDungeonStartVibration(item.name, "tease", KDGetVibeLocation(item), e.power, e.time, undefined, undefined, undefined, undefined, e.edgeOnly);
				KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonStartVibeRemote").replace("EnemyName", TextGet("Name" + data.enemy)), "pink", 2);
				if (e.sfx) KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + e.sfx + ".ogg");
			}
		}
	},
	"playerCast": {
		"MagicallySensitive": (e, item, data) => {
			if (!e.chance || KDRandom() < e.chance) {
				if (!KDGameData.CurrentVibration) {
					KinkyDungeonStartVibration(item.name, "tease", KDGetVibeLocation(item), e.power, e.time, undefined, undefined, undefined, undefined, e.edgeOnly);
				} else {
					KinkyDungeonAddVibeModifier(item.name, "reinforce", KDRestraint(item).Group, 1, e.time);
				}
				if (e.sfx) KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + e.sfx + ".ogg");
			}
		},
		"AlertEnemies": (e, item, data) => {
			if (!e.chance || KDRandom() < e.chance) {
				KinkyDungeonAlert = Math.max(KinkyDungeonAlert, e.power);
				KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonAlertEnemies").replace("RestraintName", TextGet("Restraint" + item.name)), "red", 2);
				if (e.sfx) KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + e.sfx + ".ogg");
			}
		},
		"PunishPlayer": (e, item, data) => {
			if (data.spell && item.type === Restraint && (!e.punishComponent || (data.spell.components && data.spell.components.includes(e.punishComponent)))) {
				if (KDRandom() < e.chance || (KDGameData.WarningLevel > 2 && KDRandom() < e.warningchance)) {
					if (e.stun && KDGameData.WarningLevel > 2) {
						KinkyDungeonStatBlind = Math.max(KinkyDungeonStatBlind, e.stun);
						KinkyDungeonMovePoints = Math.max(-1, KinkyDungeonMovePoints - 1); // This is to prevent stunlock while slowed heavily
					}
					KDGameData.WarningLevel += 1;
					KinkyDungeonDealDamage({damage: e.power, type: e.damage});
					KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonPunishPlayer" + (KDGameData.WarningLevel > 2 ? "Harsh" : "")).replace("RestraintName", TextGet("Restraint" + item.name)), "red", 2);
					if (e.sfx) KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + e.sfx + ".ogg");
				}
			}
		}
	}
};

/**
 *
 * @param {string} Event
 * @param {KinkyDungeonEvent} kinkyDungeonEvent
 * @param {item} item
 * @param {*} data
 */
function KinkyDungeonHandleInventoryEvent(Event, kinkyDungeonEvent, item, data) {
	if (Event === kinkyDungeonEvent.trigger && KDEventMapInventory[Event] && KDEventMapInventory[Event][kinkyDungeonEvent.type]) {
		KDEventMapInventory[Event][kinkyDungeonEvent.type](kinkyDungeonEvent, item, data);
	}
}


/**
 * @type {Object.<string, Object.<string, function(KinkyDungeonEvent, *, entity, *): void>>}
 */
let KDEventMapBuff = {
	"beforeAttack": {
		"CounterattackDamage": (e, buff, entity, data) => {
			if (data.attacker && data.target == entity && (!(e.prereq == "hit") || (!data.missed && data.hit))) {
				if (data.attacker.player) {
					KinkyDungeonDealDamage({damage: e.power, type: e.damage, bind: e.bind, time: e.time});
				} else {
					KinkyDungeonDamageEnemy(data.attacker, {damage: e.power, type: e.damage, bind: e.bind, time: e.time}, false, true, undefined, undefined, entity);
				}
				if (e.requiredTag)
					KinkyDungeonTickBuffTag(KinkyDungeonPlayerBuffs, e.requiredTag, 1);
			}
		},
		"CounterattackSpell": (e, buff, entity, data) => {
			if (data.attacker && data.target == entity && (!(e.prereq == "hit") || (!data.missed && data.hit))) {
				// @ts-ignore
				KinkyDungeonCastSpell(data.attacker.x, data.attacker.y, KinkyDungeonFindSpell(e.spell, true), undefined, undefined, undefined, entity.player ? "Player" : KDGetFaction(entity));
				if (e.requiredTag)
					KinkyDungeonTickBuffTag(KinkyDungeonPlayerBuffs, e.requiredTag, 1);
			}
		},
	},
	"afterDamageEnemy": {
		"ShrineElements": (e, buff, entity, data) => {
			if (data.enemy && data.enemy.hp > 0.52 && KDHostile(data.enemy) && data.faction == "Player" && !KDEventDataReset.ShrineElements && ["fire", "ice", "frost", "electric", "gravity"].includes(data.type)) {
				KDEventDataReset.ShrineElements = true;
				KinkyDungeonTickBuffTag(KinkyDungeonPlayerBuffs, "shrineElements", 1);
				KinkyDungeonCastSpell(data.enemy.x, data.enemy.y, KinkyDungeonFindSpell(e.spell, true), undefined, undefined, undefined, "Player");

			}
		},
	},
	"playerAttack": {
		"ShadowStep": (e, buff, entity, data) => {
			if (data.enemy && KDHostile(data.enemy) && !KinkyDungeonPlayerBuffs.ShadowStep) {
				KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {id: "ShadowStep", type: "SlowDetection", duration: e.time * 2, power: 0.667, player: true, enemies: true, endSleep: true, currentCount: -1, maxCount: 1, tags: ["SlowDetection", "hit", "cast"]});
				KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {id: "ShadowStep2", type: "Sneak", duration: e.time, power: Math.min(20, e.time * 2), player: true, enemies: true, endSleep: true, currentCount: -1, maxCount: 1, tags: ["Sneak", "hit", "cast"]});
				if (e.requiredTag)
					KinkyDungeonTickBuffTag(KinkyDungeonPlayerBuffs, e.requiredTag, 1);
			}
		},
	}
};

/**
 *
 * @param {string} Event
 * @param {any} buff
 * @param {any} entity
 * @param {*} data
 */
function KinkyDungeonHandleBuffEvent(Event, e, buff, entity, data) {
	if (Event === e.trigger && KDEventMapBuff[Event] && KDEventMapBuff[Event][e.type]) {
		KDEventMapBuff[Event][e.type](e, buff, entity, data);
	}
}


/**
 * @type {Object.<string, Object.<string, function(KinkyDungeonEvent, *, *): void>>}
 */
let KDEventMapOutfit = {
	"calcEvasion": {
		"AccuracyBuff": (e, outfit, data) => {
			if (data.enemy && data.enemy.Enemy && data.enemy.Enemy.tags.has(e.requiredTag)) {
				data.hitmult *= e.power;
			}
		},
	}
};

/**
 *
 * @param {string} Event
 * @param {any} outfit
 * @param {*} data
 */
function KinkyDungeonHandleOutfitEvent(Event, e, outfit, data) {
	if (Event === e.trigger && KDEventMapOutfit[Event] && KDEventMapOutfit[Event][e.type]) {
		KDEventMapOutfit[Event][e.type](e, outfit, data);
	}
}

/**
 * @type {Object.<string, Object.<string, function(KinkyDungeonEvent, *, *): void>>}
 */
let KDEventMapSpell = {
	"calcEvasion": {
		"HandsFree": (e, spell, data) => {
			if (!data.IsSpell && KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell)) && data.flags.KDEvasionHands) {
				data.flags.KDEvasionHands = false;
			}
		},
	},
	"tick": {
		"AccuracyBuff": (e, spell, data) => {
			if (KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell))) {
				//KDBlindnessCap = Math.min(KDBlindnessCap, e.power);
				KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {
					id: spell.name + e.type + e.trigger,
					type: "Accuracy",
					duration: 1,
					power: e.power,
				});
			}
		},
	},
	"calcStats": {
		"Blindness": (e, spell, data) => {
			if (KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell))) {
				//KDBlindnessCap = Math.min(KDBlindnessCap, e.power);
				KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {
					id: spell.name + e.type + e.trigger,
					type: "Blindness",
					duration: e.time ? e.time : 0,
					power: -1
				});
			}
		},
	},
	"beforeMove": {
		"FleetFooted": (e, spell, data) => {
			if (!data.IsSpell && !KinkyDungeonNoMoveFlag && KinkyDungeonSlowLevel > 1 && KinkyDungeonHasStamina(1.1) && KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell))) {
				let manacost = -KinkyDungeonGetManaCost(spell);
				e.prevSlowLevel = KinkyDungeonSlowLevel;
				KinkyDungeonSlowLevel = Math.max(0, KinkyDungeonSlowLevel - e.power);
				if (KinkyDungeonHasMana(1.5) && KinkyDungeonMovePoints < 0) {
					KinkyDungeonMovePoints = 0;
					manacost -= 1.5;
					KinkyDungeonSendActionMessage(4, TextGet("KinkyDungeonFleetFootedIgnoreSlow"), "lightgreen", 2);
				}
				else KinkyDungeonSendActionMessage(2, TextGet("KinkyDungeonFleetFooted"), "lightgreen", 2, false, true);
				KinkyDungeonChangeMana(manacost);
			}
		},
	},
	"afterMove": {
		"FleetFooted": (e, spell, data) => {
			if (e.prevSlowLevel && !data.IsSpell && KinkyDungeonSlowLevel < e.prevSlowLevel) {
				KinkyDungeonSlowLevel = e.prevSlowLevel;
				e.prevSlowLevel = undefined;
			}
		},
	},
	"beforeTrap": {
		"FleetFooted": (e, spell, data) => {
			if (data.flags.AllowTraps && !data.IsSpell && KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell))) {
				if (KDRandom() < e.chance) {
					KinkyDungeonChangeMana(-KinkyDungeonGetManaCost(spell));
					data.flags.AllowTraps = false;
					KinkyDungeonSendTextMessage(7, TextGet("KinkyDungeonFleetFootedIgnoreTrap"), "lightgreen", 2);
				} else {
					KinkyDungeonSendTextMessage(4, TextGet("KinkyDungeonFleetFootedIgnoreTrapFail"), "lightgreen", 2);
				}
			}
		},
	},
	"beforeDamageEnemy": {
		"MultiplyDamageStealth": (e, spell, data) => {
			if (data.dmg > 0 && data.enemy && KDHostile(data.enemy) && !data.enemy.aware) {
				if ((!e.humanOnly || data.enemy.Enemy.bound) && (!e.chance || KDRandom() < e.chance)) {
					data.dmg = Math.max(data.dmg * e.power, 0);
				}
			}
		},
	},
	"calcDamage": {
		"HandsFree": (e, spell, data) => {
			if (!data.IsSpell && KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell)) && data.flags.KDDamageHands) {
				data.flags.KDDamageHands = false;
			}
		},
	},
	"getWeapon": {
		"HandsFree": (e, spell, data) => {
			if (!data.IsSpell && KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell)) && data.flags && !data.flags.HandsFree) {
				data.flags.HandsFree = true;
			}
		},
	},
	"beforePlayerAttack" : {
		"Shatter": (e, spell, data) => {
			if (KinkyDungeonPlayerDamage && (KinkyDungeonPlayerDamage.name == "IceBreaker") && data.enemy && data.enemy.freeze && KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell))) {
				KinkyDungeonChangeMana(-KinkyDungeonGetManaCost(spell));
				KinkyDungeonCastSpell(data.enemy.x, data.enemy.y, KinkyDungeonFindSpell("ShatterStrike", true), undefined, undefined, undefined);
			}
		},
	},
	"playerAttack": {
		"FlameBlade": (e, spell, data) => {
			if (KinkyDungeonPlayerDamage && (KinkyDungeonPlayerDamage.name || KinkyDungeonStatsChoice.get("Brawler")) && KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell)) && data.targetX && data.targetY && (data.enemy && KDHostile(data.enemy))) {
				KinkyDungeonChangeMana(-KinkyDungeonGetManaCost(spell));
				KinkyDungeonCastSpell(data.targetX, data.targetY, KinkyDungeonFindSpell("FlameStrike", true), undefined, undefined, undefined);
			}
		},
		"ElementalEffect": (e, spell, data) => {
			if (KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell)) && !data.miss && !data.disarm && data.targetX && data.targetY && data.enemy && KDHostile(data.enemy)) {
				KinkyDungeonChangeMana(-KinkyDungeonGetManaCost(spell));
				KinkyDungeonDamageEnemy(data.enemy, {
					type: e.damage,
					damage: e.power,
					time: e.time,
					bind: e.bind
				}, false, true, undefined, undefined, KinkyDungeonPlayerEntity);
			}
		},
		"FloatingWeapon": (e, spell, data) => {
			if (KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell)) && data.targetX && data.targetY && !(data.enemy && data.enemy.Enemy && KDAllied(data.enemy))) {
				let chanceWith = KinkyDungeonPlayerDamage.chance;
				let chanceWithout = KinkyDungeonGetPlayerWeaponDamage(KinkyDungeonCanUseWeapon(true), true).chance;
				KinkyDungeonGetPlayerWeaponDamage(KinkyDungeonCanUseWeapon());
				if (KinkyDungeonPlayerDamage && KinkyDungeonPlayerDamage.name && chanceWithout < chanceWith)
					KinkyDungeonChangeMana(-KinkyDungeonGetManaCost(spell));
			}
		},
	},
	"beforeStruggleCalc": {
		"ModifyStruggle": (e, spell, data) => {
			if (KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell)) && data.escapeChance && (!e.StruggleType || data.StruggleType)) {
				KinkyDungeonChangeMana(-KinkyDungeonGetManaCost(spell));
				if (e.mult && data.escapeChance > 0)
					data.escapeChance *= e.mult;
				if (e.power)
					data.escapeChance += e.power;
				if (e.msg) {
					KinkyDungeonSendTextMessage(3, TextGet(e.msg), "yellow", 2);
				}
			}
		},
	},
	"vision": {
		"TrueSight": (e, spell, data) => {
			if (KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell)) && data.flags) {
				if (data.update)
					KinkyDungeonChangeMana(-KinkyDungeonGetManaCost(spell) * data.update);
				data.flags.SeeThroughWalls = Math.max(data.flags.SeeThroughWalls, 2);
			}
		},
	},
	"draw": {
		"EnemySense": (e, spell, data) => {
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
								(enemy.visual_x - data.CamX - data.CamX_offset) * KinkyDungeonGridSizeDisplay,
								(enemy.visual_y - data.CamY - data.CamY_offset) * KinkyDungeonGridSizeDisplay,
								KinkyDungeonSpriteSize / KinkyDungeonGridSizeDisplay,
								color, true, []);
					}
				}
			else if (!activate) {
				KinkyDungeonDisableSpell("EnemySense");
				KinkyDungeonExpireBuff(KinkyDungeonPlayerBuffs, "EnemySense");
			}
		},
	},
	"enemyStatusEnd": {
		"Shatter": (e, spell, data) => {
			if (data.enemy && data.status == "freeze" && KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell)) && data.enemy.playerdmg && KDHostile(data.enemy) && KDistChebyshev(data.enemy.x - KinkyDungeonPlayerEntity.x, data.enemy.y - KinkyDungeonPlayerEntity.y) < 10) {
				KinkyDungeonChangeMana(-KinkyDungeonGetManaCost(spell));
				KinkyDungeonCastSpell(data.enemy.x, data.enemy.y, KinkyDungeonFindSpell("ShatterStrike", true), undefined, undefined, undefined);
			}
		}
	},
	"kill": {
		"Shatter": (e, spell, data) => {
			if (data.enemy && data.enemy.freeze > 0 && KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell)) && data.enemy.playerdmg && KDHostile(data.enemy) && KDistChebyshev(data.enemy.x - KinkyDungeonPlayerEntity.x, data.enemy.y - KinkyDungeonPlayerEntity.y) < 10) {
				KinkyDungeonChangeMana(-KinkyDungeonGetManaCost(spell));
				KinkyDungeonCastSpell(data.enemy.x, data.enemy.y, KinkyDungeonFindSpell("ShatterStrike", true), undefined, undefined, undefined);
			}
		}
	},
};

/**
 *
 * @param {string} Event
 * @param {KinkyDungeonEvent} e
 * @param {any} spell
 * @param {*} data
 */
function KinkyDungeonHandleMagicEvent(Event, e, spell, data) {
	if (Event === e.trigger && KDEventMapSpell[Event] && KDEventMapSpell[Event][e.type]) {
		KDEventMapSpell[Event][e.type](e, spell, data);
	}
}


/**
 * @type {Object.<string, Object.<string, function(KinkyDungeonEvent, weapon, *): void>>}
 */
let KDEventMapWeapon = {
	"spellCast": {
		"BondageBustBoost": (e, weapon, data) => {
			if (!e.chance || KDRandom() < e.chance) {
				if (data.spell && data.spell.name == "BondageBustBeam" && data.bulletfired) {
					if (data.bulletfired.bullet && data.bulletfired.bullet.damage) {
						let dmgMult = e.power;
						let charge = KinkyDungeonPlayerBuffs[weapon.name + "Charge"] ? KinkyDungeonPlayerBuffs[weapon.name + "Charge"].duration : 0;
						data.bulletfired.bullet.damage.damage = data.bulletfired.bullet.damage.damage + dmgMult * charge;
						KinkyDungeonPlayerBuffs[weapon.name + "Charge"].duration = 0;

						if (e.energyCost) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost * charge);
						if (e.sfx && charge > 9) KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + e.sfx + ".ogg");
					}
				}

			}
		},
	},
	"tick": {
		"Charge": (e, weapon, data) => {
			if (KDGameData.AncientEnergyLevel > 0 && KinkyDungeonSlowMoveTurns < 1) {
				let currentCharge = KinkyDungeonPlayerBuffs[weapon.name + "Charge"] ? KinkyDungeonPlayerBuffs[weapon.name + "Charge"].duration : 0;
				KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {
					id: weapon.name + "Charge",
					type: e.buffType,
					aura: e.color,
					power: 1,
					duration: Math.min(e.power, currentCharge + 2),
				});
			}
		},
		"Buff": (e, weapon, data) => {
			KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {
				id: weapon.name,
				type: e.buffType,
				power: e.power,
				duration: 2
			});
		},
		"AoEDamageFrozen": (e, weapon, data) => {
			let trigger = false;
			for (let enemy of KinkyDungeonEntities) {
				if (KDHostile(enemy) && enemy.freeze && (!e.chance || KDRandom() < e.chance) && enemy.hp > 0 && KDistEuclidean(enemy.x - KinkyDungeonPlayerEntity.x, enemy.y - KinkyDungeonPlayerEntity.y) <= e.aoe) {
					KinkyDungeonDamageEnemy(enemy, {
						type: e.damage,
						damage: e.power,
						time: e.time
					}, false, true, undefined, undefined, KinkyDungeonPlayerEntity);
					trigger = true;
				}
			}
			if (trigger) {
				if (e.energyCost) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost);
			}
		},
		"AoEDamage": (e, weapon, data) => {
			let trigger = false;
			for (let enemy of KinkyDungeonEntities) {
				if (KDHostile(enemy) && (!e.chance || KDRandom() < e.chance) && enemy.hp > 0 && KDistEuclidean(enemy.x - KinkyDungeonPlayerEntity.x, enemy.y - KinkyDungeonPlayerEntity.y) <= e.aoe) {
					KinkyDungeonDamageEnemy(enemy, {
						type: e.damage,
						damage: e.power,
						time: e.time
					}, false, true, undefined, undefined, KinkyDungeonPlayerEntity);
					trigger = true;
				}
			}
			if (trigger) {
				if (e.energyCost) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost);
			}
		},
	},
	"playerAttack": {
		"ElementalEffect": (e, weapon, data) => {
			if (data.enemy && !data.miss && !data.disarm) {
				if (data.enemy && (!e.chance || KDRandom() < e.chance) && data.enemy.hp > 0) {
					KinkyDungeonDamageEnemy(data.enemy, {
						type: e.damage,
						damage: e.power,
						time: e.time,
						bind: e.bind
					}, false, true, undefined, undefined, KinkyDungeonPlayerEntity);
				}
			}
		},
		"ApplyBuff": (e, weapon, data) => {
			if (data.enemy && !data.miss && !data.disarm) {
				if (data.enemy && (!e.chance || KDRandom() < e.chance)) {
					if (!data.enemy.buffs) data.enemy.buffs = {};
					KinkyDungeonApplyBuff(data.enemy.buffs, e.buff);
				}
			}
		},
		"Cleave": (e, weapon, data) => {
			if (data.enemy && !data.disarm) {
				for (let enemy of KinkyDungeonEntities) {
					if (enemy != data.enemy && KDHostile(enemy)) {
						let dist = Math.max(Math.abs(enemy.x - KinkyDungeonPlayerEntity.x), Math.abs(enemy.y - KinkyDungeonPlayerEntity.y));
						if (dist < 1.5 && KinkyDungeonEvasion(enemy) && Math.max(Math.abs(enemy.x - data.enemy.x), Math.abs(enemy.y - data.enemy.y))) {
							KinkyDungeonDamageEnemy(enemy, {
								type: e.damage,
								damage: e.power,
								time: e.time
							}, false, true, undefined, undefined, KinkyDungeonPlayerEntity);
						}
					}
				}
			}
		},
		"CastSpell": (e, weapon, data) => {
			if (data.enemy && !data.disarm) {
				let spell = KinkyDungeonFindSpell(e.spell, true);
				KinkyDungeonCastSpell(data.enemy.x, data.enemy.y, spell, {
					x: KinkyDungeonPlayerEntity.x,
					y: KinkyDungeonPlayerEntity.y
				}, {x: data.enemy.x, y: data.enemy.y}, undefined);
				if (e.energyCost) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost);
			}
		},
		"Pierce": (e, weapon, data) => {
			if (data.enemy && !data.disarm) {
				let dist = e.dist ? e.dist : 1;
				for (let i = 1; i <= dist; i++) {
					let xx = data.enemy.x + i * (data.enemy.x - KinkyDungeonPlayerEntity.x);
					let yy = data.enemy.y + i * (data.enemy.y - KinkyDungeonPlayerEntity.y);
					for (let enemy of KinkyDungeonEntities) {
						if (enemy != data.enemy && KDHostile(enemy)) {
							if (KinkyDungeonEvasion(enemy) && enemy.x == xx && enemy.y == yy) {
								KinkyDungeonDamageEnemy(enemy, {
									type: e.damage,
									damage: e.power
								}, false, true, undefined, undefined, KinkyDungeonPlayerEntity);
							}
						}
					}
				}
			}
		},
		"DamageToTag": (e, weapon, data) => {
			if (data.enemy && !data.miss && !data.disarm) {
				if (data.enemy && data.enemy.Enemy.tags.has(e.requiredTag) && (!e.chance || KDRandom() < e.chance) && data.enemy.hp > 0) {
					KinkyDungeonDamageEnemy(data.enemy, {
						type: e.damage,
						damage: e.power,
						time: e.time,
						bind: e.bind
					}, false, true, undefined, undefined, KinkyDungeonPlayerEntity);
				}
			}
		},
		"Knockback": (e, weapon, data) => {
			if (e.dist && data.enemy && data.targetX && data.targetY && !data.miss && !data.disarm) {
				if (data.enemy.Enemy && !data.enemy.Enemy.tags.has("unflinching") && !data.enemy.Enemy.tags.has("stunresist") && !data.enemy.Enemy.tags.has("unstoppable") && !data.enemy.Enemy.tags.has("noknockback")) {
					let newX = data.targetX + Math.round(e.dist * (data.targetX - KinkyDungeonPlayerEntity.x));
					let newY = data.targetY + Math.round(e.dist * (data.targetY - KinkyDungeonPlayerEntity.y));
					if (KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(newX, newY)) && KinkyDungeonNoEnemy(newX, newY, true)
						&& (e.dist == 1 || KinkyDungeonCheckProjectileClearance(data.enemy.x, data.enemy.y, newX, newY))) {
						KDMoveEntity(data.enemy, newX, newY, false);
					}
				}
			}
		},
	},
	"beforeDamageEnemy": {
		"MultiplyTime": (e, weapon, data) => {
			if (data.time > 0 && (!e.damage || e.damage == data.type)) {
				if (!e.chance || KDRandom() < e.chance) {
					data.time = Math.ceil(data.time * e.power);
					if (e.energyCost) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost);
				}
			}
		},
		"MultiplyDamageFrozen": (e, weapon, data) => {
			if (data.enemy && data.enemy.freeze && data.dmg > 0 && (!e.damage || e.damage == data.type)) {
				if (!e.chance || KDRandom() < e.chance) {
					data.dmg = Math.ceil(data.dmg * e.power);
					if (e.energyCost) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost);
				}
			}
		},
		"EchoDamage": (e, weapon, data) => {
			if (data.enemy && (!data.flags || !data.flags.includes("EchoDamage")) && data.dmg > 0 && (!e.damage || e.damage == data.type)) {
				if (!e.chance || KDRandom() < e.chance) {
					let trigger = false;
					for (let enemy of KinkyDungeonEntities) {
						if ((enemy.rage || (KDAllied(enemy) && KDAllied(data.enemy)) || (KDHostile(enemy) && KDHostile(data.enemy))) && enemy != data.enemy && enemy.hp > 0 && KDistEuclidean(enemy.x - data.enemy.x, enemy.y - data.enemy.y) <= e.aoe) {
							KinkyDungeonDamageEnemy(enemy, {
								type: e.damage,
								damage: e.power,
								time: e.time,
								flags: ["EchoDamage"]
							}, false, true, undefined, undefined, KinkyDungeonPlayerEntity);
							trigger = true;
						}
					}
					if (trigger) {
						if (e.energyCost) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost);
					}
				}
			}
		},
	},
	"afterDamageEnemy": {
		"Dollmaker": (e, weapon, data) => {
			if (data.attacker && data.attacker.player && data.enemy && KDBoundEffects(data.enemy) > 3 && data.enemy.hp < 0.01 && !data.enemy.Enemy.allied) {
				if (!e.chance || KDRandom() < e.chance) {
					let Enemy = KinkyDungeonGetEnemyByName("AllyDoll");
					KinkyDungeonEntities.push({
						summoned: true,
						rage: Enemy.summonRage ? 9999 : undefined,
						Enemy: Enemy,
						id: KinkyDungeonGetEnemyID(),
						x: data.enemy.x,
						y: data.enemy.y,
						hp: (Enemy.startinghp) ? Enemy.startinghp : Enemy.maxhp,
						movePoints: 0,
						attackPoints: 0
					});
					if (e.energyCost) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost);
				}
			}
		},
	},
};

/**
 *
 * @param {string} Event
 * @param {KinkyDungeonEvent} e
 * @param {weapon} weapon
 * @param {*} data
 */
function KinkyDungeonHandleWeaponEvent(Event, e, weapon, data) {
	if (Event === e.trigger && KDEventMapWeapon[Event] && KDEventMapWeapon[Event][e.type]) {
		KDEventMapWeapon[Event][e.type](e, weapon, data);
	}
}


/**
 * @type {Object.<string, Object.<string, function(KinkyDungeonEvent, *, *): void>>}
 */
let KDEventMapBullet = {
	"beforeBulletHit": {
		"DropKnife": (e, b, data) => {
			let point = {x: b.x, y: b.y};
			if (!KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(point.x, point.y))) {
				if (b.vx || b.vy) {
					let speed = KDistEuclidean(b.vx, b.vy);
					if (KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(Math.round(b.x - b.vx / speed), Math.round(b.y - b.vy / speed)))) {
						point = {x: Math.round(b.x - b.vx / speed), y: Math.round(b.y - b.vy / speed)};
					}
					else if (KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(Math.floor(b.x - b.vx / speed), Math.floor(b.y - b.vy / speed)))) {
						point = {x: Math.floor(b.x - b.vx / speed), y: Math.floor(b.y - b.vy / speed)};
					}
					else {
						point = {x: Math.ceil(b.x - b.vx / speed), y: Math.ceil(b.y - b.vy / speed)};
					}
				}
			}
			KinkyDungeonDropItem({name: "Knife"}, point, KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(point.x, point.y)), true, true);
		},
	},
	"bulletHitEnemy": {
		"ElementalOnSlowOrBind": (e, b, data) => {
			if (b && data.enemy && (data.enemy.slow || data.enemy.bind)) {
				KinkyDungeonDamageEnemy(data.enemy, {
					type: e.damage,
					damage: e.power,
					time: e.time,
					bind: e.bind
				}, true, (b.bullet.NoMsg || e.power == 0), b.bullet.spell, b, undefined, b.delay, true);
			}
		},
	},
};

/**
 *
 * @param {string} Event
 * @param {KinkyDungeonEvent} e
 * @param {any} b
 * @param {*} data
 */
function KinkyDungeonHandleBulletEvent(Event, e, b, data) {
	if (Event === e.trigger && b.bullet && KDEventMapBullet[Event] && KDEventMapBullet[Event][e.type]) {
		KDEventMapBullet[Event][e.type](e, b, data);
	}
}




/**
 * @type {Object.<string, Object.<string, function(KinkyDungeonEvent, entity, *): void>>}
 */
let KDEventMapEnemy = {
	"afterEnemyTick": {
		"electrifyLocal": (e, enemy, data) => {
			if (data.delta && (enemy.aware || enemy.vp > 0.5) && KinkyDungeonCanCastSpells(enemy) && ((data.allied && KDAllied(enemy)) || (!data.allied && !KDAllied(enemy)))) {
				if (!e.chance || KDRandom() < e.chance) {
					let count = e.power ? e.power : 1;
					let rad = e.aoe ? e.aoe : 1.5;
					let minrad = 0.5;
					for (let i = 0; i < count; i++) {
						let slots = [];
						for (let X = -Math.ceil(rad); X <= Math.ceil(rad); X++)
							for (let Y = -Math.ceil(rad); Y <= Math.ceil(rad); Y++) {
								if (Math.sqrt(X*X+Y*Y) <= rad && (!minrad || Math.sqrt(X*X+Y*Y) >= minrad)) {
									if ((enemy.x + X > 0 && enemy.y + Y > 0 && enemy.x + X < KinkyDungeonGridWidth && enemy.y + Y < KinkyDungeonGridHeight)
										&& KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(enemy.x + X, enemy.y + Y)))
										slots.push({x:X, y:Y});
								}
							}

						if (slots.length > 0) {
							let slot = slots[Math.floor(KDRandom() * slots.length)];
							if (slot) {
								KinkyDungeonCastSpell(enemy.x + slot.x, enemy.y + slot.y, KinkyDungeonFindSpell("WitchElectrify", true), enemy, undefined, undefined);
							}
						}

					}
				}
			}
		},
	},
};

/**
 *
 * @param {string} Event
 * @param {KinkyDungeonEvent} e
 * @param {entity} enemy
 * @param {*} data
 */
function KinkyDungeonHandleEnemyEvent(Event, e, enemy, data) {
	if (Event === e.trigger && KDEventMapEnemy[Event] && KDEventMapEnemy[Event][e.type]) {
		KDEventMapEnemy[Event][e.type](e, enemy, data);
	}
}




function KDEventPrereq(e, item, tags) {
	if (tags) {
		if (!tags.length) {
			tags = [tags];
		}
		for (let t of tags) {
			if (t == "locked") {
				return item.lock != undefined && item.lock != "";
			}
		}
	}
	return true;
}