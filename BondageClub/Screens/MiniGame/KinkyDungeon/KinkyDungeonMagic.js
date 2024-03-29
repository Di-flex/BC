"use strict";
let KinkyDungeonManaCost = 10; // The base mana cost of a spell, multiplied by the spell's level


let KinkyDungeonBookScale = 1.3;

let KinkyDungeonMysticSeals = 0; // Mystic seals are used to unlock a spell from one of 3 books:
// 0 Ars Pyrotecnica - Elemental magic such as fireballs, ice, wind, etc
// 1 Codex Imaginus - Conjuring things such as weapons and restraints, and also enchanting (and disenchanting)
// 2 Clavicula Romantica - Illusory magic, disorientation and affecting enemy AI

// Magic book image source: https://www.pinterest.es/pin/54324739242326557/

// Note that you have these 3 books in your inventory at the start; you select the page open in each of them but you need to have hands free or else you can only turn to a random page at a time. If you are blind, you also can't see any page after you turn the page

let KinkyDungeonCurrentBook = "Elements";
let KinkyDungeonCurrentPage = 0;
let KinkyDungeonCurrentSpellsPage = 0;
let KinkyDungeonBooks = ["Elements", "Conjure", "Illusion"];
let KinkyDungeonPreviewSpell = null;

let KinkyDungeonSpellChoices = [0, 1, 2];
let KinkyDungeonSpellChoicesToggle = [true, true];
let KinkyDungeonSpellChoiceCount = 5;

let KinkyDungeonSpellOffset = 100;
let KinkyDungeonSpellChoiceOffset = 80;

let KDPlayerHitBy = [];

function KinkyDungeonSearchSpell(list, name) {
	for (let spell of list) {
		if (spell.name == name) return spell;
	}
	return null;
}

function KinkyDungeonFindSpell(name, SearchEnemies) {
	if (SearchEnemies) {
		let spell = KinkyDungeonSearchSpell(KinkyDungeonSpellListEnemies, name);
		if (spell) return spell;
	}
	let spell2 = KinkyDungeonSearchSpell(KinkyDungeonSpellsStart, name);
	if (spell2) return spell2;
	for (let key in KinkyDungeonSpellList) {
		let list = KinkyDungeonSpellList[key];
		let spell = KinkyDungeonSearchSpell(list, name);
		if (spell) return spell;
	}
	return KinkyDungeonSearchSpell(KinkyDungeonSpells, name);
}

function KinkyDungeonDisableSpell(Name) {
	for (let i = 0; i < KinkyDungeonSpellChoices.length; i++) {
		if (KinkyDungeonSpells[KinkyDungeonSpellChoices[i]] && KinkyDungeonSpells[KinkyDungeonSpellChoices[i]].name == Name) {
			KinkyDungeonSpellChoicesToggle[i] = false;
			if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Click.ogg");
		}
	}
}

let KinkyDungeonSpellPress = "";

