"use strict";
var KinkyDungeonKilledEnemy = null;
let KinkyDungeonAlert = 0;

var KinkyDungeonMissChancePerBlind = 0.15; // Max 3
var KinkyDungeonMissChancePerSlow = 0.25; // Max 3
var KinkyDungeonBullets = []; // Bullets on the game board
var KinkyDungeonBulletsID = {}; // Bullets on the game board

var KinkyDungeonOpenObjects = KinkyDungeonTransparentObjects; // Objects bullets can pass thru
var KinkyDungeonMeleeDamageTypes = ["unarmed", "crush", "slash", "pierce", "grope", "pain", "chain", "tickle"];

// Weapons
var KinkyDungeonPlayerWeapon = null;
var KinkyDungeonPlayerDamageDefault = {dmg: 2, chance: 0.8, type: "unarmed", unarmed: true, sfx: "Unarmed"};
var KinkyDungeonPlayerDamage = KinkyDungeonPlayerDamageDefault;
var KinkyDungeonWeapons = {
	"Knife": {name: "Knife", dmg: 2.5, chance: 0.8, type: "unarmed", unarmed: false, rarity: 0, shop: false, noequip: true, sfx: "Unarmed"},
	"Sword": {name: "Sword", dmg: 3, chance: 1.1, type: "slash", unarmed: false, rarity: 2, shop: true, cutBonus: 0.1, sfx: "LightSwing"},
	"MagicSword": {name: "MagicSword", dmg: 3, chance: 2, type: "slash", unarmed: false, rarity: 4, shop: false, magic: true, cutBonus: 0.2, sfx: "LightSwing"},
	"Axe": {name: "Axe", dmg: 4, chance: 0.75, type: "slash", unarmed: false, rarity: 2, shop: true, sfx: "HeavySwing"},
	"Hammer": {name: "Hammer", dmg: 5, chance: 0.6, type: "crush", unarmed: false, rarity: 2, shop: true, sfx: "HeavySwing"},
	"BoltCutters": {name: "BoltCutters", dmg: 3, chance: 1.0, type: "crush", unarmed: false, rarity: 3, shop: false, cutBonus: 0.3, sfx: "Unarmed"},
};

function KinkyDungeonFindWeapon(Name) {
	for (let con of Object.values(KinkyDungeonWeapons)) {
		if (con.name == Name) return con;
	}
	return undefined;
}

function KinkyDungeonWeaponCanCut(RequireInteract) {
	if (KinkyDungeonPlayerWeapon && KinkyDungeonWeapons[KinkyDungeonPlayerWeapon].cutBonus > 0 && (!RequireInteract || KinkyDungeonPlayer.CanInteract())) return true;
	return false;
}

function KinkyDungeonGetPlayerWeaponDamage(HandsFree) {
	let damage = KinkyDungeonPlayerDamageDefault;
	// @ts-ignore
	KinkyDungeonPlayerDamage = {};
	if (!HandsFree || (KinkyDungeonNormalBlades + KinkyDungeonEnchantedBlades < 1 && !KinkyDungeonPlayerWeapon)) { damage = KinkyDungeonPlayerDamageDefault;}
	else if (KinkyDungeonNormalBlades + KinkyDungeonEnchantedBlades >= 1 && !KinkyDungeonPlayerWeapon) damage = KinkyDungeonWeapons.Knife;
	else if (KinkyDungeonPlayerWeapon && KinkyDungeonWeapons[KinkyDungeonPlayerWeapon]) damage = KinkyDungeonWeapons[KinkyDungeonPlayerWeapon];

	Object.assign(KinkyDungeonPlayerDamage, damage);
	return KinkyDungeonPlayerDamage;
}

