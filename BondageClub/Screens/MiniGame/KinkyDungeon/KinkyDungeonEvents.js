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

function KinkyDungeonSendEvent(Event, data) {
	KinkyDungeonSendMagicEvent(Event, data);
	KinkyDungeonSendWeaponEvent(Event, data);
	KinkyDungeonSendInventoryEvent(Event, data);
	KinkyDungeonSendBulletEvent(Event, data.bullet, data);
}

function KinkyDungeonResetEventVariables() {
	KinkyDungeonSlimeLevel = 0;
}
function KinkyDungeonResetEventVariablesTick() {
	if (KinkyDungeonSlimeLevel < 0)
		KinkyDungeonSlimeLevel = 0;
	KinkyDungeonSlimeLevelStart = KinkyDungeonSlimeLevel;
}

function KinkyDungeonHandleInventoryEvent(Event, item, data) {
	if (Event == "tick") {
		for (let e of item.events) {
			if (e.type == "iceDrain" && e.trigger == "tick" && e.power) {
				KinkyDungeonChangeMana(e.power);
				KinkyDungeonChangeStamina(e.power);
				KinkyDungeonSendTextMessage(1, TextGet("KinkyDungeonIceDrain"), "lightblue", 2);
			}


			if (e.type == "slimeSpread" && e.trigger == "tick") {
				KinkyDungeonSlimeLevel = Math.max(KinkyDungeonSlimeLevel, KinkyDungeonSlimeLevelStart + e.power);
				if (KinkyDungeonSlimeLevel >= 0.99999) {
					KinkyDungeonSlimeLevel = 0;
					KinkyDungeonSlimeLevelStart = -100;
					let slimedParts = [];
					let potentialSlimeParts = [];
					for (let inv of KinkyDungeonRestraintList()) {
						if (inv.restraint && inv.restraint.slimeLevel > 0) {
							slimedParts.push({name: inv.restraint.name, group: inv.restraint.Group, level: inv.restraint.slimeLevel});
						}
					}
					for (let slime of slimedParts) {
						let index = -1;
						for (let i = 0; i < KinkyDungeonSlimeParts.length; i++) if (KinkyDungeonSlimeParts[i].group == slime.group) {index = i; break;}
						if (index >= 0) {
							let slime2 = undefined;
							let slime3 = undefined;
							if (index > 0) {
								for (let s of potentialSlimeParts) if (s.group == KinkyDungeonSlimeParts[index-1].group && !s.level > slime.level) {slime2 = s; break;}
								if (!slime2) potentialSlimeParts.push({group: KinkyDungeonSlimeParts[index-1].group, restraint: KinkyDungeonSlimeParts[index-1].restraint, level: slime.level});
							}
							if (index < KinkyDungeonSlimeParts.length - 1) {
								for (let s of potentialSlimeParts) if (s.group == KinkyDungeonSlimeParts[index+1].group && !s.level > slime.level) {slime3 = s; break;}
								if (!slime3) potentialSlimeParts.push({group: KinkyDungeonSlimeParts[index+1].group, restraint: KinkyDungeonSlimeParts[index+1].restraint, level: slime.level});
							}
						}
					}
					let slimed = false;
					if (potentialSlimeParts.length == 0) {
						KinkyDungeonSlimeLevel = Math.min(KinkyDungeonSlimeLevel, 0.5);
						KinkyDungeonSlimeLevelStart = Math.min(KinkyDungeonSlimeLevelStart, 0.5);
					} else while (potentialSlimeParts.length > 0) {
						let newSlime = potentialSlimeParts[Math.floor(Math.random() * potentialSlimeParts.length)];
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
					if (!slimed && potentialSlimeParts.length == 0) {
						let slime = slimedParts[Math.floor(Math.random() * slimedParts.length)];
						if (KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("Hard" + slime.name), 0, true)) {
							KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonSlimeHarden"), "#ff44ff", 3);
							if (KinkyDungeonCurrentDress != "SlimeSuit") {
								KinkyDungeonSetDress("SlimeSuit");
								KinkyDungeonDressPlayer();
								KinkyDungeonSendTextMessage(6, TextGet("KinkyDungeonSlimeSpread"), "#ff44ff", 3);
							}
						}
						KinkyDungeonSlimeLevel = -100;
					}
				}
			}



		}
	} else if (Event == "remove") {
		for (let e of item.events) {
			if (e.type == "armbinderHarness" && e.trigger == "remove" && data.item != item && item.restraint && item.restraint.Group) {
				let armbinder = false;
				for (let inv of KinkyDungeonRestraintList()) {
					if (inv.restraint && inv.restraint.shrine && (inv.restraint.shrine.includes("Armbinders") || inv.restraint.shrine.includes("Boxbinders"))) {
						armbinder = true;
						break;
					}
				}
				if (!armbinder) {
					KinkyDungeonRemoveRestraint(item.restraint.Group, false, false, true);
					KinkyDungeonSendTextMessage(4, TextGet("KinkyDungeonRemoveArmbinderHarness"), "lightgreen", 2);
				}
			}
			if (e.type == "slimeStop" && e.trigger == "remove" && data.item == item) {
				KinkyDungeonSlimeLevel = 0;
			}
			if (e.type == "unlinkItem" && e.trigger == "remove" && data.item == item && !data.add && !data.shrine) {
				//KinkyDungeonUnLinkItem(item);
				//Obsolete
			}
		}
	} else if (Event == "hit") {
		for (let e of item.events) {
			if (e.type == "linkItem" && e.trigger == "hit" && (data.attack && data.attack.includes("Bind") && !data.attack.includes("Suicide"))) {
				let subMult = 1;
				let chance = e.chance ? e.chance : 1.0;
				if (e.noSub != undefined) {
					let rep = (KinkyDungeonGoddessRep.Ghost + 50)/100;
					subMult = e.noSub + (1 - e.noSub * rep);
				}
				if (item.restraint && item.restraint.Link && (Math.random() < chance * subMult) && (!e.noLeash || KDGameData.KinkyDungeonLeashedPlayer < 1)) {
					let newRestraint = KinkyDungeonGetRestraintByName(item.restraint.Link);
					//KinkyDungeonLinkItem(newRestraint, item, item.tightness, "");
					KinkyDungeonAddRestraint(newRestraint, item.tightness, true, "", false);
				}
			}
		}
	} else if (Event == "defeat") {
		for (let e of item.events) {
			if (e.type == "linkItem" && e.trigger == "defeat") {
				if (item.restraint && item.restraint.Link && (Math.random() < e.chance)) {
					let newRestraint = KinkyDungeonGetRestraintByName(item.restraint.Link);
					KinkyDungeonAddRestraint(newRestraint, item.tightness, true, "", false);
					//KinkyDungeonLinkItem(newRestraint, item, item.tightness, "");
				}
			}
		}
	} else if (Event == "struggle") {
		for (let e of item.events) {
			if (e.type == "crotchrope" && e.trigger == "struggle" && data.restraint && data.restraint.crotchrope && data.struggletype == "Struggle") {
				KinkyDungeonChangeArousal(1);
				KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonCrotchRope").replace("RestraintName", TextGet("Restraint" + data.restraint.name)), "pink", 3);
			}
		}
	}
}