function KinkyDungeonResetMagic() {
	KinkyDungeonSpellChoices = [0, 1, 2];
	KinkyDungeonSpellChoicesToggle = [true, true];
	KinkyDungeonSpellChoiceCount = 3;
	KinkyDungeonSpells = [];
	Object.assign(KinkyDungeonSpells, KinkyDungeonSpellsStart); // Copy the dictionary
	KinkyDungeonMysticSeals = 1.3;
	KinkyDungeonSpellPress = "";
	KinkyDungeonCurrentPage = 0;
	KinkyDungeonCurrentSpellsPage = 0;
	KinkyDungeonSpellPoints = 3;
	if (KinkyDungeonStatsChoice.get("randomMode")) {
		KinkyDungeonSpells.push({name: "SpellChoiceUp1", school: "Any", manacost: 0, components: [], spellPointCost: 1, level:3, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"});
		KinkyDungeonSpells.push({name: "SpellChoiceUp2", school: "Any", manacost: 0, components: [], spellPointCost: 1, level:4, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"});
		KinkyDungeonSpells.push({name: "SpellChoiceUp3", school: "Any", manacost: 0, components: [], spellPointCost: 1, level:5, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"});
	}
	if (KinkyDungeonStatsChoice.get("Studious")) {
		KinkyDungeonSpellPoints += 3;
	}
}


function KinkyDungeonPlayerEffect(damage, playerEffect, spell, faction) {
	if (!playerEffect.name) return;
	let effect = false;
	let sfx = spell.hitsfx;
	if (!sfx) sfx = (playerEffect.power && playerEffect.power < 2) ? "DamageWeak" : "Damage";
	if (damage == "inert") return;
	if (playerEffect.hitTag && !KDPlayerHitBy.includes(playerEffect.hitTag)) KDPlayerHitBy.push(playerEffect.hitTag);
	else if (playerEffect.hitTag) return;
	if (!playerEffect.chance || KDRandom() < playerEffect.chance) {
		if (playerEffect.name == "Ampule") {
			KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonSpellShatter" + spell.name), "red", 1);
			effect = true;
		} if (playerEffect.name == "AmpuleBlue") {
			let restraintAdd = KinkyDungeonGetRestraint({tags: ["latexRestraints"]}, MiniGameKinkyDungeonLevel + spell.power, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
			if (restraintAdd) {
				KinkyDungeonAddRestraintIfWeaker(restraintAdd, spell.power, false, undefined, false, false, undefined, faction);
				KDSendStatus('bound', restraintAdd.name, "spell_" + spell.name);
				KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonSpellShatterBind" + spell.name), "red", 1);
				effect = true;
			} else {
				if (KinkyDungeonCurrentDress != "BlueSuit") {
					KinkyDungeonSetDress("BlueSuit", "Latex");
					KinkyDungeonDressPlayer();
					KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonSpellShatterDress" + spell.name), "red", 1);
					effect = true;
				} else {
					KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonSpellShatter" + spell.name), "red", 1);
				}
				let dmg = KinkyDungeonDealDamage({damage: playerEffect.power, type: playerEffect.damage});
				if (dmg) effect = true;
			}
		} if (playerEffect.name == "ShadowStrike") {
			let restraintAdd = KinkyDungeonGetRestraint({tags: ["shadowRestraints"]}, MiniGameKinkyDungeonLevel + spell.power, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
			if (restraintAdd) {
				KinkyDungeonAddRestraintIfWeaker(restraintAdd, spell.power, false, undefined, false, false, undefined, faction);
				KDSendStatus('bound', restraintAdd.name, "spell_" + spell.name);
				KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonSpellShadowStrike"), "red", 1);
				effect = true;
			}
			let dmg = KinkyDungeonDealDamage({damage: playerEffect.power, type: playerEffect.damage});
			if (dmg) effect = true;
		} if (playerEffect.name == "Damage") {
			let dmg = KinkyDungeonDealDamage({damage: Math.max((spell.aoepower) ? spell.aoepower : 0, spell.power), type: spell.damage});
			KinkyDungeonSendTextMessage(Math.min(spell.power, 5), TextGet("KinkyDungeonDamageSelf").replace("DamageDealt", dmg), "red", 1);
			if (dmg) effect = true;
		} else if (playerEffect.name == "Ignition") {
			let dmg = KinkyDungeonDealDamage({damage: playerEffect.power, type: playerEffect.damage});
			KinkyDungeonSendTextMessage(playerEffect.power, TextGet("KinkyDungeonBuffIgniteDamage").replace("DamageDealt", dmg), "red", 1);
			if (dmg) effect = true;
		} else if (playerEffect.name == "DamageNoMsg") {
			let dmg = KinkyDungeonDealDamage({damage: playerEffect.power, type: playerEffect.damage});
			if (dmg) effect = true;
		} else if (playerEffect.name == "Blind") {
			KinkyDungeonStatBlind = Math.max(KinkyDungeonStatBlind, playerEffect.time);
			KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonBlindSelf"), "red", playerEffect.time);
			effect = true;
		} else if (playerEffect.name == "Hairpin") {
			KinkyDungeonStatBlind = Math.max(KinkyDungeonStatBlind, playerEffect.time);
			KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonHairpin"), "red", playerEffect.time);
			if (spell.power > 0) {
				effect = true;
				KinkyDungeonDealDamage({damage: playerEffect.power, type: playerEffect.damage});
			}
			effect = true;
		} else if (playerEffect.name == "MagicRope") {
			let roped = false;
			roped = roped || KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("WeakMagicRopeArms"), 0, false, undefined, false, false, undefined, faction) > 0;
			roped = roped || KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("WeakMagicRopeLegs"), 0, false, undefined, false, false, undefined, faction) > 0;

			if (roped) KDSendStatus('bound', "WeakMagicRopeArms", "spell_" + spell.name);
			KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonMagicRopeSelf"), "red", playerEffect.time);
			if (roped)
				effect = true;
		} else if (playerEffect.name == "SlimeTrap") {
			let slimeWalker = false;
			for (let inv of KinkyDungeonAllRestraint()) {
				if (KDRestraint(inv).slimeWalk) {
					slimeWalker = true;
					break;
				}
			}
			if (!slimeWalker) {
				if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "glueDamageResist") < 0.45) {
					effect = KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("StickySlime"), 0, false, undefined, false, false, undefined, faction) > 0;
					if (effect) KDSendStatus('bound', "StickySlime", "spell_" + spell.name);
					KinkyDungeonMovePoints = -1;
				}
				KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonSlime"), "red", playerEffect.time);

				if (spell.power > 0) {
					effect = true;
					KinkyDungeonDealDamage({damage: spell.power, type: spell.damage});
				}
			}
		} else if (playerEffect.name == "Slime") {
			if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "glueDamageResist") < 0.45) {
				effect = KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("StickySlime"), 0, false, undefined, false, false, undefined, faction) > 0;
				if (effect) KDSendStatus('bound', "StickySlime", "spell_" + spell.name);
				KinkyDungeonMovePoints = -1;
			}
			KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonSlime"), "red", playerEffect.time);

			if (spell.power > 0) {
				effect = true;
				KinkyDungeonDealDamage({damage: spell.power, type: spell.damage});
			}
		} else if (playerEffect.name == "MiniSlime") {
			if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "glueDamageResist") < 0.45 && KDRandom() < 0.33) {
				KinkyDungeonMovePoints = -1;
				KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonMiniSlime2"), "red", 2);
			} else
				KinkyDungeonSendTextMessage(4, TextGet("KinkyDungeonMiniSlime"), "red", 1);

			if (spell.power > 0) {
				effect = true;
				KinkyDungeonDealDamage({damage: spell.power, type: spell.damage});
			}
		} else if (playerEffect.name == "RemoveLowLevelRope") {
			let restraints = [];
			for (let inv of KinkyDungeonAllRestraint()) {
				if (KDRestraint(inv).power < 5 && KDRestraint(inv).shrine && KDRestraint(inv).shrine.includes("Rope")) {
					restraints.push(KDRestraint(inv).Group);
				}
			}
			for (let r of restraints) {
				if (effect) KDSendStatus('escape', KinkyDungeonGetRestraintItem(r).name, "spell_" + spell.name);
				KinkyDungeonRemoveRestraint(r, false);
			}
			KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonRemoveLowLevelRope"), "lightGreen", 2);
		} else if (playerEffect.name == "Shock") {
			KinkyDungeonStatBlind = Math.max(KinkyDungeonStatBlind, playerEffect.time);
			KinkyDungeonMovePoints = Math.max(-1, KinkyDungeonMovePoints-1); // This is to prevent stunlock while slowed heavily
			KinkyDungeonDealDamage({damage: spell.power, type: spell.damage});
			KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonShock"), "red", playerEffect.time);
			effect = true;
		} else if (playerEffect.name == "CoronaShock") {
			let restraintAdd = KinkyDungeonGetRestraint({tags: ["celestialRopes"]}, MiniGameKinkyDungeonLevel + spell.power, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
			if (restraintAdd) {
				KinkyDungeonAddRestraintIfWeaker(restraintAdd, spell.power, false, undefined, false, false, undefined, faction);
				KDSendStatus('bound', restraintAdd.name, "spell_" + spell.name);
			}// else if (KDGameData.PrisonerState != 'jail' && KDGameData.PrisonerState != 'parole') {
			//KinkyDungeonCallGuard(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y);
			//}
			KinkyDungeonStatBlind = Math.max(KinkyDungeonStatBlind, playerEffect.time);
			KinkyDungeonMovePoints = Math.max(-1, KinkyDungeonMovePoints-1); // This is to prevent stunlock while slowed heavily
			KinkyDungeonDealDamage({damage: spell.power, type: spell.damage});
			KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonCoronaShock"), "red", playerEffect.time);
			effect = true;
		} else if (playerEffect.name == "CrystalBind") {
			let restraintAdd = KinkyDungeonGetRestraint({tags: ["crystalRestraints"]}, MiniGameKinkyDungeonLevel + spell.power, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
			if (restraintAdd) {
				KinkyDungeonAddRestraintIfWeaker(restraintAdd, spell.power, false, undefined, false, false, undefined, faction);
				KDSendStatus('bound', restraintAdd.name, "spell_" + spell.name);
			}//else if (KDGameData.PrisonerState != 'jail' && KDGameData.PrisonerState != 'parole') {
			//KinkyDungeonCallGuard(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y);
			//}
			KinkyDungeonMovePoints = Math.max(-1, KinkyDungeonMovePoints-1); // This is to prevent stunlock while slowed heavily
			KinkyDungeonDealDamage({damage: spell.power, type: spell.damage});
			KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonCrystalBind"), "red", 3);
			effect = true;
		} else if (playerEffect.name == "MysticShock") {
			KinkyDungeonStatBlind = Math.max(KinkyDungeonStatBlind, playerEffect.time);
			KinkyDungeonMovePoints = Math.max(-1, KinkyDungeonMovePoints-1); // This is to prevent stunlock while slowed heavily
			KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonMysticShock"), "red", playerEffect.time);
			if (spell.power > 0) {
				KinkyDungeonDealDamage({damage: spell.power, type: spell.damage});
			}
			effect = true;
		} else if (playerEffect.name == "RobotShock") {
			KinkyDungeonStatBlind = Math.max(KinkyDungeonStatBlind, playerEffect.time);
			KinkyDungeonMovePoints = Math.max(-1, KinkyDungeonMovePoints-1); // This is to prevent stunlock while slowed heavily
			KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonRobotShock"), "red", playerEffect.time);
			if (spell.power > 0) {
				KinkyDungeonDealDamage({damage: spell.power, type: spell.damage});
			}
			effect = true;
		} else if (playerEffect.name == "HeatBlast") {
			KinkyDungeonStatBlind = Math.max(KinkyDungeonStatBlind, playerEffect.time);
			KinkyDungeonMovePoints = Math.max(-1, KinkyDungeonMovePoints-1); // This is to prevent stunlock while slowed heavily
			KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonHeatBlast"), "red", playerEffect.time);
			if (spell.power > 0) {
				KinkyDungeonDealDamage({damage: spell.power, type: spell.damage});
			}
			effect = true;
		}  else if (playerEffect.name == "RubberBullets") {
			if (KDRandom() < 0.25 && KinkyDungeonStatStamina < KinkyDungeonStatStaminaMax/2) {
				let restraintAdd = KinkyDungeonGetRestraint({tags: ["slimeRestraintsRandom"]}, MiniGameKinkyDungeonLevel + spell.power, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
				if (restraintAdd) {
					KinkyDungeonAddRestraintIfWeaker(restraintAdd, spell.power, false, undefined, false, false, undefined, faction);
					KDSendStatus('bound', restraintAdd.name, "spell_" + spell.name);
					KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonRubberBulletsAttach"), "red", 2);
				}
			} else KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonRubberBullets"), "red", 2);
			if (spell.power > 0) {
				KinkyDungeonDealDamage({damage: KinkyDungeonStatStamina < KinkyDungeonStatStaminaMax/2 ? spell.power : spell.power*1.5, type: spell.damage});
			}
			effect = true;
		} else if (playerEffect.name == "SingleChain") {
			let restraintAdd = KinkyDungeonGetRestraint({tags: ["chainRestraints"]}, MiniGameKinkyDungeonLevel + spell.power, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
			if (restraintAdd) {
				KinkyDungeonAddRestraintIfWeaker(restraintAdd, spell.power, false, undefined, false, false, undefined, faction);
				KDSendStatus('bound', restraintAdd.name, "spell_" + spell.name);
				KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonSingleChain"), "red", playerEffect.time);
				effect = true;
			} else {
				KinkyDungeonMovePoints = Math.max(-1, KinkyDungeonMovePoints-1); // This is to prevent stunlock while slowed heavily
				KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonSlowedBySpell"), "yellow", playerEffect.time);
				KinkyDungeonDealDamage({damage: spell.power*2, type: spell.damage});
				effect = true;
			}

		} else  if (playerEffect.name == "SingleMagicChain") {
			let restraintAdd = KinkyDungeonGetRestraint({tags: ["chainRestraintsMagic"]}, MiniGameKinkyDungeonLevel + spell.power, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
			if (restraintAdd) {
				KinkyDungeonAddRestraintIfWeaker(restraintAdd, spell.power, false, undefined, false, false, undefined, faction);
				KDSendStatus('bound', restraintAdd.name, "spell_" + spell.name);
				KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonSingleChain"), "red", playerEffect.time);
				effect = true;
			}

		} else if (playerEffect.name == "Spores") {
			KinkyDungeonSleepiness = Math.max(KinkyDungeonSleepiness, 6);
			KinkyDungeonSendTextMessage(6, TextGet("KinkyDungeonSpores"), "#a583ff", 2);
			KinkyDungeonDealDamage({damage: spell.power, type: spell.damage});
			effect = true;
		} else if (playerEffect.name == "PoisonDagger") {
			KinkyDungeonSendTextMessage(6, TextGet("KDPoisonDagger"), "#green", 2);
			KinkyDungeonDealDamage({damage: playerEffect.power, type: playerEffect.damage});
			KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {id: "PoisonDagger", aura: "#22ff44", type: "Sleepiness", power: 1, duration: playerEffect.time, player: true, enemies: false, tags: ["sleep"], range: 1.5});
			effect = true;
		} else if (playerEffect.name == "SporesSick") {
			KinkyDungeonSleepiness += 2;
			KinkyDungeonSendTextMessage(6, TextGet("KinkyDungeonSporesSick"), "#63ab3f", 2);
			KinkyDungeonDealDamage({damage: spell.power, type: spell.damage});
			effect = true;
		} else if (playerEffect.name == "Flummox") {
			KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {id: "Flummox", type: "Flummox", duration: 5, power: 1.0, player: true, mushroom: true, tags: ["overlay", "darkness"]});
			KinkyDungeonSendTextMessage(6, TextGet("KinkyDungeonFlummox"), "#a583ff", 2);
			KinkyDungeonDealDamage({damage: spell.power, type: spell.damage});
			effect = true;
		} else if (playerEffect.name == "SingleRope" || playerEffect.name == "BanditBola") {
			if (playerEffect.name == "BanditBola") {
				KinkyDungeonMovePoints = Math.max(-1, KinkyDungeonMovePoints-1); // This is to prevent stunlock while slowed heavily
			}
			let restraintAdd = KinkyDungeonGetRestraint({tags: ["ropeRestraints"]}, MiniGameKinkyDungeonLevel + spell.power, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
			if (restraintAdd) {
				KinkyDungeonAddRestraintIfWeaker(restraintAdd, spell.power, false, undefined, false, false, undefined, faction);
				KDSendStatus('bound', restraintAdd.name, "spell_" + spell.name);
				KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonSingleRope"), "red", playerEffect.time);
				effect = true;
			} else {
				KinkyDungeonMovePoints = Math.max(-1, KinkyDungeonMovePoints-1); // This is to prevent stunlock while slowed heavily
				KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonSlowedBySpell"), "yellow", playerEffect.time);
				KinkyDungeonDealDamage({damage: spell.power*2, type: spell.damage});
				effect = true;
			}

		} else if (playerEffect.name == "RestrainingDevice") {
			let added = [];
			for (let i = 0; i < playerEffect.count; i++) {
				let restraintAdd = KinkyDungeonGetRestraint({tags: ["hitechCables"]}, MiniGameKinkyDungeonLevel + spell.power, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
				if (restraintAdd && KinkyDungeonAddRestraintIfWeaker(restraintAdd, spell.power, false, undefined, false, false, undefined, faction)) {
					KDSendStatus('bound', restraintAdd.name, "spell_" + spell.name);
					added.push(restraintAdd);
					effect = true;
				}
			}
			if (added.length > 0) {
				KinkyDungeonSendTextMessage(6, TextGet("KinkyDungeonRestrainingDevice"), "red", 2);
				effect = true;
			} else {
				KinkyDungeonStatBlind = Math.max(KinkyDungeonStatBlind, playerEffect.time);
				KinkyDungeonMovePoints = Math.max(-1, KinkyDungeonMovePoints-1); // This is to prevent stunlock while slowed heavily
				KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonRestrainingDeviceStun"), "yellow", playerEffect.time);
				KinkyDungeonDealDamage({damage: spell.power, type: spell.damage});
				effect = true;
			}

		} else if (playerEffect.name == "Glue") {
			let added = [];
			if (KinkyDungeonLastAction == "Move")
				for (let i = 0; i < playerEffect.count; i++) {
					let restraintAdd = KinkyDungeonGetRestraint({tags: ["glueRestraints"]}, MiniGameKinkyDungeonLevel + spell.power, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
					if (restraintAdd && KinkyDungeonAddRestraintIfWeaker(restraintAdd, spell.power, false, undefined, false, false, undefined, faction)) {
						KDSendStatus('bound', restraintAdd.name, "spell_" + spell.name);
						added.push(restraintAdd);
						effect = true;
					}
				}
			if (added.length > 0) {
				KinkyDungeonSendTextMessage(6, TextGet("KinkyDungeonGlue"), "yellow", 2);
				effect = true;
			} else {
				KinkyDungeonMovePoints = Math.max(-1, KinkyDungeonMovePoints-1); // This is to prevent stunlock while slowed heavily
				KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonGlueSlow"), "yellow", playerEffect.time);
				if (playerEffect.power) {
					KinkyDungeonSendTextMessage(4, TextGet("KinkyDungeonGlueSlowDamage").replace("DamageDealt", playerEffect.power), "yellow", 2);
					KinkyDungeonDealDamage({damage: playerEffect.power, type: playerEffect.damage});
				} else KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonGlueSlow"), "yellow", playerEffect.time);
				effect = true;
			}

		} else if (playerEffect.name == "RopeEngulf") {
			let added = [];
			for (let i = 0; i < playerEffect.power; i++) {
				let restraintAdd = KinkyDungeonGetRestraint({tags: ["ropeMagicStrong", "ropeAuxiliary", "clothRestraints", "tapeRestraints"]}, MiniGameKinkyDungeonLevel + spell.power, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
				if (restraintAdd && KinkyDungeonAddRestraintIfWeaker(restraintAdd, spell.power, false, undefined, false, false, undefined, faction)) {
					KDSendStatus('bound', restraintAdd.name, "spell_" + spell.name);
					added.push(restraintAdd);
					effect = true;
				}
			}
			if (added.length > 0) {
				KinkyDungeonSendTextMessage(6, TextGet("KinkyDungeonRopeEngulf"), "red", 2);
				effect = true;
			} else {
				let RopeDresses = ["Leotard", "Bikini", "Lingerie"];
				if (!RopeDresses.includes(KinkyDungeonCurrentDress)) {
					KinkyDungeonSetDress(RopeDresses[Math.floor(Math.random() * RopeDresses.length)], "");
					KinkyDungeonDressPlayer();
					KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonRopeEngulfDress"), "red", 3);
					effect = true;
				} else {
					//KinkyDungeonCallGuard(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y);
					let restraintAdd = KinkyDungeonGetRestraint({tags: ["ropeMagicHogtie"]}, MiniGameKinkyDungeonLevel + spell.power, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
					if (restraintAdd && KinkyDungeonAddRestraintIfWeaker(restraintAdd, spell.power, false, undefined, false, false, undefined, faction)) {
						KDSendStatus('bound', restraintAdd.name, "spell_" + spell.name);
						KinkyDungeonSendTextMessage(6, TextGet("KinkyDungeonRopeEngulf"), "red", 2);
						effect = true;
					} else {
						let buff1 = {id: "KrakenEngulf", type: "Blindness", duration: 8, power: 1.0, player: true, tags: []};
						let buff2 = {id: "KrakenEngulf2", type: "Blindness", duration: 8, power: 2.0, player: true, tags: []};
						let buff3 = {id: "KrakenEngulf3", type: "Blindness", duration: 8, power: 4.0, player: true, tags: []};
						if (KinkyDungeonPlayerBuffs[buff3.id]) {
							KinkyDungeonPassOut();
						} else if (KinkyDungeonPlayerBuffs[buff2.id]) {
							KinkyDungeonSendTextMessage(9, TextGet("KinkyDungeonRopeEngulfEnd3"), "red", 4);
							KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, buff1);
							KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, buff2);
							KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, buff3);
						}  else if (KinkyDungeonPlayerBuffs[buff1.id]) {
							KinkyDungeonSendTextMessage(8, TextGet("KinkyDungeonRopeEngulfEnd2"), "red", 4);
							KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, buff1);
							KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, buff2);
						} else {
							KinkyDungeonSendTextMessage(7, TextGet("KinkyDungeonRopeEngulfEnd1"), "red", 4);
							KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, buff1);
						}
					}

					//KinkyDungeonSetFlag("kraken", 4);
				}
			}
		} else if (playerEffect.name == "RopeEngulfWeak") {
			let added = [];
			for (let i = 0; i < playerEffect.power; i++) {
				let restraintAdd = KinkyDungeonGetRestraint({tags: ["ropeRestraints", "ropeRestraints2", "ropeRestraintsWrist"]}, MiniGameKinkyDungeonLevel + spell.power, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
				if (restraintAdd && KinkyDungeonAddRestraintIfWeaker(restraintAdd, spell.power, false, undefined, false, false, undefined, faction)) {
					KDSendStatus('bound', restraintAdd.name, "spell_" + spell.name);
					added.push(restraintAdd);
					effect = true;
				}
			}
			if (added.length > 0) {
				KinkyDungeonSendTextMessage(6, TextGet("KinkyDungeonRopeEngulfWeak"), "red", 2);
				effect = true;
			} else {
				let RopeDresses = ["Leotard", "Bikini", "Lingerie"];
				if (!RopeDresses.includes(KinkyDungeonCurrentDress)) {
					KinkyDungeonSetDress(RopeDresses[Math.floor(Math.random() * RopeDresses.length)], "");
					KinkyDungeonDressPlayer();
					KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonRopeEngulfDress"), "red", 3);
					effect = true;
				} else {
					KinkyDungeonMovePoints = Math.max(-1, KinkyDungeonMovePoints-1); // This is to prevent stunlock while slowed heavily
					KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonSlowedBySpell"), "yellow", playerEffect.time);
					KinkyDungeonDealDamage({damage: spell.power, type: spell.damage});
					effect = true;
				}
			}
		} else if (playerEffect.name == "VineEngulf") {
			let added = [];
			for (let i = 0; i < playerEffect.power; i++) {
				let restraintAdd = KinkyDungeonGetRestraint({tags: ["vineRestraints"]}, MiniGameKinkyDungeonLevel + spell.power, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
				if (restraintAdd && KinkyDungeonAddRestraintIfWeaker(restraintAdd, spell.power, false, undefined, false, false, undefined, faction)) {
					KDSendStatus('bound', restraintAdd.name, "spell_" + spell.name);
					added.push(restraintAdd);
					effect = true;
				}
			}
			if (added.length > 0) {
				KinkyDungeonSendTextMessage(6, TextGet("KinkyDungeonVineEngulf"), "red", 2);
				effect = true;
			} else {
				let RopeDresses = ["GreenLeotard", "Lingerie"];
				if (!RopeDresses.includes(KinkyDungeonCurrentDress) && KinkyDungeonCurrentDress != "Elven") {
					KinkyDungeonSetDress(RopeDresses[Math.floor(Math.random() * RopeDresses.length)], "");
					KinkyDungeonDressPlayer();
					KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonVineEngulfDress"), "red", 3);
					effect = true;
				} else {
					KinkyDungeonMovePoints = Math.max(-1, KinkyDungeonMovePoints-1); // This is to prevent stunlock while slowed heavily
					KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonSlowedBySpell"), "yellow", playerEffect.time);
					KinkyDungeonDealDamage({damage: spell.power, type: spell.damage});
					effect = true;
				}
			}
		}  else if (playerEffect.name == "ObsidianEngulf") {
			let added = [];
			for (let i = 0; i < playerEffect.count; i++) {
				let restraintAdd = KinkyDungeonGetRestraint({tags: ["obsidianRestraints"]}, MiniGameKinkyDungeonLevel + spell.power, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
				if (restraintAdd && KinkyDungeonAddRestraintIfWeaker(restraintAdd, spell.power, false, undefined, false, false, undefined, faction)) {
					KDSendStatus('bound', restraintAdd.name, "spell_" + spell.name);
					added.push(restraintAdd);
					effect = true;
				}
			}
			if (added.length > 0) {
				KinkyDungeonSendTextMessage(6, TextGet("KinkyDungeonObsidianEngulf"), "red", 2);
				effect = true;
			} else {
				KinkyDungeonMovePoints = Math.max(-1, KinkyDungeonMovePoints-1); // This is to prevent stunlock while slowed heavily
				KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonSlowedBySpell"), "yellow", playerEffect.time);
				KinkyDungeonDealDamage({damage: spell.power, type: spell.damage});
				effect = true;
			}
		} else if (playerEffect.name == "CharmWraps") {
			let added = [];
			for (let i = 0; i < playerEffect.power; i++) {
				let restraintAdd = KinkyDungeonGetRestraint({tags: ["ribbonRestraintsLight"]}, MiniGameKinkyDungeonLevel + spell.power, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
				if (restraintAdd && KinkyDungeonAddRestraintIfWeaker(restraintAdd, spell.power, false, undefined, false, false, undefined, faction)) {
					KDSendStatus('bound', restraintAdd.name, "spell_" + spell.name);
					added.push(restraintAdd);
					effect = true;
				}
			}
			if (added.length > 0) {
				KinkyDungeonSendTextMessage(6, TextGet("KinkyDungeonCharmWraps"), "red", 2);
				effect = true;
			} else {
				let CharmDresses = ["Leotard", "Bikini", "Lingerie"];
				if (!CharmDresses.includes(KinkyDungeonCurrentDress) && KinkyDungeonCurrentDress != "Prisoner") {
					KinkyDungeonSetDress(CharmDresses[Math.floor(Math.random() * CharmDresses.length)], "");
					KinkyDungeonDressPlayer();
					KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonCharmWrapsDress"), "red", 3);
					effect = true;
				} else {
					KinkyDungeonMovePoints = Math.max(-1, KinkyDungeonMovePoints-1); // This is to prevent stunlock while slowed heavily
					KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonSlowedBySpell"), "yellow", playerEffect.time);
					KinkyDungeonDealDamage({damage: spell.power, type: spell.damage});
					effect = true;
				}
			}
		} else if (playerEffect.name == "EnchantedArrow") {
			let added = [];
			for (let i = 0; i < playerEffect.count; i++) {
				let ropeRests = ["mithrilRope"];
				if (KinkyDungeonStatStamina < KinkyDungeonStatStamina * 0.25) {
					ropeRests.push("mithrilRopeHogtie");
				}
				let restraintAdd = KinkyDungeonGetRestraint({tags: ropeRests}, MiniGameKinkyDungeonLevel + spell.power, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
				if (restraintAdd && KinkyDungeonAddRestraintIfWeaker(restraintAdd, spell.power, false, undefined, false, false, undefined, faction)) {
					KDSendStatus('bound', restraintAdd.name, "spell_" + spell.name);
					added.push(restraintAdd);
					effect = true;
				}
			}
			if (added.length > 0) {
				KinkyDungeonSendTextMessage(6, TextGet("KinkyDungeonEnchantedArrow"), "red", 2);
				effect = true;
			} else {
				KinkyDungeonMovePoints = Math.max(-1, KinkyDungeonMovePoints-1); // This is to prevent stunlock while slowed heavily
				KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonSlowedBySpell"), "yellow", playerEffect.time);
				KinkyDungeonDealDamage({damage: spell.power, type: spell.damage});
				effect = true;
			}

		} else if (playerEffect.name == "TrapBindings") {
			let added = [];
			for (let i = 0; i < playerEffect.count; i++) {
				let restraintAdd = KinkyDungeonGetRestraint({tags: playerEffect.tags}, MiniGameKinkyDungeonLevel + spell.power, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
				if (restraintAdd && KinkyDungeonAddRestraintIfWeaker(restraintAdd, spell.power, false, undefined, false, false, undefined, faction)) {
					KDSendStatus('bound', restraintAdd.name, "spell_" + spell.name);
					added.push(restraintAdd);
					effect = true;
				}
			}
			if (added.length > 0) {
				KinkyDungeonSendTextMessage(6, TextGet(playerEffect.text), "red", 2);
				effect = true;
			} else {
				let PossibleDresses = ["Leotard", "Bikini", "Lingerie"];
				if (!PossibleDresses.includes(KinkyDungeonCurrentDress)) {
					KinkyDungeonSetDress(PossibleDresses[Math.floor(Math.random() * PossibleDresses.length)], "");
					KinkyDungeonDressPlayer();
					KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonTrapBindingsDress"), "red", 3);
					effect = true;
				}
				// else if (!playerEffect.noGuard && KDGameData.PrisonerState != 'jail' && KDGameData.PrisonerState != 'parole') {
				//KinkyDungeonCallGuard(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y);
				//}
				if (playerEffect.power > 0 && playerEffect.damage) {
					KinkyDungeonDealDamage({damage: playerEffect.power, type: playerEffect.damage});
				}
			}
		} else if (playerEffect.name == "TrapSleepDart") {
			KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonTrapSleepDart"), "red", 4);
			KinkyDungeonSlowMoveTurns = 8;
			KinkyDungeonStatBlind = 8;
			KinkyDungeonSleepiness = 8;
			KinkyDungeonAlert = 6;
			effect = true;
		} else if (playerEffect.name == "LustBomb") {
			KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonLustBomb"), "pink", 4);
			if (playerEffect.power > 0) {
				KinkyDungeonDealDamage({damage: playerEffect.power, type: playerEffect.damage});
			}
			effect = true;
		} else if (playerEffect.name == "TrapLustCloud") {
			KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonTrapLustCloud"), "yellow", 4);
			if (playerEffect.power > 0) {
				KinkyDungeonDealDamage({damage: playerEffect.power, type: playerEffect.damage});
			}
			effect = true;
		} else if (playerEffect.name == "TrapSPCloud") {
			KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonTrapSPCloud"), "yellow", 4);
			if (playerEffect.power > 0) {
				KinkyDungeonDealDamage({damage: playerEffect.power, type: playerEffect.damage});
			}
			effect = true;
		} else if (playerEffect.name == "Freeze") {
			KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonFreeze"), "red", playerEffect.time);
			if (playerEffect.power > 0) {
				KinkyDungeonDealDamage({damage: playerEffect.power, type: playerEffect.damage});
			}
			KinkyDungeonStatFreeze = Math.max(0, playerEffect.time);
			KinkyDungeonSleepTime = CommonTime() + KinkyDungeonFreezeTime;
			effect = true;
		} else if (playerEffect.name == "Chill") {
			let standingTile = KinkyDungeonMapGet(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y);
			if (playerEffect.power > 0 && !KinkyDungeonFlags.get("chill")) {
				KinkyDungeonDealDamage({damage: playerEffect.power, type: playerEffect.damage});
			}
			if (standingTile == 'w') {
				sfx = "Freeze";
				KinkyDungeonStatFreeze = Math.max(0, playerEffect.time);
				KinkyDungeonSleepTime = CommonTime() + KinkyDungeonFreezeTime;
				KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonFreeze"), "red", playerEffect.time);
			} else {
				sfx = "Bones";
				KinkyDungeonMovePoints = Math.max(-1, KinkyDungeonMovePoints-1);
				KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonChill"), "red", playerEffect.time);
			}
			KinkyDungeonSetFlag("chill", 1);
			effect = true;
		} else if (playerEffect.name == "ShadowBind") {
			KinkyDungeonStatBind = Math.max(0, playerEffect.time);
			KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonShadowBind"), "red", playerEffect.time);
			effect = true;
		}
	}

	if (sfx) KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + sfx + ".ogg");
	if (effect) KinkyDungeonInterruptSleep();

	return effect;
}

function KinkyDungeoCheckComponents(spell) {
	let failedcomp = [];
	if (spell.components.includes("Verbal") && !KinkyDungeonCanTalk(true) && !(KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "NoVerbalComp") > 0)) failedcomp.push("Verbal");
	if (spell.components.includes("Arms") && KinkyDungeonIsArmsBound() && !(KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "NoArmsComp") > 0)) failedcomp.push("Arms");
	if (spell.components.includes("Legs") && (KinkyDungeonSlowLevel > 1 || KinkyDungeonLegsBlocked()) && !(KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "NoLegsComp") > 0)) failedcomp.push("Legs");

	return failedcomp;
}

function KinkyDungeonHandleSpellChoice(SpellChoice) {
	let spell = KinkyDungeonHandleSpellCast(KinkyDungeonSpells[SpellChoice]);
	return spell;
}

function KinkyDungeonHandleSpellCast(spell) {
	if (KinkyDungeoCheckComponents(spell).length == 0 || (
		(KinkyDungeonStatsChoice.get("Slayer") && spell.school == "Elements")
		|| (KinkyDungeonStatsChoice.get("Conjurer") && spell.school == "Conjure")
		|| (KinkyDungeonStatsChoice.get("Magician") && spell.school == "Illusion")
	)) {
		if (KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell))
			&& (!spell.staminacost || KinkyDungeonHasStamina(spell.staminacost)))
			return spell;
		else KinkyDungeonSendActionMessage(8, TextGet("KinkyDungeonNoMana"), "red", 1);
	} else {
		KinkyDungeonTargetingSpell = "";
		KinkyDungeonSendActionMessage(7, TextGet("KinkyDungeonComponentsFail" + KinkyDungeoCheckComponents(spell)[0]), "red", 1);
	}
	return null;
}

