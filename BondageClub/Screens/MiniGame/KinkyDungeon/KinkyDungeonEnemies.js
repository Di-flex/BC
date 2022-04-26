"use strict";

let KDEnemiesCache = new Map();

let KinkyDungeonSummonCount = 2;
let KinkyDungeonEnemyAlertRadius = 2;
let KDStealthyMult = 0.75;
let KDConspicuousMult = 1.5;

/**
 *
 * @param {entity} enemy
 * @returns {boolean}
 */
function KDAllied(enemy) {
	return enemy.Enemy && enemy.Enemy.allied;
}

/**
 *
 * @param {entity} enemy
 * @returns {boolean}
 */
function KDHostile(enemy) {
	return enemy.Enemy && !KDAllied(enemy);
}

function KinkyDungeonNearestJailPoint(x, y) {
	let dist = 100000;
	let point = null;
	for (let p of KDGameData.JailPoints) {
		let d = Math.max(Math.abs(x - p.x), Math.abs(y - p.y));
		if (d < dist) {
			dist = d;
			point = p;
		}
	}

	return point;
}

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
			let XX = p.x + Math.round(KDRandom() * 2 * radius - radius);
			let YY = p.y + Math.round(KDRandom() * 2 * radius - radius);
			if (t.includes(KinkyDungeonMapGet(XX, YY))) {
				return {x: XX, y: YY};
			}
		}
	}
	return p;
}