function KinkyDungeonGetEvasion(Enemy) {
	var hitChance = (Enemy && Enemy.buffs) ? KinkyDungeonMultiplicativeStat(KinkyDungeonGetBuffedStat(Enemy.buffs, "Evasion")) : 1.0;
	if (Enemy && Enemy.Enemy && Enemy.Enemy.evasion && (((!Enemy.stun || Enemy.stun < 1) && (!Enemy.freeze || Enemy.freeze < 1)) || Enemy.Enemy.alwaysEvade || Enemy.Enemy.evasion < 0)) hitChance *= Math.max(0, KinkyDungeonMultiplicativeStat(Enemy.Enemy.evasion));
	if (Enemy && Enemy.Enemy && Enemy.Enemy.tags.includes("ghost") && KinkyDungeonPlayerWeapon && KinkyDungeonPlayerWeapon.magic) hitChance = Math.max(hitChance, 1.0);
	hitChance *= KinkyDungeonPlayerDamage.chance;
	if (Enemy && Enemy.slow > 0) hitChance *= 2;
	if (Enemy && (Enemy.stun > 0 || Enemy.freeze > 0)) hitChance *= 5;
	if (Enemy && Enemy.bind > 0) hitChance *= 3;

	hitChance = Math.min(hitChance, Math.max(0.1, hitChance - Math.min(3, KinkyDungeonPlayer.GetBlindLevel()) * KinkyDungeonMissChancePerBlind));
	if (KinkyDungeonPlayer.IsDeaf()) hitChance *= 0.67;
	if (KinkyDungeonPlayerDamage && !KinkyDungeonPlayerDamage.name && KinkyDungeonSlowLevel > 0) hitChance *= 1.0 - Math.max(0.5, KinkyDungeonMissChancePerSlow * KinkyDungeonSlowLevel);

	return hitChance;
}

function KinkyDungeonEvasion(Enemy) {
	let hitChance = KinkyDungeonGetEvasion(Enemy);

	if (!Enemy) KinkyDungeonSleepTime = 0;

	if (Math.random() < hitChance) return true;

	return false;
}

function KinkyDungeonGetImmunity(tags, type, resist) {
	if (tags && tags.includes(type + resist)
		|| (KinkyDungeonMeleeDamageTypes.includes(type) && tags.includes("melee" + resist))
		|| (!KinkyDungeonMeleeDamageTypes.includes(type) && tags.includes("magic"+resist)))
		return true;
	return false;
}