function KinkyDungeonClickSpell(i) {
	let spell = null;
	let clicked = false;
	if (KinkyDungeonSpells[KinkyDungeonSpellChoices[i]] && !KinkyDungeonSpells[KinkyDungeonSpellChoices[i]].passive) {
		if (KinkyDungeonSpells[KinkyDungeonSpellChoices[i]] && KinkyDungeonSpells[KinkyDungeonSpellChoices[i]].type == "passive") {
			KDSendInput("toggleSpell", {i: i});
			if (KinkyDungeonSpellChoicesToggle[i] && KinkyDungeonSpells[KinkyDungeonSpellChoices[i]].cancelAutoMove) {
				KinkyDungeonFastMove = false;
				KinkyDungeonFastMoveSuppress = false;
			}
			KinkyDungeonSpellPress = "";
			clicked = true;
		} else {
			spell = KinkyDungeonHandleSpellChoice(KinkyDungeonSpellChoices[i]);
			clicked = true;
		}
	}
	return {spell: spell, clicked: clicked};
}

let KDSwapSpell = -1;

function KinkyDungeonHandleSpell() {
	let spell = null;
	let clicked = false;
	for (let i = 0; i < KinkyDungeonSpellChoiceCount; i++) {
		let buttonWidth = 40;
		if (MouseIn(1650 + (90 - buttonWidth), 180 + i*KinkyDungeonSpellChoiceOffset - buttonWidth, buttonWidth, buttonWidth)) {
			KinkyDungeonDrawState = "MagicSpells";
			KDSwapSpell = i;
			return true;
		}
		if (MouseInKD("SpellCast" + i) || KinkyDungeonSpellPress == KinkyDungeonKeySpell[i]) {
			let result = KinkyDungeonClickSpell(i);
			spell = result.spell;
			clicked = result.clicked;
		}
	}
	/*else if (KinkyDungeonSpells[KinkyDungeonSpellChoices[1]] && !KinkyDungeonSpells[KinkyDungeonSpellChoices[1]].passive && (MouseIn(1230 + 1*KinkyDungeonSpellChoiceOffset, 895, 90, 90) || KinkyDungeonSpellPress == KinkyDungeonKeySpell[1])) {
		spell = KinkyDungeonHandleSpellChoice(KinkyDungeonSpellChoices[1]);
	} else if (KinkyDungeonSpells[KinkyDungeonSpellChoices[2]] && !KinkyDungeonSpells[KinkyDungeonSpellChoices[2]].passive && (MouseIn(1230 + 2*KinkyDungeonSpellChoiceOffset, 895, 90, 90) || KinkyDungeonSpellPress == KinkyDungeonKeySpell[2])) {
		spell = KinkyDungeonHandleSpellChoice(KinkyDungeonSpellChoices[2]);
	}*/
	if (spell) {
		// Handle spell activation
		KinkyDungeonTargetingSpell = spell;
		KinkyDungeonSendActionMessage(5, TextGet("KinkyDungeonSpellTarget" + spell.name).replace("SpellArea", "" + Math.floor(spell.aoe)), "white", 0.1, true);
		return true;
	}
	if (clicked) return true;
	return false;
}