function KinkyDungeonHandleBuffEvent(Event, buff, entity, data) {

}

function KinkyDungeonHandleMagicEvent(Event, spell, data) {
	if (Event == "calcEvasion") {
		for (let e of spell.events) {
			if (e.type == "HandsFree" && e.trigger == "calcEvasion" && !data.IsSpell && KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell))) {
				KDEvasionHands = false;
			}
		}
	} else if (Event == "beforeMove") {
		for (let e of spell.events) {
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
		}
	} else if (Event == "afterMove") {
		for (let e of spell.events) {
			if (e.type == "FleetFooted" && e.trigger == "afterMove" && e.prevSlowLevel && !data.IsSpell && KinkyDungeonSlowLevel == 0) {
				KinkyDungeonSlowLevel = e.prevSlowLevel;
				e.prevSlowLevel = undefined;
			}
		}
	} else if (Event == "beforeTrap") {
		for (let e of spell.events) {
			if (e.type == "FleetFooted" && e.trigger == "beforeTrap" && !KinkyDungeonNoTrapFlag && !data.IsSpell && KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell))) {
				if (KDRandom() < e.chance) {
					KinkyDungeonChangeMana(-KinkyDungeonGetManaCost(spell));
					KinkyDungeonNoTrapFlag = true;
					KinkyDungeonSendTextMessage(7, TextGet("KinkyDungeonFleetFootedIgnoreTrap"), "lightgreen", 2);
				}
			}
		}
	} else if (Event == "calcDamage") {
		for (let e of spell.events) {
			if (e.type == "HandsFree" && e.trigger == "calcDamage" && !data.IsSpell && KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell))) {
				KDDamageHands = false;
			}
		}
	} else if (Event == "getWeapon") {
		for (let e of spell.events) {
			if (e.type == "HandsFree" && e.trigger == "getWeapon" && !data.IsSpell && KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell))) {
				KDHandsFreeTag = true;
			}
		}
	} else if (Event == "playerAttack") {
		for (let e of spell.events) {
			if (e.type == "FlameBlade" && e.trigger == "playerAttack" && KinkyDungeonPlayerDamage && KinkyDungeonPlayerDamage.name && KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell)) && data.targetX && data.targetY && !(data.enemy && data.enemy.Enemy && data.enemy.Enemy.allied)) {
				KinkyDungeonChangeMana(-KinkyDungeonGetManaCost(spell));
				KinkyDungeonCastSpell(data.targetX, data.targetY, KinkyDungeonFindSpell("FlameStrike", true), undefined, undefined, undefined);
			} else if (e.type == "FloatingWeapon" && e.trigger == "playerAttack" && KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell)) && data.targetX && data.targetY && !(data.enemy && data.enemy.Enemy && data.enemy.Enemy.allied)) {
				let chanceWith = KinkyDungeonPlayerDamage.chance;
				let chanceWithout = KinkyDungeonGetPlayerWeaponDamage(KinkyDungeonCanUseWeapon(true), true).chance;
				KinkyDungeonGetPlayerWeaponDamage(KinkyDungeonCanUseWeapon());
				if (KinkyDungeonPlayerDamage && KinkyDungeonPlayerDamage.name && chanceWithout < chanceWith)
					KinkyDungeonChangeMana(-KinkyDungeonGetManaCost(spell));
			}
		}
	} else if (Event == "vision") {
		for (let e of spell.events) {
			if (e.type == "TrueSight" && e.trigger == "vision" && KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell))) {
				if (data.update)
					KinkyDungeonChangeMana(-KinkyDungeonGetManaCost(spell) * data.update);
				KinkyDungeonSeeThroughWalls = Math.max(KinkyDungeonSeeThroughWalls, 2);
			}
		}
	} else if (Event == "draw") {
		for (let e of spell.events) {
			if (e.type == "EnemySense" && e.trigger == "draw") {
				let activate = false;
				if (KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell)) && !KinkyDungeonPlayerBuffs.EnemySense) {
					KinkyDungeonChangeMana(-KinkyDungeonGetManaCost(spell) * data.update);
					KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {id: "EnemySense", type: "EnemySense", duration: 5});
					activate = true;
				}
				if (KinkyDungeonPlayerBuffs.EnemySense && KinkyDungeonPlayerBuffs.EnemySense.duration > 1)
					for (let E = 0; E < KinkyDungeonEntities.length; E++) {
						let enemy = KinkyDungeonEntities[E];
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
}