function KinkyDungeonDamageEnemy(Enemy, Damage, Ranged, NoMsg, Spell, bullet, attacker) {
	if (bullet) {
		if (!bullet.alreadyHit) bullet.alreadyHit = [];
		// A bullet can only damage an enemy once per turn
		if (bullet.alreadyHit.includes(Enemy.id)) return 0;
		bullet.alreadyHit.push(Enemy.id);
	}

	let dmg = (Damage) ? Damage.damage : 0;
	if (!dmg) dmg = 0;
	//let type = (Damage) ? Damage.type : "";
	let effect = false;
	let resistStun = 0;
	let resistSlow = 0;
	let resistDamage = 0;
	let dmgDealt = 0;
	let spellResist = KinkyDungeonMultiplicativeStat(KinkyDungeonGetBuffedStat(Enemy.buffs, "SpellResist"));
	let armor = (Damage && Enemy.Enemy.armor && KinkyDungeonMeleeDamageTypes.includes(Damage.type)) ? Enemy.Enemy.armor : 0;
	if (KinkyDungeonGetBuffedStat(Enemy.buffs, "Armor")) armor += KinkyDungeonGetBuffedStat(Enemy.buffs, "Armor");

	if (Enemy.freeze > 0 && Damage && KinkyDungeonMeleeDamageTypes.includes(Damage.type)) {
		dmg *= 2;
	}

	if (Damage) {
		let time = Damage.time ? Damage.time : 0;
		if (spellResist && !KinkyDungeonMeleeDamageTypes.includes(Damage.type)) {
			if (time)
				time = Math.max(0, Math.ceil(time * spellResist));
			dmg = Math.max(0, Math.ceil(dmg * spellResist));
		}

		if (Enemy.Enemy.tags) {
			if (KinkyDungeonGetImmunity(Enemy.Enemy.tags, Damage.type, "immune")) resistDamage = 2;
			else if (KinkyDungeonGetImmunity(Enemy.Enemy.tags, Damage.type, "resist")) resistDamage = 1;
			else if (KinkyDungeonGetImmunity(Enemy.Enemy.tags, Damage.type, "weakness")) resistDamage = -1;
			else if (KinkyDungeonGetImmunity(Enemy.Enemy.tags, Damage.type, "severeweakness")) resistDamage = -2;
			if (Enemy.Enemy.tags.includes("unstoppable")) resistStun = 2;
			else if (Enemy.Enemy.tags.includes("unflinching")) resistStun = 1;
			if (Enemy.Enemy.tags.includes("unslowable")) resistSlow = 2;
			else if (Enemy.Enemy.tags.includes("slowresist")) resistSlow = 1;

		}

		if (Damage.type != "inert" && resistDamage < 2) {
			if (resistDamage == 1 || (resistStun > 0 && Damage.type == "stun")) {
				dmgDealt = Math.max(dmg - armor, 0); // Armor goes before resistance
				dmgDealt = Math.max(1, dmgDealt-1); // Enemies that resist the damage type can only take 1 damage, and if they would take 1 damage it deals 0 damage instead
			} else if (resistDamage == -1) {
				dmgDealt = Math.max(dmg+1, Math.floor(dmg*1.5)); // Enemies that are vulnerable take either dmg+1 or 1.5x damage, whichever is greater
				dmgDealt = Math.max(dmgDealt - armor, 0); // Armor comes after vulnerability
			} else if (resistDamage == -2) {
				dmgDealt = Math.max(dmg+1, Math.floor(dmg*2)); // Enemies that are severely vulnerable take either dmg+1 or 2x damage, whichever is greater
				dmgDealt = Math.max(dmgDealt - armor, 0); // Armor comes after vulnerability
			} else {
				dmgDealt = Math.max(dmg - armor, 0);
			}

			if (Enemy.freeze > 0 && KinkyDungeonMeleeDamageTypes.includes(Damage.type)) {
				Enemy.freeze = 0;
			}

			if (Enemy.Enemy.tags && Enemy.Enemy.tags.includes("playerinstakill") && attacker && attacker.player) dmgDealt = Enemy.hp;

			if (Spell && Spell.hitsfx) KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + Spell.hitsfx + ".ogg");
			else if (dmgDealt > 0 && bullet) KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/DealDamage.ogg");
			KinkyDungeonSendFloater(Enemy, Math.min(dmgDealt, Enemy.hp)*10, "#ff4444");
			Enemy.hp -= dmgDealt;
			if (dmgDealt > 0) Enemy.revealed = true;
		}
		if ((resistStun < 2 && resistDamage < 2) && (Damage.type == "stun" || Damage.type == "electric")) { // Being immune to the damage stops the stun as well
			effect = true;
			if (!Enemy.stun) Enemy.stun = 0;
			if (resistStun == 1)
				Enemy.stun = Math.max(Enemy.stun, Math.min(Math.floor(time/2), time-1)); // Enemies with stun resistance have stuns reduced to 1/2, and anything that stuns them for one turn doesn't affect them
			else Enemy.stun = Math.max(Enemy.stun, time);
		}
		if ((resistDamage < 2) && (Damage.type == "ice")) { // Being immune to the damage stops the stun as well
			effect = true;
			if (!Enemy.freeze) Enemy.freeze = 0;
			if (resistDamage == 1)
				Enemy.freeze = Math.max(Enemy.freeze, Math.min(Math.floor(time/2), time-1)); // Enemies with ice resistance have freeze reduced to 1/2, and anything that freezes them for one turn doesn't affect them
			else Enemy.freeze = Math.max(Enemy.freeze, time);
		}
		if ((resistDamage < 2) && (Damage.type == "chain" || Damage.type == "glue")) { // Being immune to the damage stops the bind
			effect = true;
			if (!Enemy.bind) Enemy.bind = 0;
			if (resistDamage == 1)
				Enemy.bind = Math.max(Enemy.bind, Math.min(Math.floor(time/2), time-1)); // Enemies with resistance have bind reduced to 1/2, and anything that binds them for one turn doesn't affect them
			else Enemy.bind = Math.max(Enemy.bind, time);
		}
		if ((resistSlow < 2 && resistDamage < 2) && (Damage.type == "slow" || Damage.type == "cold" || Damage.type == "poison")) { // Being immune to the damage stops the stun as well
			effect = true;
			if (!Enemy.slow) Enemy.slow = 0;
			if (resistSlow == 1)
				Enemy.slow = Math.max(Enemy.slow, Math.min(Math.floor(time/2), time-1)); // Enemies with stun resistance have stuns reduced to 1/2, and anything that stuns them for one turn doesn't affect them
			else Enemy.slow = Math.max(Enemy.slow, time);
		}
	}

	var atkname = (Spell) ? TextGet("KinkyDungeonSpell" + Spell.name) : TextGet("KinkyDungeonBasicAttack");

	if (Enemy.hp <= 0) {
		KinkyDungeonKilledEnemy = Enemy;
	}

	if (!NoMsg && (dmgDealt > 0 || !Spell || effect)) KinkyDungeonSendActionMessage(4, (Damage && dmgDealt > 0) ?
		TextGet((Ranged) ? "PlayerRanged" : "PlayerAttack").replace("TargetEnemy", TextGet("Name" + Enemy.Enemy.name)).replace("AttackName", atkname).replace("DamageDealt", "" + (dmgDealt * 10))
		: TextGet("PlayerMiss" + ((Damage) ? "Armor" : "")).replace("TargetEnemy", TextGet("Name" + Enemy.Enemy.name)),
			(Damage && (dmg > 0 || effect)) ? "orange" : "red", 2);

	if (Enemy && Enemy.Enemy && Enemy.Enemy.AI == "ambush" && Spell) {
		Enemy.ambushtrigger = true;
	}

	if (dmg > 0 && Enemy.Enemy.tags && Enemy.Enemy.tags.includes("jailer")) KinkyDungeonJailTransgressed = true;
	return dmg;
}