function KinkyDungeonGetManaCost(Spell) {
	let cost = Spell.manacost;
	let costscale = KinkyDungeonMultiplicativeStat(-KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "ManaCostMult"));
	let lvlcostscale = KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "ManaCostLevelMult");
	if (costscale) cost = Math.floor(cost * costscale);
	if (costscale > 0) cost = Math.max(Spell.manacost, cost); // Keep it from rounding to 0
	if (lvlcostscale && Spell.level && Spell.manacost) cost += Spell.level * lvlcostscale;
	if (KinkyDungeonStatsChoice.get("Slayer") && Spell.school == "Elements" && KinkyDungeoCheckComponents(Spell).length > 0) cost *= 2;
	if (KinkyDungeonStatsChoice.get("Conjurer") && Spell.school == "Conjure" && KinkyDungeoCheckComponents(Spell).length > 0) cost *= 2;
	if (KinkyDungeonStatsChoice.get("Magician") && Spell.school == "Illusion" && KinkyDungeoCheckComponents(Spell).length > 0) cost *= 2;
	return cost;
}

function KinkyDungeonGetCost(Spell) {
	let cost = Spell.level;
	if (Spell.level > 1 && !Spell.passive && KinkyDungeonStatsChoice.get("Novice")) cost *= 2;
	if (Spell.spellPointCost) return Spell.spellPointCost;
	return cost;
}