function KinkyDungeonHandleWeaponEvent(Event, weapon, data) {
	if (Event == "tick") {
		for (let e of weapon.events) {
			if (e.type == "Buff" && e.trigger == "tick") {
				KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {id: weapon.name, type: e.buffType, power: e.power, duration: 2});
			}
		}
	} else if (Event == "playerAttack") {
		for (let e of weapon.events) {
			if (e.type == "ElementalEffect" && e.trigger == "playerAttack" && data.enemy && !data.disarm && !data.evaded) {
				if (data.enemy) {
					KinkyDungeonDamageEnemy(data.enemy, {type:e.damage, damage: e.power, time: e.time}, false, true, undefined, undefined, undefined);
				}
			} if (e.type == "Cleave" && e.trigger == "playerAttack" && data.enemy && !data.disarm) {
				for (let enemy of KinkyDungeonEntities) {
					if (enemy != data.enemy) {
						let dist = Math.max(Math.abs(enemy.x - KinkyDungeonPlayerEntity.x), Math.abs(enemy.y - KinkyDungeonPlayerEntity.y));
						if (KinkyDungeonEvasion(enemy) && dist < 1.5 && Math.max(Math.abs(enemy.x - data.enemy.x), Math.abs(enemy.y - data.enemy.y))) {
							KinkyDungeonDamageEnemy(enemy, {type: e.damage, damage: e.power}, false, true, undefined, undefined, undefined);
						}
					}
				}
			} else if (e.type == "Pierce" && e.trigger == "playerAttack" && data.enemy && !data.disarm) {
				let xx = 2*data.enemy.x - KinkyDungeonPlayerEntity.x;
				let yy = 2*data.enemy.y - KinkyDungeonPlayerEntity.y;
				for (let enemy of KinkyDungeonEntities) {
					if (enemy != data.enemy) {
						if (KinkyDungeonEvasion(enemy) && enemy.x == xx && enemy.y == yy) {
							KinkyDungeonDamageEnemy(enemy, {type: e.damage, damage: e.power}, false, true, undefined, undefined, undefined);
						}
					}
				}
			} else if (e.type == "Knockback" && e.trigger == "playerAttack" && e.dist && data.enemy && data.targetX && data.targetY && !data.evaded && !data.disarm) {
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
		}
	}
}

function KinkyDungeonHandleBulletEvent(Event, b, data) {
	if (b.bullet) {
		if (Event == "bulletHit") {
			for (let e of b.bullet.events) {
				if (e.type == "DropKnife" && e.trigger == "bulletHit") {
					let point = {x: b.x, y:b.y};
					if (!KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(point.x, point.y))) {
						if (b.vx || b.vy) {
							let speed = KDistEuclidean(b.vx, b.vy);
							point = {x: Math.round(b.x - b.vx/speed), y: Math.round(b.y - b.vy/speed)};
						}
					}
					KinkyDungeonDropItem({name: "Knife"}, point, KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(point.x, point.y)), true, true);
				}
			}
		}
	}
}