function KinkyDungeonAttackEnemy(Enemy, Damage) {
	let eva = KinkyDungeonEvasion(Enemy);
	let dmg = Damage;
	let buffdmg = KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "AttackDmg");
	if (buffdmg) dmg.damage = Math.max(0, dmg.damage + buffdmg);
	KinkyDungeonDamageEnemy(Enemy, (eva) ? dmg : null, undefined, undefined, undefined, undefined, KinkyDungeonPlayerEntity);
	if (eva && KinkyDungeonPlayerDamage && KinkyDungeonPlayerDamage.sfx) {
		AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/" + KinkyDungeonPlayerDamage.sfx + ".ogg");
	} else if (!eva) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Miss.ogg");
	KinkyDungeonAlert = 5;
}

function KinkyDungeonUpdateBullets(delta) {
	for (let E = 0; E < KinkyDungeonBullets.length; E++) {
		let b = KinkyDungeonBullets[E];
		let d = delta;
		let first = true;

		while (d > 0.1) {
			if (!first && delta > 0) {
				let dt = (d - Math.max(0, d - 1))/Math.sqrt(Math.max(1, b.vx*b.vx+b.vy*b.vy));
				if (b.born >= 0) b.born -= 1;

				let mod = (b.spell && b.spell.speed == 1) ? 1 : 0;
				if (b.born < mod) {
					b.xx += b.vx * dt;
					b.yy += b.vy * dt;
					b.time -= delta;
				}

				if (b.bullet.spell && b.trail && (b.x != Math.round(b.XX) || b.y != Math.round(b.yy)))
					KinkyDungeonBulletTrail(b);

				b.x = Math.round(b.xx);
				b.y = Math.round(b.yy);

				d -= dt;
			} else first = false;

			let outOfRange = false;
			let endTime = false;
			if (b.bullet && b.bullet.origin) {
				let dist = Math.sqrt((b.bullet.origin.x - b.x) * (b.bullet.origin.x - b.x) + (b.bullet.origin.y - b.y) * (b.bullet.origin.y - b.y));
				if (dist > b.bullet.range) outOfRange = true;
				if (dist >= b.bullet.range) endTime = true;
			}
			let outOfTime = (b.bullet.lifetime != 0 && b.time <= 0.001);
			if (!KinkyDungeonBulletsCheckCollision(b) || outOfTime || outOfRange) {
				if (!(b.bullet.spell && ((!b.bullet.trail && b.bullet.spell.piercing) || (b.bullet.trail && b.bullet.spell.piercingTrail))) || outOfRange || outOfTime) {
					d = 0;
					KinkyDungeonBullets.splice(E, 1);
					KinkyDungeonBulletsID[b.spriteID] = null;
					E -= 1;
				}
				if (!((outOfTime || outOfRange) && b.bullet.spell && ((!b.bullet.trail && b.bullet.spell.nonVolatile) || (b.bullet.trail && b.bullet.spell.nonVolatileTrail))))
					KinkyDungeonBulletHit(b, 1.1);
			}
			if (endTime) b.time = 0;
		}
		// A bullet can only damage an enemy in one location at a time
		// Resets at the end of the bullet update!
		// But only for piercing bullets. Non-piercing bullets just expire
		if (!b.bullet.piercing && !b.bullet.noDoubleHit)
			b.alreadyHit = undefined;
	}
}