function KinkyDungeonMakeNoise(radius, noiseX, noiseY) {
	for (let e of KinkyDungeonEntities) {
		if (!e.aware && !e.Enemy.tags.has("deaf") && e.Enemy.AI != "ambush" && KDistChebyshev(e.x - noiseX, e.y - noiseY) <= radius) {
			e.gx = noiseX;
			e.gy = noiseY;
			KDAddThought(e.id, "Search", 2, 1 + KDistChebyshev(e.x - noiseX, e.y - noiseY));
		}
	}
}

/**
 *
 * @param {number} targetX
 * @param {number} targetY
 * @param {spell} spell
 * @param {*} enemy
 * @param {*} player
 * @param {*} bullet
 * @param {string} [forceFaction]
 * @returns {string}
 */
function KinkyDungeonCastSpell(targetX, targetY, spell, enemy, player, bullet, forceFaction) {
	let entity = KinkyDungeonPlayerEntity;
	let moveDirection = KinkyDungeonMoveDirection;
	let flags = {
		miscastChance: KinkyDungeonMiscastChance,
	};

	let faction = spell.allySpell ? "Player" : spell.enemySpell ? "Enemy" : "Player";
	if (forceFaction) faction = forceFaction;
	else {
		if (!enemy && !bullet && player) faction = "Player";
		else if (enemy) {
			let f = KDGetFaction(enemy);
			if (f) faction = f;
		} else if (bullet && bullet.bullet) {
			let f = bullet.bullet.faction;
			if (f) faction = f;
		}
		if (spell.faction) faction = spell.faction;
	}


	let gaggedMiscastFlag = false;
	if (!enemy && !bullet && player && spell.components && spell.components.includes("Verbal") && !(KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "NoVerbalComp") > 0)) {
		let gagTotal = KinkyDungeonGagTotal();
		flags.miscastChance = flags.miscastChance + Math.max(0, 1 - flags.miscastChance) * Math.min(1, gagTotal);
		if (gagTotal > 0)
			gaggedMiscastFlag = true;
	}
	if (!enemy && !bullet && player) {
		KinkyDungeonSendEvent("beforeCast", {spell: spell, targetX: targetX, targetY: targetY, originX: KinkyDungeonPlayerEntity.x, originY: KinkyDungeonPlayerEntity.y, flags: flags});
	}
	let tX = targetX;
	let tY = targetY;
	let miscast = false;
	let selfCast = !enemy && !bullet && player && targetX == KinkyDungeonPlayerEntity.x && targetY == KinkyDungeonPlayerEntity.y;
	let cast = spell.spellcast ? {} : undefined;
	if (!enemy && !player && !bullet) {
		moveDirection = {x:0, y:0, delta:1};
	}

	let noiseX = targetX;
	let noiseY = targetY;

	if (enemy && player) {
		entity = enemy;
		moveDirection = KinkyDungeonGetDirection(player.x - entity.x, player.y - entity.y);
		flags.miscastChance = 0;
	}
	if (bullet) {
		entity = bullet;
		if (bullet.bullet.cast) {
			moveDirection = {x:bullet.bullet.cast.mx, y:bullet.bullet.cast.my, delta: 1};
		} else {
			moveDirection = {x:0, y:0, delta: 0};
		}
		flags.miscastChance = 0;
	}
	if (!spell.noMiscast && !enemy && !bullet && player && KDRandom() < flags.miscastChance) {

		if (gaggedMiscastFlag)
			KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonSpellMiscastGagged"), "#FF8800", 2);
		else
			KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonSpellMiscast"), "#FF8800", 2);

		moveDirection = {x:0, y:0, delta:1};
		tX = entity.x;
		tY = entity.y;
		miscast = true;
		return "Miscast";
	}

	if (cast) {
		Object.assign(cast, spell.spellcast);
		if (cast.target == "target") {
			if (tX == entity.x + moveDirection.x && tY == entity.y + moveDirection.y && !cast.noTargetMoveDir) {
				cast.tx = tX + moveDirection.x;
				cast.ty = tY + moveDirection.y;
			} else {
				cast.tx = tX;
				cast.ty = tY;
			}
		} else if (cast.target == "origin") {
			cast.tx = entity.x;
			cast.ty = entity.y;
		}
		if (cast.directional) {
			if (cast.randomDirection) {
				let slots = [];
				for (let XX = -1; XX <= 1; XX++) {
					for (let YY = -1; YY <= 1; YY++) {
						if ((XX != 0 || YY != 0) && KinkyDungeonNoEnemy(entity.x + XX, entity.y + YY, true) && KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(entity.x + XX, entity.y + YY))) slots.push({x:XX, y:YY});
					}
				}
				if (slots.length > 0) {
					let slot = slots[Math.floor(KDRandom() * slots.length)];
					cast.mx = slot.x;
					cast.my = slot.y;
					moveDirection.x = slot.x;
					moveDirection.y = slot.y;
				} else {
					cast.mx = moveDirection.x;
					cast.my = moveDirection.y;
				}
			} else {
				cast.mx = moveDirection.x;
				cast.my = moveDirection.y;
			}

		}
	}

	let spellRange = spell.range * KinkyDungeonMultiplicativeStat(-KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "spellRange"));
	let bulletfired = null;
	let target = null;

	if (spell.type == "bolt") {
		let size = (spell.size) ? spell.size : 1;
		let xx = entity.x;
		let yy = entity.y;
		noiseX = entity.x;
		noiseY = entity.y;
		if (!bullet || (bullet.spell && bullet.spell.cast && bullet.spell.cast.offset)) {
			xx += moveDirection.x;
			yy += moveDirection.y;
		}
		let b = KinkyDungeonLaunchBullet(xx, yy,
			tX-entity.x,tY - entity.y,
			spell.speed, {noSprite: spell.noSprite, faction: faction, name:spell.name, block: spell.block, width:size, height:size, summon:spell.summon, cast: cast, dot: spell.dot,
				passthrough: spell.noTerrainHit, noEnemyCollision: spell.noEnemyCollision, nonVolatile:spell.nonVolatile, noDoubleHit: spell.noDoubleHit, piercing: spell.piercing, events: spell.events,
				lifetime:miscast || selfCast ? 1 : (spell.bulletLifetime ? spell.bulletLifetime : 1000), origin: {x: entity.x, y: entity.y}, range: spellRange, hit:spell.onhit,
				damage: {evadeable: spell.evadeable, damage:spell.power, type:spell.damage, bind: spell.bind, boundBonus: spell.boundBonus, time:spell.time}, spell: spell}, miscast);
		b.visual_x = entity.x;
		b.visual_y = entity.y;
		bulletfired = b;
	} else if (spell.type == "inert" || spell.type == "dot") {
		let sz = spell.size;
		if (!sz) sz = 1;
		if (spell.meleeOrigin) {
			tX = entity.x + moveDirection.x;
			tY = entity.y + moveDirection.y;
		}
		let b = KinkyDungeonLaunchBullet(tX, tY,
			moveDirection.x,moveDirection.y,
			0, {
				noSprite: spell.noSprite, faction: faction, name:spell.name, block: spell.block, width:sz, height:sz, summon:spell.summon, lifetime:spell.delay +
					(spell.delayRandom ? Math.floor(KDRandom() * spell.delayRandom) : 0), cast: cast, dot: spell.dot, events: spell.events,
				passthrough:(spell.CastInWalls || spell.WallsOnly || spell.noTerrainHit), hit:spell.onhit, noDoubleHit: spell.noDoubleHit,
				damage: spell.type == "inert" ? null : {evadeable: spell.evadeable, damage:spell.power, type:spell.damage, bind: spell.bind, boundBonus: spell.boundBonus, time:spell.time}, spell: spell
			}, miscast);
		bulletfired = b;
	}  else if (spell.type == "hit") {
		let sz = spell.size;
		if (!sz) sz = 1;
		if (spell.meleeOrigin) {
			tX = entity.x + moveDirection.x;
			tY = entity.y + moveDirection.y;
		}
		let b = {x: tX, y:tY,
			vx: moveDirection.x,vy: moveDirection.y, born: 1,
			bullet: {noSprite: spell.noSprite, faction: faction, name:spell.name, block: spell.block, width:sz, height:sz, summon:spell.summon, lifetime:spell.lifetime, cast: cast, dot: spell.dot, events: spell.events, aoe: spell.aoe,
				passthrough:(spell.CastInWalls || spell.WallsOnly || spell.noTerrainHit), hit:spell.onhit, noDoubleHit: spell.noDoubleHit,
				damage: {evadeable: spell.evadeable, damage:spell.power, type:spell.damage, bind: spell.bind, boundBonus: spell.boundBonus, time:spell.time}, spell: spell}};
		KinkyDungeonBulletHit(b, 1);
		bulletfired = b;
	} else if (spell.type == "buff") {
		let aoe = spell.aoe;
		let casted = false;
		if (!aoe) aoe = 0.1;
		if (Math.sqrt((KinkyDungeonPlayerEntity.x - targetX) * (KinkyDungeonPlayerEntity.x - targetX) + (KinkyDungeonPlayerEntity.y - targetY) * (KinkyDungeonPlayerEntity.y - targetY)) <= aoe) {
			for (let buff of spell.buffs) {
				KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, buff);
				if (KinkyDungeonPlayerEntity.x == targetX && KinkyDungeonPlayerEntity.y == targetY) target = KinkyDungeonPlayerEntity;
				casted = true;
			}
		}
		for (let e of KinkyDungeonEntities) {
			if (Math.sqrt((e.x - targetX) * (e.x - targetX) + (e.y - targetY) * (e.y - targetY)) <= aoe) {
				for (let buff of spell.buffs) {
					if (!e.buffs) e.buffs = [];
					KinkyDungeonApplyBuff(e.buffs, buff);
					if (e.x == targetX && e.y == targetY) target = e;
					casted = true;
				}
			}
		}
		if (!casted)
			return "Fail";
	} else if (spell.type == "special") {
		if (spell.special == "analyze") {
			let en = KinkyDungeonEnemyAt(targetX, targetY);
			if (en) {
				if (!en.buffs || !en.buffs.Analyze) {
					if (!en.buffs) en.buffs = {};
					KinkyDungeonApplyBuff(en.buffs, {id: "Analyze", aura: "#ffffff", type: "DamageAmp", duration: 99999, power: 0.3, player: false, enemies: true, maxCount: 3, tags: ["defense", "damageTaken"]},);
					KinkyDungeonApplyBuff(en.buffs, {id: "Analyze2", type: "Info", duration: 99999, power: 1.0, player: false, enemies: true, tags: ["info"]},);
				} else return "Fail";
			} else {
				let tile = KinkyDungeonTiles.get(targetX + "," + targetY);
				if (tile) {
					if (tile.Loot && tile.Roll) {
						let event = KinkyDungeonLoot(MiniGameKinkyDungeonLevel, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint], tile.Loot, tile.Roll, tile, true);
						if (event.trap) KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonShrineTooltipTrap"), "red", 2);
						else KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonShrineTooltipNoTrap"), "lightgreen", 2);

					} else return "Fail";
				} else return "Fail";
			}
		} else if (spell.special == "dress") {
			KinkyDungeonSetDress(spell.outfit);
		} else if (spell.special == "CommandWord") {
			let en = KinkyDungeonEnemyAt(targetX, targetY);
			if (en) {
				if (en.boundLevel > 0) {
					if (KDHostile(en) && en.hp <= en.Enemy.maxhp * 0.1) {
						en.ceasefire = 50;
					} else if (!KDHostile(en) && en.hp <= en.Enemy.maxhp * 0.1) {
						en.allied = 100;
					}
					en.boundLevel = Math.max(0, en.boundLevel);
					KinkyDungeonChangeMana(-KinkyDungeonGetManaCost(spell));
					return "Cast";
				}
				return "Fail";
			} else if (KinkyDungeonPlayerGetRestraintsWithLocks(["Purple"]).length > 0) {
				for (let r of KinkyDungeonPlayerGetRestraintsWithLocks(["Purple"])) {
					KinkyDungeonLock(r, "");
				}
				KinkyDungeonSendTextMessage(4, TextGet("KinkyDungeonPurpleLockRemove"), "yellow", 2);
				KinkyDungeonChangeMana(-KinkyDungeonGetManaCost(spell));
				return "Cast";
			}
			return "Fail";
		} else if (spell.special == "weaponAttack") {
			KinkyDungeonTargetingSpellWeapon = null;
			let en = KinkyDungeonEnemyAt(targetX, targetY);
			if (en) {
				KinkyDungeonLaunchAttack(en, true);
				return "Cast";
			} else return "Fail";
		} else if (spell.special == "weaponAttackOrSpell") {
			KinkyDungeonTargetingSpellWeapon = null;
			let en = KinkyDungeonEnemyAt(targetX, targetY);
			if (en) {
				KinkyDungeonLaunchAttack(en, true);
				return "Cast";
			} else {
				return KinkyDungeonActivateWeaponSpell(true) ? "Cast" : "Fail";
			}
		}
	}

	if (spell.extraCast) {
		for (let extraCast of spell.extraCast)
			KinkyDungeonCastSpell(targetX, targetY, KinkyDungeonFindSpell(extraCast.spell, true), undefined, undefined, undefined);
	}

	if (spell.noise) {
		KinkyDungeonMakeNoise(spell.noise, noiseX, noiseY);
	}

	if (!enemy && !bullet && player) { // Costs for the player
		if (KinkyDungeonTargetingSpellItem) {
			KinkyDungeonChangeConsumable(KinkyDungeonTargetingSpellItem, -(KinkyDungeonTargetingSpellItem.useQuantity ? KinkyDungeonTargetingSpellItem.useQuantity : 1));
			KinkyDungeonTargetingSpellItem = null;
			if (!spell.noAggro)
				KinkyDungeonAggroAction('item', {});
		} else if (KinkyDungeonTargetingSpellWeapon) {
			let special = KinkyDungeonPlayerDamage ? KinkyDungeonPlayerDamage.special : null;
			if (special) {
				let energyCost = KinkyDungeonPlayerDamage.special.energyCost;
				if (KDGameData.AncientEnergyLevel < energyCost) return;
				if (energyCost) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - energyCost);
			}
			KinkyDungeonTargetingSpellItem = null;
			if (!spell.noAggro)
				KinkyDungeonAggroAction('item', {});
		} else {
			if (!spell.noAggro)
				KinkyDungeonAggroAction('magic', {});
		}
		KinkyDungeonSendActionMessage(3, TextGet("KinkyDungeonSpellCast"+spell.name), "#88AAFF", 2 + (spell.channel ? spell.channel - 1 : 0));
		KDSendSpellCast(spell.name);

		KinkyDungeonSendEvent("playerCast", {spell: spell, bulletfired: bulletfired, target: target, targetX: targetX, targetY: targetY, originX: KinkyDungeonPlayerEntity.x, originY: KinkyDungeonPlayerEntity.y, flags: flags});

		//let cost = spell.staminacost ? spell.staminacost : KinkyDungeonGetCost(spell.level);

		//KinkyDungeonStatWillpowerExhaustion += spell.exhaustion + 1;
		KinkyDungeonTickBuffTag(KinkyDungeonPlayerBuffs, "cast", 1);
		KinkyDungeonChangeMana(-KinkyDungeonGetManaCost(spell));
		if (spell.staminacost) KinkyDungeonChangeStamina(-spell.staminacost);
		if (spell.channel) {
			KinkyDungeonSlowMoveTurns = Math.max(KinkyDungeonSlowMoveTurns, spell.channel);
			KinkyDungeonSleepTime = CommonTime() + 200;
		}
		if (spell.noise) {
			if (spell.components && spell.components.includes("Verbal"))
				KinkyDungeonAlert = 3;//Math.max(spell.noise, KinkyDungeonAlert);
		}
		KinkyDungeonLastAction = "Spell";
	} else {
		KinkyDungeonSendEvent("spellCast", {spell: spell, bulletfired: bulletfired, target: target, targetX: targetX, targetY: targetY, originX: KinkyDungeonPlayerEntity.x, originY: KinkyDungeonPlayerEntity.y, flags: flags,
			enemy: enemy, bullet: bullet, player: player});
	}

	return "Cast";
}