function KinkyDungeonNearestPlayer(enemy, requireVision, decoy, visionRadius) {
	if (enemy && enemy.Enemy && !visionRadius) {
		visionRadius = enemy.Enemy.visionRadius;
	}
	if (decoy) {
		let pdist = Math.sqrt((KinkyDungeonPlayerEntity.x - enemy.x)*(KinkyDungeonPlayerEntity.x - enemy.x)
			+ (KinkyDungeonPlayerEntity.y - enemy.y)*(KinkyDungeonPlayerEntity.y - enemy.y));
		let nearestVisible = undefined;
		let nearestDistance = KDHostile(enemy) ? pdist - 0.1 : 100000;

		for (let e of KinkyDungeonEntities) {
			if (e == enemy) continue;
			if (enemy.Enemy.noTargetSilenced && e.silence > 0) continue;
			if ((e.Enemy && (KDAllied(e) || e.rage) && !e.Enemy.noAttack && KDHostile(enemy)) || (KDAllied(enemy) && KDHostile(e)) || (enemy.rage && enemy != e)) {
				let dist = Math.sqrt((e.x - enemy.x)*(e.x - enemy.x)
					+ (e.y - enemy.y)*(e.y - enemy.y));
				if (dist <= nearestDistance) {
					if (KinkyDungeonCheckLOS(enemy, e, dist, visionRadius, true, true)) {
						if (enemy.rage || !e.Enemy.lowpriority
								|| !KinkyDungeonCheckLOS(enemy, KinkyDungeonPlayerEntity, pdist, visionRadius, true, true)
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

function KinkyDungeonInDanger() {
	for (let b of KinkyDungeonBullets) {
		let bdist = 1.5;
		if (b.vx && b.vy) bdist = 2*Math.sqrt(b.vx*b.vx + b.vy*b.vy);
		if (KinkyDungeonLightGet(Math.round(b.x), Math.round(b.y)) > 0 && Math.max(Math.abs(b.x - KinkyDungeonPlayerEntity.x), Math.abs(b.y - KinkyDungeonPlayerEntity.y)) < bdist) {
			return true;
		}
	}
	for (let enemy of KinkyDungeonEntities) {
		let playerDist = Math.max(Math.abs(enemy.x - KinkyDungeonPlayerEntity.x), Math.abs(enemy.y - KinkyDungeonPlayerEntity.y));
		if (KinkyDungeonLightGet(enemy.x, enemy.y) > 0) {
			if (((enemy.revealed && !enemy.Enemy.noReveal) || !enemy.Enemy.stealth || KinkyDungeonSeeAll || playerDist <= enemy.Enemy.stealth + 0.1) && !(KinkyDungeonGetBuffedStat(enemy.buffs, "Sneak") > 0)) {
				if ((KinkyDungeonHostile() || playerDist < 1.5)) {
					if ((KDHostile(enemy) || enemy.rage) && KinkyDungeonLightGet(enemy.x, enemy.y) > 0 &&
					(enemy.Enemy.AI != "ambush" || enemy.ambushtrigger)) {
						return true;
					}
					if ((KDHostile(enemy) || enemy.rage) && KinkyDungeonLightGet(enemy.x, enemy.y) > 0 &&
					(enemy.Enemy.AI != "ambush" || enemy.ambushtrigger)) {
						return true;
					}
				}
			}
		}
	}

	return false;
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

	for (let enemy of KinkyDungeonEntities) {
		let sprite = enemy.Enemy.name;
		KinkyDungeonUpdateVisualPosition(enemy, KinkyDungeonDrawDelta);
		let tx = enemy.visual_x;
		let ty = enemy.visual_y;
		let playerDist = Math.max(Math.abs(enemy.x - KinkyDungeonPlayerEntity.x), Math.abs(enemy.y - KinkyDungeonPlayerEntity.y));
		if (enemy.x >= CamX && enemy.y >= CamY && enemy.x < CamX + KinkyDungeonGridWidthDisplay && enemy.y < CamY + KinkyDungeonGridHeightDisplay
			&& KinkyDungeonLightGet(enemy.x, enemy.y) > 0) {
			if (((enemy.revealed && !enemy.Enemy.noReveal) || !enemy.Enemy.stealth || KinkyDungeonSeeAll || playerDist <= enemy.Enemy.stealth + 0.1) && !(KinkyDungeonGetBuffedStat(enemy.buffs, "Sneak") > 0)) {
				enemy.revealed = true;
				if ((KinkyDungeonHostile() || playerDist < 1.5)) {
					if ((KDHostile(enemy) || enemy.rage) && KinkyDungeonLightGet(enemy.x, enemy.y) > 0 && KinkyDungeonFastMove &&
					(enemy.Enemy.AI != "ambush" || enemy.ambushtrigger)) {
						if (KinkyDungeonFastMove && !KinkyDungeonFastMoveSuppress && !reenabled)
							KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Click.ogg");
						KinkyDungeonFastMove = false;
						KinkyDungeonFastMovePath = [];
						reenabled = false;
						if (!CommonIsMobile)
							KinkyDungeonFastMoveSuppress = true;
					}
					if ((KDHostile(enemy) || enemy.rage) && KinkyDungeonLightGet(enemy.x, enemy.y) > 0 && KinkyDungeonFastStruggle &&
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
				}
				if (!enemy.Enemy.bound || KDBoundEffects(enemy) < 4)
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Enemies/" + sprite + ".png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				else
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "EnemiesBound/" + enemy.Enemy.bound + ".png",
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

function KinkyDungeonDrawEnemiesStatus(canvasOffsetX, canvasOffsetY, CamX, CamY) {
	for (let enemy of KinkyDungeonEntities) {
		let tx = enemy.visual_x;
		let ty = enemy.visual_y;
		let playerDist = Math.max(Math.abs(enemy.x - KinkyDungeonPlayerEntity.x), Math.abs(enemy.y - KinkyDungeonPlayerEntity.y));
		if (enemy.x >= CamX && enemy.y >= CamY && enemy.x < CamX + KinkyDungeonGridWidthDisplay && enemy.y < CamY + KinkyDungeonGridHeightDisplay
			&& KinkyDungeonLightGet(enemy.x, enemy.y) > 0) {
			let bindLevel = KDBoundEffects(enemy);
			if (((enemy.revealed && !enemy.Enemy.noReveal) || !enemy.Enemy.stealth || KinkyDungeonSeeAll || playerDist <= enemy.Enemy.stealth + 0.1) && !(KinkyDungeonGetBuffedStat(enemy.buffs, "Sneak") > 0)) {
				if (enemy.aware && KDHostile(enemy) && enemy.vp > 0 && enemy.Enemy && !enemy.Enemy.noAlert && enemy.Enemy.visionRadius > 1.6 && enemy.Enemy.movePoints < 90 && enemy.Enemy.AI != "ambush") {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/Aware.png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay - KinkyDungeonGridSizeDisplay/2,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
				if (enemy.vulnerable) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/Vulnerable.png",
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
				if (enemy.silence) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/Silence.png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
				if (enemy.bind > 0 && bindLevel < 4) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/Bind.png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
				if (enemy.slow > 0 && bindLevel < 4) {
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
				if (KinkyDungeonGetBuffedStat(enemy.buffs, "AttackDmg") < 0 && bindLevel < 4) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/Debuff.png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
				if (KinkyDungeonGetBuffedStat(enemy.buffs, "Armor") < 0 && enemy.Enemy.armor > 0) {
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
				if (KinkyDungeonGetBuffedStat(enemy.buffs, "Evasion") > 0) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/EvasionBuff.png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
				if (KinkyDungeonGetBuffedStat(enemy.buffs, "DamageReduction") > 0) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/ShieldBuff.png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
				if (KinkyDungeonGetBuffedStat(enemy.buffs, "DamageAmp") > 0) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/DamageAmp.png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
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
}


function KinkyDungeonDrawEnemiesWarning(canvasOffsetX, canvasOffsetY, CamX, CamY) {
	for (let enemy of KinkyDungeonEntities) {
		if (enemy.warningTiles) {
			for (let t of enemy.warningTiles) {
				let tx = enemy.x + t.x;
				let ty = enemy.y + t.y;
				let special = enemy.usingSpecial ? "Special" : "";
				let attackMult = Math.max(0, KDBoundEffects(enemy) - 1);
				if ((!enemy.usingSpecial && enemy.Enemy.attackPoints > enemy.attackPoints + attackMult + 1.5) || (enemy.usingSpecial && enemy.Enemy.specialAttackPoints > enemy.attackPoints + 1.5 )) {
					special = "Basic";
				}
				//  && KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(tx, ty))
				if (tx >= CamX && ty >= CamY && tx < CamX + KinkyDungeonGridWidthDisplay && ty < CamY + KinkyDungeonGridHeightDisplay && !(tx == enemy.x && ty == enemy.y)) {
					if (enemy.Enemy.color)
						DrawImageCanvasColorize(KinkyDungeonRootDirectory + "WarningColor" + special + ".png", KinkyDungeonContext,
							(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay,
							KinkyDungeonSpriteSize/KinkyDungeonGridSizeDisplay,
							enemy.Enemy.color, true, []);
					else
						DrawImageZoomCanvas(KinkyDungeonRootDirectory + ((KDAllied(enemy)) ? "WarningAlly.png" : "Warning" + special + ".png"),
							KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
							(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay,
							KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
			}
		}
		if (enemy.Enemy.spells && (enemy.Enemy.spellRdy && (enemy.Enemy.AI != "ambush" || enemy.ambushtrigger)) && !(enemy.castCooldown > 1)) {
			let tx = enemy.visual_x;
			let ty = enemy.visual_y;
			//  && KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(tx, ty))
			if (tx >= CamX && ty >= CamY && tx < CamX + KinkyDungeonGridWidthDisplay && ty < CamY + KinkyDungeonGridHeightDisplay
				&& KDCanSeeEnemy(enemy, Math.max(Math.abs(enemy.x - KinkyDungeonPlayerEntity.x), Math.abs(enemy.y - KinkyDungeonPlayerEntity.y)))
				&& KinkyDungeonLightGet(enemy.x, enemy.y) > 0) {
				DrawImageCanvasColorize(KinkyDungeonRootDirectory + "SpellReady.png", KinkyDungeonContext,
					(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay,
					KinkyDungeonSpriteSize/KinkyDungeonGridSizeDisplay,
					enemy.Enemy.color ? enemy.Enemy.color : "#ffffff", true, []);
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

function KDCanSeeEnemy(enemy, playerDist) {
	return (((enemy.revealed && !enemy.Enemy.noReveal) || !enemy.Enemy.stealth || KinkyDungeonSeeAll || playerDist <= enemy.Enemy.stealth + 0.1) && !(KinkyDungeonGetBuffedStat(enemy.buffs, "Sneak") > 0));
}

function KinkyDungeonDrawEnemiesHP(canvasOffsetX, canvasOffsetY, CamX, CamY) {
	let tooltip = false;
	for (let enemy of KinkyDungeonEntities) {
		let playerDist = Math.max(Math.abs(enemy.x - KinkyDungeonPlayerEntity.x), Math.abs(enemy.y - KinkyDungeonPlayerEntity.y));
		if (enemy.x >= CamX && enemy.y >= CamY && enemy.x < CamX + KinkyDungeonGridWidthDisplay && enemy.y < CamY + KinkyDungeonGridHeightDisplay
			&& KinkyDungeonLightGet(enemy.x, enemy.y) > 0) {
			let xx = enemy.visual_x ? enemy.visual_x : enemy.x;
			let yy = enemy.visual_y ? enemy.visual_y : enemy.y;
			if ((!enemy.Enemy.stealth || playerDist <= enemy.Enemy.stealth + 0.1) && !(KinkyDungeonGetBuffedStat(enemy.buffs, "Sneak") > 0)
				&& (KDAllied(enemy) || ((enemy.lifetime != undefined || enemy.hp < enemy.Enemy.maxhp)))) {
				if (enemy.lifetime != undefined && enemy.maxlifetime > 0 && enemy.maxlifetime < 999) {
					KinkyDungeonBar(canvasOffsetX + (xx - CamX)*KinkyDungeonGridSizeDisplay, canvasOffsetY + (yy - CamY)*KinkyDungeonGridSizeDisplay - 12 - 15,
						KinkyDungeonGridSizeDisplay, 12, enemy.lifetime / enemy.maxlifetime * 100, "#cccccc", "#000000");
				}
				KinkyDungeonBar(canvasOffsetX + (xx - CamX)*KinkyDungeonGridSizeDisplay, canvasOffsetY + (yy - CamY)*KinkyDungeonGridSizeDisplay - 15,
					KinkyDungeonGridSizeDisplay, 12, enemy.hp / enemy.Enemy.maxhp * 100, KDAllied(enemy) ? "#00ff88" : "#ff0000", KDAllied(enemy) ? "#aa0000" : "#000000");
				if (enemy.boundLevel != undefined && enemy.boundLevel > 0 && (enemy.hp > enemy.Enemy.maxhp * 0.1 || KDBoundEffects(enemy) < 4)) {
					KinkyDungeonBar(canvasOffsetX + (xx - CamX)*KinkyDungeonGridSizeDisplay, canvasOffsetY + (yy - CamY)*KinkyDungeonGridSizeDisplay + 12 - 15,
						KinkyDungeonGridSizeDisplay, 12, enemy.boundLevel / enemy.Enemy.maxhp * 100, "#ffae70", "#52333f");
				}
			}
			if (KDCanSeeEnemy(enemy, playerDist)) {
				if (!tooltip && (enemy.Enemy.AI != "ambush" || enemy.ambushtrigger) && MouseIn(canvasOffsetX + (xx - CamX)*KinkyDungeonGridSizeDisplay, canvasOffsetY + (yy - CamY)*KinkyDungeonGridSizeDisplay,
					KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay)) {
					let name = TextGet("Name" + enemy.Enemy.name);
					DrawTextFit(name, 1 + canvasOffsetX + (xx - CamX)*KinkyDungeonGridSizeDisplay + KinkyDungeonGridSizeDisplay/2, 1 + canvasOffsetY + (yy - CamY)*KinkyDungeonGridSizeDisplay - KinkyDungeonGridSizeDisplay/7, 10 + name.length * 8, "black", "black");
					DrawTextFit(name, canvasOffsetX + (xx - CamX)*KinkyDungeonGridSizeDisplay + KinkyDungeonGridSizeDisplay/2, canvasOffsetY + (yy - CamY)*KinkyDungeonGridSizeDisplay - KinkyDungeonGridSizeDisplay/7, 10 + name.length * 8, "white", "black");
					tooltip = true;

					if (enemy.buffs && enemy.buffs.Analyze) {
						let i = 0;
						let spacing = 25;
						let pad = 70;
						if (enemy.Enemy.dmgType) {
							for (let dt of KinkyDungeonDamageTypes) {
								if (dt.name == enemy.Enemy.dmgType) {
									i += 1;
									let str = TextGet("KinkyDungeonTooltipDealsDamage").replace("DAMAGETYPE", TextGet("KinkyDungeonDamageType" + enemy.Enemy.dmgType));
									DrawTextFit(str,
										1 + canvasOffsetX + (xx - CamX)*KinkyDungeonGridSizeDisplay + KinkyDungeonGridSizeDisplay/2,
										1 + canvasOffsetY + (yy - CamY)*KinkyDungeonGridSizeDisplay - KinkyDungeonGridSizeDisplay/7 + pad + spacing * i, 10 + str.length * 8, dt.bg, dt.bg);
									DrawTextFit(str,
										canvasOffsetX + (xx - CamX)*KinkyDungeonGridSizeDisplay + KinkyDungeonGridSizeDisplay/2,
										canvasOffsetY + (yy - CamY)*KinkyDungeonGridSizeDisplay - KinkyDungeonGridSizeDisplay/7 + pad + spacing * i, 10 + str.length * 8, dt.color, dt.bg);
									break;
								}
							}
						}
						if (enemy.Enemy.armor) {
							i += 1;
							let str = TextGet("KinkyDungeonTooltipArmor").replace("AMOUNT", "" + enemy.Enemy.armor);
							DrawTextFit(str,
								1 + canvasOffsetX + (xx - CamX)*KinkyDungeonGridSizeDisplay + KinkyDungeonGridSizeDisplay/2,
								1 + canvasOffsetY + (yy - CamY)*KinkyDungeonGridSizeDisplay - KinkyDungeonGridSizeDisplay/7 + pad + spacing * i, 10 + str.length * 8, "black", "black");
							DrawTextFit(str,
								canvasOffsetX + (xx - CamX)*KinkyDungeonGridSizeDisplay + KinkyDungeonGridSizeDisplay/2,
								canvasOffsetY + (yy - CamY)*KinkyDungeonGridSizeDisplay - KinkyDungeonGridSizeDisplay/7 + pad + spacing * i, 10 + str.length * 8, "white", "black");
						}
						if (enemy.Enemy.evasion) {
							i += 1;
							let str = TextGet("KinkyDungeonTooltipEvasion").replace("AMOUNT", "" + Math.round(100 * KinkyDungeonMultiplicativeStat(enemy.Enemy.evasion)));
							DrawTextFit(str,
								1 + canvasOffsetX + (xx - CamX)*KinkyDungeonGridSizeDisplay + KinkyDungeonGridSizeDisplay/2,
								1 + canvasOffsetY + (yy - CamY)*KinkyDungeonGridSizeDisplay - KinkyDungeonGridSizeDisplay/7 + pad + spacing * i, 10 + str.length * 8, "black", "black");
							DrawTextFit(str,
								canvasOffsetX + (xx - CamX)*KinkyDungeonGridSizeDisplay + KinkyDungeonGridSizeDisplay/2,
								canvasOffsetY + (yy - CamY)*KinkyDungeonGridSizeDisplay - KinkyDungeonGridSizeDisplay/7 + pad + spacing * i, 10 + str.length * 8, "white", "black");
						}

						let list = Array.from(enemy.Enemy.tags.keys());
						if (enemy.Enemy.spellResist)
							list.push("magic");
						let magic = false;
						for (let t of list) {
							for (let dt of KinkyDungeonDamageTypes) {
								if ((t == dt.name + "resist" || t == dt.name + "weakness" || t == dt.name + "immune" || t == dt.name + "severeweakness")
									|| (dt.name == "magic" && t.includes("magic") && enemy.Enemy.spellResist)) {
									i += 1;
									let mult = 1.0;
									if (t == dt.name + "resist") mult = 0.5;
									else if (t == dt.name + "weakness") mult = 1.5;
									else if (t == dt.name + "immune") mult = 0;
									else if (t == dt.name + "severeweakness") mult = 2.0;
									if (dt.name == "magic" && !magic && enemy.Enemy.spellResist) {
										magic = true;
										mult *= KinkyDungeonMultiplicativeStat(enemy.Enemy.spellResist);
									}
									let str = TextGet("KinkyDungeonTooltipWeakness").replace("MULTIPLIER", "" + Math.round(mult * 100)/100).replace("DAMAGETYPE", TextGet("KinkyDungeonDamageType"+ dt.name));
									DrawTextFit(str,
										1 + canvasOffsetX + (xx - CamX)*KinkyDungeonGridSizeDisplay + KinkyDungeonGridSizeDisplay/2,
										1 + canvasOffsetY + (yy - CamY)*KinkyDungeonGridSizeDisplay - KinkyDungeonGridSizeDisplay/7 + pad + spacing * i, 10 + str.length * 8, dt.bg, dt.bg);
									DrawTextFit(str,
										canvasOffsetX + (xx - CamX)*KinkyDungeonGridSizeDisplay + KinkyDungeonGridSizeDisplay/2,
										canvasOffsetY + (yy - CamY)*KinkyDungeonGridSizeDisplay - KinkyDungeonGridSizeDisplay/7 + pad + spacing * i, 10 + str.length * 8, dt.color, dt.bg);

								}
							}
						}
					}
				}
			}
		}
	}
}

let KDChampionMax = 25;

function KinkyDungeonCapture(enemy) {
	let msg = "KinkyDungeonCapture";
	if (enemy.lifetime != undefined && enemy.lifetime < 999) {
		msg = "KinkyDungeonCaptureBasic";
	} else if (KDGameData.Champion) {
		if (KDGameData.ChampionCurrent < KDChampionMax) {
			KinkyDungeonChangeRep(KDGameData.Champion, 1);
			KinkyDungeonChangeMana(2);
			msg = "KinkyDungeonCaptureGoddess";
			KDGameData.ChampionCurrent += 1;
		} else msg = "KinkyDungeonCaptureMax";
	}
	if (!KinkyDungeonSendActionMessage(3, TextGet(msg).replace("EnemyName", TextGet("Name" + enemy.Enemy.name)).replace("GODDESS", TextGet("KinkyDungeonShrine" + KDGameData.Champion)), "lightgreen", 2))
		KinkyDungeonSendTextMessage(3, TextGet(msg).replace("EnemyName", TextGet("Name" + enemy.Enemy.name)).replace("GODDESS", TextGet("KinkyDungeonShrine" + KDGameData.Champion)), "lightgreen", 2);
}

function KinkyDungeonEnemyCheckHP(enemy, E) {
	if (enemy.hp <= 0) {
		KinkyDungeonEntities.splice(E, 1);
		if (KDBoundEffects(enemy) > 3 && enemy.boundLevel > 0 && KDHostile(enemy)) {
			if (enemy.items) {
				for (let name of enemy.items) {
					let item = {x:enemy.x, y:enemy.y, name: name};
					KinkyDungeonGroundItems.push(item);
				}
			} else {
				KinkyDungeonCapture(enemy);
			}
		} else {
			if (enemy.items) {
				for (let name of enemy.items) {
					let item = {x:enemy.x, y:enemy.y, name: name};
					KinkyDungeonGroundItems.push(item);
				}
			} else if (enemy == KinkyDungeonKilledEnemy && Math.max(3, enemy.Enemy.maxhp/4) >= KinkyDungeonActionMessagePriority) {
				KinkyDungeonSendActionMessage(1, TextGet("Kill"+enemy.Enemy.name), "orange", 2);
				KinkyDungeonKilledEnemy = null;
			}
		}
		if (enemy.Enemy && enemy.Enemy.tags && enemy.Enemy.tags.has("boss"))
			KinkyDungeonChangeRep("Ghost", -5);
		else if (enemy.Enemy && enemy.Enemy.tags && enemy.Enemy.tags.has("miniboss"))
			KinkyDungeonChangeRep("Ghost", -2);
		else if (enemy.Enemy && enemy.Enemy.tags && enemy.Enemy.tags.has("elite") && KDRandom() < 0.33)
			KinkyDungeonChangeRep("Ghost", -1);

		if (enemy.Enemy && enemy.Enemy.rep && !enemy.noRep)
			for (let rep of Object.keys(enemy.Enemy.rep))
				KinkyDungeonChangeRep(rep, enemy.Enemy.rep[rep]);

		if (enemy.Enemy && enemy.Enemy.ondeath) {
			for (let o of enemy.Enemy.ondeath) {
				if (o.type == "summon") {
					KinkyDungeonSummonEnemy(enemy.x, enemy.y, o.enemy, o.count, o.range, o.strict);
				} else if (o.type == "spellOnSelf") {
					let spell = KinkyDungeonFindSpell(o.spell, true);
					if (spell) KinkyDungeonCastSpell(enemy.x, enemy.y, spell, undefined, undefined, undefined);
				}
			}
		}
		if (!enemy.noDrop)
			KinkyDungeonItemDrop(enemy.x, enemy.y, enemy.Enemy.dropTable, enemy.summoned);
		return true;
	}
	return false;
}

function KinkyDungeonCheckLOS(enemy, player, distance, maxdistance, allowBlind, allowBars) {
	let bs = (enemy && enemy.Enemy && enemy.Enemy.blindSight) ? enemy.Enemy.blindSight : 0;
	if (KinkyDungeonStatsChoice.get("KillSquad")) bs += 20;
	if (player.player && enemy.Enemy && enemy.Enemy.playerBlindSight) bs = enemy.Enemy.playerBlindSight;
	return distance <= maxdistance && ((allowBlind && bs >= distance) || KinkyDungeonCheckPath(enemy.x, enemy.y, player.x, player.y, allowBars));
}

function KinkyDungeonTrackSneak(enemy, delta, player) {
	if (!enemy.vp) enemy.vp = 0;
	if (!player.player) return true;
	let sneakThreshold = enemy.Enemy.sneakThreshold ? enemy.Enemy.sneakThreshold : 2;
	if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Sneak")) sneakThreshold += KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Sneak");
	let deltaMult = 1/Math.max(1, (1 + KinkyDungeonSubmissiveMult));
	if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "SlowDetection")) deltaMult *= KinkyDungeonMultiplicativeStat(KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "SlowDetection"));
	if (KDGameData.Outfit) {
		let outfit = KinkyDungeonGetOutfit(KDGameData.Outfit);
		if (outfit && outfit.visibility)
			deltaMult *= outfit.visibility;
	}
	if (KinkyDungeonStatsChoice.get("Conspicuous")) deltaMult *= KDConspicuousMult;
	else if (KinkyDungeonStatsChoice.get("Stealthy")) deltaMult *= KDStealthyMult;
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

function KDNearbyEnemies(x, y, dist) {
	let list = [];
	for (let e of KinkyDungeonEntities) {
		if (KDistEuclidean(x - e.x, y - e.y) <= dist) list.push(e);
	}
	return list;
}

function KinkyDungeonGetRandomEnemyPoint(avoidPlayer, onlyPlayer, Enemy) {
	let tries = 0;

	while (tries < 100) {
		let points = Array.from(KinkyDungeonRandomPathablePoints, ([name, value]) => (value));
		let point = points[Math.floor(points.length * KDRandom())];
		if (point) {
			let X = point.x;//1 + Math.floor(KDRandom()*(KinkyDungeonGridWidth - 1));
			let Y = point.y;//1 + Math.floor(KDRandom()*(KinkyDungeonGridHeight - 1));
			let playerDist = 6;
			let PlayerEntity = KinkyDungeonNearestPlayer({x:X, y:Y});

			if (((!avoidPlayer || Math.sqrt((X - PlayerEntity.x) * (X - PlayerEntity.x) + (Y - PlayerEntity.y) * (Y - PlayerEntity.y)) > playerDist)
				&& (!onlyPlayer || Math.sqrt((X - PlayerEntity.x) * (X - PlayerEntity.x) + (Y - PlayerEntity.y) * (Y - PlayerEntity.y)) <= playerDist))
				&& (!KinkyDungeonPointInCell(X, Y)) && KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(X, Y))
				&& KinkyDungeonNoEnemyExceptSub(X, Y, true, Enemy) && (!KinkyDungeonTiles.get(X + "," + Y) || !KinkyDungeonTiles.get(X + "," + Y).OffLimits)) {
				return {x: X, y:Y};
			}
		}
		tries += 1;
	}

	return undefined;
}

function KinkyDungeonGetNearbyPoint(x, y, allowNearPlayer=false, Enemy, Adjacent) {
	let slots = [];
	for (let X = -Math.ceil(1); X <= Math.ceil(1); X++)
		for (let Y = -Math.ceil(1); Y <= Math.ceil(1); Y++) {
			if ((X != 0 || Y != 0) && KinkyDungeonTransparentObjects.includes(KinkyDungeonMapGet(x + X, y + Y))) {
				// We add the slot and those around it
				slots.push({x:x + X, y:y + Y});
				slots.push({x:x + X, y:y + Y});
				slots.push({x:x + X, y:y + Y});
				if (!Adjacent)
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
		let slot = slots[Math.floor(KDRandom() * slots.length)];
		if (slot && KinkyDungeonNoEnemyExceptSub(slot.x, slot.y, false, Enemy)
			&& (allowNearPlayer || Math.max(Math.abs(KinkyDungeonPlayerEntity.x - slot.x), Math.abs(KinkyDungeonPlayerEntity.y - slot.y)) > 1.5)
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

function KinkyDungeonHasStatus(enemy) {
	return enemy && (enemy.bind > 0 || enemy.slow > 0 || enemy.stun > 0 || enemy.freeze > 0 || enemy.silence > 0 || enemy.slow > 0 || KDBoundEffects(enemy));
}

function KDBoundEffects(enemy) {
	if (!enemy.Enemy.bound) return 0;
	if (!enemy.boundLevel) return 0;
	let boundLevel = enemy.boundLevel ? enemy.boundLevel : 0;
	if (KinkyDungeonStatsChoice.get("Rigger") && KDHostile(enemy)) boundLevel *= KDRiggerBindBoost;
	if (boundLevel > enemy.Enemy.maxhp || (enemy.hp <= 0.1*enemy.Enemy.maxhp && boundLevel > enemy.hp)) return 4; // Totally tied
	if (boundLevel > enemy.Enemy.maxhp*0.75) return 3;
	if (boundLevel > enemy.Enemy.maxhp*0.5) return 2;
	if (boundLevel > enemy.Enemy.maxhp*0.25) return 1;
	return 0;
}

function KinkyDungeonUpdateEnemies(delta) {
	let KinkyDungeonSummons = 0;
	let visionMod = 1.0;
	if (KinkyDungeonMapParams[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]]) {
		if (KinkyDungeonMapParams[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]].brightness) {
			visionMod = Math.min(1.0, KinkyDungeonMapParams[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]].brightness / 10);
		}
	}

	for (let i = KinkyDungeonEntities.length-1; i >= 0; i--) {
		let enemy = KinkyDungeonEntities[i];
		if (KDAllied(enemy) && enemy.summoned && !enemy.Enemy.noCountLimit && (!enemy.lifetime || enemy.lifetime > 999)) {
			KinkyDungeonSummons += 1;
			if (KinkyDungeonSummons > KinkyDungeonSummonCount) {
				enemy.hp -= Math.max(0.1 * enemy.hp) + 1;
			}
		}
	}

	if (KinkyDungeonTorsoGrabCD > 0) KinkyDungeonTorsoGrabCD -= 1;

	if (KDGameData.KinkyDungeonLeashedPlayer > 0) {
		KDGameData.KinkyDungeonLeashedPlayer -= 1;

		let nearestJail = KinkyDungeonNearestJailPoint(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y);
		if (nearestJail) {
			let xx = nearestJail.x + KinkyDungeonJailLeashX;
			let yy = nearestJail.y;
			if (KinkyDungeonTiles.get((xx-1) + "," + yy) && KinkyDungeonTiles.get((xx-1) + "," + yy).Type == "Door") {
				KinkyDungeonTiles.get((xx-1) + "," + yy).Lock = undefined;
			}
		}

	}
	KinkyDungeonUpdateFlags(delta);
	for (let enemy of KinkyDungeonEntities) {
		let master = KinkyDungeonFindMaster(enemy).master;
		if (master && enemy.aware) master.aware = true;
		if (master && master.aware) enemy.aware = true;
		if (enemy.Enemy.master && enemy.Enemy.master.dependent && !master) enemy.hp = -10000;
	}
	for (let E = 0; E < KinkyDungeonEntities.length; E++) {
		let enemy = KinkyDungeonEntities[E];
		if (enemy.vulnerable > 0) enemy.vulnerable -= delta;
		else enemy.vulnerable = 0;
		if (!(KDGameData.KinkyDungeonPenance && KinkyDungeonAngel()) || enemy == KinkyDungeonAngel()) {
			// Delete the enemy
			if (KinkyDungeonEnemyCheckHP(enemy, E)) { E -= 1; continue;}

			let player = (!KinkyDungeonAngel()) ? KinkyDungeonNearestPlayer(enemy, false, true, enemy.Enemy.visionRadius ? (enemy.Enemy.visionRadius + ((enemy.lifetime > 0 && enemy.Enemy.visionSummoned) ? enemy.Enemy.visionSummoned : 0)) : 0) : KinkyDungeonPlayerEntity;


			if (enemy.Enemy.convertTiles) {
				let tile = KinkyDungeonMapGet(enemy.x, enemy.y);
				for (let c of enemy.Enemy.convertTiles) {
					if (c.from == tile && c.to) {
						KinkyDungeonMapSet(enemy.x, enemy.y, c.to);
					}
				}
			}
			if (enemy.Enemy.triggersTraps) {
				KinkyDungeonHandleTraps(enemy.x, enemy.y);
			}


			if (!enemy.castCooldown) enemy.castCooldown = 0;
			if (enemy.castCooldown > 0) enemy.castCooldown = Math.max(0, enemy.castCooldown-delta);
			if (!enemy.castCooldownSpecial) enemy.castCooldownSpecial = 0;
			if (enemy.castCooldownSpecial > 0) enemy.castCooldownSpecial = Math.max(0, enemy.castCooldownSpecial-delta);

			let idle = true;
			let bindLevel = KDBoundEffects(enemy);

			if (enemy.Enemy.specialCharges && enemy.specialCharges <= 0) enemy.specialCD = 999;
			if (enemy.specialCD > 0)
				enemy.specialCD -= delta;
			if (enemy.slow > 0)
				enemy.slow -= delta;
			if (enemy.boundLevel > 0 && !(enemy.stun > 0 || enemy.freeze > 0) && (enemy.hp > enemy.Enemy.maxhp * 0.1 || bindLevel < 4)) {
				let mult = 1.0;
				if (enemy.bind > 0) mult *= 0.4;
				else if (enemy.slow > 0) mult *= 0.7;
				enemy.boundLevel = Math.max(0, enemy.boundLevel - delta * enemy.hp / enemy.Enemy.maxhp * mult);
			}
			if (enemy.Enemy.rage) enemy.rage = 9999;
			if (enemy.bind > 0)
				enemy.bind -= delta;
			if (enemy.blind > 0)
				enemy.blind -= delta;
			if (enemy.playWithPlayer > 0)
				enemy.playWithPlayer -= delta;
			if (enemy.playWithPlayerCD > 0)
				enemy.playWithPlayerCD -= delta;
			if (enemy.silence > 0)
				enemy.silence -= delta;
			if (enemy.disarmflag > 0 && enemy.Enemy.disarm && KinkyDungeonLastAction != "Attack")
				enemy.disarmflag = Math.max(0, enemy.disarmflag - enemy.Enemy.disarm);
			if (enemy.stun > 0 || enemy.freeze > 0) {
				enemy.warningTiles = [];
				enemy.disarmflag = 0;
				if (enemy.stun > 0) enemy.stun -= delta;
				if (enemy.freeze > 0) enemy.freeze -= delta;
			} else if (enemy.channel > 0) {
				enemy.warningTiles = [];
				if (enemy.channel > 0) enemy.channel -= delta;
			} else if (bindLevel > 3) {
				if (enemy.Enemy.power && enemy.hp > enemy.Enemy.maxhp * 0.1)
					enemy.boundLevel = Math.max(0, enemy.boundLevel - delta * (enemy.Enemy.power));
			} else {
				let start = performance.now();

				let playerItems = [];
				for (let inv of KinkyDungeonAllWeapon()) {
					if (inv.name != "Knife")
						playerItems.push(inv);
				}
				for (let inv of KinkyDungeonAllConsumable()) {
					playerItems.push(inv);
				}

				idle = KinkyDungeonEnemyLoop(enemy, player, delta, visionMod, playerItems);
				if (enemy.items) {
					let light = KinkyDungeonLightGet(enemy.x, enemy.y);
					if (light == 0 && !enemy.aware && KDRandom() < 0.2) {
						enemy.items = undefined;
					}
				}
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
				enemy.vp = Math.max(0, enemy.vp - 0.05);
			}

			// Delete the enemy
			if (KinkyDungeonEnemyCheckHP(enemy, E)) { E -= 1;}
			if (enemy.Enemy.regen) enemy.hp = Math.min(enemy.Enemy.maxhp, enemy.hp + enemy.Enemy.regen * delta);
			if (enemy.Enemy.lifespan || enemy.lifetime != undefined) {
				if (enemy.lifetime == undefined) enemy.lifetime = enemy.Enemy.lifespan;
				enemy.lifetime -= delta;
				if (enemy.lifetime <= 0) enemy.hp = -10000;
			}
		}
	}
	// vulnerability calc
	for (let i = KinkyDungeonEntities.length-1; i >= 0; i--) {
		let enemy = KinkyDungeonEntities[i];
		if (KDHostile(enemy)) {
			if (enemy.fx && enemy.fy) {
				if (enemy.x * 2 - enemy.fx == KinkyDungeonPlayerEntity.x && enemy.y * 2 - enemy.fy == KinkyDungeonPlayerEntity.y) enemy.vulnerable = Math.max(enemy.vulnerable, 1);
			}
		}
	}

	KinkyDungeonHandleJailSpawns(delta);
	KinkyDungeonHandleWanderingSpawns(delta);
	KinkyDungeonAlert = 0;
}

function KinkyDungeonEnemyLoop(enemy, player, delta, visionMod, playerItems) {
	let idle = true;
	let moved = false;
	let ignore = false;
	let followRange = enemy.Enemy.followRange;
	let visionRadius = enemy.Enemy.visionRadius ? (enemy.Enemy.visionRadius + ((enemy.lifetime > 0 && enemy.Enemy.visionSummoned) ? enemy.Enemy.visionSummoned : 0)) : 0;
	if (visionMod && visionRadius > 1.5) visionRadius = Math.max(1.5, visionRadius * visionMod);
	let chaseRadius = 8 + (Math.max(followRange * 2, 0)) + 2*Math.max(visionRadius ? visionRadius : 0, enemy.Enemy.blindSight ? enemy.Enemy.blindSight : 0);
	let blindSight = (enemy && enemy.Enemy && enemy.Enemy.blindSight) ? enemy.Enemy.blindSight : 0;
	if (KinkyDungeonStatsChoice.get("KillSquad")) {
		visionRadius *= 2;
		chaseRadius *= 2;
		blindSight += 20;
		if (blindSight > visionRadius) {
			visionRadius = blindSight;
		}
		if (blindSight > chaseRadius) {
			chaseRadius = blindSight;
		}
	}
	let ignoreLocks = enemy.Enemy.keys;
	let harmless = (KinkyDungeonPlayerDamage.dmg <= enemy.Enemy.armor || !KinkyDungeonHasStamina(1.1)) && !KinkyDungeonCanTalk() && !KinkyDungeonPlayer.CanInteract() && KinkyDungeonSlowLevel > 1;
	let playerEvasionMult = KinkyDungeonStatsChoice.get("Dodge") && KinkyDungeonMiscastChance < 0.001 ? KDDodgeAmount : 1.0;

	// Check if the enemy ignores the player
	if (player.player) {
		if (enemy.Enemy.tags.has("ignorenoSP") && !KinkyDungeonHasStamina(1.1)) ignore = true;
		if (enemy.Enemy.tags.has("ignoreharmless") && (!enemy.warningTiles || enemy.warningTiles.length == 0)
			&& harmless && (!enemy.Enemy.ignorechance || KDRandom() < enemy.Enemy.ignorechance || !KinkyDungeonHasStamina(1.1))) ignore = true;
		if (enemy.Enemy.tags.has("ignoretiedup") && (!enemy.warningTiles || enemy.warningTiles.length == 0) && enemy.lifetime == undefined
			&& !KinkyDungeonPlayer.CanInteract() && !KinkyDungeonCanTalk() && !KinkyDungeonPlayer.CanInteract() && KinkyDungeonSlowLevel > 1
			&& (!enemy.Enemy.ignorechance || KDRandom() < enemy.Enemy.ignorechance || !KinkyDungeonHasStamina(1.1))) ignore = true;
		if (enemy.Enemy.tags.has("ignoregagged") && (!enemy.warningTiles || enemy.warningTiles.length == 0) && enemy.lifetime == undefined
			&& !KinkyDungeonCanTalk()
			&& (!enemy.Enemy.ignorechance || KDRandom() < enemy.Enemy.ignorechance || !KinkyDungeonHasStamina(1.1))) ignore = true;
		if (enemy.Enemy.tags.has("ignoreboundhands") && (!enemy.warningTiles || enemy.warningTiles.length == 0) && enemy.lifetime == undefined
			&& (KinkyDungeonPlayerDamage.dmg <= enemy.Enemy.armor || !KinkyDungeonHasStamina(1.1)) && !KinkyDungeonPlayer.CanInteract()
			&& (!enemy.Enemy.ignorechance || KDRandom() < enemy.Enemy.ignorechance || !KinkyDungeonHasStamina(1.1))) ignore = true;
		if (enemy.Enemy.ignoreflag) {
			for (let f of enemy.Enemy.ignoreflag) {
				if (KinkyDungeonFlags[f]) ignore = true;
			}
		}
		if (!KinkyDungeonHostile() && !(enemy.rage > 0) && !enemy.Enemy.alwaysHostile) ignore = true;
	}

	let MovableTiles = KinkyDungeonMovableTilesEnemy;
	let AvoidTiles = "g";
	if (enemy.Enemy.tags && enemy.Enemy.tags.has("opendoors")) MovableTiles = KinkyDungeonMovableTilesSmartEnemy;
	if (enemy.Enemy.ethereal) {
		AvoidTiles = "";
		MovableTiles = MovableTiles + "1X";
	} else if (enemy.Enemy.squeeze && KDGameData.KinkyDungeonLeashingEnemy != enemy.id) {
		MovableTiles = MovableTiles + 'b';
		AvoidTiles = "";
	}

	let attack = enemy.Enemy.attack;
	let range = enemy.Enemy.attackRange;
	let width = enemy.Enemy.attackWidth;
	let accuracy = enemy.Enemy.accuracy ? enemy.Enemy.accuracy : 1.0;
	let vibe = false;
	let damage = enemy.Enemy.dmgType;
	let power = enemy.Enemy.power;
	let leashing = enemy.Enemy.tags.has("leashing");

	let targetRestraintLevel = 0.3 + (enemy.aggro ? enemy.aggro : 0);
	if (enemy.aggro > 0 && delta > 0) enemy.aggro = enemy.aggro * 0.95;
	if (KinkyDungeonStatsChoice.has("NoWayOut") || KinkyDungeonCanPlay() || enemy.hp < enemy.Enemy.maxhp * 0.5) targetRestraintLevel = 999;
	let addLeash = leashing && KinkyDungeonSubmissiveMult >= targetRestraintLevel && (!KinkyDungeonGetRestraintItem("ItemNeck") || !KinkyDungeonGetRestraintItem("ItemNeckRestraints"));

	if (enemy.Enemy.tags && enemy.Enemy.tags.has("leashing") && (!KinkyDungeonHasStamina(1.1) || addLeash)) {
		followRange = 1;
		if (!attack.includes("Bind")) attack = "Bind" + attack;
	}

	let refreshWarningTiles = false;

	let hitsfx = (enemy.Enemy && enemy.Enemy.hitsfx) ? enemy.Enemy.hitsfx : "";
	let playerDist = Math.sqrt((enemy.x - player.x)*(enemy.x - player.x) + (enemy.y - player.y)*(enemy.y - player.y));
	if (KinkyDungeonAlert && playerDist < KinkyDungeonAlert) {
		enemy.aware = true;
		if (!enemy.aggro) enemy.aggro = 0;
		enemy.aggro += 0.1;
	}
	if (enemy.Enemy.specialAttack && (!enemy.specialCD || enemy.specialCD <= 0) && (!enemy.Enemy.specialMinrange || playerDist > enemy.Enemy.specialMinrange)) {
		attack = attack + enemy.Enemy.specialAttack;
		refreshWarningTiles = !enemy.usingSpecial;
		enemy.usingSpecial = true;
		if (enemy.Enemy && enemy.Enemy.hitsfxSpecial) hitsfx = enemy.Enemy.hitsfxSpecial;

		if (enemy.Enemy.specialRemove) attack = attack.replace(enemy.Enemy.specialRemove, "");
		if (enemy.Enemy.specialRange && enemy.usingSpecial) {
			range = enemy.Enemy.specialRange;
		}
		if (enemy.Enemy.specialWidth && enemy.usingSpecial) {
			width = enemy.Enemy.specialWidth;
		}
		if (enemy.Enemy.specialPower && enemy.usingSpecial) {
			power = enemy.Enemy.specialPower;
		}
		if (enemy.Enemy.specialDamage && enemy.usingSpecial) {
			damage = enemy.Enemy.specialDamage;
		}
	}

	let addMoreRestraints = KinkyDungeonStatsChoice.has("NoWayOut") || !leashing || (attack.includes("Bind") && (KinkyDungeonSubmissiveMult < targetRestraintLevel || !(KinkyDungeonIsArmsBound() || KinkyDungeonIsHandsBound())));

	if (!enemy.Enemy.attackWhileMoving && range > followRange) {
		followRange = range;
	}
	if (player.player && enemy.Enemy && enemy.Enemy.playerFollowRange) followRange = enemy.Enemy.playerFollowRange;

	let AI = enemy.AI ? enemy.AI : enemy.Enemy.AI;
	if (!enemy.warningTiles) enemy.warningTiles = [];
	let canSensePlayer = KinkyDungeonCheckLOS(enemy, player, playerDist, visionRadius, true, true);
	let canSeePlayer = KinkyDungeonCheckLOS(enemy, player, playerDist, visionRadius, false, false);
	let canSeePlayerChase = enemy.aware ? KinkyDungeonCheckLOS(enemy, player, playerDist, chaseRadius, false, false) : false;
	let canSeePlayerMedium = KinkyDungeonCheckLOS(enemy, player, playerDist, visionRadius/1.4, false, true);
	let canSeePlayerClose = KinkyDungeonCheckLOS(enemy, player, playerDist, visionRadius/2, false, true);
	let canSeePlayerVeryClose = KinkyDungeonCheckLOS(enemy, player, playerDist, visionRadius/3, false, true);
	let canShootPlayer = KinkyDungeonCheckLOS(enemy, player, playerDist, visionRadius, false, true);

	if (KinkyDungeonLastTurnAction && canSeePlayer) {
		if (!enemy.aggro) enemy.aggro = 0;
		enemy.aggro += KinkyDungeonLastTurnAction == "Struggle" ? 0.1 :
			(KinkyDungeonLastTurnAction == "Spell" ? 0.3 :
				(KinkyDungeonAlert ? 0.1 :
					0.01));
	}

	if (enemy.Enemy.projectileAttack && (!canShootPlayer || !KinkyDungeonCheckProjectileClearance(enemy.x, enemy.y, player.x, player.y))) followRange = 1;

	if (!KinkyDungeonHostile() && !enemy.Enemy.alwaysHostile && !(enemy.rage > 0) && canSeePlayer && player.player
		&& (!KinkyDungeonJailGuard() || (KinkyDungeonJailGuard().CurrentAction !== "jailLeashTour" && (!KinkyDungeonPlayerInCell() || KinkyDungeonLastTurnAction == "Struggle" || KinkyDungeonLastAction == "Struggle")))) {
		if (enemy.Enemy.tags.has("jailer") || enemy.Enemy.tags.has("jail")) {
			if (KinkyDungeonPlayer.CanInteract()) KinkyDungeonAggroAction('unrestrained', {enemy: enemy});
			else if ((KinkyDungeonLastTurnAction == "Struggle" || KinkyDungeonLastAction == "Struggle")) KinkyDungeonAggroAction('struggle', {enemy: enemy});
			else if (!KinkyDungeonPlayerInCell()) KinkyDungeonAggroAction('jailbreak', {enemy: enemy});
		}
		ignore = !KinkyDungeonHostile();
	}
	let chance = 0.05;
	if (KDGameData.JailKey) chance += 0.2;
	if (playerDist < 1.5) chance += 0.1;
	if (enemy.aware) chance += 0.1;
	if (KinkyDungeonPlayerDamage && !KinkyDungeonPlayerDamage.unarmed) chance += 0.25;
	if (playerItems || KinkyDungeonRedKeys > 0) {
		chance += 0.2;
		if (playerItems.length > 6) {
			chance += 0.5;
		}
	}
	if (playerDist < enemy.Enemy.visionRadius / 2) chance += 0.1;
	if (KinkyDungeonCanPlay() && !enemy.Enemy.alwaysHostile && !(enemy.rage > 0) && player.player && canSeePlayer && enemy.aware && !(enemy.playWithPlayerCD > 0) && !(enemy.playWithPlayer > 0) && (enemy.Enemy.tags.has("jailer") || enemy.Enemy.tags.has("jail") || enemy.Enemy.playLine) && !KinkyDungeonInJail() && KDRandom() < chance) {
		enemy.playWithPlayer = 8 + Math.floor(KDRandom() * (5 * Math.min(5, Math.max(enemy.Enemy.attackPoints, enemy.Enemy.movePoints))));
		enemy.playWithPlayerCD = enemy.playWithPlayer * 2.2;
		let index = Math.floor(Math.random() * 3);
		let suff = enemy.Enemy.playLine ? enemy.Enemy.playLine : "";
		KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonRemindJailPlay" + suff + index).replace("EnemyName", TextGet("Name" + enemy.Enemy.name)), "yellow", 4);
	}

	if (!KinkyDungeonHostile() && player.player && enemy.playWithPlayer) ignore = false;

	let sneakMult = 0.25;
	if (canSeePlayerMedium) sneakMult += 0.45;
	if (canSeePlayerClose) sneakMult += 0.25;
	if (canSeePlayerVeryClose) sneakMult += 0.5;
	if (KinkyDungeonAlert > 0) sneakMult += 1;
	if ((canSensePlayer || canSeePlayer || canShootPlayer || canSeePlayerChase) && KinkyDungeonTrackSneak(enemy, delta * (sneakMult), player)) {
		if (!ignore) {
			enemy.gx = player.x;
			enemy.gy = player.y;
		}
		if (canSensePlayer || canSeePlayer || canShootPlayer) {
			enemy.aware = true;
			if (KDHostile(enemy) && !enemy.rage && !enemy.Enemy.tags.has("minor")) {
				for (let e of KinkyDungeonEntities) {
					if (KDHostile(e) && !enemy.rage && e != enemy && KDistChebyshev(e.x - enemy.x, e.y - enemy.y) <= KinkyDungeonEnemyAlertRadius) e.aware = true;
				}
			}
		}
	}

	let kite = false;
	let kiteChance = enemy.Enemy.kiteChance ? enemy.Enemy.kiteChance : 0.75;
	if (canSeePlayer && KinkyDungeonHostile() && enemy.Enemy && enemy.Enemy.kite && !enemy.usingSpecial && (!player.player || KinkyDungeonHasStamina(1.1)) && (enemy.attackPoints <= 0 || enemy.Enemy.attackWhileMoving) && playerDist <= enemy.Enemy.kite && (KDHostile(enemy) || !player.player)) {
		if (!enemy.Enemy.kiteOnlyWhenDisabled || !(KinkyDungeonStatBlind < 0 || KinkyDungeonStatBind > 0 || KinkyDungeonStatFreeze > 0 || KinkyDungeonSlowMoveTurns > 0 || KDGameData.SleepTurns > 0))
			if (!enemy.Enemy.noKiteWhenHarmless || !harmless)
				if (kiteChance >= 1 || KDRandom() < kiteChance)
					kite = true;
	}

	if (!KinkyDungeonHostile() && enemy.playWithPlayer) followRange = 1;

	if (AI == "guard" && (!enemy.gxx || !enemy.gyy)) {
		enemy.gxx = enemy.gx;
		enemy.gyy = enemy.gy;
	}

	if ((AI == "ambush" && enemy.Enemy.wanderTillSees && !enemy.aware && !enemy.ambushtrigger)) {
		idle = true;
		if (ignore || !KinkyDungeonCheckLOS(enemy, player, playerDist, followRange + 0.5, enemy.attackPoints < 1 || !enemy.Enemy.projectileAttack, false) || kite)
			for (let T = 0; T < 8; T++) { // try 8 times
				let dir = KinkyDungeonGetDirection(10*(KDRandom()-0.5), 10*(KDRandom()-0.5));
				if (MovableTiles.includes(KinkyDungeonMapGet(enemy.x + dir.x, enemy.y + dir.y)) && (T > 5 || !AvoidTiles.includes(KinkyDungeonMapGet(enemy.x + dir.x, enemy.y + dir.y)))
					&& KinkyDungeonNoEnemy(enemy.x + dir.x, enemy.y + dir.y, true)) {
					if (KinkyDungeonEnemyTryMove(enemy, dir, delta, enemy.x + dir.x, enemy.y + dir.y)) moved = true;
					idle = false;
					break;
				}
			}
	} else if ((AI == "guard" || AI == "patrol" || AI == "wander" || AI == "hunt" || (AI == "ambush" && enemy.ambushtrigger)) && ((enemy.Enemy.attackWhileMoving && enemy != KinkyDungeonLeashingEnemy()) || ignore || !(KinkyDungeonCheckLOS(enemy, player, playerDist, followRange + 0.5, enemy.attackPoints < 1 || !enemy.Enemy.projectileAttack, false) && enemy.aware) || kite)) {
		if (!enemy.gx) enemy.gx = enemy.x;
		if (!enemy.gy) enemy.gy = enemy.y;

		idle = true;
		let patrolChange = false;

		// try 12 times to find a moveable tile, with some random variance
		if (AI != "wander" && !ignore && (enemy.aware || (KDAllied(enemy) && player.player && playerDist > 1.5)) && playerDist <= chaseRadius && (AI != "ambush" || enemy.ambushtrigger || enemy.gx != enemy.x || enemy.gy != enemy.y)) {
			//enemy.aware = true;

			for (let T = 0; T < 12; T++) {
				let dir = kite ? KinkyDungeonGetDirectionRandom(enemy.x - player.x, enemy.y - player.y) : KinkyDungeonGetDirectionRandom(player.x - enemy.x, player.y - enemy.y);
				let splice = false;
				if (T > 2 && T < 8) dir = KinkyDungeonGetDirectionRandom(dir.x * 10, dir.y * 10); // Fan out a bit
				if (T >= 8 || (enemy.path && !canSeePlayer) || (!canSeePlayer && !(enemy.Enemy.stopToCast && canShootPlayer))) {
					if (!enemy.path && (KinkyDungeonAlert || enemy.aware || canSeePlayer))
						enemy.path = KinkyDungeonFindPath(enemy.x, enemy.y, player.x, player.y, false, false, ignoreLocks, MovableTiles); // Give up and pathfind
					if (enemy.path && enemy.path.length > 0 && Math.max(Math.abs(enemy.path[0].x - enemy.x),Math.abs(enemy.path[0].y - enemy.y)) < 1.5) {
						dir = {x: enemy.path[0].x - enemy.x, y: enemy.path[0].y - enemy.y, delta: KDistChebyshev(enemy.path[0].x - enemy.x, enemy.path[0].y - enemy.y)};
						if (!KinkyDungeonNoEnemyExceptSub(enemy.x + dir.x, enemy.y + dir.y, false, enemy)) enemy.path = undefined;
						splice = true;
					} else {
						enemy.path = undefined;
						if (!canSensePlayer)
							enemy.aware = false;
						//dir = KinkyDungeonGetDirectionRandom(0, 0); // Random...
					}
				}
				if (dir.delta > 1.5) {enemy.path = undefined;}
				else if (KinkyDungeonEnemyCanMove(enemy, dir, MovableTiles, AvoidTiles, ignoreLocks, T)) {
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
					if (!enemy.path) enemy.path = KinkyDungeonFindPath(enemy.x, enemy.y, enemy.gx, enemy.gy, playerDist > chaseRadius, KDRandom() < 0.5 ? ignore : false, ignoreLocks, MovableTiles); // Give up and pathfind
					if (enemy.path && enemy.path.length > 0) {
						dir = {x: enemy.path[0].x - enemy.x, y: enemy.path[0].y - enemy.y, delta: KDistChebyshev(enemy.path[0].x - enemy.x, enemy.path[0].y - enemy.y)};
						if (!KinkyDungeonNoEnemyExceptSub(enemy.x + dir.x, enemy.y + dir.y, false, enemy)) enemy.path = undefined;
						splice = true;
					} else {
						enemy.path = undefined;
					}
				}
				if (dir.delta > 1.5) {enemy.path = undefined;}
				else if (KinkyDungeonEnemyCanMove(enemy, dir, MovableTiles, AvoidTiles, ignoreLocks, T)) {
					if (KinkyDungeonEnemyTryMove(enemy, dir, delta, enemy.x + dir.x, enemy.y + dir.y)) moved = true;
					if (moved && splice && enemy.path) enemy.path.splice(0, 1);
					idle = false;
					break;
				} else if (KinkyDungeonPlayerEntity.x == enemy.x + dir.x && KinkyDungeonPlayerEntity.y == enemy.y + dir.y) enemy.path = undefined;
			}
		} else if (Math.abs(enemy.x - enemy.gx) < 2 || Math.abs(enemy.y - enemy.gy) < 2) patrolChange = true;

		if (AI == "patrol") {
			let patrolChance = patrolChange ? 0.2 : 0.04;
			if (!enemy.patrolIndex) enemy.patrolIndex = KinkyDungeonNearestPatrolPoint(enemy.x, enemy.y);
			if (KinkyDungeonPatrolPoints[enemy.patrolIndex] && KDRandom() < patrolChance) {
				if (enemy.patrolIndex < KinkyDungeonPatrolPoints.length - 1) enemy.patrolIndex += 1;
				else enemy.patrolIndex = 0;

				let newPoint = KinkyDungeonGetPatrolPoint(enemy.patrolIndex, 1.4, MovableTiles);
				enemy.gx = newPoint.x;
				enemy.gy = newPoint.y;
			}

		}
		if (AI == "guard" && Math.max(Math.abs(enemy.x - enemy.gx), Math.abs(enemy.y - enemy.gy)) < 1.5 && enemy.gxx && enemy.gyy) {
			enemy.gx = enemy.gxx;
			enemy.gy = enemy.gyy;
		}
		if ((AI == "wander" || AI == "hunt") && enemy.movePoints < 1 && (!enemy.aware || !KinkyDungeonHostile())) {
			if (Math.max(Math.abs(enemy.x - enemy.gx), Math.abs(enemy.y - enemy.gy)) < 1.5 || (!(enemy.vp > 0.05) && (!enemy.path || KDRandom() < 0.1))) {
				let master = KinkyDungeonFindMaster(enemy).master;
				if (KDRandom() < 0.1 && !master) {
					// long distance hunt
					let newPoint = KinkyDungeonGetRandomEnemyPoint(false, enemy.tracking && KinkyDungeonHuntDownPlayer);
					if (newPoint) {
						enemy.gx = newPoint.x;
						enemy.gy = newPoint.y;
					}
				} else {
					if (KinkyDungeonAlert && playerDist < Math.max(4, visionRadius)) {
						enemy.gx = KinkyDungeonPlayerEntity.x;
						enemy.gy = KinkyDungeonPlayerEntity.y;
					} else {
						// Short distance
						let ex = enemy.x;
						let ey = enemy.y;
						let cohesion = enemy.Enemy.cohesion ? enemy.Enemy.cohesion : 0.5;
						let masterCloseness = enemy.Enemy.cohesion ? enemy.Enemy.cohesion : 0.7;
						if (master && KDRandom() < masterCloseness) {
							ex = master.x;
							ey = master.y;
						} else if (KDRandom() < cohesion) {
							let minDist = enemy.Enemy.cohesionRange ? enemy.Enemy.cohesionRange : visionRadius;
							for (let e of KinkyDungeonEntities) {
								if (e == enemy) continue;
								if (enemy.Enemy.clusterWith && !e.Enemy.tags.has(enemy.Enemy.clusterWith)) continue;
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
						if (newPoint && (KinkyDungeonHostile() || !KinkyDungeonPointInCell(newPoint.x, newPoint.y))) {
							enemy.gx = newPoint.x;
							enemy.gy = newPoint.y;
						}
					}
				}
			}
		}
	}

	if (enemy.usingSpecial && !enemy.specialCD) enemy.specialCD = 0;

	let sneakThreshold = enemy.Enemy.sneakThreshold ? enemy.Enemy.sneakThreshold : 2;
	if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Sneak")) sneakThreshold += KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Sneak");
	playerDist = Math.sqrt((enemy.x - player.x)*(enemy.x - player.x) + (enemy.y - player.y)*(enemy.y - player.y));
	if ((!enemy.Enemy.followLeashedOnly || KDGameData.KinkyDungeonLeashedPlayer < 1 || KDGameData.KinkyDungeonLeashingEnemy == enemy.id) && (KDHostile(enemy) || (!player.player && (!player.Enemy || KDHostile(player) || enemy.rage))) && ((enemy.aware && KinkyDungeonTrackSneak(enemy, 0, player)) || (playerDist < Math.max(1.5, blindSight) && enemy.vp >= sneakThreshold/2))
		&& (AI != "ambush" || enemy.ambushtrigger) && !ignore && (!moved || enemy.Enemy.attackWhileMoving)
		&& (attack.includes("Melee") || (enemy.Enemy.tags && leashing && !KinkyDungeonHasStamina(1.1)))
		&& KinkyDungeonCheckLOS(enemy, player, playerDist, range + 0.5, !enemy.Enemy.projectileAttack, !enemy.Enemy.projectileAttack)) {//Player is adjacent
		idle = false;
		enemy.revealed = true;

		let dir = KinkyDungeonGetDirection(player.x - enemy.x, player.y - enemy.y);

		let moveMult = KDBoundEffects(enemy);
		let attackMult = Math.max(0, KDBoundEffects(enemy) - 1);
		let attackTiles = enemy.warningTiles ? enemy.warningTiles : [dir];
		let ap = (KinkyDungeonMovePoints < 0 && !KinkyDungeonHasStamina(1.1) && KDGameData.KinkyDungeonLeashingEnemy == enemy.id) ? enemy.Enemy.movePoints+moveMult+1 : enemy.Enemy.attackPoints + attackMult;
		if (!KinkyDungeonEnemyTryAttack(enemy, player, attackTiles, delta, enemy.x + dir.x, enemy.y + dir.y, (enemy.usingSpecial && enemy.Enemy.specialAttackPoints) ? enemy.Enemy.specialAttackPoints : ap, undefined, undefined, enemy.usingSpecial, refreshWarningTiles, attack, MovableTiles)) {
			if (enemy.warningTiles.length == 0 || (refreshWarningTiles && enemy.usingSpecial)) {
				let minrange = enemy.Enemy.tilesMinRange ? enemy.Enemy.tilesMinRange : 1;
				if (enemy.usingSpecial && enemy.Enemy.tilesMinRangeSpecial) minrange = enemy.Enemy.tilesMinRangeSpecial;
				if ((!enemy.usingSpecial && enemy.attackPoints > 0) || enemy.specialCD < 1) {
					enemy.fx = undefined;
					enemy.fy = undefined;
					enemy.warningTiles = KinkyDungeonGetWarningTiles(player.x - enemy.x, player.y - enemy.y, range, width, minrange);
					let playerIn = false;
					for (let tile of enemy.warningTiles) {
						if (KinkyDungeonPlayerEntity.x == enemy.x + tile.x && KinkyDungeonPlayerEntity.y == enemy.y + tile.y) {playerIn = true; break;}
					}
					if (!playerIn) {
						enemy.fx = player.x;
						enemy.fy = player.y;
					}
				}
				if (refreshWarningTiles && enemy.usingSpecial) enemy.attackPoints = Math.min(enemy.attackPoints, delta);
			} else {
				let playerIn = false;
				for (let tile of enemy.warningTiles) {
					if (player.x == enemy.x + tile.x && player.y == enemy.y + tile.y) {playerIn = true; break;}
				}
				if (!playerIn) {
					if (enemy.Enemy.specialRange && enemy.usingSpecial && enemy.Enemy.specialCDonAttack) {
						enemy.specialCD = enemy.Enemy.specialCD;
						if (enemy.Enemy.stunOnSpecialCD) enemy.stun = enemy.Enemy.stunOnSpecialCD;
						if (attack.includes("Dash") && enemy.Enemy.dashOnMiss) {
							KDDash(enemy, player, MovableTiles);
						}
					}
					if (enemy.Enemy.specialWidth && enemy.usingSpecial && enemy.Enemy.specialCDonAttack) {
						enemy.specialCD = enemy.Enemy.specialCD;
						if (enemy.Enemy.stunOnSpecialCD) enemy.stun = enemy.Enemy.stunOnSpecialCD;
						if (attack.includes("Dash") && enemy.Enemy.dashOnMiss) {
							KDDash(enemy, player, MovableTiles);
						}
					}
				}
			}

			let playerEvasion = (player.player) ? playerEvasionMult * KinkyDungeonMultiplicativeStat(KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Evasion"))
				: KinkyDungeonMultiplicativeStat(((player.Enemy && player.Enemy.evasion) ? player.Enemy.evasion : 0)) * KinkyDungeonMultiplicativeStat(KinkyDungeonGetBuffedStat(player.buffs, "Evasion"));
			if (playerDist < 1.5 && player.player && attack.includes("Bind") && enemy.Enemy.bound && KDRandom() * accuracy <= playerEvasion && KinkyDungeonMovePoints > -1 && KinkyDungeonTorsoGrabCD < 1 && KinkyDungeonLastAction == "Move") {
				let caught = false;
				for (let tile of enemy.warningTiles) {
					if (enemy.x + tile.x == player.x && enemy.y + tile.y == player.y) {
						caught = true;
						break;
					}
				}
				if (caught) {
					let harnessChance = 0;
					let harnessRestraintName = "";
					let list = KinkyDungeonAllRestraint();
					let list2 = [];
					for (let restraint of list) {
						if (KDRestraint(restraint) && KDRestraint(restraint).harness) {
							harnessChance += 1;
							list2.push(KDRestraint(restraint).name);
						}
					}
					let rest = list2[Math.floor(KDRandom() * list2.length)];
					if (rest) harnessRestraintName = rest;

					if (harnessChance > 0) {
						let roll = KDRandom();
						for (let T = 0; T < harnessChance; T++) {
							roll = Math.min(roll, KDRandom());
						}
						if (roll < KinkyDungeonTorsoGrabChance) {
							KinkyDungeonMovePoints = -1;
							let msg = TextGet("KinkyDungeonTorsoGrab").replace("RestraintName", TextGet("Restraint" + harnessRestraintName)).replace("EnemyName", TextGet("Name" + enemy.Enemy.name));

							if (!KinkyDungeonSendTextMessage(5, msg, "yellow", 1))
								KinkyDungeonSendActionMessage(5, msg, "yellow", 1);

							KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Grab.ogg");
							KinkyDungeonTorsoGrabCD = 2;
						}
					}
				}
			}
		} else { // Attack lands!
			enemy.revealed = true;
			let hit = ((enemy.usingSpecial && enemy.Enemy.specialAttackPoints) ? enemy.Enemy.specialAttackPoints : ap) <= 1;
			for (let tile of enemy.warningTiles) {
				if (enemy.x + tile.x == player.x && enemy.y + tile.y == player.y) {
					hit = true;
					break;
				}
			}

			let playerEvasion = (player.player) ? playerEvasionMult * KinkyDungeonMultiplicativeStat(KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Evasion"))
				: KinkyDungeonMultiplicativeStat(((player.Enemy && player.Enemy.evasion) ? player.Enemy.evasion : 0)) * KinkyDungeonMultiplicativeStat(KinkyDungeonGetBuffedStat(player.buffs, "Evasion"));

			if (hit) {
				if (player.player)
					KinkyDungeonTickBuffTag(KinkyDungeonPlayerBuffs, "incomingHit", 1);
				else
					KinkyDungeonTickBuffTag(player.buffs, "incomingHit", 1);
			}

			let preData = {
				attack: attack,
				enemy: enemy,
				damagetype: damage,
				attacker: enemy,
			};
			KinkyDungeonSendEvent("beforeAttack", preData);

			if (hit && KDRandom() > playerEvasion) {
				if (player.player) {
					KinkyDungeonSendEvent("miss", {enemy: enemy});
					KinkyDungeonSendTextMessage(2, TextGet("KinkyDungeonAttackMiss").replace("EnemyName", TextGet("Name" + enemy.Enemy.name)), "lightgreen", 1);

				}
				enemy.vulnerable = Math.max(enemy.vulnerable, 1);
				hit = false;
			}
			if (hit) {
				let replace = [];
				let restraintAdd = [];
				let willpowerDamage = 0;
				let msgColor = "yellow";
				let Locked = false;
				let Stun = false;
				let Blind = false;
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
							Lstart = Math.floor(Lmax*KDRandom()); // Lock one at random
						}
						for (let L = Lstart; L <= Lmax; L++) {
							KinkyDungeonLock(Lockable[L], KinkyDungeonGenerateLock(true)); // Lock it!
							priorityBonus += KDRestraint(Lockable[L]).power;
						}
						Locked = true;
						happened += 1;
						if (enemy.usingSpecial && Locked && enemy.Enemy.specialAttack && enemy.Enemy.specialAttack.includes("Lock")) {
							enemy.specialCD = enemy.Enemy.specialCD;
						}
					} else if (attack.includes("Bind")
						&& (addMoreRestraints || addLeash)
						&& ((!enemy.usingSpecial && !enemy.Enemy.bindOnKneel) || (enemy.usingSpecial && !enemy.Enemy.bindOnKneelSpecial) || KinkyDungeonPlayer.Pose.includes("Kneel") || KinkyDungeonPlayer.Pose.includes("Hogtie"))) {
						let numTimes = 1;
						if (enemy.Enemy.multiBind) numTimes = enemy.Enemy.multiBind;
						for (let times = 0; times < numTimes; times++) {
							// Note that higher power enemies get a bonus to the floor restraints appear on
							let rest = KinkyDungeonGetRestraint(
								enemy.Enemy, MiniGameKinkyDungeonLevel,
								KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint],
								enemy.Enemy.bypass,
								enemy.Enemy.useLock ? enemy.Enemy.useLock : "",
								!enemy.Enemy.ignoreStaminaForBinds && !attack.includes("Suicide"),
								!addMoreRestraints && addLeash);
							if (rest) {
								replace.push({keyword:"RestraintAdded", value: TextGet("Restraint" + rest.name)});
								restraintAdd.push(rest);
								addedRestraint = true;
							}
						}
						if (enemy.usingSpecial && addedRestraint && enemy.Enemy.specialAttack && enemy.Enemy.specialAttack.includes("Bind")) {
							enemy.specialCD = enemy.Enemy.specialCD;
						}
						if (!addedRestraint && enemy.Enemy.fullBoundBonus) {
							willpowerDamage += enemy.Enemy.fullBoundBonus; // Some enemies deal bonus damage if they cannot put a binding on you
						}
					}
				}
				if (attack.includes("Bind") && KDGameData.KinkyDungeonLeashedPlayer < 1 && !enemy.Enemy.nopickpocket && player.player && enemy.Enemy.bound) {
					let item = playerItems.length > 0 ? playerItems[Math.floor(KDRandom() * playerItems.length)] : undefined;
					if (item && playerItems.length > 0
						&& KinkyDungeonIsArmsBound() && ((!KinkyDungeonPlayerDamage || item.name != KinkyDungeonPlayerDamage.name) || KinkyDungeonStatStamina < KinkyDungeonStatStaminaMax * 0.05) && KDRandom() < 0.5) {
						if (item.type == Weapon) {
							KinkyDungeonInventoryRemove(item);
							KinkyDungeonAddLostItems([item], false);
							if (!enemy.items) enemy.items = [item.name];
							enemy.items.push(item.name);
						} else if (item.type == Consumable) {
							KinkyDungeonChangeConsumable(KinkyDungeonConsumables[item.name], -1);
							/** @type {item} */
							let item2 = Object.assign({}, item);
							item2.quantity = 1;
							//KinkyDungeonAddLostItems([item2], false);
							if (!enemy.items) enemy.items = [item.name];
							enemy.items.push(item.name);
						}
						if (item) {
							KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonStealItem").replace("ITEMSTOLEN", TextGet("KinkyDungeonInventoryItem" + item.name)), "yellow", 2);
						}
					} else if (KinkyDungeonNormalBlades > 0 && (KinkyDungeonLockpicks == 0 || KDRandom() < 0.5)) {
						KinkyDungeonNormalBlades -= 1;
						KinkyDungeonSendActionMessage(8, TextGet("KinkyDungeonStealKnife"), "yellow", 2);
						if (!enemy.items) enemy.items = ["Knife"];
						enemy.items.push("Knife");
					} else if (KinkyDungeonLockpicks > 0 && KDRandom() < 0.5) {
						KinkyDungeonLockpicks -= 1;
						KinkyDungeonSendActionMessage(8, TextGet("KinkyDungeonStealPick"), "yellow", 2);
						if (!enemy.items) enemy.items = ["Pick"];
						enemy.items.push("Pick");
					} else if (KinkyDungeonRedKeys > 0) {
						KinkyDungeonRedKeys -= 1;
						KinkyDungeonSendActionMessage(8, TextGet("KinkyDungeonStealRedKey"), "yellow", 2);
						if (!enemy.items) enemy.items = ["RedKey"];
						enemy.items.push("RedKey");
					} else if (KinkyDungeonBlueKeys > 0) {
						KinkyDungeonBlueKeys -= 1;
						KinkyDungeonSendActionMessage(8, TextGet("KinkyDungeonStealBlueKey"), "yellow", 2);
						if (!enemy.items) enemy.items = ["BlueKey"];
						enemy.items.push("BlueKey");
					}
					/*else if (KinkyDungeonEnchantedBlades > 0 && KDRandom() < 0.5) {
						KinkyDungeonEnchantedBlades -= 1;
						KinkyDungeonSendActionMessage(8, TextGet("KinkyDungeonStealEnchKnife"), "yellow", 2);
						if (!enemy.items) enemy.items = ["EnchKnife"];
						enemy.items.push("knife");
					}*/
					KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Miss.ogg");
				}

				if (attack.includes("Suicide")) {
					if ((!enemy.Enemy.suicideOnAdd && !enemy.Enemy.suicideOnLock)
						|| (enemy.Enemy.suicideOnAdd && addedRestraint) || (enemy.Enemy.suicideOnLock && Locked) || (!player.player && attack.includes("Bind") && enemy.Enemy.suicideOnAdd)) {
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
				if (player.player && playerDist < range + 0.5 && (KinkyDungeonHostile() || attack.includes("Pull")) && (((!enemy.Enemy.noLeashUnlessExhausted || !KinkyDungeonHasStamina(1.1)) && enemy.Enemy.tags && enemy.Enemy.tags.has("leashing")) || attack.includes("Pull")) && (KDGameData.KinkyDungeonLeashedPlayer < 1 || KDGameData.KinkyDungeonLeashingEnemy == enemy.id)) {
					let wearingLeash = false;
					if (!wearingLeash && !attack.includes("Pull"))
						wearingLeash = KinkyDungeonIsWearingLeash();
					let leashToExit = enemy.Enemy.tags.has("leashing") && !KinkyDungeonHasStamina(1.1) && playerDist < 1.5;
					let leashed = wearingLeash || attack.includes("Pull");
					if (leashed) {
						let nearestJail = KinkyDungeonNearestJailPoint(enemy.x, enemy.y);
						let leashPos = nearestJail;
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
						if (leashPos == nearestJail && !KinkyDungeonHasStamina(1.1) && Math.abs(KinkyDungeonPlayerEntity.x - leashPos.x) <= 1 && Math.abs(KinkyDungeonPlayerEntity.y - leashPos.y) <= 1) {
							KinkyDungeonDefeat();
							KDGameData.KinkyDungeonLeashedPlayer = 3 + ap * 2;
							KDGameData.KinkyDungeonLeashingEnemy = enemy.id;
						}
						else if (Math.abs(KinkyDungeonPlayerEntity.x - leashPos.x) > 1.5 || Math.abs(KinkyDungeonPlayerEntity.y - leashPos.y) > 1.5) {
							if (!KinkyDungeonHasStamina(1.1)) KinkyDungeonMovePoints = -2;
							// Leash pullback
							if (playerDist < 1.5) {
								let path = KinkyDungeonFindPath(enemy.x, enemy.y, leashPos.x, leashPos.y, false, false, true, KinkyDungeonMovableTilesSmartEnemy);
								if (path && path.length > 0) {
									let leashPoint = path[0];
									let enemySwap = KinkyDungeonEnemyAt(leashPoint.x, leashPoint.y);
									if ((!enemySwap || !enemySwap.Enemy.noDisplace) && Math.max(Math.abs(leashPoint.x - enemy.x), Math.abs(leashPoint.y - enemy.y)) <= 1.5) {
										KDGameData.KinkyDungeonLeashedPlayer = 3 + ap * 2;
										KDGameData.KinkyDungeonLeashingEnemy = enemy.id;
										if (enemySwap) {
											enemySwap.x = KinkyDungeonPlayerEntity.x;
											enemySwap.y = KinkyDungeonPlayerEntity.y;
											enemySwap.warningTiles = [];
										}
										KinkyDungeonPlayerEntity.x = enemy.x;
										KinkyDungeonPlayerEntity.y = enemy.y;
										KinkyDungeonTargetTile = null;
										enemy.x = leashPoint.x;
										enemy.y = leashPoint.y;
										hitsfx = "Struggle";
										if (!KinkyDungeonHasStamina(1.1)) {
											KinkyDungeonSlowMoveTurns = enemy.Enemy.movePoints + moveMult - (KDRandom() < 0.25 ? 1 : 0);
											KinkyDungeonSleepTime = CommonTime() + 200;
										}
										if (enemy.usingSpecial && enemy.Enemy.specialAttack && enemy.Enemy.specialAttack.includes("Pull")) {
											enemy.specialCD = enemy.Enemy.specialCD;
										}
										if (KinkyDungeonMapGet(enemy.x, enemy.y) == 'D')  {
											KinkyDungeonMapSet(enemy.x, enemy.y, 'd');
											if (KinkyDungeonTiles.get(enemy.x + ',' +enemy.y) && KinkyDungeonTiles.get(enemy.x + ',' +enemy.y).Type == "Door")
												KinkyDungeonTiles.get(enemy.x + ',' +enemy.y).Lock = undefined;
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
										if (enemy.usingSpecial && enemy.Enemy.specialAttack && enemy.Enemy.specialAttack.includes("Pull")) {
											enemy.specialCD = enemy.Enemy.specialCD;
										}
										KDGameData.KinkyDungeonLeashedPlayer = 2;
										KDGameData.KinkyDungeonLeashingEnemy = enemy.id;
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
				let data = {};
				if (attack.includes("Dash") && (enemy.Enemy.dashThruWalls || canSeePlayer)) {
					let d = KDDash(enemy, player, MovableTiles);
					Dash = d.Dash;
					happened += d.happened;
				}
				if (attack.includes("Will") || willpowerDamage > 0) {
					if (willpowerDamage == 0)
						willpowerDamage += power;
					let buffdmg = KinkyDungeonGetBuffedStat(enemy.buffs, "AttackDmg");
					if (buffdmg) willpowerDamage = Math.max(0, willpowerDamage + buffdmg);
					msgColor = "#ff8888";
					if (enemy.usingSpecial && willpowerDamage > 0 && enemy.Enemy.specialAttack && enemy.Enemy.specialAttack.includes("Will")) {
						enemy.specialCD = enemy.Enemy.specialCD;
					}
				}
				if (player.player) {
					KinkyDungeonTickBuffTag(enemy.buffs, "hit", 1);
					for (let r of restraintAdd) {
						let bb =  KinkyDungeonAddRestraintIfWeaker(r, power, enemy.Enemy.bypass, enemy.Enemy.useLock ? enemy.Enemy.useLock : undefined) * 2;
						if (bb) {
							KDSendStatus('bound', r.name, "enemy_" + enemy.Enemy.name);
						}
						bound += bb;
					}
					if (attack.includes("Slow")) {
						KinkyDungeonMovePoints = Math.max(KinkyDungeonMovePoints - 2, -1);
						if (enemy.usingSpecial && enemy.Enemy.specialAttack && enemy.Enemy.specialAttack.includes("Slow")) {
							enemy.specialCD = enemy.Enemy.specialCD;
						}
						happened += 1;
					}
					if (attack.includes("Effect") && enemy.Enemy.effect) {
						let affected = KinkyDungeonPlayerEffect(enemy.Enemy.effect.damage, enemy.Enemy.effect.effect, enemy.Enemy.effect.spell);
						if (affected && enemy.usingSpecial && enemy.Enemy.specialAttack && enemy.Enemy.specialAttack.includes("Effect")) {
							enemy.specialCD = enemy.Enemy.specialCD;
						}
						happened += 1;
					}
					if (attack.includes("Stun")) {
						let time = enemy.Enemy.stunTime ? enemy.Enemy.stunTime : 1;
						KinkyDungeonStatBlind = Math.max(KinkyDungeonStatBlind, time);
						KinkyDungeonMovePoints = Math.max(Math.min(-1, -time+1), KinkyDungeonMovePoints-time); // This is to prevent stunlock while slowed heavily
						if (enemy.usingSpecial && enemy.Enemy.specialAttack && enemy.Enemy.specialAttack.includes("Stun")) {
							enemy.specialCD = enemy.Enemy.specialCD;
						}
						happened += 1;
						priorityBonus += 3*time;
						Stun = true;
					}
					if (attack.includes("Blind")) {
						let time = enemy.Enemy.blindTime ? enemy.Enemy.blindTime : 1;
						KinkyDungeonStatBlind = Math.max(KinkyDungeonStatBlind, time);
						if (enemy.usingSpecial && enemy.Enemy.specialAttack && enemy.Enemy.specialAttack.includes("Blind")) {
							enemy.specialCD = enemy.Enemy.specialCD;
						}
						happened += 1;
						priorityBonus += 3*time;
						Blind = true;
					}
					happened += bound;

					data = {
						attack: attack,
						enemy: enemy,
						bound: bound,
						damage: willpowerDamage,
						damagetype: damage,
						restraintsAdded: restraintAdd,
						attacker: enemy,
					};
					KinkyDungeonSendEvent("beforeDamage", data);
					happened += KinkyDungeonDealDamage({damage: data.damage, type: data.damagetype});

					replace.push({keyword:"DamageTaken", value: data.damage});
				} else { // if (KDRandom() <= playerEvasion)
					if (attack.includes("Slow")) {
						if (player.movePoints)
							player.movePoints = Math.max(player.movePoints - 1, 0);
						if (enemy.usingSpecial && enemy.Enemy.specialAttack && enemy.Enemy.specialAttack.includes("Slow")) {
							enemy.specialCD = enemy.Enemy.specialCD;
						}
						happened += 1;
					}
					if (attack.includes("Stun")) {
						let time = enemy.Enemy.stunTime ? enemy.Enemy.stunTime : 1;
						if (!player.stun) player.stun = time;
						else player.stun = Math.max(time, player.stun);
						if (enemy.usingSpecial && enemy.Enemy.specialAttack && enemy.Enemy.specialAttack.includes("Stun")) {
							enemy.specialCD = enemy.Enemy.specialCD;
						}
						happened += 1;
					}
					if (attack.includes("Blind")) {
						let time = enemy.Enemy.blindTime ? enemy.Enemy.blindTime : 1;
						if (!player.blind) player.blind = time;
						else player.blind = Math.max(time, player.blind);
						if (enemy.usingSpecial && enemy.Enemy.specialAttack && enemy.Enemy.specialAttack.includes("Blind")) {
							enemy.specialCD = enemy.Enemy.specialCD;
						}
						happened += 1;
					}
					if (attack.includes("Silence")) {
						let time = enemy.Enemy.silenceTime ? enemy.Enemy.silenceTime : 1;
						if (!player.silence) player.silence = time;
						else player.silence = Math.max(time, player.silence);
						if (enemy.usingSpecial && enemy.Enemy.specialAttack && enemy.Enemy.specialAttack.includes("Blind")) {
							enemy.specialCD = enemy.Enemy.specialCD;
						}
						happened += 1;
					}


					let dmg = power;
					let buffdmg = KinkyDungeonGetBuffedStat(enemy.buffs, "AttackDmg");
					if (buffdmg) dmg = Math.max(0, dmg + buffdmg);
					if (enemy.Enemy.fullBoundBonus) {
						dmg += enemy.Enemy.fullBoundBonus; // Some enemies deal bonus damage if they cannot put a binding on you
					}
					happened += KinkyDungeonDamageEnemy(player, {type: enemy.Enemy.dmgType, damage: dmg}, false, true, undefined, undefined, enemy);
					KinkyDungeonTickBuffTag(enemy.buffs, "hit", 1);
					if (happened > 0) {
						let sfx = (hitsfx) ? hitsfx : "DealDamage";
						KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + sfx + ".ogg");
					}
				}

				if (enemy.usingSpecial && enemy.specialCD > 0 && enemy.Enemy.specialCharges) {
					if (enemy.specialCharges == undefined) enemy.specialCharges = enemy.Enemy.specialCharges-1;
					else enemy.specialCharges -= 1;
				}

				if (happened > 0 && player.player) {
					let suffix = "";
					if (Stun) suffix = "Stun";
					else if (Blind) suffix = "Blind";
					else if (Locked) suffix = "Lock";
					else if (bound > 0) suffix = "Bind";
					if (Dash) suffix = "Dash";

					let sfx = (hitsfx) ? hitsfx : (data.damage > 1 ? "Damage" : "DamageWeak");
					if (enemy.usingSpecial && enemy.Enemy.specialsfx) sfx = enemy.Enemy.specialsfx;
					KinkyDungeonSendEvent("hit", data);
					KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + sfx + ".ogg");
					let text = TextGet("Attack"+enemy.Enemy.name + suffix);
					if (replace)
						for (let R = 0; R < replace.length; R++)
							text = text.replace(replace[R].keyword, "" + replace[R].value);
					KinkyDungeonSendTextMessage(happened+priorityBonus, text, msgColor, 1);
					KinkyDungeonLoseJailKeys(true);
				}
			} else {
				let sfx = (enemy.Enemy && enemy.Enemy.misssfx) ? enemy.Enemy.misssfx : "Miss";
				KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + sfx + ".ogg");
				enemy.vulnerable = Math.max(enemy.vulnerable, 1);
				if (attack.includes("Dash") && enemy.Enemy.dashOnMiss) {
					KDDash(enemy, player, MovableTiles);
				}
			}

			KinkyDungeonTickBuffTag(enemy.buffs, "damage", 1);

			enemy.warningTiles = [];
			if (enemy.usingSpecial) enemy.usingSpecial = false;
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


	if ((KinkyDungeonHostile() || (KDGameData.PrisonerState == 'parole' && enemy.Enemy.spellWhileParole)) && (!enemy.silence || enemy.silence < 1)
		&& (!enemy.Enemy.noSpellDuringAttack || enemy.attackPoints < 1)
		&& (!enemy.Enemy.noSpellsWhenHarmless || !harmless)
		&& (!enemy.Enemy.noSpellsLowSP || KinkyDungeonHasStamina(1.1))
		&& (!enemy.Enemy.noSpellLeashing || KDGameData.KinkyDungeonLeashingEnemy != enemy.id || KDGameData.KinkyDungeonLeashedPlayer < 1)
		&& (!enemy.Enemy.followLeashedOnly || (KDGameData.KinkyDungeonLeashedPlayer < 1 || KDGameData.KinkyDungeonLeashingEnemy == enemy.id) || !addMoreRestraints)
		&& (KDHostile(enemy) || (!player.player && (KDHostile(player) || enemy.rage)))
		&& (enemy.aware && (KinkyDungeonTrackSneak(enemy, 0, player) || playerDist < Math.max(1.5, blindSight)))
		&& !ignore && (!moved || enemy.Enemy.castWhileMoving) && enemy.Enemy.attack.includes("Spell")
		&& KinkyDungeonCheckLOS(enemy, player, playerDist, visionRadius, false, true) && enemy.castCooldown <= 0) {
		idle = false;
		let spellchoice = null;
		let spell = null;
		let spelltarget = undefined;

		for (let tries = 0; tries < 6; tries++) {
			spelltarget = false;
			spellchoice = enemy.Enemy.spells[Math.floor(KDRandom()*enemy.Enemy.spells.length)];
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
						if ((e != enemy) && (!spell.heal || e.hp < e.Enemy.maxhp - spell.power*0.5)
							&& e.aware && !KinkyDungeonHasBuff(e.buffs, spell.name)
							&& !e.rage
							&& ((KDAllied(enemy) && KDAllied(e)) || (KDHostile(enemy) && KDHostile(e)))
							&& Math.sqrt((enemy.x - e.x)*(enemy.x - e.x) + (enemy.y - e.y)*(enemy.y - e.y)) < spell.range) {
							let allow = !spell.filterTags;
							if (spell.filterTags) {
								for (let t of spell.filterTags) {
									if (e.Enemy.tags && e.Enemy.tags.get(t)) {
										allow = true;
										break;
									}
								}
							}
							if (allow)
								nearAllies.push(e);
						}
					}
					if (nearAllies.length > 0) {
						let e = nearAllies[Math.floor(KDRandom() * nearAllies.length)];
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
			if (spell && spell.heal && spelltarget.hp >= spelltarget.Enemy.maxhp) spell = null;
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
				if (!spell.noCastMsg)
					KinkyDungeonSendTextMessage(4, TextGet("KinkyDungeonSpellCast" + spell.name).replace("EnemyName", TextGet("Name" + enemy.Enemy.name)), "white", 2);
			} else if (spell && spell.msg) {
				if (!spell.noCastMsg)
					KinkyDungeonSendTextMessage(4, TextGet("KinkyDungeonSpellCast" + spell.name).replace("EnemyName", TextGet("Name" + enemy.Enemy.name)), "white", 2);
			}

			if (spell && KinkyDungeonCastSpell(xx, yy, spell, enemy, player) == "Cast" && spell.sfx) {
				if (enemy.Enemy.suicideOnSpell) enemy.hp = 0;
				KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + spell.sfx + ".ogg");
			}

			//console.log("casted "+ spell.name);
		}
	}
	if (vibe || (enemy.Enemy.remote && playerDist < enemy.Enemy.remote)) {
		KinkyDungeonChargeRemoteVibrators(enemy.Enemy.name, enemy.Enemy.remoteAmount ? enemy.Enemy.remoteAmount : 5, vibe, vibe);
	}
	if (enemy.usingSpecial && (idle || (moved && !enemy.Enemy.attackWhileMoving)) && enemy.Enemy.specialCDonAttack) {
		enemy.specialCD = enemy.Enemy.specialCD;
	}
	if (enemy.specialCD > 0) enemy.usingSpecial = false;
	return idle;
}

// Unique ID for enemies, to prevent bullets from hitting them
// Dont want to pass object handles around in case we ever allow saving a room
function KinkyDungeonGetEnemyID() {
	if (KinkyDungeonEnemyID > 100000000) KinkyDungeonEnemyID = 0;
	return KinkyDungeonEnemyID++;
}

let KinkyDungeonEnemyID = 0;

function KinkyDungeonAttachTetherToLeasher(dist) {
	let inv = KinkyDungeonGetRestraintItem("ItemNeckRestraints");
	if (inv && KDRestraint(inv).tether) {
		inv.tetherToLeasher = true;
		if (dist) inv.tetherLength = dist;
	}
}

function KinkyDungeonNoEnemy(x, y, Player) {

	if (KinkyDungeonEnemyAt(x, y)) return false;
	if (Player)
		for (let player of KinkyDungeonPlayers)
			if ((player.x == x && player.y == y)) return false;
	return true;
}

// e = potential sub
// Enemy = leader
function KinkyDungeonCanSwapWith(e, Enemy) {
	if (Enemy && Enemy.Enemy && Enemy.Enemy.ethereal && e && e.Enemy && !e.Enemy.ethereal) return false; // Ethereal enemies NEVER have seniority, this can teleport other enemies into walls
	if (Enemy && Enemy.Enemy && Enemy.Enemy.squeeze && e && e.Enemy && !e.Enemy.squeeze) return false; // Squeeze enemies NEVER have seniority, this can teleport other enemies into walls
	if (Enemy == KinkyDungeonLeashingEnemy()) return true;
	if (!e.Enemy.tags || (e.Enemy.tags.has("minor") && !Enemy.Enemy.tags.has("minor")))
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
		let seniority = Enemy ? KinkyDungeonCanSwapWith(e, Enemy) : false;
		return seniority;
	}
	if (Player)
		for (let pp of KinkyDungeonPlayers)
			if ((pp.x == x && pp.y == y)) return false;
	return true;
}

function KinkyDungeonEnemyAt(x, y) {
	for (let enemy of KinkyDungeonEntities) {
		if (enemy.x == x && enemy.y == y)
			return enemy;
	}
	return null;
}

function KinkyDungeonEnemyTryMove(enemy, Direction, delta, x, y) {
	let speedMult = KinkyDungeonGetBuffedStat(enemy.buffs, "MoveSpeed") ? KinkyDungeonMultiplicativeStat(-KinkyDungeonGetBuffedStat(enemy.buffs, "MoveSpeed")) : 1;
	if (enemy.bind > 0) enemy.movePoints += speedMult * delta/10;
	else if (enemy.slow > 0) enemy.movePoints += speedMult * delta/2;
	else enemy.movePoints += KDGameData.SleepTurns > 0 ? 4*delta * speedMult : delta * speedMult;

	let moveMult = KDBoundEffects(enemy);

	if (enemy.movePoints >= enemy.Enemy.movePoints + moveMult) {
		enemy.movePoints = 0;
		let dist = Math.abs(x - KinkyDungeonPlayerEntity.x) + Math.abs(y - KinkyDungeonPlayerEntity.y);

		if (KinkyDungeonMapGet(enemy.x, enemy.y) == 'd' && enemy.Enemy && enemy.Enemy.tags.has("closedoors")
			&& ((KDRandom() < 0.8 && dist > 5) ||
				(KinkyDungeonTiles.get(enemy.x + "," + enemy.y) && (KinkyDungeonTiles.get(enemy.x + "," + enemy.y).Jail || KinkyDungeonTiles.get(enemy.x + "," + enemy.y).ReLock) && (!KinkyDungeonJailGuard() || KinkyDungeonJailGuard().CurrentAction != "jailLeashTour")))) {
			KinkyDungeonMapSet(enemy.x, enemy.y, 'D');
			if (KDGameData.PrisonerState == 'jail' && KinkyDungeonTiles.get(enemy.x + "," + enemy.y) && (KinkyDungeonTiles.get(enemy.x + "," + enemy.y).Jail || KinkyDungeonTiles.get(enemy.x + "," + enemy.y).ReLock)
				&& (!KinkyDungeonJailGuard() || KinkyDungeonJailGuard().CurrentAction != "jailLeashTour")) {
				KinkyDungeonTiles.get(enemy.x + "," + enemy.y).Lock = "Red";
			}
			if (dist < 10) {
				KinkyDungeonSendTextMessage(2, TextGet("KinkyDungeonHearDoorCloseNear"), "#dddddd", 4);
			} else if (dist < 20)
				KinkyDungeonSendTextMessage(1, TextGet("KinkyDungeonHearDoorCloseFar"), "#999999", 4);
		}

		let ee = KinkyDungeonEnemyAt(enemy.x + Direction.x, enemy.y + Direction.y);
		if (ee && KinkyDungeonCanSwapWith(ee, enemy)) {
			ee.x = enemy.x;
			ee.y = enemy.y;
			ee.warningTiles = [];
			ee.movePoints = 0;
			ee.stun = 1;
		}
		enemy.x += Direction.x;
		enemy.y += Direction.y;

		if (KinkyDungeonMapGet(x, y) == 'D' && enemy.Enemy && enemy.Enemy.tags.has("opendoors")) {
			KinkyDungeonMapSet(x, y, 'd');
			if (KinkyDungeonTiles.get(x + ',' +y) && KinkyDungeonTiles.get(x + ',' +y).Type == "Door")
				KinkyDungeonTiles.get(x + ',' +y).Lock = undefined;
			if (dist < 5) {
				KinkyDungeonSendTextMessage(2, TextGet("KinkyDungeonHearDoorOpenNear"), "#dddddd", 4);
			} else if (dist < 15)
				KinkyDungeonSendTextMessage(1, TextGet("KinkyDungeonHearDoorOpenFar"), "#999999", 4);
		}

		return true;
	}
	return false;
}

function KinkyDungeonEnemyTryAttack(enemy, player, Tiles, delta, x, y, points, replace, msgColor, usingSpecial, refreshWarningTiles, attack, MovableTiles) {
	if (!enemy.Enemy.noCancelAttack && !refreshWarningTiles && points > 1) {
		let playerIn = false;
		for (let T = 0; T < Tiles.length; T++) {
			let ax = enemy.x + Tiles[T].x;
			let ay = enemy.y + Tiles[T].y;

			if (player.x == ax && player.y == ay && (!enemy.Enemy.strictAttackLOS || KinkyDungeonCheckProjectileClearance(enemy.x, enemy.y, player.x, player.y))) {
				playerIn = true;
				break;
			}
		}

		if (!playerIn && Tiles.length > 0) {
			if (enemy.Enemy.specialRange && enemy.usingSpecial && enemy.Enemy.specialCDonAttack) {
				enemy.specialCD = enemy.Enemy.specialCD;
				enemy.attackPoints = 0;
				enemy.warningTiles = [];
				enemy.usingSpecial = false;
				if (enemy.Enemy.stunOnSpecialCD) enemy.stun = enemy.Enemy.stunOnSpecialCD;
				if (attack.includes("Dash") && enemy.Enemy.dashOnMiss) {
					KDDash(enemy, player, MovableTiles);
				}
				return false;
			}
			if (enemy.Enemy.specialWidth && enemy.usingSpecial && enemy.Enemy.specialCDonAttack) {
				enemy.specialCD = enemy.Enemy.specialCD;
				enemy.attackPoints = 0;
				enemy.warningTiles = [];
				enemy.usingSpecial = false;
				if (enemy.Enemy.stunOnSpecialCD) enemy.stun = enemy.Enemy.stunOnSpecialCD;
				if (attack.includes("Dash") && enemy.Enemy.dashOnMiss) {
					KDDash(enemy, player, MovableTiles);
				}
				return false;
			}
		}
	}

	enemy.attackPoints += delta;

	if (enemy.attackPoints >= points) {
		enemy.attackPoints = 0;
		return true;
	}
	return false;
}

function KinkyDungeonGetWarningTilesAdj() {
	let arr = [];

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

	let arr = [];
	/*
	let cone = 0.78539816 * (width-0.9)/2;
	let angle_player = Math.atan2(dx, dy) + ((width % 2 == 0) ? ((KDRandom() > 0.5) ? -0.39269908 : 39269908) : 0);
	if (angle_player > Math.PI) angle_player -= Math.PI;
	if (angle_player < -Math.PI) angle_player += Math.PI;

	for (let X = -range; X <= range; X++)
		for (let Y = -range; Y <= range; Y++) {
			let angle = Math.atan2(X, Y);

			let angleDiff = angle - angle_player;
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
		&& (ignoreLocks || !KinkyDungeonTiles.get((xx) + "," + (yy)) || !KinkyDungeonTiles.get((xx) + "," + (yy)).Lock)
		&& KinkyDungeonNoEnemyExceptSub(xx, yy, true, enemy);
}

function KinkyDungeonFindID(id) {
	for (let e of KinkyDungeonEntities) {
		if (e.id == id) return e;
	}
	return null;
}

function KDDash(enemy, player, MovableTiles) {
	let happened = 0;
	let Dash = false;
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
		let tile = tiles[Math.floor(KDRandom()*tiles.length)];
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
		if (tile && (tile.x != player.x || tile.y != player.y) && (tile.x != KinkyDungeonPlayerEntity.x || tile.y != KinkyDungeonPlayerEntity.y) && MovableTiles.includes(KinkyDungeonMapGet(tile.x, tile.y))) {
			Dash = true;
			enemy.x = tile.x;
			enemy.y = tile.y;
			enemy.path = undefined;
			happened += 1;
			if (enemy.usingSpecial && enemy.Enemy.specialAttack && enemy.Enemy.specialAttack.includes("Dash")) {
				enemy.specialCD = enemy.Enemy.specialCD;
			}
		}
	}
	return {happened: happened, Dash: Dash};
}