let KinkyDungeonCurrentTick = 0;

function KinkyDungeonUpdateBulletsCollisions(delta, Catchup) {
	for (let E = 0; E < KinkyDungeonBullets.length; E++) {
		var b = KinkyDungeonBullets[E];
		if ((!Catchup && !b.secondary) || (Catchup && b.secondary)) {
			if (!KinkyDungeonBulletsCheckCollision(b, b.time >= 0)) {
				if (!(b.bullet.spell && b.bullet.spell.piercing)) {
					KinkyDungeonBullets.splice(E, 1);
					KinkyDungeonBulletsID[b.spriteID] = null;
					E -= 1;
				}
				KinkyDungeonBulletHit(b, 1);
			}
		}
	}
}

function KinkyDungeonBulletHit(b, born) {
	if (b.bullet.hit && b.bullet.spell && b.bullet.spell.landsfx) KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + b.bullet.spell.landsfx + ".ogg");

	if (b.bullet.cast) {
		let xx = b.bullet.cast.tx;
		let yy = b.bullet.cast.ty;
		if (!xx) xx = b.x;
		if (!yy) yy = b.y;
		KinkyDungeonCastSpell(xx, yy, KinkyDungeonFindSpell(b.bullet.cast.spell, true), undefined, undefined, b);
	}

	if (b.bullet.hit == "") {
		KinkyDungeonBullets.push({born: born, time:1, x:b.x, y:b.y, vx:0, vy:0, xx:b.x, yy:b.y, spriteID:b.bullet.name+"Hit" + CommonTime(), bullet:{lifetime: 1, passthrough:true, name:b.bullet.name+"Hit", width:b.bullet.width, height:b.bullet.height}});
	} else if (b.bullet.hit == "aoe") {
		KinkyDungeonBullets.push({secondary: true, born: born, time:b.bullet.spell.lifetime, x:b.x, y:b.y, vx:0, vy:0, xx:b.x, yy:b.y, spriteID:b.bullet.name+"Hit" + CommonTime(),
			bullet:{spell:b.bullet.spell, damage: {damage:(b.bullet.spell.aoedamage) ? b.bullet.spell.aoedamage : b.bullet.spell.power, type:b.bullet.spell.damage, time:b.bullet.spell.time}, aoe: b.bullet.spell.aoe, lifetime: b.bullet.spell.lifetime, passthrough:true, name:b.bullet.name+"Hit", width:b.bullet.width, height:b.bullet.height}});
	} else if (b.bullet.hit == "lingering") {
		let rad = (b.bullet.spell.aoe) ? b.bullet.spell.aoe : 0;
		for (let X = -Math.ceil(rad); X <= Math.ceil(rad); X++)
			for (let Y = -Math.ceil(rad); Y <= Math.ceil(rad); Y++) {
				if (Math.sqrt(X*X+Y*Y) <= rad) {
					let LifetimeBonus = (b.bullet.spell.lifetimeHitBonus) ? Math.floor(Math.random() * b.bullet.spell.lifetimeHitBonus) : 0;
					KinkyDungeonBullets.push({born: born, time:b.bullet.spell.lifetime + LifetimeBonus, x:b.x+X, y:b.y+Y, vx:0, vy:0, xx:b.x+X, yy:b.y+Y, spriteID:b.bullet.name+"Hit" + CommonTime(),
						bullet:{spell:b.bullet.spell, block: (b.bullet.blockhit ? b.bullet.blockhit : 0), damage: {damage:b.bullet.spell.power, type:b.bullet.spell.damage, time:b.bullet.spell.time}, lifetime: b.bullet.spell.lifetime + LifetimeBonus, name:b.bullet.name+"Hit", width:1, height:1}});
				}
			}

	} else if (b.bullet.hit == "teleport") {
		KinkyDungeonBullets.push({born: born, time:b.bullet.spell.lifetime, x:b.x, y:b.y, vx:0, vy:0, xx:b.x, yy:b.y, spriteID:b.bullet.name+"Hit" + CommonTime(),
			bullet:{spell:b.bullet.spell, damage: {damage:(b.bullet.spell.aoedamage) ? b.bullet.spell.aoedamage : b.bullet.spell.power, type:b.bullet.spell.damage, time:b.bullet.spell.time}, aoe: b.bullet.spell.aoe, lifetime: b.bullet.spell.lifetime, passthrough:true, name:b.bullet.name+"Hit", width:b.bullet.width, height:b.bullet.height}});
		KinkyDungeonMoveTo(b.x, b.y);
	}

	if (b.bullet.summon && b.bullet.summon) {
		let created = 0;
		let type = "";
		for (let sum of b.bullet.summon) {
			let summonType = sum.name; // Second operand is the enemy type
			if (!type) type = summonType;
			let count = sum.count ? sum.count : 1;
			let rad = (b.bullet.spell.aoe) ? b.bullet.spell.aoe : 0;
			if (count > 0)
				created += KinkyDungeonSummonEnemy(b.x, b.y, summonType, count, rad, false, sum.time ? sum.time : undefined);
		}
		if (created == 1) KinkyDungeonSendTextMessage(6, TextGet("KinkyDungeonSummonSingle"+type), "white", 2);
		else if (created > 1) KinkyDungeonSendTextMessage(8, TextGet("KinkyDungeonSummonMulti"+type).replace("SummonCount", "" + created), "white", 3);
	}
}