function KinkyDungeonClickSpellChoice(I, CurrentSpell) {
	// Set spell choice
	KDSendInput("spellChoice", {I:I, CurrentSpell: CurrentSpell});
	if (KinkyDungeonTextMessageTime > 0)
		KinkyDungeonDrawState = "Game";
	if (KinkyDungeonSpellChoicesToggle[I] && KinkyDungeonSpells[KinkyDungeonSpellChoices[I]].cancelAutoMove) {
		KinkyDungeonFastMove = false;
		KinkyDungeonFastMoveSuppress = false;
	}
}

function KinkyDungeonHandleMagic() {
	//if (KinkyDungeonPlayer.CanInteract()) { // Allow turning pages
	if (KinkyDungeonCurrentPage > 0 && MouseIn(canvasOffsetX_ui + 100, canvasOffsetY_ui + 483*KinkyDungeonBookScale, 250, 60)) {
		if (KinkyDungeonPreviewSpell) KinkyDungeonPreviewSpell = undefined;
		else KinkyDungeonCurrentPage -= 1;
		return true;
	}
	if (KinkyDungeonCurrentPage < KinkyDungeonSpells.length-1 && MouseIn(canvasOffsetX_ui + 640*KinkyDungeonBookScale - 325, canvasOffsetY_ui + 483*KinkyDungeonBookScale, 250, 60)) {
		if (KinkyDungeonPreviewSpell) KinkyDungeonPreviewSpell = undefined;
		else KinkyDungeonCurrentPage += 1;
		return true;
	}
	/*} else if (MouseIn(canvasOffsetX_ui + 640*KinkyDungeonBookScale/2 - 250, canvasOffsetY_ui + 483*KinkyDungeonBookScale, 500, 60)) {
		KinkyDungeonCurrentPage = Math.floor(KDRandom()*KinkyDungeonSpells.length);
		if (KinkyDungeonPreviewSpell) KinkyDungeonPreviewSpell = undefined;
		else {
			KinkyDungeonAdvanceTime(1);
			if (KinkyDungeonTextMessageTime > 0)
				KinkyDungeonDrawState = "Game";
		}
		return true;
	}*/

	if (KinkyDungeonSpells[KinkyDungeonCurrentPage] && !KinkyDungeonPreviewSpell) {
		for (let I = 0; I < KinkyDungeonSpellChoiceCount; I++) {
			if (!KinkyDungeonSpellChoices.includes(KinkyDungeonCurrentPage)) {
				if (MouseIn(canvasOffsetX_ui + 640*KinkyDungeonBookScale + 40, canvasOffsetY_ui + 50 + I*KinkyDungeonSpellOffset, 225, 60)) {
					KinkyDungeonClickSpellChoice(I, KinkyDungeonCurrentPage);
					return true;
				}
			} else if (KinkyDungeonSpells[KinkyDungeonSpellChoices[I]] && KinkyDungeonSpells[KinkyDungeonSpellChoices[I]].type == "passive") {
				if (MouseIn(canvasOffsetX_ui + 640*KinkyDungeonBookScale + 40, canvasOffsetY_ui + 50 + I*KinkyDungeonSpellOffset, 225, 60)) {
					KDSendInput("spellRemove", {I:I});
					return true;
				}
			}
		}
		if (MouseIn(canvasOffsetX_ui + 640*KinkyDungeonBookScale * 0.5 - 200, canvasOffsetY_ui - 70 + 483*KinkyDungeonBookScale, 400, 60)) {
			KDSendInput("spellCastFromBook", {CurrentSpell: KinkyDungeonCurrentPage});
			KinkyDungeonTargetingSpell = KinkyDungeonSpells[KinkyDungeonCurrentPage];
			KinkyDungeonDrawState = "Game";
		}
	} else if (KinkyDungeonPreviewSpell && MouseIn(canvasOffsetX_ui + 640*KinkyDungeonBookScale + 40, canvasOffsetY_ui + 125, 225, 60)) {
		KDSendInput("spellLearn", {SpellName: KinkyDungeonPreviewSpell.name});
		return true;
	}

	if (MouseIn(800, 925, 355, 60)) {
		KinkyDungeonDrawState = "MagicSpells";
		return true;
	}
	return true;
}

function KinkyDungeonCheckSpellPrerequisite(spell) {
	if (!spell || !spell.prerequisite) return true;
	let spell_prereq = KinkyDungeonSearchSpell(KinkyDungeonSpells, spell.prerequisite);
	if (spell_prereq) return true;
	return false;
}

// https://stackoverflow.com/questions/14484787/wrap-text-in-javascript
function KinkyDungeonWordWrap(str, maxWidth) {
	let newLineStr = "\n";
	let res = '';
	while (str.length > maxWidth) {
		let found = false;
		// Inserts new line at first whitespace of the line
		for (let i = maxWidth - 1; i >= 0; i--) {
			if (KinkyDungeonTestWhite(str.charAt(i))) {
				res = res + [str.slice(0, i), newLineStr].join('');
				str = str.slice(i + 1);
				found = true;
				break;
			}
		}
		// Inserts new line at maxWidth position, the word is too long to wrap
		if (!found) {
			res += [str.slice(0, maxWidth), newLineStr].join('');
			str = str.slice(maxWidth);
		}

	}

	return res + str;
}