function KinkyDungeonSummonEnemy(x, y, summonType, count, rad, strict, lifetime) {
	let slots = [];
	for (let X = -Math.ceil(rad); X <= Math.ceil(rad); X++)
		for (let Y = -Math.ceil(rad); Y <= Math.ceil(rad); Y++) {
			if (Math.sqrt(X*X+Y*Y) <= rad) {
				slots.push({x:X, y:Y});
			}
		}

	let created = 0;
	let maxcounter = 0;
	let Enemy = KinkyDungeonEnemies.find(element => element.name == summonType);
	for (let C = 0; C < count && KinkyDungeonEntities.length < 100 && maxcounter < count * 30; C++) {
		let slot = slots[Math.floor(Math.random() * slots.length)];
		if (KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(x+slot.x, y+slot.y)) && (KinkyDungeonNoEnemy(x+slot.x, y+slot.y, true) || Enemy.noblockplayer) && (!strict || KinkyDungeonCheckPath(x, y, x+slot.x, y+slot.y, false))) {
			KinkyDungeonEntities.push({summoned: true, Enemy: Enemy, id: KinkyDungeonGetEnemyID(),
				x:x+slot.x, y:y+slot.y, hp: (Enemy.startinghp) ? Enemy.startinghp : Enemy.maxhp, movePoints: 0, attackPoints: 0, lifetime: lifetime, maxlifetime: lifetime});
			created += 1;
		} else C -= 1;
		maxcounter += 1;
	}
	return created;
}