function KinkyDungeonTestWhite(x) {
	let white = new RegExp(/^\s$/);
	return white.test(x.charAt(0));
}

function KinkyDungeonDrawMagic() {
	KinkyDungeonDrawMessages(true);
	DrawImageZoomCanvas(KinkyDungeonRootDirectory + "MagicBook.png", MainCanvas, 0, 0, 640, 483, canvasOffsetX_ui, canvasOffsetY_ui, 640*KinkyDungeonBookScale, 483*KinkyDungeonBookScale, false);

	if (KinkyDungeonSpells[KinkyDungeonCurrentPage] || KinkyDungeonPreviewSpell) {
		let spell = KinkyDungeonPreviewSpell ? KinkyDungeonPreviewSpell : KinkyDungeonSpells[KinkyDungeonCurrentPage];

		DrawText(TextGet("KinkyDungeonSpell"+ spell.name), canvasOffsetX_ui + 640*KinkyDungeonBookScale/3.35, canvasOffsetY_ui + 483*KinkyDungeonBookScale/5, "black", "black");
		DrawText(TextGet("KinkyDungeonSpellsSchool" + spell.school), canvasOffsetX_ui + 640*KinkyDungeonBookScale/3.35, canvasOffsetY_ui + 483*KinkyDungeonBookScale/5 + 40, "#222222", "silver");
		//DrawText(TextGet("KinkyDungeonMagicLevel") + spell.level, canvasOffsetX_ui + 640*KinkyDungeonBookScale/3.35, canvasOffsetY_ui + 483*KinkyDungeonBookScale/2.65, "black", "silver");

		if (spell.prerequisite) {
			DrawText(TextGet("KDPrerequisite"), canvasOffsetX_ui + 640*KinkyDungeonBookScale/3.35, canvasOffsetY_ui + 483*KinkyDungeonBookScale/2, "black", "silver");
			DrawText(TextGet("KinkyDungeonSpell" + spell.prerequisite), canvasOffsetX_ui + 640*KinkyDungeonBookScale/3.35, canvasOffsetY_ui + 483*KinkyDungeonBookScale/2 + 40, "black", "silver");
		}

		if (KinkyDungeonPreviewSpell) DrawText(TextGet("KinkyDungeonMagicCost") + KinkyDungeonGetCost(spell), canvasOffsetX_ui + 640*KinkyDungeonBookScale/3.35, canvasOffsetY_ui + 483*KinkyDungeonBookScale/2 + 150, "black", "silver");
		DrawText(TextGet("KinkyDungeonMagicManaCost") + spell.manacost, canvasOffsetX_ui + 640*KinkyDungeonBookScale/3.35, canvasOffsetY_ui + 483*KinkyDungeonBookScale/2 + 195, "black", "silver");
		//DrawText(TextGet("KinkyDungeonMagicExhaustion").replace("TimeTaken", spell.exhaustion), canvasOffsetX_ui + 640*KinkyDungeonBookScale/3.35, canvasOffsetY_ui + 483*KinkyDungeonBookScale/2 + 150, "black", "silver");
		//DrawText(TextGet("KinkyDungeonMagicExhaustion2").replace("TimeTaken", spell.exhaustion), canvasOffsetX_ui + 640*KinkyDungeonBookScale/3.35, canvasOffsetY_ui + 483*KinkyDungeonBookScale/2 + 195, "black", "silver");
		let textSplit = KinkyDungeonWordWrap(TextGet("KinkyDungeonSpellDescription"+ spell.name).replace("DamageDealt", "" + (spell.power * 10)).replace("Duration", spell.time).replace("LifeTime", spell.lifetime).replace("DelayTime", spell.delay).replace("BlockAmount", "" + (10 * spell.block)), 18).split('\n');
		let i = 0;
		for (let N = 0; N < textSplit.length; N++) {
			DrawText(textSplit[N],
				canvasOffsetX_ui + 640*KinkyDungeonBookScale*(1-1/3.35), canvasOffsetY_ui + 483*KinkyDungeonBookScale/5 + i * 40, "black", "silver"); i++;}

		i = 0;
		if (spell.components.includes("Verbal")) {DrawText(TextGet("KinkyDungeonComponentsVerbal"), canvasOffsetX_ui + 640*KinkyDungeonBookScale*(1-1/3.35), canvasOffsetY_ui + 483*KinkyDungeonBookScale/2 + 195 - 40*i, "black", "silver"); i++;}
		if (spell.components.includes("Arms")) {DrawText(TextGet("KinkyDungeonComponentsArms"), canvasOffsetX_ui + 640*KinkyDungeonBookScale*(1-1/3.35), canvasOffsetY_ui + 483*KinkyDungeonBookScale/2 + 195  - 40*i, "black", "silver"); i++;}
		if (spell.components.includes("Legs")) {DrawText(TextGet("KinkyDungeonComponentsLegs"), canvasOffsetX_ui + 640*KinkyDungeonBookScale*(1-1/3.35), canvasOffsetY_ui + 483*KinkyDungeonBookScale/2 + 195 - 40*i, "black", "silver"); i++;}
		DrawText(TextGet("KinkyDungeonComponents"), canvasOffsetX_ui + 640*KinkyDungeonBookScale*(1-1/3.35), canvasOffsetY_ui + 483*KinkyDungeonBookScale/2 + 195 - 40*i, "black", "silver"); i = 1;

		if (!KinkyDungeonPreviewSpell) {
			for (let I = 0; I < KinkyDungeonSpellChoiceCount; I++) {
				if ( KinkyDungeonSpellChoices[I] != null && KinkyDungeonSpells[KinkyDungeonSpellChoices[I]] && !KinkyDungeonSpells[KinkyDungeonSpellChoices[I]].passive) {
					//DrawTextFit(TextGet("KinkyDungeonSpellChoice" + I), canvasOffsetX_ui + 640*KinkyDungeonBookScale + 150, canvasOffsetY_ui + 73 + I*KinkyDungeonSpellOffset, KinkyDungeonSpellOffset, "white", "silver");
					DrawTextFit(TextGet("KinkyDungeonSpell" + KinkyDungeonSpells[KinkyDungeonSpellChoices[I]].name), canvasOffsetX_ui + 640*KinkyDungeonBookScale + 150, canvasOffsetY_ui + 30 + I*KinkyDungeonSpellOffset, 225, "white", "silver");
				}
				if (!KinkyDungeonSpellChoices.includes(KinkyDungeonCurrentPage) && !KinkyDungeonSpells[KinkyDungeonCurrentPage].passive)
					DrawButton(canvasOffsetX_ui + 640*KinkyDungeonBookScale + 40, canvasOffsetY_ui + 50 + I*KinkyDungeonSpellOffset, 225, 60, TextGet("KinkyDungeonSpell" + I), "White", "", "");
				else if (KinkyDungeonSpells[KinkyDungeonSpellChoices[I]] && KinkyDungeonSpells[KinkyDungeonSpellChoices[I]].type == "passive")
					DrawButton(canvasOffsetX_ui + 640*KinkyDungeonBookScale + 40, canvasOffsetY_ui + 50 + I*KinkyDungeonSpellOffset, 225, 60, TextGet("KinkyDungeonSpellRemove" + I), "White", "", "");
			}
			if (!spell.passive && !(spell.type == "passive"))
				DrawButton(canvasOffsetX_ui + 640*KinkyDungeonBookScale * 0.5 - 200, canvasOffsetY_ui - 70 + 483*KinkyDungeonBookScale, 400, 60, TextGet("KinkyDungeonSpellCastFromBook")
					.replace("XXX", KinkyDungeonStatsChoice.has("Disorganized") ? "3" : (KinkyDungeonStatsChoice.has("QuickScribe") ? "No" : "1")), "White", "", "");
		} else {
			let cost = KinkyDungeonGetCost(spell);
			DrawButton(canvasOffsetX_ui + 640*KinkyDungeonBookScale + 40, canvasOffsetY_ui + 125, 225, 60, TextGet("KinkyDungeonSpellsBuy"),
				(KinkyDungeonSpellPoints >= cost && KinkyDungeonCheckSpellPrerequisite(spell)) ? "White" : "Pink", "", "");
		}
	}

	//if (KinkyDungeonPlayer.CanInteract()) { // Allow turning pages
	if (KinkyDungeonCurrentPage > 0) {
		DrawButton(canvasOffsetX_ui + 100, canvasOffsetY_ui + 483*KinkyDungeonBookScale, 250, 60, TextGet("KinkyDungeonBookLastPage"), "White", "", "");
	}
	if (KinkyDungeonCurrentPage < KinkyDungeonSpells.length-1) {
		DrawButton(canvasOffsetX_ui + 640*KinkyDungeonBookScale - 325, canvasOffsetY_ui + 483*KinkyDungeonBookScale, 250, 60, TextGet("KinkyDungeonBookNextPage"), "White", "", "");
	}
	/*} else {
		DrawButton(canvasOffsetX_ui + 640*KinkyDungeonBookScale/2 - 250, canvasOffsetY_ui + 483*KinkyDungeonBookScale, 500, 60, TextGet("KinkyDungeonBookRandomPage"), "White", "", "");
	}*/
	DrawButton(800, 925, 355, 60, TextGet("KinkyDungeonMagicSpells"), "White", "", "");

	if (KDSwapSpell != -1) {
		DrawText(TextGet("KinkyDungeonMagicSpellsQuick").replace("SPELLNAME", TextGet("KinkyDungeonSpell" + KinkyDungeonSpells[KinkyDungeonSpellChoices[KDSwapSpell]].name)), canvasOffsetX_ui + 600, 900, "white", "black");
	} else {
		DrawText(TextGet("KinkyDungeonSpellsLevels")
			.replace("SPELLPOINTS", "" + KinkyDungeonSpellPoints), canvasOffsetX_ui + 600, 890, "white", "black");
	}

}


let selectedFilters = [];

let KDSpellListIndex = 0;
let KDMaxSpellPerColumn = 8;

function KinkyDungeonListSpells(Mode) {
	let i = 0;
	let ii = 0;
	//let maxY = 560;
	let XX = 0;
	let spacing = 60;
	let ypadding = 5;
	let yPad = 100;
	let buttonwidth = 250;
	let xpadding = 50;
	let col = 0;

	// Draw filters
	if (Mode == "Draw") {
		let x = 4 * (buttonwidth + xpadding);
		let y = 50 + canvasOffsetY_ui;
		let filterlist = Object.assign([], filters);
		if (filtersExtra[KinkyDungeonCurrentSpellsPage]) {
			for (let ff of filtersExtra[KinkyDungeonCurrentSpellsPage]) {
				filterlist.push(ff);
			}
		}
		// Now we have our total filters, time to draw
		for (let f of filterlist) {
			DrawButtonKDEx("filter" + f, (bdata) => {
				if (selectedFilters.includes(f))
					selectedFilters.splice(selectedFilters.indexOf(f), 1);
				else
					selectedFilters.push(f);
				return true;
			}, true, canvasOffsetX_ui + x, y, buttonwidth, 40, TextGet("KinkyDungeonFilter" + f), selectedFilters.includes(f) ? "#ffffff" : "#999999");
			y += 45;
		}
	}

	if (KDColumnLabels[KinkyDungeonCurrentSpellsPage]) {
		for (let column = 0; column < KDColumnLabels[KinkyDungeonCurrentSpellsPage].length; column++) {
			let x = canvasOffsetX_ui + column * (buttonwidth + xpadding);
			let y = 80 + canvasOffsetY_ui;
			DrawText(TextGet("KinkyDungeonColumn" + KDColumnLabels[KinkyDungeonCurrentSpellsPage][column]), x + buttonwidth/2, y, "#ffffff", "#000000");
		}
	}


	let longestList = 0;
	for (let pg of KinkyDungeonLearnableSpells[KinkyDungeonCurrentSpellsPage]) {
		longestList = Math.max(longestList, pg.length);
	}
	if (KDSpellListIndex > longestList) KDSpellListIndex = 0;

	DrawButtonKDEx("spellsUp", (bdata) => {
		KDSpellListIndex = Math.max(0, KDSpellListIndex - 3);
		return true;
	}, KDSpellListIndex > 0, 910, 800, 90, 40, "", KDSpellListIndex > 0 ? "white" : "#888888", KinkyDungeonRootDirectory + "Up.png");
	DrawButtonKDEx("spellsDown", (bdata) => {
		KDSpellListIndex = Math.max(0, Math.min(longestList - KDMaxSpellPerColumn + 1, KDSpellListIndex + 3));
		return true;
	}, KDSpellListIndex < longestList - KDMaxSpellPerColumn + 1, 1160, 800, 90, 40, "", KDSpellListIndex < longestList - KDMaxSpellPerColumn + 1 ? "white" : "#888888", KinkyDungeonRootDirectory + "Down.png");

	// Draw the spells themselves
	for (let pg of KinkyDungeonLearnableSpells[KinkyDungeonCurrentSpellsPage]) {
		let column = col;//Math.floor((spacing * i) / (maxY));
		i = 0;
		let iii = 0;
		for (let sp of pg) {
			let spell = KinkyDungeonFindSpell(sp, false);
			if (spell
				&& (KDSwapSpell == -1 || KinkyDungeonSpellIndex(spell.name) >= 0)
				&& i < KDMaxSpellPerColumn
				&& (selectedFilters.length == 0 || (spell.tags && selectedFilters.every((element) => {return spell.tags.includes(element);})))) {

				if (iii < KDSpellListIndex) {
					iii += 1;
					continue;
				}
				XX = column * (buttonwidth + xpadding);
				ii = i;// - column * Math.ceil(maxY / spacing);

				let cost = KinkyDungeonGetCost(spell);
				let suff = `: ${cost}p`;

				if (Mode == "Draw") {
					let color = KDSwapSpell == -1 ? "#bbbbbb" : "#888888";
					let index = KinkyDungeonSpellIndex(spell.name);
					if (index >= 0 && (KDSwapSpell == -1 || !KinkyDungeonSpellChoices.includes(index))) {
						color = "white";
						suff = "";
					} else if (!KinkyDungeonCheckSpellPrerequisite(spell)) {
						color = "#888888";
					}
					DrawButton(canvasOffsetX_ui + XX, yPad + canvasOffsetY_ui + spacing * ii, buttonwidth, spacing - ypadding, TextGet("KinkyDungeonSpell" + spell.name) + suff, color);
				} else if (Mode == "Click") {
					if (MouseIn(canvasOffsetX_ui + XX, yPad + canvasOffsetY_ui + spacing * ii, buttonwidth, spacing - ypadding)) return spell;
				}
				i++;
			}
		}
		col++;
	}
	return undefined;
}

function KinkyDungeonDrawMagicSpells() {

	KinkyDungeonListSpells("Draw");
	MainCanvas.textAlign = "center";

	DrawText(TextGet("KinkyDungeonSpellsPage") + (KinkyDungeonCurrentSpellsPage + 1) + ": " + TextGet("KinkyDungeonSpellsPage" + KinkyDungeonCurrentSpellsPage), canvasOffsetX_ui + 575, canvasOffsetY_ui + 25, "white", "black");
	//DrawText(TextGet("KinkyDungeonSpellsPoints") + KinkyDungeonSpellPoints, 650, 900, "white", "black");

	MainCanvas.textAlign = "center";
	if (KDSwapSpell != -1) {
		DrawText(TextGet(
			"KinkyDungeonMagicSpellsQuick").replace(
			"SPELLNAME",
				(KinkyDungeonSpells[KinkyDungeonSpellChoices[KDSwapSpell]]) ?
				TextGet("KinkyDungeonSpell" + KinkyDungeonSpells[KinkyDungeonSpellChoices[KDSwapSpell]].name)
				: TextGet("KinkyDungeonSpellNone")),
		canvasOffsetX_ui + 600, 900, "white", "black");
	} else {
		DrawText(TextGet("KinkyDungeonSpellsLevels")
			.replace("SPELLPOINTS", "" + KinkyDungeonSpellPoints), canvasOffsetX_ui + 600, 890, "white", "black");
	}
	DrawButton(canvasOffsetX_ui + 0, canvasOffsetY_ui, 50, 50, TextGet("KinkyDungeonSpellsPageBackFast"), "White", "", "");
	DrawButton(canvasOffsetX_ui + 1100, canvasOffsetY_ui, 50, 50, TextGet("KinkyDungeonSpellsPageNextFast"), "White", "", "");
	DrawButton(canvasOffsetX_ui + 55, canvasOffsetY_ui, 245, 50, TextGet("KinkyDungeonSpellsPageBack"), "White", "", "");
	DrawButton(canvasOffsetX_ui + 850, canvasOffsetY_ui, 245, 50, TextGet("KinkyDungeonSpellsPageNext"), "White", "", "");

	DrawButton(800, 925, 355, 60, TextGet("KinkyDungeonMagicSpellsBack"), "White", "", "");
}


function KinkyDungeonHandleMagicSpells() {

	if (MouseIn(800, 925, 355, 60)) {
		KinkyDungeonDrawState = "Magic";
		return true;
	} else if (MouseIn(canvasOffsetX_ui + 50, canvasOffsetY_ui, 250, 50)) {
		if (KinkyDungeonCurrentSpellsPage > 0) KinkyDungeonCurrentSpellsPage -= 1;
		else KinkyDungeonCurrentSpellsPage = KinkyDungeonLearnableSpells.length - 1;
		KDSpellListIndex = 0;
		return true;
	} else if (MouseIn(canvasOffsetX_ui + 850, canvasOffsetY_ui, 250, 50)) {
		if (KinkyDungeonCurrentSpellsPage < KinkyDungeonLearnableSpells.length - 1) KinkyDungeonCurrentSpellsPage += 1;
		else KinkyDungeonCurrentSpellsPage = 0;
		KDSpellListIndex = 0;
		return true;
	} else if (MouseIn(canvasOffsetX_ui + 0, canvasOffsetY_ui, 50, 50)) {
		if (KinkyDungeonCurrentSpellsPage > 0) {
			if (KinkyDungeonCurrentSpellsPage > 2) KinkyDungeonCurrentSpellsPage -= 3;
			else KinkyDungeonCurrentSpellsPage = 0;
		} else KinkyDungeonCurrentSpellsPage = KinkyDungeonLearnableSpells.length - 1;
		KDSpellListIndex = 0;
		return true;
	} else if (MouseIn(canvasOffsetX_ui + 1100, canvasOffsetY_ui, 50, 50)) {
		if (KinkyDungeonCurrentSpellsPage < KinkyDungeonLearnableSpells.length - 1)  {
			if (KinkyDungeonCurrentSpellsPage < KinkyDungeonLearnableSpells.length - 3) KinkyDungeonCurrentSpellsPage += 3;
			else KinkyDungeonCurrentSpellsPage = KinkyDungeonLearnableSpells.length - 1;
		}
		else KinkyDungeonCurrentSpellsPage = 0;
		KDSpellListIndex = 0;
		return true;
	}

	let spell = KinkyDungeonListSpells("Click");
	if (spell) {
		if (KDSwapSpell == -1) {
			KinkyDungeonSetPreviewSpell(spell);
		} else {
			let index = KinkyDungeonSpellIndex(spell.name);
			if (!KinkyDungeonSpellChoices.includes(index)) {
				KinkyDungeonClickSpellChoice(KDSwapSpell, index);
				KinkyDungeonDrawState = "Game";
			}
		}
		return true;
	}

	return true;
}

function KinkyDungeonSpellIndex(Name) {
	for (let i = 0; i < KinkyDungeonSpells.length; i++) {
		if (KinkyDungeonSpells[i].name == Name) return i;
	}
	return -1;
}

function KinkyDungeonSetPreviewSpell(spell) {
	let index = KinkyDungeonSpellIndex(spell.name);
	KinkyDungeonPreviewSpell = index >= 0 ? null : spell;
	if (!KinkyDungeonPreviewSpell) KinkyDungeonCurrentPage = index;
	KinkyDungeonDrawState = "Magic";
}

function KinkyDungeonGetCompList(spell) {
	let ret = "";
	if (spell.components)
		for (let c of spell.components) {
			if (ret) ret = ret + "/";
			if (c == "Verbal") ret = ret + (ret ? "V" : "Verbal");
			else if (c == "Arms") ret = ret + (ret ? "A" : "Arms");
			else if (c == "Legs") ret = ret + (ret ? "L" : "Legs");
		}

	//if (ret)
	//return "(" + ret + ")";
	//else
	return ret;
}

function KinkyDungeonSendMagicEvent(Event, data) {
	for (let i = 0; i < KinkyDungeonSpellChoices.length; i++) {
		let spell = KinkyDungeonSpells[KinkyDungeonSpellChoices[i]];
		if (spell && spell.events) {
			for (let e of spell.events) {
				if (e.trigger == Event && (KinkyDungeonSpellChoicesToggle[i] || e.always)) {
					KinkyDungeonHandleMagicEvent(Event, e, spell, data);
				}
			}
		}
	}
}