function KinkyDungeonBulletTrail(b) {
	if (b.bullet.spell.trail == "lingering" && !b.bullet.trail) {
		let aoe = b.bullet.spell.trailspawnaoe ? b.bullet.spell.trailspawnaoe : 0.0;
		let rad = Math.ceil(aoe/2);
		for (let X = -Math.ceil(rad); X <= Math.ceil(rad); X++)
			for (let Y = -Math.ceil(rad); Y <= Math.ceil(rad); Y++) {
				if (Math.sqrt(X*X+Y*Y) <= aoe && Math.random() < b.bullet.spell.trailChance) {
					KinkyDungeonBullets.push({born: 0, time:b.bullet.spell.trailLifetime + (b.bullet.spell.trailLifetimeBonus ? Math.floor(Math.random() * b.bullet.spell.trailLifetimeBonus) : 0), x:b.x + X, y:b.y + Y, vx:0, vy:0, xx:b.x + X, yy:b.y + Y, spriteID:b.bullet.name+"Trail" + CommonTime(),
						bullet:{trail: true, hit: b.bullet.spell.trailHit, spell:b.bullet.spell, playerEffect:b.bullet.spell.trailPlayerEffect, damage: {damage:b.bullet.spell.trailPower, type:b.bullet.spell.trailDamage, time:b.bullet.spell.trailTime}, lifetime: b.bullet.spell.trailLifetime, name:b.bullet.name+"Trail", width:1, height:1}});
				}
			}
	}
}

function KinkyDungeonBulletsCheckCollision(bullet, AoE) {
	var mapItem = KinkyDungeonMapGet(bullet.x, bullet.y);
	if (!bullet.bullet.passthrough && !KinkyDungeonOpenObjects.includes(mapItem)) return false;
	if (bullet.bullet.noEnemyCollision) return true;

	if (bullet.bullet.damage && bullet.time > 0) {
		if (bullet.bullet.aoe) {
			if (AoE) {
				if (bullet.bullet.spell && (bullet.bullet.spell.playerEffect || bullet.bullet.playerEffect) && bullet.bullet.aoe >= Math.sqrt((KinkyDungeonPlayerEntity.x - bullet.x) * (KinkyDungeonPlayerEntity.x - bullet.x) + (KinkyDungeonPlayerEntity.y - bullet.y) * (KinkyDungeonPlayerEntity.y - bullet.y))) {
					KinkyDungeonPlayerEffect(bullet.bullet.damage.type, bullet.bullet.playerEffect ? bullet.bullet.playerEffect : bullet.bullet.spell.playerEffect, bullet.bullet.spell);
				}
				var nomsg = false;
				for (let L = 0; L < KinkyDungeonEntities.length; L++) {
					let enemy = KinkyDungeonEntities[L];
					if ((!bullet.bullet.spell || (!bullet.bullet.spell.enemySpell && !enemy.Enemy.allied) || (!bullet.bullet.spell.allySpell && enemy.Enemy.allied)) && bullet.bullet.aoe >= Math.sqrt((enemy.x - bullet.x) * (enemy.x - bullet.x) + (enemy.y - bullet.y) * (enemy.y - bullet.y))) {
						KinkyDungeonDamageEnemy(enemy, bullet.bullet.damage, true, nomsg, bullet.bullet.spell, bullet);
						nomsg = true;
					}
				}
			}
		} else {
			if (bullet.bullet.spell && (bullet.bullet.spell.playerEffect || bullet.bullet.playerEffect) && KinkyDungeonPlayerEntity.x == bullet.x && KinkyDungeonPlayerEntity.y == bullet.y) {
				KinkyDungeonPlayerEffect(bullet.bullet.damage.type, bullet.bullet.playerEffect ? bullet.bullet.playerEffect : bullet.bullet.spell.playerEffect, bullet.bullet.spell);
				return false;
			}
			for (let L = 0; L < KinkyDungeonEntities.length; L++) {
				let enemy = KinkyDungeonEntities[L];
				if ((!bullet.bullet.spell || (!bullet.bullet.spell.enemySpell && !enemy.Enemy.allied) || (!bullet.bullet.spell.allySpell && enemy.Enemy.allied)) && enemy.x == bullet.x && enemy.y == bullet.y) {
					KinkyDungeonDamageEnemy(enemy, bullet.bullet.damage, true, bullet.bullet.NoMsg, bullet.bullet.spell, bullet);

					return false;
				}
			}
		}
	}
	if (!(bullet.bullet.block > 0) && bullet.vx != 0 || bullet.vy != 0) {

		for (let E = 0; E < KinkyDungeonBullets.length; E++) {
			let b2 = KinkyDungeonBullets[E];
			if (b2 != bullet && b2.bullet.block > 0 && b2.x == bullet.x && b2.y == bullet.y) {
				b2.bullet.block -= bullet.bullet.damage.damage;
				if (b2.bullet.block <= 0) b2.bullet.block = -1;

				return false;
			}
		}
	} else if (bullet.bullet.block == -1) return false; // Shields expire

	if (bullet.bullet.lifetime == -1) return false; // Instant spells

	return true;
}


function KinkyDungeonLaunchBullet(x, y, targetx, targety, speed, bullet, miscast) {
	var direction = Math.atan2(targety, targetx);
	var vx = Math.cos(direction) * speed;
	var vy = Math.sin(direction) * speed;
	var lifetime = bullet.lifetime;
	if (miscast) {
		vx = 0;
		vy = 0;
		//lifetime = 1;
	}
	let b = {born: 1, time:lifetime, x:x, y:y, vx:vx, vy:vy, xx:x, yy:y, spriteID:bullet.name + CommonTime(), bullet:bullet, trail:bullet.spell.trail};
	KinkyDungeonBullets.push(b);
	return b;
}

function KinkyDungeonDrawFight(canvasOffsetX, canvasOffsetY, CamX, CamY) {
	for (let E = 0; E < KinkyDungeonBullets.length; E++) {
		var bullet = KinkyDungeonBullets[E].bullet;
		var sprite = bullet.name;
		var spriteCanvas = KinkyDungeonBulletsID[KinkyDungeonBullets[E].spriteID];
		if (!spriteCanvas) {
			spriteCanvas = document.createElement("canvas");
			spriteCanvas.width = bullet.width*KinkyDungeonSpriteSize;
			spriteCanvas.height = bullet.height*KinkyDungeonSpriteSize;
			KinkyDungeonBulletsID[KinkyDungeonBullets[E].spriteID] = spriteCanvas;

		}

		var Img = DrawGetImage(KinkyDungeonRootDirectory + "Bullets/" + sprite + ".png");

		var spriteContext = spriteCanvas.getContext("2d");
		var direction = Math.atan2(KinkyDungeonBullets[E].vy, KinkyDungeonBullets[E].vx);

		// Rotate the canvas m,
		spriteContext.translate(spriteCanvas.width/2, spriteCanvas.height/2);
		spriteContext.rotate(direction);
		spriteContext.translate(-spriteCanvas.width/2, -spriteCanvas.height/2);

		// Draw the sprite
		spriteContext.clearRect(0, 0, spriteCanvas.width, spriteCanvas.height);
		spriteContext.drawImage(Img, 0, 0);

		// Reset the transformation
		spriteContext.setTransform(1, 0, 0, 1, 0, 0);

		KinkyDungeonUpdateVisualPosition(KinkyDungeonBullets[E], KinkyDungeonDrawDelta);
		let tx = KinkyDungeonBullets[E].visual_x;
		let ty = KinkyDungeonBullets[E].visual_y;

		if (KinkyDungeonBullets[E].x >= CamX && KinkyDungeonBullets[E].y >= CamY && KinkyDungeonBullets[E].x < CamX + KinkyDungeonGridWidthDisplay && KinkyDungeonBullets[E].y < CamY + KinkyDungeonGridHeightDisplay) {
			KinkyDungeonContext.drawImage(spriteCanvas,  (tx - CamX - (bullet.width-1)/2)*KinkyDungeonGridSizeDisplay, (ty - CamY - (bullet.height-1)/2)*KinkyDungeonGridSizeDisplay);
		}
	}
}
